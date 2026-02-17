import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaTimes, FaClock, FaArrowRight } from 'react-icons/fa';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

/**
 * Search Component with Keyboard Shortcuts
 * Supports Ctrl+K to open, Esc to close
 */
const SearchBar = ({
    placeholder = 'Search colors, features...',
    onSearch,
    suggestions = [],
    recentSearches = [],
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    // Open search with Ctrl+K
    useKeyboardShortcuts({
        'ctrl+k': (e) => {
            e.preventDefault();
            setIsOpen(true);
        },
        'esc': () => {
            setIsOpen(false);
            setQuery('');
        }
    }, isOpen || true);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Handle search
    useEffect(() => {
        if (query.trim()) {
            // Filter suggestions based on query
            const filtered = suggestions.filter(item =>
                item.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
            setSelectedIndex(0);
        } else {
            setResults([]);
        }
    }, [query, suggestions]);

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < results.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            } else if (query.trim()) {
                handleSearch(query);
            }
        }
    };

    const handleSearch = (searchQuery) => {
        if (onSearch) {
            onSearch(searchQuery);
        }
        setIsOpen(false);
        setQuery('');
    };

    const handleSelect = (item) => {
        handleSearch(item);
    };

    const handleClear = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    return (
        <>
            {/* Compact Search Trigger Button - Icon Only */}
            <button
                onClick={() => setIsOpen(true)}
                className={`relative p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group ${className}`}
                aria-label="Search (Ctrl+K)"
                title="Search (Ctrl+K)"
            >
                <FaSearch className="w-5 h-5" />
                {/* Tooltip hint */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Search ⌘K
                </span>
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Search Dialog */}
                        <motion.div
                            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Search Input */}
                                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                    <FaSearch className="w-5 h-5 text-gray-400" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={placeholder}
                                        className="flex-1 bg-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
                                    />
                                    {query && (
                                        <button
                                            onClick={handleClear}
                                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <FaTimes className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                    <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                                        ESC
                                    </kbd>
                                </div>

                                {/* Results */}
                                <div className="max-h-96 overflow-y-auto">
                                    {query.trim() && results.length > 0 ? (
                                        <div className="py-2">
                                            <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Results
                                            </div>
                                            {results.map((result, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSelect(result)}
                                                    className={`w-full flex items-center justify-between px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${index === selectedIndex ? 'bg-gray-50 dark:bg-gray-800' : ''
                                                        }`}
                                                >
                                                    <span className="text-gray-900 dark:text-white">{result}</span>
                                                    <FaArrowRight className="w-4 h-4 text-gray-400" />
                                                </button>
                                            ))}
                                        </div>
                                    ) : query.trim() && results.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-500 dark:text-gray-400">No results found</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                                Try a different search term
                                            </p>
                                        </div>
                                    ) : recentSearches.length > 0 ? (
                                        <div className="py-2">
                                            <div className="px-6 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Recent Searches
                                            </div>
                                            {recentSearches.slice(0, 5).map((search, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSelect(search)}
                                                    className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <FaClock className="w-4 h-4 text-gray-400" />
                                                    <span className="text-gray-900 dark:text-white">{search}</span>
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <FaSearch className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400">Start typing to search</p>
                                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                                                Search for colors, features, or anything else
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">↑</kbd>
                                            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">↓</kbd>
                                            <span>Navigate</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded">↵</kbd>
                                            <span>Select</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SearchBar;
