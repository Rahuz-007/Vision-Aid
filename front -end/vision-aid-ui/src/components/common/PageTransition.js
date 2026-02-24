import React from 'react';
import { motion } from 'framer-motion';

// Cinematic page transition — slide up + fade with subtle scale
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
        filter: 'blur(4px)',
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: {
            duration: 0.38,
            ease: [0.22, 1, 0.36, 1],  // custom spring-like ease
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        scale: 0.99,
        filter: 'blur(2px)',
        transition: {
            duration: 0.22,
            ease: 'easeIn',
        },
    },
};

/**
 * PageTransition — wraps each route's content.
 * Use with AnimatePresence on the parent <Routes>.
 * Provides a premium blur + slide + fade effect on navigation.
 */
const PageTransition = ({ children }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100%', transformOrigin: 'top center' }}
    >
        {children}
    </motion.div>
);

export default PageTransition;
