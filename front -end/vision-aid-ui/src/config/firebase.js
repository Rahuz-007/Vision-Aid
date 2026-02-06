import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    GithubAuthProvider,
    browserLocalPersistence,
    setPersistence
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Check if config is valid
const isConfigValid = !!(firebaseConfig.apiKey && firebaseConfig.authDomain);

let app;
let auth;
let db;
let googleProvider;
let githubProvider;

if (isConfigValid) {
    try {
        // Initialize Firebase
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);

        // Set persistence to local (keeps user logged in after refresh)
        setPersistence(auth, browserLocalPersistence).catch((error) => {
            console.error("Firebase Persistence Error:", error);
        });

        // Configure Providers
        googleProvider = new GoogleAuthProvider();
        githubProvider = new GithubAuthProvider();
    } catch (error) {
        console.error("Firebase Initialization Error:", error);
        // Fallback to mock if init crashes
        auth = getMockAuth();
    }
} else {
    console.warn("Firebase configuration is missing! Check your .env file.");
    auth = getMockAuth();
}

function getMockAuth() {
    return {
        currentUser: null,
        signOut: () => Promise.resolve(),
        onAuthStateChanged: (callback) => {
            callback(null);
            return () => { }; // Unsubscribe function
        }
    };
}

export { auth, db, googleProvider, githubProvider, isConfigValid };
