import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaMobileAlt, FaCamera, FaVolumeUp, FaBolt, FaBrain, FaAccessibleIcon } from 'react-icons/fa';

const STEPS = [
    {
        step: '01',
        title: 'Open in Your Browser',
        desc: 'No downloads, no sign-up. Vision Aid runs instantly on any device — desktop, tablet, or phone.',
        icon: FaMobileAlt,
        colorFrom: '#3b82f6',
        colorTo: '#06b6d4',
        glow: 'rgba(59,130,246,0.4)',
        extras: ['Works offline', 'PWA ready', 'Any browser'],
        previewColor: '#3b82f6',
        previewText: 'visionaid.app',
    },
    {
        step: '02',
        title: 'Point & AI Detects',
        desc: 'Aim your camera at any colour, object, or traffic signal. YOLOv8 + colour AI analyses it in 0.1 s.',
        icon: FaCamera,
        colorFrom: '#8b5cf6',
        colorTo: '#6366f1',
        glow: 'rgba(139,92,246,0.4)',
        extras: ['Real-time', 'WCAG data', 'HEX / RGB / HSL'],
        previewColor: '#8b5cf6',
        previewText: '#8B5CF6 — Violet',
    },
    {
        step: '03',
        title: 'Hear & Act',
        desc: 'Receive the colour name, contrast ratio, and voice announcement. All in under a second.',
        icon: FaVolumeUp,
        colorFrom: '#ec4899',
        colorTo: '#f43f5e',
        glow: 'rgba(236,72,153,0.4)',
        extras: ['Copy to clipboard', 'Save palette', 'Share result'],
        previewColor: '#ec4899',
        previewText: '🔊 "Violet — AAA Pass"',
    },
];

const StepCard = memo(({ item, i, inView }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: i * 0.18 }}
        className="relative z-10 group"
    >
        {/* Card */}
        <div
            className="relative h-full rounded-2xl overflow-hidden border border-white/[0.07] hover:border-white/[0.14] transition-all duration-500 hover:-translate-y-2"
            style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(16px)' }}
        >
            {/* Gradient top border */}
            <div
                className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, ${item.colorFrom}, ${item.colorTo})` }}
            />

            {/* Hover glow */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ boxShadow: `inset 0 0 80px ${item.glow}25, 0 0 60px ${item.glow}20` }}
            />

            <div className="p-8 flex flex-col items-center text-center">

                {/* Icon block */}
                <div className="relative mb-7">
                    {/* Glow halo */}
                    <div
                        className="absolute -inset-4 rounded-3xl blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                        style={{ background: item.glow }}
                    />
                    <motion.div
                        className="relative w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl shadow-2xl"
                        style={{ background: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})`, boxShadow: `0 12px 40px ${item.glow}` }}
                        whileHover={{ rotate: [0, -5, 5, 0], scale: 1.08 }}
                        transition={{ duration: 0.45 }}
                    >
                        <item.icon />

                        {/* Step badge */}
                        <div
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-[9px] font-black flex items-center justify-center shadow-lg border-2 border-[#0a0f1e]"
                            style={{ background: `linear-gradient(135deg, ${item.colorFrom}, ${item.colorTo})` }}
                        >
                            {i + 1}
                        </div>
                    </motion.div>
                </div>

                {/* Step label */}
                <span
                    className="inline-block text-[10px] font-black uppercase tracking-[0.18em] mb-3 px-2.5 py-0.5 rounded-full"
                    style={{ color: item.colorFrom, background: item.colorFrom + '18', border: `1px solid ${item.colorFrom}30` }}
                >
                    Step {item.step}
                </span>

                {/* Title — always gradient */}
                <h3
                    className="text-xl font-black mb-3 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, #fff 30%, ${item.colorFrom})` }}
                >
                    {item.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.desc}
                </p>

                {/* Feature tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                    {item.extras.map(e => (
                        <span
                            key={e}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: item.colorFrom + '18', color: item.colorFrom, border: `1px solid ${item.colorFrom}35` }}
                        >
                            {e}
                        </span>
                    ))}
                </div>

                {/* Preview chip */}
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-gray-300 border border-white/[0.06]"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                    <span
                        className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                        style={{ backgroundColor: item.colorFrom, boxShadow: `0 0 6px ${item.colorFrom}` }}
                    />
                    {item.previewText}
                </div>
            </div>
        </div>
    </motion.div>
));
StepCard.displayName = 'StepCard';

const HowItWorksSection = memo(() => {
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

    return (
        <section
            className="relative py-28 overflow-hidden border-t border-white/5"
            style={{ background: 'linear-gradient(180deg, #080c14 0%, #0a0f1e 100%)' }}
        >
            {/* BG decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Centre glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
                    style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07), transparent 65%)', filter: 'blur(80px)' }}
                />
                {/* Subtle dot grid */}
                <div
                    className="absolute inset-0 opacity-[0.028]"
                    style={{
                        backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 24 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5">
                        <FaBolt className="text-[10px]" /> Simple as 1-2-3
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                        How It{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                            Works
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
                        From camera to colour name in under a second. Zero friction, maximum accessibility.
                    </p>
                </motion.div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

                    {/* Animated connector (desktop) */}
                    <div className="hidden md:block absolute top-[52px] left-[calc(33%+16px)] right-[calc(33%+16px)] pointer-events-none z-0">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={headerInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1.5, delay: 0.6, ease: 'easeInOut' }}
                            className="h-px"
                            style={{ transformOrigin: 'left', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)' }}
                        />
                        {/* Travelling dot */}
                        <motion.div
                            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                            style={{ background: 'white', boxShadow: '0 0 8px rgba(255,255,255,0.9)' }}
                            initial={{ left: '0%' }}
                            animate={headerInView ? { left: ['0%', '100%', '0%'] } : {}}
                            transition={{ duration: 3.2, delay: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </div>

                    {STEPS.map((item, i) => (
                        <StepCard key={item.step} item={item} i={i} inView={headerInView} />
                    ))}
                </div>

                {/* Tech strip */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.2, duration: 0.7 }}
                    className="mt-16 flex flex-wrap justify-center gap-3"
                >
                    {[
                        { icon: FaBrain, label: 'YOLOv8 AI', color: '#8b5cf6' },
                        { icon: FaBolt, label: '0.1 s Detection', color: '#3b82f6' },
                        { icon: FaAccessibleIcon, label: 'WCAG AAA', color: '#10b981' },
                        { icon: FaVolumeUp, label: 'Voice Feedback', color: '#f59e0b' },
                    ].map(t => (
                        <motion.div
                            key={t.label}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold cursor-default"
                            style={{ background: t.color + '12', color: t.color, borderColor: t.color + '30' }}
                        >
                            <t.icon className="text-xs" />
                            {t.label}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
});

HowItWorksSection.displayName = 'HowItWorksSection';
export default HowItWorksSection;
