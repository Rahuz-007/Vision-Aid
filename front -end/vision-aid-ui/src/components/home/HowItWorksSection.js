import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { FaMobileAlt, FaCamera, FaCheckCircle } from 'react-icons/fa';

const STEPS = [
    {
        step: '01',
        title: 'Launch App',
        desc: 'Open VisionAid in your browser. No downloads required.',
        icon: FaMobileAlt,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
        step: '02',
        title: 'Point Camera',
        desc: 'Aim your device at any object, color, or text.',
        icon: FaCamera,
        color: 'text-purple-600',
        bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
        step: '03',
        title: 'Instant Feedback',
        desc: 'Receive immediate voice narration and visual cues.',
        icon: FaCheckCircle,
        color: 'text-pink-600',
        bg: 'bg-pink-50 dark:bg-pink-900/20',
    },
];

const HowItWorksSection = memo(() => (
    <section className="relative py-20 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Simple steps to make your world more accessible.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative px-4">
                {/* Animated connecting line */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] overflow-hidden">
                    <motion.div
                        initial={{ width: '0%' }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="h-0.5 bg-gradient-to-r from-blue-100 via-purple-300 to-pink-100 dark:from-white/5 dark:via-purple-500/50 dark:to-white/5"
                    />
                </div>

                {STEPS.map((item, i) => (
                    <motion.div
                        key={item.step}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="relative z-10 flex flex-col items-center text-center group"
                    >
                        <div className={`w-24 h-24 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center text-3xl mb-6 shadow-lg shadow-gray-100/50 dark:shadow-none group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 p-3 text-xs font-black opacity-20 dark:opacity-30">{item.step}</div>
                            <item.icon />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm max-w-xs">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));

HowItWorksSection.displayName = 'HowItWorksSection';
export default HowItWorksSection;
