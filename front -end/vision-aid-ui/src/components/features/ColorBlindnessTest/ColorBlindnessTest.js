import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Test data ────────────────────────────────────────────────────────────────
// Each round: 4 patches shown, oddIndex is the different one.
// Users with specific color blindness fail the rounds tagged to their type.
const ROUNDS = [
    {
        id: 0, type: 'control',
        label: 'Warm tones',
        colors: ['#CC2200', '#CC2200', '#CC2200', '#FF6600'],
        oddIndex: 3,
        hint: 'Warm reds & orange – control round.',
    },
    {
        id: 1, type: 'rg',
        label: 'Red vs Green',
        colors: ['#CC2200', '#CC2200', '#009900', '#CC2200'],
        oddIndex: 2,
        hint: 'Red-green colour blindness makes these look identical.',
    },
    {
        id: 2, type: 'rg',
        label: 'Orange vs Olive',
        colors: ['#FF6600', '#857200', '#FF6600', '#FF6600'],
        oddIndex: 1,
        hint: 'Orange and olive green are confused by many with deuteranopia.',
    },
    {
        id: 3, type: 'by',
        label: 'Blue vs Purple',
        colors: ['#1144CC', '#1144CC', '#8833CC', '#1144CC'],
        oddIndex: 2,
        hint: 'Blue and purple are hard to distinguish in tritanopia.',
    },
    {
        id: 4, type: 'rg',
        label: 'Green vs Brown',
        colors: ['#229900', '#229900', '#229900', '#885500'],
        oddIndex: 3,
        hint: 'Green vs brown is a classic red-green blindness confusion.',
    },
    {
        id: 5, type: 'by',
        label: 'Yellow vs Green',
        colors: ['#AACC00', '#DDCC00', '#DDCC00', '#DDCC00'],
        oddIndex: 0,
        hint: 'Yellow-green confusion indicates possible tritanopia.',
    },
    {
        id: 6, type: 'rg',
        label: 'Pink vs Gray',
        colors: ['#FF88AA', '#BB9999', '#FF88AA', '#FF88AA'],
        oddIndex: 1,
        hint: 'Pink vs gray/beige is very hard for protanopes.',
    },
    {
        id: 7, type: 'by',
        label: 'Blue vs Teal',
        colors: ['#0066DD', '#0066DD', '#0066DD', '#00AA88'],
        oddIndex: 3,
        hint: 'Blue vs teal confusion is common in tritanopia.',
    },
    {
        id: 8, type: 'rg',
        label: 'Dark Red vs Dark Green',
        colors: ['#990000', '#990000', '#006600', '#990000'],
        oddIndex: 2,
        hint: 'Dark shades of red and green look identical to many.',
    },
    {
        id: 9, type: 'control',
        label: 'Blue vs Orange',
        colors: ['#0044CC', '#0044CC', '#FF6600', '#0044CC'],
        oddIndex: 2,
        hint: 'Blue vs orange – visible to all types of colour vision.',
    },
];

const RESULT_MAP = {
    normal: {
        emoji: '🎉',
        title: 'Normal Colour Vision',
        desc: 'You correctly identified the odd colour in most rounds. Your colour discrimination appears to be within the normal range.',
        detail: 'Normal colour vision means you have all three types of cone cells functioning well.',
        color: 'from-emerald-500 to-teal-500',
    },
    rg: {
        emoji: '🔴🟢',
        title: 'Possible Red-Green Colour Blindness',
        desc: 'You had difficulty distinguishing red from green in several rounds. This is the most common form of colour vision deficiency.',
        detail: 'Red-green colour blindness (deuteranopia or protanopia) affects about 8% of men and 0.5% of women. See an optometrist for a clinical diagnosis.',
        color: 'from-orange-500 to-red-500',
    },
    by: {
        emoji: '🔵🟡',
        title: 'Possible Blue-Yellow Colour Blindness',
        desc: 'You had difficulty with blue-yellow colour pairs. This rarer form is called tritanopia and affects both men and women equally.',
        detail: 'Tritanopia affects about 0.003% of the population. See an optometrist for a clinical diagnosis.',
        color: 'from-blue-500 to-indigo-500',
    },
    mixed: {
        emoji: '🌈',
        title: 'Possible Significant Colour Vision Deficiency',
        desc: 'You found many rounds difficult across both red-green and blue-yellow categories. We recommend seeing an optometrist.',
        detail: 'This could indicate achromatopsia (complete colour blindness) or a significant colour vision deficiency. A clinical examination will give a definitive answer.',
        color: 'from-purple-500 to-pink-500',
    },
};

function getResult(answers) {
    let rgFails = 0, byFails = 0;
    ROUNDS.forEach((r, i) => {
        if (r.type === 'control') return;
        if (answers[i] !== r.oddIndex) {
            if (r.type === 'rg') rgFails++;
            else byFails++;
        }
    });
    if (rgFails >= 3 && byFails >= 2) return RESULT_MAP.mixed;
    if (rgFails >= 3) return RESULT_MAP.rg;
    if (byFails >= 2) return RESULT_MAP.by;
    return RESULT_MAP.normal;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ColorBlindnessTest() {
    const [phase, setPhase] = useState('intro'); // intro | test | result
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selected, setSelected] = useState(null);

    const round = ROUNDS[current];

    const handleSelect = useCallback((idx) => {
        if (selected !== null) return;
        setSelected(idx);
        setAnswers(prev => ({ ...prev, [current]: idx }));
        setTimeout(() => {
            if (current + 1 < ROUNDS.length) {
                setCurrent(c => c + 1);
                setSelected(null);
            } else {
                setPhase('result');
            }
        }, 900);
    }, [selected, current]);

    const restart = useCallback(() => {
        setPhase('intro'); setCurrent(0); setAnswers({}); setSelected(null);
    }, []);

    const result = phase === 'result' ? getResult(answers) : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white pt-24 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-2xl mx-auto">

                {/* ── INTRO ────────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {phase === 'intro' && (
                        <motion.div key="intro" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}>
                            <div className="text-center mb-10">
                                <div className="text-6xl mb-5">👁️</div>
                                <h1 className="text-4xl font-black mb-4">Colour Vision Screening</h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-md mx-auto">
                                    A quick 10-round test to screen for common colour vision deficiencies. Tap the patch that looks <strong className="text-gray-900 dark:text-white">different</strong> from the other three.
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 mb-8 text-sm text-amber-800 dark:text-amber-300">
                                <strong>⚠️ Disclaimer:</strong> This is a screening tool only, not a clinical diagnosis. For an accurate assessment, please consult an optometrist or ophthalmologist.
                            </div>
                            <div className="space-y-3 mb-10">
                                {[
                                    '10 rounds, each with 4 colour patches',
                                    'Tap the patch that looks different from the others',
                                    'Answer quickly — trust your first instinct',
                                    'Takes about 1–2 minutes',
                                ].map((tip, i) => (
                                    <div key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                        <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-black flex items-center justify-center flex-shrink-0">{i + 1}</span>
                                        {tip}
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => setPhase('test')}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300">
                                Start Test →
                            </button>
                        </motion.div>
                    )}

                    {/* ── TEST ─────────────────────────────────────────── */}
                    {phase === 'test' && (
                        <motion.div key={`round-${current}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
                            {/* Progress */}
                            <div className="mb-8">
                                <div className="flex justify-between text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                    <span>Round {current + 1} of {ROUNDS.length}</span>
                                    <span>{Math.round((current / ROUNDS.length) * 100)}%</span>
                                </div>
                                <div className="h-2 rounded-full bg-gray-200 dark:bg-white/10">
                                    <motion.div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                                        animate={{ width: `${(current / ROUNDS.length) * 100}%` }} transition={{ duration: 0.4 }} />
                                </div>
                            </div>

                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-black mb-2">Which patch looks different?</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">{round.label}</p>
                            </div>

                            {/* Colour patches */}
                            <div className="grid grid-cols-2 gap-5 mb-8">
                                {round.colors.map((color, idx) => {
                                    const isCorrect = idx === round.oddIndex;
                                    const isChosen = idx === selected;
                                    let ring = '';
                                    if (selected !== null) {
                                        if (isChosen && isCorrect) ring = 'ring-4 ring-emerald-500';
                                        else if (isChosen && !isCorrect) ring = 'ring-4 ring-red-500';
                                        else if (isCorrect) ring = 'ring-4 ring-emerald-500/50';
                                    }
                                    return (
                                        <motion.button key={idx} whileHover={{ scale: selected === null ? 1.04 : 1 }}
                                            whileTap={{ scale: selected === null ? 0.96 : 1 }}
                                            onClick={() => handleSelect(idx)}
                                            disabled={selected !== null}
                                            className={`aspect-square rounded-3xl shadow-lg transition-all duration-300 ${ring}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    );
                                })}
                            </div>

                            {selected !== null && (
                                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                    {round.hint}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── RESULT ───────────────────────────────────────── */}
                    {phase === 'result' && result && (
                        <motion.div key="result" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            <div className={`p-8 rounded-3xl bg-gradient-to-br ${result.color} text-white text-center mb-8 shadow-2xl`}>
                                <div className="text-6xl mb-4">{result.emoji}</div>
                                <h2 className="text-3xl font-black mb-3">{result.title}</h2>
                                <p className="text-white/80 leading-relaxed">{result.desc}</p>
                            </div>

                            <div className="p-5 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 mb-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{result.detail}</p>
                            </div>

                            {/* Round summary */}
                            <div className="mb-8">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Round Summary</h3>
                                <div className="grid grid-cols-5 gap-2">
                                    {ROUNDS.map((r, i) => {
                                        const correct = answers[i] === r.oddIndex;
                                        return (
                                            <div key={i} className={`h-10 rounded-xl flex items-center justify-center text-sm font-black ${correct ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'}`}>
                                                {correct ? '✓' : '✗'}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={restart} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition-all duration-300">
                                    Retake Test
                                </button>
                                <a href="/simulator" className="flex-1 py-4 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-bold text-lg text-center hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300">
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
