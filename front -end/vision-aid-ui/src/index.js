import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

console.log("index.js loaded - mounting React app");

// Register service worker for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

try {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    console.log("React root created");
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
    console.log("App rendered successfully");
} catch (error) {
    console.error("Failed to render app:", error);
    if (document.getElementById('root')) {
        document.getElementById('root').innerHTML = '<h1 style="color: red; padding: 20px;">Error loading app: ' + error.message + '</h1>';
    }
}

// Keep the process alive
console.log("React initialization complete");

// Performance Monitoring
import { reportWebVitals } from './utils/performance';
reportWebVitals(console.log);

