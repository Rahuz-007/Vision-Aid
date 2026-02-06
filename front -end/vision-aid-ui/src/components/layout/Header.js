import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useColorHistory } from '../../context/ColorHistoryContext';
import LoginModal from '../auth/LoginModal';
import ProfileModal from '../auth/ProfileModal';
import SettingsModal from './SettingsModal';
import HelpCenterModal from './HelpCenterModal';
import toast from 'react-hot-toast';
import {
    FaBars, FaTimes, FaBell, FaCog,
    FaUser, FaSignOutAlt, FaQuestionCircle, FaSlidersH, FaPalette
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();
    const { history: colorHistory } = useColorHistory();

    // UI States
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "Welcome to VisionAid! Try our new features.", time: "2m ago", read: false },
        { id: 2, text: "Traffic Signal Detector updated.", time: "1h ago", read: false },
        { id: 3, text: "Your profile is 80% complete.", time: "1d ago", read: true }
    ]);

    // Refs for click outside
    const notifRef = useRef(null);
    const settingsRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setNotificationOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target)) {
                setSettingsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAllNotifications = () => {
        setNotifications([]);
    };

    const handleLogout = async () => {
        try {
            await logout();
            setSettingsOpen(false);
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navLinks = [
        { label: 'Home', to: '/' },
        { label: 'Color Detector', to: '/color-picker' },
        { label: 'Palette Checker', to: '/palette-checker' },
        { label: 'Color Blindness', to: '/simulator' },
        { label: 'Traffic Signals', to: '/traffic-signal' },
    ];

    const isActive = (path) => location.pathname === path;
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/50 dark:bg-[#0a0f1c]/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
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
                                        VisionAid
                                    </span>
                                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                                        Color Accessibility
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Pill Island Design */}
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
                                            className="absolute inset-0 bg-blue-600 dark:bg-blue-600 rounded-full"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Right Action Section */}
                    <div className="flex-1 flex items-center justify-end gap-3">


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
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifications</h3>
                                            <button onClick={clearAllNotifications} className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline">
                                                Clear all
                                            </button>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                                                    No new notifications
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => markAsRead(notif.id)}
                                                        className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!notif.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                            }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!notif.read ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                                                            <div>
                                                                <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                    {notif.text}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                            </div>
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

                                            {/* Saved Colors */}
                                            <button
                                                onClick={() => {
                                                    setSettingsOpen(false);
                                                    navigate('/color-history');
                                                }}
                                                className="w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                                            >
                                                <FaPalette className="text-purple-500 w-4 h-4" />
                                                <span>Saved Colors</span>
                                                {colorHistory.length > 0 && (
                                                    <span className="ml-auto px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded-full">
                                                        {colorHistory.length}
                                                    </span>
                                                )}
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
                            <div className="hidden md:flex items-center gap-3 ml-2 pl-3 border-l border-gray-200 dark:border-gray-800">
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

                        {/* Mobile Menu Button */}
                        <button
                            aria-label="Toggle mobile menu"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                            {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white dark:bg-[#0a0f1c] border-t border-gray-200 dark:border-gray-800 overflow-hidden"
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
