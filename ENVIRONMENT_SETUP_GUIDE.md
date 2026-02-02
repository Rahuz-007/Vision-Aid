# Vision Aid - Production Environment Setup Guide

## Overview
This guide helps you set up all environment variables needed for production deployment.

---

## Backend Environment Variables

### Location
Create file: `Back-end/.env.production`

### Required Variables

#### Server Configuration
```env
# Port to run the backend on
PORT=3000

# Environment mode
NODE_ENV=production
```

#### Database Configuration
```env
# MongoDB Atlas connection string
# Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://username:password@your-cluster.mongodb.net/vision-aid?retryWrites=true&w=majority
```

**How to get MongoDB URI:**
1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Create a database user (Store credentials safely)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `vision-aid`

#### Security Keys
```env
# Generate strong JWT secret (32+ characters)
# Command to generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-64-character-random-hex-string-here

# Generate strong session secret
# Command to generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=your-64-character-random-hex-string-here
```

#### OAuth Configuration (Google)
```env
# Get these from Google Cloud Console
# 1. Go to https://console.cloud.google.com
# 2. Create a new project
# 3. Enable Google+ API
# 4. Create OAuth 2.0 credentials (Web application)
# 5. Add authorized redirect URIs:
#    - http://localhost:3000/api/auth/google/callback (dev)
#    - https://api.yourdomain.com/api/auth/google/callback (production)

GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

#### OAuth Configuration (GitHub)
```env
# Get these from GitHub Settings → Developer settings → OAuth Apps
# 1. Go to https://github.com/settings/developers
# 2. Create a new OAuth App
# 3. Set Authorization callback URL to:
#    - http://localhost:3000/api/auth/github/callback (dev)
#    - https://api.yourdomain.com/api/auth/github/callback (production)

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### URLs Configuration
```env
# Your backend domain (for OAuth callbacks)
BACKEND_URL=https://api.yourdomain.com

# Your frontend domain
FRONTEND_URL=https://yourdomain.com
```

#### YOLO Service Configuration
```env
# URL of your YOLO detection service
# If using Docker: http://yolo:5000
# If using external: https://your-yolo-service.com
YOLO_SERVICE_URL=http://yolo:5000

# Timeout for YOLO requests (milliseconds)
YOLO_SERVICE_TIMEOUT=30000
```

#### Optional: Email Configuration
```env
# For password reset emails
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# For Gmail: Use App Password (not regular password)
# Generate at: https://myaccount.google.com/apppasswords
```

---

## Frontend Environment Variables

### Location
Create/Update file: `front-end/vision-aid-ui/.env.production`

### Required Variables

```env
# Disable source maps in production (smaller bundle size)
GENERATE_SOURCEMAP=false

# Skip build-time checks
SKIP_PREFLIGHT_CHECK=true

# Your backend API URL
REACT_APP_API_URL=https://api.yourdomain.com

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id

# Google OAuth Client ID (same as backend)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com

# Application Settings
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_REPORTING=true
```

**How to get Firebase Configuration:**
1. Go to Firebase Console (https://console.firebase.google.com)
2. Create a new project
3. Add a web app to your project
4. Copy the config values from the setup page
5. Paste into .env.production

---

## Docker Environment Variables

### Location
Create file: `.env` in project root (for docker-compose)

### Required Variables
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vision-aid?retryWrites=true&w=majority
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your-strong-password

# Backend Configuration
JWT_SECRET=your-64-character-random-hex-string
SESSION_SECRET=your-64-character-random-hex-string
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Frontend Configuration
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# YOLO Service
YOLO_SERVICE_URL=http://yolo:5000
```

---

## Step-by-Step Setup Checklist

### 1. Generate Security Credentials
```bash
# Generate JWT Secret
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Generate Session Secret
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Set Up Firebase
- [ ] Create Firebase project
- [ ] Enable Authentication (Google, Email/Password)
- [ ] Create Firestore database
- [ ] Copy config values
- [ ] Add domain to authorized domains

### 3. Set Up Google OAuth
- [ ] Go to Google Cloud Console
- [ ] Create project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add redirect URIs
- [ ] Copy Client ID and Secret

### 4. Set Up GitHub OAuth
- [ ] Go to GitHub Settings → Developer settings
- [ ] Create OAuth App
- [ ] Set Authorization callback URL
- [ ] Copy Client ID and Secret

### 5. Set Up MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create cluster
- [ ] Create database user
- [ ] Whitelist IP addresses
- [ ] Get connection string
- [ ] Update MONGODB_URI

### 6. Create Environment Files
- [ ] Create `Back-end/.env.production`
- [ ] Create `front-end/vision-aid-ui/.env.production`
- [ ] Update `.env` for Docker (if using Docker)

### 7. Test Environment Variables
```bash
# Test backend
cd Back-end
NODE_ENV=production npm start

# Test frontend (in another terminal)
cd front-end/vision-aid-ui
npm start

# Or test with Docker
docker-compose -f docker-compose.production.yml up
```

---

## Security Best Practices

1. **Never commit secrets to Git**
   - Add to `.gitignore`:
     ```
     .env
     .env.production
     .env.local
     *.key
     *.pem
     ```

2. **Use strong passwords**
   - Minimum 16 characters
   - Mix of uppercase, lowercase, numbers, symbols
   - Don't reuse passwords

3. **Rotate secrets regularly**
   - Change JWT_SECRET every 3-6 months
   - Update OAuth secrets if leaked
   - Rotate database passwords

4. **Secure credential storage**
   - Use environment variables
   - Use secret management tools (HashiCorp Vault, AWS Secrets Manager)
   - Never email credentials
   - Store in password manager

5. **IP Whitelisting**
   - Whitelist your server IP in MongoDB Atlas
   - Whitelist OAuth redirect domains
   - Use firewall rules

---

## Common Issues & Troubleshooting

### "MongoDB connection failed"
```
✗ Problem: MONGODB_URI not set or incorrect
✓ Solution: 
  1. Check connection string format
  2. Verify IP is whitelisted in MongoDB Atlas
  3. Ensure database user has correct password
  4. Test with MongoDB Compass
```

### "OAuth callback URL not registered"
```
✗ Problem: Redirect URI not in OAuth app settings
✓ Solution:
  1. Go to Google/GitHub OAuth app settings
  2. Add http://localhost:3000/api/auth/google/callback (dev)
  3. Add https://api.yourdomain.com/api/auth/google/callback (prod)
  4. Save changes
  5. Restart application
```

### "Firebase configuration error"
```
✗ Problem: Invalid Firebase credentials
✓ Solution:
  1. Copy Firebase config again from console
  2. Ensure REACT_APP_FIREBASE_API_KEY is set
  3. Check that frontend domain is in Firebase authorized domains
  4. Verify .env.production is in correct location
```

### "CORS error: origin not allowed"
```
✗ Problem: FRONTEND_URL doesn't match actual frontend domain
✓ Solution:
  1. Update FRONTEND_URL to match your domain
  2. If using subdomain, update to: https://yourdomain.com
  3. Restart backend service
```

---

## Environment Variables Summary Table

| Variable | Backend | Frontend | Docker | Purpose |
|----------|---------|----------|--------|---------|
| MONGODB_URI | ✓ | ✗ | ✓ | Database connection |
| JWT_SECRET | ✓ | ✗ | ✓ | Token signing |
| FRONTEND_URL | ✓ | ✗ | ✓ | CORS origins |
| BACKEND_URL | ✓ | ✗ | ✓ | OAuth callback |
| REACT_APP_API_URL | ✗ | ✓ | ✓ | API endpoint |
| REACT_APP_FIREBASE_API_KEY | ✗ | ✓ | ✓ | Firebase config |
| GOOGLE_CLIENT_ID | ✓ | ✓ | ✓ | OAuth Google |
| GOOGLE_CLIENT_SECRET | ✓ | ✗ | ✓ | OAuth Google |
| GITHUB_CLIENT_ID | ✓ | ✗ | ✓ | OAuth GitHub |
| GITHUB_CLIENT_SECRET | ✓ | ✗ | ✓ | OAuth GitHub |

---

## Support & Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Setup](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Environment Variables Best Practices](https://12factor.net/config)

---

**Remember**: Keep all credentials secure and never share them!

