import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTools, FaRocket, FaBook, FaGlobe, FaUniversalAccess, FaHandHoldingHeart, FaGithub } from 'react-icons/fa';

const About = () => {
    const features = [
        {
            icon: FaCheckCircle,
            title: 'Accessibility First',
            description: 'Built with WCAG guidelines and accessibility standards in mind from day one.'
        },
        {
            icon: FaTools,
            title: 'Powerful Tools',
            description: 'Professional-grade color detection and accessibility analysis tools.'
        },
        {
            icon: FaRocket,
            title: 'AI Powered',
            description: 'Advanced AI algorithms for accurate color detection and classification.'
        },
        {
            icon: FaBook,
            title: 'Well Documented',
            description: 'Comprehensive documentation and guides for all features and tools.'
        },
    ];

    const team = [
        { name: 'John Developer', role: 'Lead Developer', avatar: '👨‍💻' },
        { name: 'Jane Designer', role: 'UI/UX Designer', avatar: '👩‍🎨' },
        { name: 'Mike Researcher', role: 'Accessibility Expert', avatar: '🧑‍🔬' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Hero Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <motion.div
                    className="max-w-4xl mx-auto text-center relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">About VisionAid</h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Making the digital world more accessible for everyone through innovative color detection and accessibility tools.
                    </p>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose VisionAid?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-gray-800 rounded-xl p-8 border border-gray-700 hover:border-blue-500/50 transition-colors"
                                >
                                    <Icon className="w-12 h-12 text-blue-400 mb-4" />
                                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-y border-gray-700">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
                        <p className="text-xl text-gray-400 leading-relaxed">
                            We believe that everyone deserves access to tools that help them interact with the digital world. VisionAid is dedicated to breaking down color-related barriers and making technology more inclusive for people with color blindness and other visual impairments.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Standards Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-white mb-6">Global Standards</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We strictly adhere to international accessibility guidelines to ensure a seamless inclusive experience.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: FaGlobe,
                                title: "WCAG 2.1 AAA",
                                desc: "Meeting the highest level of web content accessibility guidelines for maximum inclusivity."
                            },
                            {
                                icon: FaUniversalAccess,
                                title: "Section 508",
                                desc: "Compliant with US federal law mandates for electronic and information technology accessibility."
                            },
                            {
                                icon: FaHandHoldingHeart,
                                title: "Inclusive Design",
                                desc: "Designed from the ground up to be usable by as many people as possible, regardless of ability."
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:bg-gray-800 transition-all text-center group"
                            >
                                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Open Source CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto text-center relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#0f172a] to-black border border-gray-800 p-12 shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <FaGithub className="w-16 h-16 text-white mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Open Source & Community Driven</h2>
                        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
                            VisionAid is an open initiative. Inspect our code, contribute new features, or suggest improvements to help us grow.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-5 justify-center">
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-xl hover:bg-gray-200 transition-all font-bold shadow-lg shadow-white/5">
                                <FaGithub className="text-xl" /> Star on GitHub
                            </a>
                            <a href="/contact" className="flex items-center justify-center gap-3 px-8 py-4 bg-transparent border border-gray-600 text-white rounded-xl hover:bg-white/5 hover:border-white transition-all font-bold">
                                Join Discussion
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
