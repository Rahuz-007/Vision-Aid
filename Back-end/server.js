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

const passport = require('passport');
require('./config/passport');

const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');
const trafficSignalRoutes = require('./routes/traffic-signal');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// Production CORS configuration
const corsOptions = {
  origin: IS_PRODUCTION 
    ? (process.env.FRONTEND_URL || 'https://yourdomain.com').split(',').map(url => url.trim())
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000', 'http://127.0.0.1:3001'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Security headers
app.use(helmet({
  contentSecurityPolicy: IS_PRODUCTION ? {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    }
  } : false,
  hsts: IS_PRODUCTION ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));

app.use(cors(corsOptions));


// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: IS_PRODUCTION ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 attempts per 15 minutes for auth
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: IS_PRODUCTION, // require HTTPS in production
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));


app.use(passport.initialize());



const { db } = require('./services/firebase');
console.log('Firestore initialized');


// Request logging
app.use((req, res, next) => {
  if (!IS_PRODUCTION) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Vision Aid API is running',
    version: '1.0.0',
    environment: NODE_ENV
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/traffic-signal', trafficSignalRoutes);


app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    services: {
      database: 'connected (firebase)'
    }
  });
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Error handling middleware (must be last)
app.use((error, req, res, next) => {
  console.error('Error:', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB' });
    }
    return res.status(400).json({ error: error.message });
  }

  // Don't expose error details in production
  const errorMessage = IS_PRODUCTION 
    ? 'Internal server error' 
    : error.message || 'Internal server error';
  
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({ error: errorMessage });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`[${NODE_ENV.toUpperCase()}] Server is running on port ${PORT}`);
  console.log(`YOLO Service URL: ${process.env.YOLO_SERVICE_URL || 'http://localhost:5000'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
