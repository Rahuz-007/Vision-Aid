import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
                    <div className="bg-red-500/10 p-6 rounded-full border border-red-500/20 mb-6">
                        <FaExclamationTriangle className="text-5xl text-red-500" />
                    </div>

                    <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-gray-400 max-w-md mb-8">
                        We encountered an unexpected error. Please try reloading the page.
                    </p>

                    <div className="bg-gray-800 rounded-lg p-4 mb-8 text-left max-w-lg w-full overflow-hidden border border-gray-700">
                        <p className="font-mono text-red-400 text-sm break-words">
                            {this.state.error && this.state.error.toString()}
                        </p>
                        {this.state.errorInfo && (
                            <details className="mt-2 text-xs text-gray-500 cursor-pointer">
                                <summary>Stack Trace</summary>
                                <pre className="mt-2 whitespace-pre-wrap">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>

                    <button
                        onClick={this.handleReload}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all shadow-lg shadow-blue-900/20"
                    >
                        <FaRedo /> Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
