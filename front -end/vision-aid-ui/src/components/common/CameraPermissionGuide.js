import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCamera, FaChrome, FaSafari, FaFirefox, FaChevronRight, FaShieldAlt, FaTimes, FaMobile, FaDesktop } from 'react-icons/fa';

/**
 * CameraPermissionGuide
 * Shows a step-by-step guide when camera access is denied.
 * Props:
 *   onRetry   — called when user clicks "Try Again"
 *   onDismiss — called when user closes the guide
 *   error     — the DOMException or Error from getUserMedia (optional)
 */
const CameraPermissionGuide = ({ onRetry, onDismiss, error }) => {
    const [activeTab, setActiveTab] = useState('chrome');

    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    const isPermissionDenied = error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError';
    const isNoDevice = error?.name === 'NotFoundError' || error?.name === 'DevicesNotFoundError';
    const isInUse = error?.name === 'NotReadableError';

    const browsers = [
        {
            id: 'chrome',
            icon: <FaChrome className="text-blue-400" />,
            label: 'Chrome',
            steps: [
                'Click the 🔒 lock icon in the address bar',
                'Find "Camera" in the permissions list',
                'Change it from "Block" to "Allow"',
                'Refresh the page and try again',
            ],
        },
        {
            id: 'firefox',
            icon: <FaFirefox className="text-orange-400" />,
            label: 'Firefox',
            steps: [
                'Click the 🔒 shield icon in the address bar',
                'Click "Connection secure"',
                'Click "More information"',
                'Go to Permissions → Use the Camera → Allow',
                'Refresh the page and try again',
            ],
        },
        {
            id: 'safari',
            icon: <FaSafari className="text-cyan-400" />,
            label: 'Safari',
            steps: [
                'Go to Safari → Settings for This Website…',
                'Find "Camera" in the dropdown',
                'Change it to "Allow"',
                'Refresh the page and try again',
            ],
        },
        {
            id: 'mobile',
            icon: <FaMobile className="text-purple-400" />,
            label: 'Mobile',
            steps: [
                'Open your phone Settings app',
                'Find your browser (Chrome / Safari)',
                'Tap "Permissions" or "Site Settings"',
                'Enable Camera access',
                'Come back and tap "Try Again"',
            ],
        },
    ];

    const getErrorTitle = () => {
        if (isPermissionDenied) return 'Camera Access Denied';
        if (isNoDevice) return 'No Camera Found';
        if (isInUse) return 'Camera In Use';
        return 'Camera Unavailable';
    };

    const getErrorDescription = () => {
        if (isPermissionDenied) return 'Your browser has blocked camera access for this site. Follow the steps below to grant permission.';
        if (isNoDevice) return 'We couldn\'t detect a camera on your device. Please connect a camera and try again.';
        if (isInUse) return 'Your camera is being used by another app. Close other apps using the camera and try again.';
        return 'An unexpected error occurred while accessing the camera. Please check your settings and try again.';
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.9, y: 20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-lg bg-gray-900 border border-gray-700/50 rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Gradient top bar */}
                    <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    {/* Close button */}
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                        >
                            <FaTimes size={12} />
                        </button>
                    )}

                    <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                                <FaCamera className="text-red-400 text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{getErrorTitle()}</h2>
                                <p className="text-sm text-gray-400 leading-relaxed">{getErrorDescription()}</p>
                            </div>
                        </div>

                        {/* Only show guide for permission errors */}
                        {isPermissionDenied && (
                            <>
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <FaShieldAlt className="text-purple-400" />
                                    How to enable camera — choose your browser:
                                </p>

                                {/* Browser tabs */}
                                <div className="flex gap-2 mb-4">
                                    {browsers.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => setActiveTab(b.id)}
                                            className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all ${activeTab === b.id
                                                ? 'bg-white/10 border border-white/20 text-white'
                                                : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                                }`}
                                        >
                                            <span className="text-base">{b.icon}</span>
                                            {b.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Steps */}
                                <AnimatePresence mode="wait">
                                    {browsers.filter(b => b.id === activeTab).map(b => (
                                        <motion.div
                                            key={b.id}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="bg-gray-800/50 rounded-2xl p-4 mb-5 border border-gray-700/30"
                                        >
                                            <ol className="space-y-2.5">
                                                {b.steps.map((step, i) => (
                                                    <li key={i} className="flex items-start gap-3">
                                                        <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            {i + 1}
                                                        </span>
                                                        <span className="text-sm text-gray-300 leading-relaxed">{step}</span>
                                                    </li>
                                                ))}
                                            </ol>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </>
                        )}

                        {/* Quick tip */}
                        {!isNoDevice && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-5">
                                <FaShieldAlt className="text-green-500 flex-shrink-0" />
                                VisionAid only uses your camera for real-time detection. No video is stored or shared.
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                            {onRetry && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onRetry}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-purple-500/20"
                                >
                                    <FaCamera />
                                    Try Again
                                    <FaChevronRight className="ml-1" size={10} />
                                </motion.button>
                            )}
                            {onDismiss && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onDismiss}
                                    className="py-3 px-5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-2xl transition-all"
                                >
                                    Cancel
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CameraPermissionGuide;
