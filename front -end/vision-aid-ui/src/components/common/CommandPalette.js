import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    FaSearch, FaTimes, FaArrowRight,
    FaCamera, FaEye, FaTrafficLight, FaPalette,
    FaImages, FaCheck, FaBrain, FaFont,
    FaCog, FaUser, FaHome, FaBook, FaKeyboard,
} from 'react-icons/fa';

// ── All navigable routes & actions ────────────────────────────────────────
const ALL_COMMANDS = [
    // ── Pages
    { id: 'home', label: 'Home', description: 'Go to homepage', path: '/', icon: FaHome, group: 'Navigation', keywords: 'home main' },
    { id: 'color-picker', label: 'Color Picker', description: 'Live camera color detection with voice', path: '/color-picker', icon: FaCamera, group: 'Tools', keywords: 'camera live detect rgb hex' },
    { id: 'simulator', label: 'Color Blindness Simulator', description: 'Simulate 9 types of color vision deficiency', path: '/simulator', icon: FaEye, group: 'Tools', keywords: 'simulate protanopia deuteranopia tritanopia' },
    { id: 'traffic-signal', label: 'Traffic Signal Detector', description: 'YOLOv8 AI-powered traffic light detection', path: '/traffic-signal', icon: FaTrafficLight, group: 'Tools', keywords: 'yolo traffic light road signal ai' },
    { id: 'palette-checker', label: 'Palette Checker', description: 'WCAG 2.1 contrast compliance checker', path: '/palette-checker', icon: FaPalette, group: 'Tools', keywords: 'wcag contrast palette accessibility' },
    { id: 'checker', label: 'Contrast Checker', description: 'Check text/background contrast ratios', path: '/checker', icon: FaCheck, group: 'Tools', keywords: 'contrast ratio aa aaa text' },
    { id: 'palette-extractor', label: 'Image Palette Extractor', description: 'Extract dominant colors from any image', path: '/palette-extractor', icon: FaImages, group: 'Tools', keywords: 'image upload photo extract dominant' },
    { id: 'palette-generator', label: 'Palette Generator', description: 'Generate accessible color palettes', path: '/palette-generator', icon: FaPalette, group: 'Tools', keywords: 'generate palette accessible brand' },
    { id: 'color-test', label: 'Color Vision Screening', description: 'Test your color vision with Ishihara plates', path: '/color-test', icon: FaBrain, group: 'Tools', keywords: 'ishihara test screening blindness' },
    { id: 'color-psychology', label: 'Color Psychology', description: 'Learn how colors affect human perception', path: '/color-psychology', icon: FaBrain, group: 'Learn', keywords: 'psychology emotion meaning warmth cool' },
    { id: 'text-checker', label: 'Text Accessibility', description: 'Check text readability and contrast', path: '/text-checker', icon: FaFont, group: 'Tools', keywords: 'text font readability accessibility' },
    { id: 'color-history', label: 'Color History', description: 'View your saved color detection history', path: '/color-history', icon: FaBook, group: 'Account', keywords: 'history saved colors log' },
    { id: 'profile', label: 'My Profile', description: 'View and edit your profile settings', path: '/profile', icon: FaUser, group: 'Account', keywords: 'profile account settings user' },
    { id: 'about', label: 'About Vision Aid', description: 'Learn about our mission and team', path: '/about', icon: FaBook, group: 'Navigation', keywords: 'about team mission accessibility' },
];

const GROUP_ORDER = ['Navigation', 'Tools', 'Learn', 'Account'];

// ── Keyboard shortcut display ──────────────────────────────────────────────
function Kbd({ children }) {
    return (
        <kbd className="px-1.5 py-0.5 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400">
            {children}
        </kbd>
    );
}

// ── CommandPalette ─────────────────────────────────────────────────────────
const CommandPalette = memo(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    // Filter commands
    const filtered = query.trim()
        ? ALL_COMMANDS.filter(c =>
            c.label.toLowerCase().includes(query.toLowerCase()) ||
            c.description.toLowerCase().includes(query.toLowerCase()) ||
            c.keywords.toLowerCase().includes(query.toLowerCase())
        )
        : ALL_COMMANDS;

    // Group results
    const grouped = GROUP_ORDER.reduce((acc, group) => {
        const items = filtered.filter(c => c.group === group);
        if (items.length) acc.push({ group, items });
        return acc;
    }, []);

    // Flat list for keyboard navigation
    const flatList = grouped.flatMap(g => g.items);

    // Global Ctrl+K / Cmd+K listener
    useEffect(() => {
        const handleGlobal = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleGlobal);
        return () => window.removeEventListener('keydown', handleGlobal);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
        if (!isOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleSelect = useCallback((cmd) => {
        navigate(cmd.path);
        setIsOpen(false);
    }, [navigate]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, flatList.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (flatList[selectedIndex]) handleSelect(flatList[selectedIndex]);
        }
    };

    // Reset selection when query changes
    useEffect(() => { setSelectedIndex(0); }, [query]);

    return (
        <>
            {/* Trigger button (icon only, used in Header) */}
            <button
                id="cmd-palette-trigger"
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group"
                aria-label="Open command palette (Ctrl+K)"
                title="Command Palette (Ctrl+K)"
            >
                <FaSearch className="w-5 h-5" />
                {/* Tooltip */}
                <span className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Search ⌘K
                </span>
            </button>

            {/* Portal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/60 cmd-palette-backdrop z-[9998]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dialog */}
                        <motion.div
                            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-[9999] px-4"
                            initial={{ opacity: 0, y: -24, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -16, scale: 0.97 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Command Palette"
                        >
                            <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

                                {/* Search input */}
                                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                    <FaSearch className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Search features, tools, pages..."
                                        className="flex-1 bg-transparent text-base text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                                        autoComplete="off"
                                        spellCheck={false}
                                    />
                                    {query && (
                                        <button
                                            onClick={() => setQuery('')}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                            aria-label="Clear"
                                        >
                                            <FaTimes className="w-3 h-3 text-gray-400" />
                                        </button>
                                    )}
                                    <Kbd>ESC</Kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-[440px] overflow-y-auto overscroll-contain">
                                    {grouped.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <FaSearch className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400 font-medium">No results for "{query}"</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">Try a different search term</p>
                                        </div>
                                    ) : (
                                        grouped.map(({ group, items }) => {
                                            const groupStartIndex = flatList.indexOf(items[0]);
                                            return (
                                                <div key={group} className="py-1">
                                                    {/* Group header */}
                                                    <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                                        {group}
                                                    </div>
                                                    {items.map((cmd, idx) => {
                                                        const globalIdx = groupStartIndex + idx;
                                                        const isSelected = globalIdx === selectedIndex;
                                                        return (
                                                            <motion.button
                                                                key={cmd.id}
                                                                onClick={() => handleSelect(cmd)}
                                                                onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                                className={`w-full flex items-center gap-3 px-5 py-3 transition-colors text-left ${isSelected
                                                                    ? 'bg-purple-50 dark:bg-purple-500/10'
                                                                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                                                                    }`}
                                                                whileTap={{ scale: 0.99 }}
                                                            >
                                                                {/* Icon */}
                                                                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${isSelected
                                                                    ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400'
                                                                    : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'
                                                                    }`}>
                                                                    <cmd.icon className="w-4 h-4" />
                                                                </div>

                                                                {/* Text */}
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{cmd.label}</p>
                                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{cmd.description}</p>
                                                                </div>

                                                                {/* Arrow */}
                                                                <FaArrowRight className={`flex-shrink-0 w-3 h-3 transition-all duration-200 ${isSelected
                                                                    ? 'text-purple-500 translate-x-0.5'
                                                                    : 'text-gray-300 dark:text-gray-700'
                                                                    }`} />
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Footer shortcuts */}
                                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
                                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Kbd>↑</Kbd><Kbd>↓</Kbd> Navigate
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Kbd>↵</Kbd> Open
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Kbd>Esc</Kbd> Close
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                        <FaKeyboard className="w-3 h-3" />
                                        <span className="hidden sm:inline">Ctrl+K</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
});

CommandPalette.displayName = 'CommandPalette';
export default CommandPalette;
