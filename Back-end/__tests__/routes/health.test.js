const request = require('supertest');
const express = require('express');

// Mock app setup for testing
const createTestApp = () => {
    const app = express();
    app.use(express.json());

    // Import health routes
    const healthRoutes = require('../../routes/health');
    app.use('/health', healthRoutes);

    return app;
};

describe('Health Check Routes', () => {
    let app;

    beforeAll(() => {
        app = createTestApp();
    });

    describe('GET /health', () => {
        it('should return 200 and health status', async () => {
            const response = await request(app)
                .get('/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });

        it('should include system metrics', async () => {
            const response = await request(app)
                .get('/health')
                .expect(200);

            expect(response.body).toHaveProperty('metrics');
            expect(response.body.metrics).toHaveProperty('memory');
            expect(response.body.metrics).toHaveProperty('cpu');
        });
    });

    describe('GET /health/live', () => {
        it('should return 200 for liveness probe', async () => {
            const response = await request(app)
                .get('/health/live')
                .expect(200);

            expect(response.body).toHaveProperty('status', 'alive');
        });
    });

    describe('GET /health/ready', () => {
        it('should return readiness status', async () => {
            const response = await request(app)
                .get('/health/ready')
                .expect(200);

            expect(response.body).toHaveProperty('status');
            expect(response.body).toHaveProperty('services');
        });

        it('should check database connectivity', async () => {
            const response = await request(app)
                .get('/health/ready')
                .expect(200);

            expect(response.body.services).toHaveProperty('database');
        });
    });
});
