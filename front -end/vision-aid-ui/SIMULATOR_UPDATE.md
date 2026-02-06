# Color Blindness Simulator Update 🌈

## ✅ **New Features Added**

I have expanded the Color Blindness Simulator to include **4 new deficiency types**, bringing the total to **9 simulation modes**.

### **Newly Added Modes:**

1.  **🟠 Protanomaly (Red-weakness)**
    *   *Simulates reduced sensitivity to red light.*
    *   *Affects ~1% of males.*

2.  **🟡 Deuteranomaly (Green-weakness)**
    *   *Simulates reduced sensitivity to green light.*
    *   *The most common color deficiency (affects ~5% of males).*

3.  **💙 Tritanomaly (Blue-weakness)**
    *   *Simulates reduced sensitivity to blue light.*
    *   *Very rare condition.*

4.  **⚪ Achromatomaly (Partial Color Blindness)**
    *   *Simulates severely reduced color perception, but not total monochromacy.*
    *   *Very rare.*

---

## 📋 **Full List of Available Modes**

| Mode | Type | Description |
| :--- | :--- | :--- |
| **Normal Vision** | Standard | Full color spectrum |
| **Protanopia** | Dichromacy | Red-blind (missing L-cones) |
| **Protanomaly** | Anomalous Trichromacy | Red-weak (malfunctioning L-cones) |
| **Deuteranopia** | Dichromacy | Green-blind (missing M-cones) |
| **Deuteranomaly** | Anomalous Trichromacy | Green-weak (malfunctioning M-cones) |
| **Tritanopia** | Dichromacy | Blue-blind (missing S-cones) |
| **Tritanomaly** | Anomalous Trichromacy | Blue-weak (malfunctioning S-cones) |
| **Achromatopsia** | Monochromacy | Total color blindness (Grayscale) |
| **Achromatomaly** | Monochromacy | Partial color blindness |

---

## 🛠️ **Technical Details**

*   **File Modified:** `src/components/features/ColorBlindnessSimulator/ColorBlindnessSimulator.js`
*   **Logic:** The filter logic for these new modes was already present in `colorBlindnessFilters.js` but was hidden from the UI. I have enabled them by adding them to the selection list.
*   **UI:** The new buttons will automatically appear in the horizontal scroll menu in the simulator.

---

**Enjoy testing the new simulation modes!** 🚀
