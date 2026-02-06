import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaCog, FaHistory, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'preferences', label: 'Preferences', icon: FaCog },
        { id: 'history', label: 'Detection History', icon: FaHistory },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
    ];

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
                    <p className="text-gray-400">Please sign in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your account settings and preferences</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 mb-8"
                >
                    <div className="flex items-center gap-6 mb-8">
                        {currentUser.photoURL ? (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                className="w-24 h-24 rounded-full border-4 border-blue-500/50 object-cover"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold">
                                {currentUser.displayName?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold text-white mb-2">{currentUser.displayName}</h2>
                            <div className="flex items-center gap-2 text-gray-400 mb-4">
                                <FaEnvelope className="w-4 h-4" />
                                <span>{currentUser.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCheckCircle className="w-4 h-4" />
                                <span>Email Verified</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-2"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                                    activeTab === tab.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8"
                >
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Profile Information</h3>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    value={currentUser.displayName || ''}
                                    disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white disabled:opacity-50"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={currentUser.email || ''}
                                    disabled
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white opacity-50"
                                />
                            </div>
                            {isEditing && (
                                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                    Save Changes
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">User Preferences</h3>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    <span className="text-gray-300">Enable email notifications</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked className="w-5 h-5" />
                                    <span className="text-gray-300">Save detection history</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5" />
                                    <span className="text-gray-300">Share usage data for improvement</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Recent Detections</h3>
                            <div className="text-gray-400">
                                <p className="mb-4">No detection history yet. Start using the tools to build your history!</p>
                                <a href="/live-detector" className="text-blue-400 hover:text-blue-300">
                                    Go to Live Detector →
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>
                            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4 mb-6">
                                <p className="text-green-400 font-medium">✓ Your account is secure</p>
                            </div>
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Change Password
                            </button>
                            <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                Delete Account
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
