# 🧪 Vision Aid - Accessibility Testing Guide

## 1. Traffic Signal Detector
**URL:** `/traffic-signal`

### **Feature Checklist:**
- [ ] **Camera:** Activates and shows feed clearly.
- [ ] **Shape Recognition:**
    - Point at Red item → Shows **Circle** ⚫ (and "Red Light").
    - Point at Yellow item → Shows **Diamond** ◆ (and "Yellow Light").
    - Point at Green item → Shows **Triangle** ▶ (and "Green Light").
- [ ] **Audio:**
    - Hear unique tone for Red (Low), Yellow (Mid), Green (High).
    - Voice announces the signal name.
- [ ] **History:** Sidebar updates with each detection.

---

## 2. Accurate Color Detector
**URL:** `/color-picker` (Live Mode)

### **Feature Checklist:**
- [ ] **Database:** "Database ready with 800+ accurate colors" appears in header.
- [ ] **Precision Naming:**
    - Point at a specific blue → Shows "Royal Blue" or "Navy Blue" (not just "Blue").
    - Point at a specific red → Shows "Crimson" or "Brick Red" (not just "Red").
- [ ] **Accessibility Context:**
    - Even with a fancy name, does it still show the **Safety Icon**? (e.g. Crimson = 🛑).
    - Does it show the **Pattern**? (e.g. Crimson = ●).
- [ ] **Targeting:**
    - Is the white circle visible in the center?
    - Does the inner dot change color to match the object?

### **Troubleshooting:**
- **App Crash:** If the app crashed, refresh the page. (We just installed a new dependency `papaparse`).
- **No Colors:** Ensure `public/colors.csv` exists and is readable.

---

## 3. General Accessibility
- [ ] **Contrast:** Text is legible on dark backgrounds.
- [ ] **Voice:** "Speak" buttons work on both pages.
- [ ] **Responsiveness:** Layouts adjust to mobile vs desktop.
