use std::{env, fs, path::Path};

fn collect_assets(directory: &Path, assets_root: &Path, assets: &mut Vec<String>) {
    for entry in fs::read_dir(directory).expect("failed to read bundled assets directory") {
        let entry = entry.expect("failed to read bundled asset entry");
        let path = entry.path();
        let file_type = entry
            .file_type()
            .expect("failed to read bundled asset type");

        if file_type.is_dir() {
            collect_assets(&path, assets_root, assets);
        } else if file_type.is_file() {
            let relative = path
                .strip_prefix(assets_root)
                .expect("bundled asset outside root")
                .to_string_lossy()
                .replace('\\', "/");
            assets.push(relative);
        }
    }
}

fn main() {
    let manifest_dir = env::var("CARGO_MANIFEST_DIR").expect("CARGO_MANIFEST_DIR not set");
    let assets_root = Path::new(&manifest_dir).join("../src/assets");
    let mut assets = Vec::new();

    collect_assets(&assets_root, &assets_root, &mut assets);
    assets.sort();

    let entries = assets
        .iter()
        .map(|relative| {
            format!(
                "    ({relative:?}, include_bytes!(concat!(env!(\"CARGO_MANIFEST_DIR\"), \"/../src/assets/{relative}\"))),\n"
            )
        })
        .collect::<String>();

    let generated =
        format!("pub(super) static BUNDLED_ASSETS: &[(&str, &[u8])] = &[\n{entries}];\n");
    let output =
        Path::new(&env::var("OUT_DIR").expect("OUT_DIR not set")).join("bundled_assets.rs");
    fs::write(output, generated).expect("failed to generate the bundled asset table");

    println!("cargo:rerun-if-changed={}", assets_root.display());
    tauri_build::build()
}
