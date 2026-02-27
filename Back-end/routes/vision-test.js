const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { db } = require('../services/firebase');
const logger = require('../config/logger');

/**
 * @route   POST /api/vision-test/save
 * @desc    Save a vision test result for the authenticated user
 * @access  Private
 * Body: { mode, result, score, totalRounds, timeTaken, details }
 */
router.post('/save', authenticateToken, async (req, res) => {
    const { mode, result, score, totalRounds, timeTaken, details } = req.body;

    if (!mode || !result) {
        return res.status(400).json({ error: 'mode and result are required' });
    }

    try {
        const userId = req.user.userId;
        const testRef = db.collection('users').doc(userId).collection('visionTests');

        const docData = {
            mode,
            result,          // 'normal' | 'rg' | 'by' | 'mixed'
            score: score || 0,
            totalRounds: totalRounds || 0,
            timeTaken: timeTaken || 0,
            details: details || {},
            createdAt: new Date().toISOString(),
        };

        const docRef = await testRef.add(docData);

        logger.info('Vision test saved', { userId, mode, result, docId: docRef.id });

        res.status(201).json({
            success: true,
            message: 'Vision test result saved',
            data: { id: docRef.id, ...docData },
        });
    } catch (error) {
        logger.error('Save vision test error', { userId: req.user.userId, error: error.message });
        res.status(500).json({ error: 'Failed to save vision test result', message: error.message });
    }
});

/**
 * @route   GET /api/vision-test/history
 * @desc    Get last 20 vision test results for the authenticated user
 * @access  Private
 */
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const snapshot = await db
            .collection('users')
            .doc(userId)
            .collection('visionTests')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        const tests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        res.json({ success: true, data: tests });
    } catch (error) {
        logger.error('Get vision test history error', { userId: req.user.userId, error: error.message });
        res.status(500).json({ error: 'Failed to get vision test history', message: error.message });
    }
});

/**
 * @route   DELETE /api/vision-test/history
 * @desc    Clear all vision test history for the authenticated user
 * @access  Private
 */
router.delete('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const snapshot = await db
            .collection('users')
            .doc(userId)
            .collection('visionTests')
            .limit(100)
            .get();

        const batch = db.batch();
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();

        logger.info('Vision test history cleared', { userId });
        res.json({ success: true, message: 'Vision test history cleared' });
    } catch (error) {
        logger.error('Clear vision test history error', { userId: req.user.userId, error: error.message });
        res.status(500).json({ error: 'Failed to clear history', message: error.message });
    }
});

module.exports = router;
