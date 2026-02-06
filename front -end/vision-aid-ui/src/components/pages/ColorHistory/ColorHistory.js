import React, { useState } from 'react';
import { useColorHistory } from '../../../context/ColorHistoryContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPalette, FaCopy, FaTrash, FaDownload, FaSearch,
    FaFilter, FaTh, FaList, FaExclamationCircle, FaClock
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Comprehensive Color History Page
 * Displays all saved colors with source information
 */
const ColorHistory = () => {
    const { history: colorHistory, removeFromHistory, clearHistory } = useColorHistory();
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [filterSource, setFilterSource] = useState('all'); // 'all', 'picker', 'camera'

    // Filter colors based on search and source
    const filteredColors = colorHistory.filter(color => {
        const matchesSearch = color.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            color.hex?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSource = filterSource === 'all' || color.source === filterSource;

        return matchesSearch && matchesSource;
    });

    // Get unique sources for filter
    const sources = [...new Set(colorHistory.map(c => c.source || 'Color Picker'))];

    // Copy color to clipboard
    const copyColor = (hex, format = 'hex') => {
        navigator.clipboard.writeText(hex);
        toast.success(`${format.toUpperCase()} copied!`);
    };

    // Export history as JSON
    const exportHistory = () => {
        const dataStr = JSON.stringify(colorHistory, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `visionaid-colors-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        toast.success('History exported!');
    };

    // Format timestamp
    const formatTime = (timestamp) => {
        if (!timestamp) return 'Unknown';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    // Get source icon and label
    const getSourceInfo = (source) => {
        const sources = {
            'Color Picker': { icon: '🎨', label: 'Color Picker', color: 'blue' },
            'Live Detector': { icon: '📹', label: 'Live Detector', color: 'purple' },
            'Palette Generator': { icon: '🎨', label: 'Palette', color: 'green' },
            'Manual': { icon: '✏️', label: 'Manual', color: 'gray' }
        };
        return sources[source] || sources['Color Picker'];
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pt-24 pb-20">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-gray-900 border border-gray-800 text-gray-400 text-xs font-bold uppercase tracking-widest shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
                        Your Collection
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
                        Color <span className="text-purple-500">History</span>
                    </h1>
                    <p className="text-gray-400 text-base leading-relaxed">
                        {colorHistory.length} {colorHistory.length === 1 ? 'color' : 'colors'} saved from your sessions
                    </p>
                </div>

                {/* Toolbar */}
                <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search colors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-500"
                        />
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Filter */}
                        <select
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="all">All Sources</option>
                            {sources.map(source => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>

                        {/* View Mode */}
                        <div className="flex bg-gray-900 border border-gray-800 rounded-xl">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-3 rounded-l-xl transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="Grid view"
                            >
                                <FaTh />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-3 rounded-r-xl transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                title="List view"
                            >
                                <FaList />
                            </button>
                        </div>

                        {/* Export */}
                        {colorHistory.length > 0 && (
                            <button
                                onClick={exportHistory}
                                className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                                <FaDownload className="text-green-400" />
                                <span className="hidden sm:inline">Export</span>
                            </button>
                        )}

                        {/* Clear All */}
                        {colorHistory.length > 0 && (
                            <button
                                onClick={() => {
                                    if (window.confirm('Clear all color history? This cannot be undone.')) {
                                        clearHistory();
                                    }
                                }}
                                className="px-4 py-3 bg-red-900/20 border border-red-900/30 rounded-xl text-red-400 hover:bg-red-900/30 transition-colors flex items-center gap-2"
                            >
                                <FaTrash />
                                <span className="hidden sm:inline">Clear All</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Content */}
                {filteredColors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center mb-6">
                            {searchQuery || filterSource !== 'all' ? (
                                <FaExclamationCircle className="text-4xl text-gray-600" />
                            ) : (
                                <FaPalette className="text-4xl text-gray-600" />
                            )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-400 mb-2">
                            {searchQuery || filterSource !== 'all' ? 'No colors found' : 'No saved colors yet'}
                        </h3>
                        <p className="text-gray-500 text-center max-w-md">
                            {searchQuery || filterSource !== 'all'
                                ? 'Try adjusting your search or filter'
                                : 'Start saving colors from the Color Detector to build your collection'
                            }
                        </p>
                    </div>
                ) : viewMode === 'grid' ? (
                    // Grid View
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        <AnimatePresence>
                            {filteredColors.map((color, index) => {
                                const sourceInfo = getSourceInfo(color.source || 'Color Picker');
                                return (
                                    <motion.div
                                        key={color.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
                                    >
                                        {/* Color Swatch */}
                                        <div
                                            className="h-32 relative"
                                            style={{ backgroundColor: color.hex }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>

                                        {/* Info */}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-white truncate mb-1">
                                                        {color.name || 'Unnamed Color'}
                                                    </h3>
                                                    <p className="text-sm font-mono text-gray-400">
                                                        {color.hex}
                                                    </p>
                                                </div>
                                                <span className="text-2xl ml-2" title={sourceInfo.label}>
                                                    {sourceInfo.icon}
                                                </span>
                                            </div>

                                            {/* Meta */}
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                <FaClock />
                                                <span>{formatTime(color.timestamp)}</span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => copyColor(color.hex)}
                                                    className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <FaCopy className="text-blue-400" />
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={() => removeFromHistory(color.id)}
                                                    className="px-3 py-2 bg-red-900/20 hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <FaTrash className="text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    // List View
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredColors.map((color, index) => {
                                const sourceInfo = getSourceInfo(color.source || 'Color Picker');
                                return (
                                    <motion.div
                                        key={color.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group bg-gray-900 rounded-xl border border-gray-800 hover:border-purple-500/30 transition-all duration-300 p-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Color Swatch */}
                                            <div
                                                className="w-16 h-16 rounded-lg flex-shrink-0 border-2 border-white/10"
                                                style={{ backgroundColor: color.hex }}
                                            />

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-white">
                                                        {color.name || 'Unnamed Color'}
                                                    </h3>
                                                    <span className="text-lg" title={sourceInfo.label}>
                                                        {sourceInfo.icon}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-mono text-gray-400 mb-1">
                                                    {color.hex} • RGB({color.rgb})
                                                </p>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <FaClock />
                                                    <span>{formatTime(color.timestamp)}</span>
                                                    <span>•</span>
                                                    <span>{sourceInfo.label}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => copyColor(color.hex)}
                                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <FaCopy className="text-blue-400" />
                                                    Copy
                                                </button>
                                                <button
                                                    onClick={() => removeFromHistory(color.id)}
                                                    className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                                >
                                                    <FaTrash className="text-red-400" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ColorHistory;
