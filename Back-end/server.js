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

// Validate environment variables before starting server
const { validateEnv } = require('./config/validateEnv');
validateEnv();

const passport = require('passport');
require('./config/passport');

// Logger configuration
const { logger, requestLogger } = require('./config/logger');

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
  secret: process.env.SESSION_SECRET, // Will fail at startup if not set (validateEnv)
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
logger.info('Firestore initialized');


// Request logging with Winston
app.use(requestLogger);

// Prometheus metrics tracking
const { metricsMiddleware, metricsEndpoint } = require('./middleware/metrics');
app.use(metricsMiddleware);
app.get('/metrics', metricsEndpoint);

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



// Health check routes
const healthRoutes = require('./routes/health');
app.use('/', healthRoutes);



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Error handling middleware (must be last)
app.use((error, req, res, next) => {
  logger.error('Request error', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

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
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info('Server started', {
    environment: NODE_ENV.toUpperCase(),
    port: PORT,
    yoloServiceUrl: process.env.YOLO_SERVICE_URL || 'http://localhost:5000',
    frontendUrl: process.env.FRONTEND_URL
  });
});

module.exports = app;
