import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CheckContrast(color1, color2) {
    // Helper to calculate relative luminance
    const luminance = (r, g, b) => {
        var a = [r, g, b].map(function (v) {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    // Helper to extract RGB from hex
    const hexToRgb = (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 0;

    const l1 = luminance(rgb1.r, rgb1.g, rgb1.b);
    const l2 = luminance(rgb2.r, rgb2.g, rgb2.b);

    const ratio = l1 > l2
        ? ((l1 + 0.05) / (l2 + 0.05))
        : ((l2 + 0.05) / (l1 + 0.05));

    return parseFloat(ratio.toFixed(2));
}

const ContrastChecker = () => {
    const [foreground, setForeground] = useState('#000000');
    const [background, setBackground] = useState('#ffffff');

    const ratio = CheckContrast(foreground, background);

    const getRating = (ratio, type) => {
        if (type === 'AA-normal') return ratio >= 4.5 ? 'PASS' : 'FAIL';
        if (type === 'AA-large') return ratio >= 3.0 ? 'PASS' : 'FAIL';
        if (type === 'AAA-normal') return ratio >= 7.0 ? 'PASS' : 'FAIL';
        if (type === 'AAA-large') return ratio >= 4.5 ? 'PASS' : 'FAIL';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white px-4 py-8 pt-24 transition-colors duration-300">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-4">
                        <div className="bg-white dark:bg-gray-900 rounded-full px-6 py-2">
                            <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-400 uppercase tracking-wider">
                                Accessibility Tool
                            </span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-300 dark:to-gray-500">
                        Contrast Checker
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Ensure your regular and large text is readable for everyone.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls */}
                    <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Foreground Color</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                                    <input
                                        type="color"
                                        value={foreground}
                                        onChange={(e) => setForeground(e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">HEX</span>
                                    <input
                                        type="text"
                                        value={foreground}
                                        onChange={(e) => setForeground(e.target.value)}
                                        className="block w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm pl-12 pr-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Background Color</label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-inner border border-gray-200 dark:border-gray-700">
                                    <input
                                        type="color"
                                        value={background}
                                        onChange={(e) => setBackground(e.target.value)}
                                        className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] cursor-pointer p-0 border-0"
                                    />
                                </div>
                                <div className="flex-1 relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono">HEX</span>
                                    <input
                                        type="text"
                                        value={background}
                                        onChange={(e) => setBackground(e.target.value)}
                                        className="block w-full bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-700 rounded-xl shadow-sm pl-12 pr-4 py-3 text-gray-900 dark:text-white font-mono focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="#ffffff"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center text-center">
                        <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Contrast Ratio</h2>
                        <div className={`text-7xl font-extrabold mb-8 tracking-tighter ${ratio >= 7 ? 'text-green-500' :
                            ratio >= 4.5 ? 'text-blue-500' :
                                'text-red-500'
                            }`}>
                            {ratio}:1
                        </div>

                        <div className="w-full grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Normal Text</div>
                                <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">WCAG AA</div>
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getRating(ratio, 'AA-normal') === 'PASS' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                                    {getRating(ratio, 'AA-normal')}
                                </span>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Large Text</div>
                                <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">WCAG AA</div>
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getRating(ratio, 'AA-large') === 'PASS' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                                    {getRating(ratio, 'AA-large')}
                                </span>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Normal Text</div>
                                <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">WCAG AAA</div>
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getRating(ratio, 'AAA-normal') === 'PASS' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                                    {getRating(ratio, 'AAA-normal')}
                                </span>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-100 dark:border-gray-800">
                                <div className="text-xs text-gray-500 uppercase font-bold mb-1">Large Text</div>
                                <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">WCAG AAA</div>
                                <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${getRating(ratio, 'AAA-large') === 'PASS' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>
                                    {getRating(ratio, 'AAA-large')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Box */}
                <div className="mt-8 rounded-3xl p-10 shadow-xl border border-gray-200 dark:border-gray-800 transition-colors" style={{ backgroundColor: background, color: foreground }}>
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-3xl font-bold mb-4">Sample Text Preview</h3>
                        <p className="text-xl mb-6">This is how your text looks on the background. Use this preview to evaluate readability and aesthetics.</p>
                        <hr className="border-current opacity-20 my-6" />
                        <p className="text-sm opacity-80 mt-2 font-medium">Secondary text with reduced opacity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContrastChecker;
