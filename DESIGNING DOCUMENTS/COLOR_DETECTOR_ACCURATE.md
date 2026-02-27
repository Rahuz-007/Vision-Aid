# 🎯 Accurate Color Detector - Documentation

## Overview
The Color Detector has been upgraded to "Precision Mode". It now uses a comprehensive database of **800+ standard colors** to provide the exact name of any color you point the camera at, while still maintaining all accessibility features for color blind users.

---

## ✨ What's New

### **1. Precision Naming** 🎯
Instead of generic buckets (e.g., "Light Blue"), the detector now identifies specific shades:
- "Royal Blue"
- "Cornflower Blue"
- "Midnight Blue"
- "Salmon"
- "Turquoise"

It uses a **Nearest Neighbor Algorithm** to compare the camera's RGB input against every single color in the `colors.csv` database to find the mathematically closest match.

### **2. hybrid Accessibility Context** 🧠
We combine **Precision** with **Context**:
- **Name:** "Persian Verdigris" (Accurate)
- **Category:** "Green/Teal Hue" (Context)
- **Safety:** "Safe/Go Signal" 🟢 (Actionable)
- **Description:** "Like water or sky" (Relatable)

This ensures you get the *specific* name (useful for shopping/design) without losing the *general* understanding (useful for safety/navigation).

### **3. Performance Optimized** ⚡
- **CSV Loading:** The database loads asynchronously when the component mounts.
- **Smart Sampling:** We sample the center 20x20 pixels to average out camera noise, ensuring we don't pick up a stray pixel of noise.
- **Debounced Updates:** The detection runs at a steady pace (400ms) to prevent the text from flickering too rapidly between similar shades.

---

## 🛠️ How It Works

1.  **Load:** On startup, `colors.csv` is fetched and parsed into memory.
2.  **Capture:** The camera captures a frame.
3.  **Average:** The center point is averaged to get a stable `(R, G, B)` value.
4.  **Search:** The algorithm calculates the Euclidean distance between the current color and all 800+ database colors.
    *   `Distance = mod(Color1 - Color2)`
5.  **Match:** The color with the smallest distance is selected as the name.
6.  **Contextualize:** The `(R, G, B)` is also analyzed for Hue/Saturation/Brightness to assign safety icons (🛑/⚠️/🟢) and patterns.

---

## 🚦 Safety Features (Retained)

| Hue Range | Meaning | Icon | Pattern |
| :--- | :--- | :--- | :--- |
| **Red** | Danger / Stop | 🛑 | ● |
| **Yellow** | Caution / Warning | ⚠️ | ■ |
| **Orange** | Alert | 🟠 | ◆ |
| **Green** | Safe / Go | 🟢 | ▲ |
| **Blue/Purple** | Neutral / Info | ℹ️ | ▼ |

---

**Status:** ✅ **Accurate & Typesafe**
**Database:** `colors.csv` (866 entries)
