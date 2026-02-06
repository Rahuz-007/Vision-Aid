import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaVolumeUp, FaAdjust, FaFont, FaPalette, FaTags, FaVolumeDown, FaMobileAlt, FaMoon } from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { useTheme } from '../../context/ThemeContext';

const SettingsModal = ({ isOpen, onClose }) => {
    const { settings, updateSetting } = useSettings();
    const { isDarkMode, toggleTheme } = useTheme();

    if (!isOpen) return null;

    const sections = [
        {
            title: 'ACCESSIBILITY',
            items: [
                {
                    icon: <FaVolumeUp className="text-gray-400" />,
                    label: 'Voice Announcements',
                    desc: 'Spoken feedback for actions & results',
                    type: 'toggle',
                    value: settings.voiceEnabled,
                    onChange: (val) => updateSetting('voiceEnabled', val)
                },
                {
                    icon: <FaAdjust className="text-gray-400" />,
                    label: 'High Contrast',
                    desc: 'Increase visibility and interface contrast',
                    type: 'toggle',
                    value: settings.highContrast,
                    onChange: (val) => updateSetting('highContrast', val)
                },
                {
                    icon: <FaFont className="text-gray-400" />,
                    label: 'Large Text',
                    desc: 'Increase font size for better readability',
                    type: 'toggle',
                    value: settings.largeText,
                    onChange: (val) => updateSetting('largeText', val)
                }
            ]
        },
        {
            title: 'APPEARANCE',
            items: [
                {
                    icon: <FaMoon className="text-purple-400" />,
                    label: 'Dark Mode',
                    desc: 'Switch between dark and light themes',
                    type: 'toggle',
                    value: isDarkMode,
                    onChange: toggleTheme
                },
                {
                    icon: <FaPalette className="text-pink-400" />,
                    label: 'Color Format',
                    desc: '', // Dropdown takes full row usually
                    type: 'dropdown',
                    value: settings.colorFormat,
                    options: [
                        { label: 'HEX (#FF5733)', value: 'hex' },
                        { label: 'RGB (255, 87, 51)', value: 'rgb' },
                        { label: 'HSL (14, 100%, 60%)', value: 'hsl' }
                    ],
                    onChange: (val) => updateSetting('colorFormat', val)
                },
                {
                    icon: <FaTags className="text-gray-400" />,
                    label: 'Show Color Names',
                    desc: 'Display descriptive color names',
                    type: 'toggle',
                    value: settings.showColorNames,
                    onChange: (val) => updateSetting('showColorNames', val)
                }
            ]
        },
        {
            title: 'EXPERIENCE',
            items: [
                {
                    icon: <FaVolumeDown className="text-gray-400" />,
                    label: 'Sound Effects',
                    desc: 'Play subtle sounds on interaction',
                    type: 'toggle',
                    value: settings.soundEffects,
                    onChange: (val) => updateSetting('soundEffects', val)
                },
                {
                    icon: <FaMobileAlt className="text-gray-400" />,
                    label: 'Haptic Feedback',
                    desc: 'Vibrate on success or error',
                    type: 'toggle',
                    value: settings.hapticFeedback,
                    onChange: (val) => updateSetting('hapticFeedback', val)
                }
            ]
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#0a0f1c] text-white rounded-3xl shadow-2xl overflow-hidden border border-white/10"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">Settings</h2>
                            <p className="text-gray-400 text-sm mt-1">Personalize your experience</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <div className="space-y-8">
                            {sections.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
                                        {section.title}
                                    </h3>
                                    <div className="bg-[#111] rounded-2xl overflow-hidden border border-white/5 space-y-1">
                                        {section.items.map((item, itemIdx) => (
                                            <div
                                                key={itemIdx}
                                                className={`p-4 ${itemIdx !== section.items.length - 1 ? 'border-b border-white/5' : ''}`}
                                            >
                                                {item.type === 'dropdown' ? (
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 bg-white/5 rounded-full">{item.icon}</div>
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-sm">{item.label}</p>
                                                            <select
                                                                value={item.value}
                                                                onChange={(e) => item.onChange(e.target.value)}
                                                                className="mt-2 w-full bg-[#0a0f1c] border border-white/20 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                            >
                                                                {item.options.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-between gap-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2 bg-white/5 rounded-full">{item.icon}</div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{item.label}</p>
                                                                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                                                            </div>
                                                        </div>

                                                        {/* Toggle Switch */}
                                                        <button
                                                            onClick={() => item.onChange(!item.value)}
                                                            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-[#0a0f1c] ${item.value ? 'bg-blue-500' : 'bg-gray-700'
                                                                }`}
                                                        >
                                                            <span
                                                                className={`absolute left-0.5 top-0.5 inline-block w-5 h-5 bg-white rounded-full shadow transform ring-0 transition-transform duration-200 ease-in-out ${item.value ? 'translate-x-6' : 'translate-x-0'
                                                                    }`}
                                                            />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SettingsModal;
