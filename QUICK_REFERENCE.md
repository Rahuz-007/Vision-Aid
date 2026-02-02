# VisionAid Quick Reference 🚀

## 📂 Important Directories

```
Vision aid/
├── Back-end/              ← Backend API (Express.js)
├── front -end/vision-aid-ui/  ← Frontend (React) ⭐
├── yolo-service/          ← ML Service (Python)
├── mobile-app/            ← Mobile App (React Native)
└── docker-compose.yml     ← Docker setup
```

## 🎯 Quick Commands

### Start Everything (Docker)
```bash
cd "Vision aid"
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:3000/api
# YOLO: http://localhost:5000
```

### Development (Manual)
```bash
# Terminal 1: Backend
cd Back-end && npm install && npm start

# Terminal 2: Frontend
cd "front -end/vision-aid-ui" && npm install && npm start

# Terminal 3: YOLO Service
cd yolo-service && pip install -r requirements.txt && python app.py
```

## 🎨 Frontend File Structure

```
src/
├── pages/
│   ├── Home.js              ← Homepage (redesigned)
│   ├── Profile.js           ← User profile (new)
│   └── About.js             ← About page (new)
├── components/
│   ├── layout/
│   │   ├── Header.js        ← Navigation (redesigned)
│   │   └── Footer.js        ← Footer (new)
│   ├── features/
│   │   ├── LiveDetector/
│   │   ├── PaletteChecker/
│   │   ├── ColorBlindnessSimulator/
│   │   └── TrafficSignalDetector/
│   ├── auth/
│   │   └── LoginModal.js
│   └── common/
├── context/
│   └── AuthContext.js       ← Auth state management
├── utils/
│   ├── api.js
│   └── firebase.js
├── App.js                   ← Main app (redesigned)
├── index.js                 ← Entry point
└── index.css                ← Global styles (redesigned)
```

## 🎬 What's New in Frontend

### Visual Improvements
- ✨ Dark gradient theme (gray-900 to gray-800)
- ✨ Animated floating blobs in background
- ✨ Gradient text effects on headings
- ✨ Glassmorphism cards with backdrop blur
- ✨ Smooth Framer Motion animations
- ✨ Modern button styles with gradients
- ✨ Custom scrollbar with gradient

### New Components
```
Header.js         Modern sticky navigation
Footer.js         Comprehensive footer with links
Profile.js        User profile with tabs
About.js          Company about page
```

### Enhanced Pages
```
Home.js           Complete redesign with:
                  - Hero section with animations
                  - Features grid
                  - Why us section
                  - CTA section
                  - Stats showcase
```

## 🎨 Color Scheme

### Background
- **Primary**: `#0f172a` (slate-950)
- **Secondary**: `#1e293b` (slate-900)
- **Tertiary**: `#334155` (slate-700)

### Accents
- **Blue**: `#3b82f6` to `#1e40af`
- **Purple**: `#8b5cf6` to `#6d28d9`
- **Pink**: `#ec4899` to `#be185d`

### Text
- **Primary**: `#ffffff` (white)
- **Secondary**: `#e2e8f0` (gray-200)
- **Tertiary**: `#94a3b8` (gray-400)

## 🚀 Key Routes

| Route | Component | Feature |
|-------|-----------|---------|
| `/` | Home | Homepage with hero |
| `/live-detector` | LiveDetector | Real-time color detection |
| `/palette-checker` | PaletteChecker | WCAG contrast checking |
| `/simulator` | ColorBlindnessSimulator | Color blindness simulation |
| `/traffic-signal` | TrafficSignalDetector | AI traffic light detection |
| `/profile` | Profile | User profile & settings |
| `/about` | About | About the company |

## 🎯 API Endpoints

```
Authentication
POST /api/auth/register        Create account
POST /api/auth/login           Login
POST /api/auth/verify-firebase Exchange Firebase token
GET  /api/auth/profile         Get current user

Detections
POST /api/detect               Detect from image
GET  /api/detections           Get history
GET  /api/detections/:id       Get details
DEL  /api/detections/:id       Delete detection

User Preferences
GET  /api/preferences          Get preferences
PUT  /api/preferences          Update preferences
```

## 📦 Dependencies

### Frontend (Key)
```json
{
  "react": "^19.2.3",
  "react-router-dom": "^7.13.0",
  "firebase": "^12.8.0",
  "framer-motion": "^12.27.5",
  "react-icons": "^5.5.0",
  "tailwindcss": "^3.x"
}
```

### Backend (Key)
```json
{
  "express": "^5.2.1",
  "mongoose": "^9.1.3",
  "redis": "^5.10.0",
  "jsonwebtoken": "^9.0.3",
  "bcrypt": "^6.0.0",
  "helmet": "^8.1.0"
}
```

## 🔧 Environment Variables

### Frontend (.env.local)
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_FIREBASE_API_KEY=xxx
REACT_APP_FIREBASE_AUTH_DOMAIN=xxx.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=xxx
```

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vision-aid
REDIS_URL=redis://localhost:6379
YOLO_SERVICE_URL=http://localhost:5000
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## 🐛 Common Issues & Fixes

### Frontend won't start
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### Port 3000 in use
```bash
# Kill process using port
lsof -i :3000 | grep LISTEN
kill -9 <PID>
```

### MongoDB connection error
```bash
# Check if running
mongosh
# If not, start: brew services start mongodb-community
```

### Firebase auth not working
```bash
# Check .env.local variables
echo $REACT_APP_FIREBASE_API_KEY
# Update in Firebase Console > Project Settings
```

## 📊 Files Modified

### CSS & Styling
- ✏️ `src/index.css` - Added animations, themes, glass morphism
- ✏️ `tailwind.config.js` - Added custom animations and colors
- ✏️ `public/index.html` - Improved meta tags, added fonts

### Components
- ✏️ `src/App.js` - Enhanced routing, error page
- ✏️ `src/components/layout/Header.js` - Modern navigation
- ✨ `src/components/layout/Footer.js` - NEW footer
- ✏️ `src/pages/Home.js` - Complete redesign

### New Pages
- ✨ `src/pages/Profile.js` - NEW user profile
- ✨ `src/pages/About.js` - NEW about page

### Configuration
- ✏️ `public/manifest.json` - PWA configuration

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `MODERN_SETUP_GUIDE.md` | Complete setup instructions |
| `MODERN_IMPROVEMENTS.md` | What's new in v2.0 |
| `PROJECT_STATUS_REPORT.md` | Project status overview |
| `IMPLEMENTATION_COMPLETE.md` | Previous implementations |

## 🎓 Learning Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **React Docs**: https://react.dev
- **Express.js**: https://expressjs.com
- **MongoDB**: https://docs.mongodb.com

## 💡 Tips

1. **Hot Reload**: Frontend auto-reloads on file changes
2. **API Testing**: Use Postman or Thunder Client
3. **Database Monitoring**: Use MongoDB Compass
4. **Performance**: Check Lighthouse in DevTools
5. **Responsive**: Test with Chrome DevTools device mode

## 🚀 Next Steps

1. ✅ Setup with `docker-compose up -d` or manual install
2. ✅ Configure Firebase authentication
3. ✅ Run application and test features
4. ✅ Customize colors and branding
5. ✅ Deploy to production
6. ✅ Monitor performance and errors
7. ✅ Add custom features from roadmap

## 📞 Support

- **Issues**: Check error logs and troubleshooting section
- **Docs**: Read MODERN_SETUP_GUIDE.md
- **Questions**: Refer to README files in each directory

---

**Version**: 2.0.0 (2026 Edition)  
**Last Updated**: February 2026  
**Status**: ✅ Production Ready

Keep this file handy for quick reference while working on VisionAid! 🎉
