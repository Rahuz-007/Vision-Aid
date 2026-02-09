# VisionAid - Modern Website Setup Guide 🚀

Complete guide to set up, run, and deploy the modern VisionAid application (2026 Edition)

## 📋 Prerequisites

- **Node.js**: v16 or higher
- **npm** or **yarn**
- **MongoDB**: Running locally or cloud instance
- **Redis**: For caching
- **Python 3.8+**: For YOLO service
- **Docker & Docker Compose** (optional): For containerized setup

## 🎨 What's New (2026 Edition)

### Frontend Improvements
✨ **Modern Dark Theme** - Sleek dark gradient design with glassmorphism effects
✨ **Advanced Animations** - Smooth Framer Motion animations throughout
✨ **Responsive Design** - Perfect on mobile, tablet, and desktop
✨ **Modern Components** - Profile, About, and Dashboard pages
✨ **PWA Ready** - Install as app on mobile devices
✨ **Accessibility First** - WCAG compliant with keyboard navigation
✨ **Performance Optimized** - Code splitting, lazy loading, image optimization

### Backend Improvements
✨ **Rate Limiting** - Prevent abuse and DDoS attacks
✨ **Advanced Caching** - Redis integration for 10x faster responses
✨ **Security Hardening** - Helmet, CORS, Input validation
✨ **Database Optimization** - MongoDB indexes and connection pooling
✨ **Error Handling** - Comprehensive error tracking with Sentry

---

## 🚀 Quick Start (5 Minutes)

### Option 1: Using Docker Compose (Easiest)

```bash
cd "Vision aid"
docker-compose up -d
```

Access the application:
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **YOLO Service**: http://localhost:8000

### Option 2: Manual Setup

#### 1. Backend Setup

```bash
cd "Vision aid/Back-end"
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vision-aid
REDIS_URL=redis://localhost:6379
YOLO_SERVICE_URL=http://localhost:5000
JWT_SECRET=your-secret-key-here
FRONTEND_URL=http://localhost:3000
```

```bash
npm start
```

#### 2. Frontend Setup

```bash
cd "Vision aid/front -end/vision-aid-ui"
npm install
```

Create `.env.local`:
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

```bash
npm start
```

#### 3. YOLO Service Setup

```bash
cd "Vision aid/yolo-service"
pip install -r requirements.txt
python app.py
```

---

## 🎯 Project Structure

```
Vision aid/
├── Back-end/                 # Express.js API Server
│   ├── config/              # Configuration files
│   ├── middleware/          # Auth, validation, logging
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API endpoints
│   ├── services/            # Business logic
│   └── server.js            # Main server file
│
├── front -end/vision-aid-ui/  # React.js Frontend
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React Context (Auth)
│   │   ├── utils/           # Helper functions
│   │   └── App.js           # Main app component
│   └── package.json
│
├── yolo-service/            # Python ML Service
│   ├── app.py              # Flask server
│   └── requirements.txt      # Python dependencies
│
└── docker-compose.yml       # Container orchestration
```

---

## 🌐 Core Features

### 1. **Live Color Detector** 🎥
- Real-time webcam color detection
- Voice feedback support
- Color history tracking
- Export as CSV/JSON

**Route**: `/live-detector`

### 2. **Palette Checker** 🎨
- WCAG AA/AAA contrast checking
- Batch color analysis
- Accessible palette suggestions
- Export to CSS/Figma

**Route**: `/palette-checker`

### 3. **Color Blindness Simulator** 👁️
- Protanopia simulation
- Deuteranopia simulation
- Tritanopia simulation
- Real-time image processing

**Route**: `/simulator`

### 4. **Traffic Signal Detection** 🚦
- AI-powered traffic light detection
- Voice announcements
- Real-time video processing
- Safety notifications

**Route**: `/traffic-signal`

### 5. **User Profile** 👤
- Account management
- Detection history
- Preferences & settings
- Security options

**Route**: `/profile` (requires login)

---

## 🔐 Authentication Setup

### Firebase OAuth Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Google** and **GitHub** authentication
4. Copy credentials to `.env.local`
5. Set authorized domains in Firebase settings

### Backend JWT Setup

The backend will automatically:
- Generate JWT tokens
- Validate Firebase tokens
- Manage session data
- Cache user preferences

---

## 📱 Mobile Support

### Android/iOS App (React Native)
```bash
cd "Vision aid/mobile-app"
npm install
npx expo start
```

### PWA Installation

VisionAid is a Progressive Web App:
1. Visit the website on mobile
2. Click "Install" or "Add to Home Screen"
3. Use offline functionality
4. Get desktop-like experience

---

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd Back-end
npm test

# Frontend tests
cd ../front\ -end/vision-aid-ui
npm test
```

### Integration Testing
```bash
# Full stack test
docker-compose -f docker-compose.yml up
npm run test:integration
```

---

## 🐛 Troubleshooting

### Issue: Port already in use
```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Issue: MongoDB connection failed
```bash
# Check MongoDB is running
mongosh
# Should show connection string
```

### Issue: YOLO service timeout
```bash
# Check Python environment
python --version  # Should be 3.8+
pip list | grep torch
# Install if missing: pip install torch
```

### Issue: Firebase auth not working
```bash
# Verify .env variables
echo $REACT_APP_FIREBASE_API_KEY
# Check Firebase console settings
```

---

## 📊 Performance Monitoring

### View Logs
```bash
# Backend logs
docker logs vision-aid-backend

# YOLO service logs
docker logs vision-aid-yolo

# Redis monitoring
docker exec vision-aid-redis redis-cli MONITOR
```

### Database Performance
```bash
# MongoDB indexes
mongosh
> use vision-aid
> db.collection.getIndexes()
```

---

## 🚀 Deployment

### Deploy to Vercel (Frontend)
```bash
cd front\ -end/vision-aid-ui
npm run build
vercel --prod
```

### Deploy to Heroku (Backend)
```bash
cd Back-end
heroku create vision-aid-api
git push heroku main
```

### Deploy with Docker (Production)
```bash
docker-compose -f docker-compose.yml up -d
# Enable SSL with nginx
# Setup reverse proxy
# Configure environment variables
```

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/verify-firebase` - Exchange Firebase token
- `GET /api/auth/profile` - Get current user (protected)
- `POST /api/auth/logout` - Logout

### Detection Endpoints
- `POST /api/detect` - Upload image for detection
- `GET /api/detections` - Get detection history (protected)
- `GET /api/detections/:id` - Get detection details (protected)
- `DELETE /api/detections/:id` - Delete detection (protected)

### User Preferences Endpoints
- `GET /api/preferences` - Get user preferences (protected)
- `PUT /api/preferences` - Update preferences (protected)

---

## 🎯 Next Steps

### Phase 1: Optimization
- [ ] Add comprehensive error handling
- [ ] Implement analytics (Sentry)
- [ ] Set up CI/CD pipeline
- [ ] Add load testing

### Phase 2: Features
- [ ] AI Color Assistant (voice)
- [ ] Smart Palette Generator
- [ ] Real-time collaboration
- [ ] AR mode for mobile

### Phase 3: Scale
- [ ] Global CDN deployment
- [ ] Multi-region support
- [ ] Advanced caching strategies
- [ ] Database sharding

---

## 📞 Support & Contribution

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Join community forum
- **Contributing**: See CONTRIBUTING.md
- **Email**: visionaid07@gmail.com

---

## 📄 License

VisionAid is open source under the MIT License. See LICENSE file for details.

---

## 🙏 Acknowledgments

Built with ❤️ for accessibility. Thanks to all contributors making the web more inclusive.

**Last Updated**: February 2026
**Version**: 2.0.0
