import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useColorHistory } from '../../context/ColorHistoryContext';
import { useNotifications } from '../../context/NotificationContext';
import LoginModal from '../auth/LoginModal';
import ProfileModal from '../auth/ProfileModal';
import SettingsModal from './SettingsModal';
import HelpCenterModal from './HelpCenterModal';
import vaToast from '../../utils/toast';
import {
    FaBars, FaTimes, FaBell, FaCog,
    FaUser, FaSignOutAlt, FaQuestionCircle, FaSlidersH, FaPalette,
    FaVolumeUp, FaCheckDouble, FaInfoCircle, FaCheckCircle, FaExclamationTriangle,
    FaCamera, FaEye, FaExchangeAlt, FaTrafficLight, FaHistory, FaImages, FaChevronDown, FaAdjust
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import CommandPalette from '../common/CommandPalette';

// All feature tools for the mega-dropdown
const TOOLS = [
    { label: 'Color Detector', desc: 'AI real-time camera color detection', to: '/color-picker', icon: FaCamera, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Color Blindness Sim', desc: 'Simulate 9 vision deficiencies', to: '/simulator', icon: FaEye, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Palette Checker', desc: 'WCAG contrast compliance checks', to: '/palette-checker', icon: FaExchangeAlt, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Traffic Signal AI', desc: 'Real-time signal detection', to: '/traffic-signal', icon: FaTrafficLight, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Color History', desc: 'Browse and manage saved colors', to: '/color-history', icon: FaHistory, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Image Palette', desc: 'Extract palettes from any image', to: '/palette-extractor', icon: FaImages, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { label: 'Palette Generator', desc: 'WCAG-compliant shade generator', to: '/palette-generator', icon: FaPalette, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Vision Test', desc: 'Colour blindness screening test', to: '/color-test', icon: FaEye, color: 'text-teal-500', bg: 'bg-teal-500/10' },
    { label: 'Colour Psychology', desc: 'Emotions & meanings behind colour', to: '/color-psychology', icon: FaSlidersH, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { label: 'Text Accessibility', desc: 'Font size & weight contrast checker', to: '/text-checker', icon: FaCheckDouble, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { label: 'Color Object Detector', desc: 'AI color labels on every object', to: '/color-object-detector', icon: FaCamera, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    { label: 'Image Recolor', desc: 'Simulate & fix color blindness on images', to: '/image-recolor', icon: FaAdjust, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
];

const Header = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();
    const { history: colorHistory } = useColorHistory();
    const { speak } = useSettings(); // Get speak from context

    // UI States
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    // Global notification context
    const { notifications, markAsRead, clearAllNotifications, unreadCount } = useNotifications();

    // Refs for click outside
    const notifRef = useRef(null);
    const settingsRef = useRef(null);
    const mobileMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
            if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && !event.target.closest('button[aria-label="Toggle mobile menu"]')) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen]);

    const [toolsOpen, setToolsOpen] = useState(false);
    const toolsRef = useRef(null);

    // Close tools dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Functions from context already handle state updates; 
    // we just want to optionally show a toast when user clears them here if needed.
    const handleClearAll = () => {
        clearAllNotifications();
        vaToast.info('Notifications cleared');
    };

    const speakNotifications = () => {
        const unread = notifications.filter(n => !n.read);
        const textToSpeak = unread.length > 0
            ? `You have ${unread.length} new notifications. ${unread.map(n => n.text).join('. ')}`
            : 'No new notifications.';
        speak(textToSpeak, true);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setSettingsOpen(false);
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'About', to: '/about' },
    ];

    const toolPaths = TOOLS.map(t => t.to);
    const isActive = (path) => location.pathname === path;
    const isToolActive = () => toolPaths.includes(location.pathname);
    return (
        <header className="sticky top-0 z-[999] w-full bg-white/50 dark:bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-20">

                    {/* Logo Section - Premium Redesign */}
                    <div className="flex-1 flex justify-start">
                        <Link to="/" className="flex-shrink-0 group">
                            <div className="flex items-center gap-4">
                                <div className="relative w-11 h-11">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300"></div>
                                    {/* Eye Icon */}
                                    <div className="absolute inset-0 flex items-center justify-center text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow-md">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                            <circle cx="12" cy="12" r="1.5" className="text-blue-100" fill="currentColor" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 group-hover:bg-gradient-to-l transition-all duration-500">
                                        VisionAid.
                                    </span>
                                    {/* <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                        Color Accessibility
                                    </span> */}
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Pill Island + Tools Mega Menu */}
                    <nav className="hidden lg:flex items-center justify-center flex-shrink-0">
                        <div className="bg-white/80 dark:bg-black/40 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-full p-1.5 flex items-center shadow-2xl shadow-purple-500/5 ring-1 ring-black/5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`relative px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isActive(link.to)
                                        ? 'text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {isActive(link.to) && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-blue-600 rounded-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            ))}

                            {/* Tools dropdown */}
                            <div className="relative" ref={toolsRef}>
                                <button
                                    onClick={() => setToolsOpen(!toolsOpen)}
                                    className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${isToolActive()
                                        ? 'text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {isToolActive() && (
                                        <motion.div
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-blue-600 rounded-full"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">Tools</span>
                                    <motion.span
                                        className="relative z-10"
                                        animate={{ rotate: toolsOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaChevronDown className="w-2.5 h-2.5" />
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {toolsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] bg-white/95 dark:bg-[#111]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 p-3"
                                        >
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 pb-2">All Tools</p>
                                            <div className="grid grid-cols-3 gap-1">
                                                {TOOLS.map((tool) => (
                                                    <Link
                                                        key={tool.to}
                                                        to={tool.to}
                                                        onClick={() => setToolsOpen(false)}
                                                        className={`flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all group ${isActive(tool.to) ? 'bg-gray-50 dark:bg-white/5' : ''
                                                            }`}
                                                    >
                                                        <div className={`w-9 h-9 rounded-xl ${tool.bg} ${tool.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                                                            <tool.icon className="text-sm" />
                                                        </div>
                                                        <div>
                                                            <p className={`text-sm font-bold ${isActive(tool.to) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                                                                {tool.label}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{tool.desc}</p>
                                                        </div>
                                                        {isActive(tool.to) && (
                                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </nav>

                    {/* Right Action Section */}
                    <div className="flex-1 flex items-center justify-end gap-2">

                        {/* Command Palette — single unified search (Ctrl+K) */}
                        <CommandPalette />

                        {/* ── Dark / Light Mode Toggle ── */}
                        <motion.button
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                            onClick={toggleTheme}
                            title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.88 }}
                            className="relative w-10 h-10 rounded-full flex items-center justify-center overflow-hidden transition-colors duration-300"
                            style={{
                                background: isDarkMode
                                    ? 'linear-gradient(135deg, #1e293b, #0f172a)'
                                    : 'linear-gradient(135deg, #fef3c7, #fde68a)',
                                boxShadow: isDarkMode
                                    ? '0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)'
                                    : '0 0 0 1px rgba(0,0,0,0.08), 0 2px 8px rgba(245,158,11,0.25)',
                            }}
                        >
                            <AnimatePresence mode="wait">
                                {isDarkMode ? (
                                    /* Moon */
                                    <motion.svg
                                        key="moon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5 text-indigo-300"
                                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                                    </motion.svg>
                                ) : (
                                    /* Sun */
                                    <motion.svg
                                        key="sun"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="w-5 h-5 text-amber-500"
                                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.3, ease: 'easeOut' }}
                                    >
                                        <circle cx="12" cy="12" r="5" />
                                        <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </motion.svg>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button
                                aria-label="Notifications"
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="relative p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <FaBell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0a0f1c] animate-pulse"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {notificationOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-4 w-80 bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right"
                                    >
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-white/5">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifications</h3>
                                                <button onClick={speakNotifications} className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors" title="Read Aloud">
                                                    <FaVolumeUp className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button onClick={handleClearAll} className="text-xs font-medium text-gray-500 hover:text-red-500 flex items-center gap-1 transition-colors">
                                                Clear all
                                            </button>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-col items-center gap-2">
                                                    <FaCheckDouble className="w-8 h-8 opacity-20" />
                                                    No new notifications
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => {
                                                            markAsRead(notif.id);
                                                            if (notif.action === 'profile') {
                                                                setIsProfileModalOpen(true);
                                                                setNotificationOpen(false);
                                                            } else if (notif.link) {
                                                                navigate(notif.link);
                                                                setNotificationOpen(false);
                                                            }
                                                        }}
                                                        className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all relative group ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent opacity-75'
                                                            }`}
                                                    >
                                                        <div className="flex gap-3 items-start">
                                                            {/* Semantic Icon based on Type */}
                                                            <div className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                                                notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                                                    'bg-blue-100 text-blue-600'
                                                                }`}>
                                                                {notif.type === 'success' ? <FaCheckCircle className="w-3 h-3" /> :
                                                                    notif.type === 'warning' ? <FaExclamationTriangle className="w-3 h-3" /> :
                                                                        <FaInfoCircle className="w-3 h-3" />}
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className={`text-sm leading-snug ${!notif.read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {notif.text}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 mt-1 font-mono uppercase tracking-wide">{notif.time}</p>
                                                            </div>
                                                            {!notif.read && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" title="Unread"></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Settings / User */}
                        <div className="relative" ref={settingsRef}>
                            <button
                                aria-label="Settings menu"
                                onClick={() => setSettingsOpen(!settingsOpen)}
                                className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            >
                                <FaCog className="w-5 h-5" />
                            </button>

                            <AnimatePresence>
                                {settingsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                        className="absolute right-0 mt-4 w-60 bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-50 origin-top-right"
                                    >
                                        <div className="p-2 space-y-1">
                                            {/* App Settings */}
                                            <button
                                                onClick={() => {
                                                    setSettingsOpen(false);
                                                    setIsSettingsModalOpen(true);
                                                }}
                                                className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                                            >
                                                <FaSlidersH className="text-blue-500 w-4 h-4" /> Preferences
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSettingsOpen(false);
                                                    setIsHelpCenterOpen(true);
                                                }}
                                                className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                                            >
                                                <FaQuestionCircle className="text-gray-400 w-4 h-4" /> Help Center
                                            </button>


                                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2"></div>

                                            {currentUser ? (
                                                <>
                                                    <button
                                                        onClick={() => {
                                                            setSettingsOpen(false);
                                                            setIsProfileModalOpen(true);
                                                        }}
                                                        className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                                                    >
                                                        <FaUser className="text-indigo-500 w-4 h-4" /> Profile
                                                    </button>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    >
                                                        <FaSignOutAlt className="w-4 h-4" /> Sign Out
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setSettingsOpen(false);
                                                        setIsLoginModalOpen(true);
                                                    }}
                                                    className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                >
                                                    <FaUser className="w-4 h-4" /> Sign In
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* User Profile / Sign In */}
                        {currentUser ? (
                            <div className="flex items-center gap-3 ml-2 pl-0 md:pl-3 border-l-0 md:border-l border-gray-200 dark:border-gray-800">
                                <div className="text-right hidden xl:block">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                                        {currentUser.displayName || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {currentUser.email}
                                    </p>
                                </div>
                                {currentUser.photoURL ? (
                                    <img
                                        src={currentUser.photoURL}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <FaUser />}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsLoginModalOpen(true)}
                                className="hidden md:block ml-2 px-5 py-2 text-sm font-bold text-white bg-[#0a0f1c] dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-all shadow-md"
                            >
                                Sign In
                            </button>
                        )}

                        {/* Mobile Menu Button - animated hamburger */}
                        <button
                            aria-label="Toggle mobile menu"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            <motion.div
                                animate={isMobileMenuOpen ? 'open' : 'closed'}
                                className="w-6 h-5 flex flex-col justify-between"
                            >
                                <motion.span className="block h-0.5 bg-current rounded-full origin-left"
                                    variants={{ open: { rotate: 45, y: -1 }, closed: { rotate: 0, y: 0 } }}
                                    transition={{ duration: 0.25 }}
                                />
                                <motion.span className="block h-0.5 bg-current rounded-full"
                                    variants={{ open: { opacity: 0, scaleX: 0 }, closed: { opacity: 1, scaleX: 1 } }}
                                    transition={{ duration: 0.25 }}
                                />
                                <motion.span className="block h-0.5 bg-current rounded-full origin-left"
                                    variants={{ open: { rotate: -45, y: 1 }, closed: { rotate: 0, y: 0 } }}
                                    transition={{ duration: 0.25 }}
                                />
                            </motion.div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0a0f1c] border-t border-gray-200 dark:border-gray-800 overflow-hidden shadow-2xl z-50 rounded-b-2xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${isActive(link.to)
                                        ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {/* All tools in mobile menu */}
                            <p className="px-4 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">Tools</p>
                            {TOOLS.map((tool) => (
                                <Link
                                    key={tool.to}
                                    to={tool.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive(tool.to)
                                        ? 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`w-7 h-7 rounded-lg ${tool.bg} ${tool.color} flex items-center justify-center flex-shrink-0 text-xs`}>
                                        <tool.icon />
                                    </div>
                                    {tool.label}
                                </Link>
                            ))}

                            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4 mx-4"></div>

                            {!currentUser ? (
                                <button
                                    onClick={() => {
                                        setIsLoginModalOpen(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full mt-2 px-4 py-3 font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md"
                                >
                                    Sign In
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full mt-2 px-4 py-3 font-bold text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                                >
                                    Sign Out
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modals */}
            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
            />
            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
            <HelpCenterModal
                isOpen={isHelpCenterOpen}
                onClose={() => setIsHelpCenterOpen(false)}
            />
        </header>
    );
};

export default Header;
