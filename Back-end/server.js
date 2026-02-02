const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const session = require('express-session');
require('dotenv').config();

// Passport
const passport = require('passport');
require('./config/passport');

// Import Routes
const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');
const trafficSignalRoutes = require('./routes/traffic-signal');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Session middleware (Required for Passport OAuth)
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Initialize Passport
app.use(passport.initialize());
// passport.session() is not needed if we are stateless JWT, BUT the original code successfully required config/passport via session? 
// Usually if using JWT we don't need sessions, but Google OAuth often uses it for the handshake. 
// I'll leave it simple.

// Database Connection
// Database Connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('Connected to MongoDB successfully'))
//   .catch(err => console.error('MongoDB connection error:', err));
const { db } = require('./services/firebase');
console.log('Firestore initialized');

// Request Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/', (req, res) => res.send('Vision Aid API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/traffic-signal', trafficSignalRoutes);

// Health Check
// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      database: 'connected (firebase)'
    }
  });
});

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ error: error.message });
  }
  res.status(500).json({ error: error.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`YOLO Service URL: ${process.env.YOLO_SERVICE_URL || 'http://localhost:8000'}`);
});

module.exports = app;
