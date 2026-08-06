use tauri::State;

use crate::GameAssetPaths;
use crate::LauncherState;
use std::collections::{hash_map::DefaultHasher, HashSet};
use std::hash::{Hash, Hasher};
use std::path::Component;
use std::{
    env, fs,
    path::{Path, PathBuf},
};

mod bundled {
    include!(concat!(env!("OUT_DIR"), "/bundled_assets.rs"));
}

use bundled::BUNDLED_ASSETS;

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
enum RequiredAssets {
    All,
    One,
}

#[derive(Clone, Copy, Debug)]
struct AssetRule {
    path: &'static str,
    required: RequiredAssets,
}

const ASSET_RULES: &[AssetRule] = &[
    AssetRule {
        path: "revivalside",
        required: RequiredAssets::All,
    },
    AssetRule {
        path: "revivalside/bg",
        required: RequiredAssets::One,
    },
];

pub fn resolve_assets_root() -> Result<PathBuf, String> {
    let exe = env::current_exe()
        .map_err(|error| format!("Could not locate the launcher exe: {error}"))?;

    let launcher_directory = exe.parent().ok_or_else(|| {
        format!(
            "Could not locate the launcher directory for {}",
            exe.display()
        )
    })?;

    Ok(launcher_directory.join("assets"))
}

fn path_contains_file(path: &Path) -> Result<bool, String> {
    if path.is_file() {
        return Ok(true);
    }
    if !path.is_dir() {
        return Ok(false);
    }

    for entry in fs::read_dir(path).map_err(|error| {
        format!(
            "Could not read the launcher asset path at {}: {error}",
            path.display()
        )
    })? {
        let entry = entry.map_err(|error| error.to_string())?;
        let file_type = entry.file_type().map_err(|error| error.to_string())?;
        if file_type.is_file() || (file_type.is_dir() && path_contains_file(&entry.path())?) {
            return Ok(true);
        }
    }

    Ok(false)
}

fn stem_exists(directory: &Path, stem: &str) -> bool {
    let Ok(entries) = fs::read_dir(directory) else {
        return false;
    };
    entries.flatten().any(|entry| {
        entry.path().is_file() && entry.path().file_stem().and_then(|s| s.to_str()) == Some(stem)
    })
}

fn matches_rule<'a>(relative: &Path, rules: &'a [AssetRule]) -> Option<&'a AssetRule> {
    rules
        .iter()
        .filter(|rule| relative.starts_with(Path::new(rule.path)))
        .max_by_key(|rule| Path::new(rule.path).components().count())
}

pub fn restore_assets(assets_root: &Path) -> Result<(), String> {
    fs::create_dir_all(assets_root).map_err(|error| {
        format!(
            "Could not create the launcher assets directory at {}: {error}",
            assets_root.display()
        )
    })?;

    let mut satisfied_one_rules = HashSet::new();
    for rule in ASSET_RULES
        .iter()
        .filter(|rule| rule.required == RequiredAssets::One)
    {
        if path_contains_file(&assets_root.join(rule.path))? {
            satisfied_one_rules.insert(rule.path);
        }
    }

    for &(relative, contents) in BUNDLED_ASSETS {
        let relative_path = Path::new(relative);
        if matches_rule(relative_path, ASSET_RULES).is_some_and(|rule| {
            rule.required == RequiredAssets::One && satisfied_one_rules.contains(rule.path)
        }) {
            continue;
        }

        let destination = assets_root.join(relative);
        let stem = destination.file_stem().and_then(|s| s.to_str());
        if destination
            .parent()
            .zip(stem)
            .is_some_and(|(parent, stem)| stem_exists(parent, stem))
        {
            continue;
        }

        if let Some(parent) = destination.parent() {
            fs::create_dir_all(parent).map_err(|error| {
                format!(
                    "Could not create the launcher asset directory at {}: {error}",
                    parent.display()
                )
            })?;
        }

        fs::write(&destination, contents).map_err(|error| {
            format!(
                "Could not restore the launcher asset at {}: {error}",
                destination.display()
            )
        })?;
    }
    Ok(())
}

fn is_image(path: &Path) -> bool {
    path.extension()
        .and_then(|extension| extension.to_str())
        .is_some_and(|extension| {
            matches!(
                extension.to_ascii_lowercase().as_str(),
                "avif" | "jpeg" | "jpg" | "png" | "webp"
            )
        })
}

fn collect_images(directory: &Path, recursive: bool) -> Result<Vec<PathBuf>, String> {
    let mut images = Vec::new();
    if !directory.is_dir() {
        return Ok(images);
    }

    let entries = fs::read_dir(directory).map_err(|error| {
        format!(
            "Could not read the launcher asset directory at {}: {error}",
            directory.display()
        )
    })?;

    for entry in entries {
        let entry = entry.map_err(|error| error.to_string())?;
        let file_type = entry.file_type().map_err(|error| error.to_string())?;
        let path = entry.path();
        if file_type.is_file() && is_image(&path) {
            images.push(path);
        } else if recursive && file_type.is_dir() {
            images.extend(collect_images(&path, true)?);
        }
    }

    images.sort();
    Ok(images)
}

fn named_image(images: &[PathBuf], name: &str) -> Option<PathBuf> {
    images
        .iter()
        .find(|path| path.file_stem().and_then(|stem| stem.to_str()) == Some(name))
        .cloned()
}

fn display_path(path: PathBuf) -> String {
    path.to_string_lossy().into_owned()
}

fn create_revision(images: &[PathBuf]) -> String {
    let mut hasher = DefaultHasher::new();
    for image in images {
        image.hash(&mut hasher);
        if let Ok(metadata) = image.metadata() {
            metadata.len().hash(&mut hasher);
            if let Ok(modified) = metadata.modified() {
                modified.hash(&mut hasher);
            }
        }
    }
    hasher.finish().to_string()
}

fn read_game_assets(
    state: State<'_, LauncherState>,
    game_id: String,
    restore_defaults: bool,
) -> Result<GameAssetPaths, String> {
    let mut components = Path::new(&game_id).components();
    if !matches!(components.next(), Some(Component::Normal(_))) || components.next().is_some() {
        return Err(format!("Invalid game asset id: {game_id}"));
    }

    let game_root = state.assets_root.join(&game_id);
    if restore_defaults {
        restore_assets(&state.assets_root)?;
    } else {
        fs::create_dir_all(&game_root).map_err(|error| {
            format!(
                "Could not recreate the game asset directory at {}: {error}",
                game_root.display()
            )
        })?;
    }

    let root_images = collect_images(&game_root, false)?;
    let backgrounds = collect_images(&game_root.join("bg"), true)?;
    let mut all_images = root_images.clone();
    all_images.extend(backgrounds.iter().cloned());

    Ok(GameAssetPaths {
        assets_folder: display_path(game_root.clone()),
        revision: create_revision(&all_images),
        backgrounds: backgrounds.into_iter().map(display_path).collect(),
        main_background: named_image(&root_images, "main").map(display_path),
        featured_background: named_image(&root_images, "featured").map(display_path),
        favicon: named_image(&root_images, "favicon").map(display_path),
        logo: named_image(&root_images, "logo").map(display_path),
    })
}

#[tauri::command]
pub fn get_game_assets(
    state: State<'_, LauncherState>,
    game_id: String,
) -> Result<GameAssetPaths, String> {
    read_game_assets(state, game_id, true)
}

#[tauri::command]
pub fn refresh_game_assets(
    state: State<'_, LauncherState>,
    game_id: String,
) -> Result<GameAssetPaths, String> {
    read_game_assets(state, game_id, false)
}
