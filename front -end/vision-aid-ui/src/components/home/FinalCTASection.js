import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRocket, FaShieldAlt, FaHeart, FaBolt, FaCamera, FaPalette, FaEye } from 'react-icons/fa';

const BADGES = [
    { icon: FaRocket, label: 'Free Forever', from: '#2563eb', to: '#4f46e5' },
    { icon: FaShieldAlt, label: 'Privacy-First', from: '#7c3aed', to: '#6d28d9' },
    { icon: FaHeart, label: 'Open Access', from: '#db2777', to: '#be123c' },
];

const QUICK_LINKS = [
    { icon: FaCamera, label: 'Live Color Detector', to: '/color-picker', color: '#3b82f6' },
    { icon: FaPalette, label: 'Palette Checker', to: '/palette-checker', color: '#7c3aed' },
    { icon: FaEye, label: 'Blindness Simulator', to: '/simulator', color: '#10b981' },
    { icon: FaBolt, label: 'Vision Test', to: '/color-test', color: '#f59e0b' },
];

const FinalCTASection = memo(() => (
    <section className="relative py-36 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080c14 0%, #030507 100%)' }}>

        {/* Mesh gradient */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full"
                style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(79,70,229,0.15), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(219,39,119,0.12), transparent 60%)' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[140px] opacity-20"
                style={{ background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)' }} />
            {/* Subtle grid */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
            {/* Floating orbs */}
            {[
                { size: 24, x: '8%', y: '18%', delay: 0, color: '#3B82F6' },
                { size: 16, x: '88%', y: '12%', delay: 0.8, color: '#8B5CF6' },
                { size: 28, x: '72%', y: '72%', delay: 0.4, color: '#EC4899' },
                { size: 18, x: '18%', y: '78%', delay: 1.4, color: '#10B981' },
                { size: 12, x: '50%', y: '8%', delay: 2, color: '#F59E0B' },
                { size: 10, x: '40%', y: '88%', delay: 1, color: '#06B6D4' },
            ].map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: orb.size, height: orb.size,
                        left: orb.x, top: orb.y,
                        background: orb.color,
                        boxShadow: `0 0 ${orb.size * 3}px ${orb.color}70`,
                        opacity: 0.55,
                    }}
                    animate={{ y: [0, -18, 0], scale: [1, 1.12, 1] }}
                    transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
                />
            ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

            {/* Badge row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-3 mb-12"
            >
                {BADGES.map(({ icon: Icon, label, from, to }, i) => (
                    <div key={i}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-xs font-bold shadow-xl"
                        style={{ background: `linear-gradient(135deg, ${from}, ${to})`, boxShadow: `0 4px 20px ${from}44` }}>
                        <Icon className="text-sm" /> {label}
                    </div>
                ))}
            </motion.div>

            {/* Headline */}
            <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-[1.05]"
            >
                Colour the world
                <br />
                <span className="bg-clip-text text-transparent"
                    style={{ backgroundImage: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)' }}>
                    accessibly.
                </span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-lg mx-auto mb-12 leading-relaxed"
            >
                Join thousands of designers, developers, and everyday users who rely on Vision Aid for colour accessibility — <strong className="text-white">completely free</strong>, forever.
            </motion.p>

            {/* Primary CTA */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
                <Link to="/color-picker">
                    <motion.div
                        className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-white font-black text-lg overflow-hidden"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                        style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed, #db2777)', boxShadow: '0 8px 40px rgba(124,58,237,0.45)' }}
                    >
                        {/* Shimmer */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '200%' }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                        />
                        <span className="relative z-10 flex items-center gap-3">
                            Start Now
                            <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                <FaArrowRight />
                            </motion.span>
                        </span>
                    </motion.div>
                </Link>

                <Link to="/simulator">
                    <motion.div
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-bold text-base border border-white/15 hover:border-white/35 hover:bg-white/5 transition-all duration-300"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Try Blindness Simulator
                    </motion.div>
                </Link>
            </motion.div>

            {/* Quick links */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.45 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-12"
            >
                {QUICK_LINKS.map(({ icon: Icon, label, to, color }) => (
                    <Link key={to} to={to}>
                        <motion.div
                            className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 hover:border-white/15 text-center transition-all duration-300 hover:-translate-y-1"
                            style={{ background: 'rgba(255,255,255,0.03)' }}
                            whileHover={{ boxShadow: `0 8px 30px ${color}33` }}
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                                style={{ background: color + '25', color }}>
                                <Icon className="text-sm" />
                            </div>
                            <span className="text-[11px] text-gray-400 font-semibold leading-tight">{label}</span>
                        </motion.div>
                    </Link>
                ))}
            </motion.div>

            {/* Trust line */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                className="text-[11px] text-white/25 uppercase tracking-[0.2em] font-bold"
            >
                No sign-up · Works in browser · 100% private · WCAG AAA compliant
            </motion.p>
        </div>
    </section>
));

FinalCTASection.displayName = 'FinalCTASection';
export default FinalCTASection;
