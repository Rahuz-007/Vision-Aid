const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Detection Schema
const detectionSchema = new mongoose.Schema({
    color: { type: String, required: true },
    confidence: { type: Number, required: true },
    distance: { type: Number },
    detectionMode: { type: String, enum: ['live', 'upload'], default: 'live' },
    sessionId: { type: String },
    timestamp: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isCorrect: { type: Boolean, default: true } // For misclassification reporting
});

const Detection = mongoose.model('Detection', detectionSchema);

// @route   POST api/traffic-signal/detect
// @desc    Store detection result
router.post('/detect', async (req, res) => {
    try {
        const { color, confidence, distance, detectionMode, sessionId } = req.body;

        const newDetection = new Detection({
            color,
            confidence,
            distance,
            detectionMode,
            sessionId,
            userId: req.user ? req.user.id : null
        });

        await newDetection.save();
        res.json({ success: true, data: newDetection });
    } catch (err) {
        console.error('Error saving detection:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// @route   POST api/traffic-signal/report
// @desc    Report misclassification
router.post('/report', async (req, res) => {
    try {
        const { detectionId, actualColor } = req.body;

        const detection = await Detection.findById(detectionId);
        if (!detection) {
            return res.status(404).json({ success: false, error: 'Detection not found' });
        }

        detection.isCorrect = false;
        // We could store the actualColor for retraining later
        await detection.save();

        res.json({ success: true, message: 'Thank you for your feedback' });
    } catch (err) {
        console.error('Error reporting detection:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;
