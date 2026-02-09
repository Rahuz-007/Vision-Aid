'use strict';

/**
 * @fileoverview Validation Middleware
 * Provides request validation using Joi schemas and input sanitization.
 * @module middleware/validate
 * @requires joi
 * @requires config/logger
 */

const { logger } = require('../config/logger');

/**
 * Creates an Express middleware function for request validation.
 * 
 * @param {Object} schema - Joi validation schema object.
 * @param {('body'|'query'|'params')} [source='body'] - The part of the request to validate.
 * @returns {Function} Express middleware function (req, res, next).
 * 
 * @example
 * router.post('/login', validate(loginSchema), loginController);
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        // Ensure request part exists
        const dataToValidate = req[source] || {};

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true, // Remove unknown fields not in schema
            convert: true, // Attempt to convert values to correct type (e.g., "123" -> 123)
            allowUnknown: false // Disallow unknown fields
        });

        if (error) {
            // Format validation errors for client response
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message.replace(/"/g, ''), // Clean up message
                type: detail.type
            }));

            // Log validation failure for monitoring (optional: check log level)
            if (logger && typeof logger.warn === 'function') {
                logger.warn(`Validation failed for ${req.method} ${req.url}`, {
                    ip: req.ip,
                    source,
                    errors: errors.map(e => `${e.field}: ${e.message}`)
                });
            }

            return res.status(400).json({
                status: 'error',
                code: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                details: errors
            });
        }

        // Replace request data with validated and sanitized values
        if (value) {
            req[source] = value;
        }

        next();
    };
};

/**
 * Validation Middleware for Request Body.
 * @param {Object} schema - Joi schema.
 */
const validateBody = (schema) => validate(schema, 'body');

/**
 * Validation Middleware for Query Parameters.
 * @param {Object} schema - Joi schema.
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validation Middleware for Route Parameters.
 * @param {Object} schema - Joi schema.
 */
const validateParams = (schema) => validate(schema, 'params');

/**
 * Sanitizes user input to prevent basic XSS attacks.
 * Removes HTML tags like <script> or <div>.
 * 
 * @param {string} input - User input string.
 * @returns {string} Sanitized string.
 */
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>]/g, '').trim();
};

/**
 * Global Middleware to automatically sanitize all string fields in req.body.
 * Should be placed before routes definition.
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
