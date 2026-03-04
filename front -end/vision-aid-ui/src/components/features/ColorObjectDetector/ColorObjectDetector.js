import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCamera, FaStop, FaVolumeUp, FaVolumeMute, FaEye, FaEyeSlash,
    FaDownload, FaInfoCircle, FaCircle, FaTags, FaMicrophone,
    FaCheckCircle, FaTimesCircle
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import CameraPermissionGuide from '../../common/CameraPermissionGuide';
import { NAMED_COLORS } from './colorPalette';

const YOLO_URL = 'http://localhost:8000';

// Color palette for bounding boxes — each class gets a consistent color
const CLASS_COLORS = [
    '#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6',
    '#ef4444', '#8b5cf6', '#14b8a6', '#f97316', '#06b6d4',
    '#84cc16', '#e11d48', '#7c3aed', '#0891b2', '#65a30d',
];

// Map class index → consistent color
const getClassColor = (classId) => CLASS_COLORS[classId % CLASS_COLORS.length];




/** Convert RGB to a plain everyday colour name using HSL (mirrors Python backend). */
const getColorName = (r, g, b) => {
    const rf = r / 255, gf = g / 255, bf = b / 255;
    const cmax = Math.max(rf, gf, bf), cmin = Math.min(rf, gf, bf);
    const delta = cmax - cmin;
    const l = (cmax + cmin) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    let h = 0;
    if (delta !== 0) {
        if (cmax === rf) h = 60 * (((gf - bf) / delta) % 6);
        else if (cmax === gf) h = 60 * (((bf - rf) / delta) + 2);
        else h = 60 * (((rf - gf) / delta) + 4);
        if (h < 0) h += 360;
    }
    const shade = (base) => l > 0.72 ? `Light ${base}` : l < 0.28 ? `Dark ${base}` : base;
    if (s < 0.12 || (s < 0.25 && l < 0.38)) {
        if (l > 0.92) return 'White';
        if (l > 0.75) return 'Light Gray';
        if (l > 0.50) return 'Gray';
        if (l > 0.25) return 'Dark Gray';
        return 'Black';
    }
    if (h < 15 || h >= 345) { if (l < 0.28 && s > 0.3) return 'Dark Red'; if (l > 0.72) return 'Light Pink'; return shade('Red'); }
    if (h < 30) { if (l < 0.30) return 'Dark Brown'; if (l < 0.52) return 'Brown'; if (l > 0.72) return 'Peach'; return 'Dark Orange'; }
    if (h < 48) { if (l < 0.35) return 'Brown'; if (l > 0.72) return 'Peach'; if (l > 0.60) return 'Yellow'; return shade('Orange'); }
    if (h < 65) { return l < 0.40 ? 'Dark Yellow' : shade('Yellow'); }
    if (h < 80) { return l < 0.45 ? 'Olive Green' : shade('Yellow'); }
    if (h < 100) { return l < 0.45 ? 'Olive Green' : 'Lime Green'; }
    if (h < 150) { if (l < 0.25) return 'Dark Green'; if (s < 0.35) return 'Olive Green'; return shade('Green'); }
    if (h < 195) return shade('Teal');
    if (h < 205) return l > 0.65 ? 'Light Blue' : 'Sky Blue';
    if (h < 255) { if (l < 0.25) return 'Dark Blue'; if (l < 0.50) return 'Navy Blue'; if (l > 0.70) return 'Light Blue'; return 'Blue'; }
    if (h < 285) return shade('Indigo');
    if (h < 315) { if (l < 0.30) return 'Dark Purple'; if (l > 0.70) return 'Lavender'; return 'Purple'; }
    if (h < 345) { if (l > 0.72) return 'Light Pink'; if (l < 0.30) return 'Dark Pink'; return 'Pink'; }
    return shade('Red');
};

/**
 * Crop a bounding box region from the source canvas into a tiny offscreen canvas,
 * send it to the YOLO /detect-color endpoint, and return the server's colour name.
 * Falls back to local client-side matching if the server call fails.
 */
const fetchColorForBox = async (canvas, box) => {
    try {
        const x = Math.max(0, Math.round(box.x1));
        const y = Math.max(0, Math.round(box.y1));
        const w = Math.max(1, Math.min(Math.round(box.x2 - box.x1), canvas.width - x));
        const h = Math.max(1, Math.min(Math.round(box.y2 - box.y1), canvas.height - y));

        // Draw the bounding box crop into a small offscreen canvas
        const off = document.createElement('canvas');
        off.width = w; off.height = h;
        const octx = off.getContext('2d');
        octx.drawImage(canvas, x, y, w, h, 0, 0, w, h);

        // Also compute local fallback colour from pixels right now
        const px = octx.getImageData(0, 0, w, h).data;
        let tr = 0, tg = 0, tb = 0, cnt = 0;
        for (let i = 0; i < px.length; i += 4) { tr += px[i]; tg += px[i + 1]; tb += px[i + 2]; cnt++; }
        const ar = Math.round(tr / (cnt || 1));
        const ag = Math.round(tg / (cnt || 1));
        const ab = Math.round(tb / (cnt || 1));
        const fallbackName = getColorName(ar, ag, ab);
        const fallbackHex = `#${ar.toString(16).padStart(2, '0')}${ag.toString(16).padStart(2, '0')}${ab.toString(16).padStart(2, '0')}`;

        // Send the crop to the YOLO /detect-color server endpoint
        const blob = await new Promise(resolve => off.toBlob(resolve, 'image/jpeg', 0.85));
        if (!blob) return { color_name: fallbackName, color_hex: fallbackHex };

        const form = new FormData();
        form.append('image', blob, 'crop.jpg');

        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 1500); // 1.5 s timeout per crop
        const res = await fetch(`${YOLO_URL}/detect-color`, {
            method: 'POST', body: form, signal: ctrl.signal
        });
        clearTimeout(timer);

        if (res.ok) {
            const data = await res.json();
            return {
                color_name: data.color_name || fallbackName,
                color_hex: data.hex || fallbackHex,
            };
        }
        return { color_name: fallbackName, color_hex: fallbackHex };
    } catch {
        // Server timeout or error — return local fallback instantly
        return { color_name: null, color_hex: null };
    }
};

/**
 * Enrich all detections with accurate server-side colour names.
 * Runs all crops in parallel (Promise.all) so the total wait time ≈ slowest single crop.
 */
const enrichWithColors = async (detections, canvas) => {
    if (!canvas || !detections.length) return detections;
    const results = await Promise.all(
        detections.map(async (det) => {
            if (!det.box) return det;
            const { color_name, color_hex } = await fetchColorForBox(canvas, det.box);
            return { ...det, color_name, color_hex };
        })
    );
    return results;
};

// Format label + color for voice readout
const buildVoiceText = (detections) => {
    if (!detections.length) return 'No objects detected.';
    const parts = detections.slice(0, 5).map(d => {
        const color = d.color_name ? `${d.color_name} ` : '';
        return `${color}${d.class_name}`;
    });
    return `Detected: ${parts.join(', ')}.`;
};

const ColorObjectDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayCanvasRef = useRef(null);
    const streamRef = useRef(null);
    const detectionLoopRef = useRef(null);
    const lastCallRef = useRef(0);

    const [isDetecting, setIsDetecting] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [detections, setDetections] = useState([]);
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [yoloStatus, setYoloStatus] = useState('offline'); // 'offline' | 'active'
    const [fps, setFps] = useState(0);
    const [totalDetected, setTotalDetected] = useState(0);
    const [lastSpoken, setLastSpoken] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const fpsCounterRef = useRef({ frames: 0, lastTime: Date.now() });

    // ── Check YOLO service health ──────────────────────────────────────────────
    useEffect(() => {
        const check = async () => {
            try {
                const res = await fetch(`${YOLO_URL}/health`, { signal: AbortSignal.timeout(2000) });
                setYoloStatus(res.ok ? 'active' : 'offline');
            } catch {
                setYoloStatus('offline');
            }
        };
        check();
        const interval = setInterval(check, 10000);
        return () => clearInterval(interval);
    }, []);

    // ── Speak text ──────────────────────────────────────────────────────────────
    const speak = useCallback((text) => {
        if (!voiceEnabled || !('speechSynthesis' in window)) return;
        if (text === lastSpoken) return;
        setLastSpoken(text);
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.05;
        u.pitch = 1.0;
        u.volume = 1.0;
        window.speechSynthesis.speak(u);
    }, [voiceEnabled, lastSpoken]);

    // ── Draw bounding boxes on overlay canvas ──────────────────────────────────
    const drawDetections = useCallback((dets, canvasW, canvasH) => {
        const canvas = overlayCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = canvasW;
        canvas.height = canvasH;
        ctx.clearRect(0, 0, canvasW, canvasH);

        if (!showLabels) return;

        dets.forEach((det) => {
            const { box, class_name, confidence, color_name, class_id } = det;
            if (!box) return;

            const color = getClassColor(class_id || 0);
            const x = box.x1, y = box.y1, w = box.x2 - box.x1, h = box.y2 - box.y1;

            // Bounding box
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.shadowBlur = 8;
            ctx.shadowColor = color;
            ctx.strokeRect(x, y, w, h);
            ctx.shadowBlur = 0;

            // Filled label background — show class name only (colour shown in sidebar)
            const label = `${class_name} ${Math.round(confidence * 100)}%`;
            ctx.font = 'bold 13px Inter, system-ui, sans-serif';
            const textW = ctx.measureText(label).width + 12;
            const textH = 22;
            const labelY = y > textH + 4 ? y - textH - 2 : y + 2;

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, labelY, textW, textH, 4);
            ctx.fill();

            // Label text
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, x + 6, labelY + 15);
        });
    }, [showLabels]);

    // ── Send frame to YOLO and get detections ─────────────────────────────────
    const detectFrame = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        if (video.readyState < 2) return;

        // Throttle to ~2 FPS for CPU stability
        const now = Date.now();
        if (now - lastCallRef.current < 500) return;
        lastCallRef.current = now;

        const canvas = canvasRef.current;
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        setIsProcessing(true);
        canvas.toBlob(async (blob) => {
            if (!blob) return;
            const form = new FormData();
            form.append('image', blob, 'frame.jpg');
            form.append('type', 'general'); // detect ALL objects, not just traffic

            try {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), 8000); // 8s timeout for CPU model
                const res = await fetch(`${YOLO_URL}/detect`, {
                    method: 'POST', body: form, signal: controller.signal
                });
                clearTimeout(timer);

                if (res.ok) {
                    const data = await res.json();
                    setYoloStatus('active');

                    // Enrich each detection with accurate server-side colour names (parallel)
                    const raw = data.detections || [];
                    const dets = await enrichWithColors(raw, canvas);
                    setDetections(dets);
                    setTotalDetected(prev => prev + dets.length);

                    // Draw overlays
                    drawDetections(dets, canvas.width, canvas.height);

                    // Voice announce (every ~3s to avoid spam)
                    if (dets.length > 0) {
                        speak(buildVoiceText(dets));
                    }

                    // FPS counter
                    fpsCounterRef.current.frames++;
                    const elapsed = (Date.now() - fpsCounterRef.current.lastTime) / 1000;
                    if (elapsed >= 1) {
                        setFps(Math.round(fpsCounterRef.current.frames / elapsed));
                        fpsCounterRef.current = { frames: 0, lastTime: Date.now() };
                    }
                } else {
                    setYoloStatus('offline');
                }
            } catch (err) {
                if (err.name !== 'AbortError') setYoloStatus('offline');
            } finally {
                setIsProcessing(false);
            }
        }, 'image/jpeg', 0.75);
    }, [drawDetections, speak]);

    // ── Detection loop ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (isDetecting) {
            detectionLoopRef.current = setInterval(detectFrame, 500);
        }
        return () => clearInterval(detectionLoopRef.current);
    }, [isDetecting, detectFrame]);

    // ── Start camera ───────────────────────────────────────────────────────────
    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsDetecting(true);
                    toast.success('📷 Camera started — detecting objects!');
                    speak('Camera activated. Object detection started.');
                };
            }
        } catch (err) {
            setCameraError(err);
        }
    };

    // ── Stop camera ────────────────────────────────────────────────────────────
    const stopCamera = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setIsDetecting(false);
        setDetections([]);
        const ctx = overlayCanvasRef.current?.getContext('2d');
        ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
        toast('Camera stopped', { icon: '⏹️' });
    };

    // ── Screenshot ─────────────────────────────────────────────────────────────
    const takeScreenshot = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `color-detect-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        toast.success('📸 Screenshot saved!');
    };

    // Cleanup on unmount
    useEffect(() => () => stopCamera(), []);

    // ── Top 5 unique objects for sidebar ──────────────────────────────────────
    const uniqueObjects = [...new Map(detections.map(d => [d.class_name, d])).values()].slice(0, 8);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-white">
            {/* ── Header ── */}
            <div className="bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-white/5 px-4 py-5">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                                <FaTags className="text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">Color Object Detector</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                    AI-powered object detection with real-time color labels
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {yoloStatus === 'active' ? (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                <FaCheckCircle className="text-emerald-500" /> AI Online
                            </div>
                        ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                                <FaTimesCircle className="text-red-500" /> AI Offline
                            </div>
                        )}
                        {isDetecting && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-full text-xs font-bold text-violet-400">
                                <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
                                {fps} FPS
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 xl:grid-cols-4 gap-6">

                {/* ── Camera Feed ── */}
                <div className="xl:col-span-3 space-y-4">

                    {/* Video + overlay container */}
                    <div className="relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video border border-white/5">
                        {/* Camera permission guide if error */}
                        {cameraError && (
                            <div className="absolute inset-0 z-20">
                                <CameraPermissionGuide error={cameraError} onRetry={startCamera} />
                            </div>
                        )}

                        {/* Video */}
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                            style={{ display: isDetecting ? 'block' : 'none' }}
                        />

                        {/* Off-screen processing canvas */}
                        <canvas ref={canvasRef} className="hidden" />

                        {/* Overlay canvas for bounding boxes */}
                        <canvas
                            ref={overlayCanvasRef}
                            className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ display: isDetecting ? 'block' : 'none' }}
                        />

                        {/* Idle state */}
                        {!isDetecting && !cameraError && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-[#0d1117] to-[#161b2e]">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-violet-500/20 blur-[60px] rounded-full" />
                                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center">
                                        <FaTags className="text-4xl text-violet-400" />
                                    </div>
                                </div>
                                <div className="text-center">
                                    <p className="text-xl font-bold text-white mb-1">Point your camera at anything</p>
                                    <p className="text-sm text-gray-400 max-w-sm">
                                        YOLO AI will detect objects and label them with their color — perfect for color blind users
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={startCamera}
                                    className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold rounded-2xl shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-shadow"
                                >
                                    <FaCamera className="text-lg" />
                                    Start Detection
                                </motion.button>
                            </div>
                        )}

                        {/* Processing indicator */}
                        {isDetecting && isProcessing && (
                            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur rounded-full text-xs text-white font-medium">
                                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Analyzing...
                            </div>
                        )}

                        {/* Detection count badge */}
                        {isDetecting && detections.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute top-4 right-4 px-3 py-1.5 bg-violet-600/90 backdrop-blur rounded-full text-xs font-bold text-white shadow-lg"
                            >
                                {detections.length} object{detections.length !== 1 ? 's' : ''} detected
                            </motion.div>
                        )}
                    </div>

                    {/* ── Controls Bar ── */}
                    <div className="flex flex-wrap items-center gap-3">
                        {!isDetecting ? (
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                onClick={startCamera}
                                className="flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-violet-500/20"
                            >
                                <FaCamera /> Start Camera
                            </motion.button>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                onClick={stopCamera}
                                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
                            >
                                <FaStop /> Stop
                            </motion.button>
                        )}

                        {/* Voice toggle */}
                        <button
                            onClick={() => setVoiceEnabled(v => !v)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all border ${voiceEnabled
                                ? 'bg-violet-500/10 border-violet-500/40 text-violet-600 dark:text-violet-400'
                                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500'
                                }`}
                        >
                            {voiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                            {voiceEnabled ? 'Voice On' : 'Voice Off'}
                        </button>

                        {/* Labels toggle */}
                        <button
                            onClick={() => setShowLabels(v => !v)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all border ${showLabels
                                ? 'bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-600 dark:text-fuchsia-400'
                                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500'
                                }`}
                        >
                            {showLabels ? <FaEye /> : <FaEyeSlash />}
                            {showLabels ? 'Labels On' : 'Labels Off'}
                        </button>

                        {/* Screenshot */}
                        {isDetecting && (
                            <button
                                onClick={takeScreenshot}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-violet-500/40 transition-all"
                            >
                                <FaDownload /> Screenshot
                            </button>
                        )}

                        {/* Read aloud button */}
                        {detections.length > 0 && (
                            <button
                                onClick={() => {
                                    setLastSpoken(''); // reset to allow re-speak
                                    speak(buildVoiceText(detections));
                                }}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-all"
                            >
                                <FaMicrophone /> Read Aloud
                            </button>
                        )}
                    </div>

                    {/* ── Info Banner ── */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-violet-50 dark:bg-violet-500/5 border border-violet-200 dark:border-violet-500/20 text-sm text-violet-700 dark:text-violet-300">
                        <FaInfoCircle className="flex-shrink-0 mt-0.5" />
                        <p>
                            <strong>How it works:</strong> YOLO AI detects every object in view and labels it with its color name — so color blind users can instantly know the color of clothing, food, objects, and more.
                            Voice readout announces all detections automatically.
                        </p>
                    </div>
                </div>

                {/* ── Sidebar: Detected Objects ── */}
                <div className="xl:col-span-1 space-y-4">

                    {/* Live detections panel */}
                    <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-lg">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                            <h3 className="font-bold text-sm flex items-center gap-2">
                                <FaEye className="text-violet-500" /> Detected Objects
                            </h3>
                            {isDetecting && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-500 uppercase tracking-wider">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Live
                                </span>
                            )}
                        </div>

                        <div className="p-3 space-y-2 max-h-[420px] overflow-y-auto">
                            <AnimatePresence>
                                {uniqueObjects.length === 0 ? (
                                    <div className="py-12 text-center text-gray-400 text-sm">
                                        <FaTags className="mx-auto text-3xl mb-3 opacity-20" />
                                        <p>No objects detected yet</p>
                                        <p className="text-xs mt-1 opacity-60">Start camera and point at objects</p>
                                    </div>
                                ) : (
                                    uniqueObjects.map((det, i) => (
                                        <motion.div
                                            key={det.class_name + i}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ delay: i * 0.04 }}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5"
                                        >
                                            {/* Color swatch */}
                                            <div
                                                className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-black shadow-sm"
                                                style={{ backgroundColor: getClassColor(det.class_id || i) }}
                                            >
                                                {det.class_name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate capitalize">
                                                    {det.class_name}
                                                </p>
                                                {det.color_name && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate capitalize">
                                                        🎨 {det.color_name}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-xs font-bold text-right flex-shrink-0">
                                                <span
                                                    className="px-2 py-0.5 rounded-md text-white text-[10px]"
                                                    style={{ backgroundColor: getClassColor(det.class_id || i) }}
                                                >
                                                    {Math.round((det.confidence || 0) * 100)}%
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Stats card */}
                    <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 p-4 shadow-lg">
                        <h3 className="font-bold text-sm mb-4 text-gray-700 dark:text-gray-300">Session Stats</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Objects in Frame', value: detections.length, color: 'text-violet-500' },
                                { label: 'Unique Objects', value: uniqueObjects.length, color: 'text-fuchsia-500' },
                                { label: 'Total Detected', value: totalDetected, color: 'text-blue-500' },
                                { label: 'Detection Rate', value: `${fps} fps`, color: 'text-green-500' },
                            ].map(stat => (
                                <div key={stat.label} className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</span>
                                    <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Color legend */}
                    {uniqueObjects.length > 0 && (
                        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 p-4 shadow-lg">
                            <h3 className="font-bold text-sm mb-3 text-gray-700 dark:text-gray-300">Color Legend</h3>
                            <div className="flex flex-wrap gap-2">
                                {uniqueObjects.map((det, i) => (
                                    <div key={i} className="flex items-center gap-1.5">
                                        <div
                                            className="w-3 h-3 rounded-full flex-shrink-0"
                                            style={{ backgroundColor: getClassColor(det.class_id || i) }}
                                        />
                                        <span className="text-[11px] text-gray-600 dark:text-gray-400 capitalize">{det.class_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* How to use card */}
                    <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-4">
                        <h3 className="font-bold text-sm text-violet-700 dark:text-violet-300 mb-3">💡 Tips</h3>
                        <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                            <li className="flex items-start gap-2">
                                <FaCircle className="text-violet-400 mt-1 flex-shrink-0 text-[6px]" />
                                Point at <strong className="text-gray-800 dark:text-white">clothing</strong> to know colors before buying or wearing
                            </li>
                            <li className="flex items-start gap-2">
                                <FaCircle className="text-violet-400 mt-1 flex-shrink-0 text-[6px]" />
                                Point at <strong className="text-gray-800 dark:text-white">food</strong> to check ripeness or freshness
                            </li>
                            <li className="flex items-start gap-2">
                                <FaCircle className="text-violet-400 mt-1 flex-shrink-0 text-[6px]" />
                                Use <strong className="text-gray-800 dark:text-white">Read Aloud</strong> to hear all detected colors
                            </li>
                            <li className="flex items-start gap-2">
                                <FaCircle className="text-violet-400 mt-1 flex-shrink-0 text-[6px]" />
                                Requires <strong className="text-gray-800 dark:text-white">YOLO service</strong> running on port 5000
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorObjectDetector;
