import React, { useState } from 'react';
import {
  ShieldCheck,
  Shield,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  PawPrint,
  Heart,
  Laptop,
  Check,
  Globe,
  Moon,
  Sun,
  Star,
  Users,
  Building2,
  Calendar,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { PetifyLogo } from './PetifyLogo';
import shelterSectionImage from '../assets/images/regenerated_image_1791317306662.jpg';
import adopterSectionImage from '../assets/images/regenerated_image_1791342203890.jpg';
import heroImage from '../assets/images/regenerated_image_1791342520830.jpg';
import whyChooseCard1Image from '../assets/images/regenerated_image_1791342522071.jpg';
import whyChooseCard2Image from '../assets/images/regenerated_image_1791342523545.jpg';
import whyChooseCard3Image from '../assets/images/regenerated_image_1791342526307.jpg';
import ecosystemCard1Image from '../assets/images/regenerated_image_1791342535734.jpg';
import petifyBrandLogo from '../assets/images/regenerated_image_1791344475697.png';
import ecosystemCard2Image from '../assets/images/regenerated_image_1791342538601.jpg';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('EN');

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fffdfa] text-[#121c2a] font-sans selection:bg-[#ffdbd0] selection:text-[#9c3e1f]">
      {/* ================= 1. TOP NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#e8e2da]/70 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-2xl bg-white border border-[#e8e2da] shadow-xs p-1.5 flex items-center justify-center shrink-0">
              <img src={petifyBrandLogo} alt="Petify Emblem" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black text-[#121c2a] tracking-tight">Petify</span>
              </div>
              <p className="text-[11px] font-medium text-[#735d54] tracking-tight leading-none mt-0.5 hidden sm:block">
                Better Homes. Happier Tails.
              </p>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#56423c]">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-[#0d5c52] font-bold transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[#0d5c52] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('for-adopters')}
              className="hover:text-[#0d5c52] transition-colors cursor-pointer"
            >
              For Adopters
            </button>
            <button
              onClick={() => scrollToSection('for-shelters')}
              className="hover:text-[#0d5c52] transition-colors cursor-pointer"
            >
              For Shelters
            </button>
            <button
              onClick={() => scrollToSection('ecosystem')}
              className="hover:text-[#0d5c52] transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-200/80 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs">
                  {['EN', 'ES', 'FR', 'HI'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        setLangMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 font-medium"
                    >
                      {lang === 'EN' ? 'English (EN)' : lang === 'ES' ? 'Español (ES)' : lang === 'FR' ? 'Français (FR)' : 'हिन्दी (HI)'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode subtle icon */}
            <button
              className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:flex items-center justify-center"
              aria-label="Toggle visual tone"
              title="Toggle theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* Sign In Button -> navigates to Login */}
            <button
              onClick={onOpenLogin}
              id="landing-signin-btn"
              className="text-xs sm:text-sm font-bold text-slate-800 hover:text-[#0d5c52] px-3 py-2 transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Get Started Button -> navigates to Register */}
            <button
              onClick={onOpenRegister}
              id="landing-getstarted-btn"
              className="bg-[#00433b] hover:bg-[#083832] active:scale-[0.98] text-white text-xs sm:text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO SECTION ================= */}
      <section id="hero" className="relative overflow-hidden pt-10 sm:pt-16 pb-16 sm:pb-24">
        {/* Soft background ambient gradient blooms */}
        <div className="absolute top-12 left-[-100px] w-96 h-96 rounded-full bg-[#f9e0d9]/30 blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 right-[-100px] w-[26rem] h-[26rem] rounded-full bg-[#b9eed1]/25 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column (Content) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#121c2a] tracking-tight leading-[1.12]">
                Find a Loving Home for{' '}
                <span className="text-[#00433b] relative inline-block underline decoration-[#2dd4bf] decoration-4 underline-offset-8">
                  Every Pet.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#56423c] max-w-xl leading-relaxed">
                Petify connects loving adopters with verified shelters and rescue organizations,
                making pet adoption simple, safe, and transparent.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {/* Primary: Login Button */}
                <button
                  onClick={onOpenLogin}
                  id="hero-login-btn"
                  className="bg-[#00433b] hover:bg-[#07362f] active:scale-[0.98] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-md shadow-[#00433b]/20 flex items-center gap-2 cursor-pointer"
                >
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary: Explore More Button */}
                <button
                  onClick={() => scrollToSection('ecosystem')}
                  id="hero-explore-btn"
                  className="bg-white hover:bg-slate-50 active:scale-[0.98] text-[#121c2a] font-bold text-sm sm:text-base px-6 py-3.5 rounded-full border border-slate-300/80 transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore more</span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-4 text-xs font-semibold text-[#56423c]">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00433b]" />
                  <span>Verified Shelters</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#00433b]" />
                  <span>Safe Adoption</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-[#00433b]" />
                  <span>Easy Applications</span>
                </div>
              </div>
            </div>

            {/* Right Column (Hero Photo Card) */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative border backdrop glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#0d5c52]/10 to-[#fd651e]/10 rounded-[36px] blur-xl transform scale-102"></div>
                
                {/* Main Hero Photo Container with Dog and Cat together */}
                <div className="relative rounded-[32px] overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200/90 bg-white">
                  <img
                    src={heroImage}
                    alt="Happy golden dog and cat together in living room"
                    className="w-full h-[380px] sm:h-[450px] object-cover object-center transform hover:scale-[1.02] transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. WHAT IS PETIFY? (ECOSYSTEM OVERVIEW) ================= */}
      <section id="ecosystem" className="py-16 sm:py-24 bg-[#f8fafc]/80 border-t border-b border-[#e8e2da]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold text-[#00433b] tracking-[0.2em] uppercase">
            Ecosystem Overview
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a] tracking-tight">
            What is Petify?
          </h2>
          <p className="text-sm sm:text-base text-[#56423c] max-w-2xl mx-auto leading-relaxed">
            Petify is a digital pet adoption platform that brings adopters, shelters, and rescue organizations together in one trusted place.
          </p>

          {/* 2 Big Persona Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 max-w-5xl mx-auto">
            {/* Card 1: ADOPTERS */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 text-left flex flex-col group">
              <div className="h-60 sm:h-64 overflow-hidden relative">
                <img
                  src={ecosystemCard1Image}
                  alt="Loving family adopting a pet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#121c2a] tracking-wider uppercase">
                    Adopters
                  </h3>
                  <p className="text-sm text-[#56423c] leading-relaxed mt-2">
                    Find pets, apply for adoption, and track your application status in transparent, real-time dashboards.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={onOpenLogin}
                    className="text-xs font-bold text-[#00433b] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Explore seeker dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: SHELTERS & RESCUES */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200/80 text-left flex flex-col group">
              <div className="h-60 sm:h-64 overflow-hidden relative">
                <img
                  src={ecosystemCard2Image}
                  alt="Shelter staff with rescued pets"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-7 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#121c2a] tracking-wider uppercase">
                    Shelters &amp; Rescues
                  </h3>
                  <p className="text-sm text-[#56423c] leading-relaxed mt-2">
                    List rescued animals, manage inbound requests, and connect directly with vetted pet guardians.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={onOpenRegister}
                    className="text-xs font-bold text-[#00433b] hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Register partner shelter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. WHY CHOOSE US ================= */}
      <section className="py-16 sm:py-24 bg-[#fffdfa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold text-[#00433b] tracking-[0.2em] uppercase">
            Why Choose Us
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a] tracking-tight">
            Why Use Petify?
          </h2>
          <p className="text-sm sm:text-base text-[#56423c] max-w-2xl mx-auto leading-relaxed">
            One simple platform to make pet adoption easier, safer and more transparent.
          </p>

          {/* 3 Pillar Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-w-6xl mx-auto">
            {/* Pillar 1 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all text-left flex flex-col group">
              <div className="h-52 overflow-hidden relative">
                <img
                  src={whyChooseCard1Image}
                  alt="Puppy and kitten"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#00433b] flex items-center justify-center -mt-11 mb-4 shadow-sm border border-teal-100">
                  <PawPrint className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-base font-bold text-[#121c2a]">Find the Right Pet</h3>
                <p className="text-xs sm:text-sm text-[#56423c] leading-relaxed mt-2">
                  Filter through profiles with full medical and rescue organizations.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all text-left flex flex-col group">
              <div className="h-52 overflow-hidden relative">
                <img
                  src={whyChooseCard2Image}
                  alt="Laptop online application"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center -mt-11 mb-4 shadow-sm border border-blue-100">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-base font-bold text-[#121c2a]">Easy &amp; Transparent</h3>
                <p className="text-xs sm:text-sm text-[#56423c] leading-relaxed mt-2">
                  Apply online easily and track your adoption journey in one place.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all text-left flex flex-col group">
              <div className="h-52 overflow-hidden relative">
                <img
                  src={whyChooseCard3Image}
                  alt="Visiting rescue pet"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 relative">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#ea580c] flex items-center justify-center -mt-11 mb-4 shadow-sm border border-orange-100">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <h3 className="text-base font-bold text-[#121c2a]">Trusted Connection</h3>
                <p className="text-xs sm:text-sm text-[#56423c] leading-relaxed mt-2">
                  Connect directly with shelters and find the right home for every pet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. SIMPLE MILESTONES (HOW DOES IT WORK) ================= */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-[#f8fafc]/80 border-t border-b border-[#e8e2da]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold text-[#00433b] tracking-[0.2em] uppercase">
            Simple Milestones
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a] tracking-tight">
            How Does Petify Work?
          </h2>
          <p className="text-sm sm:text-base text-[#56423c] max-w-2xl mx-auto leading-relaxed">
            From first browse to welcoming them into your home.
          </p>

          {/* 4 Process Nodes */}
          <div className="relative pt-12 max-w-5xl mx-auto">
            {/* Connecting dashed line behind nodes */}
            <div className="hidden md:block absolute top-[72px] left-12 right-12 h-0.5 border-t-2 border-dashed border-slate-300 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {/* Step 01 */}
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#00433b] text-white flex items-center justify-center font-black text-lg shadow-md ring-4 ring-white">
                  01
                </div>
                <p className="text-[11px] font-bold text-[#00433b] uppercase tracking-wider">
                  Discover
                </p>
                <h3 className="text-base font-bold text-[#121c2a]">
                  Browse Available Pets
                </h3>
                <p className="text-xs text-[#56423c] leading-relaxed max-w-[210px]">
                  Filter through profiles with full medical history and temperament notes.
                </p>
              </div>

              {/* Step 02 */}
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#0d5c52] text-white flex items-center justify-center font-black text-lg shadow-md ring-4 ring-white">
                  02
                </div>
                <p className="text-[11px] font-bold text-[#0d5c52] uppercase tracking-wider">
                  Choose
                </p>
                <h3 className="text-base font-bold text-[#121c2a]">
                  Review Details
                </h3>
                <p className="text-xs text-[#56423c] leading-relaxed max-w-[210px]">
                  Examine vet health certificates, vaccination status, and bookmark favorites.
                </p>
              </div>

              {/* Step 03 */}
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#0f766e] text-white flex items-center justify-center font-black text-lg shadow-md ring-4 ring-white">
                  03
                </div>
                <p className="text-[11px] font-bold text-[#0f766e] uppercase tracking-wider">
                  Apply
                </p>
                <h3 className="text-base font-bold text-[#121c2a]">
                  Submit Application
                </h3>
                <p className="text-xs text-[#56423c] leading-relaxed max-w-[210px]">
                  Fill your lifestyle profile once and apply to trusted shelters in seconds.
                </p>
              </div>

              {/* Step 04 */}
              <div className="text-center space-y-3 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-[#ea580c] text-white flex items-center justify-center font-black text-lg shadow-md ring-4 ring-white">
                  04
                </div>
                <p className="text-[11px] font-bold text-[#ea580c] uppercase tracking-wider">
                  Adopt
                </p>
                <h3 className="text-base font-bold text-[#121c2a]">
                  Complete Adoption
                </h3>
                <p className="text-xs text-[#56423c] leading-relaxed max-w-[210px]">
                  Meet the rescue team, finalize ownership records, and bring your companion home.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. FOR ADOPTERS DEEP DIVE ================= */}
      <section id="for-adopters" className="py-16 sm:py-24 bg-[#fffdfa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                <img
                  src={adopterSectionImage}
                  alt="Young woman hugging a smiling golden retriever"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="inline-block text-xs font-bold text-[#0d5c52] bg-[#e0f9f5] px-3.5 py-1.5 rounded-full border border-[#99f6e4]">
                FOR ADOPTERS
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a] tracking-tight leading-tight">
                Find the companion that&apos;s right for you.
              </h2>

              <p className="text-sm sm:text-base text-[#56423c] leading-relaxed">
                We streamline the adoption pathway so you can focus on making a bond that lasts a lifetime.
                No confusing back-and-forth emails.
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs sm:text-sm text-[#121c2a] font-semibold">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Browse and search pets</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Save favorite pets</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Apply online easily</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Track applications</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Message shelters direct</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>View adoption history</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenLogin}
                  className="bg-[#00433b] hover:bg-[#07362f] active:scale-[0.98] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Find a Pet</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 7. FOR SHELTERS & RESCUE TEAMS ================= */}
      <section id="for-shelters" className="py-16 sm:py-24 bg-[#f8fafc]/80 border-t border-b border-[#e8e2da]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <span className="inline-block text-xs font-bold text-[#0d5c52] bg-[#e0f9f5] px-3.5 py-1.5 rounded-full border border-[#99f6e4]">
                FOR SHELTERS &amp; RESCUE TEAMS
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a] tracking-tight leading-tight">
                Give every rescued pet a better chance of finding a forever home.
              </h2>

              <p className="text-sm sm:text-base text-[#56423c] leading-relaxed">
                Petify provides non-profit animal organizations with high-visibility listing syndication,
                applicant screening tools, and case management software at no operational cost.
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-xs sm:text-sm text-[#121c2a] font-semibold">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Add pet listings in minutes</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Submit for verification</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Manage incoming applications</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Communicate with adopters</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-teal-50 text-[#00433b] flex items-center justify-center shrink-0">⊙</span>
                  <span>Track completed adoptions</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenRegister}
                  className="bg-[#00433b] hover:bg-[#07362f] active:scale-[0.98] text-white font-bold text-sm px-7 py-3.5 rounded-full transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Join Petify</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Photo */}
            <div className="lg:col-span-6">
              <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                <img
                  src={shelterSectionImage}
                  alt="Shelter staff taking care of puppy outdoors"
                  className="w-full h-[400px] sm:h-[480px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 8. STATS COUNTER BAR ================= */}
      <section className="py-12 bg-[#fffdfa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
              <div className="pt-4 lg:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-[#121c2a]">250+</p>
                <p className="text-xs sm:text-sm font-semibold text-[#56423c] mt-1">Pet Lovers Joined</p>
              </div>
              <div className="pt-4 lg:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-[#121c2a]">120+</p>
                <p className="text-xs sm:text-sm font-semibold text-[#56423c] mt-1">Pets Listed</p>
              </div>
              <div className="pt-4 lg:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-[#121c2a]">78+</p>
                <p className="text-xs sm:text-sm font-semibold text-[#56423c] mt-1">Successful Adoptions</p>
              </div>
              <div className="pt-4 lg:pt-0">
                <p className="text-3xl sm:text-4xl font-black text-[#121c2a]">25+</p>
                <p className="text-xs sm:text-sm font-semibold text-[#56423c] mt-1">Shelters &amp; Rescues</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. COMMUNITY TESTIMONIALS ================= */}
      <section id="testimonials" className="py-16 sm:py-24 bg-[#f8fafc]/80 border-t border-[#e8e2da]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs font-bold text-[#00433b] tracking-[0.2em] uppercase">
            Community Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a] tracking-tight">
            Happy Tails, Happy Homes
          </h2>
          <p className="text-sm sm:text-base text-[#56423c] max-w-2xl mx-auto leading-relaxed">
            Heartwarming stories from families who found their furry companion through Petify.
          </p>

          {/* 3 Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-w-6xl mx-auto">
            {/* Review 1 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#ea580c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#3b2b25] italic leading-relaxed">
                  &ldquo;We found the perfect companion through Petify. The shelter was responsive and the application was seamless.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Aisha"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-[#121c2a]">Aisha &amp; Bruno</p>
                  <p className="text-[11px] text-[#56423c]">Adopted Golden Retriever</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#ea580c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#3b2b25] italic leading-relaxed">
                  &ldquo;Adopting Luna was the best decision we ever made. Transparent, humane, and completely hassle-free.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                  alt="Vikram"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-[#121c2a]">Vikram &amp; Luna</p>
                  <p className="text-[11px] text-[#56423c]">Adopted Indie Cat</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all text-left flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-[#ea580c]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#3b2b25] italic leading-relaxed">
                  &ldquo;Seeing Max thrive in his new home warms our hearts. Petify verified everything step by step.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80"
                  alt="Rohan"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="text-xs font-bold text-[#121c2a]">Rohan &amp; Max</p>
                  <p className="text-[11px] text-[#56423c]">Adopted Labrador</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 10. FINAL CTA BANNER ================= */}
      <section className="py-16 sm:py-24 bg-[#fffdfa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#052b25] rounded-[36px] p-8 sm:p-14 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
            {/* Subtle glow circle */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f766e]/30 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <span className="inline-block text-[11px] font-bold tracking-[0.2em] text-[#99f6e4] bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15">
                YOUR JOURNEY STARTS HERE
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                Every Pet Deserves a Forever Home.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
                Start your adoption journey today. Safe verification, zero paperwork stress, and endless joy ahead.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={onOpenLogin}
                  className="bg-[#ea580c] hover:bg-[#d94e09] active:scale-[0.98] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-lg shadow-orange-950/30 flex items-center gap-2 cursor-pointer"
                >
                  <span>Browse Available Pets</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenRegister}
                  className="bg-transparent hover:bg-white/10 active:scale-[0.98] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Join Petify</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 11. FOOTER ================= */}
      <footer className="bg-[#fffdfa] border-t border-[#e8e2da] pt-16 pb-12 text-[#56423c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand column (2 cols) */}
            <div className="lg:col-span-2 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-[#e8e2da] shadow-xs p-1.5 flex items-center justify-center shrink-0">
                  <img src={petifyBrandLogo} alt="Petify Emblem" className="w-full h-full object-contain" />
                </div>
                <span className="text-xl font-black text-[#121c2a]">Petify</span>
              </div>
              <p className="text-xs sm:text-sm text-[#56423c] leading-relaxed max-w-sm">
                Better Homes. Happier Tails. Empowering verified rescue networks and thoughtful pet guardians nationwide.
              </p>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0d5c52] pt-1">
                <CheckCircle2 className="w-4 h-4 text-[#0d5c52]" />
                <span>Certified 501(c)(3) Welfare Partner</span>
              </div>
            </div>

            {/* Explore column */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-[#121c2a] tracking-wider uppercase">Explore</h4>
              <ul className="space-y-2 text-xs text-[#56423c]">
                <li><button onClick={onOpenLogin} className="hover:text-[#00433b] transition-colors cursor-pointer">Browse Pets</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-[#00433b] transition-colors cursor-pointer">How It Works</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="hover:text-[#00433b] transition-colors cursor-pointer">Adoption Stories</button></li>
              </ul>
            </div>

            {/* For Adopters column */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-[#121c2a] tracking-wider uppercase">For Adopters</h4>
              <ul className="space-y-2 text-xs text-[#56423c]">
                <li><button onClick={onOpenLogin} className="hover:text-[#00433b] transition-colors cursor-pointer">Find a Pet</button></li>
                <li><button onClick={onOpenLogin} className="hover:text-[#00433b] transition-colors cursor-pointer">My Applications</button></li>
                <li><button onClick={onOpenLogin} className="hover:text-[#00433b] transition-colors cursor-pointer">Favorites</button></li>
              </ul>
            </div>

            {/* For Shelters column */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-[#121c2a] tracking-wider uppercase">For Shelters</h4>
              <ul className="space-y-2 text-xs text-[#56423c]">
                <li><button onClick={onOpenRegister} className="hover:text-[#00433b] transition-colors cursor-pointer">Register Shelter</button></li>
                <li><button onClick={onOpenLogin} className="hover:text-[#00433b] transition-colors cursor-pointer">List a Pet</button></li>
              </ul>
            </div>

            {/* Support column */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-bold text-[#121c2a] tracking-wider uppercase">Support</h4>
              <ul className="space-y-2 text-xs text-[#56423c]">
                <li><a href="#hero" className="hover:text-[#00433b] transition-colors">Contact</a></li>
                <li><a href="#hero" className="hover:text-[#00433b] transition-colors">Help Center</a></li>
                <li><a href="#hero" className="hover:text-[#00433b] transition-colors">Terms</a></li>
                <li><a href="#hero" className="hover:text-[#00433b] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-[#e8e2da] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#735d54]">
            <p>© 2026 Petify. All rights reserved.</p>
            <div className="flex items-center gap-1.5 font-medium text-[#00433b]">
              <span className="text-emerald-500">♥</span>
              <span>Every Pet Deserves Care</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
