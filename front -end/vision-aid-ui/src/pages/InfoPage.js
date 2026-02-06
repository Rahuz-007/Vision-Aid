import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBook, FaCode, FaNewspaper, FaUsers, FaBriefcase, FaEnvelope, FaFileAlt, FaShieldAlt, FaGavel, FaCookieBite, FaBalanceScale } from 'react-icons/fa';

const InfoPage = ({ title, category, type = 'generic' }) => {
    // Icon mapping based on title
    const getIcon = () => {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('documentation')) return FaBook;
        if (titleLower.includes('api')) return FaCode;
        if (titleLower.includes('blog')) return FaNewspaper;
        if (titleLower.includes('community')) return FaUsers;
        if (titleLower.includes('career')) return FaBriefcase;
        if (titleLower.includes('contact')) return FaEnvelope;
        if (titleLower.includes('press')) return FaFileAlt;
        if (titleLower.includes('privacy')) return FaShieldAlt;
        if (titleLower.includes('terms')) return FaGavel;
        if (titleLower.includes('cookie')) return FaCookieBite;
        if (titleLower.includes('license')) return FaBalanceScale;
        return FaBook;
    };

    const Icon = getIcon();

    const sections = {
        generic: [
            {
                heading: "Overview",
                content: `Welcome to the ${title} page. VisionAid is dedicated to making the digital world accessible for everyone. This section provides detailed information about ${title.toLowerCase()} and how it relates to our mission of color accessibility.`
            },
            {
                heading: "Key Information",
                content: "We are constantly updating our resources to provide the best possible experience. Whether you are a developer, a user, or a partner, you'll find relevant details here tailored to your needs."
            },
            {
                heading: "Get Involved",
                content: "Your feedback is invaluable to us. If you have questions or suggestions, please reach out to our team or join our community discussions."
            }
        ],
        privacy: [
            {
                heading: "No Image Storage",
                content: "Your privacy is paramount. Use of the camera for Color Detection and Traffic Signal Detection is performed entirely locally on your device in real-time. We do NOT store, upload, or transmit any images or video feeds to our servers."
            },
            {
                heading: "Local Processing",
                content: "All AI analysis happens directly in your browser. This ensures zero latency and maximum privacy. No personal data leaves your device during the detection process."
            },
            {
                heading: "Data Collection",
                content: "We only collect minimal, anonymous usage data (like page views) to improve the app. We do not collect personally identifiable information unless you explicitly provide it (e.g., creating an account)."
            }
        ],
        legal: [
            {
                heading: "Effective Date: June 2024",
                content: "Please read this document carefully. By accessing or using our VisionAid services, you agree to be bound by these terms. We prioritize your privacy and data security above all else."
            },
            {
                heading: "Data Protection",
                content: "We implement robust security measures to protect your personal information. Our systems are designed with privacy-by-design principles to ensure compliance with global data protection regulations."
            }
        ]
    };

    let content;
    if (title.toLowerCase().includes('privacy')) {
        content = sections.privacy;
    } else if (type === 'legal') {
        content = sections.legal;
    } else {
        content = sections.generic;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1c] pt-24 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-[#111] rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/5"
                >
                    {/* Header Banner */}
                    <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="relative z-10 flex flex-col items-center text-white">
                            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-3 shadow-lg">
                                <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h1>
                            <span className="text-blue-100 font-medium mt-2 uppercase tracking-widest text-xs bg-white/10 px-3 py-1 rounded-full">{category}</span>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8 md:p-12">
                        {content.map((section, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                                className="mb-10 last:mb-0"
                            >
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-blue-500 pl-4">
                                    {section.heading}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                                    {section.content}
                                </p>
                            </motion.div>
                        ))}

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/10 flex justify-between items-center text-sm text-gray-500">
                            <span>Last updated: June 15, 2024</span>
                            <Link to="/" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                                ← Back to Home
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default InfoPage;
