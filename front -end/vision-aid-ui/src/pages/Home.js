import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCamera, FaPalette, FaEye, FaTrafficLight, FaCheckCircle, FaShieldAlt, FaChartLine, FaBolt, FaMagic, FaMobileAlt, FaCode, FaHeart } from 'react-icons/fa';

const Home = () => {
    const features = [
        {
            name: 'Live Color Detector',
            description: 'Instantly identify colors from your camera feed with high-accuracy AI analysis and voice feedback.',
            icon: FaCamera,
            to: '/color-picker',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            name: 'Palette Checker',
            description: 'Analyze color combinations for WCAG 2.1 contrast compliance to ensure accessible designs.',
            icon: FaPalette,
            to: '/palette-checker',
            color: 'purple',
            gradient: 'from-purple-500 to-indigo-500'
        },
        {
            name: 'Color Blindness Simulator',
            description: 'Visualize how your images appear to users with Protanopia, Deuteranopia, and other deficiencies.',
            icon: FaEye,
            to: '/simulator',
            color: 'green',
            gradient: 'from-emerald-500 to-teal-500'
        },
        {
            name: 'Traffic Signal Detection',
            description: 'Real-time detection of traffic lights using computer vision to assist with safe navigation.',
            icon: FaTrafficLight,
            to: '/traffic-signal',
            color: 'red',
            gradient: 'from-red-500 to-orange-500'
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

    return (
        <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-purple-500/30">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] opacity-30"></div>
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
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">
                            Color Accessibility
                        </span>
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
                        <Link to="/color-picker" className="group relative px-8 py-4 text-lg font-bold text-white rounded-full overflow-hidden transition-all duration-300 shadow-xl shadow-purple-600/30 hover:shadow-2xl hover:shadow-purple-600/50 hover:scale-105 active:scale-95">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300"></div>
                            <div className="relative flex items-center gap-2">
                                Get Started Now <FaBolt className="text-yellow-300" />
                            </div>
                        </Link>
                        {/* <button className="px-8 py-4 text-lg font-bold text-gray-700 dark:text-white rounded-full border border-gray-200 dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
                            View Demo
                        </button> */}
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
                                <motion.div key={idx} variants={itemVariants}>
                                    <Link to={feature.to} className="block h-full group">
                                        <div className="h-full rounded-[2.5rem] p-10 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 relative overflow-hidden">

                                            {/* Feature Icon */}
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                                <IconComponent className="w-8 h-8" />
                                            </div>

                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                {feature.name}
                                            </h3>

                                            <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                                                {feature.description}
                                            </p>

                                            <div className="flex items-center text-purple-600 dark:text-purple-400 font-bold group-hover:translate-x-2 transition-transform duration-300">
                                                Try Now <span className="ml-2">→</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative py-24 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#050505]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-12"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={itemVariants} className="text-center group">
                            <div className="text-7xl sm:text-8xl font-black bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-600 bg-clip-text text-transparent mb-4 tracking-tighter group-hover:scale-105 transition-transform">
                                300M+
                            </div>
                            <p className="text-purple-600 dark:text-purple-400 text-lg font-bold uppercase tracking-widest">People Affected Worldwide</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="text-center group">
                            <div className="text-7xl sm:text-8xl font-black bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-600 bg-clip-text text-transparent mb-4 tracking-tighter group-hover:scale-105 transition-transform">
                                1 in 12
                            </div>
                            <p className="text-blue-600 dark:text-blue-400 text-lg font-bold uppercase tracking-widest">Men Have Color Blindness</p>
                        </motion.div>
                        <motion.div variants={itemVariants} className="text-center group">
                            <div className="text-7xl sm:text-8xl font-black bg-gradient-to-b from-gray-900 to-gray-500 dark:from-white dark:to-gray-600 bg-clip-text text-transparent mb-4 tracking-tighter group-hover:scale-105 transition-transform">
                                0.1s
                            </div>
                            <p className="text-pink-600 dark:text-pink-400 text-lg font-bold uppercase tracking-widest">AI Detection Speed</p>
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
                            <div key={i} className="group relative p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                                    <item.icon />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
