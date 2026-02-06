const winston = require('winston');
const path = require('path');

// Ensure logs directory exists
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Create the logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'vision-aid-api' },
    transports: [
        // Write all logs to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, service, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
                    return `${timestamp} [${service}] ${level}: ${message} ${metaStr}`;
                })
            ),
        }),

        // Write errors to error.log
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Write all logs to combined.log
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
    ],
});

// If we're not in production, log to the console with more detail
if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logger initialized in development mode');
}

/**
 * Request logging middleware
 * Logs HTTP requests with timing information
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log on response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip || req.connection.remoteAddress,
        };

        // Log based on status code
        if (res.statusCode >= 500) {
            logger.error('Server error', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Client error', logData);
        } else {
            logger.http('Request completed', logData);
        }
    });

    next();
};

/**
 * Stream for Morgan integration
 */
const stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};

module.exports = { logger, requestLogger, stream };

