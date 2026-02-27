import React, { memo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    FaCamera, FaPalette, FaEye, FaTrafficLight, FaImages, FaArrowRight,
    FaCheck, FaBrain, FaFont, FaFlask, FaTags,
} from 'react-icons/fa';
import { hoverLift } from '../../utils/microInteractions';

// ── Feature data ───────────────────────────────────────────────────────────
const FEATURES = [
    {
        name: 'Live Color Detector',
        description: 'Instantly identify any color from your camera with high-accuracy AI analysis and real-time voice feedback.',
        icon: FaCamera,
        to: '/color-picker',
        gradient: 'from-blue-500 to-cyan-500',
        glow: 'group-hover:shadow-blue-500/20',
        border: 'hover:border-blue-500/40',
        tags: ['AI Vision', 'Voice Feedback', 'Real-time'],
        // Animated mini-preview elements
        previewBg: 'bg-blue-50 dark:bg-blue-900/20',
        previewContent: '🎨',
        previewLabel: 'Detecting...',
        previewColor: '#4F86C6',
    },
    {
        name: 'Palette Checker',
        description: 'Analyze color combinations for WCAG 2.1 AA/AAA contrast compliance to ensure every design is accessible.',
        icon: FaPalette,
        to: '/palette-checker',
        gradient: 'from-purple-500 to-indigo-500',
        glow: 'group-hover:shadow-purple-500/20',
        border: 'hover:border-purple-500/40',
        tags: ['WCAG 2.1', 'Contrast Ratio', 'Design'],
        previewBg: 'bg-purple-50 dark:bg-purple-900/20',
        previewContent: '✓',
        previewLabel: 'AA Pass',
        previewColor: '#8B5CF6',
    },
    {
        name: 'Color Blindness Simulator',
        description: 'See your images through the eyes of users with Protanopia, Deuteranopia, Tritanopia, and 6 other types.',
        icon: FaEye,
        to: '/simulator',
        gradient: 'from-emerald-500 to-teal-500',
        glow: 'group-hover:shadow-emerald-500/20',
        border: 'hover:border-emerald-500/40',
        tags: ['9 Simulations', 'Filters', 'Education'],
        previewBg: 'bg-emerald-50 dark:bg-emerald-900/20',
        previewContent: '👁',
        previewLabel: 'Simulating',
        previewColor: '#10B981',
    },
    {
        name: 'Traffic Signal Detection',
        description: 'Real-time YOLOv8 object detection to identify traffic lights and arrow signals. Built for accessibility.',
        icon: FaTrafficLight,
        to: '/traffic-signal',
        gradient: 'from-red-500 to-orange-500',
        glow: 'group-hover:shadow-red-500/20',
        border: 'hover:border-red-500/40',
        tags: ['YOLOv8', 'Safety', 'Arrow Detection'],
        previewBg: 'bg-red-50 dark:bg-red-900/20',
        previewContent: '🚦',
        previewLabel: 'GO →',
        previewColor: '#22c55e',
    },
    {
        name: 'Image Palette Extractor',
        description: 'Upload any photo and instantly extract its dominant color palette using in-browser k-means clustering.',
        icon: FaImages,
        to: '/palette-extractor',
        gradient: 'from-emerald-500 to-green-500',
        glow: 'group-hover:shadow-green-500/20',
        border: 'hover:border-green-500/40',
        tags: ['k-Means', 'Upload', 'Privacy-First'],
        previewBg: 'bg-green-50 dark:bg-green-900/20',
        previewContent: '🖼',
        previewLabel: '5 Colors Found',
        previewColor: '#16a34a',
    },
    {
        name: 'Contrast Checker',
        description: 'Instantly check text/background contrast ratios against WCAG standards with real-time visual feedback.',
        icon: FaCheck,
        to: '/checker',
        gradient: 'from-amber-500 to-yellow-500',
        glow: 'group-hover:shadow-amber-500/20',
        border: 'hover:border-amber-500/40',
        tags: ['WCAG', 'Text Readability', 'Live'],
        previewBg: 'bg-amber-50 dark:bg-amber-900/20',
        previewContent: '⚡',
        previewLabel: '7.5:1 AAA',
        previewColor: '#f59e0b',
    },
    {
        name: 'Color Vision Screening',
        description: 'Take an Ishihara-style test to understand your personal color vision. Quick, accurate, and educational.',
        icon: FaFlask,
        to: '/color-test',
        gradient: 'from-pink-500 to-rose-500',
        glow: 'group-hover:shadow-pink-500/20',
        border: 'hover:border-pink-500/40',
        tags: ['Ishihara', 'Self-test', 'Diagnostic'],
        previewBg: 'bg-pink-50 dark:bg-pink-900/20',
        previewContent: '🧪',
        previewLabel: 'Testing...',
        previewColor: '#ec4899',
    },
    {
        name: 'Color Psychology',
        description: 'Explore how colors influence emotions, behavior, and brand perception across cultures worldwide.',
        icon: FaBrain,
        to: '/color-psychology',
        gradient: 'from-violet-500 to-purple-500',
        glow: 'group-hover:shadow-violet-500/20',
        border: 'hover:border-violet-500/40',
        tags: ['Psychology', 'Brand', 'Culture'],
        previewBg: 'bg-violet-50 dark:bg-violet-900/20',
        previewContent: '🧠',
        previewLabel: 'Discover',
        previewColor: '#7c3aed',
    },
    {
        name: 'Text Accessibility',
        description: 'Verify your typography choices are readable for everyone. Check font size, weight, and color contrast.',
        icon: FaFont,
        to: '/text-checker',
        gradient: 'from-sky-500 to-blue-500',
        glow: 'group-hover:shadow-sky-500/20',
        border: 'hover:border-sky-500/40',
        tags: ['Typography', 'Readability', 'ARIA'],
        previewBg: 'bg-sky-50 dark:bg-sky-900/20',
        previewContent: 'Aa',
        previewLabel: 'Readable',
        previewColor: '#0ea5e9',
    },
    {
        name: 'Color Object Detector',
        description: 'AI-powered real-time camera detection that labels every object with its color name — perfect for color blind users.',
        icon: FaTags,
        to: '/color-object-detector',
        gradient: 'from-violet-500 to-fuchsia-600',
        glow: 'group-hover:shadow-violet-500/20',
        border: 'hover:border-violet-500/40',
        tags: ['YOLOv8', 'Color Labels', 'Voice Readout'],
        previewBg: 'bg-violet-50 dark:bg-violet-900/20',
        previewContent: '🏷️',
        previewLabel: 'Blue Chair',
        previewColor: '#7c3aed',
    },
];

// ── Spotlight effect card ──────────────────────────────────────────────────
const SpotlightCard = memo(({ children, className = '', gradientColor = 'rgba(168, 85, 247, 0.15)' }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    return (
        <div
            ref={divRef}
            onMouseMove={(e) => {
                const rect = divRef.current.getBoundingClientRect();
                setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            onFocus={() => setOpacity(1)}
            onBlur={() => setOpacity(0)}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${gradientColor}, transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
});
SpotlightCard.displayName = 'SpotlightCard';

// ── Mini hover preview ─────────────────────────────────────────────────────
const FeatureMiniPreview = memo(({ feature }) => (
    <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.25 }}
        className={`mt-4 p-3 rounded-xl ${feature.previewBg} border border-gray-100 dark:border-white/5 flex items-center gap-3`}
    >
        <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
            style={{ backgroundColor: feature.previewColor + '33', color: feature.previewColor }}
        >
            {feature.previewContent}
        </div>
        <div>
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{feature.previewLabel}</span>
            <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-1.5 rounded-full"
                        style={{
                            width: `${8 + i * 4}px`,
                            backgroundColor: feature.previewColor + (i < 3 ? 'cc' : '44'),
                        }}
                    />
                ))}
            </div>
        </div>
        <div className="ml-auto">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: feature.previewColor }} />
                <span className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: feature.previewColor }} />
            </span>
        </div>
    </motion.div>
));
FeatureMiniPreview.displayName = 'FeatureMiniPreview';

// ── Main section ───────────────────────────────────────────────────────────
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const FeaturesSection = memo(() => {
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true });
    const gridRef = useRef(null);
    const gridInView = useInView(gridRef, { once: true, margin: '-50px' });
    const [hoveredIdx, setHoveredIdx] = useState(null);

    return (
        <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    ref={headerRef}
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 mb-5">
                        10 Powerful Tools
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">
                        Everything You Need
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
                        Comprehensive tools designed to make the digital and physical world accessible for everyone.
                    </p>
                </motion.div>

                <motion.div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate={gridInView ? 'visible' : 'hidden'}
                >
                    {FEATURES.map((feature, idx) => {
                        const IconComponent = feature.icon;
                        const isHovered = hoveredIdx === idx;
                        return (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={hoverLift}
                                className="h-full"
                                onHoverStart={() => setHoveredIdx(idx)}
                                onHoverEnd={() => setHoveredIdx(null)}
                            >
                                <Link to={feature.to} className="block h-full" aria-label={`Go to ${feature.name}`}>
                                    <SpotlightCard
                                        gradientColor={feature.previewColor + '26'}
                                        className={`h-full rounded-[2rem] p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 ${feature.border} transition-all duration-300 shadow-lg hover:shadow-2xl ${feature.glow} group`}
                                    >
                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                            <IconComponent className="w-7 h-7" />
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-300">
                                            {feature.name}
                                        </h3>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {feature.tags.map((tag, i) => (
                                                <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/5 uppercase tracking-wide">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                                            {feature.description}
                                        </p>

                                        {/* Hover mini-preview */}
                                        {isHovered && <FeatureMiniPreview feature={feature} />}

                                        {/* CTA */}
                                        <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold text-sm group-hover:translate-x-2 transition-transform duration-300 mt-auto pt-2">
                                            Try Now <FaArrowRight className="ml-2 w-3 h-3" />
                                        </div>
                                    </SpotlightCard>
                                </Link>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
});

FeaturesSection.displayName = 'FeaturesSection';
export default FeaturesSection;
