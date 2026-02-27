import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveVisionTestResult } from '../../../utils/visionTestApi';
import { useNotifications } from '../../../context/NotificationContext';

// ─── PATCH TEST DATA ──────────────────────────────────────────────────────────
const PATCH_ROUNDS = [
    { id: 0, type: 'control', label: 'Warm Tones', colors: ['#CC2200', '#CC2200', '#CC2200', '#FF6600'], oddIndex: 3, hint: 'Control round – warm reds & orange.' },
    { id: 1, type: 'rg', label: 'Red vs Green', colors: ['#CC2200', '#CC2200', '#009900', '#CC2200'], oddIndex: 2, hint: 'Red-green colour blindness makes these look identical.' },
    { id: 2, type: 'rg', label: 'Orange vs Olive', colors: ['#FF6600', '#857200', '#FF6600', '#FF6600'], oddIndex: 1, hint: 'Orange and olive green are confused by many with deuteranopia.' },
    { id: 3, type: 'by', label: 'Blue vs Purple', colors: ['#1144CC', '#1144CC', '#8833CC', '#1144CC'], oddIndex: 2, hint: 'Blue and purple are hard to distinguish in tritanopia.' },
    { id: 4, type: 'rg', label: 'Green vs Brown', colors: ['#229900', '#229900', '#229900', '#885500'], oddIndex: 3, hint: 'Classic red-green confusion.' },
    { id: 5, type: 'by', label: 'Yellow vs Green', colors: ['#AACC00', '#DDCC00', '#DDCC00', '#DDCC00'], oddIndex: 0, hint: 'Yellow-green confusion indicates possible tritanopia.' },
    { id: 6, type: 'rg', label: 'Pink vs Gray', colors: ['#FF88AA', '#BB9999', '#FF88AA', '#FF88AA'], oddIndex: 1, hint: 'Pink vs grey is very hard for protanopes.' },
    { id: 7, type: 'by', label: 'Blue vs Teal', colors: ['#0066DD', '#0066DD', '#0066DD', '#00AA88'], oddIndex: 3, hint: 'Blue vs teal—common in tritanopia.' },
    { id: 8, type: 'rg', label: 'Dark Red vs Dark Green', colors: ['#990000', '#990000', '#006600', '#990000'], oddIndex: 2, hint: 'Dark shades of red and green look identical to many.' },
    { id: 9, type: 'control', label: 'Blue vs Orange', colors: ['#0044CC', '#0044CC', '#FF6600', '#0044CC'], oddIndex: 2, hint: 'Blue vs orange – visible to all types.' },
    { id: 10, type: 'rg', label: 'Red vs Brown', colors: ['#CC3300', '#8B4513', '#CC3300', '#CC3300'], oddIndex: 1, hint: 'Red and brown confusion is common in protanopia.' },
    { id: 11, type: 'by', label: 'Cyan vs Green', colors: ['#00CCCC', '#00CC66', '#00CCCC', '#00CCCC'], oddIndex: 1, hint: 'Cyan vs green—blue-yellow axis.' },
];

// ─── ISHIHARA PLATES ──────────────────────────────────────────────────────────
// Simulated Ishihara: SVG dot pattern with a hidden number
const ISHIHARA_PLATES = [
    { id: 0, type: 'control', answer: '12', bgColor: '#E8722A', dotColor: '#D4953A', numberColor: '#F5A040', label: 'Control Plate', hint: 'Everyone should see "12" here.' },
    { id: 1, type: 'rg', answer: '8', bgColor: '#C8A060', dotColor: '#8B9B5A', numberColor: '#CC4422', label: 'RG Plate 1', hint: 'People with red-green blindness see "3" or nothing.' },
    { id: 2, type: 'rg', answer: '6', bgColor: '#A8B870', dotColor: '#D4A060', numberColor: '#7A9A40', label: 'RG Plate 2', hint: 'Red-green deficient people struggle with this.' },
    { id: 3, type: 'by', answer: '29', bgColor: '#5566BB', dotColor: '#6688DD', numberColor: '#EEC800', label: 'BY Plate', hint: 'Blue-yellow blindness makes the number hard to see.' },
    { id: 4, type: 'rg', answer: '5', bgColor: '#B8A890', dotColor: '#96AA60', numberColor: '#CC5533', label: 'RG Plate 3', hint: 'Protanopes may see "2" or nothing.' },
];

// ─── HUE ARRANGEMENT ──────────────────────────────────────────────────────────
const HUE_ITEMS = [
    { id: 0, hsl: 'hsl(0,80%,50%)', h: 0 },
    { id: 1, hsl: 'hsl(20,80%,50%)', h: 20 },
    { id: 2, hsl: 'hsl(40,80%,50%)', h: 40 },
    { id: 3, hsl: 'hsl(60,80%,50%)', h: 60 },
    { id: 4, hsl: 'hsl(80,80%,50%)', h: 80 },
    { id: 5, hsl: 'hsl(100,80%,50%)', h: 100 },
    { id: 6, hsl: 'hsl(120,80%,50%)', h: 120 },
    { id: 7, hsl: 'hsl(140,80%,50%)', h: 140 },
    { id: 8, hsl: 'hsl(160,80%,50%)', h: 160 },
];

// ─── CONTRAST ROUNDS ─────────────────────────────────────────────────────────
const CONTRAST_ROUNDS = [
    { id: 0, letter: 'E', contrast: 0.9, label: 'High Contrast' },
    { id: 1, letter: 'R', contrast: 0.6, label: 'Medium Contrast' },
    { id: 2, letter: 'F', contrast: 0.35, label: 'Low Contrast' },
    { id: 3, letter: 'P', contrast: 0.18, label: 'Very Low Contrast' },
    { id: 4, letter: 'Z', contrast: 0.08, label: 'Near Invisible' },
];

// ─── RESULTS ──────────────────────────────────────────────────────────────────
const RESULT_MAP = {
    normal: { emoji: '🎉', title: 'Normal Colour Vision', desc: 'Excellent! Your colour discrimination appears within the normal range.', detail: 'You have all three types of cone cells functioning well. Less than 5% of people achieve a perfect score.', gradient: 'from-emerald-500 to-teal-500', badge: 'bg-emerald-500' },
    rg: { emoji: '🔴🟢', title: 'Possible Red-Green Deficiency', desc: 'You had difficulty distinguishing red from green in several rounds.', detail: 'Red-green colour blindness (deuteranopia or protanopia) affects ~8% of men and 0.5% of women. Please consult an optometrist for a clinical diagnosis.', gradient: 'from-orange-500 to-red-500', badge: 'bg-orange-500' },
    by: { emoji: '🔵🟡', title: 'Possible Blue-Yellow Deficiency', desc: 'You had difficulty with blue-yellow colour pairs.', detail: 'Tritanopia affects about 0.003% of the population equally across genders. Please consult an optometrist.', gradient: 'from-blue-500 to-indigo-500', badge: 'bg-blue-500' },
    mixed: { emoji: '🌈', title: 'Significant Colour Vision Deficiency', desc: 'You found many rounds difficult across multiple categories.', detail: 'This could indicate achromatopsia or a significant deficiency. A clinical Ishihara examination is strongly recommended.', gradient: 'from-purple-500 to-pink-500', badge: 'bg-purple-500' },
};

function getResult(rgFails, byFails) {
    if (rgFails >= 4 && byFails >= 3) return RESULT_MAP.mixed;
    if (rgFails >= 4) return RESULT_MAP.rg;
    if (byFails >= 3) return RESULT_MAP.by;
    return RESULT_MAP.normal;
}

// ─── DOT PLATE SVG (Simulated Ishihara) ──────────────────────────────────────
function DotPlate({ plate, size = 260 }) {
    const dots = useRef([]);
    if (dots.current.length === 0) {
        const count = 320;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * (size / 2 - 12);
            dots.current.push({
                x: size / 2 + r * Math.cos(angle),
                y: size / 2 + r * Math.sin(angle),
                radius: 5 + Math.random() * 8,
                isNumber: false,
            });
        }
    }

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rounded-full shadow-2xl">
            <circle cx={size / 2} cy={size / 2} r={size / 2} fill={plate.bgColor} />
            {dots.current.map((d, i) => (
                <circle key={i} cx={d.x} cy={d.y} r={d.radius}
                    fill={i % 5 === 0 ? plate.numberColor : plate.dotColor}
                    opacity={0.85 + Math.random() * 0.15} />
            ))}
            <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle"
                fontSize={size * 0.28} fontWeight="bold" fontFamily="Arial"
                fill={plate.numberColor} opacity="0.9" style={{ userSelect: 'none' }}>
                {plate.answer}
            </text>
        </svg>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const MODES = [
    { id: 'patch', icon: '🎨', title: 'Colour Patch', desc: 'Find the odd colour among 4 patches', rounds: PATCH_ROUNDS.length },
    { id: 'ishihara', icon: '🔵', title: 'Ishihara Plates', desc: 'Read the hidden number in the dot pattern', rounds: ISHIHARA_PLATES.length },
    { id: 'hue', icon: '🌈', title: 'Hue Arrangement', desc: 'Sort the hues into the correct gradient order', rounds: 1 },
    { id: 'contrast', icon: '🔳', title: 'Contrast Sensitivity', desc: 'Identify letters at decreasing contrast levels', rounds: CONTRAST_ROUNDS.length },
];

export default function ColorBlindnessTest() {
    const [phase, setPhase] = useState('home'); // home | intro | test | result
    const [mode, setMode] = useState(null);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selected, setSelected] = useState(null);
    const [ishiharaInput, setIshiharaInput] = useState('');
    const [hueOrder, setHueOrder] = useState(() => [...HUE_ITEMS].sort(() => Math.random() - 0.5));
    const [dragIdx, setDragIdx] = useState(null);
    const [allScores, setAllScores] = useState({});
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [contrastAnswers, setContrastAnswers] = useState([]);
    const timerRef = useRef(null);
    const { addNotification } = useNotifications();

    // Timer
    useEffect(() => {
        if (phase === 'test') {
            timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [phase]);

    const formatTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

    // ── Patch handlers ────────────────────────────────────────────────────────
    const handlePatchSelect = useCallback((idx) => {
        if (selected !== null) return;
        setSelected(idx);
        setAnswers(prev => ({ ...prev, [current]: idx }));
        setTimeout(() => {
            if (current + 1 < PATCH_ROUNDS.length) { setCurrent(c => c + 1); setSelected(null); }
            else finishMode('patch', { ...answers, [current]: idx });
        }, 900);
    }, [selected, current, answers]);

    // ── Ishihara handlers ─────────────────────────────────────────────────────
    const handleIshiharaSubmit = useCallback(() => {
        const plate = ISHIHARA_PLATES[current];
        const correct = ishiharaInput.trim() === plate.answer;
        const newAnswers = { ...answers, [current]: { input: ishiharaInput, correct } };
        setAnswers(newAnswers);
        setIshiharaInput('');
        if (current + 1 < ISHIHARA_PLATES.length) { setCurrent(c => c + 1); }
        else finishMode('ishihara', newAnswers);
    }, [current, ishiharaInput, answers]);

    // ── Hue handlers ──────────────────────────────────────────────────────────
    const handleDragStart = (i) => setDragIdx(i);
    const handleDragOver = (e, i) => {
        e.preventDefault();
        if (dragIdx === null || dragIdx === i) return;
        const newOrder = [...hueOrder];
        const [removed] = newOrder.splice(dragIdx, 1);
        newOrder.splice(i, 0, removed);
        setHueOrder(newOrder);
        setDragIdx(i);
    };
    const handleDragEnd = () => setDragIdx(null);

    const submitHue = useCallback(() => {
        let errors = 0;
        hueOrder.forEach((item, i) => { if (item.h !== HUE_ITEMS[i].h) errors++; });
        finishMode('hue', { errors, total: HUE_ITEMS.length });
    }, [hueOrder]);

    // ── Contrast handlers ─────────────────────────────────────────────────────
    const handleContrastAnswer = useCallback((saw) => {
        const newArr = [...contrastAnswers, { roundId: current, saw }];
        setContrastAnswers(newArr);
        if (current + 1 < CONTRAST_ROUNDS.length) setCurrent(c => c + 1);
        else finishMode('contrast', newArr);
    }, [current, contrastAnswers]);

    // ── Finish ────────────────────────────────────────────────────────────────
    const finishMode = (modeId, data) => {
        clearInterval(timerRef.current);
        const newScores = { ...allScores, [modeId]: { data, time: timerSeconds } };
        setAllScores(newScores);
        setPhase('result');

        // Auto-save result (fire-and-forget, works offline via localStorage fallback)
        const resultKey = computeResultKey(modeId, data, newScores);
        saveVisionTestResult({
            mode: modeId,
            result: resultKey,
            timeTaken: timerSeconds,
            details: data,
        }).catch(() => { /* silently ignore */ });

        // Let the user know via notifications
        addNotification('success', `Completed ${modeId} test! See your results.`, { link: '/color-test' });
    };

    // Compute result key without depending on state (called before setPhase)
    const computeResultKey = (modeId, data, scores) => {
        let rgFails = 0, byFails = 0;
        if (modeId === 'patch') {
            PATCH_ROUNDS.forEach((r, i) => {
                if (r.type === 'control') return;
                if (answers[i] !== r.oddIndex) { if (r.type === 'rg') rgFails++; else byFails++; }
            });
        } else if (modeId === 'ishihara') {
            ISHIHARA_PLATES.forEach((p, i) => {
                if (p.type === 'control') return;
                if (!answers[i]?.correct) { if (p.type === 'rg') rgFails++; else byFails++; }
            });
        } else if (modeId === 'hue') {
            if ((data?.errors || 0) > 4) rgFails = 5;
        } else if (modeId === 'contrast') {
            const missed = (Array.isArray(data) ? data : []).filter(a => !a.saw).length;
            if (missed > 2) byFails = 4;
        }
        if (rgFails >= 4 && byFails >= 3) return 'mixed';
        if (rgFails >= 4) return 'rg';
        if (byFails >= 3) return 'by';
        return 'normal';
    };

    // ── Compute final result ──────────────────────────────────────────────────
    const computeResult = () => {
        let rgFails = 0, byFails = 0;
        if (mode === 'patch') {
            PATCH_ROUNDS.forEach((r, i) => {
                if (r.type === 'control') return;
                if (answers[i] !== r.oddIndex) {
                    if (r.type === 'rg') rgFails++;
                    else byFails++;
                }
            });
        } else if (mode === 'ishihara') {
            ISHIHARA_PLATES.forEach((p, i) => {
                if (p.type === 'control') return;
                if (!answers[i]?.correct) {
                    if (p.type === 'rg') rgFails++;
                    else byFails++;
                }
            });
        } else if (mode === 'hue') {
            const errors = allScores['hue']?.data?.errors || 0;
            if (errors > 4) rgFails = 5;
        } else if (mode === 'contrast') {
            const missed = (allScores['contrast']?.data || []).filter(a => !a.saw).length;
            if (missed > 2) byFails = 4;
        }
        return getResult(rgFails, byFails);
    };

    const restart = () => {
        setPhase('home'); setMode(null); setCurrent(0); setAnswers({});
        setSelected(null); setIshiharaInput(''); setTimerSeconds(0); setContrastAnswers([]);
        setHueOrder([...HUE_ITEMS].sort(() => Math.random() - 0.5));
    };

    const startMode = (m) => {
        setMode(m); setCurrent(0); setAnswers({}); setSelected(null);
        setIshiharaInput(''); setTimerSeconds(0); setContrastAnswers([]);
        setHueOrder([...HUE_ITEMS].sort(() => Math.random() - 0.5));
        setPhase('intro');
    };

    const result = phase === 'result' ? computeResult() : null;
    const modeInfo = MODES.find(m => m.id === mode);

    return (
        <div className="min-h-screen pt-24 pb-20 px-4" style={{ background: 'var(--bg-gradient, #050510)' }}>
            <style>{`
        :root { --bg-gradient: #050510; }
        .dark { --bg-gradient: #050510; }
        .cbt-page { background: linear-gradient(135deg, #0a0a1a 0%, #0d0d20 50%, #0a1020 100%); }
        .glass-card { background: rgba(255,255,255,0.04); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); }
        .glow-btn { box-shadow: 0 0 30px rgba(99,102,241,0.4); }
        .hue-chip { cursor: grab; user-select: none; border-radius: 12px; height: 56px; flex: 1; transition: transform 0.15s, box-shadow 0.15s; }
        .hue-chip:active { cursor: grabbing; transform: scale(1.07); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .mode-card { transition: transform 0.2s, box-shadow 0.2s; }
        .mode-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(99,102,241,0.25); }
      `}</style>

            <div className="max-w-2xl mx-auto cbt-page rounded-3xl p-0 overflow-hidden" style={{ background: 'transparent' }}>
                <AnimatePresence mode="wait">

                    {/* ── HOME ───────────────────────────────────────────────────────── */}
                    {phase === 'home' && (
                        <motion.div key="home" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <div className="text-center mb-10">
                                <div className="text-7xl mb-4">👁️‍🗨️</div>
                                <h1 className="text-4xl font-black text-white mb-3">Vision Test Suite</h1>
                                <p className="text-gray-400 text-lg max-w-md mx-auto leading-relaxed">
                                    Choose a test mode below. Each targets different aspects of colour vision and visual acuity.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 mb-8">
                                {MODES.map((m) => (
                                    <motion.button key={m.id} whileTap={{ scale: 0.98 }}
                                        onClick={() => startMode(m.id)}
                                        className="mode-card glass-card rounded-2xl p-5 text-left flex items-center gap-5 w-full">
                                        <div className="text-4xl flex-shrink-0">{m.icon}</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-white text-lg">{m.title}</div>
                                            <div className="text-gray-400 text-sm mt-0.5">{m.desc}</div>
                                        </div>
                                        <div className="flex flex-col items-end flex-shrink-0">
                                            <span className="text-xs bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full font-semibold">{m.rounds} {m.rounds === 1 ? 'round' : 'rounds'}</span>
                                            <span className="text-gray-500 text-xl mt-1">→</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="glass-card rounded-2xl p-4 text-sm text-amber-300 flex gap-3 items-start">
                                <span className="text-xl flex-shrink-0">⚠️</span>
                                <span><strong>Disclaimer:</strong> These are screening tools only, not a clinical diagnosis. Please consult an optometrist for an accurate assessment.</span>
                            </div>
                        </motion.div>
                    )}

                    {/* ── INTRO ──────────────────────────────────────────────────────── */}
                    {phase === 'intro' && modeInfo && (
                        <motion.div key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
                            <div className="text-6xl mb-5">{modeInfo.icon}</div>
                            <h2 className="text-3xl font-black text-white mb-3">{modeInfo.title}</h2>
                            <p className="text-gray-400 mb-8 max-w-sm mx-auto leading-relaxed">{modeInfo.desc}</p>

                            {mode === 'patch' && (
                                <div className="glass-card rounded-2xl p-5 mb-8 text-left space-y-3">
                                    {['4 colour patches appear each round', 'Tap the patch that looks different from the other three', 'Trust your first instinct — answer quickly', '12 rounds total (~2 min)'].map((t, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                            <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 text-xs font-black flex items-center justify-center">{i + 1}</span>{t}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {mode === 'ishihara' && (
                                <div className="glass-card rounded-2xl p-5 mb-8 text-left space-y-3">
                                    {['A dot pattern plate will be shown', 'Type the number you see hidden in the dots', 'If you see nothing, type "0"', '5 plates total (~1 min)'].map((t, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                            <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 text-xs font-black flex items-center justify-center">{i + 1}</span>{t}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {mode === 'hue' && (
                                <div className="glass-card rounded-2xl p-5 mb-8 text-left space-y-3">
                                    {['9 colour chips are shown in random order', 'Drag and drop to sort them into a smooth rainbow', 'Left = red, right = cyan/blue-green', 'Try to get a smooth gradient transition'].map((t, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                            <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 text-xs font-black flex items-center justify-center">{i + 1}</span>{t}
                                        </div>
                                    ))}
                                </div>
                            )}
                            {mode === 'contrast' && (
                                <div className="glass-card rounded-2xl p-5 mb-8 text-left space-y-3">
                                    {['A letter appears at decreasing contrast', 'Tap "Yes" if you can read the letter, "No" if not', 'Be honest — this tests your visual sensitivity', '5 rounds, getting progressively harder'].map((t, i) => (
                                        <div key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                                            <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400 text-xs font-black flex items-center justify-center">{i + 1}</span>{t}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button onClick={() => setPhase('home')}
                                    className="flex-1 py-4 rounded-2xl glass-card text-gray-300 font-bold text-lg hover:bg-white/5 transition-all">
                                    ← Back
                                </button>
                                <button onClick={() => setPhase('test')}
                                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg glow-btn hover:scale-[1.02] transition-all">
                                    Start Test →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── TEST: PATCH ─────────────────────────────────────────────────── */}
                    {phase === 'test' && mode === 'patch' && (
                        <motion.div key={`patch-${current}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-semibold text-gray-400">Round {current + 1} / {PATCH_ROUNDS.length}</span>
                                <span className="text-sm font-mono text-indigo-400 glass-card px-3 py-1 rounded-full">⏱ {formatTime(timerSeconds)}</span>
                                <span className="text-sm font-semibold text-gray-400">{Math.round((current / PATCH_ROUNDS.length) * 100)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 mb-8">
                                <motion.div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    animate={{ width: `${(current / PATCH_ROUNDS.length) * 100}%` }} transition={{ duration: 0.4 }} />
                            </div>
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black text-white mb-2">Which patch looks different?</h2>
                                <p className="text-gray-400 text-sm">{PATCH_ROUNDS[current].label}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-5 mb-8">
                                {PATCH_ROUNDS[current].colors.map((color, idx) => {
                                    const isCorrect = idx === PATCH_ROUNDS[current].oddIndex;
                                    const isChosen = idx === selected;
                                    let ring = '';
                                    if (selected !== null) {
                                        if (isChosen && isCorrect) ring = 'ring-4 ring-emerald-400';
                                        else if (isChosen && !isCorrect) ring = 'ring-4 ring-red-400';
                                        else if (isCorrect) ring = 'ring-4 ring-emerald-400/50';
                                    }
                                    return (
                                        <motion.button key={idx} whileHover={{ scale: selected === null ? 1.04 : 1 }} whileTap={{ scale: selected === null ? 0.96 : 1 }}
                                            onClick={() => handlePatchSelect(idx)} disabled={selected !== null}
                                            className={`aspect-square rounded-3xl shadow-xl transition-all duration-300 ${ring}`}
                                            style={{ backgroundColor: color }} />
                                    );
                                })}
                            </div>
                            {selected !== null && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm text-gray-400 italic glass-card rounded-xl p-3">
                                    {PATCH_ROUNDS[current].hint}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── TEST: ISHIHARA ─────────────────────────────────────────────── */}
                    {phase === 'test' && mode === 'ishihara' && (
                        <motion.div key={`ish-${current}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-semibold text-gray-400">Plate {current + 1} / {ISHIHARA_PLATES.length}</span>
                                <span className="text-sm font-mono text-indigo-400 glass-card px-3 py-1 rounded-full">⏱ {formatTime(timerSeconds)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 mb-8">
                                <motion.div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    animate={{ width: `${(current / ISHIHARA_PLATES.length) * 100}%` }} />
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-white mb-2">What number do you see?</h2>
                                <p className="text-gray-400 text-sm">Look carefully at the dot pattern below. Type "0" if you see nothing.</p>
                            </div>
                            <div className="flex justify-center mb-8">
                                <DotPlate plate={ISHIHARA_PLATES[current]} size={220} />
                            </div>
                            <div className="flex gap-3">
                                <input value={ishiharaInput} onChange={e => setIshiharaInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && ishiharaInput.trim() && handleIshiharaSubmit()}
                                    placeholder="Number you see…" type="text" maxLength={3}
                                    className="flex-1 px-5 py-4 rounded-2xl glass-card text-white text-xl text-center font-black outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent" />
                                <button onClick={handleIshiharaSubmit} disabled={!ishiharaInput.trim()}
                                    className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold disabled:opacity-40 transition-all hover:scale-105">
                                    Next →
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── TEST: HUE ──────────────────────────────────────────────────── */}
                    {phase === 'test' && mode === 'hue' && (
                        <motion.div key="hue-test" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-semibold text-gray-400">Hue Arrangement</span>
                                <span className="text-sm font-mono text-indigo-400 glass-card px-3 py-1 rounded-full">⏱ {formatTime(timerSeconds)}</span>
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-white mb-2">Sort the hues into order</h2>
                                <p className="text-gray-400 text-sm">Drag & drop to arrange from red → orange → yellow → green → cyan</p>
                            </div>
                            <div className="flex gap-2 mb-4 p-4 glass-card rounded-2xl">
                                {hueOrder.map((item, i) => (
                                    <div key={item.id} className="hue-chip" style={{ background: item.hsl }}
                                        draggable onDragStart={() => handleDragStart(i)}
                                        onDragOver={e => handleDragOver(e, i)} onDragEnd={handleDragEnd} />
                                ))}
                            </div>
                            <div className="flex gap-2 mb-8 px-4">
                                <span className="text-xs text-gray-500">← Red</span>
                                <div className="flex-1 h-px bg-white/10 self-center" />
                                <span className="text-xs text-gray-500">Cyan →</span>
                            </div>
                            <div className="glass-card rounded-xl p-3 text-center text-xs text-gray-400 mb-6">
                                💡 Tip: Drag the colour chips left or right to reorder them
                            </div>
                            <button onClick={submitHue}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg glow-btn hover:scale-[1.02] transition-all">
                                Submit Arrangement →
                            </button>
                        </motion.div>
                    )}

                    {/* ── TEST: CONTRAST ─────────────────────────────────────────────── */}
                    {phase === 'test' && mode === 'contrast' && (
                        <motion.div key={`contrast-${current}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-sm font-semibold text-gray-400">Level {current + 1} / {CONTRAST_ROUNDS.length}</span>
                                <span className="text-sm font-mono text-indigo-400 glass-card px-3 py-1 rounded-full">⏱ {formatTime(timerSeconds)}</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/10 mb-8">
                                <motion.div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                    animate={{ width: `${(current / CONTRAST_ROUNDS.length) * 100}%` }} />
                            </div>
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-black text-white mb-2">Can you read the letter?</h2>
                                <p className="text-gray-400 text-sm">{CONTRAST_ROUNDS[current].label}</p>
                            </div>
                            <div className="glass-card rounded-3xl flex items-center justify-center mb-8" style={{ height: 220 }}>
                                <span style={{
                                    fontSize: 120, fontWeight: 900, fontFamily: 'Arial',
                                    color: `rgba(255,255,255,${CONTRAST_ROUNDS[current].contrast})`,
                                    textShadow: 'none', userSelect: 'none',
                                }}>
                                    {CONTRAST_ROUNDS[current].letter}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleContrastAnswer(true)}
                                    className="py-5 rounded-2xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-black text-xl transition-all">
                                    ✓ Yes, I can read it
                                </motion.button>
                                <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleContrastAnswer(false)}
                                    className="py-5 rounded-2xl bg-red-600/80 hover:bg-red-600 text-white font-black text-xl transition-all">
                                    ✗ Cannot see it
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {/* ── RESULT ─────────────────────────────────────────────────────── */}
                    {phase === 'result' && result && (
                        <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className={`p-8 rounded-3xl bg-gradient-to-br ${result.gradient} text-white text-center mb-6 shadow-2xl`}>
                                <div className="text-6xl mb-4">{result.emoji}</div>
                                <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-2">{modeInfo?.title} Result</div>
                                <h2 className="text-2xl font-black mb-3">{result.title}</h2>
                                <p className="text-white/80 leading-relaxed text-sm">{result.desc}</p>
                                <div className="mt-4 text-white/60 text-xs font-mono">Completed in {formatTime(timerSeconds)}</div>
                            </div>

                            <div className="glass-card rounded-2xl p-5 mb-5">
                                <p className="text-sm text-gray-400 leading-relaxed">{result.detail}</p>
                            </div>

                            {/* Patch summary */}
                            {mode === 'patch' && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Round Summary</h3>
                                    <div className="grid grid-cols-6 gap-2">
                                        {PATCH_ROUNDS.map((r, i) => {
                                            const correct = answers[i] === r.oddIndex;
                                            return (
                                                <div key={i} title={r.label}
                                                    className={`h-10 rounded-xl flex items-center justify-center text-sm font-black ${correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {correct ? '✓' : '✗'}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Ishihara summary */}
                            {mode === 'ishihara' && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Plate Results</h3>
                                    <div className="space-y-2">
                                        {ISHIHARA_PLATES.map((p, i) => (
                                            <div key={i} className="flex items-center justify-between glass-card rounded-xl p-3">
                                                <span className="text-gray-300 text-sm">Plate {i + 1} — {p.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-500 text-xs">You: "{answers[i]?.input || '—'}"</span>
                                                    <span className={`text-sm font-black ${answers[i]?.correct ? 'text-emerald-400' : 'text-red-400'}`}>
                                                        {answers[i]?.correct ? '✓' : `✗ (${p.answer})`}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Hue summary */}
                            {mode === 'hue' && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Your Final Arrangement</h3>
                                    <div className="flex gap-2 p-4 glass-card rounded-2xl">
                                        {hueOrder.map((item) => (
                                            <div key={item.id} className="flex-1 rounded-xl" style={{ background: item.hsl, height: 48 }} />
                                        ))}
                                    </div>
                                    <p className="text-center text-gray-400 text-sm mt-3">
                                        {allScores['hue']?.data?.errors === 0 ? '🎉 Perfect arrangement!' : `${allScores['hue']?.data?.errors} chips out of order`}
                                    </p>
                                </div>
                            )}

                            {/* Contrast summary */}
                            {mode === 'contrast' && (
                                <div className="mb-6">
                                    <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Contrast Sensitivity Results</h3>
                                    <div className="space-y-2">
                                        {CONTRAST_ROUNDS.map((r, i) => {
                                            const ans = contrastAnswers.find(a => a.roundId === i);
                                            return (
                                                <div key={i} className="flex items-center justify-between glass-card rounded-xl p-3">
                                                    <span className="text-gray-300 text-sm">{r.label}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-500 text-xs" style={{ opacity: r.contrast }}>{r.letter}</span>
                                                        <span className={`font-black ${ans?.saw ? 'text-emerald-400' : 'text-red-400'}`}>
                                                            {ans?.saw ? '✓ Seen' : '✗ Missed'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={restart}
                                    className="py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg glow-btn hover:scale-[1.02] transition-all">
                                    Try Another Test
                                </button>
                                <a href="/simulator"
                                    className="py-4 rounded-2xl glass-card text-white font-bold text-lg text-center hover:bg-white/5 transition-all flex items-center justify-center">
                                    Try Simulator
                                </a>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}
