import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaTimes, FaEnvelope, FaUser, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const LoginModal = ({ isOpen, onClose }) => {
    const { loginWithGoogle, loginWithEmail, signupWithEmail } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isSignUp) {
                await signupWithEmail(email, password, name);
            } else {
                await loginWithEmail(email, password);
            }
            onClose();
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            await loginWithGoogle();
            onClose();
        } catch (error) {
            // Error handled in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-3xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 border-t-white/20"
                    >
                        {/* Decorative Background Elements */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/30 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/30 rounded-full blur-[100px]" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors z-10 rounded-full hover:bg-white/10"
                        >
                            <FaTimes size={18} />
                        </button>

                        <div className="relative z-10 p-8 sm:p-10">
                            {/* Header Section */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-4 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                                    <FaLock className="text-2xl text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">
                                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                                </h2>
                                <p className="text-blue-200/70 text-sm">
                                    {isSignUp
                                        ? 'Start your journey with VisionAid'
                                        : 'Enter your credentials to access your account'}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {isSignUp && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                <FaUser className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                required={isSignUp}
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-white/20 transition-all outline-none focus:bg-white/10"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider ml-1">Email</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-white/20 transition-all outline-none focus:bg-white/10"
                                            placeholder="you@company.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-blue-200/60 uppercase tracking-wider ml-1">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                            <FaLock className="text-blue-300/50 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-white/20 transition-all outline-none focus:bg-white/10"
                                            placeholder="••••••••"
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex justify-center py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform transition-all active:scale-[0.98] border border-white/10"
                                >
                                    {isLoading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        isSignUp ? 'Create Account' : 'Sign In'
                                    )}
                                </button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                                <span className="text-blue-200/50 text-sm font-medium">OR</span>
                                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent flex-1" />
                            </div>

                            <button
                                disabled={isLoading}
                                onClick={handleGoogleLogin}
                                className="w-full flex items-center justify-center gap-3 p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium text-white transition-all transform active:scale-[0.98] group"
                            >
                                <FaGoogle className="text-white/80 group-hover:text-white transition-colors" size={20} />
                                <span>Continue with Google</span>
                            </button>

                            <p className="mt-8 text-center text-sm text-blue-200/60">
                                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-blue-400 hover:text-blue-300 font-bold transition-colors ml-1 hover:underline decoration-blue-400/30"
                                >
                                    {isSignUp ? 'Log In' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
