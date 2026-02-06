import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaCopy, FaCheck, FaPalette, FaImage, FaCamera } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';

const PaletteChecker = () => {
    const { currentUser } = useAuth();
    const [image, setImage] = useState(null);
    const [palette, setPalette] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedColor, setCopiedColor] = useState(null);
    const [activeTab, setActiveTab] = useState('image'); // 'image' or 'camera'
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [colorFormat, setColorFormat] = useState('hex'); // 'hex', 'rgb', 'hsl'

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    // Smart Camera: Stop if tab is hidden
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && streamRef.current && isCameraActive) {
                stopCamera();
                toast('Camera paused to save energy 🔋', { icon: 'zzz' });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isCameraActive]);

    const startCamera = async () => {
        try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error('Camera not supported');
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            streamRef.current = stream;
            setIsCameraActive(true);
            toast.success('Camera started');
        } catch (err) {
            console.error(err);
            toast.error('Failed to access camera');
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    const captureImage = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
            const imageUrl = canvas.toDataURL('image/png');
            setImage(imageUrl);
            extractPalette(imageUrl);
            stopCamera();
            setActiveTab('image');
            toast.success('Image captured!');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImage(event.target.result);
                extractPalette(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const extractPalette = (imageSrc) => {
        setIsLoading(true);
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageSrc;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxDimension = 200; // Increased for better accuracy
            const scale = Math.min(maxDimension / img.width, maxDimension / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const colorCounts = {};

            // Proper Color Quantization loop
            for (let i = 0; i < imageData.length; i += 4) {
                const r = imageData[i];
                const g = imageData[i + 1];
                const b = imageData[i + 2];
                const a = imageData[i + 3];

                if (a < 128) continue; // Skip transparency

                // Quantize colors (group similar colors)
                const quantization = 25;
                const qr = Math.round(r / quantization) * quantization;
                const qg = Math.round(g / quantization) * quantization;
                const qb = Math.round(b / quantization) * quantization;

                const key = `${qr},${qg},${qb}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            // Get top colors
            const sortedColors = Object.entries(colorCounts)
                .sort((a, b) => b[1] - a[1]) // Sort by frequency
                .slice(0, 8) // Get top 8 colors
                .map(([key]) => {
                    const [r, g, b] = key.split(',').map(Number);
                    return {
                        rgb: `rgb(${r}, ${g}, ${b})`,
                        hex: rgbToHex(r, g, b),
                        hsl: rgbToHsl(r, g, b),
                        isLight: (r * 299 + g * 587 + b * 114) / 1000 > 128,
                        contrast: getContrastAnalysis(r, g, b)
                    };
                });

            setPalette(sortedColors);
            setIsLoading(false);
        };
    };

    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    };

    // --- WCAG CONTRAST UTILS ---
    const getLuminance = (r, g, b) => {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const getContrastRatio = (l1, l2) => {
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    };

    const getContrastAnalysis = (r, g, b) => {
        const lum = getLuminance(r, g, b);
        const whiteLum = 1.0;
        const blackLum = 0.0;

        const ratioWhite = getContrastRatio(lum, whiteLum);
        const ratioBlack = getContrastRatio(lum, blackLum);

        const getRating = (ratio) => {
            if (ratio >= 7) return 'AAA';
            if (ratio >= 4.5) return 'AA';
            if (ratio >= 3) return 'AA Large';
            return 'Fail';
        };

        return {
            white: { ratio: ratioWhite.toFixed(1), rating: getRating(ratioWhite) },
            black: { ratio: ratioBlack.toFixed(1), rating: getRating(ratioBlack) }
        };
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedColor(text);
        toast.success(`Copied ${text}!`);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const getColorValue = (color) => {
        switch (colorFormat) {
            case 'rgb': return color.rgb;
            case 'hsl': return color.hsl;
            default: return color.hex;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white pt-24 pb-12 transition-colors duration-300">
            <Toaster position="bottom-center" toastOptions={{
                style: {
                    background: '#333',
                    color: '#fff',
                },
            }} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-full px-6 py-2">
                            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 uppercase tracking-wider">
                                Color Tools
                            </span>
                        </div>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-600 dark:from-white dark:via-blue-100 dark:to-gray-400">
                        Palette Generator
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Extract beautiful, accessible color palettes from any image or capture one in real-time.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Input */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Tabs */}
                        <div id="pc-tabs" className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 flex shadow-lg transition-colors">
                            <button
                                onClick={() => { setActiveTab('image'); stopCamera(); }}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'image'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <FaImage /> Upload Image
                            </button>
                            <button
                                onClick={() => { setActiveTab('camera'); startCamera(); }}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'camera'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <FaCamera /> Use Camera
                            </button>
                        </div>

                        {/* Content Area */}
                        <div id="pc-content-area" className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl min-h-[400px] transition-colors">
                            <AnimatePresence mode="wait">
                                {activeTab === 'image' ? (
                                    <motion.div
                                        key="image-tab"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all h-full flex flex-col items-center justify-center relative overflow-hidden ${image ? 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30' : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer'}`}
                                        onClick={() => !image && fileInputRef.current.click()}
                                    >
                                        {image ? (
                                            <div className="relative group w-full h-full flex items-center justify-center">
                                                <motion.img
                                                    initial={{ scale: 0.9, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    src={image}
                                                    alt="Uploaded"
                                                    className="max-w-full max-h-64 object-contain rounded-lg shadow-sm"
                                                />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center rounded-lg backdrop-blur-sm">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            fileInputRef.current.click();
                                                        }}
                                                        className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
                                                    >
                                                        <FaCloudUploadAlt /> Change Image
                                                    </motion.button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="py-12">
                                                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                                                    <FaCloudUploadAlt className="text-4xl text-blue-500 dark:text-blue-400" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload an Image</h3>
                                                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">Drag and drop an image here, or click to browse your files.</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-500 transition-colors inline-flex items-center gap-2"
                                                >
                                                    <FaImage /> Choose File
                                                </motion.button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleImageUpload}
                                            accept="image/*"
                                            className="hidden"
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="camera-tab"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full flex flex-col items-center justify-center relative rounded-xl overflow-hidden bg-black shadow-2xl"
                                    >
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className={`w-full h-64 object-cover ${!isCameraActive && 'hidden'}`}
                                        />
                                        {!isCameraActive && (
                                            <div className="text-center p-8">
                                                <FaCamera className="text-4xl text-gray-600 mx-auto mb-4" />
                                                <p className="text-gray-400">Camera is inactive</p>
                                            </div>
                                        )}
                                        {isCameraActive && (
                                            <>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={stopCamera}
                                                    className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg backdrop-blur-sm z-10"
                                                >
                                                    Stop Camera
                                                </motion.button>
                                                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={captureImage}
                                                        className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg flex items-center justify-center"
                                                        title="Capture"
                                                    >
                                                        <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-900"></div>
                                                    </motion.button>
                                                </div>
                                            </>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Palette */}
                    <div className="lg:col-span-7">
                        <div id="pc-palette-results" className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-8 shadow-xl min-h-[500px] transition-colors">
                            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                                <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                                    <span className="p-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg"><FaPalette /></span>
                                    Generated Palette
                                </h3>

                                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 transition-colors">
                                    {['hex', 'rgb', 'hsl'].map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setColorFormat(format)}
                                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${colorFormat === format
                                                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                        >
                                            {format.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500 dark:text-gray-400 animate-pulse">Extracting colors...</p>
                                </div>
                            ) : palette.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    initial="hidden"
                                    animate="show"
                                    layout
                                    variants={{
                                        hidden: { opacity: 0 },
                                        show: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {palette.map((color, index) => (
                                        <motion.div
                                            key={index}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                show: { opacity: 1, y: 0 }
                                            }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="group flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-white dark:hover:bg-gray-800 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-lg"
                                            onClick={() => copyToClipboard(getColorValue(color))}
                                        >
                                            <div
                                                className="w-16 h-16 rounded-lg shadow-inner border border-black/10 dark:border-white/10 shrink-0"
                                                style={{ backgroundColor: color.hex }}
                                            ></div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-mono font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                            {getColorValue(color)}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                                            {colorFormat === 'hex' ? color.rgb : color.hex}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Contrast Badges */}
                                                <div className="mt-3 flex gap-3">
                                                    <div className="flex items-center gap-2 bg-white dark:bg-black/20 rounded px-2 py-1 border border-gray-100 dark:border-white/5">
                                                        <span className="w-4 h-4 rounded-full bg-white border border-gray-200"></span>
                                                        <div className="flex flex-col leading-none">
                                                            <span className="text-[10px] text-gray-400">vs White</span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{color.contrast.white.ratio}</span>
                                                                <span className={`text-[9px] px-1 rounded ${color.contrast.white.rating === 'Fail' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                                    {color.contrast.white.rating}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 bg-white dark:bg-black/20 rounded px-2 py-1 border border-gray-100 dark:border-white/5">
                                                        <span className="w-4 h-4 rounded-full bg-black border border-gray-600"></span>
                                                        <div className="flex flex-col leading-none">
                                                            <span className="text-[10px] text-gray-400">vs Black</span>
                                                            <div className="flex items-center gap-1">
                                                                <span className="font-bold text-xs text-gray-800 dark:text-gray-200">{color.contrast.black.ratio}</span>
                                                                <span className={`text-[9px] px-1 rounded ${color.contrast.black.rating === 'Fail' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                                                    {color.contrast.black.rating}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.2 }}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600 transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                {copiedColor === getColorValue(color) ? <FaCheck className="text-green-600 dark:text-green-400" /> : <FaCopy className="text-gray-700 dark:text-white" />}
                                            </motion.button>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-800/20"
                                >
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 transition-colors">
                                        <FaPalette className="text-3xl opacity-50 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <p className="max-w-xs text-gray-500 dark:text-gray-400">Upload an image or take a photo to generate a color palette.</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaletteChecker;
