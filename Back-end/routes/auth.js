const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../config/logger');
const passport = require('passport');
const { admin } = require('../services/firebase');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), async (req, res) => {
    try {
        const { email, password, name } = req.body;


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists',
                message: 'An account with this email already exists',
            });
        }


        const user = new User({
            email,
            password,
            name,
        });
        user._passwordModified = true;

        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        logger.info('New user registered', { userId: user._id, email: user.email });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        logger.error('Registration error', { error: error.message });
        res.status(500).json({
            error: 'Registration failed',
            message: error.message,
        });
    }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findByCredentials(email, password);


        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = user.generateAuthToken();

        logger.info('User logged in', { userId: user._id, email: user.email });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    lastLogin: user.lastLogin,
                },
            },
        });
    } catch (error) {
        logger.warn('Login attempt failed', { email: req.body.email, error: error.message });
        res.status(401).json({
            error: 'Login failed',
            message: 'Invalid email or password',
        });
    }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        res.json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
            },
        });
    } catch (error) {
        logger.error('Get user error', { error: error.message });
        res.status(500).json({
            error: 'Failed to get user',
            message: error.message,
        });
    }
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/update-profile', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                error: 'User not found',
            });
        }

        logger.info('User profile updated', { userId: user._id });

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        logger.error('Update profile error', { error: error.message });
        res.status(500).json({
            error: 'Failed to update profile',
            message: error.message,
        });
    }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticateToken, (req, res) => {
    logger.info('User logged out', { userId: req.user.userId });

    res.json({
        success: true,
        message: 'Logout successful',
    });
});


router.get('/test', (req, res) => res.send('Auth route is working'));

router.get('/google', (req, res, next) => {
    logger.info('Attempting Google Login');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

        if (err) {
            logger.error('Google Auth Error', { error: err ? err.message : 'Unknown error' });
            return res.redirect(`${frontendUrl}/login?error=server_error`);
        }
        if (!user) {
            logger.warn('Google Auth Failed: No user');
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }

        req.user = user;


        try {
            const token = req.user.generateAuthToken();
            res.redirect(`${frontendUrl}?token=${token}&login=success`);
        } catch (error) {
            logger.error('Token Generation Error', { error: error.message });
            res.redirect(`${frontendUrl}/login?error=token_error`);
        }
    })(req, res, next);
});


router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', { session: false }, (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

        if (err) {
            logger.error('GitHub Auth Error', { error: err ? err.message : 'Unknown error' });
            return res.redirect(`${frontendUrl}/login?error=server_error`);
        }
        if (!user) {
            logger.warn('GitHub Auth Failed: No user');
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }

        req.user = user;

        try {
            const token = req.user.generateAuthToken();
            res.redirect(`${frontendUrl}?token=${token}&login=success`);
        } catch (error) {
            logger.error('Token Generation Error', { error: error.message });
            res.redirect(`${frontendUrl}/login?error=token_error`);
        }
    })(req, res, next);
});

/**
 * @route   POST /api/auth/firebase-login
 * @desc    Login/Register with Firebase Token
 * @access  Public
 */
router.post('/firebase-login', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        // Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, name, uid, picture } = decodedToken;

        if (!email) {
            return res.status(400).json({ error: 'Email is required in Firebase token' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // Update user info if needed
            user.lastLogin = new Date();
            if (!user.firebaseUid) user.firebaseUid = uid;
            if (picture && !user.avatar) user.avatar = picture;
            await user.save();
        } else {
            // Create new user
            user = new User({
                email,
                name: name || email.split('@')[0],
                firebaseUid: uid,
                password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8), // Dummy password
                isVerified: true, // Firebase emails are verified
                avatar: picture
            });
            await user.save();
            logger.info('New user registered via Firebase', { userId: user._id });
        }

        // Generate Backend Token
        const backendToken = user.generateAuthToken();

        logger.info('User logged in via Firebase', { userId: user._id });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: backendToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    lastLogin: user.lastLogin,
                    avatar: user.avatar
                },
            },
        });

    } catch (error) {
        logger.error('Firebase Login Error', { error: error.message });
        res.status(401).json({
            error: 'Authentication failed',
            message: error.message,
        });
    }
});

module.exports = router;
