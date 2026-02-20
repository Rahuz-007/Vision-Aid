import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { reportWebVitals } from './utils/performance';

// Unregister any existing service workers to prevent refresh loops
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
// NOTE: StrictMode is intentionally omitted in dev — it double-invokes all
// effects which causes visible "refresh" flicker. Add back only for audits.
root.render(<App />);

// Performance Monitoring
reportWebVitals();
