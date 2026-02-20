import React, { memo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPalette, FaCode, FaHeart } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';

// SpotlightCard (local, self-contained)
const SpotlightCard = memo(({ children, className = '' }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

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

const WHO_SECTIONS = [
    {
        title: 'For Designers',
        icon: FaPalette,
        desc: 'Visualize your work through different eyes. Ensure your designs are accessible to everyone before deployment.',
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
    },
    {
        title: 'For Developers',
        icon: FaCode,
        desc: 'Integrate accessibility checks into your workflow. Build compliant applications with confidence.',
        color: 'text-blue-500',
        bg: 'bg-blue-500/10',
    },
    {
        title: 'For Daily Users',
        icon: FaHeart,
        desc: 'Navigate the world independently. Identify colors, traffic signals, and more with real-time AI assistance.',
        color: 'text-pink-500',
        bg: 'bg-pink-500/10',
    },
];

const TESTIMONIALS = [
    {
        name: 'Sarah Chen',
        role: 'UX Designer',
        avatar: 'SC',
        rating: 5,
        text: "Vision Aid has transformed how I approach accessibility in my designs. The color blindness simulator is invaluable for ensuring my work is inclusive.",
        color: 'from-purple-500 to-pink-500',
    },
    {
        name: 'Michael Rodriguez',
        role: 'Web Developer',
        avatar: 'MR',
        rating: 5,
        text: "The palette checker saved me hours of manual WCAG testing. It's now an essential part of my development workflow. Highly recommended!",
        color: 'from-blue-500 to-cyan-500',
    },
    {
        name: 'Emma Thompson',
        role: 'Product Manager',
        avatar: 'ET',
        rating: 5,
        text: "Finally, a tool that makes color accessibility simple and intuitive. Our entire team uses it daily to ensure our products are accessible to everyone.",
        color: 'from-green-500 to-emerald-500',
    },
];

// Who is it for?
const EmpoweringSection = memo(() => (
    <section className="py-24 bg-gray-50 dark:bg-[#0A0A0A] border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Empowering Everyone</h2>
                <p className="text-gray-500 dark:text-gray-400">Bridging the gap between perception and reality</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {WHO_SECTIONS.map((item, i) => (
                    <SpotlightCard key={i} className="group relative p-8 rounded-3xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                        <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                    </SpotlightCard>
                ))}
            </div>
        </div>
    </section>
));

EmpoweringSection.displayName = 'EmpoweringSection';

// Testimonials
const TestimonialsSection = memo(() => (
    <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Loved by Users Worldwide</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">See what people are saying about Vision Aid</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {TESTIMONIALS.map((testimonial, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="group"
                    >
                        <div className="relative p-8 rounded-3xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                            <div className="absolute top-6 right-6 text-6xl text-gray-200 dark:text-gray-800 opacity-50">"</div>

                            <div className="flex gap-1 mb-4 relative z-10">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <motion.div
                                        key={j}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 + j * 0.05 }}
                                    >
                                        <FaStar className="text-yellow-400 text-sm" />
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 flex-grow relative z-10">
                                {testimonial.text}
                            </p>

                            <div className="flex items-center gap-4 relative z-10">
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
));

TestimonialsSection.displayName = 'TestimonialsSection';

export { EmpoweringSection, TestimonialsSection };
