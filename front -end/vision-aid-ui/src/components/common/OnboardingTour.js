import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronRight } from 'react-icons/fa';

/**
 * Enhanced Onboarding Tour with "Glue-like" positioning
 * Uses requestAnimationFrame to perfectly track elements even during animations/scrolls.
 */
const OnboardingTour = ({ steps, tourId, onComplete, userId }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // We store position in state to drive the render, but use refs for diffing to avoid re-renders
    const [popoverPos, setPopoverPos] = useState(null);
    const [highlightPos, setHighlightPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

    const requestRef = useRef();
    const prevRectJson = useRef(null);

    const storageKey = userId ? `hasSeenTour_${tourId}_${userId}` : `hasSeenTour_${tourId}_guest`;

    // Check availability
    useEffect(() => {
        const hasSeenTour = localStorage.getItem(storageKey);
        if (!hasSeenTour) {
            // Small delay to ensure initial hydration
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, [tourId, userId, storageKey]);

    // Handle Scroll & Focus when step changes
    useEffect(() => {
        if (!isVisible) return;
        const step = steps[currentStep];
        if (!step?.target) return;

        const attemptScroll = () => {
            const element = document.querySelector(step.target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // If element not found yet, retry briefly (for lazy load components)
                setTimeout(attemptScroll, 500);
            }
        };
        attemptScroll();
    }, [currentStep, isVisible, steps]);

    // specific padding for the highlight box
    const padding = 8;

    // The "Game Loop" for positioning
    const updatePosition = useCallback(() => {
        const step = steps[currentStep];
        if (!isVisible || !step?.target) {
            requestRef.current = requestAnimationFrame(updatePosition);
            return;
        }

        const element = document.querySelector(step.target);
        if (element) {
            const rect = element.getBoundingClientRect();

            // Create a JSON string to quickly check for changes
            // We only update state if the numbers actually changed to prevent React churn
            const rectJson = JSON.stringify({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });

            if (rectJson !== prevRectJson.current) {
                prevRectJson.current = rectJson;

                // Update Highlight Box (Viewport Coordinates)
                setHighlightPos({
                    top: rect.top - padding,
                    left: rect.left - padding,
                    width: rect.width + (padding * 2),
                    height: rect.height + (padding * 2)
                });

                // Update Popover Position Logic
                // We prefer putting it below. If it hits the bottom edge, put it above.
                const viewportHeight = window.innerHeight;
                const showAbove = (rect.bottom + 250) > viewportHeight; // user estimated height 250

                setPopoverPos({
                    // Center horizontally, clamp to screen edges
                    left: Math.max(16, Math.min(window.innerWidth - 350, rect.left + (rect.width / 2) - 160)),
                    top: showAbove
                        ? rect.top - padding - 10 - 20 // 10px margin, ~20px for arrow/breathing room - actually let's calculate exact height later or just use flex
                        : rect.bottom + padding + 10,
                    isAbove: showAbove
                });
            }
        }

        requestRef.current = requestAnimationFrame(updatePosition);
    }, [currentStep, isVisible, steps]);

    // Start/Stop Loop
    useEffect(() => {
        if (isVisible) {
            requestRef.current = requestAnimationFrame(updatePosition);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isVisible, updatePosition]);


    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        setIsVisible(false);
        localStorage.setItem(storageKey, 'true');
        if (onComplete) onComplete();
    };

    if (!isVisible) return null;

    const step = steps[currentStep];

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[9999] overflow-hidden pointer-events-none">

                    {/* Highlight Box with "Hole" Effect */}
                    <motion.div
                        initial={false}
                        animate={{
                            top: highlightPos.top,
                            left: highlightPos.left,
                            width: highlightPos.width,
                            height: highlightPos.height,
                            opacity: 1
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 250,
                            damping: 30,
                            mass: 1
                        }}
                        className="absolute rounded-xl pointer-events-auto shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"
                    >
                        {/* Animated Border/Glow */}
                        <div className="absolute inset-0 rounded-xl border-2 border-blue-500/80 animate-pulse box-border"></div>
                    </motion.div>

                    {/* Tooltip Popover */}
                    {popoverPos && (
                        <motion.div
                            key={currentStep} // Re-mount on step change to trigger entry animation
                            initial={{
                                opacity: 0,
                                y: popoverPos.isAbove ? 20 : -20,
                                scale: 0.95
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                top: popoverPos.isAbove ? undefined : popoverPos.top, // Use 'top' for below
                                bottom: popoverPos.isAbove ? (window.innerHeight - popoverPos.top + 20) : undefined, // Use 'bottom' for above
                                left: popoverPos.left,
                                scale: 1
                            }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, type: "spring", bounce: 0.4 }}
                            className="absolute pointer-events-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-2xl shadow-2xl w-[320px] max-w-[90vw] border border-gray-100 dark:border-gray-700 flex flex-col gap-4"
                        >
                            <button
                                onClick={handleComplete}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <FaTimes />
                            </button>

                            <div>
                                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 block">
                                    Step {currentStep + 1} of {steps.length}
                                </span>
                                <h3 className="text-lg font-bold mb-2 leading-tight">{step.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {step.content}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700/50 mt-2">
                                <div className="flex gap-1.5">
                                    {steps.map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-6 bg-blue-600' : 'w-1.5 bg-gray-300 dark:bg-gray-600'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    {currentStep > 0 && (
                                        <button
                                            onClick={handlePrev}
                                            className="text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white px-3 py-1.5 transition-colors"
                                        >
                                            Back
                                        </button>
                                    )}
                                    <button
                                        onClick={handleNext}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-transform active:scale-95 ml-auto"
                                    >
                                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <FaChevronRight size={10} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
    );
};

export default OnboardingTour;
