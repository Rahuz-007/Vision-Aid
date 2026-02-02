# 🧪 Testing Guide - Traffic Signal Detection

## Quick Test Checklist

### ✅ Pre-Test Verification

1. **Check Services Running**
```bash
# Backend should be on port 3000
netstat -ano | findstr :3000

# Frontend should be on port 3001  
netstat -ano | findstr :3001

# YOLO service should be on port 8000
netstat -ano | findstr :8000
```

2. **Check MongoDB Connection**
```bash
# In MongoDB shell
mongo
use vision-aid
db.stats()
```

---

## 🎯 Test 1: Upload Image Detection

### Steps:
1. Open http://localhost:3001
2. Scroll to "Traffic Signal Detection"
3. Click **"Upload Image"** button
4. Select a traffic light image
5. Wait 1-2 seconds

### Expected Results:
✅ Image appears in camera view
✅ Detection shows within 2 seconds
✅ Color displays (RED/YELLOW/GREEN)
✅ Confidence percentage shows
✅ Voice announcement plays (if enabled)
✅ Detection added to history
✅ Console shows logs

### Console Logs to Check:
```
Image uploaded: filename.jpg
Image loaded: 800 x 600
Canvas created for uploaded image
Analyzing canvas: { width: 800, height: 600, mode: 'upload' }
Detection: { color: 'red', confidence: 95, ... }
Upload mode - immediate detection
New detection received
Detection saved to database
```

### If It Fails:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls
- Verify image is a traffic light
- Try a different image

---

## 🎯 Test 2: Live Camera Detection

### Steps:
1. Click **"Live Camera"** mode button
2. Click **"Start Camera"** button
3. Allow camera permissions
4. Point camera at:
   - Real traffic light, OR
   - Red/yellow/green colored object, OR
   - Traffic light image on screen

### Expected Results:
✅ Camera starts and shows live feed
✅ Status badge shows "Active"
✅ Detection occurs within 2-3 seconds
✅ Color updates in real-time
✅ Voice announces changes
✅ History updates continuously
✅ Confidence scores display

### Console Logs to Check:
```
Camera ready: true
Analyzing canvas: { width: 1280, height: 720, mode: 'live' }
Detection: { color: 'red', confidence: 92, ... }
Stable detection: { color: 'red', confidence: 92 }
New detection received
Detection saved to database
```

### If It Fails:
- Check camera permissions in browser
- Ensure good lighting
- Try pointing at bright colored objects
- Check console for errors
- Verify camera is not in use by another app

---

## 🎯 Test 3: MongoDB Integration

### Steps:
1. Perform several detections (upload or live)
2. Open MongoDB shell or Compass
3. Query the database

### MongoDB Commands:
```javascript
// Connect
mongo

// Use database
use vision-aid

// View all detections
db.trafficsignaldetections.find().pretty()

// Count detections
db.trafficsignaldetections.count()

// Get recent 5
db.trafficsignaldetections.find().sort({detectedAt: -1}).limit(5)

// Get by color
db.trafficsignaldetections.find({color: "red"})

// Get statistics
db.trafficsignaldetections.aggregate([
  { $group: { 
    _id: "$color", 
    count: { $sum: 1 },
    avgConfidence: { $avg: "$confidence" }
  }}
])
```

### Expected Results:
✅ Detections are saved in database
✅ All fields populated correctly
✅ Timestamps are accurate
✅ Session IDs match
✅ Mode is correct ('live' or 'upload')

---

## 🎯 Test 4: API Endpoints

### Test Save Detection
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3000/api/traffic-signal/detect" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"color":"red","confidence":95,"detectionMode":"live","sessionId":"test123"}'
```

### Test Get Recent
```bash
Invoke-WebRequest -Uri "http://localhost:3000/api/traffic-signal/recent?limit=5" `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Get by Color
```bash
Invoke-WebRequest -Uri "http://localhost:3000/api/traffic-signal/color/red" `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Statistics
```bash
Invoke-WebRequest -Uri "http://localhost:3000/api/traffic-signal/statistics" `
  -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Expected Results:
✅ All endpoints return 200 OK
✅ Data is in correct JSON format
✅ No errors in response
✅ Data matches database

---

## 🎯 Test 5: Voice Feedback

### Steps:
1. Ensure voice toggle is ON
2. Perform a detection
3. Wait for announcement
4. Change signal color
5. Listen for new announcement

### Expected Results:
✅ Voice speaks on first detection
✅ Voice speaks when color changes
✅ Voice does NOT repeat same color
✅ Message is clear and correct:
   - "Red signal detected. Stop."
   - "Yellow signal detected. Get ready."
   - "Green signal detected. Go."
✅ Speaking indicator shows when active
✅ Stop button works

---

## 🎯 Test 6: Theme Toggle

### Steps:
1. Click theme toggle button (🌙/☀️)
2. Verify theme changes
3. Reload page
4. Check if theme persists

### Expected Results:
✅ Theme switches smoothly
✅ All colors update
✅ Text remains readable
✅ Preference saves to localStorage
✅ Theme persists after reload

---

## 🎯 Test 7: Detection History

### Steps:
1. Perform 5+ detections
2. Check history panel
3. Verify timestamps
4. Check color coding

### Expected Results:
✅ Last 5 detections shown
✅ Newest at top
✅ Timestamps accurate
✅ Color-coded borders
✅ Confidence percentages
✅ Icons match colors

---

## 🐛 Common Issues & Solutions

### Issue: "No canvas provided"
**Solution**: 
- Check if camera is started
- Verify image is uploaded
- Check console for errors

### Issue: "Canvas has no dimensions"
**Solution**:
- Image might not be loaded
- Try different image
- Check image format (JPG, PNG)

### Issue: "No significant color detected"
**Solution**:
- Image too dark
- No bright colors present
- Try image with clear red/yellow/green

### Issue: "Confidence too low"
**Solution**:
- Improve lighting
- Use clearer image
- Point camera directly at signal
- Lower threshold in code (line 112 of TrafficSignalDetector.js)

### Issue: "Detection saved to database" not showing
**Solution**:
- Check MongoDB is running
- Verify backend is on port 3000
- Check Network tab for failed requests
- Verify CORS is enabled

### Issue: Voice not working
**Solution**:
- Check browser supports Speech API
- Verify audio permissions
- Check system volume
- Try different browser (Chrome recommended)

---

## 📊 Performance Benchmarks

### Target Metrics:
- **Upload Detection**: < 500ms
- **Live Detection**: 1-2 seconds
- **Database Save**: < 100ms
- **API Response**: < 200ms
- **Voice Delay**: < 300ms

### How to Measure:
```javascript
// In browser console
console.time('detection');
// Perform detection
console.timeEnd('detection');
```

---

## ✅ Final Verification

Run through this complete test:

1. ✅ Upload red traffic light → Detects RED
2. ✅ Upload yellow traffic light → Detects YELLOW  
3. ✅ Upload green traffic light → Detects GREEN
4. ✅ Start camera → Shows live feed
5. ✅ Point at red object → Detects RED
6. ✅ Point at green object → Detects GREEN
7. ✅ Check MongoDB → All 6 detections saved
8. ✅ Check history → Shows last 5
9. ✅ Toggle theme → Switches smoothly
10. ✅ Voice feedback → Announces correctly

---

## 🎉 Success Criteria

Your system is working correctly if:

✅ Upload mode detects immediately
✅ Live mode detects within 2 seconds
✅ All detections save to MongoDB
✅ API endpoints respond correctly
✅ Voice announcements work
✅ Theme toggle persists
✅ No console errors
✅ Detection history updates
✅ Confidence scores display
✅ All colors detected accurately

---

## 📸 Screenshot Checklist

Take screenshots of:
1. Upload mode with detection
2. Live mode with camera active
3. Detection history with 5 items
4. MongoDB data in Compass
5. API response in Postman/browser
6. Light mode UI
7. Dark mode UI
8. Console logs showing detection

---

## 🎬 Video Demo Script

Record a 2-minute video showing:

1. **Intro** (10s): "Traffic Signal Detection System"
2. **Upload Mode** (30s): Upload image, show detection
3. **Live Mode** (40s): Start camera, detect signals
4. **Database** (20s): Show MongoDB data
5. **Features** (20s): Voice, theme, history
6. **Outro** (10s): "Thank you"

---

**Happy Testing!** 🚀

If all tests pass, your system is production-ready!
