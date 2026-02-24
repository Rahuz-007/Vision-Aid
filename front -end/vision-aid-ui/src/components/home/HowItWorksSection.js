import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaMobileAlt, FaCamera, FaVolumeUp, FaArrowRight } from 'react-icons/fa';

const STEPS = [
    {
        step: '01',
        title: 'Open the App',
        desc: 'Access Vision Aid instantly in your browser — no downloads, no installs. Works on every device.',
        icon: FaMobileAlt,
        gradient: 'from-blue-500 to-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        glowColor: 'rgba(59, 130, 246, 0.3)',
        detail: 'Free · No sign-up needed',
    },
    {
        step: '02',
        title: 'Point Your Camera',
        desc: 'Aim your device at any color, object, or traffic signal. Our AI analyzes in real-time.',
        icon: FaCamera,
        gradient: 'from-purple-500 to-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/10',
        glowColor: 'rgba(139, 92, 246, 0.3)',
        detail: 'AI-powered · 0.1s detection',
    },
    {
        step: '03',
        title: 'Get Instant Feedback',
        desc: 'Receive color names, WCAG data, and voice announcements — all in under a second.',
        icon: FaVolumeUp,
        gradient: 'from-pink-500 to-pink-600',
        bg: 'bg-pink-50 dark:bg-pink-900/10',
        glowColor: 'rgba(236, 72, 153, 0.3)',
        detail: 'Voice · Visual · Haptic',
    },
];

const HowItWorksSection = memo(() => {
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true });

    return (
        <section className="relative py-24 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-white/5 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 dark:bg-purple-500/5 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/20 mb-4">
                        Simple Process
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        From camera to color name in under a second. Here's the magic.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting dashed line (desktop only) */}
                    <div className="hidden md:block absolute top-12 left-[22%] right-[22%] pointer-events-none">
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={headerInView ? { scaleX: 1 } : {}}
                            transition={{ duration: 1.5, delay: 0.4, ease: 'easeInOut' }}
                            style={{ transformOrigin: 'left' }}
                            className="h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 dark:from-blue-500/50 dark:via-purple-500/50 dark:to-pink-500/50"
                        />
                        {/* Arrows along the line */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={headerInView ? { opacity: 1 } : {}}
                            transition={{ delay: 1.5 }}
                            className="absolute top-1/2 left-[42%] -translate-y-1/2 text-purple-400 dark:text-purple-500 text-xs"
                        >
                            <FaArrowRight />
                        </motion.div>
                    </div>

                    {STEPS.map((item, i) => (
                        <motion.div
                            key={item.step}
                            initial={{ opacity: 0, y: 30 }}
                            animate={headerInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            {/* Step number bubble */}
                            <div className="relative mb-6">
                                {/* Glow */}
                                <div
                                    className="absolute -inset-3 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: item.glowColor }}
                                />
                                {/* Icon container */}
                                <motion.div
                                    className={`relative w-24 h-24 rounded-3xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-300`}
                                    whileHover={{ rotate: [0, -5, 5, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <item.icon className="text-3xl" />
                                    {/* Step badge */}
                                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black flex items-center justify-center shadow-lg">
                                        {i + 1}
                                    </div>
                                </motion.div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm max-w-xs mb-3">{item.desc}</p>

                            {/* Detail badge */}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.bg} text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-white/5`}>
                                {item.detail}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});

HowItWorksSection.displayName = 'HowItWorksSection';
export default HowItWorksSection;
