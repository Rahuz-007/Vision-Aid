# Quick Start: Firebase OAuth Setup

## 1. Create Firebase Project
→ Go to https://console.firebase.google.com/
→ Click "Add project" → Name it → Create

## 2. Add Web App
→ Click Web icon `</>` → Register app → Copy config

## 3. Update .env File
```env
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

## 4. Enable Google OAuth
→ Firebase Console → Authentication → Sign-in method
→ Enable Google → Select support email → Save

## 5. Enable GitHub OAuth

### A. Create GitHub OAuth App
→ https://github.com/settings/developers
→ New OAuth App → Fill details
→ Homepage: `http://localhost:3000`
→ **Wait! Get callback URL from Firebase first ↓**

### B. Get Firebase Callback URL
→ Firebase → Authentication → Sign-in method
→ Click GitHub → Enable → Copy callback URL

### C. Finish GitHub App
→ Paste callback URL → Register
→ Generate client secret → Copy both ID and secret

### D. Configure Firebase
→ Paste Client ID and Secret in Firebase
→ Save

## 6. Restart Server
```bash
npm start
```

## Done! 🎉
Test by clicking "Sign In" button in your app.

---

**Full Guide:** See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.
