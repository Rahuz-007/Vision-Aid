import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaCog, FaEye, FaShieldAlt, FaCheckCircle, FaTrash, FaRedo } from 'react-icons/fa';
import { fetchVisionTestHistory, clearVisionTestHistory } from '../utils/visionTestApi';

// ── Helpers ───────────────────────────────────────────────────────────────────
const RESULT_LABELS = {
    normal: { label: 'Normal Vision', color: '#10b981', bg: 'rgba(16,185,129,0.15)', emoji: '🎉' },
    rg: { label: 'Red-Green', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', emoji: '🔴🟢' },
    by: { label: 'Blue-Yellow', color: '#6366f1', bg: 'rgba(99,102,241,0.15)', emoji: '🔵🟡' },
    mixed: { label: 'Significant CVD', color: '#ec4899', bg: 'rgba(236,72,153,0.15)', emoji: '🌈' },
};
const MODE_LABELS = { patch: 'Colour Patch', ishihara: 'Ishihara Plates', hue: 'Hue Arrangement', contrast: 'Contrast Sensitivity' };
const formatDate = iso => { try { return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); } catch { return '—'; } };
const formatTime = s => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;

// ── Mini bar chart ─────────────────────────────────────────────────────────────
function ResultBar({ tests }) {
    if (!tests.length) return null;
    const last10 = [...tests].reverse().slice(0, 10);
    return (
        <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Last {last10.length} Tests</p>
            <div className="flex items-end gap-2 h-20">
                {last10.map((t, i) => {
                    const info = RESULT_LABELS[t.result] || RESULT_LABELS.normal;
                    return (
                        <div key={t.id || i} className="flex-1 flex flex-col items-center gap-1" title={`${formatDate(t.createdAt)} — ${info.label}`}>
                            <div className="w-full rounded-t-lg transition-all" style={{ backgroundColor: info.color, height: `${30 + (i / last10.length) * 20}px`, opacity: 0.8 + i * 0.02 }} />
                            <span style={{ fontSize: 12 }}>{info.emoji}</span>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Oldest</span><span>Latest</span>
            </div>
        </div>
    );
}

// ── Vision History Tab ─────────────────────────────────────────────────────────
function VisionHistoryTab() {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [source, setSource] = useState('api');

    const loadHistory = useCallback(async () => {
        setLoading(true);
        const { source: src, data } = await fetchVisionTestHistory();
        setSource(src);
        setTests(data || []);
        setLoading(false);
    }, []);

    useEffect(() => { loadHistory(); }, [loadHistory]);

    const handleClear = async () => {
        if (!window.confirm('Clear all vision test history? This cannot be undone.')) return;
        await clearVisionTestHistory();
        setTests([]);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    // Stats
    const byMode = { patch: 0, ishihara: 0, hue: 0, contrast: 0 };
    const byResult = { normal: 0, rg: 0, by: 0, mixed: 0 };
    tests.forEach(t => { byMode[t.mode] = (byMode[t.mode] || 0) + 1; byResult[t.result] = (byResult[t.result] || 0) + 1; });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Vision Test History</h3>
                <div className="flex gap-2">
                    <button onClick={loadHistory} title="Refresh" className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"><FaRedo size={14} /></button>
                    {tests.length > 0 && <button onClick={handleClear} title="Clear all" className="p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-400 transition-colors"><FaTrash size={14} /></button>}
                </div>
            </div>

            {source === 'local' && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-amber-300 text-sm">
                    ⚠️ Showing local history. Sign in to sync across devices.
                </div>
            )}

            {tests.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">👁️‍🗨️</div>
                    <p className="text-gray-400 mb-4">No vision tests completed yet.</p>
                    <a href="/color-test" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Take Your First Test →</a>
                </div>
            ) : (
                <>
                    {/* Summary stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-700/50 rounded-2xl p-4">
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Total Tests</p>
                            <p className="text-4xl font-black text-white">{tests.length}</p>
                        </div>
                        <div className="bg-gray-700/50 rounded-2xl p-4">
                            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Most Recent</p>
                            <p className="text-lg font-bold text-white">{formatDate(tests[0]?.createdAt)}</p>
                        </div>
                    </div>

                    {/* Result distribution */}
                    <div className="bg-gray-700/50 rounded-2xl p-4">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Result Distribution</p>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(byResult).map(([key, count]) => {
                                const info = RESULT_LABELS[key];
                                if (!count) return null;
                                return (
                                    <div key={key} className="rounded-xl p-3 text-center" style={{ background: info.bg }}>
                                        <div className="text-lg mb-1">{info.emoji}</div>
                                        <div className="text-xl font-black" style={{ color: info.color }}>{count}</div>
                                        <div className="text-xs text-gray-400 mt-1">{info.label}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bar chart */}
                    <div className="bg-gray-700/50 rounded-2xl p-4">
                        <ResultBar tests={tests} />
                    </div>

                    {/* Test list */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">All Results</p>
                        <AnimatePresence>
                            {tests.map((t, i) => {
                                const info = RESULT_LABELS[t.result] || RESULT_LABELS.normal;
                                return (
                                    <motion.div key={t.id || i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: info.bg }}>{info.emoji}</div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{MODE_LABELS[t.mode] || t.mode}</p>
                                                <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <span className="text-sm font-bold" style={{ color: info.color }}>{info.label}</span>
                                            {t.timeTaken > 0 && <p className="text-xs text-gray-500">{formatTime(t.timeTaken)}</p>}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────
const Profile = () => {
    const { currentUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FaUser },
        { id: 'vision', label: 'Vision History', icon: FaEye },
        { id: 'preferences', label: 'Preferences', icon: FaCog },
        { id: 'security', label: 'Security', icon: FaShieldAlt },
    ];

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">👁️</div>
                    <h1 className="text-3xl font-bold text-white mb-4">Sign In Required</h1>
                    <p className="text-gray-400 mb-8">Please sign in to view your profile</p>
                    <a href="/" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">Go Home</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">Manage your account and track your vision health over time</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 mb-8">
                    <div className="flex items-center gap-6 flex-wrap">
                        {currentUser.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full border-4 border-indigo-500/50 object-cover" />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                                {currentUser.displayName?.charAt(0) || 'U'}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h2 className="text-3xl font-bold text-white mb-2 truncate">{currentUser.displayName || 'User'}</h2>
                            <div className="flex items-center gap-2 text-gray-400 mb-3">
                                <FaEnvelope className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate">{currentUser.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-green-400">
                                <FaCheckCircle className="w-4 h-4" />
                                <span className="text-sm">Email Verified</span>
                            </div>
                        </div>
                        <button onClick={() => setIsEditing(!isEditing)}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                </motion.div>

                {/* Tabs */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap font-medium transition-all duration-200 flex-shrink-0 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}>
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </motion.div>

                {/* Tab Content */}
                <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8">

                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Profile Information</h3>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Display Name</label>
                                <input type="text" value={currentUser.displayName || ''} disabled={!isEditing}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-gray-300 font-medium mb-2">Email</label>
                                <input type="email" value={currentUser.email || ''} disabled
                                    className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white opacity-50" />
                            </div>
                            {isEditing && (
                                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                                    Save Changes
                                </button>
                            )}
                        </div>
                    )}

                    {activeTab === 'vision' && <VisionHistoryTab />}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">User Preferences</h3>
                            {[
                                ['Enable email notifications', true],
                                ['Save detection history', true],
                                ['Share usage data for improvement', false],
                            ].map(([label, defaultChecked]) => (
                                <label key={label} className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" defaultChecked={defaultChecked} className="w-5 h-5 accent-indigo-500" />
                                    <span className="text-gray-300">{label}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Security Settings</h3>
                            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                                <p className="text-green-400 font-medium">✓ Your account is secure</p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                                    Change Password
                                </button>
                                <button className="px-6 py-3 bg-red-900/50 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-800/50 transition-colors font-medium">
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
