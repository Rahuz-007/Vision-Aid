import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { ColorHistoryProvider } from './context/ColorHistoryContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import { isConfigValid } from './config/firebase';
import { FaTimes } from 'react-icons/fa';
import ErrorBoundary from './components/common/ErrorBoundary';
import PageSkeleton from './components/common/PageSkeleton';
import PageTransition from './components/common/PageTransition';
import ScrollProgressBar from './components/common/ScrollProgressBar';
import VisionOnboardingModal from './components/auth/VisionOnboardingModal';
import { NotificationProvider } from './context/NotificationContext';
import VisionFilters from './components/common/VisionFilters';
import ScrollToTop from './components/common/ScrollToTop';
import MobileBottomNav from './components/layout/MobileBottomNav';

// Lazy-loaded feature pages — each paired with its content-shaped skeleton
const Simulator = React.lazy(() => import('./components/features/ColorBlindnessSimulator/ColorBlindnessSimulator'));
const ContrastChecker = React.lazy(() => import('./components/features/ContrastChecker/ContrastChecker'));
const ColorPicker = React.lazy(() => import('./components/features/ColorPicker/ColorPicker'));
const PaletteChecker = React.lazy(() => import('./components/features/PaletteChecker/PaletteChecker'));
const TrafficSignalDetector = React.lazy(() => import('./components/features/TrafficSignalDetector/TrafficSignalDetector'));
const ColorHistory = React.lazy(() => import('./components/pages/ColorHistory/ColorHistory'));
const InfoPage = React.lazy(() => import('./pages/InfoPage'));
const Docs = React.lazy(() => import('./pages/Docs'));
const ImagePaletteExtractor = React.lazy(() => import('./components/features/ImagePaletteExtractor/ImagePaletteExtractor'));
const PaletteGenerator = React.lazy(() => import('./components/features/PaletteGenerator/PaletteGenerator'));
const ColorBlindnessTest = React.lazy(() => import('./components/features/ColorBlindnessTest/ColorBlindnessTest'));
const ColorPsychology = React.lazy(() => import('./components/features/ColorPsychology/ColorPsychology'));
const TextChecker = React.lazy(() => import('./components/features/TextChecker/TextChecker'));
const ColorObjectDetector = React.lazy(() => import('./components/features/ColorObjectDetector/ColorObjectDetector'));
const ImageRecolor = React.lazy(() => import('./components/features/ImageRecolor/ImageRecolor'));

// Per-route Suspense wrappers: skeleton + page transition
const withSkeleton = (Component, variant = 'generic') => (
    <React.Suspense fallback={<PageSkeleton variant={variant} />}>
        <PageTransition>
            <Component />
        </PageTransition>
    </React.Suspense>
);

// Inner layout — needs useLocation for AnimatePresence keying
function AnimatedRoutes({ showConfigWarning, setShowConfigWarning }) {
    const location = useLocation();
    return (
        <>
            {showConfigWarning && (
                <div className="bg-yellow-600/20 border-b border-yellow-600/50 text-yellow-800 dark:text-yellow-200 p-4 sticky top-0 z-50 flex justify-between items-center backdrop-blur-xl">
                    <div>
                        <p className="font-bold">✅ Firebase Configured</p>
                        <p className="text-sm">Your website is ready to use!</p>
                    </div>
                    <button onClick={() => setShowConfigWarning(false)} className="text-current hover:opacity-70 ml-4 p-1">
                        <FaTimes size={20} />
                    </button>
                </div>
            )}
            <Header />
            <div className="flex-grow hide-on-mobile-nav">
                <AnimatePresence mode="wait" initial={false}>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
                        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                        <Route path="/simulator" element={withSkeleton(Simulator, 'simulator')} />
                        <Route path="/checker" element={withSkeleton(ContrastChecker, 'checker')} />
                        <Route path="/color-picker" element={withSkeleton(ColorPicker, 'color-picker')} />
                        <Route path="/palette-checker" element={withSkeleton(PaletteChecker, 'palette-checker')} />
                        <Route path="/traffic-signal" element={withSkeleton(TrafficSignalDetector, 'traffic-signal')} />
                        <Route path="/color-history" element={withSkeleton(ColorHistory, 'generic')} />
                        <Route path="/palette-extractor" element={withSkeleton(ImagePaletteExtractor, 'checker')} />
                        <Route path="/palette-generator" element={withSkeleton(PaletteGenerator, 'checker')} />
                        <Route path="/color-test" element={withSkeleton(ColorBlindnessTest, 'generic')} />
                        <Route path="/color-psychology" element={withSkeleton(ColorPsychology, 'generic')} />
                        <Route path="/text-checker" element={withSkeleton(TextChecker, 'checker')} />
                        <Route path="/color-object-detector" element={withSkeleton(ColorObjectDetector, 'generic')} />
                        <Route path="/image-recolor" element={withSkeleton(ImageRecolor, 'generic')} />

                        {/* Resources Routes */}
                        <Route path="/docs" element={<PageTransition><Docs /></PageTransition>} />
                        <Route path="/api" element={<InfoPage title="API Reference" category="Resources" />} />
                        <Route path="/blog" element={<InfoPage title="Latest News & Blog" category="Resources" />} />
                        <Route path="/community" element={<InfoPage title="Community Forum" category="Resources" />} />

                        {/* Company Routes */}
                        <Route path="/careers" element={<InfoPage title="Careers at VisionAid" category="Company" />} />
                        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                        <Route path="/press" element={<InfoPage title="Press Kit" category="Company" />} />

                        {/* Legal Routes */}
                        <Route path="/privacy" element={<InfoPage title="Privacy Policy" category="Legal" type="legal" />} />
                        <Route path="/terms" element={<InfoPage title="Terms of Service" category="Legal" type="legal" />} />
                        <Route path="/cookies" element={<InfoPage title="Cookie Policy" category="Legal" type="legal" />} />
                        <Route path="/license" element={<InfoPage title="License Information" category="Legal" type="legal" />} />

                        <Route path="*" element={
                            <PageTransition>
                                <div className="flex items-center justify-center min-h-[80vh] px-4">
                                    <div className="text-center max-w-lg">
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.5 }}
                                            className="relative mb-8 flex justify-center"
                                        >
                                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full" />
                                            <h1 className="text-8xl sm:text-9xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 drop-shadow-sm mb-4 relative z-10">
                                                404
                                            </h1>
                                        </motion.div>
                                        <h2 className="text-3xl font-bold mb-4">Lost Your Way?</h2>
                                        <p className="text-gray-500 dark:text-gray-400 mb-10 text-lg leading-relaxed">
                                            We couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
                                        </p>
                                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                                            <a href="/" className="px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-500/30">
                                                Go to Homepage
                                            </a>
                                            <a href="/color-picker" className="px-8 py-3.5 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl hover:border-blue-500/50 transition-all font-bold group">
                                                Open Tools <span className="inline-block ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </PageTransition>
                        } />
                    </Routes>
                </AnimatePresence>
            </div>
            <MobileBottomNav />
            <Footer />
        </>
    );
}

function App() {
    const [showConfigWarning, setShowConfigWarning] = useState(!isConfigValid);

    return (
        <ErrorBoundary>
            <Router>
                <ScrollToTop />
                <NotificationProvider>
                    <AuthProvider>
                        <SettingsProvider>
                            <ColorHistoryProvider>
                                <ThemeProvider>
                                    <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-gray-950 bg-gray-50 text-gray-900 dark:text-white">
                                        <ScrollProgressBar />
                                        <VisionFilters />
                                        <VisionOnboardingModal />
                                        <AnimatedRoutes
                                            showConfigWarning={showConfigWarning}
                                            setShowConfigWarning={setShowConfigWarning}
                                        />
                                    </div>
                                </ThemeProvider>
                            </ColorHistoryProvider>
                        </SettingsProvider>
                    </AuthProvider>
                </NotificationProvider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
