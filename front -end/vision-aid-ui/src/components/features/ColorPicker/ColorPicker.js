import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCamera, FaVolumeUp, FaRandom, FaStop,
    FaPlay, FaHandPaper, FaExclamationTriangle, FaCheck,
    FaEye, FaInfoCircle, FaBookmark, FaPalette, FaSpinner, FaMicrochip,
    FaCopy, FaHashtag, FaAdjust, FaExchangeAlt, FaSearch, FaGlasses, FaTshirt, FaBraille
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useColorHistory } from '../../../context/ColorHistoryContext';

// ColorPicker Component - Smart Camera
/**
 * Enhanced Color Detector (Final Version)
 * 
 * FEATURES:
 * 1. AI Detector (Camera)
 * 2. Manual Pro (Analyzer)
 * 3. FIND MODE (Locator) - Fixed UI
 * 4. MATCH MODE (Outfit)
 * 5. PATTERN ASSIST
 */

const ntc = {
    names: [
        ["000000", "Black"], ["000080", "Navy Blue"], ["0000C8", "Dark Blue"], ["0000FF", "Blue"],
        ["000741", "Dark Blue"], ["001B1C", "Black"], ["002387", "Dark Blue"], ["002900", "Dark Green"],
        ["FFFFFF", "White"], ["FFFF00", "Yellow"], ["FF0000", "Red"], ["00FF00", "Green"]
    ],
    name: function (color) {
        color = color.toUpperCase();
        if (color.length < 3) return ["#000000", "Invalid", false];
        if (color.length % 3 === 0) color = "#" + color;
        if (color.length === 4) color = "#" + color.substr(1, 1) + color.substr(1, 1) + color.substr(2, 1) + color.substr(2, 1) + color.substr(3, 1) + color.substr(3, 1);
        const r = parseInt(color.substr(1, 2), 16);
        const g = parseInt(color.substr(3, 2), 16);
        const b = parseInt(color.substr(5, 2), 16);
        let min = Infinity; let best = -1;
        for (let i = 0; i < this.names.length; i++) {
            const c = this.names[i][0];
            const r2 = parseInt(c.substr(0, 2), 16);
            const g2 = parseInt(c.substr(2, 2), 16);
            const b2 = parseInt(c.substr(4, 2), 16);
            const d = Math.pow(r - r2, 2) + Math.pow(g - g2, 2) + Math.pow(b - b2, 2);
            if (d < min) { min = d; best = i; }
        }
        return best > -1 ? ["#" + this.names[best][0], this.names[best][1], false] : ["#000000", "Unknown", false];
    },
    rgbToHsl: (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; }
            h /= 6;
        }
        return [Math.floor(h * 360), Math.floor(s * 100), Math.floor(l * 100)];
    }
};

const ColorDetector = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const streamRef = useRef(null);
    const { addToHistory } = useColorHistory();

    const [mode, setMode] = useState('camera');
    const [isDetecting, setIsDetecting] = useState(false);

    const [matchItem1, setMatchItem1] = useState(null);
    const [matchItem2, setMatchItem2] = useState(null);
    const [matchVerdict, setMatchVerdict] = useState(null);

    // Pattern Feature
    const [patternEnabled, setPatternEnabled] = useState(false);

    const [selectedColor, setSelectedColor] = useState('#8B4513');
    const [targetFindColor, setTargetFindColor] = useState({ hue: 0, name: 'Red' });
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [colorInfo, setColorInfo] = useState(null);

    const analyzeColor = useCallback((currentHex) => {
        const r = parseInt(currentHex.substr(1, 2), 16);
        const g = parseInt(currentHex.substr(3, 2), 16);
        const b = parseInt(currentHex.substr(5, 2), 16);
        const [h, s, l] = ntc.rgbToHsl(r, g, b);

        let simpleName = "Gray";
        let adjective = "";
        if (l < 12) simpleName = "Black";
        else if (l > 92) simpleName = "White";
        else if (s < 10) {
            if (l < 30) simpleName = "Dark Gray";
            else if (l > 70) simpleName = "Light Gray";
            else simpleName = "Gray";
        } else {
            if (h < 15) simpleName = "Red";
            else if (h < 40) simpleName = "Orange";
            else if (h < 70) simpleName = "Yellow";
            else if (h < 160) simpleName = "Green";
            else if (h < 190) simpleName = "Cyan";
            else if (h < 260) simpleName = "Blue";
            else if (h < 290) simpleName = "Purple";
            else if (h < 340) simpleName = "Pink";
            else simpleName = "Red";
            if (simpleName !== "Black" && simpleName !== "White") {
                if (l < 25) adjective = "Dark ";
                else if (l > 75) adjective = "Pale ";
                else if (s > 80) adjective = "Bright ";
            }
        }
        if ((simpleName === "Orange" || simpleName === "Yellow") && l < 50) {
            simpleName = "Brown";
            adjective = l < 30 ? "Dark " : "";
        }

        const finalName = adjective + simpleName;
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        const compH = (h + 180) % 360;
        const compColor = `hsl(${compH}, ${s}%, ${l}%)`;

        // Detailed Contrast Report
        let contrastReport = "Good visibility";
        if (luminance > 0.8) contrastReport = "Use Black Text";
        else if (luminance < 0.2) contrastReport = "Use White Text";
        else contrastReport = luminance > 0.5 ? "Dark Text is safer" : "Light Text is safer";

        setColorInfo({
            name: finalName,
            hex: currentHex,
            rgb: `rgb(${r}, ${g}, ${b})`,
            luminance,
            contrast: contrastReport,
            complementary: compColor,
            hsl: [h, s, l]
        });
    }, []);

    const captureMatchItem = (slot) => {
        if (!colorInfo) return;
        const item = { ...colorInfo };
        if (slot === 1) setMatchItem1(item);
        else setMatchItem2(item);
        toast.success(`Captured ${slot === 1 ? 'Top' : 'Bottom'}: ${item.name}`);
        const i1 = slot === 1 ? item : matchItem1;
        const i2 = slot === 2 ? item : matchItem2;
        if (i1 && i2) evaluateMatch(i1, i2);
    };

    const evaluateMatch = (c1, c2) => {
        const [h1, s1, l1] = c1.hsl;
        const [h2, s2, l2] = c2.hsl;
        let verdict = "Neutral";
        let score = 5;
        let reason = "";

        const isNeutral1 = s1 < 15 || l1 < 15 || l1 > 90;
        const isNeutral2 = s2 < 15 || l2 < 15 || l2 > 90;

        if (isNeutral1 || isNeutral2) {
            verdict = "Great Match"; score = 10; reason = "Neutrals match everything.";
        } else {
            const hueDiff = Math.abs(h1 - h2);
            if (hueDiff < 30 || hueDiff > 330) { verdict = "Safe Match"; score = 8; reason = "Monochromatic."; }
            else if (hueDiff > 150 && hueDiff < 210) { verdict = "Bold Match"; score = 9; reason = "Complementary."; }
            else if (hueDiff > 30 && hueDiff < 60) { verdict = "Natural Match"; score = 7; reason = "Analogous."; }
            else if (hueDiff > 70 && hueDiff < 110) { verdict = "Clash Warning"; score = 2; reason = "Clashing hues."; }
            else { verdict = "Risky Match"; score = 4; reason = "Unusual combo."; }
            if (Math.abs(s1 - s2) > 60) { score -= 2; reason += " Saturation mismatch."; }
        }
        setMatchVerdict({ title: verdict, score, reason });
    };

    const saveToHistory = () => {
        if (!colorInfo) return;
        addToHistory({
            name: colorInfo.name,
            hex: colorInfo.hex,
            rgb: colorInfo.rgb,
            note: mode === 'match' ? 'Outfit Match' : `Detected (${mode})`
        }, "Color Detector");
        toast.success(`Saved "${colorInfo.name}"`);
    };

    const speak = useCallback((text) => {
        if (!voiceEnabled || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }, [voiceEnabled]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 640 } } });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play();
                    setIsDetecting(true);

                    if (mode === 'find') {
                        toast("Scanning for " + targetFindColor.name, { icon: '🔍' });
                        speak("Scanning for " + targetFindColor.name);
                    } else {
                        toast.success("Active");
                    }
                };
            }
        } catch (e) { toast.error("Camera Error"); }
    };

    const stopCamera = () => {
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        setIsDetecting(false);
    };

    const handleManualChange = (e) => {
        const val = e.target.value; setSelectedColor(val); analyzeColor(val);
    }

    // Smart Camera: Stop if tab is hidden or component unmounts
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && streamRef.current) {
                stopCamera();
                toast('Camera paused to save energy 🔋', { icon: 'zzz' });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Direct track stop to prevent state updates on unmount
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
        };
    }, []);

    useEffect(() => { if (mode === 'manual' && !colorInfo) analyzeColor(selectedColor); }, [mode]);

    // Processing Loop
    useEffect(() => {
        if (!isDetecting) return;
        const interval = setInterval(() => {
            if (!videoRef.current || !canvasRef.current || !overlayRef.current) return;
            const ctx = canvasRef.current.getContext('2d');
            const overlayCtx = overlayRef.current.getContext('2d');
            const v = videoRef.current;
            if (v.readyState !== 4) return;

            canvasRef.current.width = v.videoWidth;
            canvasRef.current.height = v.videoHeight;
            overlayRef.current.width = v.videoWidth;
            overlayRef.current.height = v.videoHeight;

            ctx.drawImage(v, 0, 0);

            // Pattern Overlay Logic
            if (patternEnabled) {
                const w = v.videoWidth, h = v.videoHeight;
                const frame = ctx.getImageData(0, 0, w, h);
                const data = frame.data;
                for (let y = 0; y < h; y += 4) { // Scanline optimize
                    for (let x = 0; x < w; x += 4) {
                        const i = (y * w + x) * 4;
                        const r = data[i], g = data[i + 1], b = data[i + 2];
                        const [hue, sat, lum] = ntc.rgbToHsl(r, g, b);

                        if ((hue < 15 || hue > 340) && sat > 20 && lum > 20) {
                            if ((x + y) % 10 < 2) { data[i] = 255; data[i + 1] = 255; data[i + 2] = 255; }
                        }
                        else if ((hue > 80 && hue < 160) && sat > 20 && lum > 20) {
                            if (x % 10 < 2 && y % 10 < 2) { data[i] = 0; data[i + 1] = 0; data[i + 2] = 0; }
                        }
                    }
                }
                overlayCtx.putImageData(frame, 0, 0);
            } else {
                overlayCtx.clearRect(0, 0, v.videoWidth, v.videoHeight);
            }

            // Find Mode Logic
            if (mode === 'find' && !patternEnabled) {
                const frame = ctx.getImageData(0, 0, v.videoWidth, v.videoHeight);
                const data = frame.data;
                const targetHue = targetFindColor.hue;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i + 1], b = data[i + 2];
                    const [h, s, l] = ntc.rgbToHsl(r, g, b);
                    let diff = Math.abs(h - targetHue);
                    if (targetHue < 30 && h > 330) diff = Math.abs((h - 360) - targetHue);

                    // Match Tolerance
                    if (diff < 30 && s > 20 && l > 15) {
                        // Keep color (do nothing)
                    } else {
                        // Turn Gray
                        const gr = 0.299 * r + 0.587 * g + 0.114 * b;
                        data[i] = gr; data[i + 1] = gr; data[i + 2] = gr;
                    }
                }
                overlayCtx.putImageData(frame, 0, 0);
            }

            // Standard Center Analysis (Always run for naming)
            const cx = v.videoWidth / 2, cy = v.videoHeight / 2;
            const size = 40;
            const imageData = ctx.getImageData(cx - size / 2, cy - size / 2, size, size).data;
            let pixels = [];
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i], g = imageData[i + 1], b = imageData[i + 2];
                const luma = 0.299 * r + 0.587 * g + 0.114 * b;
                if (luma > 20 && luma < 245) pixels.push({ r, g, b, luma });
            }
            let finalR = 0, finalG = 0, finalB = 0;
            if (pixels.length > 10) {
                pixels.sort((a, b) => a.luma - b.luma);
                const trim = Math.floor(pixels.length * 0.15);
                const core = pixels.slice(trim, pixels.length - trim);
                let sr = 0, sg = 0, sb = 0;
                for (let p of core) { sr += p.r; sg += p.g; sb += p.b; }
                finalR = Math.round(sr / core.length); finalG = Math.round(sg / core.length); finalB = Math.round(sb / core.length);
            } else {
                let sr = 0, sg = 0, sb = 0, c = 0;
                for (let i = 0; i < imageData.length; i += 4) { sr += imageData[i]; sg += imageData[i + 1]; sb += imageData[i + 2]; c++; }
                finalR = Math.round(sr / c); finalG = Math.round(sg / c); finalB = Math.round(sb / c);
            }
            const hex = '#' + ((1 << 24) + (finalR << 16) + (finalG << 8) + finalB).toString(16).slice(1).toUpperCase();
            analyzeColor(hex);

            if (!patternEnabled && mode !== 'find') {
                const ringColor = (finalR + finalG + finalB) / 3 > 128 ? '#000' : '#fff';
                overlayCtx.strokeStyle = ringColor; overlayCtx.lineWidth = 4; overlayCtx.beginPath(); overlayCtx.arc(cx, cy, 42, 0, 6.28); overlayCtx.stroke();
                overlayCtx.fillStyle = hex; overlayCtx.beginPath(); overlayCtx.arc(cx, cy, 38, 0, 6.28); overlayCtx.fill();
            }

        }, 300);
        return () => clearInterval(interval);
    }, [isDetecting, analyzeColor, mode, patternEnabled, targetFindColor]);

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-20 pb-20 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-blue-900 to-purple-900 border border-blue-500/30 rounded-full text-xs font-bold text-gray-200 mb-2">
                        {mode === 'match' ? <><FaTshirt /> Outfit Advisor</> : <><FaPalette /> Visual Assistant</>}
                    </div>
                    <h1 className="text-4xl font-black">
                        {mode === 'match' ? 'Outfit' : 'Color'} <span className="text-blue-500">{mode === 'match' ? 'Matcher' : 'Detector'}</span>
                    </h1>
                </div>

                <div className="flex justify-center gap-4 mb-6 flex-wrap">
                    <button onClick={() => { setMode('camera'); if (streamRef.current) stopCamera(); }} className={`px-3 py-2 rounded-lg font-bold text-sm ${mode === 'camera' ? 'bg-blue-600' : 'bg-gray-800'}`}>Camera</button>
                    <button onClick={() => { setMode('manual'); if (streamRef.current) stopCamera(); }} className={`px-3 py-2 rounded-lg font-bold text-sm ${mode === 'manual' ? 'bg-blue-600' : 'bg-gray-800'}`}>Manual</button>
                    <button onClick={() => { setMode('find'); if (streamRef.current) stopCamera(); }} className={`px-3 py-2 rounded-lg font-bold text-sm flex gap-2 ${mode === 'find' ? 'bg-green-600' : 'bg-gray-800'}`}><FaSearch /> Find</button>
                    <button onClick={() => { setMode('match'); if (streamRef.current) stopCamera(); }} className={`px-3 py-2 rounded-lg font-bold text-sm flex gap-2 ${mode === 'match' ? 'bg-purple-600' : 'bg-gray-800'}`}><FaTshirt /> Match</button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 bg-gray-900 p-2 rounded-3xl border border-gray-800">

                    {/* LEFT SIDE: INPUT */}
                    <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden flex flex-col group">
                        <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
                        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full hidden" />
                        <canvas ref={overlayRef} className="absolute inset-0 w-full h-full" />

                        {/* Pattern Toggle Button */}
                        {mode === 'camera' && isDetecting && (
                            <button
                                onClick={() => setPatternEnabled(!patternEnabled)}
                                className={`absolute top-4 right-4 p-2 rounded-full border-2 ${patternEnabled ? 'bg-yellow-500 border-white text-black' : 'bg-black/50 border-gray-500 text-gray-400'}`}
                            >
                                <FaBraille />
                            </button>
                        )}

                        {/* MANUAL OVERLAY */}
                        {mode === 'manual' && (
                            <div className="absolute inset-0 bg-gray-800 z-10 flex flex-col p-6">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Selected Color</label>
                                <div className="flex-1 rounded-2xl shadow-inner mb-6 transition-all duration-300 relative group"
                                    style={{ backgroundColor: selectedColor }}></div>
                                <input type="color" value={selectedColor} onChange={handleManualChange} className="w-full h-12 mb-4" />
                                {colorInfo && (
                                    <div className="bg-black/20 p-4 rounded-xl">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm font-bold">Contrast</span>
                                            <span className="text-xs text-gray-400">{colorInfo.contrast}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {mode !== 'manual' && !isDetecting && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
                                <button onClick={startCamera} className="bg-blue-600 px-8 py-3 rounded-xl font-bold text-lg shadow-lg">Start {mode === 'find' ? 'Search' : 'Camera'}</button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDE: OUTPUT */}
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <AnimatePresence mode="wait">
                            {mode === 'match' ? (
                                <motion.div key="match-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                                    <h2 className="text-2xl font-bold mb-4">Outfit Advisor</h2>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div onClick={() => captureMatchItem(1)} className="cursor-pointer group">
                                            <div className="h-24 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center mb-2 overflow-hidden relative" style={{ backgroundColor: matchItem1?.hex || 'transparent' }}>{!matchItem1 && <span className="text-gray-500 text-xs text-center px-2">Tap to Capture Top</span>}</div>
                                            <div className="text-sm font-bold">Top</div>
                                        </div>
                                        <div onClick={() => captureMatchItem(2)} className="cursor-pointer group">
                                            <div className="h-24 rounded-xl border-2 border-dashed border-gray-600 flex items-center justify-center mb-2 overflow-hidden relative" style={{ backgroundColor: matchItem2?.hex || 'transparent' }}>{!matchItem2 && <span className="text-gray-500 text-xs text-center px-2">Tap to Capture Bottom</span>}</div>
                                            <div className="text-sm font-bold">Bottom</div>
                                        </div>
                                    </div>
                                    {matchVerdict && (
                                        <div className={`p-4 rounded-xl border-2 mb-4 ${matchVerdict.score > 6 ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                                            <div className="text-3xl mb-2">{matchVerdict.score > 6 ? <FaCheck className="inline text-green-500" /> : <FaExclamationTriangle className="inline text-red-500" />}</div>
                                            <h3 className="text-xl font-bold mb-1">{matchVerdict.title}</h3>
                                            <p className="text-sm opacity-80">{matchVerdict.reason}</p>
                                        </div>
                                    )}
                                    <button onClick={() => { setMatchItem1(null); setMatchItem2(null); setMatchVerdict(null); }} className="text-gray-500 text-sm hover:text-white">Reset</button>
                                </motion.div>
                            ) : mode === 'find' ? (
                                /* --- THIS IS THE RESTORED FIND MODE UI --- */
                                <motion.div key="find-ui" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                                    <h2 className="text-3xl font-bold mb-2">Find Color</h2>
                                    <p className="text-gray-400 text-sm mb-6">Select a target to highlight:</p>

                                    <div className="grid grid-cols-2 gap-3 mb-6 max-w-sm mx-auto">
                                        {[
                                            { name: 'Red', h: 0, c: 'bg-red-600' },
                                            { name: 'Green', h: 120, c: 'bg-green-600' },
                                            { name: 'Blue', h: 240, c: 'bg-blue-600' },
                                            { name: 'Yellow', h: 60, c: 'bg-yellow-500 text-black' },
                                            { name: 'Orange', h: 30, c: 'bg-orange-500' },
                                            { name: 'Purple', h: 280, c: 'bg-purple-600' }
                                        ].map(c => (
                                            <button
                                                key={c.name}
                                                onClick={() => setTargetFindColor({ hue: c.h, name: c.name })}
                                                className={`py-3 px-4 rounded-xl font-bold transition-all border-2 ${targetFindColor.name === c.name ? 'border-white scale-105 ring-2 ring-white/50' : 'border-transparent opacity-50 hover:opacity-100'} ${c.c}`}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="bg-gray-800 p-4 rounded-xl text-xs text-left text-gray-400 border border-gray-700">
                                        <strong className="text-white block mb-1">Active: Searching for {targetFindColor.name}</strong>
                                        Everything else will appear Black & White.
                                    </div>
                                </motion.div>
                            ) : (
                                colorInfo ? (
                                    <motion.div key={colorInfo.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full">
                                        <div className="mb-8">
                                            <h2 className="text-5xl font-black mb-2 tracking-tight">{colorInfo.name}</h2>
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800 rounded-full text-sm text-gray-400 border border-gray-700 font-mono transition">{colorInfo.hex}</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                                            <button onClick={() => speak(colorInfo.name)} className="bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"><FaVolumeUp /> Speak</button>
                                            <button onClick={saveToHistory} className="bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-gray-700"><FaBookmark /> Save</button>
                                        </div>
                                        {patternEnabled && <div className="mt-4 text-xs text-yellow-500 bg-yellow-900/20 px-3 py-1 rounded inline-block">Pattern Overlay Active</div>}
                                    </motion.div>
                                ) : (
                                    <div className="text-gray-600">
                                        <FaPalette className="text-6xl mx-auto mb-4 opacity-30 animate-pulse" />
                                        <p className="text-xl font-bold">Ready</p>
                                    </div>
                                )
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorDetector;
