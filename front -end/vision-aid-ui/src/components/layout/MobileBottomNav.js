import React, { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FaCamera, FaEye, FaTrafficLight, FaPalette, FaHome
} from 'react-icons/fa';

const TABS = [
    { to: '/', icon: FaHome, label: 'Home', exact: true },
    { to: '/color-picker', icon: FaCamera, label: 'Detect' },
    { to: '/simulator', icon: FaEye, label: 'Simulate' },
    { to: '/traffic-signal', icon: FaTrafficLight, label: 'Traffic' },
    { to: '/palette-checker', icon: FaPalette, label: 'Palette' },
];

/**
 * MobileBottomNav — persistent bottom navigation bar on mobile.
 * Only visible on screens < 768px via CSS.
 */
const MobileBottomNav = memo(() => (
    <nav
        className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-50 items-center justify-around px-2 py-2 glass-card border-t border-gray-200/60 dark:border-white/5 shadow-2xl"
        aria-label="Mobile navigation"
        role="navigation"
    >
        {TABS.map(({ to, icon: Icon, label, exact }) => (
            <NavLink
                key={to}
                to={to}
                end={exact}
                className={({ isActive }) =>
                    `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${isActive
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`
                }
                aria-label={label}
            >
                {({ isActive }) => (
                    <>
                        <motion.div
                            className={`p-1.5 rounded-xl transition-all ${isActive
                                ? 'bg-purple-100 dark:bg-purple-500/20'
                                : 'bg-transparent'
                                }`}
                            animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            <Icon className="text-lg" />
                        </motion.div>
                        <span className="text-[10px] font-semibold">{label}</span>
                        {isActive && (
                            <motion.div
                                layoutId="bottom-tab-indicator"
                                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-500 rounded-b-full"
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </>
                )}
            </NavLink>
        ))}
    </nav>
));

MobileBottomNav.displayName = 'MobileBottomNav';
export default MobileBottomNav;
