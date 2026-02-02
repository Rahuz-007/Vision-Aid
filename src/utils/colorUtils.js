// Color conversion and manipulation utilities

/**
 * Convert RGB to Hex
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Hex color code
 */
export const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
        const hex = Math.round(n).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * Convert Hex to RGB
 * @param {string} hex - Hex color code
 * @returns {object} RGB values
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * Convert RGB to HSL
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {object} HSL values
 */
export const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
            default:
                h = 0;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
};

/**
 * Get color name from RGB values (simplified version)
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} Color name
 */
export const getColorName = (r, g, b) => {
    const colorMap = [
        { name: 'Black', rgb: [0, 0, 0] },
        { name: 'White', rgb: [255, 255, 255] },
        { name: 'Red', rgb: [255, 0, 0] },
        { name: 'Green', rgb: [0, 255, 0] },
        { name: 'Blue', rgb: [0, 0, 255] },
        { name: 'Yellow', rgb: [255, 255, 0] },
        { name: 'Cyan', rgb: [0, 255, 255] },
        { name: 'Magenta', rgb: [255, 0, 255] },
        { name: 'Orange', rgb: [255, 165, 0] },
        { name: 'Purple', rgb: [128, 0, 128] },
        { name: 'Pink', rgb: [255, 192, 203] },
        { name: 'Brown', rgb: [165, 42, 42] },
        { name: 'Gray', rgb: [128, 128, 128] },
        { name: 'Dark Gray', rgb: [64, 64, 64] },
        { name: 'Light Gray', rgb: [192, 192, 192] },
        { name: 'Navy Blue', rgb: [0, 0, 128] },
        { name: 'Sky Blue', rgb: [135, 206, 235] },
        { name: 'Teal', rgb: [0, 128, 128] },
        { name: 'Lime', rgb: [0, 255, 0] },
        { name: 'Olive', rgb: [128, 128, 0] },
        { name: 'Maroon', rgb: [128, 0, 0] },
        { name: 'Forest Green', rgb: [34, 139, 34] },
        { name: 'Coral', rgb: [255, 127, 80] },
        { name: 'Lavender', rgb: [230, 230, 250] },
        { name: 'Beige', rgb: [245, 245, 220] },
        { name: 'Turquoise', rgb: [64, 224, 208] },
        { name: 'Gold', rgb: [255, 215, 0] },
        { name: 'Silver', rgb: [192, 192, 192] },
        { name: 'Crimson', rgb: [220, 20, 60] },
        { name: 'Indigo', rgb: [75, 0, 130] }
    ];

    let closestColor = 'Unknown';
    let minDistance = Infinity;

    colorMap.forEach(({ name, rgb: [cr, cg, cb] }) => {
        const distance = Math.sqrt(
            Math.pow(r - cr, 2) +
            Math.pow(g - cg, 2) +
            Math.pow(b - cb, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            closestColor = name;
        }
    });

    return closestColor;
};

/**
 * Calculate relative luminance
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {number} Relative luminance
 */
export const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Calculate contrast ratio between two colors
 * @param {number[]} rgb1 - First color [r, g, b]
 * @param {number[]} rgb2 - Second color [r, g, b]
 * @returns {number} Contrast ratio
 */
export const getContrastRatio = (rgb1, rgb2) => {
    const l1 = getLuminance(...rgb1);
    const l2 = getLuminance(...rgb2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color is considered "light"
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {boolean} True if light
 */
export const isLightColor = (r, g, b) => {
    const luminance = getLuminance(r, g, b);
    return luminance > 0.5;
};

/**
 * Get an accessible text color (black or white) for a background color
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} '#000000' or '#FFFFFF'
 */
export const getAccessibleTextColor = (r, g, b) => {
    return isLightColor(r, g, b) ? '#000000' : '#FFFFFF';
};

/**
 * Parse color string to RGB
 * @param {string} color - Color in various formats
 * @returns {object|null} RGB values or null
 */
export const parseColor = (color) => {
    if (color.startsWith('#')) {
        return hexToRgb(color);
    }

    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3])
        };
    }

    return null;
};
