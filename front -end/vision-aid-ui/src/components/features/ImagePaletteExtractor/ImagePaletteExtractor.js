import React, { useState, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaImage, FaCopy, FaCheck, FaBookmark, FaTimes, FaMagic, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useColorHistory } from '../../../context/ColorHistoryContext';

// ─── Color Naming (inline NTC subset for common colors) ──────────────────────
const NTC_NAMES = [
    ['000000', 'Black'], ['000080', 'Navy Blue'], ['0000FF', 'Blue'], ['006400', 'Dark Green'],
    ['008000', 'Green'], ['008080', 'Teal'], ['00FFFF', 'Cyan'], ['191970', 'Midnight Blue'],
    ['1E90FF', 'Dodger Blue'], ['228B22', 'Forest Green'], ['2E8B57', 'Sea Green'], ['4169E1', 'Royal Blue'],
    ['483C32', 'Taupe'], ['4B0082', 'Indigo'], ['556B2F', 'Dark Olive Green'], ['5F9EA0', 'Cadet Blue'],
    ['6495ED', 'Cornflower Blue'], ['696969', 'Dim Gray'], ['708090', 'Slate Gray'], ['7B68EE', 'Medium Slate Blue'],
    ['800000', 'Maroon'], ['800080', 'Purple'], ['808000', 'Olive'], ['808080', 'Gray'],
    ['87CEEB', 'Sky Blue'], ['8B0000', 'Dark Red'], ['8B4513', 'Saddle Brown'], ['9370DB', 'Medium Purple'],
    ['A52A2A', 'Brown'], ['A9A9A9', 'Dark Gray'], ['B22222', 'Fire Brick'], ['BC8F8F', 'Rosy Brown'],
    ['C0C0C0', 'Silver'], ['CD5C5C', 'Indian Red'], ['D2691E', 'Chocolate'], ['D2B48C', 'Tan'],
    ['D3D3D3', 'Light Gray'], ['DC143C', 'Crimson'], ['E0FFFF', 'Light Cyan'], ['E6E6FA', 'Lavender'],
    ['EE82EE', 'Violet'], ['F08080', 'Light Coral'], ['FA8072', 'Salmon'], ['FFA500', 'Orange'],
    ['FFB6C1', 'Light Pink'], ['FFC0CB', 'Pink'], ['FFD700', 'Gold'], ['FF0000', 'Red'],
    ['FF4500', 'Orange Red'], ['FF6347', 'Tomato'], ['FF69B4', 'Hot Pink'], ['FF7F50', 'Coral'],
    ['FF8C00', 'Dark Orange'], ['FFA07A', 'Light Salmon'], ['FFFF00', 'Yellow'], ['FFFFFF', 'White'],
];

function getColorName(r, g, b) {
    let min = Infinity, best = 'Unknown';
    for (const [hex, name] of NTC_NAMES) {
        const r2 = parseInt(hex.slice(0, 2), 16);
        const g2 = parseInt(hex.slice(2, 4), 16);
        const b2 = parseInt(hex.slice(4, 6), 16);
        const d = (r - r2) ** 2 + (g - g2) ** 2 + (b - b2) ** 2;
        if (d < min) { min = d; best = name; }
    }
    return best;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function getLuminance(r, g, b) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

// ─── K-Means Color Clustering ────────────────────────────────────────────────
function kMeans(pixels, k = 6, iterations = 30) {
    if (pixels.length === 0) return [];

    // Initialize centroids from random evenly-spaced pixels
    const step = Math.max(1, Math.floor(pixels.length / k));
    let centroids = Array.from({ length: k }, (_, i) => [...pixels[i * step] || pixels[0]]);

    for (let iter = 0; iter < iterations; iter++) {
        const clusters = Array.from({ length: k }, () => []);

        // Assign each pixel to nearest centroid
        for (const pixel of pixels) {
            let minDist = Infinity, closest = 0;
            for (let j = 0; j < k; j++) {
                const d = (pixel[0] - centroids[j][0]) ** 2 + (pixel[1] - centroids[j][1]) ** 2 + (pixel[2] - centroids[j][2]) ** 2;
                if (d < minDist) { minDist = d; closest = j; }
            }
            clusters[closest].push(pixel);
        }

        // Recompute centroids
        let changed = false;
        for (let j = 0; j < k; j++) {
            if (clusters[j].length === 0) continue;
            const newC = [
                Math.round(clusters[j].reduce((s, p) => s + p[0], 0) / clusters[j].length),
                Math.round(clusters[j].reduce((s, p) => s + p[1], 0) / clusters[j].length),
                Math.round(clusters[j].reduce((s, p) => s + p[2], 0) / clusters[j].length),
            ];
            if (newC[0] !== centroids[j][0] || newC[1] !== centroids[j][1] || newC[2] !== centroids[j][2]) {
                changed = true;
            }
            centroids[j] = newC;
        }

        if (!changed) break; // Converged
    }

    // Sort by cluster size (most dominant first) and deduplicate
    return centroids
        .map((c, i) => ({ rgb: c, hex: rgbToHex(c[0], c[1], c[2]) }))
        .filter((c, i, arr) => arr.findIndex(x => x.hex === c.hex) === i);
}

// ─── Extract Palette from Canvas ─────────────────────────────────────────────
function extractPalette(imageData, numColors = 6) {
    const data = imageData.data;
    const pixels = [];
    const step = Math.max(1, Math.floor(data.length / 4 / 5000)); // sample ~5000 pixels max

    for (let i = 0; i < data.length; i += 4 * step) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        // Skip transparent / near-white / near-black
        if (a < 128) continue;
        pixels.push([r, g, b]);
    }

    return kMeans(pixels, numColors);
}

// ─── Color Swatch Card ────────────────────────────────────────────────────────
const ColorSwatch = memo(({ color, index, onSave, isSaved }) => {
    const [copied, setCopied] = useState(false);
    const luminance = getLuminance(color.rgb[0], color.rgb[1], color.rgb[2]);
    const textColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
    const name = getColorName(color.rgb[0], color.rgb[1], color.rgb[2]);

    const handleCopy = () => {
        navigator.clipboard.writeText(color.hex);
        setCopied(true);
        toast.success(`Copied ${color.hex}`);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 20 }}
            className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
            {/* Color Block */}
            <div
                className="h-28 w-full flex items-end p-3 relative cursor-pointer"
                style={{ backgroundColor: color.hex }}
                onClick={handleCopy}
            >
                {/* Copy / Save buttons */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={(e) => { e.stopPropagation(); handleCopy(); }}
                        className="p-1.5 rounded-lg backdrop-blur-sm bg-black/30 hover:bg-black/50 transition-colors"
                        title="Copy HEX"
                        style={{ color: textColor }}
                    >
                        {copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onSave(color, name); }}
                        className={`p-1.5 rounded-lg backdrop-blur-sm transition-colors ${isSaved ? 'bg-purple-500/70' : 'bg-black/30 hover:bg-black/50'}`}
                        title="Save to history"
                        style={{ color: isSaved ? '#fff' : textColor }}
                    >
                        <FaBookmark size={10} />
                    </button>
                </div>

                {/* HEX chip */}
                <span
                    className="text-xs font-mono font-bold px-2 py-1 rounded-md backdrop-blur-sm bg-black/25"
                    style={{ color: textColor }}
                >
                    {color.hex}
                </span>
            </div>

            {/* Info Row */}
            <div className="bg-white dark:bg-gray-900 px-3 py-2 border border-gray-100 dark:border-gray-800">
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{name}</p>
                <p className="text-[10px] text-gray-400 font-mono">
                    rgb({color.rgb[0]}, {color.rgb[1]}, {color.rgb[2]})
                </p>
            </div>
        </motion.div>
    );
});

ColorSwatch.displayName = 'ColorSwatch';

// ─── Main Component ───────────────────────────────────────────────────────────
const ImagePaletteExtractor = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [palette, setPalette] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [savedColors, setSavedColors] = useState(new Set());
    const [numColors, setNumColors] = useState(6);
    const [imageInfo, setImageInfo] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);
    const { addToHistory } = useColorHistory();

    const processImage = useCallback((file) => {
        if (!file || !file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file (JPG, PNG, WEBP, GIF)');
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            toast.error('File too large. Maximum 10MB allowed.');
            return;
        }

        setIsProcessing(true);
        setPalette([]);
        setSavedColors(new Set());

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target.result);
            const img = new Image();
            img.onload = () => {
                setImageInfo({ width: img.naturalWidth, height: img.naturalHeight, name: file.name, size: (file.size / 1024).toFixed(1) + ' KB' });

                const canvas = canvasRef.current;
                const maxDim = 400; // Downsample for performance
                const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const extracted = extractPalette(imageData, numColors);

                setPalette(extracted);
                setIsProcessing(false);
                toast.success(`Extracted ${extracted.length} dominant colors!`, { icon: '🎨' });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }, [numColors]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) processImage(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) processImage(file);
    };

    const handleSaveColor = (color, name) => {
        addToHistory({ name, hex: color.hex, rgb: `rgb(${color.rgb.join(', ')})`, note: 'Image Palette Extractor' }, 'Image Extractor');
        setSavedColors(prev => new Set([...prev, color.hex]));
        // context fires its own toast
    };

    const handleSaveAll = () => {
        let count = 0;
        palette.forEach(color => {
            const name = getColorName(color.rgb[0], color.rgb[1], color.rgb[2]);
            if (!savedColors.has(color.hex)) {
                addToHistory({ name, hex: color.hex, rgb: `rgb(${color.rgb.join(', ')})`, note: 'Image Palette Extractor' }, 'Image Extractor');
                count++;
            }
        });
        setSavedColors(new Set(palette.map(c => c.hex)));
        if (count > 0) toast.success(`Saved ${count} colors to history 🎨`);
    };

    const handleReset = () => {
        setImageSrc(null);
        setPalette([]);
        setSavedColors(new Set());
        setImageInfo(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleReExtract = () => {
        if (!canvasRef.current || !imageSrc) return;
        setIsProcessing(true);
        setTimeout(() => {
            const canvas = canvasRef.current;
            const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
            const extracted = extractPalette(imageData, numColors);
            setPalette(extracted);
            setIsProcessing(false);
            toast.success(`Re-extracted ${extracted.length} colors`);
        }, 50);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 pt-20 pb-20 font-sans">
            <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gradient-to-r dark:from-emerald-900 dark:to-teal-900 border border-gray-200 dark:border-emerald-500/30 rounded-full text-xs font-bold text-gray-600 dark:text-gray-200 mb-3 shadow-sm">
                        <FaMagic className="text-emerald-500" /> Image Palette Extractor
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">
                        Extract Color <span className="text-emerald-600 dark:text-emerald-400">Palettes</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-xl mx-auto">
                        Upload any image and instantly get its dominant color palette using AI-powered k-means clustering.
                    </p>
                </div>

                {/* Upload Zone */}
                <AnimatePresence mode="wait">
                    {!imageSrc ? (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            onClick={() => fileInputRef.current?.click()}
                            className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 bg-white dark:bg-gray-900 group hover:shadow-2xl hover:shadow-emerald-500/10"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                className="w-20 h-20 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:scale-110 transition-transform"
                            >
                                <FaUpload />
                            </motion.div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                Drop your image here
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                or click to browse — JPG, PNG, WEBP, GIF supported
                            </p>
                            <span className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors">
                                Choose Image
                            </span>
                            <p className="text-xs text-gray-400 mt-4">Max 10MB · Processed locally in your browser · 100% private</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            {/* Image Preview + Controls Row */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Image Preview */}
                                <div className="relative rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
                                    <img
                                        src={imageSrc}
                                        alt="Uploaded for palette extraction"
                                        className="w-full h-64 object-contain bg-gray-50 dark:bg-gray-950"
                                    />
                                    <button
                                        onClick={handleReset}
                                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors backdrop-blur-sm"
                                        title="Remove image"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                    {imageInfo && (
                                        <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                                            <p className="text-xs text-gray-500 font-medium truncate">📄 {imageInfo.name}</p>
                                            <p className="text-xs text-gray-400">{imageInfo.width} × {imageInfo.height}px · {imageInfo.size}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Controls */}
                                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 flex flex-col gap-5">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <FaEye className="text-emerald-500" />
                                            Number of Colors: <span className="text-emerald-600 dark:text-emerald-400 font-black">{numColors}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min={3}
                                            max={10}
                                            value={numColors}
                                            onChange={(e) => setNumColors(Number(e.target.value))}
                                            className="w-full accent-emerald-500 cursor-pointer"
                                        />
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>3 (minimal)</span>
                                            <span>10 (detailed)</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleReExtract}
                                        disabled={isProcessing}
                                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaMagic />
                                        {isProcessing ? 'Extracting...' : 'Re-Extract Colors'}
                                    </button>

                                    {palette.length > 0 && (
                                        <>
                                            <button
                                                onClick={handleSaveAll}
                                                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FaBookmark />
                                                Save All {palette.length} Colors to History
                                            </button>

                                            {/* Palette Strip Preview */}
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Palette Preview</p>
                                                <div className="flex rounded-xl overflow-hidden h-10 shadow-inner">
                                                    {palette.map((c, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex-1 cursor-pointer hover:flex-[2] transition-all duration-300"
                                                            style={{ backgroundColor: c.hex }}
                                                            title={c.hex}
                                                            onClick={() => { navigator.clipboard.writeText(c.hex); toast.success(`Copied ${c.hex}`); }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-emerald-500 dark:hover:border-emerald-500 text-gray-500 dark:text-gray-400 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <FaImage /> Upload Different Image
                                    </button>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                </div>
                            </div>

                            {/* Processing Indicator */}
                            <AnimatePresence>
                                {isProcessing && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-center py-8"
                                    >
                                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full"
                                            />
                                            <span className="font-bold text-gray-700 dark:text-gray-300">Running k-means clustering...</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Color Swatches Grid */}
                            {palette.length > 0 && !isProcessing && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-black text-gray-900 dark:text-white text-lg">
                                            Dominant Colors
                                            <span className="ml-2 text-sm font-normal text-gray-500">({palette.length} extracted)</span>
                                        </h3>
                                        <span className="text-xs text-gray-400">Click any swatch to copy HEX</span>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                                        {palette.map((color, i) => (
                                            <ColorSwatch
                                                key={color.hex}
                                                color={color}
                                                index={i}
                                                onSave={handleSaveColor}
                                                isSaved={savedColors.has(color.hex)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ImagePaletteExtractor;
