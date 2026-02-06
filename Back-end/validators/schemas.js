/**
 * Input Validation Schemas
 * Uses Joi for request validation
 */

const Joi = require('joi');

/**
 * Authentication Schemas
 */
const authSchemas = {
    // Sign up validation
    signup: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),

        password: Joi.string()
            .min(8)
            .max(128)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
                'string.min': 'Password must be at least 8 characters long',
                'string.max': 'Password cannot exceed 128 characters',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                'any.required': 'Password is required'
            }),

        displayName: Joi.string()
            .min(2)
            .max(100)
            .optional()
            .messages({
                'string.min': 'Display name must be at least 2 characters',
                'string.max': 'Display name cannot exceed 100 characters'
            })
    }),

    // Login validation
    login: Joi.object({
        email: Joi.string()
            .email()
            .required()
            .messages({
                'string.email': 'Please provide a valid email address',
                'any.required': 'Email is required'
            }),

        password: Joi.string()
            .required()
            .messages({
                'any.required': 'Password is required'
            })
    })
};

/**
 * Preference Schemas
 */
const preferenceSchemas = {
    // Update user preferences
    update: Joi.object({
        userId: Joi.string()
            .required()
            .messages({
                'any.required': 'User ID is required'
            }),

        theme: Joi.string()
            .valid('light', 'dark', 'auto')
            .optional()
            .messages({
                'any.only': 'Theme must be one of: light, dark, auto'
            }),

        voiceEnabled: Joi.boolean()
            .optional(),

        autoSave: Joi.boolean()
            .optional(),

        language: Joi.string()
            .length(2)
            .optional()
            .messages({
                'string.length': 'Language code must be exactly 2 characters (ISO 639-1)'
            }),

        fontSize: Joi.string()
            .valid('small', 'medium', 'large')
            .optional(),

        highContrast: Joi.boolean()
            .optional()
    }),

    // Get preferences
    get: Joi.object({
        userId: Joi.string()
            .required()
            .messages({
                'any.required': 'User ID is required'
            })
    })
};

/**
 * Image Upload Schemas
 */
const imageSchemas = {
    // Validate image file
    upload: Joi.object({
        mimetype: Joi.string()
            .valid('image/jpeg', 'image/png', 'image/webp', 'image/gif')
            .required()
            .messages({
                'any.only': 'Only JPEG, PNG, WebP, and GIF images are allowed',
                'any.required': 'File type is required'
            }),

        size: Joi.number()
            .max(10 * 1024 * 1024) // 10MB
            .required()
            .messages({
                'number.max': 'File size cannot exceed 10MB',
                'any.required': 'File size is required'
            })
    })
};

/**
 * Traffic Signal Detection Schemas
 */
const trafficSignalSchemas = {
    // Detect traffic signal in image
    detect: Joi.object({
        image: Joi.string()
            .required()
            .messages({
                'any.required': 'Image data is required'
            }),

        includeConfidence: Joi.boolean()
            .optional()
            .default(false),

        minConfidence: Joi.number()
            .min(0)
            .max(1)
            .optional()
            .default(0.5)
            .messages({
                'number.min': 'Minimum confidence must be at least 0',
                'number.max': 'Minimum confidence cannot exceed 1'
            })
    })
};

/**
 * Color Detection Schemas
 */
const colorSchemas = {
    // Validate color code
    hexColor: Joi.object({
        color: Joi.string()
            .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
            .required()
            .messages({
                'string.pattern.base': 'Color must be a valid hex code (e.g., #FF0000)',
                'any.required': 'Color is required'
            })
    }),

    // Validate RGB color
    rgbColor: Joi.object({
        r: Joi.number()
            .integer()
            .min(0)
            .max(255)
            .required(),

        g: Joi.number()
            .integer()
            .min(0)
            .max(255)
            .required(),

        b: Joi.number()
            .integer()
            .min(0)
            .max(255)
            .required()
    })
};

module.exports = {
    authSchemas,
    preferenceSchemas,
    imageSchemas,
    trafficSignalSchemas,
    colorSchemas
};
