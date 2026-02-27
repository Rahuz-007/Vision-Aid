import React, { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaDiscord, FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const CONTACT_TOPICS = [
    'Bug Report',
    'Feature Request',
    'Accessibility Feedback',
    'Partnership / Press',
    'Developer / API',
    'General Inquiry',
];

const CONTACT_CHANNELS = [
    { icon: FaEnvelope, label: 'Email', value: 'visionaid07@gmail.com', href: 'mailto:visionaid07@gmail.com', color: '#3b82f6' },
    { icon: FaGithub, label: 'GitHub', value: 'github.com/Rahuz-007', href: 'https://github.com/Rahuz-007/Vision-Aid', color: '#8b5cf6' },
    { icon: FaDiscord, label: 'Discord', value: 'Join our server', href: '#', color: '#ec4899' },
];

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.55, ease: 'easeOut', delay },
});

const Contact = memo(() => {
    const [form, setForm] = useState({ name: '', email: '', subject: CONTACT_TOPICS[0], message: '' });
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Something went wrong.');
            setStatus('success');
            setForm({ name: '', email: '', subject: CONTACT_TOPICS[0], message: '' });
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div {...fadeUp(0)} className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-5">
                        <FaEnvelope className="text-[10px]" /> Get in Touch
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black mb-5">
                        We'd Love to{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Hear from You
                        </span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Whether you have a question about features, want to report a bug, or just want to say hi — we are ready to answer all your questions.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Left: Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div {...fadeUp(0.1)}>
                            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                            <div className="space-y-4">
                                {CONTACT_CHANNELS.map((channel, i) => (
                                    <a key={i} href={channel.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-[#111] border border-gray-200 dark:border-white/5 hover:border-blue-500/30 transition-colors group">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform" style={{ background: channel.color }}>
                                            <channel.icon className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{channel.label}</p>
                                            <p className="font-bold text-gray-900 dark:text-white">{channel.value}</p>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div {...fadeUp(0.2)} className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                            <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-2">Response Time</h3>
                            <p className="text-blue-600 dark:text-blue-400 text-sm leading-relaxed">
                                We aim to respond to all inquiries within 24-48 hours. For immediate assistance, joining our Discord community is the fastest way to get help.
                            </p>
                        </motion.div>
                    </div>

                    {/* Right: Form */}
                    <motion.div {...fadeUp(0.3)} className="lg:col-span-3">
                        <div className="bg-white dark:bg-[#111] p-8 rounded-[2rem] border border-gray-200 dark:border-white/5 shadow-xl">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

                            {status === 'success' ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FaCheckCircle className="text-4xl" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Message Sent!</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Thank you for reaching out. We will get back to you shortly.</p>
                                    <button onClick={() => setStatus('idle')} className="mt-8 text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
                                            <input type="text" name="name" required value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" placeholder="John Doe" disabled={status === 'loading'} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email Address *</label>
                                            <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white outline-none transition-all placeholder-gray-400 dark:placeholder-gray-600" placeholder="john@example.com" disabled={status === 'loading'} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Subject Topic *</label>
                                        <select name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white outline-none transition-all" disabled={status === 'loading'}>
                                            {CONTACT_TOPICS.map(topic => <option key={topic} value={topic}>{topic}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                                        <textarea name="message" required rows="5" value={form.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white outline-none transition-all resize-none placeholder-gray-400 dark:placeholder-gray-600" placeholder="How can we help you?" disabled={status === 'loading'} />
                                    </div>

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium">
                                            <FaExclamationTriangle /> {errorMsg}
                                        </div>
                                    )}

                                    <button type="submit" disabled={status === 'loading'} className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all disabled:opacity-70 transform hover:-translate-y-0.5 mt-2">
                                        {status === 'loading' ? 'Sending...' : (
                                            <>Send Message <FaPaperPlane className="text-sm" /></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
});

Contact.displayName = 'Contact';
export default Contact;
