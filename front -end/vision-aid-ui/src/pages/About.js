import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: 'easeOut', delay },
});

const About = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white">

            {/* ── Page Header ───────────────────────────────────────────── */}
            <section className="pt-28 pb-16 px-4 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#0a0a0a]">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div {...fadeUp(0)}>
                        <span className="inline-block px-4 py-1.5 mb-5 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20">
                            About VisionAid
                        </span>
                    </motion.div>
                    <motion.h1 {...fadeUp(0.1)} className="text-4xl sm:text-5xl font-black mb-5 leading-tight">
                        Making the World More{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Accessible
                        </span>
                    </motion.h1>
                    <motion.p {...fadeUp(0.2)} className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        VisionAid is a free, browser-based accessibility toolkit that helps people with colour blindness and visual impairments navigate both the digital and physical world — using real-time AI and colour science.
                    </motion.p>
                </div>
            </section>

            {/* ── What is VisionAid ─────────────────────────────────────── */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div {...fadeUp(0)}>
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-5">What is VisionAid?</h2>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                VisionAid is an open-source colour accessibility platform built for the <strong className="text-gray-900 dark:text-white">300+ million people worldwide</strong> who live with colour blindness or colour vision deficiency. It provides a complete suite of tools — from live camera-based colour detection to WCAG compliance checking — all running entirely in your browser with no data sent to any server.
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                The project started as a university accessibility initiative and has grown into a full-featured platform used by designers, developers, and everyday users who need reliable colour assistance in their lives.
                            </p>
                        </motion.div>

                        {/* Stats panel */}
                        <motion.div {...fadeUp(0.15)} className="grid grid-cols-2 gap-4">
                            {[
                                { value: '300M+', label: 'People with colour blindness worldwide', color: 'border-blue-200 dark:border-blue-500/20 bg-blue-50 dark:bg-blue-500/5' },
                                { value: '1 in 12', label: 'Men affected by colour vision deficiency', color: 'border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-500/5' },
                                { value: '0.1s', label: 'Real-time AI colour detection speed', color: 'border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/5' },
                                { value: '9', label: 'Colour blindness simulation modes', color: 'border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5' },
                            ].map((stat, i) => (
                                <div key={i} className={`p-5 rounded-2xl border ${stat.color} text-center`}>
                                    <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-snug">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Features / Tools ──────────────────────────────────────── */}
            <section className="py-20 px-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp(0)} className="text-center mb-12">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">What VisionAid Includes</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                            A complete set of tools for colour accessibility — all free, all private, all in your browser.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                emoji: '🎨',
                                title: 'Live Colour Detector',
                                desc: 'Point your camera at anything and get the colour name, hex code, and RGB values spoken aloud in real time.',
                                link: '/color-picker',
                                linkLabel: 'Try Detector',
                            },
                            {
                                emoji: '🚦',
                                title: 'Traffic Signal AI',
                                desc: 'YOLOv8-powered detection that identifies red, yellow, and green traffic signals — plus left, right, and straight arrows — with voice and haptic feedback.',
                                link: '/traffic-signal',
                                linkLabel: 'Try Traffic AI',
                            },
                            {
                                emoji: '👁️',
                                title: 'Colour Blindness Simulator',
                                desc: 'Preview any image through 9 vision modes: Deuteranopia, Protanopia, Tritanopia, Achromatopsia, and more.',
                                link: '/simulator',
                                linkLabel: 'Try Simulator',
                            },
                            {
                                emoji: '✅',
                                title: 'Palette Contrast Checker',
                                desc: 'Check foreground/background colour combinations against WCAG 2.1 AA and AAA contrast ratio standards instantly.',
                                link: '/checker',
                                linkLabel: 'Try Checker',
                            },
                            {
                                emoji: '🖼️',
                                title: 'Image Palette Extractor',
                                desc: 'Upload any image and extract its dominant colour palette — perfect for designers checking accessibility of photography.',
                                link: '/palette-extractor',
                                linkLabel: 'Try Extractor',
                            },
                            {
                                emoji: '📋',
                                title: 'Colour History',
                                desc: 'Every colour you detect is automatically saved to your personal history, searchable and filterable for future reference.',
                                link: '/color-history',
                                linkLabel: 'View History',
                            },
                        ].map((tool, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.07)}
                                className="group p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="text-3xl mb-4">{tool.emoji}</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tool.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">{tool.desc}</p>
                                <Link
                                    to={tool.link}
                                    className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                >
                                    {tool.linkLabel} →
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mission ───────────────────────────────────────────────── */}
            <section className="py-20 px-4 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div {...fadeUp(0)}>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-5">Our Mission</h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg mb-6">
                            We believe that technology should work equally well for everyone, regardless of how they perceive colour. VisionAid is dedicated to building practical, privacy-respecting tools that make everyday life more navigable for people with colour blindness and other visual impairments.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Everything VisionAid does runs entirely in your browser. Your camera feed, uploaded images, and colour data never leave your device. No accounts, no tracking, no subscriptions — just tools that work.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── Team ──────────────────────────────────────────────────── */}
            <section className="py-20 px-4 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp(0)} className="text-center mb-12">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Meet the Team</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            VisionAid is built and maintained by a small team passionate about accessibility and inclusive design.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Rahul Sharma',
                                role: 'Lead Engineer & Founder',
                                emoji: '👨‍💻',
                                gradient: 'from-blue-500 to-cyan-500',
                                bio: 'Full-stack developer focused on real-time AI, computer vision, and accessible web applications.',
                            },
                            {
                                name: 'Priya Nair',
                                role: 'UI/UX Designer',
                                emoji: '👩‍🎨',
                                gradient: 'from-purple-500 to-pink-500',
                                bio: 'Designing interfaces that are beautiful, intuitive, and genuinely usable for people of all abilities.',
                            },
                            {
                                name: 'Arjun Mehta',
                                role: 'Accessibility Researcher',
                                emoji: '🧑‍🔬',
                                gradient: 'from-emerald-500 to-teal-500',
                                bio: 'Researching colour vision science and WCAG standards to ensure VisionAid meets the highest bar.',
                            },
                        ].map((member, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="p-7 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300"
                            >
                                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-3xl mb-5 shadow-lg`}>
                                    {member.emoji}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                                <p className={`text-sm font-semibold mb-3 bg-clip-text text-transparent bg-gradient-to-r ${member.gradient}`}>
                                    {member.role}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Standards ─────────────────────────────────────────────── */}
            <section className="py-20 px-4 border-t border-gray-100 dark:border-white/5">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp(0)} className="text-center mb-12">
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Accessibility Standards</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            VisionAid is designed and tested to meet international accessibility guidelines.
                        </p>
                    </motion.div>
                    <div className="grid sm:grid-cols-3 gap-5">
                        {[
                            { emoji: '🌐', title: 'WCAG 2.1 AAA', desc: 'All contrast checking tools are validated against the highest level of the Web Content Accessibility Guidelines.' },
                            { emoji: '♿', title: 'Section 508', desc: 'Built to meet US federal legislation requirements for accessible electronic and information technology.' },
                            { emoji: '🤝', title: 'Inclusive Design', desc: 'Every feature is designed from the ground up to be usable by people regardless of ability, device, or environment.' },
                        ].map((s, i) => (
                            <motion.div key={i} {...fadeUp(i * 0.1)}
                                className="flex gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-white/5"
                            >
                                <div className="text-3xl flex-shrink-0">{s.emoji}</div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


        </div>
    );
};

export default About;
