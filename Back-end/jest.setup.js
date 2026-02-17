// Jest setup file for backend tests
// This file runs before all tests

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.SESSION_SECRET = 'test-session-secret-key-for-testing-only';
process.env.PORT = '3002'; // Different port for testing
process.env.FRONTEND_URL = 'http://localhost:3000';

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    // Keep error and warn for debugging
    error: jest.fn(),
    warn: jest.fn(),
    // Suppress info and log
    info: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
};

// Setup global test timeout
jest.setTimeout(10000);
