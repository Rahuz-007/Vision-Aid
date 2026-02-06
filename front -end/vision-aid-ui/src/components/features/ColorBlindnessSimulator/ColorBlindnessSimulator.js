import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudUploadAlt, FaEye, FaImage, FaCheck, FaCamera, FaVolumeUp, FaVolumeMute, FaArrowsAltH, FaColumns } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSettings } from '../../../context/SettingsContext';
import { useAuth } from '../../../context/AuthContext';

const modes = [
    { id: 'normal', name: 'Normal Vision', description: 'Full color spectrum', color: 'bg-gradient-to-r from-blue-400 to-purple-500' },
    { id: 'protanopia', name: 'Protanopia', description: 'Red-blind (missing L-cones)', color: 'bg-red-500/50' },
    { id: 'protanomaly', name: 'Protanomaly', description: 'Red-weak (malfunctioning L-cones)', color: 'bg-red-400/50' },
    { id: 'deuteranopia', name: 'Deuteranopia', description: 'Green-blind (missing M-cones)', color: 'bg-green-500/50' },
    { id: 'deuteranomaly', name: 'Deuteranomaly', description: 'Green-weak (malfunctioning M-cones)', color: 'bg-green-400/50' },
    { id: 'tritanopia', name: 'Tritanopia', description: 'Blue-blind (missing S-cones)', color: 'bg-blue-500/50' },
    { id: 'tritanomaly', name: 'Tritanomaly', description: 'Blue-weak (malfunctioning S-cones)', color: 'bg-blue-400/50' },
    { id: 'achromatopsia', name: 'Achromatopsia', description: 'Total color blindness (Grayscale)', color: 'bg-gray-500/50' },
    { id: 'achromatomaly', name: 'Achromatomaly', description: 'Partial color blindness', color: 'bg-gray-400/50' },
];

const ColorBlindnessSimulator = () => {
    const { currentUser } = useAuth();
    const { speak, settings, updateSetting } = useSettings();

    // 1. Initialize Mode based on User Settings
    const getInitialMode = () => {
        if (settings?.visionType && settings.visionType !== 'normal') {
            const savedMode = modes.find(m => m.id === settings.visionType);
            if (savedMode) return savedMode;
        }
        return modes[0];
    };

    const [selectedMode, setSelectedMode] = useState(getInitialMode);

    // 2. React to Settings Changes
    useEffect(() => {
        if (settings?.visionType) {
            const savedMode = modes.find(m => m.id === settings.visionType);
            if (savedMode && savedMode.id !== selectedMode.id) {
                if (selectedMode.id === 'normal') {
                    setSelectedMode(savedMode);
                }
            }
        }
    }, [settings.visionType]);

    const [activeTab, setActiveTab] = useState('image'); // 'image' or 'camera'
    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const [isCompareMode, setIsCompareMode] = useState(false);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isResizing, setIsResizing] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const containerRef = useRef(null);

    const handleSliderInteract = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        setSliderPosition(percentage);
    };

    const handleMouseMove = (e) => {
        if (isResizing) {
            handleSliderInteract(e.clientX);
        }
    };

    const handleTouchMove = (e) => {
        if (isResizing) {
            handleSliderInteract(e.touches[0].clientX);
        }
    };

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isResizing]);

    // Announce mode changes
    useEffect(() => {
        if (selectedMode.id !== 'normal') {
            speak(`Simulating ${selectedMode.name}`);
        }
    }, [selectedMode, speak]);

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
            speak("Camera started. You can now see the world through different filters.");
        } catch (err) {
            console.error(err);
            toast.error('Failed to access camera');
            speak("Failed to access camera. Please check permissions.");
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
        speak("Camera stopped.");
    };

    // Cleanup camera on unmount OR tab hidden
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
            stopCamera();
        };
    }, []);

    const processFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImage(e.target.result);
                setActiveTab('image');
                speak("Image uploaded successfully");
            };
            reader.readAsDataURL(file);
            toast.success('Image uploaded successfully');
        } else if (file) {
            toast.error('Please upload a valid image file');
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const toggleCamera = () => {
        if (isCameraActive) {
            stopCamera();
        } else {
            setActiveTab('camera');
            startCamera();
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const getFilterStyle = (mode) => {
        if (mode === 'normal') return {};
        return { filter: `url(#${mode})` };
    };

    const toggleVoice = () => {
        updateSetting('voiceEnabled', !settings.voiceEnabled);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white p-4 pt-24 pb-12 transition-colors duration-300">
            <div className="max-w-[1400px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6"
                >
                    <div className="text-center md:text-left">
                        <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3">
                            <div className="bg-white dark:bg-gray-900 rounded-full px-4 py-1">
                                <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 uppercase tracking-wider">
                                    Vision Simulator
                                </span>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-gray-600 dark:from-white dark:via-blue-100 dark:to-gray-400">
                            Color Blindness
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-lg">
                            Simulate various visual deficiencies on images or through your camera in real-time.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            id="sim-split-view"
                            onClick={() => setIsCompareMode(!isCompareMode)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isCompareMode
                                ? 'bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/50 text-purple-600 dark:text-purple-400'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            <FaColumns />
                            <span className="text-sm font-medium">Split View</span>
                        </button>
                        <button
                            onClick={toggleVoice}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${settings.voiceEnabled
                                ? 'bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/50 text-blue-600 dark:text-blue-400'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                        >
                            {settings.voiceEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                            <span className="text-sm font-medium">{settings.voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Controls Sidebar - Sticky and Full Height */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                        {/* Input Source Toggle */}
                        <div id="sim-input-source" className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-1.5 flex shadow-lg">
                            <button
                                onClick={() => setActiveTab('image')}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'image'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <FaImage /> Image
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('camera');
                                    if (!isCameraActive) startCamera();
                                }}
                                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeTab === 'camera'
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                    }`}
                            >
                                <FaCamera /> Live Camera
                            </button>
                        </div>

                        <AnimatePresence mode="wait">
                            {/* Upload Area */}
                            {activeTab === 'image' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl"
                                >
                                    <div
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`
                                            relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer text-center group
                                            ${isDragging
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 scale-[1.02]'
                                                : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                            aria-label="Upload an image to simulate color blindness"
                                        />
                                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <FaCloudUploadAlt className={`text-3xl ${isDragging ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-400'}`} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                            Drop image here or click to upload
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            JPG, PNG, WebP supported
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* Camera Actions */}
                            {activeTab === 'camera' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-xl"
                                >
                                    <button
                                        onClick={toggleCamera}
                                        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg ${isCameraActive
                                            ? 'bg-red-500/10 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/50 hover:bg-red-500/20 dark:hover:bg-red-500/30'
                                            : 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/50 hover:bg-green-500/20 dark:hover:bg-green-500/30'
                                            }`}
                                    >
                                        {isCameraActive ? (
                                            <><span className="animate-pulse w-3 h-3 rounded-full bg-red-500"></span> Stop Camera</>
                                        ) : (
                                            <><FaCamera /> Start Camera</>
                                        )}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Mode Selector */}
                        <div id="sim-modes" className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-xl flex flex-col h-[400px]">
                            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
                                <FaEye /> Deficiency Modes
                            </h3>
                            <div className="overflow-y-auto custom-scrollbar flex-1 space-y-2 pr-2">
                                {modes.map((mode) => (
                                    <button
                                        key={mode.id}
                                        onClick={() => setSelectedMode(mode)}
                                        aria-label={`Select ${mode.name} mode`}
                                        aria-pressed={selectedMode.id === mode.id}
                                        className={`
                                            w-full text-left p-3 rounded-xl transition-all duration-200 border relative overflow-hidden group
                                            ${selectedMode.id === mode.id
                                                ? 'bg-blue-50 dark:bg-blue-600/20 border-blue-200 dark:border-blue-500/50'
                                                : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5'
                                            }
                                        `}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${mode.color} transition-opacity duration-300 ${selectedMode.id === mode.id ? 'opacity-100' : 'opacity-0'}`}></div>
                                        <div className="flex justify-between items-center pl-3">
                                            <div>
                                                <div className={`font-semibold text-sm ${selectedMode.id === mode.id ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'}`}>
                                                    {mode.name}
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-0.5">
                                                    {mode.description}
                                                </div>
                                            </div>
                                            {selectedMode.id === mode.id && (
                                                <FaCheck className="text-blue-600 dark:text-blue-400 text-xs" />
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Preview Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col sticky top-24 transition-colors">
                            {/* Overlay Controls */}
                            <div className="absolute top-0 left-0 right-0 p-6 z-20 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                                <div className="bg-white/90 dark:bg-black/40 backdrop-blur-md border border-gray-200 dark:border-white/10 px-4 py-2 rounded-full flex items-center gap-3 pointer-events-auto shadow-sm">
                                    <div className={`w-2.5 h-2.5 rounded-full ${selectedMode.id === 'normal' ? 'bg-green-500' : 'bg-blue-500 animate-pulse'}`}></div>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{selectedMode.name}</span>
                                </div>
                                {activeTab === 'camera' && isCameraActive && (
                                    <div className="bg-red-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-red-500/30 flex items-center gap-2 pointer-events-auto">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        <span className="text-xs font-bold text-red-500 dark:text-red-400 uppercase tracking-wide">Live</span>
                                    </div>
                                )}
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 flex items-center justify-center p-4 bg-gray-200 dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black transition-colors">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'image' ? (
                                        image ? (
                                            isCompareMode ? (
                                                <div
                                                    ref={containerRef}
                                                    className="relative max-w-full max-h-[700px] rounded-lg overflow-hidden shadow-2xl cursor-col-resize select-none"
                                                    onMouseDown={() => setIsResizing(true)}
                                                    onTouchStart={() => setIsResizing(true)}
                                                >
                                                    {/* Filtered Layer (Bottom) - Right Side */}
                                                    <img
                                                        src={image}
                                                        alt="Simulation Preview"
                                                        className="max-w-full max-h-[700px] object-contain block"
                                                        style={getFilterStyle(selectedMode.id)}
                                                    />

                                                    {/* Original Layer (Top) - Left Side */}
                                                    <div
                                                        className="absolute inset-0 overflow-hidden"
                                                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt="Original Preview"
                                                            className="max-w-full max-h-[700px] object-contain block"
                                                        />
                                                    </div>

                                                    {/* Slider Handle */}
                                                    <div
                                                        className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                                        style={{ left: `${sliderPosition}%` }}
                                                    >
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 border border-gray-200">
                                                            <FaArrowsAltH size={14} />
                                                        </div>
                                                    </div>

                                                    {/* Labels */}
                                                    <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Original</div>
                                                    <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">{selectedMode.name}</div>
                                                </div>
                                            ) : (
                                                <motion.div
                                                    key="image-preview"
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="relative max-w-full max-h-[700px] rounded-lg overflow-hidden shadow-2xl"
                                                >
                                                    <img
                                                        src={image}
                                                        alt="Simulation Preview"
                                                        className="max-w-full max-h-[700px] object-contain rounded-lg shadow-lg"
                                                        style={getFilterStyle(selectedMode.id)}
                                                    />
                                                </motion.div>
                                            )
                                        ) : (
                                            <motion.div
                                                key="image-empty"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="text-center"
                                            >
                                                <div className="w-24 h-24 bg-white dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                                                    <FaImage className="text-4xl text-gray-400 dark:text-gray-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-2">No Image Selected</h3>
                                                <p className="text-gray-500 max-w-sm mx-auto text-sm">
                                                    Select an image from the sidebar to visualize color perception.
                                                </p>
                                            </motion.div>
                                        )
                                    ) : (
                                        isCompareMode ? (
                                            <div
                                                ref={containerRef}
                                                className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl cursor-col-resize select-none flex items-center justify-center"
                                                onMouseDown={() => setIsResizing(true)}
                                                onTouchStart={() => setIsResizing(true)}
                                            >
                                                {!isCameraActive && (
                                                    <div className="text-center absolute z-10 pointer-events-none">
                                                        <div className="w-24 h-24 bg-white dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                                                            <FaCamera className="text-4xl text-gray-400 dark:text-gray-600" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-2">Camera Off</h3>
                                                        <p className="text-gray-500 max-w-sm mx-auto text-sm">
                                                            Enable the camera to see the world differently.
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Filtered Layer (Bottom) - Right Side */}
                                                <video
                                                    ref={(el) => {
                                                        if (el && streamRef.current && el.srcObject !== streamRef.current) {
                                                            el.srcObject = streamRef.current;
                                                        }
                                                    }}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    className={`max-w-full max-h-[700px] object-contain block ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                                                    style={getFilterStyle(selectedMode.id)}
                                                />

                                                {/* Original Layer (Top) - Left Side */}
                                                <div
                                                    className="absolute inset-0 overflow-hidden flex items-center justify-center"
                                                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                                >
                                                    <video
                                                        ref={(el) => {
                                                            if (el && streamRef.current && el.srcObject !== streamRef.current) {
                                                                el.srcObject = streamRef.current;
                                                            }
                                                        }}
                                                        autoPlay
                                                        playsInline
                                                        muted
                                                        className={`max-w-full max-h-[700px] object-contain block ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                                                    />
                                                </div>

                                                {/* Slider Handle */}
                                                <div
                                                    className="absolute top-0 bottom-0 w-1 bg-white cursor-col-resize z-10 shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                                                    style={{ left: `${sliderPosition}%` }}
                                                >
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 border border-gray-200">
                                                        <FaArrowsAltH size={14} />
                                                    </div>
                                                </div>

                                                {/* Labels */}
                                                {isCameraActive && (
                                                    <>
                                                        <div className="absolute top-4 left-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-20">Original</div>
                                                        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md z-20">{selectedMode.name}</div>
                                                    </>
                                                )}
                                            </div>
                                        ) : (
                                            <motion.div
                                                key="camera-preview"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="relative w-full h-full flex items-center justify-center"
                                            >
                                                {!isCameraActive && (
                                                    <div className="text-center absolute z-10 pointer-events-none">
                                                        <div className="w-24 h-24 bg-white dark:bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                                                            <FaCamera className="text-4xl text-gray-400 dark:text-gray-600" />
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-300 mb-2">Camera Off</h3>
                                                        <p className="text-gray-500 max-w-sm mx-auto text-sm">
                                                            Enable the camera to see the world differently.
                                                        </p>
                                                    </div>
                                                )}
                                                <video
                                                    ref={(el) => {
                                                        videoRef.current = el;
                                                        if (el && streamRef.current && el.srcObject !== streamRef.current) {
                                                            el.srcObject = streamRef.current;
                                                        }
                                                    }}
                                                    autoPlay
                                                    playsInline
                                                    muted
                                                    className={`max-w-full max-h-[700px] object-contain rounded-lg shadow-2xl transition-opacity duration-1000 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                                                    style={getFilterStyle(selectedMode.id)}
                                                />
                                            </motion.div>
                                        )
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SVG Filters Definition (Hidden) */}
            <svg className="hidden">
                <defs>
                    <filter id="protanopia">
                        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="protanomaly">
                        <feColorMatrix type="matrix" values="0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="deuteranopia">
                        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="deuteranomaly">
                        <feColorMatrix type="matrix" values="0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="tritanopia">
                        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0 0, 0.433, 0.567, 0, 0 0, 0.475, 0.525, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="tritanomaly">
                        <feColorMatrix type="matrix" values="0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="achromatopsia">
                        <feColorMatrix type="matrix" values="0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                    <filter id="achromatomaly">
                        <feColorMatrix type="matrix" values="0.618, 0.320, 0.062, 0, 0 0.163, 0.775, 0.062, 0, 0 0.163, 0.320, 0.516, 0, 0 0, 0, 0, 1, 0" />
                    </filter>
                </defs>
            </svg>
        </div >
    );
};

export default ColorBlindnessSimulator;
