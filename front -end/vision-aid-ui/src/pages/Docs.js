import React from 'react';
import { motion } from 'framer-motion';
import { FaBook, FaKeyboard, FaRobot, FaCode, FaPaintBrush, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const Docs = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 bg-gray-50 dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full font-bold text-sm tracking-wide uppercase mb-6"
                    >
                        <FaBook /> User Documentation
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black mb-6 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        How to Use Vision Aid
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
                    >
                        Guides, keyboard shortcuts, and detailed explanations of our AI-powered visual accessibility tools.
                    </motion.p>
                </div>

                <div className="space-y-12">
                    {/* Section 1: Keyboard Shortcuts */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center rounded-2xl text-2xl">
                                <FaKeyboard />
                            </div>
                            <h2 className="text-2xl font-bold">Keyboard Shortcuts</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Navigate Vision Aid quickly without a mouse.</p>

                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { key: 'Ctrl + K', action: 'Open Command Palette' },
                                { key: 'Esc', action: 'Close any modal or dropdown' },
                                { key: 'Space', action: 'Pause/Resume Camera (when active)' },
                                { key: 'Shift + M', action: 'Toggle Dark/Light Mode' },
                                { key: 'Shift + S', action: 'Open Settings' },
                                { key: 'Enter', action: 'Submit forms / Select highlighted option' },
                            ].map((shortcut, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <span className="text-gray-600 dark:text-gray-300">{shortcut.action}</span>
                                    <kbd className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono shadow-sm font-bold text-gray-800 dark:text-gray-200">
                                        {shortcut.key}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2: AI & Camera Tools */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-2xl text-2xl">
                                <FaRobot />
                            </div>
                            <h2 className="text-2xl font-bold">AI Camera Tools</h2>
                        </div>
                        <div className="space-y-6">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 text-emerald-500"><FaCheckCircle /></div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Color Detector</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Point your camera at any object. The AI will instantly read out the closest CSS color name, Hex code, and determine WCAG contrast safety. You can switch to "Match Mode" to see if two colors (like a shirt and pants) go well together.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 text-emerald-500"><FaCheckCircle /></div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Traffic Signal AI</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Our custom YOLOv8 model detects traffic lights in real-time. It differentiates between Red, Green, and Yellow lights, and even detects directional arrows. Please note this model runs on our cloud servers and requires an internet connection.</p>
                                </div>
                            </div>
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl flex gap-3 text-yellow-800 dark:text-yellow-200 text-sm mt-4">
                                <FaExclamationTriangle className="flex-shrink-0 mt-0.5" />
                                <p><strong>Privacy Note:</strong> Your camera feed is processed directly in your browser. Video feeds are never recorded or sent to any remote server, except for single-frame inference in the Traffic Signal tool (which are discarded immediately).</p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Design & Accessibility Tools */}
                    <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-xl dark:shadow-none">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center rounded-2xl text-2xl">
                                <FaPaintBrush />
                            </div>
                            <h2 className="text-2xl font-bold">Design Accessibility Tools</h2>
                        </div>
                        <div className="space-y-6 text-gray-600 dark:text-gray-400">
                            <p>For designers and developers, Vision Aid provides mathematical contrast checking and palette generation.</p>

                            <ul className="list-disc pl-5 space-y-3">
                                <li><strong>Palette Checker:</strong> Paste multiple Hex codes. We simulate how they look under Protanopia, Deuteranopia, and Tritanopia, and flag any pairs that lose contrast when converted to grayscale.</li>
                                <li><strong>Image Palette Extractor:</strong> Upload any image. We use a k-means clustering algorithm to extract the dominant colors and automatically rate their accessibility.</li>
                                <li><strong>Vision Test:</strong> A multi-stage screening tool (including simulated Ishihara plates, hue arrangement, and contrast sensitivity) to help identify potential color vision deficiencies.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Docs;
