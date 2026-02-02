const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Middleware to authenticate JWT tokens
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        logger.warn('Access attempt without token', {
            ip: req.ip,
            url: req.originalUrl
        });
        return res.status(401).json({
            error: 'Access token required',
            message: 'Please provide a valid authentication token'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, user) => {
        if (err) {
            logger.warn('Invalid token attempt', {
                ip: req.ip,
                error: err.message
            });
            return res.status(403).json({
                error: 'Invalid token',
                message: 'Your session has expired or token is invalid'
            });
        }

        req.user = user;
        logger.debug('User authenticated', { userId: user.userId, email: user.email });
        next();
    });
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production', (err, user) => {
        if (!err) {
            req.user = user;
        }
        next();
    });
};

module.exports = {
    authenticateToken,
    optionalAuth
};
