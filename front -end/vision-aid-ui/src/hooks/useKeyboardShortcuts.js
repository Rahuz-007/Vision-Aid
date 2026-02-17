import { useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for keyboard shortcuts
 * Provides global keyboard navigation and shortcuts
 * 
 * @param {Object} shortcuts - Map of key combinations to handlers
 * @param {boolean} enabled - Whether shortcuts are enabled
 * 
 * Example usage:
 * useKeyboardShortcuts({
 *   'ctrl+k': () => openColorPicker(),
 *   'ctrl+s': () => saveColor(),
 *   'esc': () => closeModal()
 * });
 */
export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
    const handleKeyPress = useCallback((event) => {
        if (!enabled) return;

        // Build the key combination string
        const keys = [];
        if (event.ctrlKey || event.metaKey) keys.push('ctrl');
        if (event.altKey) keys.push('alt');
        if (event.shiftKey) keys.push('shift');
        keys.push(event.key.toLowerCase());

        const combination = keys.join('+');

        // Check if this combination has a handler
        if (shortcuts[combination]) {
            event.preventDefault();
            shortcuts[combination](event);
        }
    }, [shortcuts, enabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [handleKeyPress]);
};

/**
 * Global keyboard shortcuts for the entire app
 * These work across all pages
 */
export const useGlobalShortcuts = () => {
    useEffect(() => {
        const handleGlobalShortcuts = (event) => {
            // Ignore shortcuts when typing in input fields
            if (
                event.target.tagName === 'INPUT' ||
                event.target.tagName === 'TEXTAREA' ||
                event.target.isContentEditable
            ) {
                return;
            }

            const key = event.key.toLowerCase();
            const ctrl = event.ctrlKey || event.metaKey;
            const shift = event.shiftKey;

            // Ctrl+K - Quick search/command palette
            if (ctrl && key === 'k') {
                event.preventDefault();
                toast('Quick search coming soon!', { icon: '🔍' });
            }

            // Ctrl+/ - Show keyboard shortcuts help
            if (ctrl && key === '/') {
                event.preventDefault();
                showShortcutsHelp();
            }

            // Ctrl+Shift+D - Toggle dark mode
            if (ctrl && shift && key === 'd') {
                event.preventDefault();
                document.documentElement.classList.toggle('dark');
                toast.success('Theme toggled!');
            }

            // ? - Show help (when not in input)
            if (key === '?' && !ctrl && !shift) {
                event.preventDefault();
                showShortcutsHelp();
            }
        };

        window.addEventListener('keydown', handleGlobalShortcuts);
        return () => window.removeEventListener('keydown', handleGlobalShortcuts);
    }, []);
};

/**
 * Show keyboard shortcuts help modal
 */
const showShortcutsHelp = () => {
    const shortcuts = [
        { keys: 'Ctrl + K', description: 'Quick search' },
        { keys: 'Ctrl + S', description: 'Save current color' },
        { keys: 'Ctrl + C', description: 'Copy color code' },
        { keys: 'Ctrl + Shift + D', description: 'Toggle dark mode' },
        { keys: 'Space', description: 'Start/stop camera' },
        { keys: 'Esc', description: 'Close modal' },
        { keys: '?', description: 'Show this help' },
    ];

    const message = shortcuts
        .map(s => `${s.keys}: ${s.description}`)
        .join('\n');

    toast(
        <div className="text-left">
            <h3 className="font-bold mb-2">⌨️ Keyboard Shortcuts</h3>
            <div className="space-y-1 text-sm">
                {shortcuts.map((s, i) => (
                    <div key={i} className="flex justify-between gap-4">
                        <kbd className="px-2 py-1 bg-gray-700 rounded text-xs font-mono">
                            {s.keys}
                        </kbd>
                        <span className="text-gray-400">{s.description}</span>
                    </div>
                ))}
            </div>
        </div>,
        {
            duration: 6000,
            style: {
                maxWidth: '500px',
            },
        }
    );
};

/**
 * Hook for escape key to close modals
 */
export const useEscapeKey = (callback, enabled = true) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (enabled && event.key === 'Escape') {
                callback();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [callback, enabled]);
};

/**
 * Hook for Enter key to submit forms
 */
export const useEnterKey = (callback, enabled = true) => {
    useEffect(() => {
        const handleEnter = (event) => {
            if (enabled && event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handleEnter);
        return () => window.removeEventListener('keydown', handleEnter);
    }, [callback, enabled]);
};

export default useKeyboardShortcuts;
