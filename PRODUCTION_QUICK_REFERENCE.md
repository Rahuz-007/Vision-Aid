# 🚀 VisionAid Production Deployment - Quick Reference

## 📋 Key Documents
- **PRODUCTION_DEPLOYMENT_GUIDE.md** - Detailed deployment instructions
- **PRODUCTION_READINESS_CHECKLIST.md** - Pre-launch checklist
- **ENVIRONMENT_SETUP_GUIDE.md** - Environment variables setup
- **IMPLEMENTATION_COMPLETE.md** - Features documentation

---

## ⚡ Quick Start (5 Minutes)

### 1. Environment Setup
```bash
# Backend secrets
cd Back-end
cp .env .env.production
# Edit .env.production with production values:
# - MONGODB_URI
# - JWT_SECRET (generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
# - FRONTEND_URL
# - OAuth credentials

# Frontend config
cd ../front\ -end/vision-aid-ui
# Edit .env.production with:
# - REACT_APP_API_URL
# - Firebase credentials
```

### 2. Build for Production
```bash
# Option A: Use build script
./build-production.sh        # Linux/Mac
./build-production.bat       # Windows

# Option B: Manual build
cd back-end
npm install
cd ../front\ -end/vision-aid-ui
npm install
npm run build
```

### 3. Deploy
Choose one deployment option:

**Option A: Docker (Recommended)**
```bash
docker-compose -f docker-compose.production.yml up -d
```

**Option B: Heroku**
```bash
heroku create vision-aid-api
heroku config:set NODE_ENV=production MONGODB_URI=... (etc)
git push heroku main
```

**Option C: Traditional Server**
```bash
pm2 start Back-end/server.js --name "vision-aid-api" --env production
# Serve frontend from Nginx or Apache
```

---

## 🔐 Essential Secrets to Generate

```bash
# JWT Secret (copy output)
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Session Secret (copy output)
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"

# Database Password (use strong password manager)
# Example: P@ssw0rd!SecureVeryLong123456
```

---

## 🎯 Critical Environment Variables

### Backend (Back-end/.env.production)
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/vision-aid
JWT_SECRET=<generated-above>
SESSION_SECRET=<generated-above>
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
GOOGLE_CLIENT_ID=<from-google-console>
GOOGLE_CLIENT_SECRET=<from-google-console>
GITHUB_CLIENT_ID=<from-github>
GITHUB_CLIENT_SECRET=<from-github>
```

### Frontend (front-end/vision-aid-ui/.env.production)
```env
GENERATE_SOURCEMAP=false
SKIP_PREFLIGHT_CHECK=true
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_FIREBASE_API_KEY=<from-firebase>
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_GOOGLE_CLIENT_ID=<same-as-backend>
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

---

## ✅ Pre-Launch Checklist (30 Minutes)

```
SECURITY
  ☐ All .env files created with production values
  ☐ No hardcoded secrets in code
  ☐ SSL certificate obtained
  ☐ HTTPS configured
  ☐ CORS domains updated

CONFIGURATION
  ☐ Firebase project created
  ☐ Google OAuth configured
  ☐ GitHub OAuth configured
  ☐ MongoDB Atlas cluster ready
  ☐ Database user created

TESTING
  ☐ Frontend build successful (npm run build)
  ☐ Backend starts without errors (NODE_ENV=production npm start)
  ☐ API health check: curl https://localhost:3000/health
  ☐ Frontend loads at https://localhost
  ☐ All features tested

DEPLOYMENT
  ☐ Deployment method selected
  ☐ Server/hosting prepared
  ☐ Domain DNS configured
  ☐ SSL certificate installed
  ☐ Monitoring configured
```

---

## 🌍 Deployment Options Comparison

| Option | Ease | Cost | Scalability | Features |
|--------|------|------|-------------|----------|
| **Heroku** | ⭐⭐⭐⭐⭐ | $$ | ★★★★ | Built-in CI/CD, auto-scaling |
| **Docker + VPS** | ⭐⭐⭐ | $ | ★★★★★ | Full control, flexible |
| **AWS EC2** | ⭐⭐⭐ | $ | ★★★★★ | Scalable, feature-rich |
| **Netlify/Vercel** | ⭐⭐⭐⭐⭐ | Free-$$ | ★★★★ | For frontend only |
| **Traditional Host** | ⭐⭐⭐ | $ | ★★★ | cPanel, simple setup |

---

## 🐳 Docker Deployment (Fastest)

```bash
# 1. Update .env file with all production values
# 2. Build and start
docker-compose -f docker-compose.production.yml up -d

# 3. Verify
docker-compose logs -f backend
curl http://localhost/api/health

# 4. Stop
docker-compose down
```

---

## 📊 Post-Launch Monitoring

### Essential Checks
```bash
# API Health
curl https://api.yourdomain.com/health

# Database Connection
# Check MongoDB Atlas dashboard

# Frontend Access
# Open https://yourdomain.com in browser

# Error Logs
# Check PM2 logs (pm2 logs vision-aid-api)
# Check server logs (/var/log/syslog)
```

### Monitor These Metrics
- API response time < 500ms
- Error rate < 0.1%
- Database query time < 100ms
- Uptime > 99.9%
- Memory usage < 80%
- Disk usage < 80%

---

## 🆘 Quick Troubleshooting

### "Connection refused on port 3000"
```bash
# Check if port is in use
lsof -i :3000

# Kill process on that port
kill -9 <PID>

# Check firewall
sudo ufw allow 3000
```

### "MongoDB connection failed"
```bash
# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/vision-aid"

# Check IP whitelist in MongoDB Atlas
# Verify database user password
```

### "CORS error"
```bash
# Check FRONTEND_URL matches your domain
# Verify CORS headers in response:
curl -i https://api.yourdomain.com/health
# Should include: Access-Control-Allow-Origin: https://yourdomain.com
```

### "SSL certificate error"
```bash
# Verify certificate is valid
openssl s_client -connect api.yourdomain.com:443

# For Let's Encrypt renewal:
sudo certbot renew
```

---

## 🔄 Updating Production

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm install

# 3. Build
npm run build (frontend)

# 4. Restart
pm2 restart vision-aid-api
# or
docker-compose -f docker-compose.production.yml up -d

# 5. Verify
curl https://api.yourdomain.com/health
```

---

## 📞 Emergency Contacts

Keep this information handy:

- **Server Provider Support**: [Add URL]
- **Database Support**: MongoDB Atlas Support
- **Domain Registrar**: [Add domain registrar]
- **SSL Provider**: Let's Encrypt or [Add provider]
- **On-Call Engineer**: [Add contact]

---

## 📚 Important Links

- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [Readiness Checklist](./PRODUCTION_READINESS_CHECKLIST.md)
- [Environment Setup](./ENVIRONMENT_SETUP_GUIDE.md)
- [Firebase Console](https://console.firebase.google.com)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Google Cloud Console](https://console.cloud.google.com)
- [GitHub Settings](https://github.com/settings/developers)

---

## 🎓 Learning Resources

- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-performance-monitoring-overview/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [React Production Build](https://create-react-app.dev/docs/production-build/)
- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 📋 Daily Checklist for DevOps

### Every Morning
- [ ] Check uptime monitoring dashboard
- [ ] Review error logs
- [ ] Verify database health
- [ ] Check disk space usage
- [ ] Verify backups completed

### Every Week
- [ ] Review performance metrics
- [ ] Check for security updates
- [ ] Test backup restoration
- [ ] Review user feedback
- [ ] Plan optimizations

### Every Month
- [ ] Security audit
- [ ] Capacity planning
- [ ] Dependency updates
- [ ] Performance analysis
- [ ] Disaster recovery drill

---

## ✨ Success Metrics

Your deployment is successful when:

✅ Frontend loads in < 3 seconds
✅ API responds in < 500ms
✅ Uptime > 99.9%
✅ Error rate < 0.1%
✅ Users can sign up/login
✅ All features work correctly
✅ Mobile experience is smooth
✅ No security warnings
✅ Database is backed up
✅ Monitoring alerts working

---

**Remember**: When in doubt, check the logs!

```bash
# Backend logs
pm2 logs vision-aid-api

# System logs
tail -f /var/log/syslog

# Application logs
tail -f logs/application.log

# Database logs
# Check MongoDB Atlas dashboard
```

---

**Version**: 1.0.0 | **Last Updated**: February 2, 2026

