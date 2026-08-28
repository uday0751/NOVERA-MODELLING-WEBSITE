import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-black font-['Outfit'] selection:bg-black selection:text-white">
      {/* 3x3 Architectural Grid Overlay matching user's reference design */}
      <div className="architectural-grid-white">
        <div /><div /><div />
        <div /><div /><div />
        <div /><div /><div />
      </div>

      {/* HEADER NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 px-8 lg:px-16 py-6 flex items-center justify-between border-b border-black/10 bg-white/90 backdrop-blur-md">
        <Link href="/" className="font-['Syne'] font-extrabold text-xl tracking-wider text-black">
          ALVORE
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10 text-xs font-semibold uppercase tracking-widest text-black/70">
          <Link href="/client/models" className="hover:text-black transition-colors">
            Models
          </Link>
          <Link href="/model/onboarding" className="hover:text-black transition-colors">
            Onboarding
          </Link>
          <Link href="/client/shortlist" className="hover:text-black transition-colors">
            Shortlist
          </Link>
          <Link href="/client/dashboard" className="hover:text-black transition-colors">
            Client Portal
          </Link>
          <Link href="/model/dashboard" className="hover:text-black transition-colors">
            Model Portal
          </Link>
        </nav>

        {/* Right Nav Links */}
        <div className="flex items-center space-x-6 text-xs font-semibold uppercase tracking-wider">
          <Link href="/login" className="text-black/80 hover:text-black">
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 border border-black rounded-full hover:bg-black hover:text-white transition-all"
          >
            Register
          </Link>
        </div>
      </header>

      {/* 2-SCREEN TALL HERO CONTAINER WITH FULL-LENGTH HIGH-RES MODEL IMAGE */}
      <div className="relative z-10 pt-[80px]">
        
        {/* Full-Length High-Res Background Image Container */}
        <div className="absolute inset-0 z-0 flex justify-center pointer-events-none p-4 md:p-8">
          <div className="relative w-full max-w-5xl h-full min-h-[1750px] md:min-h-[2000px]">
            <Image
              src="/full-length-model.png"
              alt="ALVORE Full Length High Fashion Model"
              fill
              priority
              quality={100}
              unoptimized
              className="object-contain object-top"
            />
          </div>
        </div>

        {/* ================= PAGE 1 (SCREEN 1: HEAD TO WAIST) ================= */}
        <section className="relative z-20 min-h-[calc(100vh-80px)] flex flex-col justify-between px-8 lg:px-16 py-12">
          
          {/* Middle Content Overlay Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto pt-6">
            
            {/* Left Block: Quote & Action Button */}
            <div className="md:col-span-5 space-y-6 max-w-md">
              <p className="font-grotesk text-sm md:text-base font-semibold uppercase tracking-wider leading-relaxed text-black/95 drop-shadow-xs">
                ALVORE IS BUILT FOR THOSE WHO CHOOSE FORM OVER NOISE — AND LET THE WORK SPEAK WHERE WORDS DON'T HAVE TO
              </p>

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

            {/* Right Block: Tagline */}
            <div className="md:col-span-3 text-right flex flex-col justify-end">
              <p className="text-xs md:text-sm font-semibold uppercase tracking-widest text-black/60 leading-tight">
                FASHION WITHOUT <br />
                THE SHOUT
              </p>
            </div>
          </div>

          {/* Screen 1 Bottom Bar & Scroll Indicator */}
          <div className="pt-6 border-t border-black/10 flex justify-between items-center mt-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
              PAGE 01 // WAIST LOOK
            </span>
            <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-widest text-black/70 animate-bounce">
              <span>SCROLL DOWN FOR FULL LOOK</span>
              <span>↓</span>
            </div>
          </div>
        </section>

        {/* ================= PAGE 2 (SCREEN 2: LEGS & FULL LOOK REVEAL) ================= */}
        <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 py-16">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 my-auto">
            
            {/* Left Column Accent */}
            <div className="md:col-span-4 space-y-4 max-w-sm">
              <span className="text-xs font-mono font-bold text-black/40 tracking-widest uppercase">
                EDITORIAL DETAILS // LOOK 02
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold font-['Syne'] uppercase text-black">
                FULL-LENGTH SILHOUETTE
              </h2>
              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                Tailored wide-leg trousers with accent red lanyard, belted waist, and heavy chunky boots. Complete presentation of high-fashion proportions.
              </p>
            </div>

            {/* Center Space framing full legs & boots */}
            <div className="hidden md:block md:col-span-4" />

            {/* Right Column Action */}
            <div className="md:col-span-4 flex flex-col justify-center items-end space-y-4">
              <Link
                href="/client/models"
                className="px-6 py-3 border border-black rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all bg-white/80 backdrop-blur-xs"
              >
                Hire Full Look Talent &rarr;
              </Link>
            </div>
          </div>

          {/* Screen 2 Bottom Bar */}
          <div className="pt-6 border-t border-black/10 flex justify-between items-center mt-auto">
            <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
              PAGE 02 // FULL LENGTH REVEAL
            </span>
            <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
              ALVORE EDITORIAL // 2026
            </span>
          </div>
        </section>
      </div>

      {/* FEATURED MODULES & PLATFORM SHOWCASE */}
      <section className="relative z-20 py-20 px-8 lg:px-16 bg-gray-50 border-t border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/10 pb-6">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase text-black/50">PLATFORM ECOSYSTEM</p>
              <h2 className="text-3xl md:text-5xl font-extrabold font-['Syne'] uppercase tracking-tight text-black mt-1">
                DEVELOPED FEATURES
              </h2>
            </div>
            <p className="text-xs font-medium text-black/60 max-w-sm mt-2 md:mt-0">
              Complete management solution for talent, clients, and agency management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Model Discovery */}
            <div className="border border-black/10 p-8 rounded-2xl bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-mono font-bold text-black/40">01 // CLIENT EXPERIENCE</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">
                Model Search & Filter Engine
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Filter approved models by category (fashion, commercial, runway), height range, location, max hourly rate, and date availability. View full portfolio galleries, rates, and stats.
              </p>
              <Link href="/client/models" className="inline-block text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-70">
                Browse Models Gallery &rarr;
              </Link>
            </div>

            {/* 2. Onboarding Wizard */}
            <div className="border border-black/10 p-8 rounded-2xl bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-mono font-bold text-black/40">02 // MODEL ONBOARDING</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">
                6-Step Onboarding Wizard
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Guided multi-step wizard collecting basic info, physical measurements (height, bust, waist, hips), portfolio media uploads to Supabase Storage, and rate cards. Progress saves incrementally.
              </p>
              <Link href="/model/onboarding" className="inline-block text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-70">
                Launch Onboarding &rarr;
              </Link>
            </div>

            {/* 3. Shortlists & Bookings */}
            <div className="border border-black/10 p-8 rounded-2xl bg-white space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-xs font-mono font-bold text-black/40">03 // BOOKINGS & CASTINGS</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">
                Shortlists & Booking Requests
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed text-xs">
                Clients save models to personal shortlists and submit booking requests with instant in-app notifications. Post casting calls and accept/decline booking proposals.
              </p>
              <Link href="/client/shortlist" className="inline-block text-xs font-bold uppercase tracking-wider text-black border-b border-black hover:opacity-70">
                View Shortlist & Portal &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK COMMAND DECK */}
      <section className="relative z-20 py-12 px-8 lg:px-16 bg-white border-t border-black/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <span className="text-black/50">PORTALS & MODULES:</span>
          <div className="flex flex-wrap gap-3">
            <Link href="/client/models" className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors">
              Models Search
            </Link>
            <Link href="/client/shortlist" className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors">
              Client Shortlist
            </Link>
            <Link href="/model/onboarding" className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors">
              Model Onboarding
            </Link>
            <Link href="/model/dashboard" className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors">
              Model Dashboard
            </Link>
            <Link href="/client/dashboard" className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors">
              Client Dashboard
            </Link>
            <Link href="/admin/dashboard" className="px-4 py-2 border border-black/20 rounded-full hover:bg-black hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-20 py-8 px-8 lg:px-16 border-t border-black/10 text-xs text-black/60 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <div>
          <span className="font-['Syne'] font-bold text-black">ALVORE AGENCY</span> — © 2026. ALL RIGHTS RESERVED.
        </div>
        <div className="flex space-x-6">
          <Link href="/client/models" className="hover:text-black">Models</Link>
          <Link href="/model/onboarding" className="hover:text-black">Onboarding</Link>
          <Link href="/login" className="hover:text-black">Sign In</Link>
        </div>
      </footer>
    </div>
  );
}
