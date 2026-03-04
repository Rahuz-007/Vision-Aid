# Optimized YOLO Service with GPU Support and Batch Processing
# Model: YOLOv8s (small) — upgraded from nano for significantly better detection accuracy

import io
import os
import csv
import math
import gc
import time
import hashlib
from typing import Any, Dict, List, Tuple
from collections import OrderedDict

# Default model: prefer custom-trained model, fall back to yolov8s.pt
import json
from pathlib import Path

_BASE_DIR = Path(__file__).parent
_CUSTOM_MODEL = _BASE_DIR / "traffic_signal_best.pt"
_FALLBACK_MODEL = os.environ.get("YOLO_MODEL_PATH", "yolov8s.pt")
DEFAULT_MODEL = str(_CUSTOM_MODEL) if _CUSTOM_MODEL.exists() else _FALLBACK_MODEL
IS_CUSTOM_MODEL = _CUSTOM_MODEL.exists()

# Load class map (written by train_traffic_signal.py after training)
_CLASS_MAP_PATH = _BASE_DIR / "class_map.json"
DEFAULT_CLASS_MAP = {
    "0": {"signal": "Red Light",             "color": "red",    "hex": "#ef4444", "arrow": None},
    "1": {"signal": "Yellow Light",          "color": "yellow", "hex": "#eab308", "arrow": None},
    "2": {"signal": "Green Light",           "color": "green",  "hex": "#22c55e", "arrow": None},
    "3": {"signal": "Green Left Arrow",      "color": "green",  "hex": "#22c55e", "arrow": "left"},
    "4": {"signal": "Green Right Arrow",     "color": "green",  "hex": "#22c55e", "arrow": "right"},
    "5": {"signal": "Green Straight Arrow",  "color": "green",  "hex": "#22c55e", "arrow": "straight"},
}
CLASS_MAP = (
    json.loads(_CLASS_MAP_PATH.read_text())
    if _CLASS_MAP_PATH.exists()
    else DEFAULT_CLASS_MAP
)
import numpy as np

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image
from ultralytics import YOLO

# Try to import PyTorch for GPU support
try:
    import torch
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False
    print("Warning: PyTorch not available. Running in CPU-only mode.")


class ImageCache:
    """O(1) LRU cache for detection results using OrderedDict"""
    def __init__(self, max_size=100):
        self.cache = OrderedDict()
        self.max_size = max_size
    
    def get_hash(self, image_bytes):
        return hashlib.md5(image_bytes).hexdigest()
    
    def get(self, image_bytes):
        key = self.get_hash(image_bytes)
        if key in self.cache:
            # Move to end = mark as most recently used — O(1)
            self.cache.move_to_end(key)
            print(f"Cache hit for {key[:8]}...")
            return self.cache[key]
        return None
    
    def set(self, image_bytes, result):
        key = self.get_hash(image_bytes)
        if key in self.cache:
            self.cache.move_to_end(key)
        else:
            if len(self.cache) >= self.max_size:
                # Remove LRU (first/oldest item) — O(1)
                self.cache.popitem(last=False)
        self.cache[key] = result
        print(f"Cached result for {key[:8]}...")


class OptimizedYOLOService:
    """YOLO Service with GPU support and optimization"""
    
    def __init__(self, model_path='yolov8n.pt'):
        self.device = self._get_device()
        print(f"Initializing YOLO model on device: {self.device}")
        
        self.model = YOLO(model_path)
        if TORCH_AVAILABLE:
            self.model.to(self.device)
        
        self.model_names = self.model.names
        print(f"Model loaded successfully. Classes: {len(self.model_names)}")
    
    def _get_device(self):
        """Determine the best device to use"""
        if not TORCH_AVAILABLE:
            return 'cpu'
        
        if torch.cuda.is_available():
            print(f"CUDA available: {torch.cuda.get_device_name(0)}")
            return 'cuda'
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            print("MPS (Apple Silicon) available")
            return 'mps'
        else:
            print("No GPU available, using CPU")
            return 'cpu'
    
    def detect(self, image, conf=0.30):
        """Perform detection with memory optimization"""
        with torch.no_grad() if TORCH_AVAILABLE else nullcontext():
            results = self.model(image, verbose=False, conf=conf, device=self.device)
        return results
    
    def cleanup_memory(self):
        """Force garbage collection and clear GPU cache"""
        gc.collect()
        if TORCH_AVAILABLE and torch.cuda.is_available():
            torch.cuda.empty_cache()


def nullcontext():
    """Context manager for non-PyTorch environments"""
    class _NullContext:
        def __enter__(self):
            return self
        def __exit__(self, exc_type, exc_val, exc_tb):
            return False
    return _NullContext()


def load_color_database(csv_path: str = 'colors.csv') -> List[Dict]:
    """Load the color database from CSV file."""
    colors = []
    try:
        if not os.path.exists(csv_path):
            print(f"Warning: Color database not found at {csv_path}")
            return []
        with open(csv_path, 'r', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 6:
                    colors.append({
                        'name': row[1],
                        'r': int(row[3]),
                        'g': int(row[4]),
                        'b': int(row[5])
                    })
        print(f"Loaded {len(colors)} colors from database")
    except Exception as e:
        print(f"Error loading color database: {e}")
    return colors


def find_nearest_color(rgb_input: Tuple[int, int, int], color_db: List[Dict]) -> str:
    """Find the nearest color match using Euclidean distance."""
    if not color_db:
        return 'unknown'
        
    min_distance = float('inf')
    nearest_name = 'unknown'
    
    for color in color_db:
        distance = math.sqrt(
            (rgb_input[0] - color['r'])**2 + 
            (rgb_input[1] - color['g'])**2 + 
            (rgb_input[2] - color['b'])**2
        )
        if distance < min_distance:
            min_distance = distance
            nearest_name = color['name'].lower()
            
    # Map specific shades back to standard traffic light colors
    if any(word in nearest_name for word in ['red', 'crimson', 'scarlet', 'maroon']):
        return 'red'
    if any(word in nearest_name for word in ['yellow', 'amber', 'gold', 'orange']):
        return 'yellow'
    if any(word in nearest_name for word in ['green', 'lime', 'emerald']):
        return 'green'
        
    return 'unknown'


def analyze_traffic_light_color(image: Image.Image, box: Dict[str, float], color_db: List[Dict]) -> str:
    """
    Analyze the color of a detected traffic light using HSV color space 
    to better handle light sources and contrast against the dark casing.
    """
    x1, y1, x2, y2 = int(box['x1']), int(box['y1']), int(box['x2']), int(box['y2'])
    width, height = image.size
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(width, x2), min(height, y2)
    
    if x2 <= x1 or y2 <= y1:
        return 'unknown'
    
    traffic_light_region = image.crop((x1, y1, x2, y2))
    
    # Convert to HSV for better color segmentation
    img_hsv = traffic_light_region.convert('HSV')
    img_array = np.array(img_hsv)
    
    h, w = img_array.shape[:2]
    section_height = h // 3
    
    # Define sections
    sections = [
        ("red", img_array[0:section_height, :]),            # Top
        ("yellow", img_array[section_height:2*section_height, :]), # Middle
        ("green", img_array[2*section_height:, :])           # Bottom
    ]
    
    max_score = 0
    detected_color = 'unknown'
    
    for color_name, section in sections:
        if section.size == 0: continue
        
        # Extract channels
        h_channel = section[:, :, 0]
        s_channel = section[:, :, 1]
        v_channel = section[:, :, 2]
        
        # Create masks for standard traffic light colors in HSV (0-255 scale in PIL)
        # H: 0-255 (where 0 is 0deg, 255 is 360deg)
        # Red: H < 20 or H > 235
        # Yellow: H 20-50
        # Green: H 50-120
        
        if color_name == 'red':
            mask = ((h_channel < 25) | (h_channel > 230)) & (s_channel > 50) & (v_channel > 60)
        elif color_name == 'yellow':
            mask = (h_channel >= 20) & (h_channel <= 60) & (s_channel > 50) & (v_channel > 60)
        elif color_name == 'green':
            mask = (h_channel >= 40) & (h_channel <= 130) & (s_channel > 50) & (v_channel > 60)
            
        # Calculate "score" as number of matching pixels * their brightness
        # This favors bright, colorful blobs (the light) over dark background
        matching_pixels = section[mask]
        
        if matching_pixels.size > 0:
            # Score is sum of brightness of matching pixels
            score = np.sum(matching_pixels[:, 2])
            
            # Normalize by section size to filter noise
            normalized_score = score / (section.shape[0] * section.shape[1])
            
            if normalized_score > max_score and normalized_score > 5: # Threshold
                max_score = normalized_score
                detected_color = color_name

    # Fallback: if no color detected via HSV, look at simple max brightness position
    if detected_color == 'unknown':
        img_gray = traffic_light_region.convert('L')
        gray_array = np.array(img_gray)
        
        brightness_scores = []
        for i in range(3):
            sec = gray_array[i*section_height : (i+1)*section_height, :]
            if sec.size > 0:
                # Use max brightness instead of mean to find the "bulb"
                brightness_scores.append(np.max(sec))
            else:
                brightness_scores.append(0)
        
        best_section = np.argmax(brightness_scores)
        max_val = brightness_scores[best_section]
        
        # If the brighest spot is actually bright (scale 0-255)
        if max_val > 150:
            if best_section == 0: return 'red'
            if best_section == 1: return 'yellow'
            if best_section == 2: return 'green'

    return detected_color


def calculate_distance(box: Dict[str, float]) -> float:
    """
    Estimate distance to the traffic light based on bounding box height.
    Using a typical traffic light height of 0.8m and an assumed focal length.
    """
    # Realistic height of a traffic light (main unit) in meters
    REAL_HEIGHT_M = 0.8
    # Estimated focal length in pixels (standard for 720p/1080p cameras)
    FOCAL_LENGTH_PX = 650 
    
    pixel_height = box['y2'] - box['y1']
    if pixel_height <= 0:
        return 0.0
    
    # Distance = (Real Height * Focal Length) / Pixel Height
    distance = (REAL_HEIGHT_M * FOCAL_LENGTH_PX) / pixel_height
    return round(distance, 1)


def simplify_color(r: int, g: int, b: int) -> str:
    """
    Convert an RGB value to a plain, everyday colour name that anyone can understand.
    Uses HSL so dark/light/vivid variants map correctly.
    Examples: 'Dark Brown', 'Light Blue', 'Olive Green', 'Navy Blue'
    """
    rf, gf, bf = r / 255.0, g / 255.0, b / 255.0
    cmax, cmin = max(rf, gf, bf), min(rf, gf, bf)
    delta = cmax - cmin
    l = (cmax + cmin) / 2.0
    s = 0.0 if delta == 0 else delta / (1 - abs(2 * l - 1))

    if delta == 0:
        h = 0.0
    elif cmax == rf:
        h = 60 * (((gf - bf) / delta) % 6)
    elif cmax == gf:
        h = 60 * (((bf - rf) / delta) + 2)
    else:
        h = 60 * (((rf - gf) / delta) + 4)

    def shade(base):
        if l > 0.72: return f'Light {base}'
        if l < 0.28: return f'Dark {base}'
        return base

    # Achromatic — also catch dark/desaturated colours that look grey
    if s < 0.12 or (s < 0.25 and l < 0.38):
        if l > 0.92: return 'White'
        if l > 0.75: return 'Light Gray'
        if l > 0.50: return 'Gray'
        if l > 0.25: return 'Dark Gray'
        return 'Black'

    if h < 15 or h >= 345:
        if l < 0.28 and s > 0.3: return 'Dark Red'
        if l > 0.72: return 'Light Pink'
        return shade('Red')
    if h < 30:
        if l < 0.30: return 'Dark Brown'
        if l < 0.52: return 'Brown'
        if l > 0.72: return 'Peach'
        return 'Dark Orange'
    if h < 48:
        if l < 0.35: return 'Brown'
        if l > 0.72: return 'Peach'
        if l > 0.60: return 'Yellow'   # bright orange-yellow like mustard
        return shade('Orange')
    if h < 65:
        if l < 0.40: return 'Dark Yellow'
        return shade('Yellow')
    if h < 80:
        if l < 0.45: return 'Olive Green'  # dark yellow-green like olive (h~80)
        return shade('Yellow')
    if h < 100:
        if l < 0.45: return 'Olive Green'  # olive (h~80, l~0.35)
        return 'Lime Green'
    if h < 150:
        if l < 0.25: return 'Dark Green'
        if s < 0.35: return 'Olive Green'
        return shade('Green')
    if h < 195:
        return shade('Teal')
    if h < 205:
        if l > 0.65: return 'Light Blue'
        return 'Sky Blue'
    if h < 255:
        if l < 0.25: return 'Dark Blue'
        if l < 0.50: return 'Navy Blue'
        if l > 0.70: return 'Light Blue'
        return 'Blue'
    if h < 285:
        return shade('Indigo')
    if h < 315:
        if l < 0.30: return 'Dark Purple'
        if l > 0.70: return 'Lavender'
        return 'Purple'
    if h < 345:
        if l > 0.72: return 'Light Pink'
        if l < 0.30: return 'Dark Pink'
        return 'Pink'
    return shade('Red')


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize YOLO service
if IS_CUSTOM_MODEL:
    print(f"🎯 Loading CUSTOM trained model: {DEFAULT_MODEL}")
    print(f"   Loaded class map: {list(CLASS_MAP.values())}")
else:
    print(f"Loading YOLO model: {DEFAULT_MODEL} ...")
    print("   Tip: Run train_traffic_signal.py to train a custom 6-class model.")

yolo_service = OptimizedYOLOService(DEFAULT_MODEL)

# Initialize color database
color_db = load_color_database('colors.csv')

# Initialize cache
image_cache = ImageCache(max_size=100)


@app.route("/health", methods=["GET"])
def health() -> Any:
    """Health check endpoint"""
    return jsonify({
        "status": "ok",
        "device": yolo_service.device,
        "db_size": len(color_db),
        "cache_size": len(image_cache.cache),
        "torch_available": TORCH_AVAILABLE,
        "cuda_available": TORCH_AVAILABLE and torch.cuda.is_available() if TORCH_AVAILABLE else False,
    }), 200


@app.route("/detect", methods=["POST"])
def detect() -> Any:
    """Detection endpoint — cache only for traffic uploads, not live camera frames"""
    start_time = time.time()

    if "image" not in request.files:
        return jsonify({"error": "Missing file field 'image'"}), 400

    file_storage = request.files["image"]
    if not file_storage.filename:
        return jsonify({"error": "Empty filename"}), 400

    image_bytes = file_storage.read()

    # Get detection mode FIRST — live camera frames must NOT be cached
    # (every frame is unique; caching them fills all 100 slots with useless entries)
    detection_type = request.form.get("type", "traffic")  # 'traffic' or 'general'
    use_cache = (detection_type == "traffic")  # only cache uploaded traffic images

    # Check cache only for traffic uploads
    if use_cache:
        cached_result = image_cache.get(image_bytes)
        if cached_result:
            cached_result['cached'] = True
            cached_result['processing_time'] = time.time() - start_time
            return jsonify(cached_result), 200

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400

    # Confidence: 0.30 — balanced for CPU speed + accuracy
    results = yolo_service.detect(image, conf=0.30)

    # ── Smart shape-based reclassification rules ──────────────────────────────
    # These fix common COCO misdetections based on bounding-box geometry.
    # Format: original_class -> (corrected_class, max_aspect_ratio, max_area_fraction)
    #   aspect_ratio  = width / height  (values near 1.0 = square-ish)
    #   area_fraction = box_area / image_area  (small value = small object)
    img_w, img_h = image.size
    img_area = max(img_w * img_h, 1)

    SHAPE_REMAP = {
        # Watches are small AND squarish; phones are tall and larger
        "cell phone": {
            "conditions": [{"max_aspect_diff": 0.55, "max_area_frac": 0.06, "remap_to": "watch"}]
        },
        # Books sometimes detected as laptops when closed flat
        "laptop":     {
            "conditions": [{"min_aspect_ratio": 1.8, "max_area_frac": 0.05, "remap_to": "book"}]
        },
    }

    detections: List[Dict[str, Any]] = []
    for result in results:
        if result.boxes is None:
            continue

        for coords, conf, cls_id in zip(result.boxes.xyxy.tolist(),
                                        result.boxes.conf.tolist(),
                                        result.boxes.cls.tolist()):
            class_name = yolo_service.model_names.get(int(cls_id), str(cls_id))

            # Filter based on detection type
            if detection_type == "traffic":
                if class_name != "traffic light":
                    continue
            # For "general", accept all classes

            x1, y1, x2, y2 = map(float, coords)
            box = {"x1": x1, "y1": y1, "x2": x2, "y2": y2}

            # ── Shape-based reclassification ───────────────────────────────────
            box_w  = x2 - x1
            box_h  = y2 - y1
            aspect = box_w / max(box_h, 1)          # width / height
            area_frac = (box_w * box_h) / img_area  # fraction of full frame

            if class_name in SHAPE_REMAP:
                for rule in SHAPE_REMAP[class_name]["conditions"]:
                    # Squarish check: |aspect - 1| < max_aspect_diff
                    aspect_ok = True
                    if "max_aspect_diff" in rule:
                        aspect_ok = abs(aspect - 1.0) < rule["max_aspect_diff"]
                    if "min_aspect_ratio" in rule:
                        aspect_ok = aspect >= rule["min_aspect_ratio"]
                    size_ok = area_frac <= rule.get("max_area_frac", 1.0)
                    if aspect_ok and size_ok:
                        class_name = rule["remap_to"]
                        print(f"[Remap] Reclassified to '{class_name}' "
                              f"(aspect={aspect:.2f}, area%={area_frac*100:.1f}%)")
                        break

            # Custom-model detection: use class map if available
            color = "unknown"
            arrow = None
            if IS_CUSTOM_MODEL and str(int(cls_id)) in CLASS_MAP:
                meta = CLASS_MAP[str(int(cls_id))]
                color = meta.get("color", "unknown")
                arrow = meta.get("arrow", None)
                class_name = meta.get("signal", class_name)
            elif class_name == "traffic light":
                color = analyze_traffic_light_color(image, box, color_db)

            # Estimate distance
            distance = calculate_distance(box)

            detections.append({
                "box": box,
                "confidence": float(conf),
                "class_id": int(cls_id),
                "class_name": class_name,
                "color": color,
                "arrow": arrow,
                "distance": distance,
            })

    processing_time = time.time() - start_time
    
    result = {
        "count": len(detections),
        "detections": detections,
        "processing_time": processing_time,
        "cached": False,
    }

    # Only cache traffic signal uploads (not live camera frames)
    if use_cache:
        image_cache.set(image_bytes, result)

    return jsonify(result), 200


@app.route("/detect-color", methods=["POST"])
def detect_color() -> Any:
    """General color detection endpoint for live color detection"""
    start_time = time.time()
    
    if "image" not in request.files:
        return jsonify({"error": "Missing file field 'image'"}), 400

    file_storage = request.files["image"]
    if not file_storage.filename:
        return jsonify({"error": "Empty filename"}), 400

    image_bytes = file_storage.read()
    
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400

    # Get center region for color detection
    width, height = image.size
    center_x, center_y = width // 2, height // 2
    sample_size = min(width, height) // 10  # 10% of image size
    
    x1 = max(0, center_x - sample_size)
    y1 = max(0, center_y - sample_size)
    x2 = min(width, center_x + sample_size)
    y2 = min(height, center_y + sample_size)
    
    # Extract center region
    center_region = image.crop((x1, y1, x2, y2))
    
    # Convert to numpy array and calculate average color
    img_array = np.array(center_region)
    avg_color = img_array.mean(axis=(0, 1)).astype(int)
    r, g, b = int(avg_color[0]), int(avg_color[1]), int(avg_color[2])
    
    # Find nearest color from database
    if color_db:
        min_distance = float('inf')
        color_name = 'Unknown'
        
        for color in color_db:
            distance = math.sqrt(
                (r - color['r'])**2 + 
                (g - color['g'])**2 + 
                (b - color['b'])**2
            )
            if distance < min_distance:
                min_distance = distance
                color_name = color['name']
    else:
        color_name = "Unknown"

    
    processing_time = time.time() - start_time
    
    simple_name = simplify_color(r, g, b)
    result = {
        "color_name": simple_name,
        "raw_name": color_name,
        "rgb": {"r": r, "g": g, "b": b},
        "hex": f"#{r:02x}{g:02x}{b:02x}",
        "processing_time": processing_time
    }
    
    return jsonify(result), 200


@app.route("/model-info", methods=["GET"])
def model_info() -> Any:
    """Returns information about the loaded model"""
    return jsonify({
        "model": DEFAULT_MODEL,
        "is_custom": IS_CUSTOM_MODEL,
        "device": yolo_service.device,
        "classes": len(yolo_service.model_names),
        "torch_available": TORCH_AVAILABLE,
        "cuda_available": TORCH_AVAILABLE and torch.cuda.is_available() if TORCH_AVAILABLE else False,
        "color_db_size": len(color_db),
        "cache_entries": len(image_cache.cache),
    }), 200


@app.route("/class-map", methods=["GET"])
def class_map_endpoint() -> Any:
    """Returns the signal class map for the currently loaded model"""
    return jsonify({
        "is_custom": IS_CUSTOM_MODEL,
        "class_map": CLASS_MAP,
    }), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    print(f"Starting YOLO service on port {port}")
    print(f"Model: {DEFAULT_MODEL} ({'CUSTOM' if IS_CUSTOM_MODEL else 'generic'})")
    print(f"Device: {yolo_service.device}")
    print(f"Color database: {len(color_db)} colors")
    app.run(host="0.0.0.0", port=port, debug=False)

