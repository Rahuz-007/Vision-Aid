import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, animate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCamera, FaPalette, FaEye, FaTrafficLight, FaCheckCircle, FaShieldAlt, FaChartLine, FaBolt, FaMagic, FaMobileAlt, FaCode, FaHeart, FaArrowRight, FaStar } from 'react-icons/fa';
import { fadeInUp, hoverLift, staggerContainer, staggerItem } from '../utils/microInteractions';
import toast from 'react-hot-toast';

// Enhanced Counter Component for Stats with Particle Burst
const Counter = ({ value, suffix = '', duration = 2, prefix = '' }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });
    const [hasAnimated, setHasAnimated] = useState(false);

    // Parse the number from string
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
    const textPart = value.replace(/[0-9]/g, '');

    const count = useMotionValue(0);
    const rounded = useTransform(count, latest => Math.round(latest));

    useEffect(() => {
        if (inView && !hasAnimated) {
            const controls = animate(count, numericValue, {
                duration: duration,
                ease: 'easeOut'
            });
            setHasAnimated(true);
            return controls.stop;
        }
    }, [inView, numericValue, duration, count, hasAnimated]);

    return (
        <span ref={ref} className="relative inline-block">
            {/* Particle burst on count */}
            {inView && hasAnimated && (
                <>
                    {[...Array(8)].map((_, i) => (
                        <motion.span
                            key={i}
                            className="absolute text-purple-500 text-2xl font-bold pointer-events-none"
                            style={{
                                left: '50%',
                                top: '50%'
                            }}
                            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                            animate={{
                                scale: [0, 1, 0],
                                x: Math.cos((i / 8) * Math.PI * 2) * 50,
                                y: Math.sin((i / 8) * Math.PI * 2) * 50,
                                opacity: [0, 1, 0]
                            }}
                            transition={{ duration: 1, delay: duration - 0.5 }}
                        >
                            +
                        </motion.span>
                    ))}
                </>
            )}

            {/* Glowing number */}
            <motion.span
                className="relative"
                animate={inView ? {
                    textShadow: [
                        '0 0 20px rgba(139, 92, 246, 0)',
                        '0 0 20px rgba(139, 92, 246, 0.5)',
                        '0 0 20px rgba(139, 92, 246, 0)'
                    ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {prefix}
                <motion.span>{rounded}</motion.span>
                {textPart}
                {suffix}
            </motion.span>
        </span>
    );
};

// 3D Feature Card Component
const Feature3DCard = ({ feature, index }) => {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setRotateX(rotateX);
        setRotateY(rotateY);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const IconComponent = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
            style={{ perspective: 1000 }}
        >
            <Link to={feature.to} className="block h-full">
                <motion.div
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    animate={{
                        rotateX,
                        rotateY,
                        transformPerspective: 1000
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="relative h-full rounded-[2.5rem] p-10 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-colors duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group overflow-hidden"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Spotlight effect */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                            background: `radial-gradient(600px circle at ${rotateY * 10 + 50}% ${rotateX * 10 + 50}%, rgba(168,85,247,0.15), transparent 40%)`
                        }}
                    />

                    {/* Feature Icon with 3D effect */}
                    <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-lg`}
                        style={{ transform: 'translateZ(50px)' }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: 'spring' }}
                    >
                        <IconComponent className="w-8 h-8" />
                    </motion.div>

                    {/* Title */}
                    <h3
                        className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-blue-500 transition-all"
                        style={{ transform: 'translateZ(30px)' }}
                    >
                        {feature.name}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6" style={{ transform: 'translateZ(20px)' }}>
                        {feature.tags.map((tag, i) => (
                            <motion.span
                                key={i}
                                className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5"
                                whileHover={{ scale: 1.05, y: -2 }}
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>

                    {/* Description */}
                    <p
                        className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed"
                        style={{ transform: 'translateZ(10px)' }}
                    >
                        {feature.description}
                    </p>

                    {/* CTA */}
                    <motion.div
                        className="flex items-center text-purple-600 dark:text-purple-400 font-bold"
                        style={{ transform: 'translateZ(40px)' }}
                        whileHover={{ x: 5 }}
                    >
                        Try Now <FaArrowRight className="ml-2" />
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                    />
                </motion.div>
            </Link>
        </motion.div>
    );
};

// Spotlight Card Component
const SpotlightCard = ({ children, className = "", onClick }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
};

const Home = () => {
    const features = [
        {
            name: 'Live Color Detector',
            description: 'Instantly identify colors from your camera feed with high-accuracy AI analysis and voice feedback.',
            icon: FaCamera,
            to: '/color-picker',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500',
            tags: ['AI Vision', 'Voice Feedback', 'Real-time']
        },
        {
            name: 'Palette Checker',
            description: 'Analyze color combinations for WCAG 2.1 contrast compliance to ensure accessible designs.',
            icon: FaPalette,
            to: '/palette-checker',
            color: 'purple',
            gradient: 'from-purple-500 to-indigo-500',
            tags: ['WCAG 2.1', 'Contrast Ratio', 'Design']
        },
        {
            name: 'Color Blindness Simulator',
            description: 'Visualize how your images appear to users with Protanopia, Deuteranopia, and other deficiencies.',
            icon: FaEye,
            to: '/simulator',
            color: 'green',
            gradient: 'from-emerald-500 to-teal-500',
            tags: ['Simulation', 'Filters', 'Education']
        },
        {
            name: 'Traffic Signal Detection',
            description: 'Real-time detection of traffic lights using computer vision to assist with safe navigation.',
            icon: FaTrafficLight,
            to: '/traffic-signal',
            color: 'red',
            gradient: 'from-red-500 to-orange-500',
            tags: ['TensorFlow.js', 'Safety', 'Object Detection']
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' },
        },
    };

    // Parallax effect for hero background
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-purple-500/30">
            {/* Ambient Background Glows - Animated */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div style={{ y: y1 }} className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob"></motion.div>
                <motion.div style={{ y: y2 }} className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob animation-delay-2000"></motion.div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] opacity-30"></div>

                {/* Floating Particles */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-purple-400/30 dark:bg-purple-400/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, Math.random() * 20 - 10, 0],
                            opacity: [0.2, 0.5, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
                <motion.div
                    className="relative z-10 max-w-5xl mx-auto text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-8 flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-900/5 dark:bg-white/10 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 backdrop-blur-md">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            AI-Powered Accessibility Platform
                        </div>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1]"
                    >
                        Professional
                        <br />
                        <motion.span
                            className="relative inline-block"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            {/* Animated gradient background glow */}
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 blur-2xl opacity-50"
                                animate={{
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                }}
                                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                                style={{ backgroundSize: '200% auto' }}
                            />

                            {/* Text with gradient */}
                            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x bg-[length:200%_auto]">
                                Color Accessibility
                            </span>

                            {/* Sparkle effects */}
                            {[...Array(5)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute text-yellow-400 text-2xl pointer-events-none"
                                    style={{
                                        left: `${20 + i * 20}%`,
                                        top: `${-10 + (i % 2) * 20}%`
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0, 1, 0],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.4
                                    }}
                                >
                                    ✨
                                </motion.span>
                            ))}
                        </motion.span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                    >
                        Detect colors in real-time, check color contrast compliance, and identify traffic signals with <span className="text-gray-900 dark:text-white font-bold">confidence</span>.
                    </motion.p>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
                    >
                        <Link to="/color-picker" className="group relative inline-block">
                            <motion.div
                                className="relative px-8 py-4 text-lg font-bold text-white rounded-full overflow-hidden"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {/* Animated gradient background */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500"
                                    animate={{
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    style={{ backgroundSize: '200% auto' }}
                                />

                                {/* Shimmer effect */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                />

                                {/* Glow effect */}
                                <motion.div
                                    className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity"
                                />

                                {/* Button content */}
                                <span className="relative z-10 flex items-center gap-2">
                                    Get Started Now
                                    <motion.span
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    >
                                        <FaBolt className="text-yellow-300" />
                                    </motion.span>
                                </span>

                                {/* Ripple on click */}
                                <motion.div
                                    className="absolute inset-0 bg-white/20 rounded-full"
                                    initial={{ scale: 0, opacity: 1 }}
                                    whileTap={{ scale: 2, opacity: 0 }}
                                    transition={{ duration: 0.6 }}
                                />
                            </motion.div>

                            {/* Ring effect */}
                            <motion.div
                                className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 0, 0.5]
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-sm font-semibold text-gray-600 dark:text-gray-400">
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5">
                            <div className="p-2 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                                <FaCheckCircle size={20} />
                            </div>
                            <span className="text-gray-900 dark:text-gray-200">WCAG AAA Compliant</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5">
                            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
                                <FaMagic size={20} />
                            </div>
                            <span className="text-gray-900 dark:text-gray-200">Real-time Detection</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-gray-100 dark:border-white/5">
                            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                                <FaShieldAlt size={20} />
                            </div>
                            <span className="text-gray-900 dark:text-gray-200">Privacy First</span>
                        </div>
                    </motion.div>
                </motion.div>

            </section>

            {/* NEW: How It Works Section */}
            <section className="relative py-20 bg-white dark:bg-[#080c14] border-t border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Simple steps to make your world more accessible.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative px-4">
                        <div className="hidden md:block absolute top-12 left-[16%] right-[16%] overflow-hidden">
                            <motion.div
                                initial={{ width: "0%" }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                className="h-0.5 bg-gradient-to-r from-blue-100 via-purple-300 to-pink-100 dark:from-white/5 dark:via-purple-500/50 dark:to-white/5"
                            ></motion.div>
                        </div>

                        {[
                            {
                                step: "01",
                                title: "Launch App",
                                desc: "Open VisionAid in your browser. No downloads required.",
                                icon: FaMobileAlt,
                                color: "text-blue-600",
                                bg: "bg-blue-50 dark:bg-blue-900/20"
                            },
                            {
                                step: "02",
                                title: "Point Camera",
                                desc: "Aim your device at any object, color, or text.",
                                icon: FaCamera,
                                color: "text-purple-600",
                                bg: "bg-purple-50 dark:bg-purple-900/20"
                            },
                            {
                                step: "03",
                                title: "Instant Feedback",
                                desc: "Receive immediate voice narration and visual cues.",
                                icon: FaCheckCircle,
                                color: "text-pink-600",
                                bg: "bg-pink-50 dark:bg-pink-900/20"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="relative z-10 flex flex-col items-center text-center group"
                            >
                                <div className={`w-24 h-24 rounded-3xl ${item.bg} ${item.color} flex items-center justify-center text-3xl mb-6 shadow-lg shadow-gray-200/50 dark:shadow-none group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 p-3 text-xs font-black opacity-30">{item.step}</div>
                                    <item.icon />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm max-w-xs">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
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
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, idx) => {
                            const IconComponent = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={hoverLift}
                                    className="h-full"
                                >
                                    <Link to={feature.to} className="block h-full">
                                        <SpotlightCard className="h-full rounded-[2.5rem] p-10 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-colors duration-300 shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 group">
                                            {/* Feature Icon */}
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

            {/* Stats Section */}
            <section className="relative py-24 border-t border-gray-200 dark:border-white/10 bg-gradient-to-b from-white to-gray-50 dark:from-[#0a0a0a] dark:to-[#050505]">
                {/* Background decoration */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Section Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                            By the Numbers
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Understanding the global impact of color vision deficiency
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {/* Stat 1: People Affected */}
                        <motion.div
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="relative p-10 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="text-7xl sm:text-8xl font-black text-purple-600 dark:text-white mb-6 tracking-tighter group-hover:scale-105 transition-transform flex justify-center" style={{ textShadow: '0 0 40px rgba(168, 85, 247, 0.6)' }}>
                                        300M+
                                    </div>
                                    <p className="text-purple-600 dark:text-purple-400 text-xl font-bold uppercase tracking-wider">
                                        People Affected Worldwide
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Stat 2: Men Ratio */}
                        <motion.div
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="relative p-10 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="text-7xl sm:text-8xl font-black text-blue-600 dark:text-white mb-6 tracking-tighter group-hover:scale-105 transition-transform flex justify-center items-baseline gap-4" style={{ textShadow: '0 0 40px rgba(59, 130, 246, 0.6)' }}>
                                        1 in 12
                                    </div>
                                    <p className="text-blue-600 dark:text-blue-400 text-xl font-bold uppercase tracking-wider">
                                        Men Have Color Blindness
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                        {/* Stat 3: Color Blindness Supported */}
                        <motion.div
                            variants={itemVariants}
                            className="relative group"
                        >
                            <div className="relative p-10 rounded-3xl bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                                {/* Gradient background on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="relative z-10">
                                    <div className="text-7xl sm:text-8xl font-black text-pink-600 dark:text-white mb-6 tracking-tighter group-hover:scale-105 transition-transform flex justify-center" style={{ textShadow: '0 0 40px rgba(236, 72, 153, 0.6)' }}>
                                        9 Types
                                    </div>
                                    <p className="text-pink-600 dark:text-pink-400 text-xl font-bold uppercase tracking-wider">
                                        Color Blindness Supported
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Real Impact Section */}
            <section className="py-24 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Empowering Everyone</h2>
                        <p className="text-gray-500">Bridging the gap between perception and reality</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "For Designers",
                                icon: FaPalette,
                                desc: "Visualize your work through different eyes. Ensure your designs are accessible to everyone before deployment.",
                                color: "text-purple-500",
                                bg: "bg-purple-500/10"
                            },
                            {
                                title: "For Developers",
                                icon: FaCode, // Note: You might need to import FaCode if not already imported
                                desc: "Integrate accessibility checks into your workflow. Build compliant applications with confidence.",
                                color: "text-blue-500",
                                bg: "bg-blue-500/10"
                            },
                            {
                                title: "For Daily Users",
                                icon: FaHeart,
                                desc: "Navigate the world independently. Identify colors, traffic signals, and more with real-time AI assistance.",
                                color: "text-pink-500",
                                bg: "bg-pink-500/10"
                            }
                        ].map((item, i) => (
                            <SpotlightCard key={i} className="group relative p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                            </SpotlightCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Loved by Users Worldwide
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            See what people are saying about Vision Aid
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "UX Designer",
                                avatar: "SC",
                                rating: 5,
                                text: "Vision Aid has transformed how I approach accessibility in my designs. The color blindness simulator is invaluable for ensuring my work is inclusive.",
                                color: "from-purple-500 to-pink-500"
                            },
                            {
                                name: "Michael Rodriguez",
                                role: "Web Developer",
                                avatar: "MR",
                                rating: 5,
                                text: "The palette checker saved me hours of manual WCAG testing. It's now an essential part of my development workflow. Highly recommended!",
                                color: "from-blue-500 to-cyan-500"
                            },
                            {
                                name: "Emma Thompson",
                                role: "Product Manager",
                                avatar: "ET",
                                rating: 5,
                                text: "Finally, a tool that makes color accessibility simple and intuitive. Our entire team uses it daily to ensure our products are accessible to everyone.",
                                color: "from-green-500 to-emerald-500"
                            }
                        ].map((testimonial, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group"
                            >
                                <div className="relative p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                                    {/* Quote icon */}
                                    <div className="absolute top-6 right-6 text-6xl text-gray-200 dark:text-gray-800 opacity-50">"</div>

                                    {/* Stars */}
                                    <div className="flex gap-1 mb-4 relative z-10">
                                        {[...Array(testimonial.rating)].map((_, j) => (
                                            <motion.div
                                                key={j}
                                                initial={{ opacity: 0, scale: 0 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 + j * 0.05 }}
                                            >
                                                <FaStar className="text-yellow-400 text-sm" />
                                            </motion.div>
                                        ))}
                                    </div>

                                    {/* Testimonial text */}
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 flex-grow relative z-10">
                                        {testimonial.text}
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {testimonial.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Hover glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
