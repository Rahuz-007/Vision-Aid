/**
 * Home.js — Orchestrator
 *
 * Sections (in order):
 *  1. HeroSection           → Hero + CTA + Badges
 *  2. HowItWorksSection     → 3-step explainer
 *  3. FeaturesSection       → Feature cards
 *  4. StatsSection          → 3 impact statistics
 *  5. EmpoweringSection     → For Designers / Devs / Daily Users
 *  6. TestimonialsSection   → User reviews
 */

import React from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StatsSection from '../components/home/StatsSection';
import { EmpoweringSection, TestimonialsSection } from '../components/home/SocialProofSections';


const Home = () => (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#050505] text-gray-900 dark:text-white transition-colors duration-300 selection:bg-purple-500/30">
        <HeroSection />
        <HowItWorksSection />
        <FeaturesSection />
        <StatsSection />
        <EmpoweringSection />
        <TestimonialsSection />

    </div>
);

export default Home;
