# 🎨 Vision Aid - Color Accessibility Platform

> Empowering everyone to see and understand colors through advanced AI and accessibility tools.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.x-blue)
![Node](https://img.shields.io/badge/Node-16+-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

Vision Aid is a comprehensive color accessibility platform designed to help individuals with color vision deficiencies and anyone who needs accurate color identification. Built with cutting-edge AI technology and modern web standards.

### 🎯 Mission

Make color information accessible to everyone, regardless of their vision capabilities.

---

## ✨ Features

### 🎨 Color Picker
- **Native Browser Integration** - Uses HTML5 color picker for maximum compatibility
- **Instant Color Names** - Get human-readable color names instantly
- **Voice Announcements** - Hear color names through text-to-speech
- **Color History** - Save and track your favorite colors
- **Quick Palette** - 24 pre-selected colors for quick access

### 👁️ Color Blindness Simulator
- **Multiple Types** - Simulate 4 types of color blindness
- **Real-time Preview** - See how colors appear to others
- **Educational** - Learn about different vision deficiencies

### ✅ Contrast Checker
- **WCAG Compliance** - Check if color combinations meet accessibility standards
- **Real-time Feedback** - Instant contrast ratio calculations
- **Recommendations** - Get suggestions for better combinations

### 🎨 Palette Checker
- **Multi-color Analysis** - Analyze entire color palettes
- **Harmony Detection** - Find complementary and analogous colors
- **Export Options** - Save palettes for later use

### 🚦 Traffic Signal Detector
- **AI-Powered** - YOLOv8 object detection
- **Real-time** - Live camera feed analysis
- **Safety Features** - Audio alerts and distance estimation
- **Color Detection** - Identifies red, yellow, and green signals

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org/))
- **Python** 3.8+ ([Download](https://www.python.org/))
- **Git** ([Download](https://git-scm.com/))

### One-Command Start

```powershell
# Windows
.\quick-start.ps1

# This will:
# 1. Install all dependencies
# 2. Start backend server (port 3001)
# 3. Start frontend app (port 3000)
# 4. Start YOLO service (port 5000)
```

### Manual Start

```bash
# 1. Frontend
cd "front -end\vision-aid-ui"
npm install
npm start

# 2. Backend (new terminal)
cd Back-end
npm install
npm start

# 3. YOLO Service (new terminal)
cd yolo-service
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python app.py
```

---

## 📦 Installation

### 1. Clone Repository

\`\`\`bash
git clone https://github.com/yourusername/vision-aid.git
cd vision-aid
\`\`\`

### 2. Environment Setup

\`\`\`bash
# Frontend
cd "front -end/vision-aid-ui"
cp .env.example .env
# Edit .env with your Firebase credentials
\`\`\`

### 3. Install Dependencies

\`\`\`bash
# Frontend
cd "front -end/vision-aid-ui"
npm install

# Backend
cd ../../Back-end
npm install

# YOLO Service
cd ../yolo-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
\`\`\`

### 4. Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Google Sign-In)
3. Copy your config to `.env`

---

## 💻 Usage

### Accessing the App

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **YOLO Service**: [http://localhost:5000](http://localhost:5000)

### Color Picker

1. Navigate to **Color Picker** in the menu
2. Click the color selector or enter a HEX code
3. Hear the color name announced
4. Click "Save" to add to history
5. Download color swatches as images

### Traffic Signal Detector

1. Navigate to **Traffic Signals** in the menu
2. Click "Start Camera"
3. Point camera at traffic lights
4. Receive real-time detection and audio alerts

---

## 🏗️ Architecture

\`\`\`
┌─────────────────────────────────────────────────────────┐
│                     Vision Aid                          │
├─────────────┬──────────────┬────────────────────────────┤
│  Frontend   │   Backend    │      YOLO Service          │
│  (React)    │   (Node.js)  │      (Python/Flask)        │
│  Port 3000  │   Port 3001  │      Port 5000             │
├─────────────┼──────────────┼────────────────────────────┤
│             │              │                            │
│ • Color     │ • Auth       │ • Object Detection         │
│   Picker    │ • User Data  │ • Color Analysis           │
│ • Simulator │ • API Routes │ • Traffic Light Detection  │
│ • Checker   │              │                            │
│ • Palette   │              │                            │
└─────────────┴──────────────┴────────────────────────────┘
\`\`\`

### Tech Stack

**Frontend:**
- React 18
- React Router
- Framer Motion
- TailwindCSS
- Firebase Auth

**Backend:**
- Node.js
- Express
- Firebase Admin

**AI Service:**
- Python
- Flask
- YOLOv8
- OpenCV
- NumPy

---

## 📁 Project Structure

\`\`\`
vision-aid/
├── front -end/
│   └── vision-aid-ui/
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   │   ├── features/
│       │   │   │   ├── ColorPicker/
│       │   │   │   ├── ColorBlindnessSimulator/
│       │   │   │   ├── ContrastChecker/
│       │   │   │   ├── PaletteChecker/
│       │   │   │   └── TrafficSignalDetector/
│       │   │   ├── layout/
│       │   │   └── common/
│       │   ├── context/
│       │   ├── pages/
│       │   └── utils/
│       └── package.json
├── Back-end/
│   ├── routes/
│   ├── models/
│   └── server.js
├── yolo-service/
│   ├── app.py
│   ├── colors.csv
│   └── requirements.txt
└── README.md
\`\`\`

---

## 🧪 Testing

\`\`\`bash
# Frontend tests
cd "front -end/vision-aid-ui"
npm test

# Backend tests
cd Back-end
npm test

# E2E tests
npm run test:e2e
\`\`\`

---

## 🚀 Deployment

### Vercel (Frontend)

\`\`\`bash
npm install -g vercel
cd "front -end/vision-aid-ui"
vercel
\`\`\`

### Heroku (Backend + YOLO)

\`\`\`bash
heroku create vision-aid-api
git push heroku main
\`\`\`

### Docker

\`\`\`bash
docker-compose up -d
\`\`\`

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Development Team** - Full-stack development
- **AI Team** - YOLO integration and optimization
- **UX Team** - Accessibility and design

---

## 📧 Contact

- **Email**: support@visionaid.com
- **Website**: [https://visionaid.com](https://visionaid.com)
- **GitHub**: [https://github.com/yourusername/vision-aid](https://github.com/yourusername/vision-aid)

---

## 🙏 Acknowledgments

- YOLOv8 by Ultralytics
- Color database from Meyer's Color Dataset
- Icons from React Icons
- UI inspiration from modern design systems

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/vision-aid)
![GitHub forks](https://img.shields.io/github/forks/yourusername/vision-aid)
![GitHub issues](https://img.shields.io/github/issues/yourusername/vision-aid)

---

**Made with ❤️ for accessibility**
