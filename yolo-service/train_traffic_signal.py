"""
=============================================================================
  VisionAid — Traffic Signal YOLO Training Pipeline  (6-class with arrows)
=============================================================================

  Classes trained:
    0  red_light            — red circle
    1  yellow_light         — yellow/amber circle
    2  green_light          — plain green circle  (go)
    3  green_arrow_left     — green left  arrow  ←
    4  green_arrow_right    — green right arrow  →
    5  green_arrow_straight — green up    arrow  ↑

  Strategy:
    1. Download Kaggle dataset (raw images, no labels)
    2. Auto-detect traffic lights with pretrained YOLOv8 (COCO class 9)
    3. Classify colour via HSV → red / yellow / green
    4. For green lights: run row/column profile analysis to detect arrow shape
    5. Split → train / val / test
    6. Fine-tune YOLOv8 on the labelled data
    7. Evaluate + deploy best.pt

  USAGE  (run from yolo-service/ with venv active):
    pip install kagglehub ultralytics opencv-python tqdm scikit-learn
    python train_traffic_signal.py

  PREREQUISITES:
    Kaggle API token at  ~/.kaggle/kaggle.json
    OR env vars: KAGGLE_USERNAME  KAGGLE_KEY
=============================================================================
"""

import os, sys, shutil, json, math
from pathlib import Path

try:
    import kagglehub
    from ultralytics import YOLO
    import cv2
    import numpy as np
    from tqdm import tqdm
    from sklearn.model_selection import train_test_split
except ImportError as e:
    print(f"\n❌ Missing dependency: {e}")
    print("   Run: pip install kagglehub ultralytics opencv-python tqdm scikit-learn")
    sys.exit(1)

# ─────────────────────────────────────────────────────────────────────────────
#  Configuration
# ─────────────────────────────────────────────────────────────────────────────
BASE_DIR    = Path(__file__).parent
DATASET_DIR = BASE_DIR / "training_data"
YOLO_DIR    = DATASET_DIR / "yolo_dataset"

CLASS_NAMES = [
    "red_light",             # 0
    "yellow_light",          # 1
    "green_light",           # 2  plain circle
    "green_arrow_left",      # 3  ←
    "green_arrow_right",     # 4  →
    "green_arrow_straight",  # 5  ↑
]
NUM_CLASSES = len(CLASS_NAMES)

EPOCHS      = 100
IMAGE_SIZE  = 640
BATCH_SIZE  = 8        # lower to 4 if out of GPU memory
BASE_MODEL  = str(BASE_DIR / "yolov8n.pt")
CONF_THRESH = 0.45     # minimum YOLO detection confidence to keep a box


# ─────────────────────────────────────────────────────────────────────────────
#  Step 1 — Download dataset
# ─────────────────────────────────────────────────────────────────────────────
def download_dataset() -> Path:
    print("\n📥  Downloading Kaggle dataset …")
    try:
        path = kagglehub.dataset_download("farukece/traffic-light-detection-image-set")
        src  = Path(path)
        print(f"    ✅ Downloaded → {src}")
        return src
    except Exception as e:
        print(f"    ❌ Download failed: {e}")
        print("    Make sure ~/.kaggle/kaggle.json exists and is valid.")
        sys.exit(1)


# ─────────────────────────────────────────────────────────────────────────────
#  Step 2 — Colour classification via HSV
# ─────────────────────────────────────────────────────────────────────────────
def classify_colour(img_bgr: np.ndarray, box_xyxy: tuple) -> str | None:
    """
    Crop the bounding-box ROI, look at the top-40% (active bulb),
    and decide: 'red' | 'yellow' | 'green' | None
    """
    x1, y1, x2, y2 = [int(v) for v in box_xyxy]
    h    = y2 - y1
    crop = img_bgr[y1 : y1 + max(1, int(h * 0.4)), x1:x2]
    if crop.size == 0:
        return None

    hsv = cv2.cvtColor(crop, cv2.COLOR_BGR2HSV)

    red1      = cv2.inRange(hsv, (0,   120, 80), (10,  255, 255))
    red2      = cv2.inRange(hsv, (160, 120, 80), (180, 255, 255))
    red_px    = cv2.countNonZero(red1) + cv2.countNonZero(red2)
    yellow_px = cv2.countNonZero(cv2.inRange(hsv, (15, 100, 80), (40, 255, 255)))
    green_px  = cv2.countNonZero(cv2.inRange(hsv, (40,  60, 60), (90, 255, 255)))

    total = red_px + yellow_px + green_px
    if total < 20:
        return None

    best = max(red_px, yellow_px, green_px)
    if best / total < 0.40:
        return None

    if best == red_px:    return "red"
    if best == yellow_px: return "yellow"
    return "green"


# ─────────────────────────────────────────────────────────────────────────────
#  Step 3 — Arrow direction via row/column profile (same logic as frontend)
# ─────────────────────────────────────────────────────────────────────────────
def classify_arrow(img_bgr: np.ndarray, box_xyxy: tuple) -> int:
    """
    For a green traffic-light ROI, decide whether it shows:
      left arrow  → class 3
      right arrow → class 4
      up arrow    → class 5
      plain circle→ class 2  (fallback)

    Uses the same row-width / column-height profile approach as the frontend.
    """
    x1, y1, x2, y2 = [int(v) for v in box_xyxy]
    roi = img_bgr[y1:y2, x1:x2]
    if roi.size == 0:
        return 2  # plain green fallback

    h, w = roi.shape[:2]

    # ── Build green-pixel mask ───────────────────────────────────────────────
    hsv  = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)

    # Accept "green" pixels: cyan-to-green hue, vivid
    grn_mask = cv2.inRange(hsv, (35, 60, 60), (100, 255, 255))

    total_green = cv2.countNonZero(grn_mask)
    if total_green < 40:
        return 2  # not enough green — plain circle

    # ── Step 1: centroid of green pixels ────────────────────────────────────
    moments   = cv2.moments(grn_mask)
    if moments["m00"] == 0:
        return 2
    cx = int(moments["m10"] / moments["m00"])
    cy = int(moments["m01"] / moments["m00"])

    # ── Step 2: focused ROI around centroid (±35 % of dimensions) ───────────
    rh35 = max(1, int(h * 0.35))
    rw35 = max(1, int(w * 0.35))
    ry0, ry1 = max(0, cy - rh35), min(h - 1, cy + rh35)
    rx0, rx1 = max(0, cx - rw35), min(w - 1, cx + rw35)

    roi_mask = grn_mask[ry0:ry1, rx0:rx1]
    rh = roi_mask.shape[0] or 1
    rw = roi_mask.shape[1] or 1

    # ── Step 3: row-width profile (wide-top → ↑); col-height profile ─────────
    row_widths  = roi_mask.sum(axis=1) / 255.0   # shape (rh,)
    col_heights = roi_mask.sum(axis=0) / 255.0   # shape (rw,)

    half_h = rh // 2
    half_w = rw // 2

    row_top_avg = row_widths[:half_h].mean()  if half_h       else 0
    row_bot_avg = row_widths[half_h:].mean()  if rh - half_h  else 0
    col_lft_avg = col_heights[:half_w].mean() if half_w       else 0
    col_rgt_avg = col_heights[half_w:].mean() if rw - half_w  else 0

    def ratio(a, b):
        return a / b if b > 0 else (9.0 if a > 0 else 1.0)

    score_up    = ratio(row_top_avg, row_bot_avg)   # ↑  wide top
    score_left  = ratio(col_lft_avg, col_rgt_avg)   # ←  tall left
    score_right = ratio(col_rgt_avg, col_lft_avg)   # →  tall right

    THRESH = 1.35   # head must be ≥35 % bigger than shaft

    best_dir, best_score = max(
        [("straight", score_up), ("left", score_left), ("right", score_right)],
        key=lambda t: t[1],
    )

    if best_score < THRESH:
        return 2  # plain circle

    return {"left": 3, "right": 4, "straight": 5}[best_dir]


# ─────────────────────────────────────────────────────────────────────────────
#  Step 4 — Auto-annotate all images
# ─────────────────────────────────────────────────────────────────────────────
def collect_images(src: Path) -> list[Path]:
    exts   = {".jpg", ".jpeg", ".png", ".bmp", ".webp"}
    images = [p for p in src.rglob("*") if p.suffix.lower() in exts]
    print(f"    📷  Found {len(images)} images")
    return images


def auto_annotate(images: list[Path]) -> list[Path]:
    print(f"\n🤖  Auto-annotating {len(images)} images …")
    print(f"    CONF_THRESH = {CONF_THRESH}  |  classes detected: all 6")

    base_model  = YOLO(BASE_MODEL)
    out_img     = YOLO_DIR / "images" / "all"
    out_lbl     = YOLO_DIR / "labels" / "all"
    out_img.mkdir(parents=True, exist_ok=True)
    out_lbl.mkdir(parents=True, exist_ok=True)

    annotated   = []
    box_counts  = {n: 0 for n in CLASS_NAMES}
    skipped     = 0

    for img_path in tqdm(images, desc="    Annotating", unit="img"):
        try:
            results = base_model.predict(
                source=str(img_path),
                conf=CONF_THRESH,
                classes=[9],        # COCO class 9 = traffic light
                verbose=False,
                save=False,
            )[0]
        except Exception:
            skipped += 1
            continue

        if results.boxes is None or len(results.boxes) == 0:
            skipped += 1
            continue

        img_bgr = cv2.imread(str(img_path))
        if img_bgr is None:
            skipped += 1
            continue

        img_h, img_w = img_bgr.shape[:2]
        label_lines  = []

        for box in results.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()

            colour = classify_colour(img_bgr, (x1, y1, x2, y2))
            if colour is None:
                continue

            if colour == "red":
                cls_id = 0
            elif colour == "yellow":
                cls_id = 1
            else:
                # green — check for arrow shape
                cls_id = classify_arrow(img_bgr, (x1, y1, x2, y2))

            # YOLO normalised format
            cx = ((x1 + x2) / 2) / img_w
            cy = ((y1 + y2) / 2) / img_h
            bw = (x2 - x1) / img_w
            bh = (y2 - y1) / img_h
            label_lines.append(f"{cls_id} {cx:.6f} {cy:.6f} {bw:.6f} {bh:.6f}")
            box_counts[CLASS_NAMES[cls_id]] += 1

        if not label_lines:
            skipped += 1
            continue

        dest = out_img / img_path.name
        shutil.copy2(img_path, dest)
        (out_lbl / (img_path.stem + ".txt")).write_text("\n".join(label_lines))
        annotated.append(dest)

    print(f"\n    ✅  Annotated : {len(annotated)} images")
    print(f"    ⏭️   Skipped   : {skipped} images")
    print(f"\n    📊  Class distribution:")
    for cls, cnt in box_counts.items():
        bar = "█" * min(40, cnt // max(1, max(box_counts.values()) // 40))
        print(f"       {cls:<28} {cnt:5d}  {bar}")
    return annotated


# ─────────────────────────────────────────────────────────────────────────────
#  Step 5 — Train / Val / Test split
# ─────────────────────────────────────────────────────────────────────────────
def split_dataset(annotated: list[Path]):
    print("\n✂️   Splitting  (70 % train / 20 % val / 10 % test) …")
    train_imgs, tmp      = train_test_split(annotated, test_size=0.30, random_state=42)
    val_imgs,  test_imgs = train_test_split(tmp,       test_size=0.33, random_state=42)

    src_lbl = YOLO_DIR / "labels" / "all"

    for split, imgs in [("train", train_imgs), ("val", val_imgs), ("test", test_imgs)]:
        (YOLO_DIR / "images" / split).mkdir(parents=True, exist_ok=True)
        (YOLO_DIR / "labels" / split).mkdir(parents=True, exist_ok=True)
        for p in imgs:
            shutil.copy2(p, YOLO_DIR / "images" / split / p.name)
            lbl = src_lbl / (p.stem + ".txt")
            if lbl.exists():
                shutil.copy2(lbl, YOLO_DIR / "labels" / split / lbl.name)

    print(f"    train={len(train_imgs)}  val={len(val_imgs)}  test={len(test_imgs)}")


# ─────────────────────────────────────────────────────────────────────────────
#  Step 6 — Write data.yaml
# ─────────────────────────────────────────────────────────────────────────────
def write_yaml() -> Path:
    yaml_path = YOLO_DIR / "data.yaml"
    yaml_path.write_text(f"""\
# VisionAid — Traffic Signal + Arrow Detection
path: {YOLO_DIR.as_posix()}
train: images/train
val:   images/val
test:  images/test

nc: {NUM_CLASSES}
names: {CLASS_NAMES}
""")
    print(f"\n📄  data.yaml → {yaml_path}")
    return yaml_path


# ─────────────────────────────────────────────────────────────────────────────
#  Step 7 — Train
# ─────────────────────────────────────────────────────────────────────────────
def train(yaml_path: Path) -> Path:
    print(f"\n🚀  Training YOLOv8  ({EPOCHS} epochs, imgsz={IMAGE_SIZE}) …\n")

    model   = YOLO(BASE_MODEL)
    results = model.train(
        data        = str(yaml_path),
        epochs      = EPOCHS,
        imgsz       = IMAGE_SIZE,
        batch       = BATCH_SIZE,
        project     = str(BASE_DIR / "runs" / "traffic"),
        name        = "visionaid_v1",
        patience    = 20,
        save        = True,
        save_period = 10,
        # Augmentation (important for lighting/angle variance)
        augment     = True,
        hsv_h       = 0.02,
        hsv_s       = 0.60,
        hsv_v       = 0.40,
        degrees     = 10,
        translate   = 0.10,
        scale       = 0.40,
        flipud      = 0.00,   # traffic lights are never upside-down
        fliplr      = 0.20,
        mosaic      = 0.80,
        mixup       = 0.10,
        verbose     = True,
    )

    best = Path(results.save_dir) / "weights" / "best.pt"
    print(f"\n✅  Training complete!  Best model → {best}")
    return best


# ─────────────────────────────────────────────────────────────────────────────
#  Step 8 — Evaluate
# ─────────────────────────────────────────────────────────────────────────────
def evaluate(best_pt: Path, yaml_path: Path) -> dict:
    print("\n📊  Evaluating on test set …")
    model   = YOLO(str(best_pt))
    metrics = model.val(data=str(yaml_path), split="test", verbose=False)

    m = {
        "mAP50"    : round(float(metrics.box.map50), 4),
        "mAP50-95" : round(float(metrics.box.map),   4),
        "precision": round(float(metrics.box.mp),    4),
        "recall"   : round(float(metrics.box.mr),    4),
    }

    print(f"\n    mAP@50     : {m['mAP50']:.3f}   (aim >0.85)")
    print(f"    mAP@50-95  : {m['mAP50-95']:.3f}   (aim >0.60)")
    print(f"    Precision  : {m['precision']:.3f}")
    print(f"    Recall     : {m['recall']:.3f}")

    rating = ("🟢 Excellent — ready for production" if m["mAP50"] > 0.85 else
              "🟡 Good — consider more epochs or data"    if m["mAP50"] > 0.70 else
              "🔴 Needs more data / epochs")
    print(f"\n    {rating}")
    return m


# ─────────────────────────────────────────────────────────────────────────────
#  Step 9 — Deploy
# ─────────────────────────────────────────────────────────────────────────────
def deploy(best_pt: Path, metrics: dict):
    dest = BASE_DIR / "traffic_signal_best.pt"
    shutil.copy2(best_pt, dest)

    # Write an updated class-map JSON for app.py to read
    class_map = {
        "0": {"signal": "Red Light",             "color": "red",    "hex": "#ef4444", "arrow": None},
        "1": {"signal": "Yellow Light",           "color": "yellow", "hex": "#eab308", "arrow": None},
        "2": {"signal": "Green Light",            "color": "green",  "hex": "#22c55e", "arrow": None},
        "3": {"signal": "Green Left Arrow",       "color": "green",  "hex": "#22c55e", "arrow": "left"},
        "4": {"signal": "Green Right Arrow",      "color": "green",  "hex": "#22c55e", "arrow": "right"},
        "5": {"signal": "Green Straight Arrow",   "color": "green",  "hex": "#22c55e", "arrow": "straight"},
    }
    (BASE_DIR / "class_map.json").write_text(json.dumps(class_map, indent=2))
    (BASE_DIR / "training_summary.json").write_text(json.dumps({
        "model": str(dest), "classes": CLASS_NAMES, "metrics": metrics,
        "epochs": EPOCHS, "imgsz": IMAGE_SIZE,
    }, indent=2))

    print(f"\n🚀  Deployed!")
    print(f"    Model      → {dest}")
    print(f"    Class map  → {BASE_DIR / 'class_map.json'}")
    print(f"\n    ✏️   In app.py, change the model line to:")
    print(f'        model = YOLO("traffic_signal_best.pt")')
    print(f"\n    📋  Full class list:")
    for i, n in enumerate(CLASS_NAMES):
        arrow = ["", "", "", " ←", " →", " ↑"][i]
        print(f"        {i} → {n}{arrow}")


# ─────────────────────────────────────────────────────────────────────────────
#  Main
# ─────────────────────────────────────────────────────────────────────────────
def main():
    print("=" * 65)
    print("  VisionAid — YOLO Traffic Signal + Arrow Training Pipeline")
    print("=" * 65)
    print(f"  Classes  : {NUM_CLASSES}  →  {CLASS_NAMES}")
    print(f"  Epochs   : {EPOCHS}")
    print(f"  Base mdl : {BASE_MODEL}")
    print("=" * 65)

    # 1. Download
    raw_src = download_dataset()

    # 2. Collect images
    YOLO_DIR.mkdir(parents=True, exist_ok=True)
    images = collect_images(raw_src)
    if not images:
        print("❌  No images found. Check download."); sys.exit(1)

    # 3. Auto-annotate (colour + arrow)
    annotated = auto_annotate(images)
    if len(annotated) < 50:
        print(f"⚠️   Only {len(annotated)} annotated images — consider adding more data.")
        print("    Recommended extra datasets:")
        print("    • S2TLD  (Springer Traffic Light Dataset)")
        print("    • LISA Traffic Light Dataset")
        sys.exit(1)

    # 4. Split
    split_dataset(annotated)

    # 5. YAML
    yaml_path = write_yaml()

    # 6. Train
    best_pt = train(yaml_path)

    # 7. Evaluate
    metrics = evaluate(best_pt, yaml_path)

    # 8. Deploy
    deploy(best_pt, metrics)

    print("\n✨  All done! Restart yolo-service to use the new model.")


if __name__ == "__main__":
    main()
