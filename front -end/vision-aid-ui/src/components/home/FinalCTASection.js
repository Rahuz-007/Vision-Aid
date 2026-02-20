import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight, FaRocket, FaShieldAlt, FaHeart } from 'react-icons/fa';

const BADGES = [
    { icon: FaRocket, label: 'Free Forever', color: 'from-blue-500 to-cyan-500' },
    { icon: FaShieldAlt, label: 'Privacy-First', color: 'from-purple-500 to-indigo-500' },
    { icon: FaHeart, label: 'Open Access', color: 'from-pink-500 to-rose-500' },
];

const FinalCTASection = memo(() => (
    <section className="relative py-32 overflow-hidden bg-gray-900 dark:bg-[#050505]">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/60 dark:from-blue-950/60 via-purple-900/60 dark:via-purple-950/60 to-pink-900/40 dark:to-pink-950/40" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/15 rounded-full blur-[120px]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
            {/* Animated floating orbs */}
            {[
                { size: 6, x: '10%', y: '20%', delay: 0, color: '#3B82F6' },
                { size: 4, x: '85%', y: '15%', delay: 1, color: '#8B5CF6' },
                { size: 8, x: '70%', y: '70%', delay: 0.5, color: '#EC4899' },
                { size: 5, x: '20%', y: '75%', delay: 1.5, color: '#10B981' },
                { size: 3, x: '50%', y: '10%', delay: 2, color: '#F59E0B' },
            ].map((orb, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: orb.size * 4, height: orb.size * 4,
                        left: orb.x, top: orb.y,
                        background: orb.color,
                        boxShadow: `0 0 ${orb.size * 8}px ${orb.color}80`,
                        opacity: 0.6,
                    }}
                    animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4 + i, repeat: Infinity, delay: orb.delay, ease: 'easeInOut' }}
                />
            ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Badge row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-3 mb-10"
            >
                {BADGES.map(({ icon: Icon, label, color }, i) => (
                    <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${color} text-white text-xs font-bold shadow-lg`}>
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
                className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
            >
                Ready to see the world
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                    in full color?
                </span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-xl mx-auto mb-12"
            >
                Join thousands of designers, developers, and everyday users who rely on VisionAid for color accessibility — completely free.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
                <Link
                    to="/color-picker"
                    className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
                >
                    Start for Free
                    <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <FaArrowRight />
                    </motion.span>
                </Link>
                <Link
                    to="/simulator"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                >
                    Try Color Blindness Sim
                </Link>
            </motion.div>

            {/* Trust line */}
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-xs text-white/30 uppercase tracking-widest font-bold"
            >
                No sign-up required · Works in your browser · 100% private
            </motion.p>
        </div>
    </section>
));

FinalCTASection.displayName = 'FinalCTASection';
export default FinalCTASection;
