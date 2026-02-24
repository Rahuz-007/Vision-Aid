import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaCamera, FaVideo, FaInfoCircle, FaVolumeUp, FaStop, FaHistory, FaCrosshairs, FaCircle, FaSquare, FaPlay, FaBolt, FaDownload, FaSlidersH, FaBell, FaExclamationTriangle, FaArrowLeft, FaArrowRight, FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useColorHistory } from '../../../context/ColorHistoryContext';
import EmptyState, { EmptyStateCompact } from '../../common/EmptyState';
import CameraPermissionGuide from '../../common/CameraPermissionGuide';

/**
 * Professional Traffic Signal Detector for Color Blind Users
 * Features:
 * - Voice announcements
 * - Visual patterns (shapes + colors)
 * - Confidence levels
 * - Detection history
 * - Haptic feedback (mobile)
 * - Sound alerts
 * - Auto-focus assistance
 * - Flashlight toggle
 * - Screenshot capture
 * - Volume controls
 * - Distance warning
 * - Low confidence alerts
 * - Signal change notifications
 * - Arrow direction detection (left/right/straight)
 */
const TrafficSignalDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const { addToHistory: addToGlobalHistory } = useColorHistory();
  const noSignalTimeoutRef = useRef(null);
  const lastSignalRef = useRef('No Signal');

  // State
  const [isDetecting, setIsDetecting] = useState(false);
  const [signalStatus, setSignalStatus] = useState('No Signal');
  const [confidence, setConfidence] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [detectionCount, setDetectionCount] = useState({ red: 0, yellow: 0, green: 0 });
  const [cameraError, setCameraError] = useState(null); // for CameraPermissionGuide

  // NEW: Enhanced Features State
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(1.0);
  const [soundVolume, setSoundVolume] = useState(0.3);
  const [vibrationIntensity, setVibrationIntensity] = useState('medium'); // 'off', 'low', 'medium', 'high'
  const [distanceWarning, setDistanceWarning] = useState(''); // 'too-far', 'optimal', 'too-close'
  const [showVolumeControls, setShowVolumeControls] = useState(false);
  const [arrowDirection, setArrowDirection] = useState(null); // 'left', 'right', 'straight', null

  // AI Integration
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [aiStatus, setAiStatus] = useState('offline'); // 'offline', 'connecting', 'active'
  const lastAiCallTime = useRef(0);
  const aiOverride = useRef({ status: null, expires: 0 });

  // Status Debouncing
  const statusHistory = useRef([]);
  // We use adaptive consistency now, so this constant is less strict

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      const ac = audioContextRef.current;
      if (ac && ac.state !== 'closed') {
        ac.close().catch(() => { }); // ignore any race-condition errors
        audioContextRef.current = null;
      }
    };
  }, []);

  // Initialize Audio Context
  const initAudio = () => {
    // Re-create if missing or already closed (e.g. after hot-reload cleanup)
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Play tone for signal detection (with volume control and directional support)
  const playTone = useCallback((frequency, duration = 200, direction = null) => {
    if (!soundEnabled) return;

    initAudio();
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';

    // Use soundVolume state
    gainNode.gain.setValueAtTime(soundVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    // Directional tone patterns for arrows
    if (direction === 'left') {
      // Descending tone for left arrow
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, audioContext.currentTime + duration / 1000);
    } else if (direction === 'right') {
      // Ascending tone for right arrow
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, audioContext.currentTime + duration / 1000);
    } else if (direction === 'straight') {
      // Double beep for straight arrow
      oscillator.frequency.value = frequency;
      // Will play twice in the calling function
    } else {
      // Standard steady tone
      oscillator.frequency.value = frequency;
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }, [soundEnabled, soundVolume]);

  // Vibrate for haptic feedback (with intensity control)
  const vibrate = useCallback((pattern) => {
    if (!hapticEnabled || vibrationIntensity === 'off') return;

    // Adjust pattern based on intensity
    let adjustedPattern = pattern;
    if (Array.isArray(pattern)) {
      const multiplier = vibrationIntensity === 'low' ? 0.5 : vibrationIntensity === 'high' ? 1.5 : 1;
      adjustedPattern = pattern.map(val => Math.round(val * multiplier));
    }

    // Check for vibration API support
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(adjustedPattern);
      } catch (e) {
        console.warn('Vibration failed:', e);
      }
    } else if ('mozVibrate' in navigator) {
      try {
        navigator.mozVibrate(adjustedPattern);
      } catch (e) {
        console.warn('Vibration failed:', e);
      }
    } else if ('webkitVibrate' in navigator) {
      try {
        navigator.webkitVibrate(adjustedPattern);
      } catch (e) {
        console.warn('Vibration failed:', e);
      }
    }
  }, [hapticEnabled, vibrationIntensity]);

  // Speak signal status (with volume control)
  const speak = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = voiceVolume; // Use voiceVolume state
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled, voiceVolume]);

  // NEW: Toggle Flashlight
  const toggleFlashlight = useCallback(async () => {
    if (!streamRef.current) return;

    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities = track.getCapabilities();

      if (!capabilities.torch) {
        toast.error('Flashlight not supported on this device');
        return;
      }

      const newState = !flashlightOn;
      await track.applyConstraints({
        advanced: [{ torch: newState }]
      });

      setFlashlightOn(newState);
      toast.success(newState ? '🔦 Flashlight ON' : 'Flashlight OFF');
    } catch (err) {
      console.error('Flashlight error:', err);
      toast.error('Could not toggle flashlight');
    }
  }, [flashlightOn]);

  // NEW: Capture Screenshot
  const captureScreenshot = useCallback(() => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');

      // Create download link
      const link = document.createElement('a');
      link.download = `traffic-signal-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      toast.success('📸 Screenshot saved!');
      speak('Screenshot captured');
    } catch (err) {
      console.error('Screenshot error:', err);
      toast.error('Could not save screenshot');
    }
  }, [speak]);

  // NEW: Check Distance (based on detection box size)
  const checkDistance = useCallback((detectionSize) => {
    // detectionSize is the percentage of frame covered by traffic light
    if (detectionSize < 5) {
      setDistanceWarning('too-far');
      return 'too-far';
    } else if (detectionSize > 40) {
      setDistanceWarning('too-close');
      return 'too-close';
    } else {
      setDistanceWarning('optimal');
      return 'optimal';
    }
  }, []);

  // NEW: No Signal Timeout Handler
  useEffect(() => {
    if (isDetecting && signalStatus === 'No Signal') {
      // Start timeout
      noSignalTimeoutRef.current = setTimeout(() => {
        toast('⚠️ No traffic light detected\nPoint camera at traffic light', {
          icon: '🚦',
          duration: 3000,
        });
        speak('No traffic light detected. Please point camera at traffic light.');
        vibrate([200, 100, 200]);
      }, 5000); // 5 seconds
    } else {
      // Clear timeout if signal detected
      if (noSignalTimeoutRef.current) {
        clearTimeout(noSignalTimeoutRef.current);
        noSignalTimeoutRef.current = null;
      }
    }

    return () => {
      if (noSignalTimeoutRef.current) {
        clearTimeout(noSignalTimeoutRef.current);
      }
    };
  }, [isDetecting, signalStatus, speak, vibrate]);

  // NEW: Signal Change Detection
  useEffect(() => {
    if (signalStatus !== 'No Signal' && signalStatus !== lastSignalRef.current && lastSignalRef.current !== 'No Signal') {
      // Signal changed!
      const changeMessage = `Signal changed from ${lastSignalRef.current} to ${signalStatus}`;
      toast(changeMessage, {
        icon: '🔄',
        duration: 2000,
      });
      speak(changeMessage);
    }
    lastSignalRef.current = signalStatus;
  }, [signalStatus, speak]);

  /**
   * detectArrowDirection — centroid-focused row/column profile approach
   *
   * 1. Find centroid of all green pixels in the scan area
   * 2. Focus analysis on a tight ROI around that centroid (removes background noise)
   * 3. Build row-width & column-height profiles inside the ROI
   * 4. Compare top vs bottom (for UP ↑) and left vs right (for ← →)
   */
  const detectArrowDirection = useCallback((imageData) => {
    if (!imageData) return null;

    try {
      const { data, width, height } = imageData;

      // ── Step 1: Find all green pixels + compute centroid ─────────────────
      const mask = new Uint8Array(width * height);
      let totalGreen = 0, sumX = 0, sumY = 0;

      for (let py = 0; py < height; py++) {
        for (let px = 0; px < width; px++) {
          const idx = (py * width + px) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          const max = Math.max(r, g, b);
          if (max === 0) continue;
          const s = (max - Math.min(r, g, b)) / max;
          const v = max / 255;
          if (g === max && g > r && g > b && s > 0.28 && v > 0.30) {
            mask[py * width + px] = 1;
            totalGreen++;
            sumX += px;
            sumY += py;
          }
        }
      }

      if (totalGreen < 60) return null;

      // ── Step 2: Focus ROI around centroid (cuts out background noise) ─────
      const cx = Math.round(sumX / totalGreen);
      const cy = Math.round(sumY / totalGreen);

      // Window = ±35% of full scan dimensions, clamped to image bounds
      const roiHalfW = Math.floor(width * 0.35);
      const roiHalfH = Math.floor(height * 0.35);
      const x0 = Math.max(0, cx - roiHalfW);
      const x1 = Math.min(width - 1, cx + roiHalfW);
      const y0 = Math.max(0, cy - roiHalfH);
      const y1 = Math.min(height - 1, cy + roiHalfH);

      const roiW = x1 - x0 + 1;
      const roiH = y1 - y0 + 1;
      const halfROIH = Math.floor(roiH / 2);
      const halfROIW = Math.floor(roiW / 2);

      // ── Step 3: Row-width profile inside ROI ─────────────────────────────
      // UP ↑ arrow: top rows are WIDE (arrowhead), bottom rows are NARROW (shaft)
      const rowW = new Float32Array(roiH);
      for (let py = y0; py <= y1; py++) {
        let cnt = 0;
        for (let px = x0; px <= x1; px++) {
          if (mask[py * width + px]) cnt++;
        }
        rowW[py - y0] = cnt;
      }

      // ── Step 4: Column-height profile inside ROI ─────────────────────────
      // LEFT ← arrow: left cols are TALL (arrowhead), right cols are SHORT (shaft)
      // RIGHT → arrow: right cols are TALL, left cols are SHORT
      const colH = new Float32Array(roiW);
      for (let px = x0; px <= x1; px++) {
        let cnt = 0;
        for (let py = y0; py <= y1; py++) {
          if (mask[py * width + px]) cnt++;
        }
        colH[px - x0] = cnt;
      }

      // ── Step 5: Average first-half vs second-half ────────────────────────
      let rowTopAvg = 0, rowBotAvg = 0;
      for (let i = 0; i < halfROIH; i++) rowTopAvg += rowW[i];
      for (let i = halfROIH; i < roiH; i++) rowBotAvg += rowW[i];
      rowTopAvg /= halfROIH || 1;
      rowBotAvg /= (roiH - halfROIH) || 1;

      let colLeftAvg = 0, colRightAvg = 0;
      for (let i = 0; i < halfROIW; i++) colLeftAvg += colH[i];
      for (let i = halfROIW; i < roiW; i++) colRightAvg += colH[i];
      colLeftAvg /= halfROIW || 1;
      colRightAvg /= (roiW - halfROIW) || 1;

      // ── Step 6: Score each direction ─────────────────────────────────────
      // Arrow head/shaft ratio — a clean arrow = clearly > 1; plain circle ≈ 1
      const safe = (a, b) => (b > 0 ? a / b : (a > 0 ? 9 : 1));

      const scoreUp = safe(rowTopAvg, rowBotAvg);   // wide-top    → ↑
      const scoreLeft = safe(colLeftAvg, colRightAvg); // tall-left   → ←
      const scoreRight = safe(colRightAvg, colLeftAvg);  // tall-right  → →

      const THRESH = 1.3; // head must be ≥30% wider/taller than shaft

      const best = [
        { dir: 'straight', score: scoreUp },
        { dir: 'left', score: scoreLeft },
        { dir: 'right', score: scoreRight },
      ].sort((a, b) => b.score - a.score)[0];

      if (best.score >= THRESH) return best.dir;

      return null; // near-equal distribution → plain circle
    } catch (err) {
      console.error('Arrow detection error:', err);
      return null;
    }
  }, []);



  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      };
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsDetecting(true);
          toast.success('Camera Started - Point at Traffic Light');
          speak('Camera activated.');
        };
      }
    } catch (err) {
      console.error('Camera Error:', err);
      setCameraError(err);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsDetecting(false);
      setSignalStatus('No Signal');
      setConfidence(0);
      toast('Camera Stopped', { icon: '⏹️' });
    }
  };

  // Smart Camera: Stop if tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && streamRef.current && isDetecting) {
        stopCamera();
        toast('Camera paused to save energy 🔋', { icon: 'zzz' });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isDetecting]);

  // Add to history
  const addToHistory = useCallback((signal, conf, arrow = null) => {
    // 1. Local History (Sidebar)
    const timestamp = new Date();

    // Generate icon based on signal and arrow
    let icon = signal === 'Red Light' ? '🔴' : signal === 'Yellow Light' ? '🟡' : '🟢';
    let displaySignal = signal;

    // Add arrow to display if present
    if (signal === 'Green Light' && arrow) {
      if (arrow === 'left') {
        icon = '🟢 ←';
        displaySignal = 'Green Left Arrow';
      } else if (arrow === 'right') {
        icon = '🟢 →';
        displaySignal = 'Green Right Arrow';
      } else if (arrow === 'straight') {
        icon = '🟢 ↑';
        displaySignal = 'Green Straight Arrow';
      }
    }

    const entry = {
      id: timestamp.getTime(),
      signal: displaySignal,
      confidence: conf,
      time: timestamp.toLocaleTimeString(),
      icon,
      arrow // Store arrow direction
    };

    setDetectionHistory(prev => [entry, ...prev].slice(0, 10));

    // Update counts
    setDetectionCount(prev => ({
      ...prev,
      red: signal === 'Red Light' ? prev.red + 1 : prev.red,
      yellow: signal === 'Yellow Light' ? prev.yellow + 1 : prev.yellow,
      green: signal === 'Green Light' ? prev.green + 1 : prev.green
    }));

    // 2. Global History (Saved Colors Page)
    if (addToGlobalHistory) {
      let hexColor = '#888888';
      let colorName = signal;

      if (signal === 'Red Light') {
        hexColor = '#ef4444';
        colorName = 'Traffic Signal: Red';
      } else if (signal === 'Yellow Light') {
        hexColor = '#eab308';
        colorName = 'Traffic Signal: Yellow';
      } else if (signal === 'Green Light') {
        hexColor = '#22c55e';
        if (arrow === 'left') {
          colorName = 'Traffic Signal: Green Left Arrow';
        } else if (arrow === 'right') {
          colorName = 'Traffic Signal: Green Right Arrow';
        } else if (arrow === 'straight') {
          colorName = 'Traffic Signal: Green Straight Arrow';
        } else {
          colorName = 'Traffic Signal: Green';
        }
      }

      addToGlobalHistory({
        name: colorName,
        hex: hexColor,
        rgb: signal === 'Red Light' ? 'rgb(239, 68, 68)' : signal === 'Yellow Light' ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)',
        note: `Signal Confidence: ${conf}%`
      }, 'Traffic Signal Detector');
    }

  }, [addToGlobalHistory]);

  // Helper: RGB to HSV conversion
  const rgbToHsv = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) {
      h = 0; // achromatic
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, v * 100];
  };

  // AI Detection Service
  const detectWithAI = useCallback(async (blob) => {
    if (Date.now() - lastAiCallTime.current < 500) return; // Limit to 2 FPS
    lastAiCallTime.current = Date.now();

    const formData = new FormData();
    formData.append('image', blob, 'frame.jpg');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s Timeout

      const response = await fetch('http://localhost:5000/detect', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        setAiStatus('active');

        if (result.detections && result.detections.length > 0) {
          // Find highest confidence traffic light
          const bestDetection = result.detections.sort((a, b) => b.confidence - a.confidence)[0];

          let aiSignal = 'No Signal';
          if (bestDetection.color === 'red') aiSignal = 'Red Light';
          else if (bestDetection.color === 'yellow') aiSignal = 'Yellow Light';
          else if (bestDetection.color === 'green') aiSignal = 'Green Light';

          if (aiSignal !== 'No Signal') {
            aiOverride.current = {
              status: aiSignal,
              expires: Date.now() + 1000 // Trust AI for 1 second
            };
            // Update confidence to the AI's confidence
            setConfidence(Math.round(bestDetection.confidence * 100));
          }
        }
      } else {
        setAiStatus('offline');
      }
    } catch (err) {
      // AI Service likely not running
      setAiStatus('offline');
    }
  }, []);

  // Detect Traffic Light (OPTIMIZED Hybrid: HSV + AI)
  const detectTrafficLight = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isDetecting) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState !== 4) return;

    // 1. DOWNSCALE FOR SPEED & ACCURACY
    // Small resolution reduces noise and improves performance
    const processWidth = 320;
    const processHeight = 240;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw for user
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. SAMPLE CENTER AREA (Traffic lights are usually centered when user points camera)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sampleW = Math.min(canvas.width * 0.6, 400); // 60% width scan
    const sampleH = Math.min(canvas.height * 0.6, 400);

    // Draw scanning box on UI
    if (isDetecting) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - sampleW / 2, centerY - sampleH / 2, sampleW, sampleH);
    }

    const imageData = ctx.getImageData(
      centerX - sampleW / 2,
      centerY - sampleH / 2,
      sampleW,
      sampleH
    );
    const data = imageData.data;

    let redCount = 0, greenCount = 0, yellowCount = 0;
    let currentArrow = null; // local var — avoids stale React state

    // 3. ROBUST HSV SCAN (Client Side - Fast)
    // Skip every 4 pixels for performance (still very accurate)
    for (let i = 0; i < data.length; i += 16) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Convert to HSV - distinct advantage per lighting condition
      const [h, s, v] = rgbToHsv(r, g, b);

      // Traffic lights are BRIGHT (Value high) and COLORFUL (Saturation high)
      // Filter out dull/dark objects (asphalt, cars, buildings)
      if (v < 50 || s < 40) continue;

      // RED: Hue 0-15 or 340-360
      // Expanded range for "Traffic Red" which can be orange-red
      if ((h >= 0 && h <= 18) || (h >= 340 && h <= 360)) {
        if (s > 60 && v > 60) redCount++;
      }

      // YELLOW: Hue 35-65 (Expanded range for amber/yellow traffic lights)
      // Yellow/amber lights can vary significantly in hue
      // Lower saturation threshold as yellow can appear washed out
      else if (h >= 35 && h <= 65) {
        if (s > 45 && v > 55) yellowCount++;
      }

      // GREEN: Hue 80-190 (allowing for bluish/cyan greens common in LEDs)
      // Traffic green is often "Cyan" (Hue ~180) to distinct from foliage
      else if (h >= 80 && h <= 190) {
        if (s > 40 && v > 50) greenCount++;
      }
    }

    // 4. THRESHOLD & CONFIDENCE CALCULATION
    let currentFrameStatus = 'No Signal';
    let currentConfidence = 0;

    // Total pixels scanned (divided by the skip step)
    const totalPixelsScanned = data.length / 16;

    // Require at least 0.5% of the scanned area to be the color 
    // (Prevents single pixel noise)
    const minPixelThreshold = totalPixelsScanned * 0.005;

    // Find dominant color
    if (redCount > yellowCount && redCount > greenCount && redCount > minPixelThreshold && redCount > 50) {
      currentFrameStatus = 'Red Light';
      currentConfidence = Math.min(99, Math.round((redCount / (redCount + greenCount + yellowCount + 1)) * 100)); // Normalized against other signals
    } else if (yellowCount > redCount && yellowCount > greenCount && yellowCount > minPixelThreshold && yellowCount > 50) {
      currentFrameStatus = 'Yellow Light';
      currentConfidence = Math.min(99, Math.round((yellowCount / (redCount + greenCount + yellowCount + 1)) * 100));
    } else if (greenCount > redCount && greenCount > yellowCount && greenCount > minPixelThreshold && greenCount > 50) {
      currentFrameStatus = 'Green Light';
      currentConfidence = Math.min(99, Math.round((greenCount / (redCount + greenCount + yellowCount + 1)) * 100));

      // ── Arrow Direction Detection ──────────────────────────────────────
      // Pass the already-extracted imageData (the scan-area) directly.
      // detectArrowDirection analyses green pixel distribution inside it.
      const detectedArrow = detectArrowDirection(imageData);
      setArrowDirection(detectedArrow);

      // Use detectedArrow (local var) immediately — don't wait for React re-render
      currentArrow = detectedArrow;
    }

    // 5. HYBRID AI CHECK
    if (isAiEnabled && Date.now() - lastAiCallTime.current > 500) {
      // Create a blob from the canvas to send to AI
      canvas.toBlob(blob => {
        if (blob) detectWithAI(blob);
      }, 'image/jpeg', 0.8);
    }

    // Override with AI result if valid
    if (aiOverride.current.status && Date.now() < aiOverride.current.expires) {
      currentFrameStatus = aiOverride.current.status;
      // AI is authoritative
    }

    // 6. SMART CONSISTENCY CHECK
    // Only change state if we see the SAME signal for multiple frames
    // This removes "flicker" from noise
    statusHistory.current.push(currentFrameStatus);
    if (statusHistory.current.length > 5) { // Check last 5 frames (~0.5s)
      statusHistory.current.shift();
    }

    const relevantHistory = statusHistory.current.filter(s => s !== 'No Signal');
    const mostFrequent = relevantHistory.sort((a, b) =>
      relevantHistory.filter(v => v === a).length - relevantHistory.filter(v => v === b).length
    ).pop();

    const isStable = relevantHistory.filter(v => v === mostFrequent).length >= 3;

    if (isStable && mostFrequent && mostFrequent !== signalStatus) {
      setSignalStatus(mostFrequent);
      setConfidence(currentConfidence > 0 ? currentConfidence : 50); // Fallback confidence

      // NEW: Low Confidence Warning
      if (currentConfidence < 60 && currentConfidence > 0) {
        toast.warning(`⚠️ Low confidence (${currentConfidence}%)\nPlease verify signal`, {
          duration: 2000,
        });
      }

      // Feedback with arrow direction support
      let announcement = mostFrequent;

      if (mostFrequent === 'Red Light') {
        playTone(350, 400); // Low warning tone
        vibrate([300, 100, 300]); // Long-short-long pattern for RED (danger)
        speak(announcement);
      } else if (mostFrequent === 'Yellow Light') {
        playTone(550, 300); // Mid tone
        vibrate([200, 100, 200]); // Medium double pulse for YELLOW (caution)
        speak(announcement);
      } else if (mostFrequent === 'Green Light') {
        // Arrow-specific announcements and feedback (use currentArrow, not stale state)
        if (currentArrow === 'left') {
          announcement = 'Green arrow - turn left safe';
          playTone(850, 250, 'left');
          vibrate([100, 50, 100]);
        } else if (currentArrow === 'right') {
          announcement = 'Green arrow - turn right safe';
          playTone(850, 250, 'right');
          vibrate([150, 50, 150]);
        } else if (currentArrow === 'straight') {
          announcement = 'Green arrow - go straight';
          playTone(850, 150, 'straight');
          setTimeout(() => playTone(850, 150, 'straight'), 200);
          vibrate([100, 50, 100, 50, 100]);
        } else {
          announcement = 'Green light - proceed with caution';
          playTone(850, 200);
          vibrate([100, 50, 100, 50, 100]);
        }
        speak(announcement);
      }

      addToHistory(mostFrequent, currentConfidence, currentArrow);
    } else if (statusHistory.current.every(s => s === 'No Signal')) {
      setSignalStatus('No Signal');
      setConfidence(0);
    }

    // NEW: Distance Check (based on sample area size)
    const frameArea = canvas.width * canvas.height;
    const sampleArea = sampleW * sampleH;
    const coveragePercent = (sampleArea / frameArea) * 100;
    checkDistance(coveragePercent);

    // Draw HUD Box if signal detected
    if (signalStatus !== 'No Signal') {
      ctx.strokeStyle = signalStatus === 'Red Light' ? '#ef4444' :
        signalStatus === 'Yellow Light' ? '#eab308' : '#22c55e';
      ctx.lineWidth = 10;
      ctx.strokeRect(centerX - sampleW / 2, centerY - sampleH / 2, sampleW, sampleH);
    }

  }, [signalStatus, speak, isDetecting, playTone, vibrate, addToHistory, checkDistance, detectArrowDirection]);

  // Detection Loop
  useEffect(() => {
    if (isDetecting) {
      const interval = setInterval(detectTrafficLight, 100); // 100ms = 10 FPS (Good balance)
      return () => clearInterval(interval);
    }
  }, [isDetecting, detectTrafficLight]);

  // Get signal shape for accessibility (with arrow support)
  const getSignalShape = (signal, arrow = null) => {
    if (signal === 'Red Light') return <FaCircle className="inline" />;
    if (signal === 'Yellow Light') return <FaSquare className="inline rotate-45" />;
    if (signal === 'Green Light') {
      // Show arrow icon if present
      if (arrow === 'left') return <FaArrowLeft className="inline" />;
      if (arrow === 'right') return <FaArrowRight className="inline" />;
      if (arrow === 'straight') return <FaArrowUp className="inline" />;
      return <FaPlay className="inline rotate-90" />;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 pt-24 pb-20 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">{/* Header */}

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Accessibility Enhanced
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            Traffic Signal <span className="text-blue-600 dark:text-blue-500">Detector</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base mb-4">
            Professional AI-native detection for color blind accessibility
          </p>

          {/* Quick Stats */}
          {isDetecting && (
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              <div className="px-4 py-2 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl">
                <span className="text-red-600 dark:text-red-400 font-bold">{detectionCount.red}</span>
                <span className="text-gray-600 dark:text-gray-500 text-sm ml-2">Red</span>
              </div>
              <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-xl">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold">{detectionCount.yellow}</span>
                <span className="text-gray-600 dark:text-gray-500 text-sm ml-2">Yellow</span>
              </div>
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-xl">
                <span className="text-green-600 dark:text-green-400 font-bold">{detectionCount.green}</span>
                <span className="text-gray-600 dark:text-gray-500 text-sm ml-2">Green</span>
              </div>
            </div>
          )}
        </div>


        {/* Main Content Grid - Fixed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-8 relative items-start">
          {/* Camera View - Main */}
          <div className="w-full">
            {/* Camera Container with 16:9 Aspect Ratio */}
            <div className="relative w-full aspect-video bg-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-900 rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200 dark:border-gray-800/50 hover:border-gray-300 dark:hover:border-gray-700/50 transition-all duration-300">

              {/* Gradient Border Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none z-[1]" />

              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-contain bg-black z-0"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
              />

              {/* Crosshair Guide - Centered */}
              {isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[3]">
                  <FaCrosshairs className="text-5xl text-white/10" />
                </div>
              )}

              {/* Status Overlay - Top with better spacing */}
              {isDetecting && signalStatus !== 'No Signal' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  className="absolute top-4 left-4 right-4 z-[15]"
                >
                  <div className={`p-5 rounded-2xl backdrop-blur-xl border-2 shadow-2xl ${signalStatus === 'Red Light'
                    ? 'bg-red-100/90 dark:bg-red-900/50 border-red-500/60 shadow-red-500/20'
                    : signalStatus === 'Yellow Light'
                      ? 'bg-yellow-100/90 dark:bg-yellow-900/50 border-yellow-500/60 shadow-yellow-500/20'
                      : 'bg-green-100/90 dark:bg-green-900/50 border-green-500/60 shadow-green-500/20'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl drop-shadow-lg">
                          {signalStatus === 'Red Light' && <FaCircle className="text-red-400" />}
                          {signalStatus === 'Yellow Light' && <FaSquare className="text-yellow-400 rotate-45" />}
                          {signalStatus === 'Green Light' && !arrowDirection && <FaPlay className="text-green-400 rotate-90" />}
                          {signalStatus === 'Green Light' && arrowDirection === 'left' && <FaArrowLeft className="text-green-400" />}
                          {signalStatus === 'Green Light' && arrowDirection === 'right' && <FaArrowRight className="text-green-400" />}
                          {signalStatus === 'Green Light' && arrowDirection === 'straight' && <FaArrowUp className="text-green-400" />}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-900 dark:text-white drop-shadow-md">
                            {signalStatus}
                          </div>
                          {/* ── LARGE ARROW DIRECTION BADGE ── */}
                          {signalStatus === 'Green Light' && arrowDirection && (
                            <div className={`mt-1.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-black text-sm tracking-wide shadow-lg
                              bg-green-600 text-white border border-green-400/50`}>
                              {arrowDirection === 'left' && <><FaArrowLeft className="text-base" /> Turn Left</>}
                              {arrowDirection === 'right' && <><FaArrowRight className="text-base" /> Turn Right</>}
                              {arrowDirection === 'straight' && <><FaArrowUp className="text-base" /> Go Straight</>}
                            </div>
                          )}
                          <div className="text-sm text-gray-700 dark:text-gray-200/90 font-medium mt-1">Confidence: {confidence}%</div>
                        </div>
                      </div>
                      {/* Confidence Bar */}
                      <div className="hidden sm:block w-32">
                        <div className="h-2.5 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm">
                          <div
                            className={`h-full transition-all duration-300 ${signalStatus === 'Red Light' ? 'bg-red-400' :
                              signalStatus === 'Yellow Light' ? 'bg-yellow-400' :
                                'bg-green-400'
                              }`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                        {aiStatus === 'active' && (
                          <div className="text-[10px] text-right text-blue-300 mt-1.5 font-semibold">
                            ✓ AI Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Visual Traffic Light Indicator - with Pulse Rings */}
              <div className="absolute top-4 right-4 z-[20] flex flex-col items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-2 border-gray-200/50 dark:border-gray-700/50 rounded-3xl p-3 shadow-2xl">
                <div className="absolute -top-2 w-full h-3 bg-gradient-to-b from-gray-800 to-transparent rounded-t-3xl" />

                <div className="flex flex-col gap-2.5 pt-1">
                  {/* Red */}
                  <div className="relative flex items-center justify-center">
                    {signalStatus === 'Red Light' && isDetecting && (
                      <>
                        <motion.div className="absolute inset-0 rounded-full border-2 border-red-500" animate={{ scale: [1, 1.8, 2.4], opacity: [0.7, 0.3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }} />
                        <motion.div className="absolute inset-0 rounded-full border-2 border-red-500" animate={{ scale: [1, 1.8, 2.4], opacity: [0.7, 0.3, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut', delay: 0.5 }} />
                      </>
                    )}
                    <div className={`w-11 h-11 rounded-full border-2 border-gray-100 dark:border-black/50 transition-all duration-300 flex items-center justify-center ${signalStatus === 'Red Light'
                      ? 'bg-red-500 shadow-[0_0_25px_#ef4444] scale-110'
                      : 'bg-red-100/50 dark:bg-red-950/40'
                      }`}>
                      {signalStatus === 'Red Light' && (
                        <FaCircle className="text-white text-lg drop-shadow-lg" />
                      )}
                    </div>
                  </div>

                  {/* Yellow */}
                  <div className="relative flex items-center justify-center">
                    {signalStatus === 'Yellow Light' && isDetecting && (
                      <>
                        <motion.div className="absolute inset-0 rounded-full border-2 border-yellow-500" animate={{ scale: [1, 1.8, 2.4], opacity: [0.7, 0.3, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }} />
                        <motion.div className="absolute inset-0 rounded-full border-2 border-yellow-500" animate={{ scale: [1, 1.8, 2.4], opacity: [0.7, 0.3, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.4 }} />
                      </>
                    )}
                    <div className={`w-11 h-11 rounded-full border-2 border-gray-100 dark:border-black/50 transition-all duration-300 flex items-center justify-center ${signalStatus === 'Yellow Light'
                      ? 'bg-yellow-500 shadow-[0_0_25px_#eab308] scale-110'
                      : 'bg-yellow-100/50 dark:bg-yellow-950/40'
                      }`}>
                      {signalStatus === 'Yellow Light' && (
                        <FaSquare className="text-white text-sm rotate-45 drop-shadow-lg" />
                      )}
                    </div>
                  </div>

                  {/* Green */}
                  <div className="relative flex items-center justify-center">
                    {signalStatus === 'Green Light' && isDetecting && (
                      <>
                        <motion.div className="absolute inset-0 rounded-full border-2 border-green-500" animate={{ scale: [1, 1.8, 2.4], opacity: [0.7, 0.3, 0] }} transition={{ duration: 1.0, repeat: Infinity, ease: 'easeOut' }} />
                        <motion.div className="absolute inset-0 rounded-full border-2 border-green-500" animate={{ scale: [1, 1.8, 2.4], opacity: [0.7, 0.3, 0] }} transition={{ duration: 1.0, repeat: Infinity, ease: 'easeOut', delay: 0.35 }} />
                      </>
                    )}
                    <div className={`w-11 h-11 rounded-full border-2 border-gray-100 dark:border-black/50 transition-all duration-300 flex items-center justify-center ${signalStatus === 'Green Light'
                      ? 'bg-green-500 shadow-[0_0_25px_#22c55e] scale-110'
                      : 'bg-green-100/50 dark:bg-green-950/40'
                      }`}>
                      {signalStatus === 'Green Light' && (
                        <>
                          {!arrowDirection && <FaPlay className="text-white text-sm rotate-90 drop-shadow-lg" />}
                          {arrowDirection === 'left' && <FaArrowLeft className="text-white text-sm drop-shadow-lg" />}
                          {arrowDirection === 'right' && <FaArrowRight className="text-white text-sm drop-shadow-lg" />}
                          {arrowDirection === 'straight' && <FaArrowUp className="text-white text-sm drop-shadow-lg" />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Camera Permission Guide — shown if camera fails */}
              {cameraError && (
                <CameraPermissionGuide
                  error={cameraError}
                  onRetry={() => { setCameraError(null); startCamera(); }}
                  onDismiss={() => setCameraError(null)}
                />
              )}

              {/* Camera Access Screen */}
              {!isDetecting && !cameraError && (
                <div className="absolute inset-0 bg-white/95 dark:bg-gradient-to-br dark:from-black/95 dark:via-gray-900/95 dark:to-black/95 backdrop-blur-md flex items-center justify-center z-40 p-6">
                  <div className="p-8 rounded-3xl bg-white/90 dark:bg-gradient-to-br dark:from-gray-900/80 dark:to-gray-800/80 border-2 border-gray-100 dark:border-gray-700/50 text-center max-w-md w-full shadow-2xl backdrop-blur-xl">
                    <div className="w-24 h-24 bg-blue-50 dark:bg-gradient-to-br dark:from-blue-600/30 dark:to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border-2 border-blue-100 dark:border-blue-500/30 shadow-lg shadow-blue-500/20">
                      <FaCamera className="text-5xl text-blue-500 dark:text-blue-400 drop-shadow-lg" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 drop-shadow-md">Camera Access Required</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-sm">
                      Point your camera at a traffic light. You'll receive voice, sound, and visual feedback for safe navigation.
                    </p>
                    <button
                      onClick={startCamera}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <FaVideo className="text-xl" /> Activate Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Controls - Bottom with better spacing */}
              {isDetecting && (
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-3 z-[30] px-6">
                  <button
                    onClick={stopCamera}
                    className="px-7 py-3.5 bg-red-600/95 hover:bg-red-500 text-white rounded-2xl font-bold backdrop-blur-xl transition-all shadow-xl shadow-red-500/20 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 border border-red-500/30"
                  >
                    <FaStop className="text-sm" /> Stop
                  </button>

                  {/* Flashlight Toggle */}
                  <button
                    onClick={toggleFlashlight}
                    className={`px-7 py-3.5 rounded-2xl font-bold backdrop-blur-xl transition-all shadow-xl flex items-center gap-2.5 transform hover:scale-105 active:scale-95 border ${flashlightOn
                      ? 'bg-yellow-500/95 hover:bg-yellow-400 text-black border-yellow-400/50 shadow-yellow-500/30'
                      : 'bg-white/95 dark:bg-gray-800/95 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700/50 shadow-gray-200/30 dark:shadow-gray-900/30'
                      }`}
                  >
                    <FaBolt className="text-sm" /> {flashlightOn ? 'Light ON' : 'Light'}
                  </button>

                  {/* Screenshot Button */}
                  <button
                    onClick={captureScreenshot}
                    className="px-7 py-3.5 bg-green-600/95 hover:bg-green-500 text-white rounded-2xl font-bold backdrop-blur-xl transition-all shadow-xl shadow-green-500/20 flex items-center gap-2.5 transform hover:scale-105 active:scale-95 border border-green-500/30"
                  >
                    <FaDownload className="text-sm" /> Save
                  </button>
                </div>
              )}

              {/* Distance Warning Indicator - Better positioned */}
              {isDetecting && distanceWarning && distanceWarning !== 'optimal' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-28 left-1/2 transform -translate-x-1/2 z-[25]"
                >
                  {distanceWarning === 'too-far' && (
                    <div className="px-5 py-2.5 bg-orange-500/95 backdrop-blur-xl rounded-full text-white text-sm font-bold shadow-xl shadow-orange-500/30 border border-orange-400/50 flex items-center gap-2">
                      <FaExclamationTriangle /> Move Closer
                    </div>
                  )}
                  {distanceWarning === 'too-close' && (
                    <div className="px-5 py-2.5 bg-orange-500/95 backdrop-blur-xl rounded-full text-white text-sm font-bold shadow-xl shadow-orange-500/30 border border-orange-400/50 flex items-center gap-2">
                      <FaExclamationTriangle /> Move Back
                    </div>
                  )}
                </motion.div>
              )}

              {/* Low Confidence Alert Overlay - Better positioned */}
              {isDetecting && confidence > 0 && confidence < 60 && signalStatus !== 'No Signal' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute bottom-28 left-1/2 transform -translate-x-1/2 z-[25]"
                >
                  <div className="px-5 py-2.5 bg-red-500/95 backdrop-blur-xl rounded-full text-white text-sm font-bold shadow-xl shadow-red-500/30 border border-red-400/50 flex items-center gap-2">
                    <FaExclamationTriangle /> Low Confidence - Verify Signal
                  </div>
                </motion.div>
              )}
            </div>

            {/* Settings Panel - Cleaner spacing */}
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">{/* Voice */}
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${voiceEnabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <FaVolumeUp className="inline mr-2" />
                  Voice
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${soundEnabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  🔊 Sound
                </button>
                <button
                  onClick={() => setHapticEnabled(!hapticEnabled)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${hapticEnabled
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  📳 Haptic
                </button>

                <button
                  onClick={() => setIsAiEnabled(!isAiEnabled)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all border ${isAiEnabled
                    ? 'bg-purple-600 border-purple-500 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    🤖 AI Mode
                    {isAiEnabled && (
                      <span className={`w-2 h-2 rounded-full ${aiStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
                    )}
                  </span>
                </button>

                {/* NEW: Volume Controls Toggle */}
                <button
                  onClick={() => setShowVolumeControls(!showVolumeControls)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${showVolumeControls
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-transparent hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <FaSlidersH className="inline mr-2" />
                  Volume
                </button>
              </div>

              {/* NEW: Volume Controls Panel */}
              <AnimatePresence>
                {showVolumeControls && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm"
                  >
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <FaSlidersH className="text-blue-500" />
                      Volume Controls
                    </h4>

                    <div className="space-y-4">
                      {/* Voice Volume */}
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                          Voice Volume: {Math.round(voiceVolume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={voiceVolume}
                          onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      {/* Sound Volume */}
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                          Sound Volume: {Math.round(soundVolume * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={soundVolume}
                          onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>

                      {/* Vibration Intensity */}
                      <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                          Vibration Intensity
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {['off', 'low', 'medium', 'high'].map((level) => (
                            <button
                              key={level}
                              onClick={() => setVibrationIntensity(level)}
                              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${vibrationIntensity === level
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                            >
                              {level.charAt(0).toUpperCase() + level.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Detection History Sidebar */}
          <div className="w-full">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 h-[600px] lg:h-[650px] flex flex-col shadow-sm">{/* Header */}
              <div className="flex items-center gap-2 mb-6">
                <FaHistory className="text-blue-600 dark:text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Detection History</h3>
              </div>

              {detectionHistory.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <EmptyStateCompact
                    icon={FaHistory}
                    message="No detections yet. Start camera to detect traffic signals."
                  />
                </div>
              ) : (
                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {detectionHistory.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 rounded-xl border-2 flex items-start gap-3 ${entry.signal === 'Red Light' ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30' :
                          entry.signal === 'Yellow Light' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-900/30' :
                            'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30'
                          }`}
                      >
                        {/* Color Stripe */}
                        <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${entry.signal === 'Red Light' ? 'bg-red-500' :
                          entry.signal === 'Yellow Light' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{entry.icon}</span>
                              <span className="text-base">{getSignalShape(entry.signal)}</span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{entry.time}</span>
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{entry.signal}</div>
                          {/* Arrow direction in history */}
                          {entry.arrow && (
                            <div className={`mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold
                              bg-green-600/20 text-green-700 dark:text-green-400 border border-green-500/30`}>
                              {entry.arrow === 'left' && <><FaArrowLeft className="text-[10px]" /> Turn Left</>}
                              {entry.arrow === 'right' && <><FaArrowRight className="text-[10px]" /> Turn Right</>}
                              {entry.arrow === 'straight' && <><FaArrowUp className="text-[10px]" /> Go Straight</>}
                            </div>
                          )}
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Confidence: <span className="font-semibold">{entry.confidence}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Info - Premium Design */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">{/* Shape Recognition */}
          {/* Shape Recognition */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative p-8 bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-900/50 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-3xl overflow-hidden hover:border-red-500/30 transition-all duration-300 shadow-xl hover:shadow-red-500/10"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon Container */}
            <div className="relative mb-6 w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-red-500/20 group-hover:border-red-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/20">
              <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">🔺</div>
            </div>

            {/* Content */}
            <div className="relative">
              <h4 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors duration-300">
                Shape Recognition
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
                Circle (Red), Diamond (Yellow), Triangle (Green)
              </p>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Audio Feedback */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative p-8 bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-900/50 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-300 shadow-xl hover:shadow-blue-500/10"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon Container */}
            <div className="relative mb-6 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/20">
              <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">🔊</div>
            </div>

            {/* Content */}
            <div className="relative">
              <h4 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                Audio Feedback
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
                Voice announcements + unique sound tones
              </p>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>

          {/* Haptic Patterns */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ duration: 0.3 }}
            className="group relative p-8 bg-white dark:bg-gradient-to-br dark:from-gray-900/90 dark:via-gray-900/50 dark:to-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800/50 rounded-3xl overflow-hidden hover:border-orange-500/30 transition-all duration-300 shadow-xl hover:shadow-orange-500/10"
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Icon Container */}
            <div className="relative mb-6 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl flex items-center justify-center border border-orange-500/20 group-hover:border-orange-500/40 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/20">
              <div className="text-4xl transform group-hover:scale-110 transition-transform duration-300">📳</div>
            </div>

            {/* Content */}
            <div className="relative">
              <h4 className="font-bold text-xl mb-3 text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors duration-300">
                Haptic Patterns
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300">
                Different vibration patterns for each signal
              </p>
            </div>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
};

export default TrafficSignalDetector;
