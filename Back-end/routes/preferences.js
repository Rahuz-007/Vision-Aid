const express = require('express');
const router = express.Router();
const UserPreferences = require('../models/UserPreferences');
const { authenticateToken } = require('../middleware/auth');
const { validate, preferencesSchema } = require('../middleware/validation');
const logger = require('../config/logger');

/**
 * @route   GET /api/preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get('/', authenticateToken, async (req, res) => {
    try {
        const preferences = await UserPreferences.getOrCreate(req.user.userId);

        res.json({
            success: true,
            data: preferences,
        });
    } catch (error) {
        logger.error('Get preferences error', { userId: req.user.userId, error: error.message });
        res.status(500).json({
            error: 'Failed to get preferences',
            message: error.message,
        });
    }
});

/**
 * @route   PUT /api/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/', authenticateToken, validate(preferencesSchema), async (req, res) => {
    try {
        const preferences = await UserPreferences.findOneAndUpdate(
            { userId: req.user.userId },
            req.body,
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        logger.info('Preferences updated', { userId: req.user.userId });

        res.json({
            success: true,
            message: 'Preferences updated successfully',
            data: preferences,
        });
    } catch (error) {
        logger.error('Update preferences error', { userId: req.user.userId, error: error.message });
        res.status(500).json({
            error: 'Failed to update preferences',
            message: error.message,
        });
    }
});

/**
 * @route   DELETE /api/preferences
 * @desc    Reset preferences to default
 * @access  Private
 */
router.delete('/', authenticateToken, async (req, res) => {
    try {
        await UserPreferences.findOneAndDelete({ userId: req.user.userId });

        // Create new default preferences
        const preferences = await UserPreferences.create({ userId: req.user.userId });

        logger.info('Preferences reset to default', { userId: req.user.userId });

        res.json({
            success: true,
            message: 'Preferences reset to default',
            data: preferences,
        });
    } catch (error) {
        logger.error('Reset preferences error', { userId: req.user.userId, error: error.message });
        res.status(500).json({
            error: 'Failed to reset preferences',
            message: error.message,
        });
    }
});

module.exports = router;
