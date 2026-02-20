import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const ScrollProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const spring = useSpring(progress, { stiffness: 200, damping: 30 });

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (scrolled / total) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <motion.div
            style={{
                scaleX: spring.get() / 100,
                transformOrigin: 'left',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
            animate={{ scaleX: progress / 100 }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        />
    );
};

export default ScrollProgressBar;
