module.exports = {
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'routes/**/*.js',
        'services/**/*.js',
        'middleware/**/*.js',
        'config/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**',
        '!**/logs/**'
    ],
    testMatch: [
        '**/__tests__/**/*.js',
        '**/*.test.js',
        '**/*.spec.js'
    ],
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 50,
            statements: 50
        }
    },
    testTimeout: 10000,
    verbose: true,
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
