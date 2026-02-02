# 🚀 VisionAid Production Deployment Guide

## Overview
This guide walks you through deploying VisionAid to a production environment.

---

## Phase 1: Pre-Deployment Checklist

### Security
- [ ] Update all `.env.production` files with real secrets
- [ ] Generate strong JWT_SECRET and SESSION_SECRET
- [ ] Configure HTTPS/SSL certificate
- [ ] Update CORS origins to production domain
- [ ] Enable firewall rules
- [ ] Set up database backups
- [ ] Enable database authentication and encryption

### Firebase/Authentication
- [ ] Add production domain to Firebase authorized domains
- [ ] Configure Google OAuth credentials for production
- [ ] Configure GitHub OAuth credentials for production
- [ ] Update callback URLs in OAuth providers

### Performance
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally
- [ ] Verify all assets are optimized
- [ ] Check bundle sizes
- [ ] Test with production environment variables

### Database
- [ ] Set up MongoDB Atlas production cluster
- [ ] Enable IP whitelist
- [ ] Configure backups
- [ ] Test database connection
- [ ] Create indexes on frequently queried fields

---

## Phase 2: Backend Deployment

### Option A: Heroku (Easiest)

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create vision-aid-api

# Set production environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vision-aid?retryWrites=true&w=majority
heroku config:set JWT_SECRET=your-strong-secret-here
heroku config:set FRONTEND_URL=https://yourdomain.com
heroku config:set GOOGLE_CLIENT_ID=your-google-id
heroku config:set GOOGLE_CLIENT_SECRET=your-google-secret
heroku config:set GITHUB_CLIENT_ID=your-github-id
heroku config:set GITHUB_CLIENT_SECRET=your-github-secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Option B: AWS EC2 + PM2

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/yourusername/vision-aid.git
cd vision-aid/Back-end

# Install dependencies
npm install

# Install PM2 globally
sudo npm install -g pm2

# Create .env.production file with your values
nano .env.production

# Start with PM2
pm2 start server.js --name "vision-aid-api" --env production

# Save PM2 configuration
pm2 save

# Set up PM2 to restart on reboot
pm2 startup
# Run the command it suggests
```

### Option C: Docker + Any Cloud Provider

```bash
# Build Docker image
docker build -t vision-aid-backend:latest .

# Tag for your registry
docker tag vision-aid-backend:latest your-registry/vision-aid-backend:latest

# Push to registry
docker push your-registry/vision-aid-backend:latest

# Deploy with environment variables
docker run -d \
  --name vision-aid-api \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your-connection-string \
  -e JWT_SECRET=your-secret \
  your-registry/vision-aid-backend:latest
```

---

## Phase 3: Frontend Deployment

### Option A: Vercel (Recommended for Next.js-like projects)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd front-end/vision-aid-ui
vercel --prod

# Set environment variables in Vercel dashboard
# Add all variables from .env.production
```

### Option B: Netlify

```bash
# Build the project
cd front-end/vision-aid-ui
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build

# Configure environment variables in Netlify dashboard
```

### Option C: AWS S3 + CloudFront

```bash
# Build the project
cd front-end/vision-aid-ui
npm run build

# Create S3 bucket
aws s3 mb s3://vision-aid-app

# Upload build
aws s3 sync build/ s3://vision-aid-app --delete

# Create CloudFront distribution (in AWS Console)
# Point to your S3 bucket
# Set cache policy for index.html to short TTL
```

### Option D: Traditional Hosting (cPanel/Apache)

```bash
# Build the project
npm run build

# Upload 'build' folder contents to public_html
# Ensure .htaccess is configured for React Router:

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Phase 4: SSL/HTTPS Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

---

## Phase 5: Domain & DNS Configuration

1. Point your domain registrar to your hosting provider's nameservers
2. Add DNS records:
   ```
   A record: yourdomain.com → your-server-ip
   A record: www.yourdomain.com → your-server-ip
   CNAME record: api.yourdomain.com → your-api-server
   ```

---

## Phase 6: Testing Production Environment

```bash
# Test API endpoint
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"ok","services":{"database":"connected (firebase)"}}

# Test frontend
# Open https://yourdomain.com in browser

# Check browser console for errors
# Verify API calls are going to correct URL
# Test authentication (Google OAuth, GitHub)
# Test all features
```

---

## Phase 7: Monitoring & Maintenance

### Set up monitoring
- [ ] Use PM2 Plus for process monitoring
- [ ] Set up error tracking (Sentry, Rollbar)
- [ ] Enable database monitoring
- [ ] Set up uptime monitoring (UptimeRobot, StatusCake)

### Regular maintenance
- [ ] Monitor logs daily
- [ ] Check error rates
- [ ] Review database performance
- [ ] Update dependencies monthly
- [ ] Perform security scans
- [ ] Backup database weekly

### Monitoring Dashboard
```bash
# PM2 Plus
pm2 plus

# View real-time metrics, logs, and alerts
```

---

## Phase 8: Backup & Disaster Recovery

### Database Backups
```bash
# MongoDB Atlas automatic backups (enabled by default)
# Configure in MongoDB Atlas console

# Manual backup
mongodump --uri="your-connection-string" --out backup-2024-02-02

# Restore from backup
mongorestore --uri="your-connection-string" backup-2024-02-02
```

### Application Code Backup
```bash
# Use GitHub for code backup
git push origin main

# Create production branch
git checkout -b production
git push origin production
```

---

## Troubleshooting

### Backend won't start
```bash
# Check Node.js version (need 16+)
node --version

# Check if port is in use
sudo lsof -i :3000

# Check environment variables
echo $MONGODB_URI

# View logs
pm2 logs vision-aid-api
```

### API calls failing from frontend
```bash
# Check CORS settings in server.js
# Ensure FRONTEND_URL matches your domain
# Check browser console for error details
```

### Database connection issues
```bash
# Verify MongoDB URI is correct
# Check IP whitelist in MongoDB Atlas
# Ensure database user has proper permissions
# Test connection with MongoDB Compass
```

### SSL certificate issues
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate expiration
sudo certbot certificates
```

---

## Performance Optimization Checklist

- [ ] Enable gzip compression (enabled in server.js)
- [ ] Use CDN for static assets
- [ ] Enable caching headers
- [ ] Optimize images
- [ ] Minify CSS/JS (React does this automatically)
- [ ] Enable browser caching
- [ ] Use production build of React
- [ ] Enable database indexing
- [ ] Use connection pooling

---

## Security Best Practices

- [ ] Keep dependencies updated
- [ ] Rotate secrets regularly
- [ ] Enable 2FA for all accounts
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags
- [ ] Implement rate limiting (enabled)
- [ ] Use CORS properly (configured)
- [ ] Validate all inputs
- [ ] Use Helmet for security headers (enabled)
- [ ] Regular security audits

---

## Support & Resources

- **Firebase Docs**: https://firebase.google.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **PM2 Documentation**: https://pm2.keymetrics.io
- **Heroku Documentation**: https://devcenter.heroku.com
- **Let's Encrypt**: https://letsencrypt.org

---

## Quick Commands Reference

```bash
# Build frontend
npm run build

# Start backend in production
NODE_ENV=production npm start

# View process logs
pm2 logs vision-aid-api

# Restart application
pm2 restart vision-aid-api

# Check API health
curl https://api.yourdomain.com/health

# View PM2 status
pm2 status
```

---

**Last Updated**: February 2, 2026
**Version**: 1.0.0

