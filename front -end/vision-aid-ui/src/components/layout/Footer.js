import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        Product: [
            { label: 'Features', to: '/' },
            { label: 'Live Detector', to: '/live-detector' },
            { label: 'Palette Checker', to: '/palette-checker' },
            { label: 'Color Blindness', to: '/simulator' },
        ],
        Resources: [
            { label: 'Documentation', to: '/docs' },
            { label: 'API Reference', to: '/api' },
            { label: 'Blog', to: '/blog' },
            { label: 'Community', to: '/community' },
        ],
        Company: [
            { label: 'About Us', to: '/about' },
            { label: 'Careers', to: '/careers' },
            { label: 'Contact', to: '/contact' },
            { label: 'Press Kit', to: '/press' },
        ],
        Legal: [
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
            { label: 'Cookie Policy', to: '/cookies' },
            { label: 'License', to: '/license' },
        ],
    };

    const socialLinks = [
        { icon: FaTwitter, href: '#', label: 'Twitter' },
        { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
        { icon: FaGithub, href: '#', label: 'GitHub' },
        { icon: FaFacebook, href: '#', label: 'Facebook' },
    ];

    return (
        <footer className="bg-gray-50 dark:bg-[#0a0f1c] border-t border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                    {/* Brand Section */}
                    <motion.div
                        className="lg:col-span-1"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link to="/" className="flex items-center gap-3 mb-6 group">
                            <div className="relative w-8 h-8">
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-lg shadow-lg shadow-blue-500/20"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        <circle cx="12" cy="12" r="1.5" className="text-blue-100" fill="currentColor" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
                                VisionAid
                            </span>
                        </Link>
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
                            Professional color accessibility tools for everyone. Making the digital world more inclusive.
                        </p>
                        <div className="flex gap-4">
                            {socialLinks.map((social, idx) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={idx}
                                        href={social.href}
                                        className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        title={social.label}
                                        aria-label={social.label}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Footer Links */}
                    {Object.entries(footerLinks).map((category, idx) => (
                        <motion.div
                            key={category[0]}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                        >
                            <h3 className="text-gray-900 dark:text-white font-bold mb-4">{category[0]}</h3>
                            <ul className="space-y-3">
                                {category[1].map((link) => (
                                    <li key={link.label}>
                                        {link.to ? (
                                            <Link
                                                to={link.to}
                                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={link.href}
                                                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 text-sm font-medium"
                                            >
                                                {link.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 dark:border-white/5 my-8"></div>

                {/* Bottom Section */}
                <motion.div
                    className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="flex items-center gap-2">
                        <span>© {currentYear} VisionAid. Made with</span>
                        <FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
                        <span>for accessibility.</span>
                    </div>
                    <div className="flex gap-8">
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium">Status</button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium">Contact</button>
                        <button className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer font-medium">Support</button>
                    </div>
                </motion.div>

            </div>
        </footer>
    );
};

export default Footer;
