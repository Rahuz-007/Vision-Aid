# ✅ Vision Aid - Simple Startup Guide

## 🎉 SUCCESS! MongoDB & Redis are Running!

Your essential database services are now running in Docker!

---

## 📊 Current Status

✅ **MongoDB** - Running on port 27017  
✅ **Redis** - Running on port 6379  
⏸️ **Backend** - Ready to start manually  
⏸️ **YOLO Service** - Ready to start manually  
⏸️ **Frontend** - Ready to start manually (or already running)

---

## 🚀 How to Run the Full Project

### Step 1: MongoDB & Redis are Already Running! ✅

You've already completed this step. These are running in Docker:

```powershell
# Check status anytime
docker-compose -f docker-compose-simple.yml ps

# View logs
docker-compose -f docker-compose-simple.yml logs -f

# Stop them
docker-compose -f docker-compose-simple.yml down

# Start them again later
docker-compose -f docker-compose-simple.yml up -d
```

### Step 2: Start Backend (In New Terminal)

```powershell
# Open a NEW PowerShell terminal
cd "C:\Users\ASUS\Desktop\Vision aid\Back-end"

# Make sure .env exists
if (-not (Test-Path .env)) { Copy-Item .env.example .env }

# Start the backend
npm start
```

**Expected output:**
```
Connected to MongoDB successfully
Redis Client Connected  
Server is running on port 3000
```

### Step 3: Start YOLO Service (In Another New Terminal)

```powershell
# Open ANOTHER NEW PowerShell terminal
cd "C:\Users\ASUS\Desktop\Vision aid\yolo-service"

# Start YOLO service
python app.py
```

**Expected output:**
```
Loading YOLO model...
Device: cpu
Model loaded successfully
Starting YOLO service on port 5000
```

### Step 4: Frontend

**Option A:** If it's already running (you have npm start running):
- ✅ You're good! Just keep it running

**Option B:** If not running, start it:
```powershell
# Open ANOTHER NEW PowerShell terminal
cd "C:\Users\ASUS\Desktop\Vision aid\front -end\vision-aid-ui"

# Start frontend
npm start
```

---

## 🌐 Access Your Application

Once all services are running:

| Service | URL | Status Check |
|---------|-----|--------------|
| **Frontend** | http://localhost:3000 | Open in browser |
| **Backend API** | http://localhost:3000 (backend port) | http://localhost:3000/health |
| **YOLO Service** | http://localhost:8000 | http://localhost:8000/health |
| **MongoDB** | mongodb://admin:password@localhost:27017 | Use MongoDB Compass |
| **Redis** | redis://localhost:6379 | Use RedisInsight |

**Note:** The backend might be on a different port if you specified it in `.env`

---

## 🧪 Quick Test

### Test Backend Health
```powershell
curl http://localhost:3000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "services": {
    "database": "connected",
    "cache": "connected"
  }
}
```

### Test YOLO Health
```powershell
curl http://localhost:8000/health
```

**Expected response:**
```json
{
  "status": "ok",
  "device": "cpu",
  "db_size": 1000+
}
```

### Register a Test User
```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"email":"test@test.com","password":"test12345","name":"Test User"}'
```

---

## 📝 Summary of Terminals Needed

You'll have **4 terminals** running:

1. **Terminal 1:** Docker services (optional to view logs)
2. **Terminal 2:** Backend (`npm start` in Back-end/)
3. **Terminal 3:** YOLO Service (`python app.py` in yolo-service/)
4. **Terminal 4:** Frontend (`npm start` in front -end/vision-aid-ui/)

---

## 🛠️ Useful Commands

### Docker Services (MongoDB & Redis)

```powershell
# Start MongoDB & Redis
docker-compose -f docker-compose-simple.yml up -d

# Stop MongoDB & Redis
docker-compose -f docker-compose-simple.yml down

# View logs
docker-compose -f docker-compose-simple.yml logs -f

# Restart
docker-compose -f docker-compose-simple.yml restart

# Check status
docker-compose -f docker-compose-simple.yml ps
```

### Backend

```powershell
# Start
cd Back-end
npm start

# Stop
# Press Ctrl+C in the terminal
```

### YOLO Service

```powershell
# Start
cd yolo-service
python app.py

# Stop
# Press Ctrl+C in the terminal
```

### Frontend

```powershell
# Start
cd "front -end\vision-aid-ui"
npm start

# Stop
# Press Ctrl+C in the terminal
```

---

## 🎯 Startup Checklist

Before you say "it's working":

- [ ] Docker Desktop is running
- [ ] `docker-compose -f docker-compose-simple.yml ps` shows MongoDB & Redis as "Up"
- [ ] Backend terminal shows "Server is running on port 3000"
- [ ] YOLO terminal shows "Starting YOLO service on port 5000"
- [ ] Frontend opens at http://localhost:3000
- [ ] http://localhost:3000/health returns OK
- [ ] http://localhost:8000/health returns OK
- [ ] You can see the UI in your browser

---

## 🔧 Troubleshooting

### Backend won't start - "MongoDB connection error"
**Solution:**
```powershell
# Make sure MongoDB is running
docker-compose -f docker-compose-simple.yml ps

# Should show vision-aid-mongodb as "Up (healthy)"
```

### Backend won't start - "Redis connection error"
**Solution:**
```powershell
# Make sure Redis is running
docker-compose -f docker-compose-simple.yml ps

# Should show vision-aid-redis as "Up (healthy)"
```

### Frontend can't connect to backend
**Solution:**
- Make sure backend is running on port 3000
- Check `.env` in Back-end folder has `PORT=3000`

### Port already in use
**Solution:**
```powershell
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

---

## 💡 Pro Tips

1. **Use Windows Terminal**
   - Supports multiple tabs
   - Can run all 4 terminals in one window
   - Download from Microsoft Store

2. **Create a startup script**
   - See `quick-start.ps1` for an interactive startup

3. **Keep Docker running**
   - MongoDB & Redis in Docker are reliable
   - Just keep them running in the background

4. **Stop frontend when not needed**
   - Frontend uses lots of resources
   - Only run when actively developing UI

---

## 📊 What You Have Now

### Running in Docker:
✅ MongoDB (Database)
✅ Redis (Cache)

### Running Manually:
⏸️ Backend Node.js API
⏸️ YOLO Python Service
⏸️ Frontend React App

### Why This Hybrid Approach?

- **Docker for databases**: Easy, reliable, no manual installation
- **Manual for code**: Faster development, easier debugging
- **Best of both worlds**: Easy setup + fast iteration

---

## 🎉 Next Steps

1. **Start all services** (Backend, YOLO, Frontend)
2. **Open your browser** to http://localhost:3000
3. **Test the features**:
   - Register a user
   - Upload an image for detection
   - Try the color blindness simulator
   - Test the palette checker

4. **Start developing!**
   - Make changes to code
   - See them update automatically
   - Check logs for errors

---

## 🆘 Need Help?

- **MongoDB/Redis not starting?** Check Docker Desktop is running
- **Services can't connect?** Check they're on the right ports
- **Still stuck?** Check logs: `docker-compose -f docker-compose-simple.yml logs`

---

**You're Ready! Happy Coding! 🚀**

*MongoDB & Redis running in Docker ✅*  
*Ready to start Backend, YOLO, and Frontend manually!*
