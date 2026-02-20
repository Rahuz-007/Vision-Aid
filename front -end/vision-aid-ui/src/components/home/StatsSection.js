import React, { memo } from 'react';
import { motion } from 'framer-motion';

const STATS = [
    {
        value: '300M+',
        label: 'People Affected Worldwide',
        color: 'text-purple-600 dark:text-white',
        shadow: 'rgba(168, 85, 247, 0.6)',
        hover: 'from-purple-500/10',
        labelColor: 'text-purple-600 dark:text-purple-400',
    },
    {
        value: '1 in 12',
        label: 'Men Have Color Blindness',
        color: 'text-blue-600 dark:text-white',
        shadow: 'rgba(59, 130, 246, 0.6)',
        hover: 'from-blue-500/10',
        labelColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        value: '9 Types',
        label: 'Color Blindness Supported',
        color: 'text-pink-600 dark:text-white',
        shadow: 'rgba(236, 72, 153, 0.6)',
        hover: 'from-pink-500/10',
        labelColor: 'text-pink-600 dark:text-pink-400',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const StatsSection = memo(() => (
    <section className="relative py-24 border-t border-gray-200 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#050505]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">By the Numbers</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">Understanding the global impact of color vision deficiency</p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {STATS.map((stat, i) => (
                    <motion.div key={i} variants={itemVariants} className="relative group">
                        <div className="relative p-10 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.hover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                            <div className="relative z-10">
                                <div
                                    className={`text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black ${stat.color} mb-6 tracking-tighter group-hover:scale-105 transition-transform flex justify-center items-baseline gap-2`}
                                    style={{ textShadow: `0 0 40px ${stat.shadow}` }}
                                >
                                    {stat.value}
                                </div>
                                <p className={`${stat.labelColor} text-xl font-bold uppercase tracking-wider`}>
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
));

StatsSection.displayName = 'StatsSection';
export default StatsSection;
