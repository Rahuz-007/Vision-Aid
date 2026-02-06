import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FaCamera, FaVideo, FaInfoCircle, FaVolumeUp, FaStop, FaHistory, FaCrosshairs, FaCircle, FaSquare, FaPlay } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useColorHistory } from '../../../context/ColorHistoryContext';

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
 */
const TrafficSignalDetector = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const audioContextRef = useRef(null);
  const { addToHistory: addToGlobalHistory } = useColorHistory();

  // State
  const [isDetecting, setIsDetecting] = useState(false);
  const [signalStatus, setSignalStatus] = useState('No Signal');
  const [confidence, setConfidence] = useState(0);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false); // Kept for future use
  const [detectionCount, setDetectionCount] = useState({ red: 0, yellow: 0, green: 0 });

  // Status Debouncing
  const statusHistory = useRef([]);
  // We use adaptive consistency now, so this constant is less strict

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Initialize Audio Context
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  // Play tone for signal detection
  const playTone = useCallback((frequency, duration = 200) => {
    if (!soundEnabled) return;

    initAudio();
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  }, [soundEnabled]);

  // Vibrate for haptic feedback
  const vibrate = useCallback((pattern) => {
    if (!hapticEnabled || !navigator.vibrate) return;
    navigator.vibrate(pattern);
  }, [hapticEnabled]);

  // Speak signal status
  const speak = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; // Slightly faster for immediate feedback
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);

  // Start Camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },    // Standard HD is enough, 4K slows down processing
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
          toast.success("Camera Started - Point at Traffic Light");
          speak("Camera activated.");
        };
      }
    } catch (err) {
      console.error("Camera Error:", err);
      toast.error("Could not access camera. Please check permissions.");
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
  const addToHistory = useCallback((signal, conf) => {
    // 1. Local History (Sidebar)
    const timestamp = new Date();
    const entry = {
      id: timestamp.getTime(),
      signal,
      confidence: conf,
      time: timestamp.toLocaleTimeString(),
      icon: signal === 'Red Light' ? '🔴' : signal === 'Yellow Light' ? '🟡' : '🟢'
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
        colorName = 'Traffic Signal: Green';
      }

      addToGlobalHistory({
        name: colorName,
        hex: hexColor,
        rgb: signal === 'Red Light' ? 'rgb(239, 68, 68)' : signal === 'Yellow Light' ? 'rgb(234, 179, 8)' : 'rgb(34, 197, 94)',
        note: `Signal Confidence: ${conf}%`
      }, 'Traffic Signal Detector');
    }

  }, [addToGlobalHistory]);

  // Detect Traffic Light (OPTIMIZED V2)
  const detectTrafficLight = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isDetecting) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState !== 4) return;

    // 1. DOWNSCALE FOR SPEED
    const processWidth = 320;
    const processHeight = 240;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw full frame for User to see
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 2. SAMPLE CENTER AREA
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const sampleW = Math.min(canvas.width * 0.5, 300); // Max 300px scan area
    const sampleH = Math.min(canvas.height * 0.5, 300);

    // Extract pixel data from center (Heavy operation, kept minimal)
    const imageData = ctx.getImageData(
      centerX - sampleW / 2,
      centerY - sampleH / 2,
      sampleW,
      sampleH
    );
    const data = imageData.data;

    let redScore = 0, greenScore = 0, yellowScore = 0;
    let redCount = 0, greenCount = 0, yellowCount = 0;

    // 3. FAST SCAN (Skip pixels)
    // Scanning every 4th pixel is enough for color blobs
    for (let i = 0; i < data.length; i += 16) { // i += 16 means skip 4 pixels (4 bytes each)
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Get brightness
      const brightness = (r + g + b) / 3;

      // Filter out dark stuff immediately
      if (brightness < 100) continue;

      // 4. RATIO-BASED COLOR LOGIC (Better for Traffic Lights)

      // RED: High Red, Low Green/Blue
      if (r > 160 && r > (g + b) * 0.8) {
        redScore += r;
        redCount++;
      }

      // GREEN: High Green (Result is often slightly Cyan/whitish in cameras)
      // Allow some Blue, but Red must be low.
      else if (g > 160 && g > r + 20 && g > b * 0.6) {
        greenScore += g;
        greenCount++;
      }

      // YELLOW: High Red + High Green, Low Blue
      // Red and Green are similar.
      else if (r > 160 && g > 140 && b < 120 && Math.abs(r - g) < 70) {
        yellowScore += (r + g) / 2;
        yellowCount++;
      }
    }

    // 5. DECISION LOGIC
    let currentFrameStatus = 'No Signal';
    let currentConfidence = 0;
    const totalPixels = data.length / 4;
    const minPixelThreshold = totalPixels * 0.005; // 0.5% of area needs to comprise the light

    if (redCount > minPixelThreshold && redScore > yellowScore && redScore > greenScore) {
      currentFrameStatus = 'Red Light';
      currentConfidence = Math.min(99, Math.round((redCount / (redCount + greenCount + yellowCount)) * 100));
    } else if (yellowCount > minPixelThreshold && yellowScore > greenScore) {
      currentFrameStatus = 'Yellow Light';
      currentConfidence = Math.min(99, Math.round((yellowCount / (redCount + greenCount + yellowCount)) * 100));
    } else if (greenCount > minPixelThreshold) {
      currentFrameStatus = 'Green Light';
      currentConfidence = Math.min(99, Math.round((greenCount / (redCount + greenCount + yellowCount)) * 100));
    }

    // 6. ADAPTIVE CONSISTENCY (Speed vs Accuracy)
    const consistencyRequired = currentConfidence > 80 ? 1 : 3;

    statusHistory.current.push(currentFrameStatus);
    if (statusHistory.current.length > consistencyRequired) {
      statusHistory.current.shift();
    }

    const allMatch = statusHistory.current.every(val => val === currentFrameStatus);
    const isNewState = currentFrameStatus !== signalStatus;
    const isSomethingDetected = currentFrameStatus !== 'No Signal';

    if (allMatch && isNewState && isSomethingDetected) {
      setSignalStatus(currentFrameStatus);
      setConfidence(currentConfidence);

      // Feedback
      speak(currentFrameStatus);

      // Haptics & Sound
      if (currentFrameStatus === 'Red Light') {
        playTone(350, 400);
        vibrate([300, 50, 300]);
      } else if (currentFrameStatus === 'Yellow Light') {
        playTone(550, 300);
        vibrate([200]);
      } else if (currentFrameStatus === 'Green Light') {
        playTone(850, 200);
        vibrate([100, 50, 100]);
      }

      addToHistory(currentFrameStatus, currentConfidence);

      // Draw detection box
      ctx.strokeStyle = currentFrameStatus === 'Red Light' ? '#ef4444' :
        currentFrameStatus === 'Yellow Light' ? '#eab308' : '#22c55e';
      ctx.lineWidth = 10;
      ctx.strokeRect(centerX - sampleW / 2, centerY - sampleH / 2, sampleW, sampleH);
    } else if (allMatch && !isSomethingDetected && signalStatus !== 'No Signal') {
      // Clear status if lost signal
      setSignalStatus('No Signal');
      setConfidence(0);
    }

  }, [signalStatus, speak, isDetecting, playTone, vibrate, addToHistory]);

  // Detection Loop
  useEffect(() => {
    if (isDetecting) {
      const interval = setInterval(detectTrafficLight, 100); // 100ms = 10 FPS (Good balance)
      return () => clearInterval(interval);
    }
  }, [isDetecting, detectTrafficLight]);

  // Get signal shape for accessibility
  const getSignalShape = (signal) => {
    if (signal === 'Red Light') return <FaCircle className="inline" />;
    if (signal === 'Yellow Light') return <FaSquare className="inline rotate-45" />;
    if (signal === 'Green Light') return <FaPlay className="inline rotate-90" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 pt-24 pb-10 font-sans selection:bg-blue-500/30">
      <div className="w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            Accessibility Enhanced
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
            Traffic Signal <span className="text-blue-500">Detector</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-4">
            Designed for color blind users with voice, sound, and haptic feedback
          </p>

          {/* Quick Stats */}
          {isDetecting && (
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              <div className="px-4 py-2 bg-red-900/20 border border-red-900/30 rounded-xl">
                <span className="text-red-400 font-bold">{detectionCount.red}</span>
                <span className="text-gray-500 text-sm ml-2">Red</span>
              </div>
              <div className="px-4 py-2 bg-yellow-900/20 border border-yellow-900/30 rounded-xl">
                <span className="text-yellow-400 font-bold">{detectionCount.yellow}</span>
                <span className="text-gray-500 text-sm ml-2">Yellow</span>
              </div>
              <div className="px-4 py-2 bg-green-900/20 border border-green-900/30 rounded-xl">
                <span className="text-green-400 font-bold">{detectionCount.green}</span>
                <span className="text-gray-500 text-sm ml-2">Green</span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camera View - Main */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800">

              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Crosshair Guide */}
              {isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <FaCrosshairs className="text-6xl text-white/20" />
                </div>
              )}

              {/* Status Overlay */}
              {isDetecting && signalStatus !== 'No Signal' && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute top-6 left-6 right-6"
                >
                  <div className={`p-6 rounded-2xl backdrop-blur-md border-2 ${signalStatus === 'Red Light' ? 'bg-red-900/40 border-red-500' :
                    signalStatus === 'Yellow Light' ? 'bg-yellow-900/40 border-yellow-500' :
                      'bg-green-900/40 border-green-500'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">
                          {signalStatus === 'Red Light' && <FaCircle className="text-red-500" />}
                          {signalStatus === 'Yellow Light' && <FaSquare className="text-yellow-500 rotate-45" />}
                          {signalStatus === 'Green Light' && <FaPlay className="text-green-500 rotate-90" />}
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">{signalStatus}</div>
                          <div className="text-sm text-gray-300">Confidence: {confidence}%</div>
                        </div>
                      </div>
                      {/* Confidence Bar */}
                      <div className="hidden sm:block w-32">
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${signalStatus === 'Red Light' ? 'bg-red-500' :
                              signalStatus === 'Yellow Light' ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Visual Traffic Light Indicator */}
              <div className="absolute top-6 right-6 z-20 flex flex-col items-center bg-gray-900/90 backdrop-blur-sm border-4 border-gray-800 rounded-3xl p-3 shadow-2xl">
                <div className="absolute -top-3 w-full h-4 bg-gray-800 rounded-t-xl" />

                <div className="flex flex-col gap-3 pt-2">
                  {/* Red */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full border-2 border-black transition-all duration-300 flex items-center justify-center ${signalStatus === 'Red Light'
                      ? 'bg-red-600 shadow-[0_0_30px_#ef4444] scale-110'
                      : 'bg-red-950/30 opacity-60'
                      }`}>
                      {signalStatus === 'Red Light' && <FaCircle className="text-white text-xs" />}
                    </div>
                  </div>

                  {/* Yellow */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full border-2 border-black transition-all duration-300 flex items-center justify-center ${signalStatus === 'Yellow Light'
                      ? 'bg-yellow-500 shadow-[0_0_30px_#eab308] scale-110'
                      : 'bg-yellow-950/30 opacity-60'
                      }`}>
                      {signalStatus === 'Yellow Light' && <FaSquare className="text-white text-xs rotate-45" />}
                    </div>
                  </div>

                  {/* Green */}
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full border-2 border-black transition-all duration-300 flex items-center justify-center ${signalStatus === 'Green Light'
                      ? 'bg-green-500 shadow-[0_0_30px_#22c55e] scale-110'
                      : 'bg-green-950/30 opacity-60'
                      }`}>
                      {signalStatus === 'Green Light' && <FaPlay className="text-white text-xs rotate-90" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Camera Access Screen */}
              {!isDetecting && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                  <div className="p-8 rounded-3xl bg-gray-900/50 border border-white/5 text-center max-w-md mx-4">
                    <div className="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
                      <FaCamera className="text-4xl text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Camera Access Required</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                      Point your camera at a traffic light. You'll receive voice, sound, and visual feedback.
                    </p>
                    <button
                      onClick={startCamera}
                      className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      Activate Camera <FaVideo />
                    </button>
                  </div>
                </div>
              )}

              {/* Controls */}
              {isDetecting && (
                <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30 px-4">
                  <button
                    onClick={stopCamera}
                    className="px-6 py-3 bg-red-600/90 hover:bg-red-500 text-white rounded-full font-bold backdrop-blur-md transition-all shadow-lg flex items-center gap-2 transform hover:scale-105"
                  >
                    <FaStop /> Stop
                  </button>
                </div>
              )}
            </div>

            {/* Settings Panel */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${voiceEnabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
                  }`}
              >
                <FaVolumeUp className="inline mr-2" />
                Voice
              </button>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${soundEnabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
                  }`}
              >
                🔊 Sound
              </button>
              <button
                onClick={() => setHapticEnabled(!hapticEnabled)}
                className={`px-4 py-3 rounded-xl font-medium transition-all ${hapticEnabled
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400'
                  }`}
              >
                📳 Haptic
              </button>
            </div>
          </div>

          {/* Detection History Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 h-full">
              <div className="flex items-center gap-2 mb-6">
                <FaHistory className="text-blue-500" />
                <h3 className="text-xl font-bold">Detection History</h3>
              </div>

              {detectionHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FaInfoCircle className="text-4xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No detections yet</p>
                  <p className="text-xs mt-2">Point camera at traffic light</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                  <AnimatePresence>
                    {detectionHistory.map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-4 rounded-xl border-2 ${entry.signal === 'Red Light' ? 'bg-red-900/20 border-red-900/30' :
                          entry.signal === 'Yellow Light' ? 'bg-yellow-900/20 border-yellow-900/30' :
                            'bg-green-900/20 border-green-900/30'
                          }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{entry.icon}</span>
                            <span className="text-lg">{getSignalShape(entry.signal)}</span>
                          </div>
                          <span className="text-xs text-gray-400">{entry.time}</span>
                        </div>
                        <div className="text-sm font-semibold">{entry.signal}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          Confidence: {entry.confidence}%
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="text-3xl mb-3">🔺</div>
            <h4 className="font-bold text-lg mb-2">Shape Recognition</h4>
            <p className="text-sm text-gray-400">Circle (Red), Diamond (Yellow), Triangle (Green)</p>
          </div>
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="text-3xl mb-3">🔊</div>
            <h4 className="font-bold text-lg mb-2">Audio Feedback</h4>
            <p className="text-sm text-gray-400">Voice announcements + unique sound tones</p>
          </div>
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="text-3xl mb-3">📳</div>
            <h4 className="font-bold text-lg mb-2">Haptic Patterns</h4>
            <p className="text-sm text-gray-400">Different vibration patterns for each signal</p>
          </div>
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
