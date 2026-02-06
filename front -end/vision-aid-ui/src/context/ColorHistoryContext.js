import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ColorHistoryContext = createContext();

export const useColorHistory = () => {
    return useContext(ColorHistoryContext);
};

export const ColorHistoryProvider = ({ children }) => {
    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem('visionAid_colorHistory');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error("Failed to load history", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('visionAid_colorHistory', JSON.stringify(history));
        } catch (error) {
            console.error("Failed to save history", error);
        }
    }, [history]);

    const addToHistory = (color, source = 'Color Picker') => {
        if (!color) return;

        setHistory(prev => {
            // Avoid duplicates at the top of the list
            if (prev.length > 0 && prev[0].hex === color.hex) return prev;

            const newItem = {
                ...color,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                source: source // Track where the color was saved from
            };

            // Keep max 20 items
            const newHistory = [newItem, ...prev].slice(0, 20);
            toast.success('Color saved to history');
            return newHistory;
        });
    };

    const clearHistory = () => {
        setHistory([]);
        toast.success('History cleared');
    };

    const removeFromHistory = (id) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    return (
        <ColorHistoryContext.Provider value={{
            history,
            addToHistory,
            clearHistory,
            removeFromHistory
        }}>
            {children}
        </ColorHistoryContext.Provider>
    );
};
