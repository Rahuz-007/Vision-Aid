const Joi = require('joi');

/**
 * Validation schema for user registration
 */
const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long',
        'any.required': 'Password is required'
    }),
    name: Joi.string().min(2).max(50).optional(),
});

/**
 * Validation schema for user login
 */
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

/**
 * Validation schema for traffic signal detection
 */
const detectionSchema = Joi.object({
    color: Joi.string().valid('red', 'yellow', 'green', 'unknown').required(),
    confidence: Joi.number().min(0).max(1).required(),
    detectionMode: Joi.string().valid('live', 'upload').default('live'),
    sessionId: Joi.string().optional(),
});

/**
 * Validation schema for updating user preferences
 */
const preferencesSchema = Joi.object({
    accessibility: Joi.object({
        highContrast: Joi.boolean(),
        largeText: Joi.boolean(),
        reduceMotion: Joi.boolean(),
        voiceFeedback: Joi.boolean(),
    }).optional(),
    detection: Joi.object({
        autoDetect: Joi.boolean(),
        confidenceThreshold: Joi.number().min(0).max(1),
        saveHistory: Joi.boolean(),
    }).optional(),
    notifications: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
    }).optional(),
    theme: Joi.object({
        mode: Joi.string().valid('light', 'dark', 'auto'),
        accentColor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
    }).optional(),
});

/**
 * Middleware to validate request body against a schema
 */
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors
            stripUnknown: true, // Remove unknown fields
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
            }));

            return res.status(400).json({
                error: 'Validation failed',
                details: errors,
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

module.exports = {
    registerSchema,
    loginSchema,
    detectionSchema,
    preferencesSchema,
    validate,
};
