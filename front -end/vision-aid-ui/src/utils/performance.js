/**
 * Performance Utilities
 * Utilities for optimizing React performance
 */

/**
 * Debounce function - delays execution until after wait time
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function - limits execution to once per wait time
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, wait = 300) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), wait);
        }
    };
};

/**
 * Lazy load images with Intersection Observer
 * @param {HTMLElement} element - Image element to lazy load
 */
export const lazyLoadImage = (element) => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    imageObserver.observe(element);
};

/**
 * Check if device is slow (low-end)
 * @returns {boolean} True if device is slow
 */
export const isSlowDevice = () => {
    // Check navigator.hardwareConcurrency (number of CPU cores)
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        return true;
    }

    // Check device memory (if available)
    if (navigator.deviceMemory && navigator.deviceMemory < 4) {
        return true;
    }

    // Check connection type (if available)
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        const slowConnections = ['slow-2g', '2g', '3g'];
        if (slowConnections.includes(connection.effectiveType)) {
            return true;
        }
    }

    return false;
};

/**
 * Preload critical resources
 * @param {string} url - URL of resource to preload
 * @param {string} as - Type of resource (image, script, style, etc.)
 */
export const preloadResource = (url, as = 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    document.head.appendChild(link);
};

/**
 * Dynamic import with retry logic
 * @param {Function} importFunction - Dynamic import function
 * @param {number} retries - Number of retries
 * @returns {Promise} Promise that resolves to the module
 */
export const retryDynamicImport = async (importFunction, retries = 3) => {
    try {
        return await importFunction();
    } catch (error) {
        if (retries > 0) {
            console.warn(`Import failed, retrying... (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return retryDynamicImport(importFunction, retries - 1);
        }
        throw error;
    }
};

/**
 * Measure performance of a function
 * @param {string} name - Name of the measurement
 * @param {Function} func - Function to measure
 */
export const measurePerformance = async (name, func) => {
    const start = performance.now();
    const result = await func();
    const end = performance.now();
    console.log(`[Performance] ${name}: ${(end - start).toFixed(2)}ms`);
    return result;
};

/**
 * Get Web Vitals
 * Requires 'web-vitals' package: npm install web-vitals
 */
export const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry);
            getFID(onPerfEntry);
            getFCP(onPerfEntry);
            getLCP(onPerfEntry);
            getTTFB(onPerfEntry);
        }).catch(() => {
            console.warn('web-vitals not installed. Run: npm install web-vitals');
        });
    }
};
