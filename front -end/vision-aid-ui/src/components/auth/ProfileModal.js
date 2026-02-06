import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUser, FaEnvelope, FaSignOutAlt, FaIdCard, FaEye, FaCalendarAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const ProfileModal = ({ isOpen, onClose }) => {
    const { currentUser, logout } = useAuth();
    const { settings } = useSettings();

    if (!currentUser) return null;

    // Format Date
    const joinDate = currentUser.metadata?.creationTime
        ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Recently';

    // Format Vision Type
    const visionLabel = settings?.visionType
        ? settings.visionType.charAt(0).toUpperCase() + settings.visionType.slice(1)
        : 'Normal';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 pb-12 text-white text-center relative">
                            <button
                                onClick={onClose}
                                aria-label="Close profile modal"
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <FaTimes size={20} />
                            </button>
                            <h2 className="text-2xl font-bold">My Profile</h2>
                            <p className="text-white/80 text-sm">Manage your account details</p>
                        </div>

                        {/* Content */}
                        <div className="px-8 pb-8 flex flex-col items-center">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-xl -mt-12 bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden z-10 relative">
                                {currentUser.photoURL ? (
                                    <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : <FaUser />}
                                    </div>
                                )}
                            </div>

                            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white text-center">
                                {currentUser.displayName || 'Anonymous User'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">VisionAid Member</p>

                            {/* Details Card */}
                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={currentUser.email}>{currentUser.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                        <FaIdCard />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">User ID</p>
                                        <p className="text-xs font-mono font-medium text-gray-700 dark:text-gray-300 truncate" title={currentUser.uid}>{currentUser.uid}</p>
                                    </div>
                                </div>
                            </div>

                            {/* vision stats */}
                            <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FaEye className="text-blue-500" /> Vision Profile
                                </h4>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Color Mode</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{visionLabel}</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                        <div className="text-xs text-gray-500 uppercase font-bold mb-1 flex items-center gap-1"><FaCalendarAlt /> Member Since</div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{joinDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Sign Out Action */}
                            <button
                                onClick={() => {
                                    logout();
                                    onClose();
                                }}
                                className="mt-8 w-full py-3.5 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md"
                            >
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
