import React, { Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';
import { ColorHistoryProvider } from './context/ColorHistoryContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import About from './pages/About';
import { isConfigValid } from './config/firebase';
import { FaTimes } from 'react-icons/fa';
import ErrorBoundary from './components/common/ErrorBoundary';
import VisionOnboardingModal from './components/auth/VisionOnboardingModal'; // ADDED

// Lazy load feature pages
const Simulator = React.lazy(() => import('./components/features/ColorBlindnessSimulator/ColorBlindnessSimulator'));
const ContrastChecker = React.lazy(() => import('./components/features/ContrastChecker/ContrastChecker'));
const ColorPicker = React.lazy(() => import('./components/features/ColorPicker/ColorPicker'));

const PaletteChecker = React.lazy(() => import('./components/features/PaletteChecker/PaletteChecker'));
const TrafficSignalDetector = React.lazy(() => import('./components/features/TrafficSignalDetector/TrafficSignalDetector'));
const ColorHistory = React.lazy(() => import('./components/pages/ColorHistory/ColorHistory'));
const InfoPage = React.lazy(() => import('./pages/InfoPage'));

import ScrollToTop from './components/common/ScrollToTop';

function App() {
    const [showConfigWarning, setShowConfigWarning] = useState(!isConfigValid);

    return (
        <ErrorBoundary>
            <Router>
                <ScrollToTop />
                <AuthProvider>
                    <SettingsProvider>
                        <ColorHistoryProvider>
                            <ThemeProvider>
                                <div className="min-h-screen flex flex-col transition-colors duration-300 dark:bg-[#0a0a0a] bg-gray-50 text-gray-900 dark:text-white">
                                    <VisionOnboardingModal /> {/* ADDED ONBOARDING */}
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
                                    <div className="flex-grow">
                                        <Suspense fallback={
                                            <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
                                                <div className="relative w-20 h-20">
                                                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-800 border-t-blue-500"></div>
                                                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-gray-600 animate-pulse">LOADING</div>
                                                </div>
                                            </div>
                                        }>
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/profile" element={<Profile />} />
                                                <Route path="/about" element={<About />} />
                                                <Route path="/simulator" element={<Simulator />} />
                                                <Route path="/checker" element={<ContrastChecker />} />
                                                <Route path="/color-picker" element={<ColorPicker />} />

                                                <Route path="/palette-checker" element={<PaletteChecker />} />
                                                <Route path="/traffic-signal" element={<TrafficSignalDetector />} />
                                                <Route path="/color-history" element={<ColorHistory />} />

                                                {/* Resources Routes */}
                                                <Route path="/docs" element={<InfoPage title="Documentation" category="Resources" />} />
                                                <Route path="/api" element={<InfoPage title="API Reference" category="Resources" />} />
                                                <Route path="/blog" element={<InfoPage title="Latest News & Blog" category="Resources" />} />
                                                <Route path="/community" element={<InfoPage title="Community Forum" category="Resources" />} />

                                                {/* Company Routes */}
                                                <Route path="/careers" element={<InfoPage title="Careers at VisionAid" category="Company" />} />
                                                <Route path="/contact" element={<InfoPage title="Contact Us" category="Company" />} />
                                                <Route path="/press" element={<InfoPage title="Press Kit" category="Company" />} />

                                                {/* Legal Routes */}
                                                <Route path="/privacy" element={<InfoPage title="Privacy Policy" category="Legal" type="legal" />} />
                                                <Route path="/terms" element={<InfoPage title="Terms of Service" category="Legal" type="legal" />} />
                                                <Route path="/cookies" element={<InfoPage title="Cookie Policy" category="Legal" type="legal" />} />
                                                <Route path="/license" element={<InfoPage title="License Information" category="Legal" type="legal" />} />

                                                <Route path="*" element={
                                                    <div className="flex items-center justify-center min-h-[70vh]">
                                                        <div className="text-center px-4">
                                                            <h1 className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 mb-4">404</h1>
                                                            <p className="text-2xl font-bold mb-4">Page Not Found</p>
                                                            <p className="text-gray-500 mb-8">We couldn't find the page you're looking for.</p>
                                                            <a href="/" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-lg shadow-blue-500/30">
                                                                Go Home
                                                            </a>
                                                        </div>
                                                    </div>
                                                } />
                                            </Routes>
                                        </Suspense>
                                    </div>
                                    <Footer />
                                </div>
                            </ThemeProvider>
                        </ColorHistoryProvider>
                    </SettingsProvider>
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}

export default App;
