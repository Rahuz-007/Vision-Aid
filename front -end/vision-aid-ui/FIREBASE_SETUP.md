# Firebase OAuth Setup Guide for VisionAid

This guide will help you set up GitHub and Google OAuth authentication for the VisionAid application using Firebase.

## Prerequisites

- A Google account
- A GitHub account (for GitHub OAuth)
- Node.js and npm installed

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "VisionAid")
4. Accept the Firebase terms and click **"Continue"**
5. (Optional) Enable Google Analytics or skip it
6. Click **"Create project"**
7. Wait for the project to be created, then click **"Continue"**

## Step 2: Register Your Web App

1. In the Firebase Console, click on the **Web icon** (`</>`) to add a web app
2. Enter an app nickname (e.g., "VisionAid Web")
3. (Optional) Check "Also set up Firebase Hosting" if you plan to deploy with Firebase
4. Click **"Register app"**
5. You'll see your Firebase configuration code - **keep this page open**, you'll need it soon

## Step 3: Get Your Firebase Configuration

From the Firebase configuration screen, copy the values. They will look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## Step 4: Update Your .env File

1. Open the `.env` file in your project root directory
2. Replace the placeholder values with your actual Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. Save the file

## Step 5: Enable Google Authentication

1. In the Firebase Console, navigate to **Build** → **Authentication**
2. Click **"Get started"** if this is your first time
3. Go to the **"Sign-in method"** tab
4. Click on **"Google"** from the list of providers
5. Toggle the **"Enable"** switch to ON
6. Select a **Project support email** from the dropdown
7. Click **"Save"**

✅ **Google OAuth is now configured!**

## Step 6: Enable GitHub Authentication

### 6.1: Create a GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"**
4. Fill in the application details:
   - **Application name**: VisionAid (or your app name)
   - **Homepage URL**: `http://localhost:3000` (for development) or your production URL
   - **Authorization callback URL**: Get this from Firebase (see next step)
5. **DON'T SUBMIT YET** - you need the callback URL from Firebase first

### 6.2: Get the Firebase GitHub Callback URL

1. Go back to the Firebase Console → **Authentication** → **Sign-in method**
2. Click on **"GitHub"** from the list of providers
3. Toggle the **"Enable"** switch to ON
4. Copy the **"Authorization callback URL"** (it will look like: `https://your-project-id.firebaseapp.com/__/auth/handler`)
5. **Keep this page open** - you'll need it in a moment

### 6.3: Complete GitHub OAuth App Setup

1. Go back to the GitHub OAuth App creation page
2. Paste the Firebase callback URL into **"Authorization callback URL"**
3. Click **"Register application"**
4. You'll see your **Client ID** and can generate a **Client Secret**
5. Click **"Generate a new client secret"**
6. Copy both the **Client ID** and **Client Secret** (you won't be able to see the secret again!)

### 6.4: Configure Firebase with GitHub Credentials

1. Go back to the Firebase Console → **Authentication** → **Sign-in method** → **GitHub**
2. Paste your **GitHub Client ID** into the "Client ID" field
3. Paste your **GitHub Client Secret** into the "Client secret" field
4. Click **"Save"**

✅ **GitHub OAuth is now configured!**

## Step 7: Add Authorized Domains

1. In Firebase Console → **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"**
3. Make sure `localhost` is in the list (it should be by default)
4. When you deploy to production, add your production domain here

## Step 8: Restart Your Development Server

Since you've updated the `.env` file, you need to restart your app:

1. Stop the running development server (Ctrl+C)
2. Start it again: `npm start`

## Step 9: Test the Authentication

1. Open your app in the browser (`http://localhost:3000`)
2. Click the **"Sign In"** button
3. Try signing in with **Google**:
   - A popup should appear with Google's login screen
   - Sign in with your Google account
   - You should be redirected back to the app and see your profile
4. Log out and try **GitHub**:
   - Click "Sign In" again
   - Click "Continue with GitHub"
   - Authorize the app
   - You should see your GitHub profile

## Troubleshooting

### "Popup blocked" error
- Allow popups for your app in your browser settings
- The error message will guide you

### "Configuration error" or missing Firebase config
- Double-check all values in your `.env` file
- Make sure there are no extra spaces or quotes
- Restart the development server after changing `.env`

### GitHub OAuth "Redirect URI mismatch" error
- Make sure the callback URL in your GitHub OAuth app exactly matches the one from Firebase
- The URL is case-sensitive

### "auth/unauthorized-domain" error
- Add your domain to the authorized domains list in Firebase Authentication settings

## Security Best Practices

1. **Never commit your `.env` file** - It's already in `.gitignore`, keep it that way
2. **Use environment variables** for production - Set these in your hosting platform
3. **Restrict API keys** in Firebase Console → Project Settings → API keys (recommended for production)
4. **Monitor usage** in Firebase Console to detect unusual activity

## Production Deployment

When deploying to production:

1. Update the **Homepage URL** in your GitHub OAuth App
2. Add the **Authorization callback URL** for production
3. Add your **production domain** to Firebase authorized domains
4. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
5. Consider setting up **Firebase App Check** for additional security

## Need Help?

- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [GitHub OAuth Apps Docs](https://docs.github.com/en/apps/oauth-apps)
- [Firebase Console](https://console.firebase.google.com/)

---

🎉 **Congratulations!** Your OAuth authentication is now set up and ready to use!
