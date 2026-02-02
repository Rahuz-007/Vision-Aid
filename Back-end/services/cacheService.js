const redis = require('redis');
const logger = require('../config/logger');

class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    /**
     * Initialize Redis connection
     */
    async connect() {
        try {
            this.client = redis.createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        logger.error('Redis connection refused');
                        return new Error('Redis server refused connection');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        logger.error('Redis retry time exhausted');
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        return undefined;
                    }
                    // Reconnect after
                    return Math.min(options.attempt * 100, 3000);
                },
            });

            this.client.on('error', (err) => {
                logger.error('Redis Client Error', { error: err.message });
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                logger.info('Redis Client Connected');
                this.isConnected = true;
            });

            this.client.on('ready', () => {
                logger.info('Redis Client Ready');
            });

            await this.client.connect();
        } catch (error) {
            logger.error('Failed to connect to Redis', { error: error.message });
            // Don't throw - allow app to run without cache
        }
    }

    /**
     * Get value from cache
     */
    async get(key) {
        if (!this.isConnected) return null;

        try {
            const value = await this.client.get(key);
            if (value) {
                logger.debug('Cache hit', { key });
                return JSON.parse(value);
            }
            logger.debug('Cache miss', { key });
            return null;
        } catch (error) {
            logger.error('Cache get error', { key, error: error.message });
            return null;
        }
    }

    /**
     * Set value in cache with expiration
     */
    async set(key, value, expirationSeconds = 300) {
        if (!this.isConnected) return false;

        try {
            await this.client.setEx(key, expirationSeconds, JSON.stringify(value));
            logger.debug('Cache set', { key, expiration: expirationSeconds });
            return true;
        } catch (error) {
            logger.error('Cache set error', { key, error: error.message });
            return false;
        }
    }

    /**
     * Delete value from cache
     */
    async delete(key) {
        if (!this.isConnected) return false;

        try {
            await this.client.del(key);
            logger.debug('Cache delete', { key });
            return true;
        } catch (error) {
            logger.error('Cache delete error', { key, error: error.message });
            return false;
        }
    }

    /**
     * Delete all keys matching pattern
     */
    async deletePattern(pattern) {
        if (!this.isConnected) return false;

        try {
            const keys = await this.client.keys(pattern);
            if (keys.length > 0) {
                await this.client.del(keys);
                logger.debug('Cache pattern delete', { pattern, count: keys.length });
            }
            return true;
        } catch (error) {
            logger.error('Cache pattern delete error', { pattern, error: error.message });
            return false;
        }
    }

    /**
     * Cache middleware for Express
     */
    middleware(duration = 300) {
        return async (req, res, next) => {
            // Only cache GET requests
            if (req.method !== 'GET') {
                return next();
            }

            const key = `cache:${req.originalUrl}`;

            try {
                const cachedResponse = await this.get(key);
                if (cachedResponse) {
                    logger.info('Serving from cache', { url: req.originalUrl });
                    return res.json(cachedResponse);
                }

                // Store original res.json
                const originalJson = res.json.bind(res);
                res.json = (body) => {
                    // Cache the response
                    this.set(key, body, duration).catch(err => {
                        logger.error('Failed to cache response', { error: err.message });
                    });
                    return originalJson(body);
                };

                next();
            } catch (error) {
                logger.error('Cache middleware error', { error: error.message });
                next();
            }
        };
    }

    /**
     * Close Redis connection
     */
    async disconnect() {
        if (this.client) {
            await this.client.quit();
            logger.info('Redis Client Disconnected');
        }
    }
}

// Export singleton instance
const cacheService = new CacheService();
module.exports = cacheService;
