use tauri::State;

use crate::GameAssetPaths;
use crate::LauncherState;
use std::collections::HashSet;
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
        if destination.is_file() {
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

#[tauri::command]
pub fn get_game_assets(
    state: State<'_, LauncherState>,
    game_id: String,
) -> Result<GameAssetPaths, String> {
    let mut components = Path::new(&game_id).components();
    if !matches!(components.next(), Some(Component::Normal(_))) || components.next().is_some() {
        return Err(format!("Invalid game asset id: {game_id}"));
    }

    restore_assets(&state.assets_root)?;

    let game_root = state.assets_root.join(&game_id);
    let root_images = collect_images(&game_root, false)?;
    let required = |name: &str| {
        named_image(&root_images, name).ok_or_else(|| {
            format!(
                "The required {name} image was not found in {}",
                game_root.display()
            )
        })
    };

    Ok(GameAssetPaths {
        assets_folder: display_path(game_root.clone()),
        backgrounds: collect_images(&game_root.join("bg"), true)?
            .into_iter()
            .map(display_path)
            .collect(),
        main_background: display_path(required("main")?),
        featured_background: named_image(&root_images, "featured").map(display_path),
        favicon: display_path(required("favicon")?),
        logo: display_path(required("logo")?),
    })
}
