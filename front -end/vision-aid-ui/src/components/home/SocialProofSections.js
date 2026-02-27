import React, { memo, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaPalette, FaCode, FaHeart, FaStar, FaQuoteLeft, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

// ── Avatar helper ──────────────────────────────────────────────────────────
const Avatar = ({ seed, gradient }) => (
    <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
        alt={seed}
        className={`w-12 h-12 rounded-full object-cover ring-2 ring-white/10`}
        onError={(e) => { e.target.style.display = 'none'; }}
    />
);

// ── Who is it for ──────────────────────────────────────────────────────────
const WHO_SECTIONS = [
    {
        title: 'For Designers',
        icon: FaPalette,
        to: '/simulator',
        desc: 'Visualise your work through the eyes of colour-blind users before shipping. Ensure WCAG compliance on every screen.',
        bulletColor: '#7c3aed',
        from: '#7c3aed',
        to2: '#4f46e5',
        badgeText: 'WCAG AAA',
        bullets: ['Colour Blindness Simulator', 'Contrast Checker', 'Palette Extractor'],
    },
    {
        title: 'For Developers',
        icon: FaCode,
        to: '/palette-checker',
        desc: 'Integrate accessibility checks into your workflow. Build compliant UIs with instant real-time feedback.',
        bulletColor: '#2563eb',
        from: '#2563eb',
        to2: '#0891b2',
        badgeText: 'Dev-Friendly',
        bullets: ['Palette Checker API', 'Contrast Ratio Tool', 'Text Accessibility'],
    },
    {
        title: 'For Daily Users',
        icon: FaHeart,
        to: '/color-picker',
        desc: 'Navigate the world independently with real-time AI that names colours, reads traffic signals, and speaks results aloud.',
        bulletColor: '#db2777',
        from: '#db2777',
        to2: '#9f1239',
        badgeText: 'Voice Guided',
        bullets: ['Live Colour Detector', 'Traffic Signal AI', 'Voice Announcements'],
    },
];

// ── Testimonials ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        role: 'UX Designer @ Figma',
        seed: 'sarah-chen',
        rating: 5,
        text: 'Vision Aid transformed how I approach accessibility. The colour blindness simulator is invaluable for ensuring my work is truly inclusive.',
        accent: '#7c3aed',
    },
    {
        name: 'Michael Rodriguez',
        role: 'Frontend Dev @ Stripe',
        seed: 'michael-rodriguez',
        rating: 5,
        text: 'The palette checker saved me hours of manual WCAG testing. It\'s now an essential part of my development workflow.',
        accent: '#2563eb',
    },
    {
        name: 'Emma Thompson',
        role: 'Product Manager @ Linear',
        seed: 'emma-thompson',
        rating: 5,
        text: 'Finally, a tool that makes colour accessibility simple and intuitive. Our entire team uses it daily.',
        accent: '#059669',
    },
    {
        name: 'James Park',
        role: 'Accessibility Lead @ Google',
        seed: 'james-park',
        rating: 5,
        text: 'As someone with deuteranopia, this platform genuinely changed my life. I can now confidently identify colours independently.',
        accent: '#d97706',
    },
    {
        name: 'Priya Sharma',
        role: 'Brand Designer @ Notion',
        seed: 'priya-sharma',
        rating: 5,
        text: 'The image palette extractor and contrast checker together make the perfect design toolkit. Saves me time on every project.',
        accent: '#7c3aed',
    },
    {
        name: 'Lucas Müller',
        role: 'CTO @ Accessibility.io',
        seed: 'lucas-muller',
        rating: 5,
        text: "Vision Aid's YOLO-powered traffic signal detection is genuinely impressive. We've integrated it into assistive tech apps.",
        accent: '#db2777',
    },
    {
        name: 'Aisha Johnson',
        role: 'UI Designer @ Airbnb',
        seed: 'aisha-johnson',
        rating: 5,
        text: 'The colour psychology page alone is worth it. I\'ve learned so much about how different users perceive colour.',
        accent: '#0891b2',
    },
    {
        name: 'Carlos Vega',
        role: 'Developer @ Shopify',
        seed: 'carlos-vega',
        rating: 5,
        text: 'Ctrl+K to open the palette, run a contrast check, and navigate anywhere. This app understands developer workflows perfectly.',
        accent: '#4f46e5',
    },
];

// ── Testimonial card ───────────────────────────────────────────────────────
const TestimonialCard = memo(({ t }) => (
    <div
        className="flex-shrink-0 w-80 p-6 rounded-3xl border border-white/5 hover:border-white/15 shadow-xl transition-all duration-300 relative group"
        style={{ minWidth: '320px', background: 'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))' }}
    >
        {/* Quote icon */}
        <FaQuoteLeft className="absolute top-5 right-5 text-3xl" style={{ color: t.accent + '30' }} />

        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
            {[...Array(t.rating)].map((_, j) => (
                <FaStar key={j} className="text-yellow-400 text-xs" />
            ))}
        </div>

        {/* Quote */}
        <p className="text-gray-300 text-sm leading-relaxed mb-5 relative z-10">
            "{t.text}"
        </p>

        {/* Accent line */}
        <div className="h-px mb-4 opacity-30 rounded-full"
            style={{ background: `linear-gradient(90deg, ${t.accent}, transparent)` }} />

        {/* Author */}
        <div className="flex items-center gap-3">
            <Avatar seed={t.seed} />
            <div>
                <p className="font-bold text-white text-sm">{t.name}</p>
                <p className="text-xs text-gray-400">{t.role}</p>
            </div>
        </div>

        {/* Bottom glow on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
            style={{ boxShadow: `inset 0 -20px 40px ${t.accent}15` }} />
    </div>
));
TestimonialCard.displayName = 'TestimonialCard';

// ── Empowering Section ─────────────────────────────────────────────────────
const EmpoweringSection = memo(() => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });

    return (
        <section className="py-28 border-t border-white/5"
            style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #050505 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
                        style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderColor: 'rgba(59,130,246,0.25)' }}>
                        Built for Everyone
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        Who Uses Vision Aid?
                    </h2>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Whether you build interfaces, manage brands, or simply navigate the world — Vision Aid adapts to you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {WHO_SECTIONS.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.15 }}
                            className="group"
                        >
                            <Link to={item.to} className="block h-full">
                                <div className="h-full rounded-3xl p-8 border border-white/5 hover:border-white/15 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                                    style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))' }}>

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                        style={{ boxShadow: `inset 0 0 60px ${item.from}20` }} />

                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300"
                                        style={{ background: `linear-gradient(135deg, ${item.from}, ${item.to2})` }}>
                                        <item.icon />
                                    </div>

                                    {/* Badge */}
                                    <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full mb-4 uppercase tracking-widest"
                                        style={{ background: item.from + '20', color: item.from, border: `1px solid ${item.from}35` }}>
                                        {item.badgeText}
                                    </span>

                                    <h3 className="text-2xl font-black text-white mb-3">{item.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm mb-6">{item.desc}</p>

                                    {/* Bullet features */}
                                    <ul className="space-y-2 mb-6">
                                        {item.bullets.map(b => (
                                            <li key={b} className="flex items-center gap-2.5 text-xs text-gray-300 font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.bulletColor }} />
                                                {b}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    <div className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-1.5 transition-transform duration-300"
                                        style={{ color: item.from }}>
                                        Explore Tools <FaArrowRight className="text-xs" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
});
EmpoweringSection.displayName = 'EmpoweringSection';

// ── Testimonials (Infinite Marquee) ───────────────────────────────────────
const TestimonialsSection = memo(() => {
    const row1 = [...TESTIMONIALS, ...TESTIMONIALS];
    const row2 = [...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4), ...TESTIMONIALS.slice(4), ...TESTIMONIALS.slice(0, 4)];
    const headerRef = useRef(null);
    const headerInView = useInView(headerRef, { once: true });

    return (
        <section className="py-24 border-t border-white/5 overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #050505 0%, #0a0f1e 100%)' }}>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 20 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-5 border"
                        style={{ background: 'rgba(245,158,11,0.1)', color: '#fbbf24', borderColor: 'rgba(245,158,11,0.25)' }}>
                        Testimonials
                    </span>
                    <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        Loved by Users{' '}
                        <span className="bg-clip-text text-transparent"
                            style={{ backgroundImage: 'linear-gradient(135deg, #fbbf24, #f59e0b)' }}>
                            Worldwide
                        </span>
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Thousands of designers, developers, and everyday users trust Vision Aid.
                    </p>
                </motion.div>
            </div>

            {/* Row 1 — left */}
            <div className="marquee-wrapper mb-4">
                <div className="animate-marquee">
                    {row1.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
                </div>
                <div className="animate-marquee" aria-hidden>
                    {row1.map((t, i) => <TestimonialCard key={`r1b-${i}`} t={t} />)}
                </div>
            </div>

            {/* Row 2 — right */}
            <div className="marquee-wrapper">
                <div className="animate-marquee-reverse">
                    {row2.map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
                </div>
                <div className="animate-marquee-reverse" aria-hidden>
                    {row2.map((t, i) => <TestimonialCard key={`r2b-${i}`} t={t} />)}
                </div>
            </div>
        </section>
    );
});
TestimonialsSection.displayName = 'TestimonialsSection';

export { EmpoweringSection, TestimonialsSection };
