import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── Color Math ───────────────────────────────────────────────────────────────
function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
}
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
            default: break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}
function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    return [rgb.r, rgb.g, rgb.b].reduce((acc, v, i) => {
        const s = v / 255;
        const c = s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        return acc + c * [0.2126, 0.7152, 0.0722][i];
    }, 0);
}
function contrast(h1, h2) {
    const l1 = getLuminance(h1), l2 = getLuminance(h2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
function generateShades(baseHex) {
    const rgb = hexToRgb(baseHex);
    if (!rgb) return [];
    const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const steps = [
        { name: '50', l: 97 }, { name: '100', l: 93 }, { name: '200', l: 86 },
        { name: '300', l: 76 }, { name: '400', l: 63 }, { name: '500', l: 50 },
        { name: '600', l: 40 }, { name: '700', l: 31 }, { name: '800', l: 22 },
        { name: '900', l: 13 },
    ];
    return steps.map(step => {
        const hex = hslToHex(h, Math.min(s, 90), step.l);
        const wc = contrast(hex, '#ffffff');
        const bc = contrast(hex, '#000000');
        return { name: step.name, hex, wc, bc, textColor: wc > bc ? '#ffffff' : '#000000', bestContrast: Math.max(wc, bc) };
    });
}
function wcagBadge(ratio) {
    if (ratio >= 7) return { label: 'AAA', cls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' };
    if (ratio >= 4.5) return { label: 'AA', cls: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' };
    if (ratio >= 3) return { label: 'AA⁺', cls: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' };
    return { label: 'Fail', cls: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' };
}

// ─── Component ────────────────────────────────────────────────────────────────
const PRESETS = ['#6366f1', '#ec4899', '#f97316', '#22c55e', '#ef4444', '#0ea5e9', '#a855f7', '#eab308'];

export default function PaletteGenerator() {
    const [base, setBase] = useState('#6366f1');
    const [copied, setCopied] = useState(null);
    const shades = generateShades(base);

    const copy = useCallback((hex) => {
        navigator.clipboard.writeText(hex);
        setCopied(hex);
        setTimeout(() => setCopied(null), 1500);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white pt-24 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="text-5xl mb-4">🎨</div>
                    <h1 className="text-4xl font-black mb-3">Accessible Palette Generator</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                        Pick a base colour to generate a full 10-shade palette with WCAG contrast ratings for every swatch.
                    </p>
                </motion.div>

                {/* Picker row */}
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-10">
                    <div className="flex items-center gap-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-3 shadow-sm">
                        <input type="color" value={base} onChange={e => setBase(e.target.value)}
                            className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent" />
                        <input type="text" value={base}
                            onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setBase(e.target.value)}
                            className="w-24 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase text-center" />
                    </div>
                    <div className="flex gap-2">
                        {PRESETS.map(p => (
                            <button key={p} onClick={() => setBase(p)}
                                className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-125 focus:outline-none"
                                style={{ backgroundColor: p, borderColor: base === p ? '#fff' : 'transparent' }} />
                        ))}
                    </div>
                </motion.div>

                {/* Preview banner */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                    className="grid grid-cols-10 h-14 rounded-2xl overflow-hidden mb-8 shadow-lg">
                    {shades.map(s => (
                        <div key={s.name} className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: s.hex }} onClick={() => copy(s.hex)} title={s.hex} />
                    ))}
                </motion.div>

                {/* Shade rows */}
                <div className="space-y-2">
                    {shades.map((s, i) => {
                        const badge = wcagBadge(s.bestContrast);
                        return (
                            <motion.div key={s.name}
                                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}
                                className="flex items-center gap-3 sm:gap-4 p-3.5 rounded-xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all"
                            >
                                {/* Swatch */}
                                <button onClick={() => copy(s.hex)} title="Click to copy"
                                    className="flex-shrink-0 w-12 h-12 rounded-xl shadow-md hover:scale-110 active:scale-95 transition-transform border border-black/5"
                                    style={{ backgroundColor: s.hex }} />

                                {/* Name */}
                                <span className="w-10 text-xs font-bold text-gray-400 dark:text-gray-500">{s.name}</span>

                                {/* Hex */}
                                <button onClick={() => copy(s.hex)}
                                    className="flex-1 font-mono text-sm font-semibold text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    {copied === s.hex ? '✓ Copied!' : s.hex.toUpperCase()}
                                </button>

                                {/* Contrast vs white */}
                                <div className="hidden sm:flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded border border-gray-200 dark:border-white/10 flex items-center justify-center text-[9px] font-black text-white" style={{ backgroundColor: s.hex }}>A</div>
                                    <span className="text-xs font-mono text-gray-400 w-9">{s.wc.toFixed(1)}:1</span>
                                </div>

                                {/* Contrast vs black */}
                                <div className="hidden sm:flex items-center gap-1.5">
                                    <div className="w-5 h-5 rounded border border-gray-200 dark:border-white/10 flex items-center justify-center text-[9px] font-black text-black" style={{ backgroundColor: s.hex }}>A</div>
                                    <span className="text-xs font-mono text-gray-400 w-9">{s.bc.toFixed(1)}:1</span>
                                </div>

                                {/* WCAG badge */}
                                <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${badge.cls}`}>{badge.label}</span>

                                {/* Text preview */}
                                <div className="hidden md:flex w-20 h-8 rounded-lg items-center justify-center text-xs font-bold"
                                    style={{ backgroundColor: s.hex, color: s.textColor }}>
                                    Sample
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center text-xs text-gray-500 dark:text-gray-400">
                    {[
                        { label: 'AAA', desc: '≥7:1 Enhanced contrast', cls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
                        { label: 'AA', desc: '≥4.5:1 Normal text', cls: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
                        { label: 'AA⁺', desc: '≥3:1 Large text only', cls: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' },
                        { label: 'Fail', desc: '<3:1 Not accessible', cls: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' },
                    ].map(item => (
                        <span key={item.label} className="flex items-center gap-1.5">
                            <span className={`font-black px-2 py-0.5 rounded-md ${item.cls}`}>{item.label}</span>
                            {item.desc}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
