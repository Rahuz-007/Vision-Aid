import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// ─── Color math ───────────────────────────────────────────────────────────────
function hexToRgb(hex) {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
}
function getLuminance(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    return [rgb.r, rgb.g, rgb.b].reduce((acc, v, i) => {
        const s = v / 255;
        return acc + (s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)) * [0.2126, 0.7152, 0.0722][i];
    }, 0);
}
function contrastRatio(hex1, hex2) {
    const l1 = getLuminance(hex1), l2 = getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

// ─── WCAG levels ──────────────────────────────────────────────────────────────
function wcagLevel(ratio, fontSize, isBold) {
    const isLarge = fontSize >= 18 || (isBold && fontSize >= 14);
    if (isLarge) {
        if (ratio >= 4.5) return { level: 'AAA', pass: true };
        if (ratio >= 3) return { level: 'AA', pass: true };
        return { level: 'Fail', pass: false };
    } else {
        if (ratio >= 7) return { level: 'AAA', pass: true };
        if (ratio >= 4.5) return { level: 'AA', pass: true };
        if (ratio >= 3) return { level: 'AA Large only', pass: false };
        return { level: 'Fail', pass: false };
    }
}

const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];
const FONT_WEIGHTS = [
    { label: 'Regular (400)', value: '400', bold: false },
    { label: 'Medium (500)', value: '500', bold: false },
    { label: 'Bold (700)', value: '700', bold: true },
    { label: 'Black (900)', value: '900', bold: true },
];
const SAMPLE_TEXTS = [
    'The quick brown fox jumps over the lazy dog.',
    'WCAG 2.1 requires a minimum contrast ratio of 4.5:1.',
    'Colour accessibility matters for everyone.',
    'VisionAid helps you design inclusively.',
];

export default function TextAccessibilityChecker() {
    const [textColor, setTextColor] = useState('#111827');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [fontSize, setFontSize] = useState(16);
    const [fontWeight, setFontWeight] = useState(FONT_WEIGHTS[0]);
    const [sampleIdx, setSampleIdx] = useState(0);
    const [customText, setCustomText] = useState('');
    const [copied, setCopied] = useState(null);

    const ratio = contrastRatio(textColor, bgColor);
    const result = wcagLevel(ratio, fontSize, fontWeight.bold);
    const displayText = customText || SAMPLE_TEXTS[sampleIdx];

    const swap = useCallback(() => {
        setTextColor(bgColor);
        setBgColor(textColor);
    }, [textColor, bgColor]);

    const copyCSS = useCallback(() => {
        const css = `color: ${textColor};\nbackground-color: ${bgColor};\nfont-size: ${fontSize}px;\nfont-weight: ${fontWeight.value};`;
        navigator.clipboard.writeText(css);
        setCopied(true);
        setTimeout(() => setCopied(null), 1500);
    }, [textColor, bgColor, fontSize, fontWeight]);

    const badgeColor = result.level === 'AAA' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30' :
        result.level === 'AA' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/30' :
            result.level === 'Fail' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30' :
                'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/30';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white pt-24 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="text-5xl mb-4">🔤</div>
                    <h1 className="text-4xl font-black mb-3">Text Accessibility Checker</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                        Check if your text meets WCAG contrast standards — accounting for font size and weight, not just colour.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">

                    {/* ── LEFT: Controls ─────────────────────────────────── */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                        className="space-y-5">

                        {/* Colour pickers */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                            <h2 className="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">Colours</h2>
                            <div className="space-y-4">
                                {/* Text colour */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1 bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/5">
                                        <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                                            className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">Text Colour</p>
                                            <input type="text" value={textColor}
                                                onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setTextColor(e.target.value)}
                                                className="w-full bg-transparent font-mono text-sm font-bold focus:outline-none uppercase" />
                                        </div>
                                    </div>
                                </div>

                                {/* Swap button */}
                                <button onClick={swap}
                                    className="w-full py-2 rounded-xl text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                    ⇅ Swap Text & Background
                                </button>

                                {/* Background colour */}
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-3 flex-1 bg-gray-50 dark:bg-white/5 rounded-xl p-3 border border-gray-200 dark:border-white/5">
                                        <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                            className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent flex-shrink-0" />
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-0.5">Background Colour</p>
                                            <input type="text" value={bgColor}
                                                onChange={e => /^#[0-9a-fA-F]{0,6}$/.test(e.target.value) && setBgColor(e.target.value)}
                                                className="w-full bg-transparent font-mono text-sm font-bold focus:outline-none uppercase" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Font size */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Font Size</h2>
                                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{fontSize}px</span>
                            </div>
                            <input type="range" min={8} max={72} value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                                className="w-full mb-4 accent-blue-600" />
                            <div className="flex flex-wrap gap-2">
                                {FONT_SIZES.map(s => (
                                    <button key={s} onClick={() => setFontSize(s)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${fontSize === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
                                        {s}px
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font weight */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                            <h2 className="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Font Weight</h2>
                            <div className="grid grid-cols-2 gap-2">
                                {FONT_WEIGHTS.map(w => (
                                    <button key={w.value} onClick={() => setFontWeight(w)}
                                        className={`py-2.5 rounded-xl text-sm transition-all ${fontWeight.value === w.value ? 'bg-blue-600 text-white font-bold' : 'bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'}`}
                                        style={{ fontWeight: w.value }}>
                                        {w.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sample text */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                            <h2 className="font-black text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Sample Text</h2>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {SAMPLE_TEXTS.map((_, i) => (
                                    <button key={i} onClick={() => { setSampleIdx(i); setCustomText(''); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sampleIdx === i && !customText ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400'}`}>
                                        Sample {i + 1}
                                    </button>
                                ))}
                            </div>
                            <textarea value={customText} onChange={e => setCustomText(e.target.value)}
                                placeholder="Or type your own text here..."
                                rows={2}
                                className="w-full text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 placeholder-gray-400" />
                        </div>
                    </motion.div>

                    {/* ── RIGHT: Preview + Results ────────────────────────── */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                        className="space-y-5">

                        {/* Live preview */}
                        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-lg">
                            <div className="px-4 py-2.5 bg-gray-100 dark:bg-[#1a1a1a] flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-red-400" />
                                <span className="w-3 h-3 rounded-full bg-yellow-400" />
                                <span className="w-3 h-3 rounded-full bg-green-400" />
                                <span className="ml-2 text-xs text-gray-400 font-mono">Preview</span>
                            </div>
                            <div className="p-8 min-h-[180px] flex items-center justify-center transition-colors duration-300"
                                style={{ backgroundColor: bgColor }}>
                                <p className="text-center leading-relaxed transition-all duration-300"
                                    style={{ color: textColor, fontSize: `${fontSize}px`, fontWeight: fontWeight.value, maxWidth: '100%', wordBreak: 'break-word' }}>
                                    {displayText}
                                </p>
                            </div>
                        </div>

                        {/* Contrast result */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contrast Ratio</p>
                                    <p className="text-5xl font-black text-gray-900 dark:text-white">{ratio.toFixed(2)}<span className="text-2xl text-gray-400">:1</span></p>
                                </div>
                                <span className={`text-lg font-black px-5 py-2.5 rounded-2xl border ${badgeColor}`}>
                                    {result.level}
                                </span>
                            </div>

                            {/* Requirement matrix */}
                            <div className="space-y-2">
                                <p className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">Requirements Met</p>
                                {[
                                    { label: 'AA  — Normal text (≥4.5:1)', pass: ratio >= 4.5 },
                                    { label: 'AAA — Normal text (≥7:1)', pass: ratio >= 7 },
                                    { label: 'AA  — Large text (≥3:1)', pass: ratio >= 3 },
                                    { label: 'AAA — Large text (≥4.5:1)', pass: ratio >= 4.5 },
                                ].map(req => (
                                    <div key={req.label} className={`flex items-center justify-between px-4 py-3 rounded-xl ${req.pass ? 'bg-emerald-50 dark:bg-emerald-500/10' : 'bg-red-50 dark:bg-red-500/10'}`}>
                                        <span className={`text-sm font-mono ${req.pass ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{req.label}</span>
                                        <span className="text-lg">{req.pass ? '✅' : '❌'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Context tip */}
                        <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                            <p className="text-xs font-black text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-1">WCAG Note</p>
                            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                {fontSize >= 18 || (fontWeight.bold && fontSize >= 14)
                                    ? '✅ This is considered "large text" by WCAG — a 3:1 ratio is sufficient for AA compliance.'
                                    : '⚠️ This is "normal text" — a 4.5:1 ratio is required for AA and 7:1 for AAA compliance.'}
                            </p>
                        </div>

                        {/* Copy CSS */}
                        <button onClick={copyCSS}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                            {copied ? '✓ CSS Copied!' : '⬇ Copy as CSS'}
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
