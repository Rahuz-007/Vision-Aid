import React, { useState, useEffect } from 'react';
import { FaServer, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const YoloHealthBadge = () => {
    const [status, setStatus] = useState('checking'); // checking, online, offline

    useEffect(() => {
        let mounted = true;
        const checkHealth = async () => {
            try {
                // Determine backend URL
                const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const response = await fetch(`${backendUrl}/health`);
                if (response.ok) {
                    const data = await response.json();

                    // The backend returns a services object containing yolo.
                    if (data?.services?.yolo?.healthy) {
                        if (mounted) setStatus('online');
                    } else if (data?.services?.yolo?.status === 'not_configured') {
                        // Special case if YOLO isn't even configured but backend is up
                        if (mounted) setStatus('offline');
                    } else {
                        if (mounted) setStatus('offline');
                    }
                } else {
                    if (mounted) setStatus('offline');
                }
            } catch (error) {
                if (mounted) setStatus('offline');
            }
        };

        checkHealth();
        // Check health every 30 seconds
        const interval = setInterval(checkHealth, 30000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    if (status === 'checking') {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 rounded-full text-xs font-bold uppercase tracking-wider tabular-nums shadow-sm">
                <FaSpinner className="animate-spin text-gray-400" /> Checking AI
            </div>
        );
    }

    if (status === 'online') {
        return (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider tabular-nums shadow-sm" title="YOLOv8 Object Detection Backend is online">
                <FaCheckCircle className="text-emerald-500" /> AI Online
            </div>
        );
    }

    return (
        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-full text-xs font-bold uppercase tracking-wider tabular-nums shadow-sm" title="YOLOv8 Object Detection Backend is offline. Only local basic detection will work.">
            <FaTimesCircle className="text-red-500" /> AI Offline
        </div>
    );
};

export default YoloHealthBadge;
