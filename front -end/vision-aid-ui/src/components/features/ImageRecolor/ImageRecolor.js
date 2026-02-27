import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUpload, FaDownload, FaEye, FaMagic, FaExchangeAlt,
    FaInfoCircle, FaImage, FaUndo, FaCheckCircle, FaAdjust,
    FaCamera, FaTh, FaListAlt, FaClipboard, FaSlidersH,
    FaLightbulb, FaCopy, FaExpand, FaCompress
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// ── CVD Types ────────────────────────────────────────────────────────────────
const CVD_TYPES = {
    deuteranopia: {
        id: 'deuteranopia', name: 'Deuteranopia', short: 'Deuter.',
        type: 'Red–Green (green-weak)', prevalence: '~6% of men',
        description: 'Cannot distinguish red from green — the most common type.',
        color: '#f59e0b', gradient: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400',
        simMatrix: [
            [0.625, 0.375, 0.000],
            [0.700, 0.300, 0.000],
            [0.000, 0.300, 0.700],
        ],
        errTarget: 'B',
    },
    protanopia: {
        id: 'protanopia', name: 'Protanopia', short: 'Protan.',
        type: 'Red–Green (red-weak)', prevalence: '~2% of men',
        description: 'Red appears very dark or is absent.',
        color: '#ef4444', gradient: 'from-red-500 to-rose-500',
        bg: 'bg-red-500/10', border: 'border-red-500/40', text: 'text-red-400',
        simMatrix: [
            [0.567, 0.433, 0.000],
            [0.558, 0.442, 0.000],
            [0.000, 0.242, 0.758],
        ],
        errTarget: 'B',
    },
    tritanopia: {
        id: 'tritanopia', name: 'Tritanopia', short: 'Tritan.',
        type: 'Blue–Yellow', prevalence: '<0.01% of people',
        description: 'Cannot distinguish blue from yellow.',
        color: '#3b82f6', gradient: 'from-blue-500 to-indigo-500',
        bg: 'bg-blue-500/10', border: 'border-blue-500/40', text: 'text-blue-400',
        simMatrix: [
            [0.950, 0.050, 0.000],
            [0.000, 0.433, 0.567],
            [0.000, 0.475, 0.525],
        ],
        errTarget: 'R',
    },
    achromatopsia: {
        id: 'achromatopsia', name: 'Achromatopsia', short: 'Achromat.',
        type: 'Complete (grayscale)', prevalence: '~0.003% of people',
        description: 'Sees only shades of gray — no color at all.',
        color: '#6b7280', gradient: 'from-gray-500 to-slate-500',
        bg: 'bg-gray-500/10', border: 'border-gray-500/40', text: 'text-gray-400',
        simMatrix: null,
        errTarget: null,
    },
};

// ── Sample test images (color-discriminating patterns as data URLs) ───────────
const SAMPLES = [
    {
        label: 'Traffic Light',
        emoji: '🚦',
        // Programmatically generated canvas — see buildSampleCanvas()
        type: 'traffic',
    },
    {
        label: 'Color Wheel',
        emoji: '🎨',
        type: 'wheel',
    },
    {
        label: 'Spectrum Bar',
        emoji: '🌈',
        type: 'spectrum',
    },
];

function buildSampleDataURL(type) {
    const canvas = document.createElement('canvas');
    canvas.width = 400; canvas.height = 300;
    const ctx = canvas.getContext('2d');

    if (type === 'traffic') {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#333';
        ctx.roundRect(150, 20, 100, 260, 12);
        ctx.fill();
        const lights = [
            { y: 65, color: '#ff2200' },
            { y: 145, color: '#ffaa00' },
            { y: 225, color: '#00dd44' },
        ];
        lights.forEach(({ y, color }) => {
            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(200, y, 30, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff88';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Traffic Light Test', 200, 290);
    } else if (type === 'wheel') {
        for (let angle = 0; angle < 360; angle++) {
            ctx.beginPath();
            ctx.moveTo(200, 150);
            const hue = angle;
            ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
            ctx.arc(200, 150, 130, (angle - 1) * Math.PI / 180, (angle + 1) * Math.PI / 180);
            ctx.fill();
        }
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(200, 150, 40, 0, Math.PI * 2);
        ctx.fill();
        // Color labels
        const labels = [
            { text: 'Red', x: 330, y: 155, color: '#ff0000' },
            { text: 'Green', x: 130, y: 30, color: '#00cc00' },
            { text: 'Blue', x: 70, y: 200, color: '#0066ff' },
        ];
        labels.forEach(({ text, x, y, color }) => {
            ctx.fillStyle = color;
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(text, x, y);
        });
    } else if (type === 'spectrum') {
        const grad = ctx.createLinearGradient(0, 0, 400, 0);
        const stops = ['#ff0000', '#ff8800', '#ffff00', '#00ff00', '#0000ff', '#8800ff', '#ff0088'];
        stops.forEach((c, i) => grad.addColorStop(i / (stops.length - 1), c));
        ctx.fillStyle = grad;
        ctx.fillRect(0, 60, 400, 150);
        // Add some greens and reds side by side for red-green test
        const pairs = [
            ['#cc0000', '#00cc00'], ['#ff4400', '#44ff00'], ['#990000', '#009900'],
        ];
        pairs.forEach(([a, b], i) => {
            const x = 20 + i * 135;
            ctx.fillStyle = a;
            ctx.fillRect(x, 230, 55, 50);
            ctx.fillStyle = b;
            ctx.fillRect(x + 65, 230, 55, 50);
        });
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText('Red-Green discrimination rows ↑', 200, 295);
        ctx.textAlign = 'center';
    }
    return canvas.toDataURL('image/png');
}

// ── Accurate CVD pipeline (Machado et al. 2009) ──────────────────────────────
// Key principle: ALWAYS linearize sRGB before applying the transform matrix,
// then re-encode gamma. Applying matrices to gamma-encoded values is wrong.

// sRGB gamma decode (0-255 → 0-1 linear)
function toLinear(c) {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}
// Linear → sRGB gamma encode (0-1 linear → 0-255)
function toSRGB(v) {
    const c = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(Math.max(0, v), 1 / 2.4) - 0.055;
    return Math.min(255, Math.max(0, Math.round(c * 255)));
}

// Machado et al. 2009 matrices for LINEARIZED sRGB (severity = 1.0)
// Source: "A Physiologically-based Model for Simulation of Color Vision Deficiency"
// IEEE Transactions on Visualization and Computer Graphics, 15(6), 2009.
const MACHADO_MATRICES = {
    protanopia: [
        [0.152286, 1.052583, -0.204868],
        [0.114503, 0.786281, 0.099216],
        [-0.003882, -0.048116, 1.051998],
    ],
    deuteranopia: [
        [0.367322, 0.860646, -0.227968],
        [0.280085, 0.672501, 0.047413],
        [-0.011820, 0.042940, 0.968881],
    ],
    tritanopia: [
        [1.255528, -0.076749, -0.178779],
        [-0.078411, 0.930809, 0.147602],
        [0.004733, 0.691367, 0.303900],
    ],
    // Achromatopsia: true rod monochromacy — full luminance from BT.709 coefficients
    achromatopsia: null,
};

// Apply 3×3 matrix to linear [r, g, b]
function matMul(m, r, g, b) {
    return [
        m[0][0] * r + m[0][1] * g + m[0][2] * b,
        m[1][0] * r + m[1][1] * g + m[1][2] * b,
        m[2][0] * r + m[2][1] * g + m[2][2] * b,
    ];
}

/**
 * Simulate color vision deficiency using Machado 2009 matrices.
 * intensity 0-1: blend between original and fully simulated.
 */
function simulate(imageData, cvd, intensity = 1) {
    const src = imageData.data;
    const out = new Uint8ClampedArray(src);
    const matrix = MACHADO_MATRICES[cvd.id];

    for (let i = 0; i < src.length; i += 4) {
        // 1. Decode gamma
        const rl = toLinear(src[i]);
        const gl = toLinear(src[i + 1]);
        const bl = toLinear(src[i + 2]);

        let sr, sg, sb;
        if (!matrix) {
            // Achromatopsia: ITU-R BT.709 linear luminance coefficients
            const lum = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
            // Add faint residual blue-cone tint (some achromats retain partial S-cone)
            sr = lum; sg = lum; sb = lum;
        } else {
            [sr, sg, sb] = matMul(matrix, rl, gl, bl);
        }

        // 2. Blend original ↔ simulated in linear space
        const lr = rl + (sr - rl) * intensity;
        const lg = gl + (sg - gl) * intensity;
        const lb = bl + (sb - bl) * intensity;

        // 3. Re-encode gamma
        out[i] = toSRGB(lr);
        out[i + 1] = toSRGB(lg);
        out[i + 2] = toSRGB(lb);
        // Alpha unchanged
    }
    return new ImageData(out, imageData.width, imageData.height);
}

/**
 * Daltonize: shift lost color information to visible channels.
 * Works entirely in linear space for accuracy.
 * Based on Fidaner & Çolako§lu 2009 extension of the Brettel method.
 */
function daltonize(imageData, cvd, intensity = 1) {
    const src = imageData.data;
    const out = new Uint8ClampedArray(src);
    const matrix = MACHADO_MATRICES[cvd.id];

    for (let i = 0; i < src.length; i += 4) {
        const rl = toLinear(src[i]);
        const gl = toLinear(src[i + 1]);
        const bl = toLinear(src[i + 2]);

        if (!matrix) {
            // Achromatopsia correction: boost chroma contrast (saturation enhancement)
            const lum = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
            const nr = Math.max(0, rl + (rl - lum) * 2.5);
            const ng = Math.max(0, gl + (gl - lum) * 2.5);
            const nb = Math.max(0, bl + (bl - lum) * 2.5);
            out[i] = toSRGB(rl + (nr - rl) * intensity);
            out[i + 1] = toSRGB(gl + (ng - gl) * intensity);
            out[i + 2] = toSRGB(bl + (nb - bl) * intensity);
            continue;
        }

        // Simulate in linear space
        const [sl, sm, sb_] = matMul(matrix, rl, gl, bl);

        // Compute error: color signal lost by the deficiency (in linear space)
        const errR = rl - sl;
        const errG = gl - sm;
        const errB = bl - sb_;

        // Redistribute error to the channel(s) the person CAN perceive
        let nr = rl, ng = gl, nb = bl;
        if (cvd.errTarget === 'B') {
            // Protan/Deutan → shift lost R/G info to B channel
            nb = Math.max(0, bl + 0.7 * errR + 0.7 * errG);
        } else if (cvd.errTarget === 'R') {
            // Tritan → shift lost B info to R channel
            nr = Math.max(0, rl + 0.7 * errB + 0.7 * errG);
        }

        // Blend and re-encode
        out[i] = toSRGB(rl + (nr - rl) * intensity);
        out[i + 1] = toSRGB(gl + (ng - gl) * intensity);
        out[i + 2] = toSRGB(bl + (nb - bl) * intensity);
    }
    return new ImageData(out, imageData.width, imageData.height);
}

function countChangedPct(orig, proc) {
    let changed = 0;
    const total = orig.data.length / 4;
    for (let i = 0; i < orig.data.length; i += 4) {
        if (Math.abs(orig.data[i] - proc.data[i]) + Math.abs(orig.data[i + 1] - proc.data[i + 1]) + Math.abs(orig.data[i + 2] - proc.data[i + 2]) > 10)
            changed++;
    }
    return Math.round((changed / total) * 100);
}


// ── Main Component ────────────────────────────────────────────────────────────
const ImageRecolor = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [mode, setMode] = useState('simulate');
    const [activeType, setActiveType] = useState('deuteranopia');
    const [viewMode, setViewMode] = useState('compare'); // 'compare' | 'grid' | 'side'
    const [intensity, setIntensity] = useState(100);
    const [sliderPos, setSliderPos] = useState(50);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [stats, setStats] = useState(null);
    const [gridData, setGridData] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [zoom, setZoom] = useState(false);

    const origCanvasRef = useRef(null);
    const procCanvasRef = useRef(null);
    const compareRef = useRef(null);
    const fileInputRef = useRef(null);
    const imageRef = useRef(null);
    const webcamRef = useRef(null);
    const [webcamActive, setWebcamActive] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const cvd = CVD_TYPES[activeType];

    // ── Process image ─────────────────────────────────────────────────────────
    const processImage = useCallback(() => {
        const img = imageRef.current;
        if (!img || !img.naturalWidth) return;
        setIsProcessing(true);

        const W = img.naturalWidth, H = img.naturalHeight;

        // Draw original
        const oc = origCanvasRef.current;
        if (!oc) return;
        oc.width = W; oc.height = H;
        const octx = oc.getContext('2d');
        octx.drawImage(img, 0, 0, W, H);
        const origData = octx.getImageData(0, 0, W, H);

        // Process active type
        const processed = mode === 'simulate'
            ? simulate(origData, CVD_TYPES[activeType], intensity / 100)
            : daltonize(origData, CVD_TYPES[activeType], intensity / 100);

        const pc = procCanvasRef.current;
        if (!pc) return;
        pc.width = W; pc.height = H;
        pc.getContext('2d').putImageData(processed, 0, 0);

        setStats({ changedPct: countChangedPct(origData, processed), width: W, height: H });

        // Grid: compute all 4 types
        const grid = {};
        Object.values(CVD_TYPES).forEach((t) => {
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = W; tmpCanvas.height = H;
            const tmpCtx = tmpCanvas.getContext('2d');
            const data = mode === 'simulate'
                ? simulate(origData, t, intensity / 100)
                : daltonize(origData, t, intensity / 100);
            tmpCtx.putImageData(data, 0, 0);
            grid[t.id] = tmpCanvas.toDataURL('image/jpeg', 0.8);
        });
        setGridData(grid);
        setIsProcessing(false);
    }, [mode, activeType, intensity]);

    useEffect(() => {
        if (imageSrc && imageRef.current) {
            processImage();
        }
    }, [mode, activeType, intensity, imageSrc, processImage]);

    // ── Load image ────────────────────────────────────────────────────────────
    const loadImage = useCallback((src) => {
        const img = new Image();
        img.onload = () => {
            imageRef.current = img;
            processImage();
        };
        img.src = src;
        setImageSrc(src);
    }, [processImage]);

    const handleFile = useCallback((file) => {
        if (!file?.type.startsWith('image/')) { toast.error('Please upload an image file'); return; }
        if (file.size > 25 * 1024 * 1024) { toast.error('Image too large (max 25 MB)'); return; }
        const reader = new FileReader();
        reader.onload = (e) => loadImage(e.target.result);
        reader.readAsDataURL(file);
        toast.success(`Loaded: ${file.name}`);
    }, [loadImage]);

    // ── Clipboard paste (Ctrl+V) ──────────────────────────────────────────────
    useEffect(() => {
        const handlePaste = (e) => {
            const item = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/'));
            if (item) { handleFile(item.getAsFile()); toast.success('Image pasted from clipboard!'); }
        };
        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [handleFile]);

    // ── Webcam ────────────────────────────────────────────────────────────────
    const startWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
            });
            streamRef.current = stream;
            setWebcamActive(true); // render the <video> element first
        } catch (err) {
            if (err.name === 'NotAllowedError') {
                toast.error('Camera permission denied — please allow camera access in browser settings');
            } else if (err.name === 'NotFoundError') {
                toast.error('No camera found on this device');
            } else {
                toast.error(`Camera error: ${err.message}`);
            }
        }
    };

    // Once webcamActive=true, <video> is in DOM — now safely assign the stream
    useEffect(() => {
        if (webcamActive && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
            videoRef.current.play().catch(() => { });
        }
    }, [webcamActive]);

    const captureFromWebcam = () => {
        const video = videoRef.current;
        if (!video || !video.videoWidth) {
            toast.error('Camera not ready yet — wait a moment and try again');
            return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        loadImage(canvas.toDataURL('image/jpeg', 0.92));
        stopWebcam();
        toast.success('Photo captured!');
    };
    const stopWebcam = () => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        setWebcamActive(false);
    };

    // ── Before/After slider ───────────────────────────────────────────────────
    useEffect(() => {
        if (!isDraggingSlider) return;
        const onMove = (e) => {
            const el = compareRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
            setSliderPos(Math.min(100, Math.max(0, (x / rect.width) * 100)));
        };
        const onUp = () => setIsDraggingSlider(false);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove);
        window.addEventListener('touchend', onUp);
        return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onUp); };
    }, [isDraggingSlider]);

    // ── Download ──────────────────────────────────────────────────────────────
    const download = () => {
        const canvas = procCanvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `visionaid-${activeType}-${mode}-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('Image saved!');
    };

    const downloadGrid = (typeId) => {
        if (!gridData[typeId]) return;
        const link = document.createElement('a');
        link.download = `visionaid-${typeId}-${mode}.jpg`;
        link.href = gridData[typeId];
        link.click();
    };

    const reset = () => {
        setImageSrc(null); setStats(null); imageRef.current = null;
        setGridData({}); stopWebcam();
    };

    const copyToClipboard = async () => {
        const canvas = procCanvasRef.current;
        if (!canvas) return;
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                toast.success('Copied to clipboard!');
            } catch { toast.error('Copy failed — use Download instead'); }
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#080c14] text-gray-900 dark:text-white">

            {/* ── Hidden offscreen canvases ── */}
            <canvas ref={origCanvasRef} className="hidden" />

            {/* ── Header ── */}
            <div className="bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-white/5 px-4 py-4 sticky top-0 z-20 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cvd.gradient} flex items-center justify-center shadow-lg`}>
                            <FaAdjust className="text-white text-base" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black">Image Recolor</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Simulate & correct color blindness on any image</p>
                        </div>
                    </div>
                    {imageSrc && (
                        <div className="flex flex-wrap items-center gap-2">
                            {stats && (
                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${cvd.bg} ${cvd.text} border ${cvd.border}`}>
                                    {stats.changedPct}% pixels changed
                                </span>
                            )}
                            <button onClick={copyToClipboard} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                <FaCopy /> Copy
                            </button>
                            <button onClick={download} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors">
                                <FaDownload /> Download
                            </button>
                            <button onClick={reset} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                                <FaUndo />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

                {/* ── Upload / Webcam area ── */}
                {!imageSrc && !webcamActive && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        {/* Drop zone */}
                        <div
                            className={`relative border-2 border-dashed rounded-3xl p-14 text-center cursor-pointer transition-all duration-200 ${isDragging ? 'border-violet-500 bg-violet-500/10 scale-[1.01]' : 'border-gray-200 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/50 bg-white dark:bg-[#0d1117]'}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={() => setIsDragging(false)}
                            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }}
                        >
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-violet-500/20 blur-[50px] rounded-full" />
                                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center">
                                        <FaImage className="text-3xl text-violet-400" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xl font-black mb-1">{isDragging ? 'Drop it!' : 'Upload any image'}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop, click, or press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-white/10 rounded text-xs font-mono">Ctrl+V</kbd> to paste</p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    {['Photos', 'Charts', 'Maps', 'UI Designs', 'Artwork', 'Infographics'].map(t => (
                                        <span key={t} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 rounded-full text-xs font-medium text-gray-500 border border-gray-200 dark:border-white/10">{t}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* Webcam */}
                            <button onClick={startWebcam} className="flex items-center gap-3 p-4 bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 hover:border-violet-400 dark:hover:border-violet-500/40 transition-all group shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
                                    <FaCamera className="text-violet-500" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-sm">Take Photo</p>
                                    <p className="text-xs text-gray-400">Use your webcam</p>
                                </div>
                            </button>

                            {/* Sample images */}
                            {SAMPLES.map((s) => (
                                <button
                                    key={s.type}
                                    onClick={() => loadImage(buildSampleDataURL(s.type))}
                                    className="flex items-center gap-3 p-4 bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 hover:border-fuchsia-400 dark:hover:border-fuchsia-500/40 transition-all group shadow-sm"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 flex items-center justify-center text-xl group-hover:bg-fuchsia-500/20 transition-colors">
                                        {s.emoji}
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-sm">Try {s.label}</p>
                                        <p className="text-xs text-gray-400">Sample test image</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Webcam View ── */}
                {webcamActive && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black rounded-2xl overflow-hidden relative">
                        <video ref={videoRef} autoPlay playsInline className="w-full max-h-[60vh] object-contain" />
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                            <button onClick={captureFromWebcam} className="px-6 py-3 bg-white text-gray-900 font-bold rounded-xl shadow-xl hover:bg-gray-100 transition-colors">
                                📸 Capture
                            </button>
                            <button onClick={stopWebcam} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-xl hover:bg-red-500 transition-colors">
                                Cancel
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── Controls (shown when image loaded) ── */}
                {imageSrc && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 p-5 shadow-lg space-y-5"
                    >
                        <div className="flex flex-col lg:flex-row gap-5">

                            {/* Mode */}
                            <div className="flex-shrink-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Mode</p>
                                <div className="flex bg-gray-100 dark:bg-white/5 rounded-xl p-1 border border-gray-200 dark:border-white/10">
                                    <button onClick={() => setMode('simulate')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'simulate' ? 'bg-white dark:bg-white/10 text-violet-600 dark:text-violet-400 shadow-sm' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                        <FaEye /> Simulate
                                    </button>
                                    <button onClick={() => setMode('correct')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'correct' ? 'bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                        <FaMagic /> Correct
                                    </button>
                                </div>
                            </div>

                            {/* Type */}
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Color Blindness Type</p>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                                    {Object.values(CVD_TYPES).map((t) => (
                                        <button key={t.id} onClick={() => setActiveType(t.id)}
                                            className={`flex flex-col gap-1 p-3 rounded-xl border text-left transition-all ${activeType === t.id ? `${t.bg} ${t.border} ${t.text}` : 'bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/5 text-gray-500 hover:border-gray-300 dark:hover:border-white/10'}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-black">{t.name}</span>
                                                {activeType === t.id && <FaCheckCircle className="text-[10px]" />}
                                            </div>
                                            <span className="text-[10px] opacity-60 leading-tight">{t.prevalence}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* View mode */}
                            <div className="flex-shrink-0">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">View</p>
                                <div className="flex flex-col gap-1.5">
                                    {[
                                        { v: 'compare', icon: FaExchangeAlt, label: 'Compare' },
                                        { v: 'side', icon: FaListAlt, label: 'Side by Side' },
                                        { v: 'grid', icon: FaTh, label: 'All 4 Types' },
                                    ].map(({ v, icon: Icon, label }) => (
                                        <button key={v} onClick={() => setViewMode(v)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold border transition-all ${viewMode === v ? 'bg-violet-500/10 border-violet-500/40 text-violet-400' : 'bg-gray-50 dark:bg-white/3 border-gray-200 dark:border-white/5 text-gray-500 hover:border-gray-300'}`}>
                                            <Icon /> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Intensity slider */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <FaSlidersH /> Effect Intensity
                                </p>
                                <span className={`text-sm font-black ${cvd.text}`}>{intensity}%</span>
                            </div>
                            <input
                                type="range" min={0} max={100} value={intensity}
                                onChange={(e) => setIntensity(Number(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-500 bg-gray-200 dark:bg-white/10"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>0% (Original)</span>
                                <span>50% (Partial)</span>
                                <span>100% (Full)</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className={`flex items-start gap-2 px-4 py-3 rounded-xl ${cvd.bg} border ${cvd.border}`}>
                            <FaInfoCircle className={`flex-shrink-0 mt-0.5 ${cvd.text}`} />
                            <p className={`text-xs font-medium ${cvd.text}`}>
                                <strong>{cvd.name}</strong> ({cvd.type}) — {cvd.description}&nbsp;
                                {mode === 'simulate' ? 'Simulation uses the Viénot 1999 matrix transform.' : 'Correction uses the Daltonize algorithm to redistribute lost color signal.'}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* ── View: Compare (slider) ── */}
                {imageSrc && viewMode === 'compare' && (
                    <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-xl"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/5 text-xs font-bold text-gray-500">
                            <span>Original</span>
                            <span>← Drag slider →</span>
                            <span className={cvd.text}>{mode === 'simulate' ? 'Simulated' : 'Corrected'}</span>
                        </div>
                        <div
                            ref={compareRef}
                            className="relative overflow-hidden select-none cursor-col-resize"
                            style={{ maxHeight: zoom ? '100vh' : '65vh' }}
                            onMouseDown={() => setIsDraggingSlider(true)}
                            onTouchStart={() => setIsDraggingSlider(true)}
                        >
                            {/* Processed (bottom layer) */}
                            <canvas ref={procCanvasRef} className="w-full h-auto block" />

                            {/* Original clipped */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${sliderPos}%` }}>
                                <img src={imageSrc} alt="original" className="h-full block object-cover" style={{ width: `${100 / Math.max(sliderPos / 100, 0.01)}%`, maxWidth: 'none' }} />
                            </div>

                            {/* Slider line */}
                            <div className="absolute top-0 bottom-0 z-10" style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}>
                                <div className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1.5px_rgba(0,0,0,0.4)]" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-gray-900 rounded-full shadow-xl flex items-center justify-center border border-gray-200 dark:border-white/20">
                                    <FaExchangeAlt className="text-gray-600 dark:text-gray-300 text-xs" />
                                </div>
                            </div>

                            {/* Corner labels */}
                            <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 backdrop-blur rounded text-white text-xs font-bold pointer-events-none">Original</div>
                            <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 backdrop-blur rounded text-xs font-bold pointer-events-none" style={{ color: cvd.color }}>
                                {mode === 'simulate' ? `${cvd.name} View` : `Corrected`}
                            </div>
                            {isProcessing && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                    <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}

                            {/* Zoom toggle */}
                            <button onClick={() => setZoom(z => !z)} className="absolute bottom-3 right-3 w-8 h-8 bg-black/60 backdrop-blur rounded-lg flex items-center justify-center text-white hover:bg-black/80 transition-colors">
                                {zoom ? <FaCompress className="text-xs" /> : <FaExpand className="text-xs" />}
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── View: Side by Side ── */}
                {imageSrc && viewMode === 'side' && (
                    <motion.div key="side" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                        {[
                            { label: 'Original', src: imageSrc, isOrig: true },
                            { label: `${mode === 'simulate' ? 'Simulated' : 'Corrected'} — ${cvd.name}`, src: null, isOrig: false },
                        ].map(({ label, src, isOrig }) => (
                            <div key={label} className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-lg">
                                <div className={`px-4 py-2.5 border-b border-gray-100 dark:border-white/5 text-xs font-bold ${isOrig ? 'text-gray-500' : cvd.text}`}>
                                    {label}
                                </div>
                                {isOrig
                                    ? <img src={src} alt="original" className="w-full h-auto" />
                                    : <canvas ref={procCanvasRef} className="w-full h-auto" />
                                }
                            </div>
                        ))}
                    </motion.div>
                )}

                {/* ── View: Grid (all 4 types) ── */}
                {imageSrc && viewMode === 'grid' && (
                    <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <FaLightbulb className="text-amber-400" />
                            <span>All 4 color blindness types — <strong>{mode === 'simulate' ? 'simulated view' : 'colour-corrected version'}</strong> at {intensity}% intensity</span>
                        </div>
                        {/* Original */}
                        <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
                            <div className="px-4 py-2.5 border-b border-gray-100 dark:border-white/5 text-xs font-bold text-gray-500 flex justify-between items-center">
                                <span>Original Image</span>
                                {stats && <span className="text-gray-400">{stats.width}×{stats.height}px</span>}
                            </div>
                            <img src={imageSrc} alt="original" className="w-full max-h-52 object-contain py-2 bg-gray-50 dark:bg-black/20" />
                        </div>
                        {/* 2×2 grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {Object.values(CVD_TYPES).map((t) => (
                                <div key={t.id} className={`bg-white dark:bg-[#0d1117] rounded-2xl border overflow-hidden shadow-sm transition-all ${activeType === t.id ? `${t.border} ring-2 ring-offset-2 ring-offset-gray-50 dark:ring-offset-[#080c14]` : 'border-gray-200 dark:border-white/5'}`}
                                    style={activeType === t.id ? { '--tw-ring-color': t.color } : {}}
                                >
                                    <div className={`px-4 py-2.5 border-b border-gray-100 dark:border-white/5 flex justify-between items-center`}>
                                        <div>
                                            <span className={`text-xs font-black ${t.text}`}>{t.name}</span>
                                            <span className="text-[10px] text-gray-400 ml-2">{t.prevalence}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setActiveType(t.id); setViewMode('compare'); }} className="text-[10px] font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                                                Compare →
                                            </button>
                                            <button onClick={() => downloadGrid(t.id)} className="text-[10px] font-bold text-violet-400 hover:text-violet-500 transition-colors">
                                                ↓ Save
                                            </button>
                                        </div>
                                    </div>
                                    {gridData[t.id]
                                        ? <img src={gridData[t.id]} alt={t.name} className="w-full max-h-48 object-contain py-2 bg-gray-50 dark:bg-black/20" />
                                        : <div className="h-48 flex items-center justify-center text-gray-300 dark:text-gray-600">Processing…</div>
                                    }
                                    <div className={`px-3 py-2 ${t.bg} text-[10px] ${t.text} font-medium`}>{t.type} — {t.description}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* ── Stats row ── */}
                {imageSrc && stats && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: 'Type', value: cvd.name, sub: cvd.type, color: cvd.text },
                            { label: 'Mode', value: mode === 'simulate' ? 'Simulate' : 'Correct', sub: mode === 'simulate' ? 'Viénot matrix' : 'Daltonize', color: mode === 'simulate' ? 'text-violet-400' : 'text-emerald-400' },
                            { label: 'Pixels Affected', value: `${stats.changedPct}%`, sub: `of ${(stats.width * stats.height).toLocaleString()} total`, color: cvd.text },
                            { label: 'Resolution', value: `${stats.width}×${stats.height}`, sub: `${Math.round(stats.width * stats.height / 1000)}K pixels`, color: 'text-blue-400' },
                        ].map((s) => (
                            <div key={s.label} className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 p-4 shadow-sm">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{s.label}</p>
                                <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                                <p className="text-[10px] text-gray-400">{s.sub}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── How it works ── */}
                <div className="bg-white dark:bg-[#0d1117] rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-sm">
                    <h3 className="font-bold text-sm text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                        <FaInfoCircle className="text-violet-500" /> How It Works
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: FaEye, color: 'text-violet-500', bg: 'bg-violet-500/5 border-violet-500/20', title: 'Simulate Mode (Machado 2009)', desc: 'sRGB gamma is decoded → Machado 2009 physiologically-based matrices applied in linear RGB space → gamma re-encoded. This is the gold standard used by professional color accessibility tools.' },
                            { icon: FaMagic, color: 'text-emerald-500', bg: 'bg-emerald-500/5 border-emerald-500/20', title: 'Correct Mode (Daltonize)', desc: 'Simulates the deficiency in linear space, computes the exact lost color signal, then redistributes it to channels the person can perceive — making the image more distinguishable.' },
                            { icon: FaSlidersH, color: 'text-amber-500', bg: 'bg-amber-500/5 border-amber-500/20', title: 'Intensity Control', desc: 'Blends original and processed values in linear (not gamma-encoded) space for perceptually smooth transitions. 50% shows partial severity, useful for mild color deficiencies.' },
                        ].map(({ icon: Icon, color, bg, title, desc }) => (
                            <div key={title} className={`flex items-start gap-3 p-4 rounded-xl border ${bg}`}>
                                <Icon className={`${color} mt-0.5 flex-shrink-0`} />
                                <div>
                                    <p className={`font-bold text-sm ${color}`}>{title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageRecolor;
