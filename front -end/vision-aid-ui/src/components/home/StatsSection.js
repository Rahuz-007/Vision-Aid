import React, { memo, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGlobeAmericas, FaMale, FaEye, FaBolt } from 'react-icons/fa';

// ── Animated count-up hook ─────────────────────────────────────────────────
function useCountUp(end, duration = 2000, shouldStart = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!shouldStart || isNaN(end)) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else { setCount(Math.floor(start)); }
        }, 16);
        return () => clearInterval(timer);
    }, [end, duration, shouldStart]);
    return count;
}

const STATS = [
    {
        icon: FaGlobeAmericas,
        value: '300M+',
        rawNumber: 300,
        prefix: '',
        suffix: 'M+',
        label: 'People Affected',
        sub: 'Living with colour vision deficiency worldwide',
        from: '#7c3aed',
        to: '#4f46e5',
        glow: 'rgba(124,58,237,0.3)',
    },
    {
        icon: FaMale,
        value: '1 in 12',
        rawNumber: NaN,
        label: 'Men Affected',
        sub: 'Colour blindness is far more common than most realise',
        from: '#2563eb',
        to: '#0891b2',
        glow: 'rgba(37,99,235,0.3)',
    },
    {
        icon: FaEye,
        value: '9',
        rawNumber: 9,
        prefix: '',
        suffix: '',
        label: 'Types Simulated',
        sub: 'Including Protanopia, Deuteranopia, Tritanopia & more',
        from: '#db2777',
        to: '#e11d48',
        glow: 'rgba(219,39,119,0.3)',
    },
    {
        icon: FaBolt,
        value: '0.1s',
        rawNumber: NaN,
        label: 'AI Detection Speed',
        sub: 'Real-time YOLOv8 + colour analysis, under a second',
        from: '#059669',
        to: '#0891b2',
        glow: 'rgba(5,150,105,0.3)',
    },
];

const StatCard = memo(({ stat, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const count = useCountUp(stat.rawNumber, 2000, inView && !isNaN(stat.rawNumber));

    const display = isNaN(stat.rawNumber)
        ? stat.value
        : (stat.prefix || '') + count.toLocaleString() + (stat.suffix || '');

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: index * 0.12 }}
            className="group relative"
        >
            <div className="relative rounded-3xl p-8 border border-white/5 hover:border-white/15 transition-all duration-500 overflow-hidden hover:-translate-y-2"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)', backdropFilter: 'blur(12px)' }}>

                {/* Glow bg */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 80px ${stat.glow}` }} />

                {/* Corner blob */}
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                    style={{ background: `radial-gradient(circle, ${stat.from}, transparent)` }} />

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl mb-5 flex items-center justify-center text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${stat.from}, ${stat.to})` }}>
                    <stat.icon className="text-lg" />
                </div>

                {/* Value */}
                <motion.div
                    className="text-5xl sm:text-6xl font-black mb-2 bg-clip-text text-transparent"
                    style={{ backgroundImage: `linear-gradient(135deg, #fff 40%, ${stat.from})` }}
                    animate={inView ? { scale: [0.85, 1.04, 1] } : {}}
                    transition={{ duration: 0.7, delay: index * 0.12 + 0.2 }}
                >
                    {display}
                </motion.div>

                {/* Gradient bar */}
                <motion.div
                    className="h-1 rounded-full mb-3"
                    initial={{ width: 0 }}
                    animate={inView ? { width: '55%' } : { width: 0 }}
                    transition={{ duration: 0.9, delay: index * 0.12 + 0.4 }}
                    style={{ background: `linear-gradient(90deg, ${stat.from}, ${stat.to})` }}
                />

                {/* Label */}
                <p className="text-base font-bold text-white mb-1">{stat.label}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{stat.sub}</p>
            </div>
        </motion.div>
    );
});
StatCard.displayName = 'StatCard';

const StatsSection = memo(() => {
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true });

    return (
        <section className="relative py-24 border-t border-white/5 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050505 0%, #080c14 100%)' }}>

            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
                    style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent)' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30"
                    style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.12), transparent)' }} />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
                        style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.25)' }}>
                        Global Impact
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        The World Needs This
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Colour blindness is the world's most common visual impairment — and it's largely overlooked in digital design.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <StatCard key={stat.label} stat={stat} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
});

StatsSection.displayName = 'StatsSection';
export default StatsSection;
