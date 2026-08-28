import Link from 'next/link';
import Image from 'next/image';
import { ThreeDBadge } from '@/components/ThreeDBadge';
import { ScrambleText } from '@/components/ScrambleText';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-black font-['Outfit'] selection:bg-black selection:text-white overflow-x-hidden">
      
      {/* 3x3 ARCHITECTURAL GRID OVERLAY WITH EXPLICIT RECONCILIATION KEYS */}
      <div className="architectural-grid-white z-10 pointer-events-none">
        <div key="cell-1" />
        <div key="cell-2" />
        <div key="cell-3" />
        <div key="cell-4" />
        <div key="cell-5" />
        <div key="cell-6" />
        <div key="cell-7" />
        <div key="cell-8" />
        <div key="cell-9" />
      </div>

      {/* FIXED FUTURISTIC HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-5 flex items-center justify-between border-b border-black/10 bg-white/85 backdrop-blur-xl shadow-2xs">
        <Link href="/" className="font-['Syne'] font-extrabold text-2xl tracking-widest text-black flex items-center space-x-2">
          <span>NOVARA</span>
          <span className="text-[10px] font-mono font-bold tracking-normal px-2 py-0.5 rounded-full bg-black text-white uppercase">
            AGENCY // 2026
          </span>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-widest text-black/70">
          <Link href="/client/models" className="hover:text-black transition-colors relative py-1 group">
            <span>Models</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/casting-calls" className="hover:text-black transition-colors relative py-1 group">
            <span>Casting Board</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/model/onboarding" className="hover:text-black transition-colors relative py-1 group">
            <span>Model Onboarding</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/client/shortlist" className="hover:text-black transition-colors relative py-1 group">
            <span>Shortlist</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-black group-hover:w-full transition-all duration-300" />
          </Link>
          <Link href="/client/dashboard" className="hover:text-black transition-colors relative py-1 group">
            <span>Client Portal</span>
          </Link>
        </nav>

        {/* Right Nav Auth Actions */}
        <div className="flex items-center space-x-5 text-xs font-bold uppercase tracking-wider">
          <Link href="/login" className="text-black/80 hover:text-black transition-colors">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-gray-800 shadow-md hover:shadow-xl transition-all"
          >
            Register
          </Link>
        </div>
      </header>

      {/* ANCHOR HERO SECTION DESIGN */}
      <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 pt-[100px] pb-12">
        {/* Background Clean Studio Model Image */}
        <div className="absolute inset-0 z-0 flex justify-center pointer-events-none p-4 md:p-8">
          <div className="relative w-full max-w-5xl h-full">
            <Image
              src="/user-clean-hero.png"
              alt="NOVARA Editorial Model"
              fill
              priority
              quality={100}
              unoptimized
              className="object-contain object-center"
            />
          </div>
        </div>

        {/* Middle Content Overlay Grid */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 gap-8 my-auto pt-6">
          {/* Left Block: Quote & Action Button */}
          <div className="md:col-span-5 space-y-6 max-w-md">
            <ScrambleText
              text="NOVARA IS BUILT FOR THOSE WHO CHOOSE FORM OVER NOISE — AND LET THE WORK SPEAK WHERE WORDS DON'T HAVE TO"
              trigger="onMount"
              className="font-grotesk text-sm md:text-base font-semibold uppercase tracking-wider leading-relaxed text-black/95"
            />

            <div className="pt-2">
              <Link
                href="/client/models"
                className="btn-shiny inline-flex items-center space-x-3 px-8 py-4 bg-[#1a1a1a] text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:bg-black transition-all"
              >
                <span>EXPLORE MODELS</span>
                <span className="text-sm">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Center Space framing upper body */}
          <div className="hidden md:block md:col-span-4" />

          {/* Right Block: Tagline & 3D Interactive Badge */}
          <div className="md:col-span-3 text-right flex flex-col justify-end items-end space-y-4">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-black/60 leading-tight">
              FASHION WITHOUT <br />
              THE SHOUT
            </p>

            {/* FRAMER MOTION & GSAP 3D INTERACTIVE BADGE */}
            <ThreeDBadge />
          </div>
        </div>

        {/* Hero Section Bottom Bar */}
        <div className="relative z-20 pt-6 mt-auto border-t border-black/10 flex justify-between items-center">
          <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
            NOVARA EDITORIAL // 2026
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
            HIGH FASHION AGENCY
          </span>
        </div>
      </section>

      {/* FUTURISTIC LIVE METRICS METROPOLIS TICKER */}
      <section className="relative z-20 py-6 bg-black text-white border-y border-white/10">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-extrabold font-['Syne']">1,200+</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">APPROVED TALENT</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-extrabold font-['Syne']">$4.8M+</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">ESCROW SECURED</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-extrabold font-['Syne']">100%</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">STRIPE VERIFIED</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-extrabold font-['Syne']">4.95 ★</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">MUTUAL SATISFACTION</p>
          </div>
        </div>
      </section>

      {/* FEATURED MODEL TALENT SPOTLIGHT (6 DISTINCT HIGH-FASHION MODELS) */}
      <section className="relative z-20 py-24 px-8 lg:px-16 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/10 pb-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-black/40">
                CURATED TALENT // EDITORIAL SELECTION
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-['Syne'] uppercase tracking-tight text-black mt-2">
                FEATURED ROSTER
              </h2>
            </div>
            <Link
              href="/client/models"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black hover:opacity-70 mt-4 md:mt-0"
            >
              <span>VIEW ALL TALENT</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Model Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Model Card 1 */}
            <div className="group relative rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
              <div className="relative h-[420px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/asian-fashion-model.png"
                  alt="Kenji Takahashi"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ✓ Stripe Verified
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ★ 4.98
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Syne'] text-xl font-extrabold uppercase text-black">Kenji Takahashi</h3>
                  <span className="text-xs font-mono font-bold text-black">$180 / hr</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">High Fashion // Tokyo, JP</p>
                <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>HT: 6'1"</span>
                  <span>WAIST: 30"</span>
                  <span>CHEST: 38"</span>
                </div>
                <Link
                  href="/client/models"
                  className="block w-full py-2.5 text-center bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Model Card 2 */}
            <div className="group relative rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
              <div className="relative h-[420px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/female-editorial-model.png"
                  alt="Elena Rostova"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ✓ Stripe Verified
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ★ 5.0
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Syne'] text-xl font-extrabold uppercase text-black">Elena Rostova</h3>
                  <span className="text-xs font-mono font-bold text-black">$210 / hr</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Luxury Editorial // Paris, FR</p>
                <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>HT: 5'11"</span>
                  <span>WAIST: 24"</span>
                  <span>BUST: 34"</span>
                </div>
                <Link
                  href="/client/models"
                  className="block w-full py-2.5 text-center bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Model Card 3 */}
            <div className="group relative rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
              <div className="relative h-[420px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/black-fashion-model.png"
                  alt="Malik Adebayo"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ✓ Stripe Verified
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ★ Top Talent
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Syne'] text-xl font-extrabold uppercase text-black">Malik Adebayo</h3>
                  <span className="text-xs font-mono font-bold text-black">$220 / hr</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Runway // London, UK</p>
                <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>HT: 6'2"</span>
                  <span>WAIST: 31"</span>
                  <span>CHEST: 40"</span>
                </div>
                <Link
                  href="/client/models"
                  className="block w-full py-2.5 text-center bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Model Card 4 */}
            <div className="group relative rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
              <div className="relative h-[420px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/male-streetwear-model.png"
                  alt="Zion O'Connor"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ✓ Stripe Verified
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ★ 4.96
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Syne'] text-xl font-extrabold uppercase text-black">Zion O'Connor</h3>
                  <span className="text-xs font-mono font-bold text-black">$260 / hr</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Avant-Garde // New York, USA</p>
                <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>HT: 6'3"</span>
                  <span>WAIST: 32"</span>
                  <span>CHEST: 41"</span>
                </div>
                <Link
                  href="/client/models"
                  className="block w-full py-2.5 text-center bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Model Card 5 */}
            <div className="group relative rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
              <div className="relative h-[420px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/hero-model-black-sitting.png"
                  alt="Marcus Vance"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ✓ Stripe Verified
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ★ 4.95
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Syne'] text-xl font-extrabold uppercase text-black">Marcus Vance</h3>
                  <span className="text-xs font-mono font-bold text-black">$195 / hr</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Commercial Editorial // Milan, IT</p>
                <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>HT: 6'1"</span>
                  <span>WAIST: 30"</span>
                  <span>CHEST: 39"</span>
                </div>
                <Link
                  href="/client/models"
                  className="block w-full py-2.5 text-center bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Model Card 6 */}
            <div className="group relative rounded-2xl border border-black/10 bg-white overflow-hidden shadow-xs hover:shadow-xl transition-all duration-500">
              <div className="relative h-[420px] w-full bg-gray-100 overflow-hidden">
                <Image
                  src="/full-hd-model.png"
                  alt="Julian Vance"
                  fill
                  unoptimized
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ✓ Stripe Verified
                  </span>
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-black text-[9px] font-bold uppercase tracking-wider rounded-full">
                    ★ 5.0
                  </span>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-['Syne'] text-xl font-extrabold uppercase text-black">Julian Vance</h3>
                  <span className="text-xs font-mono font-bold text-black">$250 / hr</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">High Fashion // Los Angeles, USA</p>
                <div className="pt-2 border-t border-black/10 flex justify-between text-[11px] text-gray-600 font-mono">
                  <span>HT: 6'1"</span>
                  <span>WAIST: 30"</span>
                  <span>CHEST: 39"</span>
                </div>
                <Link
                  href="/client/models"
                  className="block w-full py-2.5 text-center bg-gray-100 hover:bg-black hover:text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURISTIC PLATFORM ECOSYSTEM SHOWCASE */}
      <section className="relative z-20 py-24 px-8 lg:px-16 bg-gray-50 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/10 pb-6">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-black/50">DEVELOPED ARCHITECTURE</p>
              <h2 className="text-3xl md:text-5xl font-extrabold font-['Syne'] uppercase tracking-tight text-black mt-1">
                PLATFORM ECOSYSTEM
              </h2>
            </div>
            <p className="text-xs font-medium text-black/60 max-w-sm mt-2 md:mt-0">
              End-to-end management solution for fashion talent, agency management, and enterprise brands.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-black/10 p-8 rounded-2xl bg-white space-y-4 shadow-xs hover:shadow-xl transition-all group">
              <span className="text-xs font-mono font-bold text-black/40 group-hover:text-black transition-colors">01 // CLIENT DISCOVERY</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">
                Model Search & Filter Engine
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filter approved models by category (fashion, commercial, runway), height range, location, max hourly rate, and date availability. View full portfolio galleries, rates, and stats.
              </p>
              <Link href="/client/models" className="inline-block text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-70 pt-2">
                Browse Models Gallery &rarr;
              </Link>
            </div>

            <div className="border border-black/10 p-8 rounded-2xl bg-white space-y-4 shadow-xs hover:shadow-xl transition-all group">
              <span className="text-xs font-mono font-bold text-black/40 group-hover:text-black transition-colors">02 // MODEL ONBOARDING</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">
                6-Step Onboarding Wizard
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Guided multi-step wizard collecting basic info, physical measurements (height, bust, waist, hips), portfolio media uploads to Supabase Storage, and rate cards. Progress saves incrementally.
              </p>
              <Link href="/model/onboarding" className="inline-block text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-70 pt-2">
                Launch Onboarding &rarr;
              </Link>
            </div>

            <div className="border border-black/10 p-8 rounded-2xl bg-white space-y-4 shadow-xs hover:shadow-xl transition-all group">
              <span className="text-xs font-mono font-bold text-black/40 group-hover:text-black transition-colors">03 // BOOKINGS & ESCROW</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">
                Shortlists & Stripe Escrow
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Clients save models to personal shortlists and submit booking requests with Stripe Connect escrow. Automated payout releases upon booking completion and mutual reviews.
              </p>
              <Link href="/client/shortlist" className="inline-block text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-70 pt-2">
                View Shortlist & Portal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK COMMAND DECK */}
      <section className="relative z-20 py-16 px-8 lg:px-16 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center space-x-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-black/60 font-mono">PORTALS & MODULES:</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/client/models" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Models Search
            </Link>
            <Link href="/casting-calls" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Casting Calls
            </Link>
            <Link href="/client/shortlist" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Client Shortlist
            </Link>
            <Link href="/model/onboarding" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Model Onboarding
            </Link>
            <Link href="/model/dashboard" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Model Dashboard
            </Link>
            <Link href="/client/dashboard" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Client Dashboard
            </Link>
            <Link href="/admin/dashboard" className="px-5 py-2.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all shadow-2xs">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 py-10 px-8 lg:px-16 bg-black text-white text-xs flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div>
          <span className="font-['Syne'] font-extrabold text-sm tracking-wider text-white">NOVARA AGENCY</span> — © 2026. ALL RIGHTS RESERVED.
        </div>
        <div className="flex space-x-8 text-white/70 font-semibold uppercase tracking-wider text-[11px]">
          <Link href="/client/models" className="hover:text-white transition-colors">Models</Link>
          <Link href="/casting-calls" className="hover:text-white transition-colors">Castings</Link>
          <Link href="/model/onboarding" className="hover:text-white transition-colors">Onboarding</Link>
          <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
