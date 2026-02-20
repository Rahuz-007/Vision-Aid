import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('visionAidTheme');
        // Default to dark mode if no preference saved
        return savedTheme ? savedTheme === 'dark' : true;
    });

    // Apply theme class to <html> and persist preference
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('visionAidTheme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = useCallback(() => {
        // Add the transitioning class for a brief flash overlay
        document.documentElement.classList.add('theme-transitioning');
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 250);

        setIsDarkMode(prev => !prev);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
