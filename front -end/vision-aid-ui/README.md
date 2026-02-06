# VisionAid - Color Accessibility Platform

VisionAid is a professional web application that provides comprehensive color detection and accessibility tools. The platform features real-time color identification, WCAG compliance checking, color blindness simulation, and traffic signal detection to help users with visual impairments.

## ✨ Features

- **Live Color Detector**: Real-time color detection from webcam with voice feedback
- **Palette Checker**: WCAG contrast ratio checker for accessibility compliance
- **Color Blindness Simulator**: Visualize different types of color blindness
- **Traffic Signal Detection**: Real-time traffic light detection and voice announcements
- **OAuth Authentication**: Secure login with Google and GitHub
- **Dark Mode**: Fully responsive dark/light theme support
- **Accessibility First**: Built with WCAG guidelines in mind

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Firebase account (for authentication)
- A modern web browser with webcam support

### Installation

1. **Clone the repository**
   ```bash
   cd vision-aid-ui
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase OAuth** (Required for authentication)
   
   See the [OAuth Quick Start Guide](./OAUTH_QUICKSTART.md) or [Full Firebase Setup Guide](./FIREBASE_SETUP.md)
   
   Quick steps:
   - Create a Firebase project at https://console.firebase.google.com/
   - Enable Google and GitHub authentication
   - Copy your Firebase config to `.env` file

4. **Update Environment Variables**
   
   Edit the `.env` file in the project root and add your Firebase credentials:
   ```env
   REACT_APP_FIREBASE_API_KEY=your-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Setup

The application uses Firebase Authentication with OAuth providers:

- **Google OAuth**: Sign in with your Google account
- **GitHub OAuth**: Sign in with your GitHub account

**Important**: You must configure Firebase and OAuth providers before the authentication will work. Follow these guides:

- **Quick Setup**: [OAUTH_QUICKSTART.md](./OAUTH_QUICKSTART.md) (5-10 minutes)
- **Detailed Guide**: [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) (complete instructions)

### Testing Authentication

After setup:
1. Click the "Sign In" button
2. Choose Google or GitHub
3. Complete the OAuth flow
4. You'll see your profile picture and name in the header

## 📱 Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

The page will reload when you make changes. You may also see lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

The build is optimized for best performance, minified, and includes hashes in filenames.

### `npm run eject`

⚠️ **Warning: This is a one-way operation!**

If you need full control over the build configuration, you can `eject` at any time.

## 🛠️ Tech Stack

- **React 19** - UI library
- **Firebase** - Authentication (Google & GitHub OAuth)
- **Framer Motion** - Animations and transitions
- **TailwindCSS** - Utility-first CSS framework
- **React Scripts** - Build tooling
- **Web Speech API** - Voice feedback

## 📂 Project Structure

```
vision-aid-ui/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginModal.js          # OAuth login component
│   │   ├── common/
│   │   │   ├── Settings.js
│   │   │   └── ThemeToggle.js
│   │   ├── features/
│   │   │   ├── ColorBlindnessSimulator/
│   │   │   ├── LiveColorDetector/
│   │   │   ├── PaletteChecker/
│   │   │   └── TrafficSignal/
│   │   ├── home/
│   │   └── layout/
│   │       └── Header.js
│   ├── config/
│   │   └── firebase.js                # Firebase configuration
│   ├── context/
│   │   ├── SettingsContext.js
│   │   └── ThemeContext.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── .env                                # Environment variables (not in git)
├── FIREBASE_SETUP.md                  # Detailed OAuth setup guide
├── OAUTH_QUICKSTART.md                # Quick OAuth reference
└── README.md
```

## 🎨 Features Overview

### Live Color Detector
- Real-time color detection from webcam
- Voice announcements for detected colors
- Color swatch with hex, RGB, and HSL values
- Contrast ratio calculation

### Palette Checker
- Check WCAG contrast ratios between colors
- AA and AAA compliance indicators
- Support for text, large text, and UI components
- Real-time color picker

### Color Blindness Simulator
- Simulate different types of color blindness:
  - Protanopia (Red-blind)
  - Deuteranopia (Green-blind)
  - Tritanopia (Blue-blind)
  - Achromatopsia (Total color blindness)
- Real-time preview with webcam or images

### Traffic Signal Detector
- Real-time traffic light detection
- Voice announcements for signal status
- Designed for visually impaired users
- High accuracy detection

## 🔧 Configuration

### Environment Variables

All configuration is done through the `.env` file:

```env
# Backend API URL (if using backend)
REACT_APP_BACKEND_URL=http://localhost:3000/api/detect

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Development
BROWSER=none  # Don't auto-open browser
```

## 🚀 Deployment

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the 'build' folder via Netlify UI
```

**Important**: Remember to set environment variables in your hosting platform's dashboard!

## 🐛 Troubleshooting

### Authentication Issues

**"Popup blocked" error**
- Allow popups for your site in browser settings

**"Configuration error"**
- Verify all Firebase config values in `.env`
- Restart the dev server after changing `.env`

**"Unauthorized domain" error**
- Add your domain to Firebase Console → Authentication → Settings → Authorized domains

### Webcam Issues

**Camera not working**
- Grant camera permissions when prompted
- Check browser security settings
- Ensure HTTPS in production (required for webcam access)

### Build Issues

**Firebase not defined**
- Make sure `.env` file exists and has all required variables
- Restart the development server

## 📄 License

MIT License - see LICENSE file for details

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions:
- Check the [Firebase Setup Guide](./FIREBASE_SETUP.md)
- Review the [Quick Start Guide](./OAUTH_QUICKSTART.md)
- Open an issue on GitHub

## 🎯 Accessibility

VisionAid is built with accessibility in mind:
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode
- Voice feedback for color detection

---

**Made with ❤️ for accessibility**
