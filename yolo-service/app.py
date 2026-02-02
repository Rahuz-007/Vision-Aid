# Optimized YOLO Service with GPU Support and Batch Processing

import io
import os
import csv
import math
import gc
import time
import hashlib
from typing import Any, Dict, List, Tuple
from collections import deque
import numpy as np

from flask import Flask, jsonify, request
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
    """Simple LRU cache for detection results"""
    def __init__(self, max_size=100):
        self.cache = {}
        self.max_size = max_size
        self.access_order = deque()
    
    def get_hash(self, image_bytes):
        return hashlib.md5(image_bytes).hexdigest()
    
    def get(self, image_bytes):
        key = self.get_hash(image_bytes)
        if key in self.cache:
            # Update access order
            self.access_order.remove(key)
            self.access_order.append(key)
            print(f"Cache hit for {key[:8]}...")
            return self.cache[key]
        return None
    
    def set(self, image_bytes, result):
        key = self.get_hash(image_bytes)
        
        # Remove oldest if cache is full
        if len(self.cache) >= self.max_size:
            oldest = self.access_order.popleft()
            del self.cache[oldest]
        
        self.cache[key] = result
        self.access_order.append(key)
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
    
    def detect(self, image, conf=0.15):
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
    Analyze the color of a detected traffic light by finding the brightest 
    spot within the box and matching it against the dataset.
    """
    x1, y1, x2, y2 = int(box['x1']), int(box['y1']), int(box['x2']), int(box['y2'])
    width, height = image.size
    x1, y1 = max(0, x1), max(0, y1)
    x2, y2 = min(width, x2), min(height, y2)
    
    if x2 <= x1 or y2 <= y1:
        return 'unknown'
    
    traffic_light_region = image.crop((x1, y1, x2, y2))
    img_array = np.array(traffic_light_region)
    
    # Standard traffic lights are vertical. Let's find the brightest section.
    h, w = img_array.shape[:2]
    section_height = h // 3
    
    # Calculate average brightness for each section
    sections = [
        img_array[0:section_height, :],           # Top (usually Red)
        img_array[section_height:2*section_height, :], # Middle (usually Yellow)
        img_array[2*section_height:, :]           # Bottom (usually Green)
    ]
    
    max_brightness = -1
    best_rgb = (0, 0, 0)
    best_section_idx = -1
    
    for i, section in enumerate(sections):
        if section.size == 0: continue
        
        # Calculate mean RGB
        avg_r = np.mean(section[:, :, 0])
        avg_g = np.mean(section[:, :, 1])
        avg_b = np.mean(section[:, :, 2])
        
        brightness = (avg_r + avg_g + avg_b) / 3
        
        # If this section is bright enough to be "on"
        if brightness > max_brightness and brightness > 100: # Threshold for active light
            max_brightness = brightness
            best_rgb = (int(avg_r), int(avg_g), int(avg_b))
            best_section_idx = i

    if best_section_idx == -1:
        return 'unknown'
        
    # Use the color database to find the nearest match for the "on" lamp
    detected_color = find_nearest_color(best_rgb, color_db)
    
    # Safety fallback: if section 0 is brightest but matched to green, trust position or adjust
    # For now, we trust the database match but filter by standard positions
    if best_section_idx == 0 and detected_color != 'red' and max_brightness > 150:
        return 'red' # Top is almost always red
    if best_section_idx == 2 and detected_color != 'green' and max_brightness > 150:
        return 'green' # Bottom is almost always green
        
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


# Initialize Flask app
app = Flask(__name__)

# Initialize YOLO service
print("Loading YOLO model...")
yolo_service = OptimizedYOLOService(os.environ.get("YOLO_MODEL_PATH", "yolov8n.pt"))

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
    """Detection endpoint with caching and optimization"""
    start_time = time.time()
    
    if "image" not in request.files:
        return jsonify({"error": "Missing file field 'image'"}), 400

    file_storage = request.files["image"]
    if not file_storage.filename:
        return jsonify({"error": "Empty filename"}), 400

    image_bytes = file_storage.read()
    
    # Check cache first
    cached_result = image_cache.get(image_bytes)
    if cached_result:
        cached_result['cached'] = True
        cached_result['processing_time'] = time.time() - start_time
        return jsonify(cached_result), 200
    
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        return jsonify({"error": f"Invalid image: {str(e)}"}), 400

    # Lower confidence to 0.15 to ensure we don't miss smaller objects
    results = yolo_service.detect(image, conf=0.15)

    detections: List[Dict[str, Any]] = []
    for result in results:
        if result.boxes is None:
            continue

        for coords, conf, cls_id in zip(result.boxes.xyxy.tolist(), 
                                        result.boxes.conf.tolist(), 
                                        result.boxes.cls.tolist()):
            class_name = yolo_service.model_names.get(int(cls_id), str(cls_id))
            if class_name != "traffic light":
                continue

            x1, y1, x2, y2 = map(float, coords)
            box = {"x1": x1, "y1": y1, "x2": x2, "y2": y2}
            
            # Analyze color using the dataset
            color = analyze_traffic_light_color(image, box, color_db)
            
            # Estimate distance
            distance = calculate_distance(box)
            
            detections.append({
                "box": box,
                "confidence": float(conf),
                "class_id": int(cls_id),
                "class_name": class_name,
                "color": color,
                "distance": distance,
            })

    processing_time = time.time() - start_time
    
    result = {
        "count": len(detections),
        "detections": detections,
        "processing_time": processing_time,
        "cached": False,
    }
    
    # Cache the result
    image_cache.set(image_bytes, result)
    
    # Cleanup memory
    yolo_service.cleanup_memory()
    
    return jsonify(result), 200


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    print(f"Starting YOLO service on port {port}")
    print(f"Device: {yolo_service.device}")
    print(f"Color database: {len(color_db)} colors")
    app.run(host="0.0.0.0", port=port, debug=False)
