import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider, isConfigValid } from '../config/firebase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading] = useState(false);

    useEffect(() => {
        if (!auth || !auth.onAuthStateChanged) {
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return unsubscribe;
    }, []);

    const checkConfig = () => {
        if (!isConfigValid) {
            const msg = "Authentication is not configured. Please set up your .env file.";
            console.error(msg);
            toast.error(msg);
            return false;
        }
        return true;
    };

    const saveUserToFirestore = async (user, additionalData = {}) => {
        if (!db) return;
        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || additionalData.displayName || "User",
                photoURL: user.photoURL || null,
                lastLogin: serverTimestamp(),
                createdAt: user.metadata.creationTime,
                ...additionalData
            }, { merge: true });
        } catch (error) {
            console.error("Error saving user to Firestore:", error);
        }
    };

    const loginWithGoogle = async () => {
        if (!checkConfig()) return;
        try {
            const result = await signInWithPopup(auth, googleProvider);
            toast.success(`Welcome ${result.user.displayName}!`);
            await saveUserToFirestore(result.user);

            // Sync with Backend (Non-Blocking / Fire-and-Forget)
            // This prevents the UI from freezing if the backend is slow
            const syncBackend = async () => {
                try {
                    const idToken = await result.user.getIdToken();
                    const response = await fetch('http://localhost:3001/api/auth/firebase-login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: idToken })
                    });
                    const data = await response.json();
                    if (data.success) {
                        localStorage.setItem('token', data.data.token);
                        console.log('Backend Sync Success');
                    }
                } catch (backendError) {
                    // Silent fail or warning - doesn't stop user from using app
                    console.warn('Backend Sync skipped (Server might be offline):', backendError);
                }
            };
            syncBackend();

            return result.user;
        } catch (error) {
            console.error("Google Login Error:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const loginWithGithub = async () => {
        if (!checkConfig()) return;
        try {
            const result = await signInWithPopup(auth, githubProvider);
            toast.success(`Welcome ${result.user.displayName || 'User'}!`);
            await saveUserToFirestore(result.user);
            return result.user;
        } catch (error) {
            console.error("Github Login Error:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const loginWithEmail = async (email, password) => {
        if (!checkConfig()) return;
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            toast.success(`Welcome back!`);
            await saveUserToFirestore(result.user);
            return result.user;
        } catch (error) {
            console.error("Email Login Error:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const signupWithEmail = async (email, password, name) => {
        if (!checkConfig()) return;
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            if (name) {
                await updateProfile(result.user, {
                    displayName: name
                });
                result.user.displayName = name;
            }
            toast.success(`Account created! Welcome ${name || 'User'}!`);
            await saveUserToFirestore(result.user, { displayName: name });
            return result.user;
        } catch (error) {
            console.error("Signup Error:", error);
            toast.error(error.message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const value = {
        currentUser,
        loginWithGoogle,
        loginWithGithub,
        loginWithEmail,
        signupWithEmail,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
