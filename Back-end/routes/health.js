/**
 * Enhanced Health Check Routes
 * Provides detailed system health status for monitoring
 */

const express = require('express');
const router = express.Router();
const os = require('os');
const { db } = require('../services/firebase');
const { logger } = require('../config/logger');

/**
 * Get system metrics
 */
const getSystemMetrics = () => {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;

    return {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
            total: `${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
            free: `${(freeMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
            used: `${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB`,
            percentUsed: `${((usedMem / totalMem) * 100).toFixed(2)}%`
        },
        cpu: {
            model: os.cpus()[0]?.model || 'Unknown',
            cores: os.cpus().length,
            loadAverage: os.loadavg().map(avg => avg.toFixed(2))
        },
        uptime: {
            system: `${(os.uptime() / 3600).toFixed(2)} hours`,
            process: `${(process.uptime() / 3600).toFixed(2)} hours`
        }
    };
};

/**
 * Check service connectivity
 */
const checkServices = async () => {
    const services = {};

    // Check Firestore
    try {
        const startTime = Date.now();
        const testRef = db.collection('health-check').doc('test');
        await testRef.set({
            check: true,
            timestamp: Date.now()
        }, { merge: true });
        await testRef.get();
        const latency = Date.now() - startTime;

        services.firestore = {
            status: 'connected',
            latency: `${latency}ms`,
            healthy: latency < 1000
        };
    } catch (error) {
        services.firestore = {
            status: 'disconnected',
            error: error.message,
            healthy: false
        };
    }

    // Check YOLO service
    try {
        const yoloUrl = process.env.YOLO_SERVICE_URL;
        if (yoloUrl) {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const startTime = Date.now();
            const response = await fetch(`${yoloUrl}/health`, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            const latency = Date.now() - startTime;

            services.yolo = {
                status: response.ok ? 'connected' : 'error',
                url: yoloUrl,
                latency: `${latency}ms`,
                httpStatus: response.status,
                healthy: response.ok && latency < 2000
            };
        } else {
            services.yolo = {
                status: 'not_configured',
                healthy: true // Not critical
            };
        }
    } catch (error) {
        const isTimeout = error.name === 'AbortError';
        services.yolo = {
            status: 'disconnected',
            error: isTimeout ? 'timeout' : error.message,
            healthy: false
        };
    }

    return services;
};

/**
 * @route   GET /health
 * @desc    Detailed health check
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        const services = await checkServices();
        const system = getSystemMetrics();

        // Determine overall health
        const allServicesHealthy = Object.values(services).every(s => s.healthy !== false);
        const overallStatus = allServicesHealthy ? 'healthy' : 'degraded';

        const health = {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            uptime: process.uptime(),
            services,
            system
        };

        const statusCode = overallStatus === 'healthy' ? 200 : 503;

        // Log if degraded
        if (overallStatus === 'degraded') {
            logger.warn('Health check degraded', { services });
        }

        res.status(statusCode).json(health);
    } catch (error) {
        logger.error('Health check failed', { error: error.message });
        res.status(503).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

/**
 * @route   GET /health/live
 * @desc    Kubernetes liveness probe
 * @access  Public
 */
router.get('/health/live', (req, res) => {
    res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString()
    });
});

/**
 * @route   GET /health/ready
 * @desc    Kubernetes readiness probe
 * @access  Public
 */
router.get('/health/ready', async (req, res) => {
    try {
        // Check critical dependencies
        const testRef = db.collection('health-check').doc('test');
        await testRef.get();

        res.status(200).json({
            status: 'ready',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Readiness check failed', { error: error.message });
        res.status(503).json({
            status: 'not ready',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * @route   GET /health/metrics
 * @desc    System metrics for monitoring
 * @access  Public (should be restricted in production)
 */
router.get('/health/metrics', (req, res) => {
    const metrics = {
        timestamp: new Date().toISOString(),
        process: {
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
        },
        system: getSystemMetrics()
    };

    res.json(metrics);
});

module.exports = router;
