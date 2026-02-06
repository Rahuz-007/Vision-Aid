/**
 * Validation Middleware
 * Provides request validation using Joi schemas
 */

const { logger } = require('../config/logger');

/**
 * Create validation middleware from a Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} source - 'body', 'query', 'params' - where to find data
 * @returns {Function} Express middleware function
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = req[source];

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields
            convert: true // Attempt to convert values to correct type
        });

        if (error) {
            // Format validation errors
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                type: detail.type
            }));

            logger.warn('Validation failed', {
                url: req.url,
                method: req.method,
                errors: errors
            });

            return res.status(400).json({
                error: 'Validation failed',
                details: errors
            });
        }

        // Replace request data with validated and sanitized values
        req[source] = value;

        next();
    };
};

/**
 * Validate request body
 * @param {Object} schema - Joi validation schema
 */
const validateBody = (schema) => validate(schema, 'body');

/**
 * Validate query parameters
 * @param {Object} schema - Joi validation schema
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validate route parameters
 * @param {Object} schema - Joi validation schema
 */
const validateParams = (schema) => validate(schema, 'params');

/**
 * Sanitize user input to prevent XSS
 * @param {String} input - User input string
 * @returns {String} Sanitized string
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;

    return input
        .replace(/[<>]/g, '') // Remove < and >
        .trim();
};

/**
 * Middleware to sanitize all string fields in request body
 */
const sanitizeBody = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = sanitizeInput(req.body[key]);
            }
        });
    }
    next();
};

module.exports = {
    validate,
    validateBody,
    validateQuery,
    validateParams,
    sanitizeInput,
    sanitizeBody
};
