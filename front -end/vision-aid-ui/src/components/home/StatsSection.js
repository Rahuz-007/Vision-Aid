import React, { memo, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

// ── Animated count-up hook ─────────────────────────────────────────────────
function useCountUp(end, duration = 2000, shouldStart = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldStart) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration, shouldStart]);

    return count;
}

// ── Individual animated stat card ─────────────────────────────────────────
const StatCard = memo(({ stat, index }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-80px' });

    // Parse if it's a plain number vs complex string
    const numericValue = parseInt(stat.rawNumber, 10);
    const animatedCount = useCountUp(numericValue, 2200, isInView && !isNaN(numericValue));

    const displayValue = isNaN(numericValue)
        ? stat.value
        : stat.prefix + animatedCount.toLocaleString() + stat.suffix;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
            className="relative group"
        >
            <div className="relative p-10 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-default">
                {/* Background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.hover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Animated ring */}
                <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-5 group-hover:opacity-20 transition-opacity duration-500"
                    style={{ background: stat.ringColor }}
                />

                <div className="relative z-10">
                    {/* Main stat number with count-up */}
                    <motion.div
                        className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black ${stat.color} mb-6 tracking-tighter flex justify-center items-baseline gap-1`}
                        style={{ textShadow: `0 0 40px ${stat.shadow}` }}
                        animate={isInView ? { scale: [0.85, 1.05, 1] } : {}}
                        transition={{ duration: 0.8, delay: index * 0.15 + 0.2 }}
                    >
                        {displayValue}
                    </motion.div>

                    {/* Animated underline */}
                    <motion.div
                        className={`h-1 rounded-full mb-4 mx-auto ${stat.barColor}`}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: '60%' } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.15 + 0.5 }}
                    />

                    <p className={`${stat.labelColor} text-xl font-bold uppercase tracking-wider text-center`}>
                        {stat.label}
                    </p>
                </div>
            </div>
        </motion.div>
    );
});
StatCard.displayName = 'StatCard';

// ── Stats data ─────────────────────────────────────────────────────────────
const STATS = [
    {
        value: '300M+',
        rawNumber: '300',
        prefix: '',
        suffix: 'M+',
        label: 'People Affected Worldwide',
        color: 'text-purple-600 dark:text-white',
        shadow: 'rgba(168, 85, 247, 0.6)',
        hover: 'from-purple-500/10',
        labelColor: 'text-purple-600 dark:text-purple-400',
        barColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
        ringColor: '#a855f7',
    },
    {
        value: '1 in 12',
        rawNumber: NaN,
        prefix: '',
        suffix: '',
        label: 'Men Have Color Blindness',
        color: 'text-blue-600 dark:text-white',
        shadow: 'rgba(59, 130, 246, 0.6)',
        hover: 'from-blue-500/10',
        labelColor: 'text-blue-600 dark:text-blue-400',
        barColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        ringColor: '#3b82f6',
    },
    {
        value: '9 Types',
        rawNumber: '9',
        prefix: '',
        suffix: ' Types',
        label: 'Color Blindness Supported',
        color: 'text-pink-600 dark:text-white',
        shadow: 'rgba(236, 72, 153, 0.6)',
        hover: 'from-pink-500/10',
        labelColor: 'text-pink-600 dark:text-pink-400',
        barColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
        ringColor: '#ec4899',
    },
];

const StatsSection = memo(() => {
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true });

    return (
        <section className="relative py-24 border-t border-gray-200 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#050505]">
            {/* Background glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 mb-4">
                        Global Impact
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">By the Numbers</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">Understanding the global impact of color vision deficiency</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STATS.map((stat, i) => (
                        <StatCard key={i} stat={stat} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
});

StatsSection.displayName = 'StatsSection';
export default StatsSection;
