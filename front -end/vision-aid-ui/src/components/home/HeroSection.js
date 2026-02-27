import React, { memo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShieldAlt, FaMagic, FaBolt, FaVolumeUp, FaArrowRight, FaCamera } from 'react-icons/fa';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.16 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: 'easeOut' } },
};

// Pre-computed stable particle positions
const PARTICLES = [...Array(22)].map((_, i) => ({
    id: i,
    left: `${(i * 17 + 13) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    duration: 3 + (i % 4),
    delay: (i * 0.25) % 2.5,
    xOffset: (i % 5) * 5 - 12,
    size: i % 3 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1',
}));

// Cycling demo modes
const DEMO_MODES = [
    {
        id: 'color',
        label: 'Color Detection',
        icon: '🎨',
        badge: 'Color Detection Active',
        badgeColor: '#3b82f6',
        badgeDot: 'bg-blue-400',
        swatch: '#6495ED',
        swatchName: 'Cornflower Blue',
        hex: '#6495ED',
        rgb: 'rgb(100, 149, 237)',
        hsl: 'hsl(219°, 79%, 66%)',
        luminance: 0.42,
        wcag: { label: 'AA', color: '#3b82f6' },
        statusLabel: 'Contrast Ratio',
        statusValue: '4.8:1',
        statusColor: 'text-blue-400',
        buttonLabel: 'Announce Color',
        buttonFrom: '#3b82f6',
        buttonTo: '#4f46e5',
        harmonies: ['#ED9564', '#64ED95', '#9564ED'],
    },
    {
        id: 'traffic',
        label: 'Traffic Signal',
        icon: '🚦',
        badge: 'Signal Detected',
        badgeColor: '#22c55e',
        badgeDot: 'bg-green-400',
        swatch: '#22C55E',
        swatchName: 'Green Light — GO',
        hex: '#22C55E',
        rgb: 'rgb(34, 197, 94)',
        hsl: 'hsl(142°, 71%, 45%)',
        luminance: 0.59,
        wcag: { label: 'AAA', color: '#10b981' },
        statusLabel: 'Direction',
        statusValue: 'STRAIGHT →',
        statusColor: 'text-green-400',
        buttonLabel: 'Announce Signal',
        buttonFrom: '#16a34a',
        buttonTo: '#059669',
        harmonies: ['#C55E22', '#225EC5', '#C5225E'],
    },
    {
        id: 'palette',
        label: 'Palette Check',
        icon: '✅',
        badge: 'WCAG AA Pass',
        badgeColor: '#8b5cf6',
        badgeDot: 'bg-purple-400',
        swatch: '#8B5CF6',
        swatchName: 'Violet',
        hex: '#8B5CF6',
        rgb: 'rgb(139, 92, 246)',
        hsl: 'hsl(258°, 90%, 66%)',
        luminance: 0.31,
        wcag: { label: 'AAA', color: '#10b981' },
        statusLabel: 'Contrast Ratio',
        statusValue: '7.2:1',
        statusColor: 'text-purple-400',
        buttonLabel: 'Read Contrast',
        buttonFrom: '#7c3aed',
        buttonTo: '#6d28d9',
        harmonies: ['#F6C45C', '#5CF6C4', '#F65C8B'],
    },
];

// ── Product Mockup Card ───────────────────────────────────────────────────────
const ProductMockup = memo(() => {
    const [modeIdx, setModeIdx] = useState(0);
    const mode = DEMO_MODES[modeIdx];
    const [scanLine, setScanLine] = useState(0);

    // Cycle through modes every 3.5 seconds
    useEffect(() => {
        const t = setInterval(() => setModeIdx(prev => (prev + 1) % DEMO_MODES.length), 3500);
        return () => clearInterval(t);
    }, []);

    // Scan line animation
    useEffect(() => {
        const t = setInterval(() => setScanLine(prev => (prev + 1) % 100), 30);
        return () => clearInterval(t);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-[360px] mx-auto lg:mx-0"
        >
            {/* Ambient glow */}
            <motion.div
                className="absolute -inset-8 rounded-3xl blur-3xl opacity-25 pointer-events-none"
                animate={{ background: `radial-gradient(ellipse, ${mode.swatch}99, transparent 70%)` }}
                transition={{ duration: 1 }}
            />

            {/* Card shell */}
            <div className="relative rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
                style={{ background: 'linear-gradient(160deg, #0f172a 0%, #111827 60%, #0d1117 100%)' }}>

                {/* Window chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5"
                    style={{ background: 'rgba(0,0,0,0.35)' }}>
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                    <span className="ml-2.5 text-[11px] text-gray-400 font-mono tracking-wide">Vision Aid</span>
                    {/* Mode icon tabs */}
                    <div className="ml-auto flex items-center gap-1.5">
                        {DEMO_MODES.map((m, i) => (
                            <button
                                key={m.id}
                                onClick={() => setModeIdx(i)}
                                title={m.label}
                                className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center transition-all ${i === modeIdx
                                    ? 'bg-white/10 scale-110'
                                    : 'opacity-30 hover:opacity-70'
                                    }`}
                            >
                                {m.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5 space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.4 }}
                            className="space-y-4"
                        >
                            {/* ── Colour swatch with scan line & crosshair ── */}
                            <div className="relative w-full h-32 rounded-2xl overflow-hidden shadow-lg"
                                style={{ backgroundColor: mode.swatch }}>
                                {/* dark gradient overlay */}
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)' }} />
                                {/* Scan line */}
                                <div className="absolute left-0 right-0 h-px opacity-60 pointer-events-none"
                                    style={{ top: `${scanLine}%`, background: `linear-gradient(90deg, transparent, ${mode.swatch === '#22C55E' ? '#fff' : '#fff'}, transparent)` }} />
                                {/* Crosshair */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-10 h-10 relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-px w-px h-3 bg-white/70" />
                                        <div className="absolute bottom-0 left-1/2 -translate-x-px w-px h-3 bg-white/70" />
                                        <div className="absolute left-0 top-1/2 -translate-y-px h-px w-3 bg-white/70" />
                                        <div className="absolute right-0 top-1/2 -translate-y-px h-px w-3 bg-white/70" />
                                        <div className="absolute inset-2 rounded-full border border-white/50" />
                                    </div>
                                </div>
                                {/* LIVE pill */}
                                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                                    </span>
                                    <span className="text-[9px] text-white font-mono font-bold tracking-widest">LIVE</span>
                                </div>
                                {/* WCAG badge top-right */}
                                <div className="absolute top-3 right-3">
                                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full border"
                                        style={{
                                            color: mode.wcag.color,
                                            background: mode.wcag.color + '22',
                                            borderColor: mode.wcag.color + '55'
                                        }}>
                                        WCAG {mode.wcag.label}
                                    </span>
                                </div>
                            </div>

                            {/* ── Data rows ── */}
                            <div className="rounded-2xl overflow-hidden divide-y"
                                style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.07)', divideColor: 'rgba(255,255,255,0.05)' }}>
                                {[
                                    { label: 'Name', value: mode.swatchName },
                                    { label: 'HEX', value: mode.hex },
                                    { label: 'RGB', value: mode.rgb },
                                    { label: mode.statusLabel, value: mode.statusValue, cls: mode.statusColor },
                                ].map((row, i) => (
                                    <div key={row.label} className="flex justify-between items-center px-3.5 py-2 border-b border-white/5 last:border-0">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{row.label}</span>
                                        <span className={`text-xs font-bold font-mono text-white ${row.cls || ''}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* ── Luminance bar ── */}
                            <div>
                                <div className="flex justify-between text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-1.5">
                                    <span>Luminance</span>
                                    <span>{Math.round(mode.luminance * 100)}%</span>
                                </div>
                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                                    <motion.div
                                        className="h-full rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.round(mode.luminance * 100)}%` }}
                                        transition={{ duration: 0.7, ease: 'easeOut' }}
                                        style={{ background: `linear-gradient(90deg, ${mode.swatch}, #ffffff)` }}
                                    />
                                </div>
                            </div>

                            {/* ── Harmony dots ── */}
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Harmonies</span>
                                <div className="flex gap-2">
                                    {mode.harmonies.map((h, i) => (
                                        <motion.div
                                            key={i}
                                            className="w-5 h-5 rounded-full border-2 border-white/10 shadow-lg"
                                            style={{ backgroundColor: h }}
                                            whileHover={{ scale: 1.25 }}
                                            title={h}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* ── Action button ── */}
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: `0 8px 24px ${mode.swatch}55` }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full py-3 rounded-xl text-white text-xs font-black flex items-center justify-center gap-2.5 tracking-wide"
                                style={{
                                    background: `linear-gradient(135deg, ${mode.buttonFrom}, ${mode.buttonTo})`,
                                    boxShadow: `0 4px 18px ${mode.buttonFrom}44`,
                                }}
                            >
                                {/* Mini waveform */}
                                <div className="flex items-center gap-0.5">
                                    {[3, 5, 7, 5, 3].map((h, i) => (
                                        <motion.div key={i}
                                            className="w-0.5 rounded-full bg-white/70"
                                            animate={{ height: [h, h + 4, h] }}
                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                                            style={{ height: h }}
                                        />
                                    ))}
                                </div>
                                <FaVolumeUp className="text-[11px]" />
                                {mode.buttonLabel}
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating badge */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode.id + '-badge'}
                    initial={{ opacity: 0, y: 12, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: 0.15 }}
                    className="absolute -bottom-5 -right-4 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-2xl flex items-center gap-2 border border-white/10"
                    style={{ background: 'rgba(10,15,30,0.9)' }}
                >
                    <span className={`w-2 h-2 rounded-full animate-pulse ${mode.badgeDot}`} />
                    <span className="text-[11px] font-bold text-white">{mode.badge}</span>
                </motion.div>
            </AnimatePresence>

            {/* Floating mini stat — top left */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute -top-4 -left-4 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-xl border border-white/10 flex items-center gap-2"
                style={{ background: 'rgba(10,15,30,0.9)' }}
            >
                <FaCamera className="text-blue-400 text-xs" />
                <span className="text-[10px] font-bold text-white">AI Processing</span>
                <span className="text-[10px] font-black text-green-400">0.1s</span>
            </motion.div>
        </motion.div>
    );
});
ProductMockup.displayName = 'ProductMockup';

// ── Stats ticker data ─────────────────────────────────────────────────────────
const STATS = [
    { value: '300M+', label: 'People Affected' },
    { value: '0.1s', label: 'AI Detection' },
    { value: 'WCAG AAA', label: 'Compliant' },
    { value: '99.2%', label: 'Accuracy' },
];

// ── HeroSection ───────────────────────────────────────────────────────────────
const HeroSection = memo(() => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 180]);
    const y2 = useTransform(scrollY, [0, 500], [0, -130]);

    return (
        <section className="relative min-h-[95vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">

            {/* ── Ambient background ── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[140px]" />
                <motion.div style={{ y: y2 }} className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[140px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 dark:bg-indigo-500/8 rounded-full blur-[120px]" />
                {/* Grid overlay — subtle */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.04]"
                    style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
                {/* Floating particles */}
                {PARTICLES.map(p => (
                    <motion.div
                        key={p.id}
                        className={`absolute ${p.size} rounded-full bg-blue-400/25 dark:bg-blue-400/20`}
                        style={{ left: p.left, top: p.top }}
                        animate={{ y: [0, -30, 0], x: [0, p.xOffset, 0], opacity: [0.15, 0.55, 0.15], scale: [1, 1.7, 1] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            {/* ── Main grid ── */}
            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left: Copy ── */}
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">

                        {/* Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight mb-5 leading-[1.05] text-gray-900 dark:text-white"
                        >
                            Your Guide to
                            <br />
                            <span className="relative inline-block">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                                    Colour
                                </span>
                                {' '}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400">
                                    Accessibility
                                </span>
                            </span>
                        </motion.h1>

                        {/* Introduction paragraph */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-lg leading-relaxed"
                        >
                            <strong className="text-gray-900 dark:text-white">Vision Aid</strong> is a free, browser-based accessibility platform that uses AI to help people with colour blindness navigate the world with confidence.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mb-8">
                            <Link to="/color-picker" className="group">
                                <motion.div
                                    className="relative px-8 py-4 text-base font-bold text-white rounded-2xl overflow-hidden flex items-center gap-2.5"
                                    whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(99,102,241,0.45)' }}
                                    whileTap={{ scale: 0.96 }}
                                    style={{ background: 'linear-gradient(135deg, #2563eb, #6d28d9)' }}
                                >
                                    {/* Shimmer */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '200%' }}
                                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.2 }}
                                    />
                                    <span className="relative z-10 flex items-center gap-2.5">
                                        <FaBolt className="text-yellow-300 text-sm" />
                                        Start Now
                                        <FaArrowRight className="text-xs opacity-70 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.div>
                            </Link>

                            <Link to="/color-test">
                                <motion.div
                                    className="px-8 py-4 text-base font-bold rounded-2xl flex items-center gap-2.5 border bg-white/60 dark:bg-white/5 text-gray-800 dark:text-white border-gray-200 dark:border-white/10 backdrop-blur-sm"
                                    whileHover={{ scale: 1.04, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    Take Vision Test
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Trust line */}
                        <motion.p variants={itemVariants} className="text-[11px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-widest">
                            WCAG AAA Compliant · YOLOv8 AI · 100% Private · No Install
                        </motion.p>
                    </motion.div>

                    {/* ── Right: Product mockup ── */}
                    <div className="hidden lg:flex justify-center items-center">
                        <ProductMockup />
                    </div>

                </div>
            </div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
