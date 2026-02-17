import React from 'react';
import { motion } from 'framer-motion';
import {
    FaCamera,
    FaPalette,
    FaHistory,
    FaExclamationTriangle,
    FaSearch,
    FaInbox,
    FaPlus
} from 'react-icons/fa';

/**
 * Empty State Component
 * Shows helpful messages when there's no content
 */
const EmptyState = ({
    type = 'default',
    icon: CustomIcon,
    title,
    description,
    action,
    actionText = 'Get Started',
    onAction,
    className = ''
}) => {
    // Predefined empty states
    const emptyStates = {
        'no-colors': {
            icon: FaPalette,
            title: 'No colors saved yet',
            description: 'Start detecting colors to build your collection',
            actionText: 'Detect Color'
        },
        'no-history': {
            icon: FaHistory,
            title: 'No detection history',
            description: 'Your color detection history will appear here',
            actionText: 'Start Detecting'
        },
        'no-camera': {
            icon: FaCamera,
            title: 'Camera access required',
            description: 'Please allow camera access to detect colors in real-time',
            actionText: 'Enable Camera'
        },
        'no-search': {
            icon: FaSearch,
            title: 'No results found',
            description: 'Try adjusting your search terms',
            actionText: 'Clear Search'
        },
        'no-collections': {
            icon: FaInbox,
            title: 'No collections yet',
            description: 'Create collections to organize your colors',
            actionText: 'Create Collection'
        },
        'error': {
            icon: FaExclamationTriangle,
            title: 'Something went wrong',
            description: 'We encountered an error. Please try again',
            actionText: 'Retry'
        },
        'default': {
            icon: FaInbox,
            title: 'Nothing here yet',
            description: 'Get started by adding some content',
            actionText: 'Get Started'
        }
    };

    const state = emptyStates[type] || emptyStates.default;
    const Icon = CustomIcon || state.icon;
    const finalTitle = title || state.title;
    const finalDescription = description || state.description;
    const finalActionText = actionText || state.actionText;

    return (
        <motion.div
            className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Icon */}
            <motion.div
                className="mb-6 p-6 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1
                }}
            >
                <Icon className="w-12 h-12" />
            </motion.div>

            {/* Title */}
            <motion.h3
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {finalTitle}
            </motion.h3>

            {/* Description */}
            <motion.p
                className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {finalDescription}
            </motion.p>

            {/* Action Button */}
            {(action || onAction) && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {action || (
                        <button
                            onClick={onAction}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-full shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                            <FaPlus className="w-4 h-4" />
                            {finalActionText}
                        </button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

/**
 * Compact Empty State (for smaller spaces)
 */
export const EmptyStateCompact = ({
    icon: Icon = FaInbox,
    message = 'No items',
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-8 px-4 text-center ${className}`}>
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-600 mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
};

/**
 * Empty State with Illustration
 */
export const EmptyStateIllustration = ({
    illustration,
    title,
    description,
    action,
    className = ''
}) => {
    return (
        <motion.div
            className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Illustration */}
            {illustration && (
                <motion.div
                    className="mb-8 w-64 h-64"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {illustration}
                </motion.div>
            )}

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8 text-lg">
                {description}
            </p>

            {/* Action */}
            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {action}
                </motion.div>
            )}
        </motion.div>
    );
};

export default EmptyState;
