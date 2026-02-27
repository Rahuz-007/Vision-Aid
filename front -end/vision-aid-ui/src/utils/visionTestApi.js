// utils/visionTestApi.js
// Handles saving and fetching vision test results from the backend.
// Gracefully falls back to localStorage when the user is not logged in or offline.

import { getValidToken } from '../context/AuthContext';

const API_BASE = process.env.REACT_APP_API_URL || '';
const LOCAL_KEY = 'va_vision_test_history';
const MAX_LOCAL = 20;

// ── Local fallback helpers ─────────────────────────────────────────────────────
function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'); }
    catch { return []; }
}
function writeLocal(data) {
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(data)); }
    catch { /* storage full */ }
}

// ── Save a completed test result ───────────────────────────────────────────────
export async function saveVisionTestResult(payload) {
    // payload: { mode, result, score, totalRounds, timeTaken, details }
    const enriched = { ...payload, createdAt: new Date().toISOString(), id: `local_${Date.now()}` };

    // Always write to localStorage first (instant, offline-safe)
    const local = readLocal();
    writeLocal([enriched, ...local].slice(0, MAX_LOCAL));

    // Then try the API (requires auth)
    try {
        const token = await getValidToken();
        if (!token) return { success: true, local: true, data: enriched };

        const res = await fetch(`${API_BASE}/api/vision-test/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            return { success: true, local: false, data: data.data };
        }
    } catch {
        // Offline or server down — queue for background sync
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            const reg = await navigator.serviceWorker.ready;
            try { await reg.sync.register('vision-test-sync'); } catch { /* not supported */ }
        }
    }

    return { success: true, local: true, data: enriched };
}

// ── Fetch test history ─────────────────────────────────────────────────────────
export async function fetchVisionTestHistory() {
    // Try API first
    try {
        const token = await getValidToken();
        if (token) {
            const res = await fetch(`${API_BASE}/api/vision-test/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const { data } = await res.json();
                return { source: 'api', data };
            }
        }
    } catch { /* offline */ }

    // Fallback to localStorage
    return { source: 'local', data: readLocal() };
}

// ── Clear all history ─────────────────────────────────────────────────────────
export async function clearVisionTestHistory() {
    writeLocal([]);
    try {
        const token = await getValidToken();
        if (token) {
            await fetch(`${API_BASE}/api/vision-test/history`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
        }
    } catch { /* offline */ }
}

// ── Helper: compute a score percentage from a result ─────────────────────────
export function resultToScore(mode, answers, rounds) {
    if (!rounds || rounds.length === 0) return 0;
    if (mode === 'hue') return answers?.errors === 0 ? 100 : Math.max(0, 100 - (answers.errors * 11));
    if (mode === 'contrast') {
        const seen = (answers || []).filter(a => a.saw).length;
        return Math.round((seen / (rounds || 5)) * 100);
    }
    if (mode === 'ishihara') {
        const correct = Object.values(answers || {}).filter(a => a.correct).length;
        return Math.round((correct / rounds.length) * 100);
    }
    // patch
    const nonControl = rounds.filter(r => r.type !== 'control');
    const correct = nonControl.filter((r, i) => answers[i] === r.oddIndex).length;
    return Math.round((correct / nonControl.length) * 100);
}
