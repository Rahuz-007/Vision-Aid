# Vision Aid - Critical Service URLs

## 1. Web Frontend (UI)
This is the main dashboard you open in Google Chrome on your computer or mobile device.

*   **Local Access (PC):** `https://localhost:3000`
*   **Mobile / Network Access:** `https://192.168.1.8:3000`
    *   **Note:** When opening this, you will see a privacy warning. Click **Advanced** -> **Proceed to 192.168.1.8 (unsafe)** to access the camera features.

## 2. Backend API server
This is the Node.js server that handles data, authentication, and communication between the frontend/mobile app and the AI.

*   **Base URL:** `http://192.168.1.8:3001`
*   **Health Check Endpoint:** `http://192.168.1.8:3001/`
    *   *(Should return JSON: "Vision Aid API is running")*

## 3. YOLO AI Service (Python)
This is the object detection engine running in the background. It processes images to find traffic lights and objects.

*   **Service URL:** `http://localhost:5000`
*   **Note:** This is an internal service used by the Backend. It is not typically accessed directly by users.

---

### Mobile App Configuration
Ensure your mobile app `src/config.js` is set to:
```javascript
export const API_URL = 'http://192.168.1.8:3001';
```
*(Confimed: This is currently set correctly in your codebase)*.
