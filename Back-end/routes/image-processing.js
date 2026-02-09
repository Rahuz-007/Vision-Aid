const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const { Buffer } = require('buffer');
const axios = require('axios');
const FormData = require('form-data');

const PYTHON_SERVICE_URL = process.env.YOLO_SERVICE_URL || 'http://127.0.0.1:5000';

// Helper to send image for color detection to Python service
async function sendToPythonColorService(endpoint, imageBuffer, filename = 'image.png') {
    try {
        const form = new FormData();
        form.append('image', imageBuffer, { filename });

        // Use full URL
        const fullUrl = `${PYTHON_SERVICE_URL}${endpoint}`;

        const response = await axios.post(fullUrl, form, {
            headers: {
                ...form.getHeaders()
            },
            timeout: 5000 // 5s timeout
        });
        return response.data;
    } catch (error) {
        // Only log error, don't throw, so we can fallback
        // console.error(`Python service error [${endpoint}]:`, error.message);
        return null;
    }
}

// Helper to send image for object detection
async function sendToPythonObjectService(endpoint, imageBuffer, filename = 'image.png', type = 'traffic') {
    try {
        const form = new FormData();
        form.append('image', imageBuffer, { filename });
        form.append('type', type);

        const fullUrl = `${PYTHON_SERVICE_URL}${endpoint}`;

        const response = await axios.post(fullUrl, form, {
            headers: {
                ...form.getHeaders()
            },
            timeout: 8000 // Slightly longer timeout for detection
        });
        return response.data;
    } catch (error) {
        console.error(`Python object detection error:`, error.message);
        return null;
    }
}


router.post('/process-color', async (req, res) => {
    try {
        const { imageBase64 } = req.body;

        if (!imageBase64) {
            return res.status(400).json({ error: 'No image provided' });
        }

        const buffer = Buffer.from(imageBase64, 'base64');

        // 1. Try Python Service first (Best accuracy, uses database)
        // Note: The Python service expects the full image usually, but if we send a 1x1 crop it works too.
        // However, Python service is optimized to find "dominant color in center".

        const pythonResult = await sendToPythonColorService('/detect-color', buffer);

        if (pythonResult && pythonResult.rgb) {
            return res.json({
                r: pythonResult.rgb.r,
                g: pythonResult.rgb.g,
                b: pythonResult.rgb.b,
                name: pythonResult.color_name, // "Red", "Dark Blue", etc.
                hex: pythonResult.hex
            });
        }

        // 2. Fallback to Sharp (Simple averaging) if Python service is down

        // Get metadata to find dimensions
        const metadata = await sharp(buffer).metadata();
        const width = metadata.width;
        const height = metadata.height;

        // Simple resizing to 1x1 to get average color
        const { data, info } = await sharp(buffer)
            .resize(1, 1, { fit: 'cover' })
            .raw()
            .toBuffer({ resolveWithObject: true });

        // data is raw RGB/RGBA pixels
        const r = data[0];
        const g = data[1];
        const b = data[2];

        res.json({ r, g, b, fallback: true });
    } catch (error) {
        console.error('Error processing color:', error);
        res.status(500).json({ error: 'Processing failed' });
    }
});

router.post('/detect-object', async (req, res) => {
    try {
        const { imageBase64 } = req.body;
        if (!imageBase64) return res.status(400).json({ error: 'No image provided' });

        const buffer = Buffer.from(imageBase64, 'base64');

        // Try Python Service
        const pythonResult = await sendToPythonObjectService('/detect', buffer, 'image.jpg', 'traffic');

        if (pythonResult) {
            return res.json(pythonResult);
        }

        res.status(503).json({ error: 'Detection service unavailable', fallback: false });
    } catch (error) {
        console.error('Error detecting object:', error);
        res.status(500).json({ error: 'Detection failed' });
    }
});

module.exports = router;
