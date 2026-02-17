import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Component that throws an error
const ThrowError = () => {
    throw new Error('Test error');
};

// Component that works fine
const WorkingComponent = () => {
    return <div>Working component</div>;
};

describe('ErrorBoundary', () => {
    // Suppress console.error for these tests
    let consoleError;

    beforeEach(() => {
        consoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        consoleError.mockRestore();
    });

    it('should render children when there is no error', () => {
        render(
            <ErrorBoundary>
                <WorkingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText('Working component')).toBeInTheDocument();
    });

    it('should display error message when child component throws', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });

    it('should display reload button when error occurs', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        const reloadButton = screen.getByRole('button', { name: /reload/i });
        expect(reloadButton).toBeInTheDocument();
    });

    it('should display error details in development mode', () => {
        const originalEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'development';

        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        // Error details should be visible in development
        expect(screen.getByText(/test error/i)).toBeInTheDocument();

        process.env.NODE_ENV = originalEnv;
    });

    it('should call console.error when error is caught', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        expect(consoleError).toHaveBeenCalled();
    });

    it('should have accessible error message', () => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );

        const errorMessage = screen.getByText(/something went wrong/i);
        expect(errorMessage).toBeVisible();
    });
});
