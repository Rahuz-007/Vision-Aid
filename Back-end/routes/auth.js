const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const { logger } = require('../config/logger');
const passport = require('passport');
const { admin } = require('../services/firebase');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');
const rateLimit = require('express-rate-limit');

// ─── Rate limiters specific to sensitive auth actions ─────────────────────────
const forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 forgot-password attempts per IP
    message: { error: 'Too many password reset requests. Please wait 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const refreshTokenLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // 10 refresh attempts per minute per IP
    message: { error: 'Too many token refresh attempts. Slow down.' },
});

/**
 * @route   POST /api/auth/register
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

        const user = new User({ email, password, name });
        user._passwordModified = true;

        // Generate email verification token
        const verificationToken = user.generateVerificationToken();

        // Generate refresh token
        const refreshToken = user.generateRefreshToken();

        await user.save();

        // Generate short-lived access token
        const token = user.generateAuthToken();

        // Send verification email (non-blocking)
        sendVerificationEmail(email, name, verificationToken).catch(err =>
            logger.warn('Verification email failed (non-fatal)', { error: err.message })
        );

        logger.info('New user registered', { userId: user._id, email: user.email });

        res.status(201).json({
            success: true,
            message: 'User registered successfully. Please check your email to verify your account.',
            data: {
                token,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    isVerified: user.isVerified,
                    createdAt: user.createdAt,
                },
            },
        });
    } catch (error) {
        logger.error('Registration error', { error: error.message });
        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
});

/**
 * @route   POST /api/auth/login
 */
router.post('/login', validate(loginSchema), async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByCredentials(email, password);

        user.lastLogin = new Date();

        // Issue new refresh token on every login
        const refreshToken = user.generateRefreshToken();
        await user.save();

        const token = user.generateAuthToken();

        logger.info('User logged in', { userId: user._id, email: user.email });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    isVerified: user.isVerified,
                    lastLogin: user.lastLogin,
                },
            },
        });
    } catch (error) {
        logger.warn('Login attempt failed', { email: req.body.email, error: error.message });
        res.status(401).json({ error: 'Login failed', message: 'Invalid email or password' });
    }
});

/**
 * @route   POST /api/auth/refresh
 * @desc    Get a new access token using a refresh token (silent token refresh)
 */
router.post('/refresh', refreshTokenLimiter, async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        const user = await User.findByRefreshToken(refreshToken);
        if (!user) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Check expiry
        if (new Date(user.refreshTokenExpires) < new Date()) {
            // Clear the expired token
            user.refreshToken = null;
            user.refreshTokenExpires = null;
            await user.save();
            return res.status(403).json({ error: 'Refresh token expired. Please log in again.' });
        }

        // Rotate refresh token (one-use)
        const newRefreshToken = user.generateRefreshToken();
        await user.save();

        const newAccessToken = user.generateAuthToken();

        logger.info('Token refreshed', { userId: user._id });

        res.json({
            success: true,
            data: {
                token: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        logger.error('Token refresh error', { error: error.message });
        res.status(500).json({ error: 'Token refresh failed' });
    }
});

/**
 * @route   GET /api/auth/verify-email?token=...
 * @desc    Verify user's email address
 */
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).json({ error: 'Verification token required' });
        }

        const user = await User.findByVerificationToken(token);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or already used verification token' });
        }

        // Check expiry
        if (new Date(user.verificationExpires) < new Date()) {
            return res.status(400).json({
                error: 'Verification link has expired',
                message: 'Please request a new verification email',
            });
        }

        // Mark as verified
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationExpires = null;
        await user.save();

        logger.info('Email verified', { userId: user._id, email: user.email });

        res.json({
            success: true,
            message: 'Email verified successfully! You can now log in.',
        });
    } catch (error) {
        logger.error('Email verification error', { error: error.message });
        res.status(500).json({ error: 'Verification failed', message: error.message });
    }
});

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend verification email
 */
router.post('/resend-verification', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.isVerified) return res.status(400).json({ error: 'Email already verified' });

        const token = user.generateVerificationToken();
        await user.save();

        await sendVerificationEmail(user.email, user.name, token);

        res.json({ success: true, message: 'Verification email resent. Please check your inbox.' });
    } catch (error) {
        logger.error('Resend verification error', { error: error.message });
        res.status(500).json({ error: 'Failed to resend verification email' });
    }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 */
router.post('/forgot-password', forgotPasswordLimiter, async (req, res) => {
    // Always return success to prevent email enumeration
    const GENERIC_SUCCESS = { success: true, message: 'If that email exists, a reset link has been sent.' };

    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) {
            // Do NOT reveal whether the account exists
            return res.json(GENERIC_SUCCESS);
        }

        const token = user.generateResetToken();
        await user.save();

        await sendPasswordResetEmail(user.email, user.name, token);

        logger.info('Password reset requested', { userId: user._id, email: user.email });
        res.json(GENERIC_SUCCESS);
    } catch (error) {
        logger.error('Forgot password error', { error: error.message });
        // Still return generic success to avoid leaking info
        res.json(GENERIC_SUCCESS);
    }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 */
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required' });
        }
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' });
        }

        const user = await User.findByResetToken(token);
        if (!user) {
            return res.status(400).json({ error: 'Invalid or already used reset token' });
        }

        if (new Date(user.resetExpires) < new Date()) {
            return res.status(400).json({
                error: 'Reset link has expired',
                message: 'Please request a new password reset',
            });
        }

        // Update password
        user.password = password;
        user._passwordModified = true;
        user.resetToken = null;
        user.resetExpires = null;
        // Invalidate all refresh tokens on password change
        user.refreshToken = null;
        user.refreshTokenExpires = null;
        await user.save();

        logger.info('Password reset successful', { userId: user._id });
        res.json({ success: true, message: 'Password reset successfully. Please log in with your new password.' });
    } catch (error) {
        logger.error('Reset password error', { error: error.message });
        res.status(500).json({ error: 'Password reset failed', message: error.message });
    }
});

/**
 * @route   GET /api/auth/me
 */
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

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
        res.status(500).json({ error: 'Failed to get user', message: error.message });
    }
});

/**
 * @route   PUT /api/auth/update-profile
 */
router.put('/update-profile', authenticateToken, async (req, res) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(req.user.userId, { name }, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ error: 'User not found' });

        logger.info('User profile updated', { userId: user._id });
        res.json({ success: true, message: 'Profile updated successfully', data: { id: user._id, email: user.email, name: user.name } });
    } catch (error) {
        logger.error('Update profile error', { error: error.message });
        res.status(500).json({ error: 'Failed to update profile', message: error.message });
    }
});

/**
 * @route   POST /api/auth/logout
 */
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // Invalidate refresh token on logout
        const user = await User.findById(req.user.userId);
        if (user) {
            user.refreshToken = null;
            user.refreshTokenExpires = null;
            await user.save();
        }
        logger.info('User logged out', { userId: req.user.userId });
        res.json({ success: true, message: 'Logout successful' });
    } catch (error) {
        res.json({ success: true, message: 'Logout successful' }); // Always succeed logout
    }
});

router.get('/test', (req, res) => res.send('Auth route is working'));

// ─── OAuth Routes ──────────────────────────────────────────────────────────────
router.get('/google', (req, res, next) => {
    logger.info('Attempting Google Login');
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        if (err || !user) {
            logger.error('Google Auth Error', { error: err ? err.message : 'No user' });
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }
        req.user = user;
        try {
            const token = req.user.generateAuthToken();
            const refreshToken = req.user.generateRefreshToken();
            await req.user.save();
            res.redirect(`${frontendUrl}?token=${token}&refreshToken=${refreshToken}&login=success`);
        } catch (error) {
            res.redirect(`${frontendUrl}/login?error=token_error`);
        }
    })(req, res, next);
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', (req, res, next) => {
    passport.authenticate('github', { session: false }, async (err, user, info) => {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
        if (err || !user) {
            logger.error('GitHub Auth Error', { error: err ? err.message : 'No user' });
            return res.redirect(`${frontendUrl}/login?error=auth_failed`);
        }
        req.user = user;
        try {
            const token = req.user.generateAuthToken();
            const refreshToken = req.user.generateRefreshToken();
            await req.user.save();
            res.redirect(`${frontendUrl}?token=${token}&refreshToken=${refreshToken}&login=success`);
        } catch (error) {
            res.redirect(`${frontendUrl}/login?error=token_error`);
        }
    })(req, res, next);
});

/**
 * @route   POST /api/auth/firebase-login
 */
router.post('/firebase-login', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ error: 'Token is required' });

        const decodedToken = await admin.auth().verifyIdToken(token);
        const { email, name, uid, picture } = decodedToken;

        if (!email) return res.status(400).json({ error: 'Email is required in Firebase token' });

        let user = await User.findOne({ email });
        if (user) {
            user.lastLogin = new Date();
            if (!user.firebaseUid) user.firebaseUid = uid;
            if (picture && !user.avatar) user.avatar = picture;
        } else {
            user = new User({
                email,
                name: name || email.split('@')[0],
                firebaseUid: uid,
                password: require('crypto').randomBytes(24).toString('hex'),
                isVerified: true,
                avatar: picture
            });
            logger.info('New user registered via Firebase', { email });
        }

        const refreshToken = user.generateRefreshToken();
        await user.save();
        const backendToken = user.generateAuthToken();

        logger.info('User logged in via Firebase', { userId: user._id });

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                token: backendToken,
                refreshToken,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    isVerified: user.isVerified,
                    lastLogin: user.lastLogin,
                    avatar: user.avatar
                },
            },
        });
    } catch (error) {
        logger.error('Firebase Login Error', { error: error.message });
        res.status(401).json({ error: 'Authentication failed', message: error.message });
    }
});

module.exports = router;
