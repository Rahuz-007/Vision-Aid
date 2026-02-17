import React from 'react';
import { motion } from 'framer-motion';

/**
 * Loading Spinner Component
 * Provides visual feedback during async operations
 */
const LoadingSpinner = ({
    size = 'md',
    message = 'Loading...',
    fullScreen = false,
    color = 'blue'
}) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-16 h-16',
        lg: 'w-24 h-24',
        xl: 'w-32 h-32'
    };

    const colors = {
        blue: 'border-blue-500',
        purple: 'border-purple-500',
        green: 'border-green-500',
        red: 'border-red-500'
    };

    const containerClass = fullScreen
        ? 'fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50'
        : 'flex items-center justify-center p-8';

    return (
        <div className={containerClass}>
            <div className="text-center">
                <motion.div
                    className="relative mx-auto"
                    style={{ width: 'fit-content' }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Outer spinning ring */}
                    <div className={`${sizes[size]} relative`}>
                        <motion.div
                            className={`absolute inset-0 rounded-full border-4 border-gray-700 ${colors[color]} border-t-transparent`}
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                        />

                        {/* Inner pulsing dot */}
                        <motion.div
                            className={`absolute inset-0 m-auto w-3 h-3 ${colors[color].replace('border', 'bg')} rounded-full`}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [1, 0.5, 1]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />
                    </div>
                </motion.div>

                {message && (
                    <motion.p
                        className="mt-4 text-sm font-medium text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {message}
                    </motion.p>
                )}
            </div>
        </div>
    );
};

/**
 * Skeleton Loader Component
 * For content placeholders
 */
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
    return (
        <div className={`space-y-3 ${className}`}>
            {[...Array(lines)].map((_, i) => (
                <motion.div
                    key={i}
                    className="h-4 bg-gray-700 rounded"
                    style={{ width: `${100 - i * 10}%` }}
                    animate={{
                        opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.1
                    }}
                />
            ))}
        </div>
    );
};

/**
 * Button Loading State
 */
export const ButtonLoader = ({ className = '' }) => {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear'
                }}
            />
            <span>Loading...</span>
        </div>
    );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ progress = 0, showPercentage = true }) => {
    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-400">Processing...</span>
                {showPercentage && (
                    <span className="text-sm font-bold text-blue-500">{progress}%</span>
                )}
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
};

export default LoadingSpinner;
