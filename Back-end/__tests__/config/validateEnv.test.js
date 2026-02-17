const { validateEnv } = require('../../config/validateEnv');

describe('Environment Validation', () => {
    let originalEnv;

    beforeEach(() => {
        // Save original environment
        originalEnv = { ...process.env };
    });

    afterEach(() => {
        // Restore original environment
        process.env = originalEnv;
    });

    describe('validateEnv()', () => {
        it('should pass when all required variables are set', () => {
            process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-chars-long';
            process.env.SESSION_SECRET = 'test-session-secret-key-minimum-32-chars';
            process.env.FRONTEND_URL = 'http://localhost:3000';
            process.env.NODE_ENV = 'development';

            expect(() => validateEnv()).not.toThrow();
        });

        it('should fail when JWT_SECRET is missing', () => {
            delete process.env.JWT_SECRET;
            process.env.SESSION_SECRET = 'test-session-secret-key-minimum-32-chars';
            process.env.FRONTEND_URL = 'http://localhost:3000';

            // Mock process.exit to prevent test from actually exiting
            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { });
            const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

            validateEnv();

            expect(mockExit).toHaveBeenCalledWith(1);
            expect(mockConsoleError).toHaveBeenCalled();

            mockExit.mockRestore();
            mockConsoleError.mockRestore();
        });

        it('should fail when JWT_SECRET is too short', () => {
            process.env.JWT_SECRET = 'short';
            process.env.SESSION_SECRET = 'test-session-secret-key-minimum-32-chars';
            process.env.FRONTEND_URL = 'http://localhost:3000';

            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { });
            const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

            validateEnv();

            expect(mockExit).toHaveBeenCalledWith(1);

            mockExit.mockRestore();
            mockConsoleError.mockRestore();
        });

        it('should fail when SESSION_SECRET is missing', () => {
            process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-chars-long';
            delete process.env.SESSION_SECRET;
            process.env.FRONTEND_URL = 'http://localhost:3000';

            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { });
            const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

            validateEnv();

            expect(mockExit).toHaveBeenCalledWith(1);

            mockExit.mockRestore();
            mockConsoleError.mockRestore();
        });

        it('should fail when FRONTEND_URL is missing', () => {
            process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-chars-long';
            process.env.SESSION_SECRET = 'test-session-secret-key-minimum-32-chars';
            delete process.env.FRONTEND_URL;

            const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { });
            const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });

            validateEnv();

            expect(mockExit).toHaveBeenCalledWith(1);

            mockExit.mockRestore();
            mockConsoleError.mockRestore();
        });

        it('should log success message when validation passes', () => {
            process.env.JWT_SECRET = 'test-jwt-secret-key-minimum-32-chars-long';
            process.env.SESSION_SECRET = 'test-session-secret-key-minimum-32-chars';
            process.env.FRONTEND_URL = 'http://localhost:3000';

            const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => { });

            validateEnv();

            expect(mockConsoleLog).toHaveBeenCalledWith(
                expect.stringContaining('Environment validation passed')
            );

            mockConsoleLog.mockRestore();
        });
    });
});
