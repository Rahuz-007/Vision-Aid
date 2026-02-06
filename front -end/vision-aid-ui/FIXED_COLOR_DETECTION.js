// SIMPLIFIED ACCURATE COLOR DETECTION - Use this to replace processFrame in LiveDetector.js

const processFrame = (force = false) => {
    if ((!videoRef.current || !canvasRef.current || isFrozen) && !force) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Ensure video dimensions are valid
    if (!video.videoWidth || !video.videoHeight) return;

    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    }

    // Ensure video has data
    if (video.readyState < 2) return;

    try {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    } catch (err) {
        console.error('Error drawing video frame:', err);
        return;
    }

    let sampleX, sampleY;
    if (detectionMode === 'manual') {
        sampleX = Math.floor(pointerPos.x * canvas.width);
        sampleY = Math.floor(pointerPos.y * canvas.height);
    } else {
        sampleX = Math.floor(canvas.width / 2);
        sampleY = Math.floor(canvas.height / 2);
    }

    // Clamp coordinates
    sampleX = Math.max(0, Math.min(canvas.width - 1, sampleX));
    sampleY = Math.max(0, Math.min(canvas.height - 1, sampleY));

    // Sample a 3x3 area for slight noise reduction
    let r = 0, g = 0, b = 0;
    let count = 0;
    const radius = 1;

    try {
        const imageData = context.getImageData(
            Math.max(0, sampleX - radius),
            Math.max(0, sampleY - radius),
            Math.min(canvas.width - sampleX + radius, radius * 2 + 1),
            Math.min(canvas.height - sampleY + radius, radius * 2 + 1)
        );
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
        }

        if (count > 0) {
            r = Math.round(r / count);
            g = Math.round(g / count);
            b = Math.round(b / count);
        }
    } catch (e) {
        const p = context.getImageData(sampleX, sampleY, 1, 1).data;
        r = p[0]; g = p[1]; b = p[2];
    }

    const hex = rgbToHex(r, g, b);
    const colorName = getColorName(r, g, b);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    const newColor = {
        rgb: `rgb(${r}, ${g}, ${b})`,
        hex: hex,
        name: colorName,
        isLight: brightness > 128,
        aiDetected: false
    };

    setDetectedColor(newColor);

    if (colorName !== 'Unknown' && !isFrozen) {
        speak(colorName);
    } else if (force) {
        speak(colorName);
    }
};

const getColorName = (r, g, b) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    const avg = (r + g + b) / 3;

    // Grayscale detection
    if (diff < 30) {
        if (avg < 60) return 'Black';
        if (avg < 140) return 'Gray';
        if (avg < 210) return 'Light Gray';
        return 'White';
    }

    // Color detection
    const threshold = 40;

    if (r > g + threshold && r > b + threshold) {
        if (avg < 80) return 'Brown';
        if (g > 100 && b < 90) return 'Orange';
        if (g > 160 && b > 160) return 'Pink';
        return 'Red';
    }

    if (g > r + threshold && g > b + threshold) {
        if (avg < 80) return 'Dark Green';
        if (r > 160) return 'Yellow';
        return 'Green';
    }

    if (b > r + threshold && b > g + threshold) {
        if (avg < 80) return 'Navy';
        if (r > 100) return 'Purple';
        return 'Blue';
    }

    // Mixed colors
    if (Math.abs(r - g) < 30 && r > b + threshold) {
        return avg > 140 ? 'Yellow' : 'Orange';
    }

    if (Math.abs(g - b) < 30 && g > r + threshold) {
        return 'Cyan';
    }

    if (Math.abs(r - b) < 30 && r > g + threshold) {
        return avg > 140 ? 'Magenta' : 'Purple';
    }

    // Fallback
    if (avg < 60) return 'Black';
    if (avg > 210) return 'White';
    return 'Gray';
};

const startProcessing = () => {
    if (processingInterval.current) clearInterval(processingInterval.current);
    processingInterval.current = setInterval(() => processFrame(false), 100);
};
