/**
 * Prometheus Metrics Configuration
 * Exposes application metrics for monitoring systems
 */

const client = require('prom-client');
const { logger } = require('../config/logger');

// Create a Registry
const register = new client.Registry();

// Add default metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({
    register,
    prefix: 'vision_aid_',
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
});

// Custom Metrics

/**
 * HTTP Request Duration Histogram
 * Tracks how long requests take to process
 */
const httpRequestDuration = new client.Histogram({
    name: 'vision_aid_http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

/**
 * HTTP Request Total Counter
 * Counts total number of requests
 */
const httpRequestTotal = new client.Counter({
    name: 'vision_aid_http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

/**
 * HTTP Request Errors Counter
 * Counts HTTP errors (4xx, 5xx)
 */
const httpRequestErrors = new client.Counter({
    name: 'vision_aid_http_request_errors_total',
    help: 'Total number of HTTP request errors',
    labelNames: ['method', 'route', 'status_code']
});

/**
 * Active Connections Gauge
 * Tracks number of active connections
 */
const activeConnections = new client.Gauge({
    name: 'vision_aid_active_connections',
    help: 'Number of active connections'
});

/**
 * Database Query Duration Histogram
 * Tracks database query performance
 */
const dbQueryDuration = new client.Histogram({
    name: 'vision_aid_db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5]
});

/**
 * Database Query Total Counter
 */
const dbQueryTotal = new client.Counter({
    name: 'vision_aid_db_queries_total',
    help: 'Total number of database queries',
    labelNames: ['operation', 'collection', 'status']
});

/**
 * Authentication Events Counter
 */
const authEvents = new client.Counter({
    name: 'vision_aid_auth_events_total',
    help: 'Total number of authentication events',
    labelNames: ['event_type', 'status']
});

/**
 * Color Detection Events Counter
 */
const colorDetectionEvents = new client.Counter({
    name: 'vision_aid_color_detection_events_total',
    help: 'Total number of color detection events',
    labelNames: ['method', 'status']
});

/**
 * Traffic Signal Detection Events Counter
 */
const trafficSignalDetectionEvents = new client.Counter({
    name: 'vision_aid_traffic_signal_detection_events_total',
    help: 'Total number of traffic signal detection events',
    labelNames: ['color', 'confidence_level']
});

// Register all custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(httpRequestErrors);
register.registerMetric(activeConnections);
register.registerMetric(dbQueryDuration);
register.registerMetric(dbQueryTotal);
register.registerMetric(authEvents);
register.registerMetric(colorDetectionEvents);
register.registerMetric(trafficSignalDetectionEvents);

/**
 * Metrics Middleware
 * Automatically tracks HTTP request metrics
 */
const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    // Increment active connections
    activeConnections.inc();

    // Track response
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000; // Convert to seconds
        const route = req.route?.path || req.path || 'unknown';
        const labels = {
            method: req.method,
            route: route,
            status_code: res.statusCode
        };

        // Record request duration
        httpRequestDuration.labels(labels).observe(duration);

        // Increment request counter
        httpRequestTotal.labels(labels).inc();

        // Track errors
        if (res.statusCode >= 400) {
            httpRequestErrors.labels(labels).inc();

            if (res.statusCode >= 500) {
                logger.warn('HTTP 5xx error tracked in metrics', labels);
            }
        }

        // Decrement active connections
        activeConnections.dec();
    });

    next();
};

/**
 * Metrics Endpoint Handler
 * Exposes metrics in Prometheus format
 */
const metricsEndpoint = async (req, res) => {
    try {
        res.set('Content-Type', register.contentType);
        const metrics = await register.metrics();
        res.end(metrics);
    } catch (error) {
        logger.error('Failed to generate metrics', { error: error.message });
        res.status(500).end(error.message);
    }
};

/**
 * Helper function to track database queries
 */
const trackDbQuery = async (operation, collection, queryFn) => {
    const start = Date.now();
    let status = 'success';

    try {
        const result = await queryFn();
        return result;
    } catch (error) {
        status = 'error';
        throw error;
    } finally {
        const duration = (Date.now() - start) / 1000;
        dbQueryDuration.labels({ operation, collection }).observe(duration);
        dbQueryTotal.labels({ operation, collection, status }).inc();
    }
};

/**
 * Helper function to track auth events
 */
const trackAuthEvent = (eventType, status) => {
    authEvents.labels({ event_type: eventType, status }).inc();
};

/**
 * Helper function to track color detection
 */
const trackColorDetection = (method, status) => {
    colorDetectionEvents.labels({ method, status }).inc();
};

/**
 * Helper function to track traffic signal detection
 */
const trackTrafficSignalDetection = (color, confidence) => {
    const confidenceLevel = confidence >= 0.8 ? 'high' :
        confidence >= 0.5 ? 'medium' : 'low';
    trafficSignalDetectionEvents.labels({ color, confidence_level: confidenceLevel }).inc();
};

module.exports = {
    register,
    metricsMiddleware,
    metricsEndpoint,
    trackDbQuery,
    trackAuthEvent,
    trackColorDetection,
    trackTrafficSignalDetection,
    // Export individual metrics for direct access if needed
    metrics: {
        httpRequestDuration,
        httpRequestTotal,
        httpRequestErrors,
        activeConnections,
        dbQueryDuration,
        dbQueryTotal,
        authEvents,
        colorDetectionEvents,
        trafficSignalDetectionEvents
    }
};
