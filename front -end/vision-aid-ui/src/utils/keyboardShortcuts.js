export const SHORTCUTS = {
    TOGGLE_DARK_MODE: { key: 'd', ctrl: true, label: 'Toggle Dark Mode' },
    TOGGLE_VOICE: { key: 'v', ctrl: true, label: 'Toggle Voice Feedback' },
    START_DETECTION: { key: 's', ctrl: true, label: 'Start Detection' },
    COPY_COLOR: { key: 'c', ctrl: true, shift: true, label: 'Copy Last Color' },
    HELP: { key: '?', shift: true, label: 'Show Shortcuts' }
};

export const useKeyboardShortcut = (shortcut, callback) => {
    // Basic implementation prompt hook would go here
    // For now exporting constant map
};
