"""
=============================================================================
  After training completes, paste this /detect endpoint into app.py
  to use the new 6-class model with full arrow support.
=============================================================================
"""

import json
from pathlib import Path

# Load the class map written by train_traffic_signal.py
CLASS_MAP_PATH = Path(__file__).parent / "class_map.json"

# Fallback if file not yet generated
DEFAULT_CLASS_MAP = {
    "0": {"signal": "Red Light",           "color": "red",    "hex": "#ef4444", "arrow": None},
    "1": {"signal": "Yellow Light",         "color": "yellow", "hex": "#eab308", "arrow": None},
    "2": {"signal": "Green Light",          "color": "green",  "hex": "#22c55e", "arrow": None},
    "3": {"signal": "Green Left Arrow",     "color": "green",  "hex": "#22c55e", "arrow": "left"},
    "4": {"signal": "Green Right Arrow",    "color": "green",  "hex": "#22c55e", "arrow": "right"},
    "5": {"signal": "Green Straight Arrow", "color": "green",  "hex": "#22c55e", "arrow": "straight"},
}

CLASS_MAP = (
    json.loads(CLASS_MAP_PATH.read_text())
    if CLASS_MAP_PATH.exists()
    else DEFAULT_CLASS_MAP
)

# ── Paste the lines below into app.py after training ─────────────────────────

UPDATED_APP_SNIPPET = """
# ── Load the trained model ───────────────────────────────────────────────────
import json
from pathlib import Path
from ultralytics import YOLO
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2, numpy as np

app  = Flask(__name__)
CORS(app)

MODEL_PATH = Path(__file__).parent / "traffic_signal_best.pt"
model      = YOLO(str(MODEL_PATH))

with open(Path(__file__).parent / "class_map.json") as f:
    CLASS_MAP = json.load(f)

# ── /detect endpoint ─────────────────────────────────────────────────────────
@app.route('/detect', methods=['POST'])
def detect():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    img_bytes = request.files['image'].read()
    img_array = np.frombuffer(img_bytes, np.uint8)
    img       = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image'}), 400

    results    = model(img, conf=0.45, verbose=False)[0]
    detections = []

    for box in results.boxes:
        cls_id     = str(int(box.cls[0]))
        confidence = float(box.conf[0])
        meta       = CLASS_MAP.get(cls_id, {})

        detections.append({
            'signal'    : meta.get('signal',     'Unknown'),
            'color'     : meta.get('color',      'unknown'),
            'arrow'     : meta.get('arrow',      None),   # ← direct from model!
            'confidence': round(confidence * 100),
            'hex'       : meta.get('hex',        '#888888'),
            'bbox'      : box.xyxyn[0].tolist(),
        })

    if detections:
        # Return highest-confidence detection
        best = max(detections, key=lambda d: d['confidence'])
        return jsonify({
            'status'    : best['signal'],
            'arrow'     : best['arrow'],        # ← frontend reads this directly
            'confidence': best['confidence'],
            'detections': detections,
        })

    return jsonify({'status': 'No Signal', 'arrow': None, 'detections': []})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
"""
