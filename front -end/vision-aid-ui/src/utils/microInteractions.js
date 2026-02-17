/**
 * Micro-interactions Library
 * Reusable animation variants for Framer Motion
 */

// Fade In Animations
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

export const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export const fadeInDown = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export const fadeInLeft = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

export const fadeInRight = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" }
    }
};

// Scale Animations
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

export const scaleUp = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

// Hover Animations
export const hoverScale = {
    scale: 1.05,
    transition: { duration: 0.2 }
};

export const hoverLift = {
    y: -4,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    transition: { duration: 0.2 }
};

export const hoverGlow = {
    boxShadow: "0 0 20px rgba(99, 102, 241, 0.5)",
    transition: { duration: 0.3 }
};

// Tap Animations
export const tapScale = {
    scale: 0.95,
    transition: { duration: 0.1 }
};

// Stagger Children
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

// Slide Animations
export const slideInLeft = {
    hidden: { x: "-100%" },
    visible: {
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: {
        x: "-100%",
        transition: { duration: 0.3 }
    }
};

export const slideInRight = {
    hidden: { x: "100%" },
    visible: {
        x: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: {
        x: "100%",
        transition: { duration: 0.3 }
    }
};

export const slideInUp = {
    hidden: { y: "100%" },
    visible: {
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: {
        y: "100%",
        transition: { duration: 0.3 }
    }
};

export const slideInDown = {
    hidden: { y: "-100%" },
    visible: {
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: {
        y: "-100%",
        transition: { duration: 0.3 }
    }
};

// Rotate Animations
export const rotateIn = {
    hidden: { opacity: 0, rotate: -180 },
    visible: {
        opacity: 1,
        rotate: 0,
        transition: { duration: 0.5 }
    }
};

export const spin = {
    animate: {
        rotate: 360,
        transition: {
            duration: 1,
            repeat: Infinity,
            ease: "linear"
        }
    }
};

// Pulse Animations
export const pulse = {
    animate: {
        scale: [1, 1.05, 1],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

export const heartbeat = {
    animate: {
        scale: [1, 1.1, 1, 1.1, 1],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Bounce Animations
export const bounce = {
    animate: {
        y: [0, -10, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Shake Animation
export const shake = {
    animate: {
        x: [0, -10, 10, -10, 10, 0],
        transition: {
            duration: 0.5
        }
    }
};

// Modal/Overlay Animations
export const modalBackdrop = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

export const modalContent = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30
        }
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.2 }
    }
};

// Drawer Animations
export const drawerLeft = {
    hidden: { x: "-100%" },
    visible: {
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
        x: "-100%",
        transition: { duration: 0.2 }
    }
};

export const drawerRight = {
    hidden: { x: "100%" },
    visible: {
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
        x: "100%",
        transition: { duration: 0.2 }
    }
};

// Notification Animations
export const notificationSlide = {
    hidden: { x: 400, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: {
        x: 400,
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

// Progress Animations
export const progressBar = (progress) => ({
    width: `${progress}%`,
    transition: { duration: 0.3, ease: "easeOut" }
});

// Skeleton Loading
export const skeletonPulse = {
    animate: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Card Flip
export const cardFlip = {
    hidden: { rotateY: 90, opacity: 0 },
    visible: {
        rotateY: 0,
        opacity: 1,
        transition: { duration: 0.6 }
    }
};

// Expand/Collapse
export const expand = {
    hidden: { height: 0, opacity: 0 },
    visible: {
        height: "auto",
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

// Ripple Effect (for buttons)
export const ripple = {
    initial: { scale: 0, opacity: 0.5 },
    animate: {
        scale: 2,
        opacity: 0,
        transition: { duration: 0.6 }
    }
};

// Typewriter Effect
export const typewriter = (text) => ({
    hidden: { width: 0 },
    visible: {
        width: "100%",
        transition: {
            duration: text.length * 0.05,
            ease: "linear"
        }
    }
});

// Glow Effect
export const glow = {
    animate: {
        boxShadow: [
            "0 0 5px rgba(99, 102, 241, 0.5)",
            "0 0 20px rgba(99, 102, 241, 0.8)",
            "0 0 5px rgba(99, 102, 241, 0.5)"
        ],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Float Animation
export const float = {
    animate: {
        y: [0, -20, 0],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Wiggle Animation
export const wiggle = {
    animate: {
        rotate: [0, -5, 5, -5, 5, 0],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2
        }
    }
};

// Success Checkmark
export const successCheck = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: {
            pathLength: { duration: 0.5, ease: "easeInOut" },
            opacity: { duration: 0.2 }
        }
    }
};

// Export all as default object
export default {
    fadeIn,
    fadeInUp,
    fadeInDown,
    fadeInLeft,
    fadeInRight,
    scaleIn,
    scaleUp,
    hoverScale,
    hoverLift,
    hoverGlow,
    tapScale,
    staggerContainer,
    staggerItem,
    slideInLeft,
    slideInRight,
    slideInUp,
    slideInDown,
    rotateIn,
    spin,
    pulse,
    heartbeat,
    bounce,
    shake,
    modalBackdrop,
    modalContent,
    drawerLeft,
    drawerRight,
    notificationSlide,
    progressBar,
    skeletonPulse,
    cardFlip,
    expand,
    ripple,
    typewriter,
    glow,
    float,
    wiggle,
    successCheck
};
