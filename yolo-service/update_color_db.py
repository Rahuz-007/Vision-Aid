"""
update_color_db.py
------------------
Uses the Kaggle color recognition dataset (adikurniawan/color-dataset-for-color-recognition)
to build an enriched color database.

The dataset layout:
    training_dataset/
        red/         <- color class name
            ff0000.png   <- filename is a hex color code
            ...
        blue/
            0000ff.png
            ...

This script:
1. Reads class folders and hex filenames to extract color_name + RGB
2. Merges with existing colors.csv for maximum coverage
3. Saves updated colors.csv for the YOLO service
4. Generates colorPalette.js for the React frontend

Usage:
    python update_color_db.py

Requirements:
    pip install kagglehub Pillow
"""

import os
import csv
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent
DATASET_CACHE = Path.home() / ".cache" / "kagglehub" / "datasets" / \
    "adikurniawan" / "color-dataset-for-color-recognition" / "versions" / "1"

FRONTEND_PALETTE_PATH = (
    BASE_DIR.parent
    / "front -end"
    / "vision-aid-ui"
    / "src"
    / "components"
    / "features"
    / "ColorObjectDetector"
    / "colorPalette.js"
)


def hex_to_rgb(hex_str):
    """Convert a hex string (with or without #) to (r, g, b) tuple."""
    hex_str = hex_str.lstrip("#").strip()
    if len(hex_str) == 3:
        hex_str = "".join(c * 2 for c in hex_str)
    if len(hex_str) != 6:
        return None
    try:
        return int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16)
    except ValueError:
        return None


def load_existing_csv(csv_path):
    """Load existing colors.csv -> list of dicts with name, r, g, b."""
    colors = []
    if not csv_path.exists():
        return colors
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) >= 6:
                try:
                    colors.append({
                        "name": row[1].strip().strip('"'),
                        "r": int(row[3]),
                        "g": int(row[4]),
                        "b": int(row[5]),
                    })
                except (ValueError, IndexError):
                    pass
    return colors


def extract_from_dataset(dataset_path):
    """
    Walk training_dataset/* folders.
    Each subfolder name = color class (e.g. 'red', 'navy blue').
    Each filename (without ext) that looks like a hex code = sample color.
    Returns list of {name, r, g, b}.
    """
    colors = []
    train_dir = dataset_path / "training_dataset"
    if not train_dir.exists():
        print(f"  training_dataset folder not found in {dataset_path}")
        return colors

    seen_rgb = set()

    for color_folder in sorted(train_dir.iterdir()):
        if not color_folder.is_dir():
            continue

        class_name = color_folder.name.replace("_", " ").title()

        hex_samples = []
        for img_file in color_folder.iterdir():
            stem = img_file.stem.lower()
            rgb = hex_to_rgb(stem)
            if rgb:
                key = rgb
                if key not in seen_rgb:
                    seen_rgb.add(key)
                    hex_samples.append(rgb)

        # Add all unique hex samples from this class
        for rgb in hex_samples:
            colors.append({"name": class_name, "r": rgb[0], "g": rgb[1], "b": rgb[2]})

        if not hex_samples:
            # No hex filenames — add a representative entry for this class name
            print(f"  No hex samples in '{class_name}' folder, skipping")

    return colors


def merge_colors(existing, from_dataset):
    """Merge two color lists, deduplicating by exact RGB."""
    seen = set()
    merged = []
    for c in existing + from_dataset:
        key = (c["r"], c["g"], c["b"])
        if key not in seen:
            seen.add(key)
            merged.append(c)
    return merged


def save_csv(colors, output_path):
    """Save colors list as colors.csv."""
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        for i, c in enumerate(colors):
            slug = c["name"].lower().replace(" ", "_").replace("/", "_")
            writer.writerow([slug, f'"{c["name"]}"', "#000000", c["r"], c["g"], c["b"]])
    print(f"Saved {len(colors)} colors to {output_path}")


def generate_js_palette(colors, output_path):
    """
    Generate a JS export of the color palette.
    We pick a diverse subset using a stride across hue-sorted colors.
    """
    def rgb_to_hue(c):
        r, g, b = c["r"] / 255, c["g"] / 255, c["b"] / 255
        mx, mn = max(r, g, b), min(r, g, b)
        d = mx - mn
        if d == 0:
            return 0
        if mx == r:
            return ((g - b) / d % 6) * 60
        if mx == g:
            return ((b - r) / d + 2) * 60
        return ((r - g) / d + 4) * 60

    sorted_colors = sorted(colors, key=rgb_to_hue)
    max_colors = 300
    step = max(1, len(sorted_colors) // max_colors)
    selected = sorted_colors[::step][:max_colors]

    lines = [
        "// Auto-generated by update_color_db.py",
        "// Do not edit manually - re-run the script to regenerate",
        f"// Total source colors: {len(colors)} | Palette size: {len(selected)}",
        "export const NAMED_COLORS = [",
    ]
    for c in selected:
        name = c["name"].replace("\\", "\\\\").replace("'", "\\'")
        lines.append(f"  {{ name: '{name}', r: {c['r']}, g: {c['g']}, b: {c['b']} }},")
    lines.append("];")
    lines.append("")

    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))
    print(f"Generated JS palette: {len(selected)} colors -> {output_path}")


def download_if_needed():
    """Download the Kaggle dataset if not already cached."""
    if DATASET_CACHE.exists():
        print(f"Using cached dataset: {DATASET_CACHE}")
        return DATASET_CACHE
    try:
        import kagglehub
        print("Downloading color dataset from Kaggle...")
        path = kagglehub.dataset_download("adikurniawan/color-dataset-for-color-recognition")
        print(f"Downloaded to: {path}")
        return Path(path)
    except ImportError:
        print("kagglehub not installed. Run: pip install kagglehub")
        return None
    except Exception as e:
        print(f"Download failed: {e}")
        return None


def main():
    existing_csv = BASE_DIR / "colors.csv"

    print("=== VisionAid Color Database Updater ===\n")

    # Step 1: Get dataset path
    dataset_path = download_if_needed()

    # Step 2: Load existing colors
    existing_colors = load_existing_csv(existing_csv)
    print(f"Existing colors.csv: {len(existing_colors)} entries")

    # Step 3: Extract colors from Kaggle dataset
    dataset_colors = []
    if dataset_path:
        print(f"\nExtracting colors from dataset folders...")
        dataset_colors = extract_from_dataset(dataset_path)
        print(f"Extracted from dataset: {len(dataset_colors)} color samples")

    # Step 4: Merge
    all_colors = merge_colors(existing_colors, dataset_colors)
    print(f"\nMerged total: {len(all_colors)} unique colors")

    # Step 5: Save updated colors.csv
    save_csv(all_colors, existing_csv)

    # Step 6: Generate frontend JS palette
    print("\nGenerating frontend color palette...")
    generate_js_palette(all_colors, FRONTEND_PALETTE_PATH)

    print("\nDone!")
    print(f"  colors.csv      -> {existing_csv}")
    print(f"  colorPalette.js -> {FRONTEND_PALETTE_PATH}")
    print("\nRestart the YOLO service for the updated colors.csv to take effect.")


if __name__ == "__main__":
    main()
