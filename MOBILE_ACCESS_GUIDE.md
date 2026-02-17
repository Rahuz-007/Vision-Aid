# Vision Aid - Mobile Access Guide

## ✅ Status: Running with HTTPS

All services are now running with HTTPS enabled for mobile camera access!

---

## 📱 Mobile Access URL

### Your Mobile URL:
```
https://172.20.10.10:3000
```

---

## 🚀 Quick Start

### Method 1: QR Code (Easiest)
1. Open `mobile-access-qr.html` in your browser (should already be open)
2. Scan the QR code with your phone camera
3. Follow the security warning instructions below

### Method 2: Manual Entry
1. Make sure your phone is on the **SAME Wi-Fi network**
2. Open your mobile browser (Chrome, Safari, etc.)
3. Type: `https://172.20.10.10:3000`
4. Follow the security warning instructions below

---

## ⚠️ Handling the Security Warning

When you first access the site on mobile, you'll see a security warning. **This is completely normal** for local HTTPS development.

### On Chrome (Android):
1. You'll see "Your connection is not private"
2. Tap **"Advanced"**
3. Tap **"Proceed to 172.20.10.10 (unsafe)"**
4. ✅ Done! Camera will now work

### On Safari (iOS):
1. You'll see "This Connection Is Not Private"
2. Tap **"Show Details"**
3. Tap **"visit this website"**
4. Tap **"Visit Website"** again to confirm
5. ✅ Done! Camera will now work

---

## 🎯 Services Running

| Service | URL | Status |
|---------|-----|--------|
| Frontend (HTTPS) | https://localhost:3000 | ✅ Running |
| Backend API | http://localhost:3001 | ✅ Running |
| YOLO Service | http://localhost:8000 | ✅ Running |

---

## 🔧 Management Commands

### To Stop All Services:
Close all the PowerShell windows that opened

### To Restart with HTTPS:
```powershell
.\start-https-simple.ps1
```

### To Restart with HTTP (no camera):
```powershell
.\start-project.ps1
```

---

## 📝 Important Notes

1. **Same Wi-Fi Required**: Your phone and computer must be on the same Wi-Fi network
2. **Security Warning is Normal**: The warning appears because we're using a self-signed certificate
3. **Camera Requires HTTPS**: Modern browsers require HTTPS for camera access
4. **Keep PowerShell Windows Open**: Don't close them while using the app

---

## 🎨 Features Available on Mobile

- ✅ Live Color Detector (with camera)
- ✅ Color Picker (with camera)
- ✅ Color Blindness Simulator (with camera)
- ✅ Palette Checker
- ✅ Traffic Signal Detector (with camera)
- ✅ All other features

---

## 🐛 Troubleshooting

### Can't Connect from Mobile?
1. Verify both devices are on the same Wi-Fi
2. Check Windows Firewall (may need to allow port 3000)
3. Try restarting the services

### Camera Not Working?
1. Make sure you're using HTTPS (not HTTP)
2. Accept the security warning
3. Grant camera permissions when prompted
4. Try refreshing the page

### IP Address Changed?
If your IP address changes (e.g., after reconnecting to Wi-Fi):
1. Run: `ipconfig` in PowerShell
2. Look for your new IPv4 address
3. Update the URL accordingly

---

## 📞 Need Help?

If you encounter any issues:
1. Check that all services are running (look at PowerShell windows)
2. Verify your IP address hasn't changed
3. Make sure firewall isn't blocking port 3000
4. Try restarting the services

---

**Generated:** 2026-02-10 22:20 IST
**Your IP:** 172.20.10.10
**Mobile URL:** https://172.20.10.10:3000
