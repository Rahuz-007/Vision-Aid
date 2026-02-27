import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('visionaid_notifications');
        return saved ? JSON.parse(saved) : [
            { id: Date.now() + 1, text: "Welcome to VisionAid! Try our new features.", time: "Just now", read: false, type: 'info' },
            { id: Date.now() + 2, text: "Traffic Signal Detector updated.", time: "1h ago", read: false, type: 'success', link: '/traffic-signal' },
            { id: Date.now() + 3, text: "Your profile is 80% complete.", time: "1d ago", read: true, type: 'warning', action: 'profile' }
        ];
    });

    useEffect(() => {
        localStorage.setItem('visionaid_notifications', JSON.stringify(notifications));
    }, [notifications]);

    const addNotification = useCallback((type, text, options = {}) => {
        const newNotification = {
            id: Date.now(),
            text,
            type, // 'info', 'success', 'warning', 'error'
            time: "Just now",
            read: false,
            ...options // link, action, etc.
        };
        setNotifications(prev => [newNotification, ...prev]);
    }, []);

    const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    const value = {
        notifications,
        addNotification,
        markAsRead,
        clearAllNotifications,
        unreadCount
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
