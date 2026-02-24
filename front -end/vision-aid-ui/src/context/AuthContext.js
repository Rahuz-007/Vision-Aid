import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider, isConfigValid } from '../config/firebase';
import vaToast from '../utils/toast';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API_BASE = process.env.REACT_APP_API_URL || '';

// ─── Token helpers ─────────────────────────────────────────────────────────────
const getStoredToken = () => localStorage.getItem('token');
const getStoredRefreshToken = () => localStorage.getItem('refreshToken');
const storeTokens = (token, refreshToken) => {
    if (token) localStorage.setItem('token', token);
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
};

/**
 * Parse the JWT payload without verifying signature (client-side only).
 * Returns null if invalid.
 */
const parseJwt = (token) => {
    try {
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(base64));
    } catch {
        return null;
    }
};

/**
 * Returns true if the JWT is expired or expires in the next 60 seconds.
 */
const isTokenExpiringSoon = (token) => {
    if (!token) return true;
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return true;
    const expiresAt = payload.exp * 1000; // ms
    return Date.now() > expiresAt - 60_000; // refresh 60s before expiry
};

/**
 * Attempt a silent token refresh using the stored refresh token.
 * Returns new access token on success, null on failure.
 */
const silentRefresh = async () => {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!res.ok) {
            clearTokens();
            return null;
        }
        const data = await res.json();
        if (data.success && data.data.token) {
            storeTokens(data.data.token, data.data.refreshToken);
            return data.data.token;
        }
        return null;
    } catch {
        return null;
    }
};

/**
 * Get a valid access token, refreshing silently if needed.
 * Call this before any authenticated API request.
 */
export const getValidToken = async () => {
    const token = getStoredToken();
    if (!isTokenExpiringSoon(token)) return token;
    return await silentRefresh();
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const refreshTimerRef = useRef(null);

    // ─── Schedule proactive silent refresh ──────────────────────────────────
    const scheduleRefresh = useCallback((token) => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        if (!token) return;
        const payload = parseJwt(token);
        if (!payload?.exp) return;
        const msUntilRefresh = (payload.exp * 1000) - Date.now() - 60_000;
        if (msUntilRefresh <= 0) {
            silentRefresh().then(newToken => newToken && scheduleRefresh(newToken));
            return;
        }
        refreshTimerRef.current = setTimeout(async () => {
            const newToken = await silentRefresh();
            if (newToken) scheduleRefresh(newToken);
            else {
                clearTokens();
                vaToast.error('Session expired. Please sign in again.');
            }
        }, msUntilRefresh);
    }, []);

    // ─── Firebase state listener ─────────────────────────────────────────────
    useEffect(() => {
        if (!auth?.onAuthStateChanged) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    // ─── Start proactive token refresh on mount if token exists ─────────────
    useEffect(() => {
        const token = getStoredToken();
        if (token) scheduleRefresh(token);
        return () => {
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        };
    }, [scheduleRefresh]);

    const checkConfig = () => {
        if (!isConfigValid) {
            vaToast.error('Authentication is not configured. Please set up your .env file.');
            return false;
        }
        return true;
    };

    const saveUserToFirestore = async (user, additionalData = {}) => {
        if (!db) return;
        const userRef = doc(db, 'users', user.uid);
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || additionalData.displayName || 'User',
                photoURL: user.photoURL || null,
                lastLogin: serverTimestamp(),
                createdAt: user.metadata.creationTime,
                ...additionalData,
            }, { merge: true });
        } catch (error) {
            console.error('Error saving user to Firestore:', error);
        }
    };

    const syncWithBackend = async (firebaseUser) => {
        try {
            const idToken = await firebaseUser.getIdToken();
            const res = await fetch(`${API_BASE}/api/auth/firebase-login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken }),
            });
            const data = await res.json();
            if (data.success) {
                storeTokens(data.data.token, data.data.refreshToken);
                scheduleRefresh(data.data.token);
            }
        } catch (err) {
            console.warn('Backend sync skipped (server might be offline):', err.message);
        }
    };

    const loginWithGoogle = async () => {
        if (!checkConfig()) return;
        try {
            const result = await signInWithPopup(auth, googleProvider);
            vaToast.success(`Welcome ${result.user.displayName}!`);
            await saveUserToFirestore(result.user);
            syncWithBackend(result.user); // fire-and-forget
            return result.user;
        } catch (error) {
            vaToast.error(error.message);
            throw error;
        }
    };

    const loginWithGithub = async () => {
        if (!checkConfig()) return;
        try {
            const result = await signInWithPopup(auth, githubProvider);
            vaToast.success(`Welcome ${result.user.displayName || 'User'}!`);
            await saveUserToFirestore(result.user);
            syncWithBackend(result.user);
            return result.user;
        } catch (error) {
            vaToast.error(error.message);
            throw error;
        }
    };

    const loginWithEmail = async (email, password) => {
        if (!checkConfig()) return;
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            vaToast.success('Welcome back!');
            await saveUserToFirestore(result.user);
            syncWithBackend(result.user);
            return result.user;
        } catch (error) {
            vaToast.error(error.message);
            throw error;
        }
    };

    const signupWithEmail = async (email, password, name) => {
        if (!checkConfig()) return;
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (name) await updateProfile(result.user, { displayName: name });

            // Send Firebase email verification
            await sendEmailVerification(result.user);

            vaToast.success(`Account created! Please check your email to verify your account.`);
            await saveUserToFirestore(result.user, { displayName: name });
            syncWithBackend(result.user);
            return result.user;
        } catch (error) {
            vaToast.error(error.message);
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        if (!checkConfig()) return;
        try {
            await sendPasswordResetEmail(auth, email);
            vaToast.success('Password reset email sent! Check your inbox.');
        } catch (error) {
            vaToast.error(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (currentUser) {
                // Invalidate backend refresh token
                const token = getStoredToken();
                if (token) {
                    fetch(`${API_BASE}/api/auth/logout`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` },
                    }).catch(() => { });
                }
            }
            clearTokens();
            if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
            await signOut(auth);
            vaToast.success('Logged out successfully');
        } catch (error) {
            vaToast.error('Failed to log out');
        }
    };

    const refreshProfile = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload();
            setCurrentUser({ ...auth.currentUser });
        }
    };

    const value = {
        currentUser,
        loading,
        loginWithGoogle,
        loginWithGithub,
        loginWithEmail,
        signupWithEmail,
        forgotPassword,
        logout,
        refreshProfile,
        getValidToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
