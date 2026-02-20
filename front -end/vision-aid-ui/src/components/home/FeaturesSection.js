import React, { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCamera, FaPalette, FaEye, FaTrafficLight, FaImages, FaArrowRight } from 'react-icons/fa';
import { hoverLift } from '../../utils/microInteractions';

const FEATURES = [
    {
        name: 'Live Color Detector',
        description: 'Instantly identify colors from your camera feed with high-accuracy AI analysis and voice feedback.',
        icon: FaCamera,
        to: '/color-picker',
        gradient: 'from-blue-500 to-cyan-500',
        tags: ['AI Vision', 'Voice Feedback', 'Real-time'],
    },
    {
        name: 'Palette Checker',
        description: 'Analyze color combinations for WCAG 2.1 contrast compliance to ensure accessible designs.',
        icon: FaPalette,
        to: '/palette-checker',
        gradient: 'from-purple-500 to-indigo-500',
        tags: ['WCAG 2.1', 'Contrast Ratio', 'Design'],
    },
    {
        name: 'Color Blindness Simulator',
        description: 'Visualize how your images appear to users with Protanopia, Deuteranopia, and other deficiencies.',
        icon: FaEye,
        to: '/simulator',
        gradient: 'from-emerald-500 to-teal-500',
        tags: ['Simulation', 'Filters', 'Education'],
    },
    {
        name: 'Traffic Signal Detection',
        description: 'Real-time detection of traffic lights using computer vision to assist with safe navigation.',
        icon: FaTrafficLight,
        to: '/traffic-signal',
        gradient: 'from-red-500 to-orange-500',
        tags: ['YOLOv8', 'Safety', 'Object Detection'],
    },
    {
        name: 'Image Palette Extractor',
        description: 'Upload any photo and instantly extract its dominant color palette using in-browser k-means clustering.',
        icon: FaImages,
        to: '/palette-extractor',
        gradient: 'from-emerald-500 to-green-500',
        tags: ['k-Means', 'Upload', 'Privacy-First'],
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

// Spotlight effect card
const SpotlightCard = memo(({ children, className = '', onClick }) => {
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
            onClick={onClick}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.15), transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
});

SpotlightCard.displayName = 'SpotlightCard';

const FeaturesSection = memo(() => (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
                className="text-center mb-24"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6">Powerful Features</h2>
                <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl mx-auto">
                    Comprehensive tools designed to make the digital (and physical) world accessible for everyone.
                </p>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {FEATURES.map((feature, idx) => {
                    const IconComponent = feature.icon;
                    return (
                        <motion.div key={idx} variants={itemVariants} whileHover={hoverLift} className="h-full">
                            <Link to={feature.to} className="block h-full">
                                <SpotlightCard className="h-full rounded-[2.5rem] p-10 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-colors duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                                        <IconComponent className="w-8 h-8" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all">
                                        {feature.name}
                                    </h3>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {feature.tags.map((tag, i) => (
                                            <span key={i} className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-2 transition-transform duration-300">
                                        Try Now <FaArrowRight className="ml-2" />
                                    </div>
                                </SpotlightCard>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
));

FeaturesSection.displayName = 'FeaturesSection';
export default FeaturesSection;
