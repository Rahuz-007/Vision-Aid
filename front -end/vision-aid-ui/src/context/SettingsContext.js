import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    // Initialize state from local storage or defaults
    const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('visionAidSettings');
        const defaults = {
            voiceEnabled: true,
            voiceVolume: 1.0,
            speechRate: 1.0,
            showNotifications: true,
            highContrast: false,
            fontSize: 'medium',
            largeText: false,
            colorFormat: 'hex',
            showColorNames: true,
            soundEffects: true,
            hapticFeedback: false,
            visionType: 'normal', // normal, protanopia, deuteranopia, tritanopia
            hasCompletedOnboarding: false
        };

        try {
            const parsed = savedSettings ? JSON.parse(savedSettings) : {};
            return { ...defaults, ...parsed };
        } catch (e) {
            return defaults;
        }
    });

    useEffect(() => {
        localStorage.setItem('visionAidSettings', JSON.stringify(settings));

        // Apply high contrast if needed
        if (settings.highContrast) {
            document.documentElement.classList.add('high-contrast');
        } else {
            document.documentElement.classList.remove('high-contrast');
        }

        if (settings.largeText) {
            document.documentElement.classList.add('large-text');
            document.documentElement.style.fontSize = '112.5%'; // 18px base
        } else {
            document.documentElement.classList.remove('large-text');
            document.documentElement.style.fontSize = ''; // Default
        }

        if (!settings.voiceEnabled && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

    }, [settings]);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetSettings = () => {
        setSettings({
            voiceEnabled: true,
            voiceVolume: 1.0,
            speechRate: 1.0,
            showNotifications: true,
            highContrast: false,
            fontSize: 'medium',
            largeText: false,
            colorFormat: 'hex',
            showColorNames: true,
            soundEffects: true,
            hapticFeedback: false,
            visionType: 'normal',
            hasCompletedOnboarding: false
        });
    };

    const speak = useCallback((text, force = false) => {
        if (!settings.voiceEnabled && !force) {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            return;
        }

        if (!window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = settings.voiceVolume;
        utterance.rate = settings.speechRate;
        window.speechSynthesis.speak(utterance);
    }, [settings.voiceEnabled, settings.voiceVolume, settings.speechRate]);

    return (
        <SettingsContext.Provider value={{ settings, updateSetting, resetSettings, speak }}>
            {children}
        </SettingsContext.Provider>
    );
};
