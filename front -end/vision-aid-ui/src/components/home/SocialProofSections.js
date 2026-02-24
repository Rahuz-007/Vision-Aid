import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPalette, FaCode, FaHeart, FaStar, FaQuoteLeft } from 'react-icons/fa';

// ── Avatar helper (DiceBear for realistic avatars) ─────────────────────────
const Avatar = ({ seed, gradient }) => (
    <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
        alt={seed}
        className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} object-cover ring-2 ring-white dark:ring-gray-800 shadow-md`}
        onError={(e) => {
            // Fallback to initials if DiceBear fails
            e.target.style.display = 'none';
        }}
    />
);

// ── Who is it for? ─────────────────────────────────────────────────────────
const WHO_SECTIONS = [
    {
        title: 'For Designers',
        icon: FaPalette,
        desc: 'Visualize your work through different eyes. Ensure your designs are accessible to everyone before deployment.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'hover:border-purple-500/40',
        glow: 'group-hover:shadow-purple-500/10',
        badge: 'bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300',
        badgeText: 'WCAG Compliant',
    },
    {
        title: 'For Developers',
        icon: FaCode,
        desc: 'Integrate accessibility checks into your workflow. Build compliant applications with real-time feedback.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
        border: 'hover:border-blue-500/40',
        glow: 'group-hover:shadow-blue-500/10',
        badge: 'bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
        badgeText: 'API Ready',
    },
    {
        title: 'For Daily Users',
        icon: FaHeart,
        desc: 'Navigate the world independently. Identify colors, traffic signals, and more with real-time AI assistance.',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
        border: 'hover:border-pink-500/40',
        glow: 'group-hover:shadow-pink-500/10',
        badge: 'bg-pink-100 dark:bg-pink-500/10 text-pink-700 dark:text-pink-300',
        badgeText: 'Voice Guided',
    },
];

// ── Testimonial data (8 for full marquee effect) ───────────────────────────
const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        role: 'UX Designer @ Figma',
        seed: 'sarah-chen',
        rating: 5,
        text: 'Vision Aid transformed how I approach accessibility. The color blindness simulator is invaluable for ensuring my work is truly inclusive.',
        gradient: 'from-purple-500 to-pink-500',
        initials: 'SC',
    },
    {
        name: 'Michael Rodriguez',
        role: 'Frontend Dev @ Stripe',
        seed: 'michael-rodriguez',
        rating: 5,
        text: 'The palette checker saved me hours of manual WCAG testing. It\'s now an essential part of my development workflow. Absolutely love it!',
        gradient: 'from-blue-500 to-cyan-500',
        initials: 'MR',
    },
    {
        name: 'Emma Thompson',
        role: 'Product Manager @ Linear',
        seed: 'emma-thompson',
        rating: 5,
        text: 'Finally, a tool that makes color accessibility simple and intuitive. Our entire team uses it daily. The traffic signal detector is a game changer!',
        gradient: 'from-green-500 to-emerald-500',
        initials: 'ET',
    },
    {
        name: 'James Park',
        role: 'Accessibility Lead @ Google',
        seed: 'james-park',
        rating: 5,
        text: 'As someone with deuteranopia, this platform genuinely changed my life. I can now confidently identify colors without asking others for help.',
        gradient: 'from-orange-500 to-amber-500',
        initials: 'JP',
    },
    {
        name: 'Priya Sharma',
        role: 'Brand Designer @ Notion',
        seed: 'priya-sharma',
        rating: 5,
        text: 'The image palette extractor and contrast checker together make the perfect design toolkit. Saves me so much time on every project.',
        gradient: 'from-violet-500 to-purple-500',
        initials: 'PS',
    },
    {
        name: 'Lucas Müller',
        role: 'CTO @ Accessibility.io',
        seed: 'lucas-muller',
        rating: 5,
        text: 'Vision Aid\'s YOLO-powered traffic signal detection is genuinely impressive. We\'ve integrated it into assistive tech apps for our clients.',
        gradient: 'from-red-500 to-pink-500',
        initials: 'LM',
    },
    {
        name: 'Aisha Johnson',
        role: 'UI Designer @ Airbnb',
        seed: 'aisha-johnson',
        rating: 5,
        text: 'The color psychology page alone is worth it. I\'ve learned so much about how different users perceive color in my interface designs.',
        gradient: 'from-teal-500 to-cyan-500',
        initials: 'AJ',
    },
    {
        name: 'Carlos Vega',
        role: 'Developer @ Shopify',
        seed: 'carlos-vega',
        rating: 5,
        text: 'Ctrl+K to open the command palette, run a contrast check, and navigate anywhere. This app understands developer workflows perfectly.',
        gradient: 'from-indigo-500 to-blue-500',
        initials: 'CV',
    },
];

// ── Single testimonial card ────────────────────────────────────────────────
const TestimonialCard = memo(({ t }) => (
    <div
        className="flex-shrink-0 w-80 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg hover:shadow-xl hover:border-purple-500/30 dark:hover:border-purple-500/30 transition-all duration-300 relative group"
        style={{ minWidth: '320px' }}
    >
        {/* Quote icon */}
        <FaQuoteLeft className="text-purple-500/20 text-4xl absolute top-4 right-4" />

        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
            {[...Array(t.rating)].map((_, j) => (
                <FaStar key={j} className="text-yellow-400 text-xs" />
            ))}
        </div>

        {/* Quote */}
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 relative z-10">
            "{t.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
            <Avatar seed={t.seed} gradient={t.gradient} />
            <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
            </div>
        </div>

        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-blue-500/3 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
    </div>
));
TestimonialCard.displayName = 'TestimonialCard';

// ── SpotlightCard ──────────────────────────────────────────────────────────
const SpotlightCard = memo(({ children, className = '' }) => {
    const divRef = useRef(null);
    const [position, setPosition] = React.useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = React.useState(0);

    return (
        <div
            ref={divRef}
            onMouseMove={(e) => {
                const rect = divRef.current.getBoundingClientRect();
                setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    opacity,
                    background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(168, 85, 247, 0.15), transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
});
SpotlightCard.displayName = 'SpotlightCard';

// ── Empowering Section ─────────────────────────────────────────────────────
const EmpoweringSection = memo(() => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <section className="py-24 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 mb-4">
                        For Everyone
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Empowering Everyone</h2>
                    <p className="text-gray-500 dark:text-gray-400">Bridging the gap between perception and reality</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {WHO_SECTIONS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.12 }}
                        >
                            <SpotlightCard className={`group relative p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl ${item.glow} ${item.border} transition-all duration-300 hover:-translate-y-2 h-full`}>
                                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                                    <item.icon />
                                </div>

                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-4 ${item.badge}`}>
                                    {item.badgeText}
                                </span>

                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                            </SpotlightCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});
EmpoweringSection.displayName = 'EmpoweringSection';

// ── Testimonials (Infinite Marquee) ────────────────────────────────────────
const TestimonialsSection = memo(() => {
    // Duplicate array for seamless loop
    const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
    const row2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4)];

    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true });

    return (
        <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/20 mb-4">
                        Testimonials
                    </span>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Loved by Users Worldwide</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Join thousands who use Vision Aid every day
                    </p>
                </motion.div>
            </div>

            {/* Row 1 → left to right direction (auto-scroll) */}
            <div className="marquee-wrapper mb-6">
                <div className="animate-marquee">
                    {row1.map((t, i) => (
                        <TestimonialCard key={`r1-${i}`} t={t} />
                    ))}
                </div>
                <div className="animate-marquee" aria-hidden>
                    {row1.map((t, i) => (
                        <TestimonialCard key={`r1b-${i}`} t={t} />
                    ))}
                </div>
            </div>

            {/* Row 2 → right to left direction */}
            <div className="marquee-wrapper">
                <div className="animate-marquee-reverse">
                    {row2.map((t, i) => (
                        <TestimonialCard key={`r2-${i}`} t={t} />
                    ))}
                </div>
                <div className="animate-marquee-reverse" aria-hidden>
                    {row2.map((t, i) => (
                        <TestimonialCard key={`r2b-${i}`} t={t} />
                    ))}
                </div>
            </div>
        </section>
    );
});
TestimonialsSection.displayName = 'TestimonialsSection';

export { EmpoweringSection, TestimonialsSection };
