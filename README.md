<div align="center">

<img src="https://img.shields.io/badge/VisionAid-Assistive%20AI%20Platform-6C63FF?style=for-the-badge&logo=eye&logoColor=white" alt="VisionAid Banner"/>

# 👁️ VisionAid

### A Unified AI-Powered Assistive Web Platform for Visually Impaired and Color-Blind Users

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.10-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![YOLOv8](https://img.shields.io/badge/YOLOv8s-Object%20Detection-FF6B35?style=flat-square&logo=pytorch&logoColor=white)](https://github.com/ultralytics/ultralytics)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

*Empowering ~300 million color-blind and visually impaired users worldwide through real-time AI and accessible web technology.*

---

[✨ Features](#-features) • [🏗️ Architecture](#️-architecture) • [🚀 Quick Start](#-quick-start) • [📦 Installation](#-installation) • [📡 API Reference](#-api-reference) • [📊 Performance](#-performance) • [🗺️ Roadmap](#️-roadmap)

</div>

---

## 📖 About

**VisionAid** is a comprehensive, browser-native assistive technology platform that integrates twelve AI-powered accessibility modules under a single authenticated interface. It requires **zero installation** and runs entirely in the browser, making it accessible on any device with a modern web browser.

Built as an MCA Final Year Project, VisionAid demonstrates that AI-powered assistive tools need not require specialized hardware, proprietary software, or institutional resources.

> 📄 **Research Paper:** A full draft research paper is available in [`VisionAid_Research_Paper.md`](VisionAid_Research_Paper.md) and [`VisionAid_Research_Paper.pdf`](VisionAid_Research_Paper.pdf).

---

## ✨ Features

### 🤖 AI-Powered Detection
| Module | Description |
|--------|-------------|
| **Color Object Detector** | Real-time object detection + dominant color identification using YOLOv8s. Detects 80 COCO classes with HSL-based human-readable color naming (e.g., *"Dark Olive Green bottle"*). |
| **Traffic Signal Detector** | Identifies traffic lights and classifies signal color (Red/Yellow/Green) using HSV region analysis. Includes distance estimation via the pinhole camera model. |

### 🎨 Color Blindness Tools
| Module | Description |
|--------|-------------|
| **Color Blindness Simulator** | Canvas-based real-time simulation of 9 CVD types (Protanopia, Deuteranopia, Tritanopia, Achromatopsia, and anomalous variants). Supports both image upload and live camera feed with a split-view comparison slider. |
| **Color Blindness Test** | 4-mode clinically-inspired vision screening: Color Patch identification, Simulated Ishihara reading, Hue Arrangement sorting, and Contrast Sensitivity testing. |
| **Image Recolor** | Recolors images with deficiency-aware palette transformations for improved accessibility. |

### 🛠️ Accessibility Utilities
| Module | Description |
|--------|-------------|
| **Color Picker** | Point-and-click canvas color sampler returning hex, RGB, and human-readable color name. |
| **Contrast Checker** | WCAG 2.1 AA/AAA contrast ratio analysis for foreground/background color pairs. |
| **Palette Generator** | Generates accessible color palettes using color theory algorithms. |
| **Palette Checker** | Multi-color WCAG 2.1 accessibility audit across all color combinations. |
| **Image Palette Extractor** | Extracts dominant colors from any image using K-means clustering. |
| **Text Checker** | Analyzes foreground-background text readability per WCAG contrast formulas. |
| **Color Psychology** | Explores the emotional and symbolic meanings of colors. |

### 🔊 Voice Assistance
- **Web Speech API** integration providing spoken feedback for detection results, simulation changes, test completions, and UI milestones.
- Fully usable by low-vision and blind users; togglable without page reload.
- Preferences persisted to Firebase Firestore.

---

## 🏗️ Architecture

VisionAid follows a **three-tier client-server architecture** with three independently deployable Docker containers:

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                         │
│         React.js 18 SPA (Tailwind CSS + Framer Motion)      │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API (JSON)
          ┌───────────┴───────────┐
          │                       │
┌─────────▼──────────┐   ┌───────▼────────────────────┐
│  Node.js / Express │   │  Python Flask + YOLOv8s     │
│  Backend API       │   │  AI Inference Service       │
│  Port: 3001        │   │  Port: 5000                 │
│                    │   │                             │
│  • Auth (Passport) │   │  POST /detect               │
│  • Session Mgmt    │   │  POST /detect-color         │
│  • Rate Limiting   │   │  GET  /model-info           │
│  • Prometheus      │   │                             │
└─────────┬──────────┘   └─────────────────────────────┘
          │
┌─────────▼──────────┐
│  Firebase Firestore │
│  (NoSQL Database)  │
│                    │
│  • User accounts   │
│  • Preferences     │
│  • Test results    │
└────────────────────┘
          │
    Nginx Reverse Proxy (Port 80/443)
    SSL Termination + Static Asset Caching
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, Tailwind CSS, Framer Motion, React Router v6, Axios |
| **Backend** | Node.js 18, Express.js 5, Passport.js, Helmet, Winston, Prometheus |
| **AI Service** | Python 3.10, Flask, Ultralytics YOLOv8s, PyTorch, OpenCV, Pillow |
| **Database** | Firebase Firestore (NoSQL) via Firebase Admin SDK |
| **Auth** | Firebase Auth, Google OAuth 2.0, Passport.js local strategy |
| **DevOps** | Docker, Docker Compose, Nginx, Prometheus + Grafana |
| **Mobile** | React Native (Expo) — `mobile-app/` directory |
| **Extension** | Chrome Browser Extension — `browser-extension/` directory |

---

## 🚀 Quick Start

The fastest way to run VisionAid locally is using the provided quick-start script:

```powershell
# Windows (PowerShell)
.\quick-start.ps1
```

Or with Docker Compose:

```bash
docker-compose up --build
```

Then open your browser at **http://localhost** (Nginx serves the frontend).

---

## 📦 Installation

### Prerequisites

| Requirement | Version |
|------------|---------|
| Node.js | ≥ 18.x |
| Python | ≥ 3.10 |
| Docker & Docker Compose | Latest |
| Git | Any |

### 1. Clone the Repository

```bash
git clone https://github.com/Rahuz-007/Vision-Aid.git
cd Vision-Aid
```

### 2. Configure Environment Variables

```powershell
# Generate secure secrets automatically
.\generate-secrets.ps1
```

Then copy and fill in the `.env` files:

```bash
# Backend
cp Back-end/.env.example Back-end/.env
# Edit Back-end/.env with your Firebase credentials, OAuth keys, etc.
```

Key environment variables in `Back-end/.env`:

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `FIREBASE_PRIVATE_KEY` | Firebase Admin SDK private key |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret |
| `SESSION_SECRET` | Express session secret (min 32 chars) |
| `YOLO_SERVICE_URL` | URL of the YOLO Flask service (default: `http://localhost:5000`) |

### 3. Run with Docker (Recommended)

```bash
# Full stack (Frontend + Backend + YOLO Service + Monitoring)
docker-compose up --build

# Simple stack (no monitoring)
docker-compose -f docker-compose-simple.yml up --build

# Production
docker-compose -f docker-compose.production.yml up --build
```

### 4. Manual Setup (Development)

#### Frontend
```bash
cd "front -end"
npm install
npm start
# Runs on http://localhost:3000
```

#### Backend
```bash
cd Back-end
npm install
npm run dev
# Runs on http://localhost:3001
```

#### YOLO Service
```bash
cd yolo-service
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### 5. HTTPS Setup (Optional)

```powershell
# Self-signed certificates for local HTTPS
.\setup-https.ps1
.\start-https-simple.ps1
```

---

## 📡 API Reference

### Backend API (`http://localhost:3001`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Authenticate user |
| `POST` | `/api/auth/signup` | Register new user |
| `GET` | `/api/auth/google` | Google OAuth redirect |
| `GET` | `/api/preferences` | Get user preferences |
| `PUT` | `/api/preferences` | Update user preferences |
| `POST` | `/api/traffic-signal/detect` | Traffic signal detection proxy |
| `POST` | `/api/vision-test/save` | Save vision test results |
| `POST` | `/api/image/process` | Image processing proxy |
| `POST` | `/api/contact` | Contact form submission |
| `GET` | `/metrics` | Prometheus metrics |

### YOLO Service API (`http://localhost:5000`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/detect` | Object detection with color (image upload) |
| `POST` | `/detect-color` | Live camera frame color detection |
| `GET` | `/model-info` | Model metadata and diagnostics |

#### Example: Object Detection

```bash
curl -X POST http://localhost:5000/detect \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "objects": [
    {
      "class": "traffic light",
      "confidence": 0.87,
      "bbox": [120, 45, 200, 180],
      "color": {
        "name": "Red",
        "hex": "#C23B22",
        "rgb": [194, 59, 34]
      },
      "signal_color": "red",
      "distance_m": 3.2
    }
  ],
  "processing_time_ms": 142
}
```

---

## 📊 Performance

Evaluated on Intel Core i5 8th Gen, 8 GB RAM, CPU-only (no GPU):

### Color Detection
| Condition | Accuracy | Processing Time |
|-----------|----------|-----------------|
| Daylight | 93.4% | 87 ms |
| Indoor Fluorescent | 91.2% | 91 ms |
| Low Light (<50 lux) | 78.6% | 94 ms |
| **Overall** | **91.1%** | **91 ms** |

### Object Detection (YOLOv8s, COCO)
| Metric | Value |
|--------|-------|
| Mean Confidence | 0.724 |
| Precision | 0.812 |
| Recall | 0.779 |
| mAP@0.50 | 0.801 |
| Avg. Inference Time | 142 ms (CPU) |

### Traffic Signal Detection
| Signal | Precision | Recall |
|--------|-----------|--------|
| Red | 94.1% | 91.7% |
| Yellow | 88.3% | 85.0% |
| Green | 93.7% | 92.4% |
| **Average** | **92.0%** | **89.7%** |

### Simulation Engine
| Resolution | Matrix Apply | Total Render |
|-----------|-------------|--------------|
| 640×480 | 18 ms | 23 ms |
| 1280×720 | 67 ms | 79 ms |
| 1920×1080 | 149 ms | 168 ms |
| Camera (live) | ~12 ms/frame | ~80 ms/frame |

### Usability (SUS Score)
> **81.4 / 100** — *"Excellent" grade* — across 25 participants including color-blind, low-vision, and sighted users.

---

## 🧪 Testing

### Backend Tests
```bash
cd Back-end
npm test                   # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
npm run test:ci            # CI mode
```

### System Phase Tests
```powershell
# Phase 1: Core functionality
.\test-phase1.ps1

# Phase 2: Integration + performance
.\test-phase2.ps1
```

---

## 📁 Project Structure

```
Vision-Aid/
├── 📁 front -end/          # React.js 18 SPA (primary frontend)
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Route-level pages/modules
│       ├── context/        # AuthContext, SettingsContext, etc.
│       └── utils/          # API clients, helpers
├── 📁 Back-end/            # Node.js / Express REST API
│   ├── routes/             # API route handlers
│   ├── middleware/         # Auth, rate-limiting, logging
│   ├── services/           # Business logic
│   ├── models/             # Data models
│   └── server.js           # Entry point
├── 📁 yolo-service/        # Python Flask + YOLOv8 AI service
│   ├── app.py              # Main Flask application
│   ├── colors.csv          # 865-entry color name database
│   ├── yolov8s.pt          # YOLOv8s pretrained weights
│   ├── requirements.txt    # Python dependencies
│   └── train_traffic_signal.py  # Traffic model training
├── 📁 mobile-app/          # React Native (Expo) mobile app
├── 📁 browser-extension/   # Chrome browser extension
│   ├── manifest.json
│   ├── popup.html
│   └── popup.js
├── 📁 monitoring/          # Prometheus + Grafana configuration
├── 📁 dataset/             # Training datasets
├── 🐳 docker-compose.yml           # Full stack
├── 🐳 docker-compose-simple.yml    # Without monitoring
├── 🐳 docker-compose.production.yml# Production config
├── ⚙️  nginx.conf                   # Nginx reverse proxy config
├── 🔑 generate-secrets.ps1          # Secret generation script
└── 🚀 quick-start.ps1               # One-click start
```

---

## 🧠 How It Works

### Color Blindness Simulation
The simulation engine applies **4×5 color transformation matrices** (derived from Vienot et al., 1995) directly to HTML5 Canvas pixel data — supporting 9 deficiency types with full cross-browser compatibility including iOS Safari:

```
getImageData → per-pixel 4×5 matrix multiply → putImageData
```

Simulated conditions: Protanopia, Protanomaly, Deuteranopia, Deuteranomaly, Tritanopia, Tritanomaly, Achromatopsia, Achromatomaly, Normal.

### HSL Color Naming
RGB values are converted to HSL space and mapped to 865+ human-readable color names using Euclidean distance, providing natural labels like *"Dark Olive Green"* instead of raw hex codes.

### Smart Object Reclassification
A heuristic post-processing layer corrects common COCO model misclassifications using bounding box geometry (aspect ratio, area fraction) — e.g., re-labeling small square "cell phone" detections as "watch".

### LRU Caching
MD5-keyed LRU cache (capacity: 100) avoids redundant YOLOv8 inference on repeated image uploads. Live camera frames bypass caching intentionally.

---

## 🗺️ Roadmap

- [ ] **Progressive Web App (PWA)** — Offline support with TensorFlow Lite inference
- [ ] **Native Mobile App** — GPS + camera fusion for real-world traffic signal detection
- [ ] **Wearable Integration** — Smart glasses (RayBan Meta, Brilliant Labs Frame) camera streaming
- [ ] **RT-DETR Migration** — Improved small-object detection performance
- [ ] **Semantic Segmentation** — Pixel-wise color attribution using Mask R-CNN / SegFormer
- [ ] **Multilingual Voice Output** — 50+ language support via Web Speech API
- [ ] **Clinical Validation Study** — 200+ participant prospective study vs. Ishihara 38-plate standard
- [ ] **Chrome Extension** — Published to Chrome Web Store
- [ ] **Personalized CVD Calibration** — Individual severity degree input (0–1 scale)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

Please ensure your code follows existing style conventions and includes relevant tests.

---

## 📚 Research & References

This project is backed by peer-reviewed research. Key references:

- **YOLOv8s:** Jocher, G. et al. (2023). *Ultralytics YOLOv8*. [github.com/ultralytics/ultralytics](https://github.com/ultralytics/ultralytics)
- **CVD Simulation Matrices:** Vienot, F. et al. (1995). *What do colour-blind people see?* Nature, 376, 127–128.
- **Color Space Conversion:** Brettel, H. et al. (1997). *Computerized simulation of color appearance for dichromats.* JOSA A, 14(10), 2647–2655.
- **WCAG 2.1:** W3C Web Content Accessibility Guidelines 2.1. [w3.org/TR/WCAG21](https://www.w3.org/TR/WCAG21/)

Full reference list in the [research paper](VisionAid_Research_Paper.md).

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ for an inclusive digital future**

*VisionAid — Because everyone deserves to see the world in full color.*

[![GitHub Stars](https://img.shields.io/github/stars/Rahuz-007/Vision-Aid?style=social)](https://github.com/Rahuz-007/Vision-Aid)

</div>
