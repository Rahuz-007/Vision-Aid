import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShare, FaCopy, FaDownload, FaCheck, FaLink } from 'react-icons/fa';

/**
 * ShareButton — Reusable share/copy/export button.
 *
 * Props:
 *   color      — hex color string (e.g. '#4F86C6')
 *   colorName  — human-readable name (e.g. 'Cornflower Blue')
 *   rgb        — RGB string (e.g. 'rgb(79, 134, 198)')
 *   wcag       — WCAG status string (e.g. 'AA Pass')
 *   variant    — 'compact' | 'full' (default: 'full')
 */
const ShareButton = memo(({
    color = '#8B5CF6',
    colorName = 'Color',
    rgb = '',
    wcag = '',
    variant = 'full',
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [copiedType, setCopiedType] = useState(null);

    const copyToClipboard = useCallback(async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedType(type);
            setTimeout(() => setCopiedType(null), 2000);
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = text;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            setCopiedType(type);
            setTimeout(() => setCopiedType(null), 2000);
        }
    }, []);

    const shareUrl = useCallback(() => {
        const url = `${window.location.origin}/color-picker?color=${color.replace('#', '')}`;
        copyToClipboard(url, 'url');
    }, [color, copyToClipboard]);

    const copyHex = useCallback(() => {
        copyToClipboard(color, 'hex');
    }, [color, copyToClipboard]);

    const copyRgb = useCallback(() => {
        copyToClipboard(rgb || color, 'rgb');
    }, [rgb, color, copyToClipboard]);

    // Download a color card as PNG using canvas
    const downloadCard = useCallback(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 800, 400);

        // Color swatch
        ctx.fillStyle = color;
        ctx.roundRect(40, 40, 320, 320, 20);
        ctx.fill();

        // Shimmer overlay
        const grad = ctx.createLinearGradient(40, 40, 360, 360);
        grad.addColorStop(0, 'rgba(255,255,255,0.15)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.roundRect(40, 40, 320, 320, 20);
        ctx.fill();

        // Text info
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 36px Plus Jakarta Sans, sans-serif';
        ctx.fillText(colorName, 400, 100);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '24px monospace';
        ctx.fillText(color.toUpperCase(), 400, 150);

        if (rgb) {
            ctx.fillText(rgb, 400, 200);
        }

        if (wcag) {
            ctx.fillStyle = '#22c55e';
            ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
            ctx.fillText(`WCAG: ${wcag}`, 400, 260);
        }

        // Branding
        ctx.fillStyle = '#475569';
        ctx.font = '18px Plus Jakarta Sans, sans-serif';
        ctx.fillText('Vision Aid — visionaid.com', 400, 350);

        // Download
        const link = document.createElement('a');
        link.download = `${colorName.replace(/\s+/g, '-').toLowerCase()}-color-card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setCopiedType('download');
        setTimeout(() => setCopiedType(null), 2000);
    }, [color, colorName, rgb, wcag]);

    const actions = [
        { id: 'hex', icon: FaCopy, label: 'Copy HEX', action: copyHex, shortLabel: 'HEX' },
        { id: 'rgb', icon: FaCopy, label: 'Copy RGB', action: copyRgb, shortLabel: 'RGB' },
        { id: 'url', icon: FaLink, label: 'Copy Link', action: shareUrl, shortLabel: 'URL' },
        { id: 'download', icon: FaDownload, label: 'Download Card', action: downloadCard, shortLabel: 'PNG' },
    ];

    if (variant === 'compact') {
        return (
            <div className={`relative ${className}`}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(prev => !prev)}
                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                    aria-label="Share color"
                >
                    <FaShare className="w-4 h-4" />
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsOpen(false)}
                            />
                            <motion.div
                                className="absolute right-0 top-10 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-1 min-w-[160px] overflow-hidden"
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 400 }}
                            >
                                {actions.map(({ id, icon: Icon, label, action }) => (
                                    <button
                                        key={id}
                                        onClick={() => { action(); setIsOpen(false); }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        {copiedType === id
                                            ? <FaCheck className="w-3.5 h-3.5 text-green-500" />
                                            : <Icon className="w-3.5 h-3.5 text-gray-400" />
                                        }
                                        {copiedType === id ? 'Copied!' : label}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Full variant — inline row of buttons
    return (
        <div className={`flex items-center gap-2 flex-wrap ${className}`}>
            {actions.map(({ id, icon: Icon, label, action, shortLabel }) => (
                <motion.button
                    key={id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={action}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all border border-gray-200 dark:border-white/5"
                    aria-label={label}
                    title={label}
                >
                    <AnimatePresence mode="wait">
                        {copiedType === id ? (
                            <motion.span
                                key="check"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="text-green-500"
                            >
                                <FaCheck />
                            </motion.span>
                        ) : (
                            <motion.span key="icon" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                <Icon />
                            </motion.span>
                        )}
                    </AnimatePresence>
                    {copiedType === id ? 'Copied!' : shortLabel}
                </motion.button>
            ))}
        </div>
    );
});

ShareButton.displayName = 'ShareButton';
export default ShareButton;
