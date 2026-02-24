import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaBook, FaCode, FaNewspaper, FaUsers, FaBriefcase, FaEnvelope, FaFileAlt, FaShieldAlt, FaGavel, FaCookieBite, FaBalanceScale } from 'react-icons/fa';

const InfoPage = ({ title = '', category, type = 'generic' }) => {
    // Icon mapping based on title
    const getIcon = () => {
        const titleLower = (title || '').toLowerCase();
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
                content: `Welcome to the ${title} page. VisionAid is dedicated to making the digital world accessible for everyone. This section provides detailed information about ${(title || '').toLowerCase()} and how it relates to our mission of color accessibility.`
            },
            {
                heading: "Key Information",
                content: "We are constantly updating our resources to providing the best possible experience. Whether you are a developer, a user, or a partner, you'll find relevant details here tailored to your needs."
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
            }
        ],
        legal: [
            {
                heading: "Effective Date: June 2024",
                content: "Please read this document carefully. By accessing or using our VisionAid services, you agree to be bound by these terms. We prioritize your privacy and data security above all else."
            },
            {
                heading: "Data Protection",
                content: "We implement robust security measures to protect your personal information. Our systems are designed with privacy-by-design principles."
            }
        ],
        // NEW SECTIONS
        careers: [
            {
                heading: "Join Our Mission",
                content: "At VisionAid, we are passionate about creating a more accessible world. We're looking for talented developers, designers, and accessibility experts to join our growing team to solve real-world problems."
            },
            {
                heading: "Open Positions",
                content: "We are currently hiring for Frontend Developers (React), AI Engineers (Python/YOLO), and UI/UX Designers. If you are passionate about accessibility tech, we want to hear from you."
            },
            {
                heading: "Culture & Benefits",
                content: "We value innovation, empathy, and collaboration. Our team enjoys flexible working hours, remote-first options, and a dedicated budget for learning and development."
            }
        ],
        contact: [
            {
                heading: "Get in Touch",
                content: "Have a question or feedback? We'd love to hear from you. Whether you're a user needing support or a developer wanting to contribute, we're here to help."
            },
            {
                heading: "Support Channels",
                content: "Email us at visionaid07@gmail.com for technical assistance. For partnership inquiries, please contact visionaid07@gmail.com. We typically respond within 24 hours."
            },
            {
                heading: "Community",
                content: "Join our public Discord server to chat with other users, share your experiences, and get real-time updates from the development team."
            }
        ],
        cookies: [
            {
                heading: "What Are Cookies?",
                content: "Cookies are small text files stored on your device when you visit our website. We use them strictly for essential functionality, such as remembering your login state, theme preferences (Dark/Light mode), and simulation settings."
            },
            {
                heading: "Zero-Tracking Policy",
                content: "We respect your privacy. VisionAid does NOT use third-party tracking cookies or advertising pixels. We do not sell your browsing history to data brokers."
            },
            {
                heading: "Managing Preferences",
                content: "You have full control. You can block or delete cookies at any time through your browser settings, though this may reset your saved preferences like color blindness modes."
            }
        ],
        terms: [
            {
                heading: "User Agreement",
                content: "By accessing VisionAid, you agree to use our tools responsibly. Our services are provided 'as-is' to assist users with color vision deficiencies. You agree not to misuse the platform or attempt to reverse-engineer our proprietary AI models."
            },
            {
                heading: "Medical Disclaimer",
                content: "VisionAid is an assistive technology tool, NOT a medical device. It should not be used as a substitute for professional medical advice, diagnosis, or treatment. Do not rely solely on this app for critical safety decisions."
            },
            {
                heading: "Termination",
                content: "We reserve the right to suspend accounts that violate our community guidelines or attempt to exploit our infrastructure."
            }
        ],
        license: [
            {
                heading: "Open Source (MIT)",
                content: "VisionAid is proud to be open-source software licensed under the MIT License. We believe in transparency and community collaboration to build better accessibility tools."
            },
            {
                heading: "Your Rights",
                content: "You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, provided that you include the original copyright notice."
            },
            {
                heading: "No Warranty",
                content: "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND. The authors or copyright holders shall not be liable for any claim or damages arising from the use of this software."
            }
        ],
        press: [
            {
                heading: "About VisionAid",
                content: "VisionAid is a cutting-edge accessibility tool designed to help individuals with color vision deficiencies navigate the world with confidence using AI-powered color detection."
            },
            {
                heading: "Media Assets",
                content: "Access high-resolution logos, product screenshots, and b-roll footage for your articles and videos. All assets are available for download in our Media Pack (Link coming soon)."
            },
            {
                heading: "Press Inquiries",
                content: "For interviews, press releases, or official statements, please contact our media relations team at visionaid07@gmail.com."
            }
        ]
    };

    let content;
    const t = (title || '').toLowerCase();

    if (t.includes('privacy')) content = sections.privacy;
    else if (t.includes('career')) content = sections.careers;
    else if (t.includes('contact')) content = sections.contact;
    else if (t.includes('press')) content = sections.press;
    else if (t.includes('terms') || t.includes('service')) content = sections.terms;
    else if (t.includes('cookie')) content = sections.cookies;
    else if (t.includes('license')) content = sections.license;
    else if (type === 'legal') content = sections.legal;
    else content = sections.generic;

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
