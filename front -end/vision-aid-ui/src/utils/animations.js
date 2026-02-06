export const fadeSlideUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 }
};

export const hoverScale = {
    scale: 1.05,
    transition: { type: "spring", stiffness: 300 }
};
