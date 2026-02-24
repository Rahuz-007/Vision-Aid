import React, { memo, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShieldAlt, FaMagic, FaBolt, FaVolumeUp } from 'react-icons/fa';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Pre-computed stable particle positions (avoid random on render)
const PARTICLES = [...Array(18)].map((_, i) => ({
    id: i,
    left: `${(i * 17 + 13) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    duration: 3 + (i % 3),
    delay: (i * 0.3) % 2,
    xOffset: (i % 5) * 4 - 10,
}));

// ── Cycling demo modes ────────────────────────────────────────────────────
const DEMO_MODES = [
    {
        id: 'color',
        label: 'Color Detection',
        icon: '🎨',
        badge: 'Color Detection Active',
        badgeColor: 'bg-blue-500',
        swatch: '#6495ED',
        swatchName: 'Cornflower Blue',
        hex: '#6495ED',
        rgb: 'rgb(100, 149, 237)',
        status: 'AA ✓',
        statusColor: 'text-green-400',
        buttonLabel: '🔊 Announce Color',
        buttonGrad: 'from-blue-500 to-indigo-600',
    },
    {
        id: 'traffic',
        label: 'Traffic Signal',
        icon: '🚦',
        badge: 'Signal Detected',
        badgeColor: 'bg-green-500',
        swatch: '#22C55E',
        swatchName: 'Green Light — GO',
        hex: '#22C55E',
        rgb: 'rgb(34, 197, 94)',
        status: 'GO →',
        statusColor: 'text-green-400',
        buttonLabel: '🔊 Announce Signal',
        buttonGrad: 'from-green-500 to-emerald-600',
    },
    {
        id: 'palette',
        label: 'Palette Check',
        icon: '✅',
        badge: 'WCAG AA Pass',
        badgeColor: 'bg-purple-500',
        swatch: '#8B5CF6',
        swatchName: 'Violet — AA Pass',
        hex: '#8B5CF6',
        rgb: 'rgb(139, 92, 246)',
        status: 'AAA ✓',
        statusColor: 'text-purple-400',
        buttonLabel: '🔊 Read Contrast',
        buttonGrad: 'from-purple-500 to-violet-600',
    },
];

// ── Product Mockup Card ───────────────────────────────────────────────────
const ProductMockup = memo(() => {
    const [modeIdx, setModeIdx] = useState(0);
    const mode = DEMO_MODES[modeIdx];

    // Cycle through modes every 3 seconds
    useEffect(() => {
        const t = setInterval(() => setModeIdx(prev => (prev + 1) % DEMO_MODES.length), 3000);
        return () => clearInterval(t);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-[340px] mx-auto lg:mx-0"
        >
            {/* Ambient glow behind card */}
            <motion.div
                className="absolute -inset-6 rounded-3xl blur-2xl opacity-20 pointer-events-none"
                animate={{ background: `radial-gradient(ellipse, ${mode.swatch}88, transparent 70%)` }}
                transition={{ duration: 0.8 }}
            />

            {/* Card shell */}
            <div className="relative bg-[#111827]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

                {/* Window chrome bar */}
                <div className="flex items-center gap-1.5 px-4 py-3 bg-black/30 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/70" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                    <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    <span className="ml-2 text-xs text-gray-400 font-mono">Vision Aid</span>
                    {/* Mode tabs */}
                    <div className="ml-auto flex items-center gap-1">
                        {DEMO_MODES.map((m, i) => (
                            <button
                                key={m.id}
                                onClick={() => setModeIdx(i)}
                                title={m.label}
                                className={`text-sm transition-opacity ${i === modeIdx ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                            >
                                {m.icon}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.35 }}
                        >
                            {/* Color swatch */}
                            <div
                                className="w-full h-28 rounded-2xl mb-4 shadow-inner flex items-end p-3"
                                style={{ backgroundColor: mode.swatch }}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                                    </span>
                                    <span className="text-[10px] text-white/80 font-mono font-bold">LIVE</span>
                                </div>
                            </div>

                            {/* Color info rows */}
                            <div className="space-y-2 mb-4">
                                {[
                                    { label: 'Name', value: mode.swatchName },
                                    { label: 'HEX', value: mode.hex },
                                    { label: 'RGB', value: mode.rgb },
                                    { label: 'Status', value: mode.status, cls: mode.statusColor },
                                ].map(row => (
                                    <div key={row.label} className="flex justify-between items-center text-xs border-b border-white/5 pb-2">
                                        <span className="text-gray-500">{row.label}</span>
                                        <span className={`font-bold text-white font-mono ${row.cls || ''}`}>{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Action button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className={`w-full py-2.5 rounded-xl text-white text-xs font-bold bg-gradient-to-r ${mode.buttonGrad} shadow-lg flex items-center justify-center gap-2`}
                            >
                                <FaVolumeUp className="text-xs" />
                                {mode.buttonLabel}
                            </motion.button>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Floating mode badge */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={mode.id + '-badge'}
                    initial={{ opacity: 0, y: 10, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ delay: 0.1 }}
                    className="absolute -bottom-4 -right-3 bg-gray-900/90 backdrop-blur-xl rounded-2xl px-4 py-2 shadow-xl border border-white/10 flex items-center gap-2"
                >
                    <span className={`w-2 h-2 rounded-full ${mode.badgeColor} animate-pulse`} />
                    <span className="text-xs font-bold text-white">{mode.badge}</span>
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
});
ProductMockup.displayName = 'ProductMockup';

// ── HeroSection ─────────────────────────────────────────────────────────────
const HeroSection = memo(() => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 180]);
    const y2 = useTransform(scrollY, [0, 500], [0, -130]);

    return (
        <section className="relative min-h-[95vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">

            {/* ── Ambient background ── */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-[130px] animate-blob" />
                <motion.div style={{ y: y2 }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[130px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px]" />
                {/* Floating particles */}
                {PARTICLES.map(p => (
                    <motion.div
                        key={p.id}
                        className="absolute w-1 h-1 rounded-full bg-blue-400/30 dark:bg-blue-400/20"
                        style={{ left: p.left, top: p.top }}
                        animate={{ y: [0, -28, 0], x: [0, p.xOffset, 0], opacity: [0.2, 0.6, 0.2], scale: [1, 1.6, 1] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            {/* ── Main grid ── */}
            <div className="relative z-10 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* ── Left: Copy ── */}
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">

                        {/* Badge */}
                        <motion.div variants={itemVariants} className="mb-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-900/5 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 backdrop-blur-md">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                </span>
                                AI-Powered Accessibility Platform
                            </div>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={itemVariants}
                            className="text-4xl xs:text-5xl sm:text-6xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 leading-[1.08] text-gray-900 dark:text-white"
                        >
                            Professional
                            <br />
                            <span className="relative inline-block">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                                    Color
                                </span>
                            </span>
                            <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
                                Accessibility
                            </span>
                        </motion.h1>

                        {/* Sub */}
                        <motion.p
                            variants={itemVariants}
                            className="text-base sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed font-medium"
                        >
                            Detect colors in real-time, check contrast compliance, and identify traffic signals with <strong className="text-gray-900 dark:text-white">confidence</strong>. Powered by YOLOv8 AI.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Link to="/color-picker" className="group relative inline-block">
                                <motion.div
                                    className="relative px-8 py-4 text-lg font-bold text-white rounded-full overflow-hidden"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
                                    {/* Shimmer */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '200%' }}
                                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                                    />
                                    <span className="relative z-10 flex items-center gap-2">
                                        Get Started
                                        <FaBolt className="text-yellow-300 text-sm" />
                                    </span>
                                </motion.div>
                            </Link>


                        </motion.div>

                        {/* Trust badges */}
                        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 max-w-md">
                            {[
                                { icon: FaCheckCircle, label: 'WCAG AAA', color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' },
                                { icon: FaMagic, label: 'Real-time AI', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
                                { icon: FaShieldAlt, label: 'Privacy First', color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' },
                            ].map(({ icon: Icon, label, color }) => (
                                <div key={label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5">
                                    <div className={`p-2 rounded-full ${color}`}><Icon size={14} /></div>
                                    <span className="text-gray-900 dark:text-gray-200 text-xs font-semibold text-center">{label}</span>
                                </div>
                            ))}
                        </motion.div>
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
