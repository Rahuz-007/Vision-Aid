import React, { memo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShieldAlt, FaMagic, FaBolt } from 'react-icons/fa';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// Pre-computed stable particle positions (avoid re-computing on every render)
const PARTICLES = [...Array(20)].map((_, i) => ({
    id: i,
    left: `${(i * 17 + 13) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    duration: 3 + (i % 3),
    delay: (i * 0.3) % 2,
    xOffset: (i % 5) * 4 - 10,
}));

const HeroSection = memo(() => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob" />
                <motion.div style={{ y: y2 }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] opacity-30" />

                {/* Stable Floating Particles */}
                {PARTICLES.map(p => (
                    <motion.div
                        key={p.id}
                        className="absolute w-1 h-1 bg-purple-400/30 dark:bg-purple-400/20 rounded-full"
                        style={{ left: p.left, top: p.top }}
                        animate={{ y: [0, -30, 0], x: [0, p.xOffset, 0], opacity: [0.2, 0.5, 0.2], scale: [1, 1.5, 1] }}
                        transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <motion.div
                className="relative z-10 max-w-5xl mx-auto text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="mb-8 flex justify-center">
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
                    className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.1]"
                >
                    Professional
                    <br />
                    <motion.span
                        className="relative inline-block"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 blur-2xl opacity-50"
                            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                            style={{ backgroundSize: '200% auto' }}
                        />
                        <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x bg-[length:200%_auto]">
                            Color Accessibility
                        </span>
                        {/* Sparkles — hidden on xs to avoid overflow */}
                        <span className="hidden sm:block">
                            {[...Array(5)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute text-yellow-400 text-xl pointer-events-none"
                                    style={{ left: `${20 + i * 20}%`, top: `${-10 + (i % 2) * 20}%` }}
                                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], rotate: [0, 180, 360] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                >✨</motion.span>
                            ))}
                        </span>
                    </motion.span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    variants={itemVariants}
                    className="text-base sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-2 sm:px-0"
                >
                    Detect colors in real-time, check color contrast compliance, and identify traffic signals with{' '}
                    <span className="text-gray-900 dark:text-white font-bold">confidence</span>.
                </motion.p>

                {/* CTA Button */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 sm:mb-20">
                    <Link to="/color-picker" className="group relative inline-block">
                        <motion.div
                            className="relative px-8 py-4 text-lg font-bold text-white rounded-full overflow-hidden"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500"
                                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{ backgroundSize: '200% auto' }}
                            />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                initial={{ x: '-100%' }}
                                animate={{ x: '200%' }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                            />
                            <motion.div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity" />
                            <span className="relative z-10 flex items-center gap-2">
                                Get Started Now
                                <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                                    <FaBolt className="text-yellow-300" />
                                </motion.span>
                            </span>
                            <motion.div
                                className="absolute inset-0 bg-white/20 rounded-full"
                                initial={{ scale: 0, opacity: 1 }}
                                whileTap={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 0.6 }}
                            />
                        </motion.div>
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </Link>
                </motion.div>

                {/* Trust Badges */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-sm font-semibold text-gray-600 dark:text-gray-400">
                    {[
                        { icon: FaCheckCircle, label: 'WCAG AAA Compliant', color: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400' },
                        { icon: FaMagic, label: 'Real-time Detection', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' },
                        { icon: FaShieldAlt, label: 'Privacy First', color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' },
                    ].map(({ icon: Icon, label, color }) => (
                        <div key={label} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5">
                            <div className={`p-2 rounded-full ${color}`}><Icon size={20} /></div>
                            <span className="text-gray-900 dark:text-gray-200">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
});

HeroSection.displayName = 'HeroSection';
export default HeroSection;
