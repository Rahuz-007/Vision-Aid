import React, { useMemo, useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes, FaUser, FaEnvelope, FaSignOutAlt, FaEye,
    FaCalendarAlt, FaPalette, FaFire, FaStar, FaCamera, FaTrash, FaSpinner,
    FaCheckCircle, FaShieldAlt, FaEdit, FaSave, FaDownload, FaKey,
    FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { useColorHistory } from '../../context/ColorHistoryContext';
import { storage, auth } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import toast from 'react-hot-toast';
import Papa from 'papaparse';

// Animated Stat Card Component
const AnimatedStatCard = ({ stat, index }) => {
    const [count, setCount] = useState(0);
    const isNumber = typeof stat.value === 'number';

    useEffect(() => {
        if (!isNumber) return;

        let start = 0;
        const end = stat.value;
        const duration = 1000;
        const increment = end / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [stat.value, isNumber]);

    const getColorClasses = (color) => {
        const colors = {
            blue: 'text-blue-500',
            purple: 'text-purple-500',
            orange: 'text-orange-500',
            green: 'text-green-500'
        };
        return colors[color] || 'text-blue-500';
    };

    const getGradientColor = (color) => {
        const gradients = {
            blue: 'rgba(59,130,246,0.1)',
            purple: 'rgba(139,92,246,0.1)',
            orange: 'rgba(251,146,60,0.1)',
            green: 'rgba(34,197,94,0.1)'
        };
        return gradients[color] || 'rgba(59,130,246,0.1)';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gradient-to-br from-white to-gray-50 dark:from-white/5 dark:to-white/[0.02] rounded-2xl p-4 flex flex-col items-center justify-center text-center border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all shadow-sm hover:shadow-lg relative overflow-hidden group"
        >
            {/* Animated background gradient */}
            <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${getGradientColor(stat.color)}, transparent 70%)`
                }}
            />

            {/* Icon with pulse animation */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <stat.icon className={`${getColorClasses(stat.color)} text-xl mb-2 relative z-10`} />
            </motion.div>

            {/* Animated value */}
            <motion.span
                className={`text-2xl font-black text-gray-900 dark:text-white relative z-10 ${stat.truncate ? 'w-full truncate px-1 text-lg' : ''
                    }`}
                key={count}
            >
                {isNumber ? count : stat.value}
            </motion.span>

            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider relative z-10">
                {stat.label}
            </span>

            {/* Shine effect on hover */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
            />
        </motion.div>
    );
};

// Profile Completion Ring Component
const ProfileCompletionRing = ({ currentUser, stats }) => {
    const calculateCompletion = () => {
        let completion = 20; // Base points for account

        if (currentUser?.photoURL) completion += 25;
        if (currentUser?.displayName) completion += 15;
        if (currentUser?.emailVerified) completion += 10;
        if (stats.savedColors > 0) completion += 15;
        if (stats.savedColors >= 5) completion += 5;
        if (stats.savedColors >= 10) completion += 5;
        if (stats.streak > 0) completion += 5;

        return Math.min(completion, 100);
    };

    const percentage = calculateCompletion();
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30 mb-6"
        >
            <div className="flex items-center gap-4">
                {/* Progress Ring */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="6"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="40"
                            cy="40"
                            r="35"
                            fill="none"
                            stroke="url(#gradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset: offset }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-black text-gray-900 dark:text-white">
                            {percentage}%
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                        Profile Completion
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {percentage === 100
                            ? "Perfect! Your profile is complete! 🎉"
                            : `${100 - percentage}% to go! Complete your profile.`
                        }
                    </p>
                    {percentage < 100 && (
                        <div className="flex flex-wrap gap-1">
                            {!currentUser?.photoURL && (
                                <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                    + Add photo
                                </span>
                            )}
                            {stats.savedColors === 0 && (
                                <span className="text-[10px] px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                                    + Save colors
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


const ProfileModal = ({ isOpen, onClose }) => {
    const { currentUser, logout, refreshProfile } = useAuth();
    const { settings, updateSetting } = useSettings();
    const { history } = useColorHistory();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(currentUser?.displayName || '');

    // Reset state when modal closes/opens
    React.useEffect(() => {
        if (!isOpen) {
            setUploading(false);
            setIsEditingName(false);
        } else {
            setNewName(currentUser?.displayName || '');
        }
    }, [isOpen, currentUser]);

    const uploadWithTimeout = async (promise, ms = 15000) => {
        let timeoutId;
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => reject(new Error('Request timed out')), ms);
        });
        try {
            return await Promise.race([promise, timeoutPromise]);
        } finally {
            clearTimeout(timeoutId);
        }
    };

    // Format Date
    const joinDate = currentUser?.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    // Format Last Login
    // const lastLogin = currentUser?.metadata?.lastSignInTime
    //     ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    //     : 'Just now';

    // Calculate Statistics
    const stats = useMemo(() => {
        const savedColors = history.length;
        const joinTimestamp = currentUser?.metadata?.creationTime
            ? new Date(currentUser.metadata.creationTime).getTime()
            : Date.now();
        const daysSinceJoin = Math.floor((Date.now() - joinTimestamp) / (1000 * 60 * 60 * 24));
        const today = new Date().toDateString();
        const hasActivityToday = history.some(item =>
            new Date(item.timestamp).toDateString() === today
        );
        const streak = hasActivityToday ? Math.min(daysSinceJoin, 7) : 0;
        const colorCounts = {};
        history.forEach(item => {
            const colorName = item.name || item.hex;
            colorCounts[colorName] = (colorCounts[colorName] || 0) + 1;
        });
        const favoriteColor = Object.keys(colorCounts).length > 0
            ? Object.entries(colorCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'None yet';

        return { savedColors, daysActive: daysSinceJoin, streak, favoriteColor };
    }, [history, currentUser]);

    // Check if user is signed in via Google
    const isGoogleUser = currentUser?.providerData?.some(p => p.providerId === 'google.com');

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        if (!storage) {
            toast.error("Storage is not configured. Check your .env setup.");
            return;
        }

        const uploadId = Date.now();
        fileInputRef.current.dataset.uploadId = uploadId;

        try {
            setUploading(true);
            const fileRef = ref(storage, `profile_photos/${currentUser.uid}/${Date.now()}_${file.name}`);
            await uploadWithTimeout(uploadBytes(fileRef, file), 60000);

            if (fileInputRef.current.dataset.uploadId != uploadId) return;

            const photoURL = await getDownloadURL(fileRef);
            await updateProfile(auth.currentUser, { photoURL });

            try { await refreshProfile(); } catch (e) { console.warn(e); }

            setUploading(false);
            toast.success('Profile photo updated!');
        } catch (error) {
            console.error("Upload Error:", error);
            setUploading(false);
            if (error.message === 'Request timed out') {
                toast.error('Upload timed out. Check connection.');
            } else {
                toast.error('Failed to update photo. ' + (error.message || 'Error'));
            }
        } finally {
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCancelUpload = () => {
        setUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.dataset.uploadId = '';
            fileInputRef.current.value = '';
        }
        toast('Upload cancelled');
    };

    const handleDeletePhoto = async () => {
        if (isGoogleUser) {
            if (!window.confirm("You are signed in with Google. This will remove your custom photo and may revert to your Google profile picture. Continue?")) return;
        } else {
            if (!window.confirm("Are you sure you want to remove your profile photo?")) return;
        }

        try {
            setUploading(true);
            await updateProfile(auth.currentUser, { photoURL: "" });
            await refreshProfile();
            setUploading(false);
            toast.success('Profile photo removed');
        } catch (error) {
            setUploading(false);
            toast.error('Failed to remove photo');
        }
    };

    const triggerFileInput = () => fileInputRef.current?.click();

    const handleSaveName = async () => {
        if (!newName.trim()) return toast.error("Name cannot be empty");
        try {
            await updateProfile(auth.currentUser, { displayName: newName });
            await refreshProfile();
            setIsEditingName(false);
            toast.success("Name updated successfully");
        } catch (error) {
            toast.error("Failed to update name");
        }
    };

    const handleExportData = () => {
        if (history.length === 0) return toast("No data to export");
        const csv = Papa.unparse(history);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `vision_aid_data_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        toast.success("Data exported successfully");
    };

    const handlePasswordReset = async () => {
        if (isGoogleUser) return toast.error("Please change your password via Google Account settings.");
        try {
            await sendPasswordResetEmail(auth, currentUser.email);
            toast.success("Password reset email sent!");
        } catch (error) {
            toast.error("Failed to send reset email: " + error.message);
        }
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 flex flex-col max-h-[90vh]"
                    >
                        {/* Header Actions */}
                        <div className="absolute top-4 right-4 z-20">
                            <button
                                onClick={onClose}
                                className="p-2 bg-gray-100/50 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full backdrop-blur-sm transition-all"
                            >
                                <FaTimes size={18} />
                            </button>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden pt-12">
                            <div className="px-8 pb-8 relative">

                                {/* Profile Header Section (Clean & Minimal) */}
                                <div className="flex flex-col items-center mb-8">
                                    {/* Avatar Glow Effect */}
                                    <motion.div
                                        className="relative group mb-4"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        {/* Animated gradient ring */}
                                        <motion.div
                                            className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            style={{
                                                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)',
                                                backgroundSize: '300% 100%'
                                            }}
                                            animate={{
                                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                            }}
                                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                        />

                                        {/* Pulsing glow */}
                                        <motion.div
                                            className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.3, 0.6, 0.3]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />

                                        <div className="w-28 h-28 rounded-full border-4 border-white dark:border-[#1e293b] shadow-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden relative z-10">
                                            {uploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    {/* Enhanced loading spinner */}
                                                    <div className="relative w-12 h-12">
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-4 border-blue-500/20"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                        />
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                                        />
                                                    </div>
                                                    <motion.button
                                                        onClick={(e) => { e.stopPropagation(); handleCancelUpload(); }}
                                                        className="text-[10px] bg-red-500 text-white px-3 py-1 rounded-full shadow-lg"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        Cancel
                                                    </motion.button>
                                                </div>
                                            ) : (
                                                currentUser.photoURL ? (
                                                    <motion.img
                                                        src={currentUser.photoURL}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                        initial={{ scale: 0.8, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                ) : (
                                                    <div className="text-4xl font-bold text-gray-400">
                                                        {currentUser.displayName?.[0]?.toUpperCase() || <FaUser />}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        {/* Enhanced camera button */}
                                        {!uploading && (
                                            <motion.button
                                                onClick={triggerFileInput}
                                                className="absolute bottom-1 right-1 p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl border-2 border-white dark:border-gray-900"
                                                title="Change Photo"
                                                whileHover={{ scale: 1.15, rotate: 15 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaCamera size={14} />
                                            </motion.button>
                                        )}

                                        {/* Delete photo button (only if photo exists) */}
                                        {!uploading && currentUser.photoURL && (
                                            <motion.button
                                                onClick={handleDeletePhoto}
                                                className="absolute bottom-1 left-1 p-2 bg-red-500 text-white rounded-full shadow-xl border-2 border-white dark:border-gray-900 opacity-0 group-hover:opacity-100"
                                                title="Remove Photo"
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.95 }}
                                                initial={{ opacity: 0 }}
                                            >
                                                <FaTrash size={12} />
                                            </motion.button>
                                        )}

                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                    </motion.div>

                                    {/* Name & Title */}
                                    <div className="text-center w-full">
                                        {isEditingName ? (
                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                <input
                                                    autoFocus
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="text-xl font-bold text-center bg-gray-50 dark:bg-gray-800 border-b-2 border-blue-500 rounded-t px-2 py-1 outline-none text-gray-900 dark:text-white w-48"
                                                />
                                                <button onClick={handleSaveName} className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full"><FaSave /></button>
                                                <button onClick={() => setIsEditingName(false)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"><FaTimes /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 group cursor-pointer mb-1" onClick={() => setIsEditingName(true)}>
                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                                    {currentUser.displayName || 'VisionAid User'}
                                                </h3>
                                                <FaEdit className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" size={12} />
                                            </div>
                                        )}
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
                                            VisionAid Member
                                            {currentUser.emailVerified && <FaCheckCircle className="text-blue-500" size={12} title="Verified" />}
                                        </p>
                                    </div>
                                </div>

                                {/* Profile Completion Ring */}
                                <ProfileCompletionRing currentUser={currentUser} stats={stats} />

                                {/* Achievement Badges */}
                                {stats.savedColors >= 10 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.5 }}
                                        className="mb-6"
                                    >
                                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-2xl p-4 border border-yellow-200 dark:border-yellow-900/30">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                                >
                                                    <FaStar className="text-yellow-500 text-2xl" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                                        Color Enthusiast! 🎨
                                                    </h4>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        You've saved {stats.savedColors} colors! Keep exploring!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {stats.streak >= 3 && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.6 }}
                                        className="mb-6"
                                    >
                                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 rounded-2xl p-4 border border-orange-200 dark:border-orange-900/30">
                                            <div className="flex items-center gap-3">
                                                <motion.div
                                                    animate={{ scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <FaFire className="text-orange-500 text-2xl" />
                                                </motion.div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                                        On Fire! 🔥
                                                    </h4>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {stats.streak} day streak! Don't break the chain!
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Stats Grid (Clean) */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                                    {[
                                        { label: 'Colors', value: stats.savedColors, icon: FaPalette, color: 'blue' },
                                        { label: 'Days', value: stats.daysActive, icon: FaCalendarAlt, color: 'purple' },
                                        { label: 'Streak', value: stats.streak, icon: FaFire, color: 'orange' },
                                        { label: 'Favorite', value: stats.favoriteColor, icon: FaStar, color: 'green', truncate: true },
                                    ].map((stat, i) => (
                                        <AnimatedStatCard key={i} stat={stat} index={i} />
                                    ))}
                                </div>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                    {/* Left: Account & Info */}
                                    <div className="space-y-6">
                                        <section>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Account</h4>
                                            <div className="bg-white dark:bg-black/20 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                                                <div className="p-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                                                            <FaEnvelope size={12} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate max-w-[140px]">{currentUser.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-400">
                                                            <FaCalendarAlt size={12} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Joined</p>
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{joinDate}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Actions</h4>
                                            <div className="space-y-2">
                                                <button
                                                    onClick={handleExportData}
                                                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 group transition-all"
                                                >
                                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">Export Data</span>
                                                    <FaDownload size={12} className="text-gray-400 group-hover:text-blue-500" />
                                                </button>

                                                {!isGoogleUser && (
                                                    <button
                                                        onClick={handlePasswordReset}
                                                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-orange-200 dark:hover:border-orange-900/50 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 group transition-all"
                                                    >
                                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">Reset Password</span>
                                                        <FaKey size={12} className="text-gray-400 group-hover:text-orange-500" />
                                                    </button>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Right: Vision & Danger */}
                                    <div className="space-y-6">
                                        <section>
                                            <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 ml-1">Vision Mode</h4>
                                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-5 border border-blue-100 dark:border-blue-900/30">
                                                <div className="relative mb-3">
                                                    <select
                                                        value={settings.visionType || 'normal'}
                                                        onChange={(e) => updateSetting('visionType', e.target.value)}
                                                        className="w-full bg-white dark:bg-black/40 text-gray-900 dark:text-white text-sm font-bold rounded-xl px-4 py-3 outline-none border border-blue-200 dark:border-blue-800 focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm cursor-pointer"
                                                    >
                                                        <option value="normal">Normal Vision</option>
                                                        <option value="protanopia">Protanopia (Red)</option>
                                                        <option value="deuteranopia">Deuteranopia (Green)</option>
                                                        <option value="tritanopia">Tritanopia (Blue)</option>
                                                        <option value="achromatopsia">Achromatopsia</option>
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-500">
                                                        <FaChevronRight className="rotate-90" size={12} />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 leading-relaxed font-medium">
                                                    Simulates how users with different types of color blindness perceive the interface.
                                                </p>
                                            </div>
                                        </section>

                                        <section className="pt-4">
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                                                        toast.error("Please contact support to delete your account permanently.");
                                                    }
                                                }}
                                                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-xs font-bold uppercase tracking-wide opacity-70 hover:opacity-100"
                                            >
                                                <FaTrash size={12} /> Delete Account
                                            </button>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50/50 dark:bg-black/20 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                            <button
                                onClick={() => { logout(); onClose(); }}
                                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-sm transition-colors flex items-center gap-2 px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                            >
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>

                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ProfileModal;
