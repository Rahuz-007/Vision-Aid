/* ─── Vision Aid — Enhanced Toast System ────────────────────────────────────
 * Drop-in replacement for react-hot-toast that adds:
 *  - Contextual icons per type (success/error/info/warning/copy/save/camera)
 *  - Auto-dismissing progress bar
 *  - Dark glassmorphism card styling
 *  - Helper functions: toastCopy(), toastSave(), toastCamera()
 *
 * Usage:
 *   import { successToast, errorToast, copyToast, saveToast } from '../utils/toast';
 *   copyToast('#FF5733');
 * ─────────────────────────────────────────────────────────────────────────── */

import toast from 'react-hot-toast';
import React from 'react';

// ─── Progress Bar Component ───────────────────────────────────────────────────
const ProgressBar = ({ duration = 3000, color = '#8B5CF6' }) => {
    const style = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        background: color,
        borderRadius: '0 0 12px 12px',
        animation: `va-toast-progress ${duration}ms linear forwards`,
    };
    return <div style={style} />;
};

// Inject progress keyframes once
if (typeof document !== 'undefined') {
    const id = 'va-toast-styles';
    if (!document.getElementById(id)) {
        const s = document.createElement('style');
        s.id = id;
        s.textContent = `
            @keyframes va-toast-progress {
                from { width: 100%; }
                to   { width: 0%; }
            }
        `;
        document.head.appendChild(s);
    }
}

// ─── Base Toast Builder ───────────────────────────────────────────────────────
const buildToast = ({
    icon,
    title,
    subtitle = null,
    duration = 3000,
    barColor = '#8B5CF6',
    iconBg = 'rgba(139,92,246,0.15)',
    toastInstance,
}) => (
    <div
        style={{
            display: 'flex',
            alignItems: subtitle ? 'flex-start' : 'center',
            gap: '12px',
            padding: '14px 16px',
            paddingBottom: '18px',
            background: 'rgba(15,15,20,0.92)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: 280,
            maxWidth: 380,
            position: 'relative',
            overflow: 'hidden',
        }}
    >
        {/* Icon badge */}
        <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: iconBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
        }}>
            {icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', lineHeight: 1.3 }}>
                {title}
            </div>
            {subtitle && (
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2, lineHeight: 1.4 }}>
                    {subtitle}
                </div>
            )}
        </div>

        {/* Dismiss on click */}
        <button
            onClick={() => toast.dismiss(toastInstance?.id)}
            style={{ color: 'rgba(255,255,255,0.3)', fontSize: 16, lineHeight: 1, cursor: 'pointer', flexShrink: 0 }}
        >
            ×
        </button>

        {/* Progress bar */}
        <ProgressBar duration={duration} color={barColor} />
    </div>
);

// ─── Public API ───────────────────────────────────────────────────────────────

export const successToast = (title, subtitle) =>
    toast.custom((t) => buildToast({
        icon: '✅', title, subtitle, duration: 3000,
        barColor: '#22C55E', iconBg: 'rgba(34,197,94,0.15)', toastInstance: t,
    }), { duration: 3000 });

export const errorToast = (title, subtitle) =>
    toast.custom((t) => buildToast({
        icon: '❌', title, subtitle, duration: 4500,
        barColor: '#EF4444', iconBg: 'rgba(239,68,68,0.15)', toastInstance: t,
    }), { duration: 4500 });

export const warningToast = (title, subtitle) =>
    toast.custom((t) => buildToast({
        icon: '⚠️', title, subtitle, duration: 4000,
        barColor: '#F59E0B', iconBg: 'rgba(245,158,11,0.15)', toastInstance: t,
    }), { duration: 4000 });

export const infoToast = (title, subtitle) =>
    toast.custom((t) => buildToast({
        icon: 'ℹ️', title, subtitle, duration: 3000,
        barColor: '#3B82F6', iconBg: 'rgba(59,130,246,0.15)', toastInstance: t,
    }), { duration: 3000 });

export const copyToast = (value = '') =>
    toast.custom((t) => buildToast({
        icon: '📋', title: 'Copied to clipboard', subtitle: value,
        duration: 2000, barColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.15)', toastInstance: t,
    }), { duration: 2000 });

export const saveToast = (name = '') =>
    toast.custom((t) => buildToast({
        icon: '🔖', title: 'Saved to history', subtitle: name || undefined,
        duration: 2500, barColor: '#8B5CF6', iconBg: 'rgba(139,92,246,0.15)', toastInstance: t,
    }), { duration: 2500 });

export const cameraToast = (message, type = 'success') => {
    const isError = type === 'error';
    return toast.custom((t) => buildToast({
        icon: isError ? '🚫' : '📷', title: message,
        duration: 3000,
        barColor: isError ? '#EF4444' : '#22C55E',
        iconBg: isError ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.15)',
        toastInstance: t,
    }), { duration: 3000 });
};

export const paletteToast = (count) =>
    toast.custom((t) => buildToast({
        icon: '🎨', title: `${count} color${count !== 1 ? 's' : ''} saved`, subtitle: 'Added to your history',
        duration: 2500, barColor: '#10B981', iconBg: 'rgba(16,185,129,0.15)', toastInstance: t,
    }), { duration: 2500 });

export const detectionToast = (signal, confidence) =>
    toast.custom((t) => buildToast({
        icon: signal === 'green' ? '🟢' : signal === 'red' ? '🔴' : '🟡',
        title: `${signal.charAt(0).toUpperCase() + signal.slice(1)} light detected`,
        subtitle: confidence ? `${Math.round(confidence * 100)}% confidence` : undefined,
        duration: 2000,
        barColor: signal === 'green' ? '#22C55E' : signal === 'red' ? '#EF4444' : '#F59E0B',
        iconBg: signal === 'green' ? 'rgba(34,197,94,0.15)' : signal === 'red' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
        toastInstance: t,
    }), { duration: 2000 });

// ─── Default export: drop-in replacement map ─────────────────────────────────
// Allows: import vaToast from '../utils/toast'; vaToast.success('Copied');
const vaToast = {
    success: successToast,
    error: errorToast,
    warning: warningToast,
    info: infoToast,
    copy: copyToast,
    save: saveToast,
    camera: cameraToast,
    palette: paletteToast,
    detection: detectionToast,
};

export default vaToast;
