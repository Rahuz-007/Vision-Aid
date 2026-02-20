import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
};

/**
 * Wrap the <Routes> block with AnimatePresence and each route's element 
 * with <PageTransition>. The key={location.pathname} on AnimatePresence
 * re-mounts on every navigation, triggering the animation.
 */
const PageTransition = ({ children }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100%' }}
    >
        {children}
    </motion.div>
);

export default PageTransition;
