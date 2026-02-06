import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaEye, FaPalette } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const VisionOnboardingModal = () => {
    const { currentUser } = useAuth();
    const { updateSetting } = useSettings();
    const [selectedType, setSelectedType] = useState('normal');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const userKey = `vision_onboarded_${currentUser.uid}`;
            const alreadyDone = localStorage.getItem(userKey);

            // If NOT done yet, show modal
            if (!alreadyDone) {
                setIsVisible(true);
            }
        }
    }, [currentUser]);

    if (!currentUser || !isVisible) return null;

    const handleSave = () => {
        // 1. Update the App Settings
        updateSetting('visionType', selectedType);

        // 2. Mark THIS user as finished
        const userKey = `vision_onboarded_${currentUser.uid}`;
        localStorage.setItem(userKey, 'true');

        // 3. Close Modal
        setIsVisible(false);
    };

    const visionTypes = [
        { id: 'normal', name: 'Normal Vision', desc: 'No color deficiency' },
        { id: 'deuteranopia', name: 'Deuteranopia', desc: 'Red-Green (Green Blind) - Most Common' },
        { id: 'protanopia', name: 'Protanopia', desc: 'Red-Green (Red Blind)' },
        { id: 'tritanopia', name: 'Tritanopia', desc: 'Blue-Yellow (Blue Blind)' },
        { id: 'achromatopsia', name: 'Achromatopsia', desc: 'Total Color Blindness (See in Grayscale)' }
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <FaEye size={30} />
                    </div>
                    <h2 className="text-3xl font-bold mb-2">Welcome, {currentUser.displayName?.split(' ')[0] || 'Member'}!</h2>
                    <p className="text-white/80">Let's personalize VisionAid for your eyes.</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <h3 className="text-gray-900 dark:text-white font-bold mb-4 flex items-center gap-2">
                        <FaPalette className="text-blue-500" /> Select your Vision Profile:
                    </h3>

                    <div className="space-y-3 mb-8">
                        {visionTypes.map((type) => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${selectedType === type.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-gray-700'
                                    }`}
                            >
                                <div>
                                    <div className={`font-bold ${selectedType === type.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {type.name}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{type.desc}</div>
                                </div>
                                {selectedType === type.id && (
                                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                                        <FaCheck />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all transform active:scale-95 text-lg"
                    >
                        Save & Continue
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default VisionOnboardingModal;
