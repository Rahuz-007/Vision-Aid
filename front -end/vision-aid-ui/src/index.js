import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { reportWebVitals } from './utils/performance';

// ── Register PWA Service Worker ───────────────────────────────────────────────
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then(registration => {
                console.log('[PWA] Service worker registered, scope:', registration.scope);
                // Check for updates every 60 seconds
                setInterval(() => registration.update(), 60_000);
                // Notify user when a new version is waiting
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Show a toast / prompt user to refresh for new version
                            if (window.confirm('A new version of Vision Aid is available. Reload now?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(err => console.warn('[PWA] Service worker registration failed:', err));
    });
} else if ('serviceWorker' in navigator && process.env.NODE_ENV === 'development') {
    // In dev: unregister any stale SWs to avoid caching issues
    navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => r.unregister());
    });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
// NOTE: StrictMode is intentionally omitted in dev — it double-invokes all
// effects which causes visible "refresh" flicker. Add back only for audits.
root.render(<App />);

// Performance Monitoring
reportWebVitals();
