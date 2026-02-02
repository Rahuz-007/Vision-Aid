# 🐳 Running Vision Aid on Docker Desktop - Complete Guide

## Step-by-Step Instructions

---

## 📋 Prerequisites

### 1. Install Docker Desktop

**Download & Install:**
1. Go to: https://www.docker.com/products/docker-desktop
2. Download Docker Desktop for Windows
3. Run the installer
4. Follow the installation wizard
5. Restart your computer if prompted

**Verify Installation:**
```powershell
# Open PowerShell and run:
docker --version
docker-compose --version
```

You should see something like:
```
Docker version 24.0.x
docker-compose version 2.x.x
```

---

## 🚀 Running Vision Aid with Docker

### Option 1: One-Command Start (Easiest!)

```powershell
# Navigate to your project directory
cd "C:\Users\ASUS\Desktop\Vision aid"

# Start all services
docker-compose up -d
```

That's it! 🎉

### Option 2: Using the Quick Start Script

```powershell
# Navigate to your project directory
cd "C:\Users\ASUS\Desktop\Vision aid"

# Run the interactive script
.\quick-start.ps1

# Choose option 1 when prompted
```

---

## 📊 What Happens When You Run Docker Compose?

Docker will automatically:

1. **Download Images** (first time only):
   - MongoDB 6
   - Redis 7
   - Node.js 18
   - Python 3.10

2. **Build Your Services**:
   - Backend API
   - YOLO Detection Service
   - Frontend React App

3. **Start Everything**:
   - MongoDB on port 27017
   - Redis on port 6379
   - YOLO Service on port 8000
   - Backend API on port 3000
   - Frontend on port 3001

4. **Setup Networks & Volumes**:
   - Creates a private network for services
   - Persistent storage for database

---

## 🎯 Accessing Your Application

Once started, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3001 | Main user interface |
| **Backend API** | http://localhost:3000 | REST API |
| **YOLO Service** | http://localhost:8000 | Detection service |
| **MongoDB** | mongodb://admin:password@localhost:27017 | Database |
| **Redis** | redis://localhost:6379 | Cache |

---

## 🔍 Useful Docker Commands

### Check Status
```powershell
# See all running containers
docker-compose ps

# Should show:
# NAME                     STATUS                PORTS
# vision-aid-backend       Up                   0.0.0.0:3000->3000/tcp
# vision-aid-frontend      Up                   0.0.0.0:3001->3000/tcp
# vision-aid-mongodb       Up (healthy)         0.0.0.0:27017->27017/tcp
# vision-aid-redis         Up (healthy)         0.0.0.0:6379->6379/tcp
# vision-aid-yolo          Up (healthy)         0.0.0.0:8000->5000/tcp
```

### View Logs
```powershell
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f yolo-service
docker-compose logs -f frontend
```

### Stop Services
```powershell
# Stop all containers (but keep data)
docker-compose stop

# Stop and remove containers (keeps data)
docker-compose down

# Stop and remove everything including data
docker-compose down -v
```

### Restart Services
```powershell
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild After Code Changes
```powershell
# Rebuild and restart all services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

---

## 🐛 Troubleshooting

### Problem 1: Docker Desktop Not Starting

**Solution:**
1. Make sure Hyper-V or WSL 2 is enabled
2. Go to Windows Features → Enable Hyper-V or WSL 2
3. Restart computer
4. Start Docker Desktop

### Problem 2: "Port Already in Use"

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```powershell
# Find process using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Problem 3: Services Not Starting

**Solution:**
```powershell
# Check logs for errors
docker-compose logs

# Remove old containers and try again
docker-compose down
docker-compose up -d
```

### Problem 4: "No Space Left on Device"

**Solution:**
```powershell
# Clean up old containers and images
docker system prune -a

# Remove unused volumes
docker volume prune
```

### Problem 5: Frontend Can't Connect to Backend

**Solution:**
Make sure you're using `http://localhost:3000` in your frontend code, not `http://backend:3000` (that's for internal Docker network only).

---

## 📝 Step-by-Step First Run

### Before You Start:

1. **Stop the currently running frontend**:
   ```powershell
   # Find the npm process and stop it (Ctrl+C in the terminal where it's running)
   ```

2. **Make sure Docker Desktop is running**:
   - Look for Docker icon in system tray
   - Should show "Docker Desktop is running"

### Now Let's Start:

```powershell
# Step 1: Navigate to project
cd "C:\Users\ASUS\Desktop\Vision aid"

# Step 2: Start all services
docker-compose up -d

# Step 3: Wait for services to be healthy (30-60 seconds)
# You'll see output like:
# [+] Running 5/5
#  ✔ Container vision-aid-mongodb   Started
#  ✔ Container vision-aid-redis     Started  
#  ✔ Container vision-aid-yolo      Started
#  ✔ Container vision-aid-backend   Started
#  ✔ Container vision-aid-frontend  Started

# Step 4: Check status
docker-compose ps

# Step 5: View logs to confirm everything is working
docker-compose logs -f

# Press Ctrl+C to stop following logs
```

### Test Your Application:

1. **Open Browser** to http://localhost:3001
2. **Test Backend Health**: http://localhost:3000/health
3. **Test YOLO Health**: http://localhost:8000/health

You should see:
- ✅ Frontend loads with your beautiful UI
- ✅ Backend returns `{"status":"ok",...}`
- ✅ YOLO returns `{"status":"ok","device":"cpu",...}`

---

## 🎓 Understanding Docker Compose

### What is docker-compose.yml?

It's a configuration file that defines:
- **Services**: Backend, Frontend, YOLO, MongoDB, Redis
- **Networks**: How services communicate
- **Volumes**: Where to store data persistently
- **Environment**: Configuration for each service

### Service Dependencies:

```
MongoDB ──┐
Redis ────┼──> YOLO Service ──> Backend ──> Frontend
          │
          └──> (all services need these)
```

Services start in order based on dependencies!

---

## 🔄 Workflow Examples

### Daily Development:

```powershell
# Morning: Start everything
docker-compose up -d

# Work on code...

# Evening: Stop everything
docker-compose down
```

### After Code Changes:

```powershell
# Backend changes
docker-compose up -d --build backend

# Frontend changes
docker-compose up -d --build frontend

# YOLO service changes
docker-compose up -d --build yolo-service

# All changes
docker-compose up -d --build
```

### Debugging:

```powershell
# View live logs
docker-compose logs -f backend

# Access container shell
docker exec -it vision-aid-backend sh

# Run commands inside container
docker exec vision-aid-backend npm list
```

---

## 💡 Pro Tips

### Tip 1: Use Docker Desktop GUI

Docker Desktop has a **visual interface**:
1. Click Docker icon in system tray
2. Go to "Containers"
3. See all your containers with status
4. Click any container to view logs, stats, etc.

### Tip 2: Restart on Reboot

To automatically start services when Windows starts:
1. Open Docker Desktop settings
2. General → "Start Docker Desktop when you log in"
3. Your containers will auto-start if you use `restart: unless-stopped`

### Tip 3: Free Up Space

```powershell
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove everything (careful!)
docker system prune -a --volumes
```

### Tip 4: Monitor Resources

In Docker Desktop:
- Go to Settings → Resources
- Adjust CPU/Memory limits
- Recommended: 4GB RAM, 2 CPUs minimum

---

## 📊 Performance Optimization

### For Better Performance:

1. **Allocate More Resources**:
   - Docker Desktop → Settings → Resources
   - CPU: 4+ cores
   - Memory: 4GB+ RAM
   - Disk: 50GB+

2. **Use Volumes for Development**:
   - Already configured in docker-compose.yml
   - Live reload works automatically

3. **Enable BuildKit**:
   ```powershell
   # Add to environment
   $env:DOCKER_BUILDKIT=1
   docker-compose build
   ```

---

## 🎯 Quick Reference Card

```powershell
# START
docker-compose up -d

# STOP
docker-compose down

# STATUS
docker-compose ps

# LOGS
docker-compose logs -f

# RESTART
docker-compose restart

# REBUILD
docker-compose up -d --build

# CLEAN
docker-compose down -v
docker system prune -a
```

---

## ✅ Success Checklist

After running `docker-compose up -d`, verify:

- [ ] Docker Desktop shows 5 containers running
- [ ] `docker-compose ps` shows all services "Up"
- [ ] http://localhost:3001 loads the frontend
- [ ] http://localhost:3000/health returns OK
- [ ] http://localhost:8000/health returns OK
- [ ] No errors in `docker-compose logs`
- [ ] Can register a user via API
- [ ] Can upload and detect images

---

## 🎉 You're Done!

Once Docker Compose is running:

✅ **All services are running**
✅ **Database is ready**
✅ **Cache is active**
✅ **Everything is connected**
✅ **You can start developing!**

### Next Steps:

1. **Test Authentication**: Try registering a user
2. **Test Detection**: Upload an image
3. **Check Logs**: Make sure no errors
4. **Start Coding**: Make changes and see them live!

---

## 📞 Need Help?

**Common Resources:**
- Docker Desktop Docs: https://docs.docker.com/desktop/
- Docker Compose Docs: https://docs.docker.com/compose/
- Vision Aid Docs: See `README_IMPLEMENTATION.md`

**Quick Fixes:**
- Service won't start? Check logs: `docker-compose logs <service-name>`
- Port conflict? Change port in docker-compose.yml
- Out of space? Run: `docker system prune -a`

---

**Happy Dockerizing! 🐳**

*Your Vision Aid application is now production-ready!*
