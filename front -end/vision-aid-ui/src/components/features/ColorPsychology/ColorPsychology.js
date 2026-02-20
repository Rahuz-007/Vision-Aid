import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
    {
        id: 'red', name: 'Red', hex: '#EF4444', light: '#FEE2E2',
        emotions: ['Passion', 'Energy', 'Urgency', 'Love', 'Danger'],
        positive: "Excitement, strength, passion, love, determination",
        negative: "Aggression, danger, warning, anxiety",
        industries: ['Food & Beverage', 'Sales & Promotions', 'Sports', 'Emergency Services'],
        brands: ['Coca-Cola', 'YouTube', 'Netflix', 'Ferrari', 'Nintendo'],
        designTip: "Use red for primary CTAs, sale banners, and urgent alerts. Avoid overuse — it triggers anxiety in large areas.",
        accessibility: "Never use red alone to convey meaning. Red-green colour blindness affects 8% of men. Always pair with text labels or icons.",
        cultural: "Good luck & prosperity in China, danger in Western cultures, mourning in South Africa.",
    },
    {
        id: 'blue', name: 'Blue', hex: '#3B82F6', light: '#DBEAFE',
        emotions: ['Trust', 'Calm', 'Confidence', 'Intelligence', 'Loyalty'],
        positive: "Dependability, reliability, serenity, wisdom, professionalism",
        negative: "Coldness, aloofness, sadness, detachment",
        industries: ['Technology', 'Finance & Banking', 'Healthcare', 'Communication', 'Aviation'],
        brands: ['Facebook', 'Twitter', 'PayPal', 'Samsung', 'Intel', 'LinkedIn'],
        designTip: "Blue is the safest colour for corporate interfaces. Light blue calms, dark blue authorises. Works excellently as a primary brand colour.",
        accessibility: "Blue is one of the most accessible colours. However, blue-yellow colour blindness (tritanopia) exists — avoid blue-yellow combinations as the only distinguishing factor.",
        cultural: "Authority and trust in Western cultures, immortality in China, mourning in Iran.",
    },
    {
        id: 'green', name: 'Green', hex: '#22C55E', light: '#DCFCE7',
        emotions: ['Growth', 'Health', 'Nature', 'Harmony', 'Safety'],
        positive: "Freshness, environment, prosperity, fertility, balance",
        negative: "Envy, inexperience, boredom",
        industries: ['Environment', 'Health & Wellness', 'Finance', 'Food', 'Agriculture'],
        brands: ['Whole Foods', 'Starbucks', 'John Deere', 'Spotify', 'Animal Planet'],
        designTip: "Green is ideal for success and confirm states. Dark green signals wealth; bright green signals nature and health.",
        accessibility: "Never rely on red-green contrast alone for state changes. Always use icons and labels alongside colour to convey meaning.",
        cultural: "Luck in Ireland, sacred in Islam, jealousy in English-speaking countries.",
    },
    {
        id: 'yellow', name: 'Yellow', hex: '#EAB308', light: '#FEF9C3',
        emotions: ['Happiness', 'Optimism', 'Creativity', 'Warmth', 'Caution'],
        positive: "Cheerfulness, positivity, energy, intellect, playfulness",
        negative: "Anxiety, caution, cowardice, dishonesty",
        industries: ['Children Products', 'Food', 'Automotive', 'Creative Industries', 'Caution Signage'],
        brands: ["McDonald's", 'IKEA', 'Snapchat', 'Post-it', 'LEGO'],
        designTip: "Yellow draws attention instantly. Use for highlights, badges, and warnings. Ensure strong contrast — yellow on white fails WCAG.",
        accessibility: "Yellow on white has very low contrast. Always use dark text on yellow backgrounds. Blue-yellow confusions affect some users.",
        cultural: "Royalty and prosperity in many Asian cultures; cowardice in Western cultures; mourning in Egypt.",
    },
    {
        id: 'orange', name: 'Orange', hex: '#F97316', light: '#FFEDD5',
        emotions: ['Enthusiasm', 'Creativity', 'Adventure', 'Confidence', 'Warmth'],
        positive: "Friendliness, vitality, courage, affordability, fun",
        negative: "Over-stimulation, insincerity, superficiality",
        industries: ['Entertainment', 'Food', 'Fitness', 'Youth Brands', 'Technology'],
        brands: ['Amazon', 'Harley-Davidson', 'Nickelodeon', 'Firefox', 'Fanta'],
        designTip: "Orange works great for secondary CTAs and deals/discounts. Less aggressive than red, more energetic than yellow. Popular for sports and youth brands.",
        accessibility: "Orange provides good contrast on dark backgrounds. Avoid orange-red combinations as the only distinguishing colours.",
        cultural: "Sacred in Hinduism and Buddhism (saffron), caution/road safety in Western cultures.",
    },
    {
        id: 'purple', name: 'Purple', hex: '#A855F7', light: '#F3E8FF',
        emotions: ['Royalty', 'Wisdom', 'Luxury', 'Mystery', 'Spirituality'],
        positive: "Sophistication, creativity, imagination, dignity, ambition",
        negative: "Moodiness, arrogance, mourning, excess",
        industries: ['Luxury & Beauty', 'Spirituality', 'Creative Arts', 'Education', 'Technology'],
        brands: ['Cadbury', 'Hallmark', 'Twitch', 'FedEx', 'Yahoo'],
        designTip: "Purple combines the energy of red with the calm of blue — ideal for premium, creative, or mystical branding. Dark purple denotes luxury; light purple feels soft.",
        accessibility: "Purple-blue distinctions can be hard for tritanopes. Ensure sufficient contrast against both light and dark backgrounds.",
        cultural: "Royalty in Western cultures, mourning in Thailand, wealth in Japan.",
    },
    {
        id: 'pink', name: 'Pink', hex: '#EC4899', light: '#FCE7F3',
        emotions: ['Love', 'Compassion', 'Playfulness', 'Femininity', 'Warmth'],
        positive: "Nurturing, romantic, sweet, playful, youthful",
        negative: "Immaturity, weakness, over-sentimentality",
        industries: ['Beauty & Cosmetics', 'Fashion', 'Charity', 'Health'],
        brands: ['Barbie', "Victoria's Secret", 'T-Mobile', 'Cosmopolitan', 'Lyft'],
        designTip: "Hot pink grabs attention; soft pink soothes. Use hot pink for bold statement brands; pale pink for wellness and romance.",
        accessibility: "Pink and grey can be hard to distinguish for protanopes. Pair with labels for critical UI states.",
        cultural: "Increasingly universal in modern culture; associated with love and sensitivity globally.",
    },
    {
        id: 'black', name: 'Black', hex: '#111827', light: '#F9FAFB',
        emotions: ['Elegance', 'Power', 'Sophistication', 'Mystery', 'Authority'],
        positive: "Formality, luxury, strength, prestige, timelessness",
        negative: "Mourning, evil, oppression, heaviness",
        industries: ['Luxury', 'Fashion', 'Technology', 'Finance', 'Automotive'],
        brands: ['Chanel', 'Apple', 'Nike', 'Mercedes-Benz', 'Prada'],
        designTip: "Black elevates any brand to feel premium. Use as a primary background for luxury brands. Pair with gold, white, or vibrant accents.",
        accessibility: "Black text on white has the highest possible contrast (21:1). Always an accessible choice for body text.",
        cultural: "Mourning in Western and many Eastern cultures; power, elegance, and formality universally.",
    },
];

export default function ColorPsychology() {
    const [selected, setSelected] = useState(COLORS[0]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white pt-24 pb-20 px-4 transition-colors duration-300">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="text-5xl mb-4">🧠</div>
                    <h1 className="text-4xl font-black mb-3">Colour Psychology</h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
                        Discover the emotional, cultural, and design impact of colour. Pick a colour to explore its psychology.
                    </p>
                </motion.div>

                {/* Colour selector */}
                <div className="flex flex-wrap gap-3 justify-center mb-10">
                    {COLORS.map(c => (
                        <button key={c.id} onClick={() => setSelected(c)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border ${selected.id === c.id
                                ? 'scale-105 shadow-lg border-transparent text-white'
                                : 'bg-white dark:bg-[#111] border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:scale-105'}`}
                            style={selected.id === c.id ? { backgroundColor: c.hex } : {}}>
                            <span className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: c.hex }} />
                            {c.name}
                        </button>
                    ))}
                </div>

                {/* Detail panel */}
                <AnimatePresence mode="wait">
                    <motion.div key={selected.id}
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.3 }}>

                        {/* Hero swatch */}
                        <div className="rounded-3xl overflow-hidden mb-8 shadow-2xl" style={{ backgroundColor: selected.hex }}>
                            <div className="px-10 py-14 text-white text-center">
                                <h2 className="text-5xl font-black mb-2">{selected.name}</h2>
                                <p className="text-white/70 font-mono">{selected.hex.toUpperCase()}</p>
                                <div className="flex flex-wrap gap-2 justify-center mt-6">
                                    {selected.emotions.map(e => (
                                        <span key={e} className="px-3 py-1.5 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm">{e}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Info grid */}
                        <div className="grid md:grid-cols-2 gap-5 mb-5">
                            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                                <h3 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span>✅</span> Positive Associations
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{selected.positive}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                                <h3 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span>⚠️</span> Negative Associations
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{selected.negative}</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                                <h3 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span>🏢</span> Common Industries
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selected.industries.map(ind => (
                                        <span key={ind} className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-white/5">{ind}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                                <h3 className="font-black text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                    <span>⭐</span> Notable Brands
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selected.brands.map(b => (
                                        <span key={b} className="px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/5">{b}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Design tip */}
                        <div className="p-6 rounded-2xl mb-4 border" style={{ backgroundColor: selected.light, borderColor: selected.hex + '40' }}>
                            <h3 className="font-black mb-2 text-gray-900 flex items-center gap-2">
                                <span>💡</span> Design Tip
                            </h3>
                            <p className="text-gray-700 text-sm leading-relaxed">{selected.designTip}</p>
                        </div>

                        {/* Accessibility */}
                        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 mb-4">
                            <h3 className="font-black mb-2 text-blue-900 dark:text-blue-300 flex items-center gap-2">
                                <span>♿</span> Accessibility Consideration
                            </h3>
                            <p className="text-blue-800 dark:text-blue-400 text-sm leading-relaxed">{selected.accessibility}</p>
                        </div>

                        {/* Cultural */}
                        <div className="p-6 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5">
                            <h3 className="font-black text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                <span>🌍</span> Cultural Meaning
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{selected.cultural}</p>
                        </div>

                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
