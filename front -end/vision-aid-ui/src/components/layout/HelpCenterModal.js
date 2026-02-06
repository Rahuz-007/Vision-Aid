import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes, FaQuestionCircle, FaVideo, FaPalette, FaEye,
    FaKeyboard, FaBug, FaEnvelope, FaBook, FaLightbulb,
    FaChevronRight, FaSearch
} from 'react-icons/fa';

/**
 * Professional Help Center Modal
 * Comprehensive help and documentation for Vision Aid
 */
const HelpCenterModal = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const helpCategories = [
        {
            id: 'getting-started',
            title: 'Getting Started',
            icon: FaBook,
            color: 'blue',
            articles: [
                {
                    title: 'What is Vision Aid?',
                    content: 'Vision Aid is a comprehensive color accessibility platform designed to help users identify, analyze, and work with colors. Perfect for people with color vision deficiencies and designers building accessible products.'
                },
                {
                    title: 'How to use Color Detector',
                    content: '1. Navigate to Color Detector page\n2. Choose Manual Analysis or Live Detector\n3. For Manual: Use color picker or upload image\n4. For Live: Start camera and point at objects\n5. Listen to voice announcements for color names'
                },
                {
                    title: 'Saving Colors to History',
                    content: 'Colors can be saved to your history for later reference:\n1. Detect or select a color\n2. Click "Save to History" button\n3. Access saved colors from the Saved Colors dropdown in the header\n4. Click any saved color to view details'
                }
            ]
        },
        {
            id: 'features',
            title: 'Features Guide',
            icon: FaPalette,
            color: 'purple',
            articles: [
                {
                    title: 'Color Picker Features',
                    content: 'Manual Analysis:\n• Color picker input\n• Image upload and click-to-pick\n• Random color generator\n• Color harmonies (complementary, analogous, triadic)\n• Shades and tints\n• Color blindness simulations\n\nLive Detector:\n• Real-time camera detection\n• Enhanced accuracy with temporal stabilization\n• Crosshair targeting\n• Auto voice announcements\n• Tap to focus mode'
                },
                {
                    title: 'Traffic Signal Detector',
                    content: 'Helps identify traffic light colors:\n1. Navigate to Traffic Signals page\n2. Click "Activate Camera"\n3. Point camera at traffic light\n4. System detects: Red, Yellow, or Green\n5. Voice announces detected signal\n6. Visual indicator shows current state'
                },
                {
                    title: 'Color Blindness Simulator',
                    content: 'Test how images appear with different types of color vision deficiency:\n1. Go to Color Blindness page\n2. Upload an image\n3. Select deficiency type:\n   • Protanopia (no red)\n   • Deuteranopia (no green)\n   • Tritanopia (no blue)\n   • Achromatopsia (no color)\n4. View simulation and download result'
                }
            ]
        },
        {
            id: 'accessibility',
            title: 'Accessibility Features',
            icon: FaEye,
            color: 'green',
            articles: [
                {
                    title: 'Voice Announcements',
                    content: 'Vision Aid includes voice features:\n• Auto-announce colors in Live Detector\n• Manual announce button in Color Picker\n• Traffic signal voice notifications\n• Enable/disable in Preferences\n• Adjust voice speed and pitch'
                },
                {
                    title: 'Keyboard Shortcuts',
                    content: 'Navigate efficiently with keyboard:\n• Tab: Navigate between elements\n• Enter/Space: Activate buttons\n• Esc: Close modals\n• Arrow Keys: Navigate dropdowns\n\nComing soon: Custom shortcuts!'
                },
                {
                    title: 'Dark Mode',
                    content: 'Vision Aid supports dark mode for reduced eye strain:\n• Toggle in Preferences (Settings icon)\n• Automatically saves preference\n• Applies across all pages\n• Professional glassmorphism design'
                }
            ]
        },
        {
            id: 'troubleshooting',
            title: 'Troubleshooting',
            icon: FaBug,
            color: 'red',
            articles: [
                {
                    title: 'Camera Not Working',
                    content: 'If camera access fails:\n1. Check browser permissions (camera icon in address bar)\n2. Allow camera access for this site\n3. Ensure no other app is using camera\n4. Try refreshing the page\n5. Make sure your device has a camera\n6. Try a different browser (Chrome recommended)'
                },
                {
                    title: 'Inaccurate Color Detection',
                    content: 'For better accuracy:\n1. Ensure good lighting conditions\n2. Hold camera steady for 1-2 seconds\n3. Get closer to the object\n4. Avoid reflective surfaces\n5. Use the crosshair to target specific areas\n6. Try Manual Analysis mode for precise picking'
                },
                {
                    title: 'Voice Not Working',
                    content: 'If voice announcements don\'t work:\n1. Check if voice is enabled in Preferences\n2. Ensure device volume is up\n3. Check browser audio permissions\n4. Try clicking "Announce Name" manually\n5. Some browsers require user interaction first\n6. Test in Chrome or Edge (best support)'
                }
            ]
        },
        {
            id: 'tips',
            title: 'Pro Tips',
            icon: FaLightbulb,
            color: 'yellow',
            articles: [
                {
                    title: 'Best Practices for Color Detection',
                    content: '• Use natural daylight for most accurate results\n• Avoid colored lighting (tungsten, LED)\n• Hold camera perpendicular to surface\n• Use Live Detector for real-world objects\n• Use Manual mode for precise digital color picking\n• Save frequently used colors to history'
                },
                {
                    title: 'Creating Accessible Designs',
                    content: '• Use Palette Checker to verify WCAG compliance\n• Test with Color Blindness Simulator\n• Aim for AAA contrast when possible\n• Don\'t rely on color alone for information\n• Provide text labels and icons\n• Use patterns in addition to colors'
                },
                {
                    title: 'Organizing Your Saved Colors',
                    content: '• Save colors immediately when found\n• Use descriptive names (coming soon!)\n• Review history regularly\n• Clear old/unused colors\n• Export history for backup (coming soon!)\n• Maximum 20 colors stored'
                }
            ]
        },
        {
            id: 'contact',
            title: 'Contact & Support',
            icon: FaEnvelope,
            color: 'indigo',
            articles: [
                {
                    title: 'Get Support',
                    content: 'Need help? Contact us:\n\n📧 Email: support@visionaid.com\n💬 Live Chat: Available 9 AM - 5 PM EST\n🐛 Report Bug: bugs@visionaid.com\n💡 Feature Request: features@visionaid.com\n\nResponse time: Usually within 24 hours'
                },
                {
                    title: 'Community & Resources',
                    content: 'Join our community:\n• Discord Server: discord.gg/visionaid\n• Reddit: r/VisionAid\n• YouTube Tutorials\n• Blog: visionaid.com/blog\n• GitHub: github.com/visionaid\n\nShare your feedback and help us improve!'
                },
                {
                    title: 'Report a Bug',
                    content: 'Found a bug? Help us fix it:\n1. Note what you were doing\n2. Take a screenshot if possible\n3. Email bugs@visionaid.com with:\n   • Browser and version\n   • Operating system\n   • Steps to reproduce\n   • Expected vs actual behavior\n\nThank you for helping improve Vision Aid!'
                }
            ]
        }
    ];

    const filteredCategories = searchQuery
        ? helpCategories.map(category => ({
            ...category,
            articles: category.articles.filter(article =>
                article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                article.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
        })).filter(category => category.articles.length > 0)
        : helpCategories;

    const getColorClasses = (color) => {
        const colors = {
            blue: 'text-blue-500 bg-blue-500/10',
            purple: 'text-purple-500 bg-purple-500/10',
            green: 'text-green-500 bg-green-500/10',
            red: 'text-red-500 bg-red-500/10',
            yellow: 'text-yellow-500 bg-yellow-500/10',
            indigo: 'text-indigo-500 bg-indigo-500/10'
        };
        return colors[color] || colors.blue;
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full max-w-5xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <FaQuestionCircle className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Help Center
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Everything you need to know about Vision Aid
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                aria-label="Close help center"
                            >
                                <FaTimes className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search help articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-400"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        {selectedCategory ? (
                            <div>
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="mb-6 text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
                                >
                                    ← Back to categories
                                </button>
                                <div className="space-y-6">
                                    {selectedCategory.articles.map((article, idx) => (
                                        <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                                {article.content}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredCategories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category)}
                                            className="text-left p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl hover:shadow-lg transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(category.color)}`}>
                                                    <Icon className="text-xl" />
                                                </div>
                                                <FaChevronRight className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                {category.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {category.articles.length} article{category.articles.length !== 1 ? 's' : ''}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {filteredCategories.length === 0 && (
                            <div className="text-center py-12">
                                <FaSearch className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    No articles found for "{searchQuery}"
                                </p>
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            Can't find what you're looking for? <a href="mailto:support@visionaid.com" className="text-blue-600 dark:text-blue-400 hover:underline">Contact Support</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default HelpCenterModal;
