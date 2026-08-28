import Link from 'next/link';
import Image from 'next/image';
import { HeroCinematic } from '@/components/HeroCinematic';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-white text-black font-['Outfit'] selection:bg-black selection:text-white overflow-x-hidden">
      {/* CINEMATIC ENTRANCE HERO SECTION */}
      <HeroCinematic />

      {/* CONTINUOUS HIGH FASHION EDITORIAL MARQUEE TICKER */}
      <div className="relative z-20 py-3.5 bg-gray-100 border-y border-black/10 overflow-hidden whitespace-nowrap select-none">
        <div className="inline-flex space-x-8 text-xs font-mono font-bold uppercase tracking-[0.25em] text-black/70 animate-marquee">
          <span>HIGH FASHION AGENCY</span>
          <span>•</span>
          <span>LUXURY TALENT MANAGEMENT</span>
          <span>•</span>
          <span>TOKYO // PARIS // NEW YORK // MILAN</span>
          <span>•</span>
          <span>STRIPE CONNECT ESCROW</span>
          <span>•</span>
          <span>VERIFIED PORTFOLIOS</span>
          <span>•</span>
          <span>HIGH FASHION AGENCY</span>
          <span>•</span>
          <span>LUXURY TALENT MANAGEMENT</span>
          <span>•</span>
          <span>TOKYO // PARIS // NEW YORK // MILAN</span>
          <span>•</span>
        </div>
      </div>

      {/* FUTURISTIC LIVE METRICS METROPOLIS TICKER */}
      <section className="relative z-20 py-8 bg-black text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-extrabold font-['Syne'] text-white">1,200+</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">APPROVED TALENT</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-extrabold font-['Syne'] text-white">$4.8M+</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">ESCROW SECURED</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-extrabold font-['Syne'] text-white">100%</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">STRIPE VERIFIED</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-4xl font-extrabold font-['Syne'] text-white">4.95 ★</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/50">MUTUAL SATISFACTION</p>
          </div>
        </div>
      </section>

      {/* NEW SECTION: LIVE CASTING CALLS & OPPORTUNITIES BOARD */}
      <section className="relative z-20 py-24 px-8 lg:px-16 bg-white border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-black/10 pb-6">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-black/40">
                ACTIVE OPPORTUNITIES // REAL-TIME BOARD
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-['Syne'] uppercase tracking-tight text-black mt-2">
                LIVE CASTING CALLS
              </h2>
            </div>
            <Link
              href="/casting-calls"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black border-b border-black hover:opacity-70 mt-4 md:mt-0"
            >
              <span>VIEW ALL CASTING CALLS</span>
              <span>&rarr;</span>
            </Link>
          </div>

          {/* Live Casting Calls Feed Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Casting Item 1 */}
            <div className="p-8 rounded-2xl border border-black/10 bg-gray-50/50 hover:bg-white hover:border-black transition-all space-y-4 group shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    HIGH FASHION
                  </span>
                  <h3 className="font-['Syne'] text-2xl font-extrabold uppercase text-black mt-3">
                    Vogue Editorial Lookbook
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Paris, France • Call Time: Sept 12</p>
                </div>
                <span className="text-sm font-mono font-extrabold text-black">$3,500 / DAY</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Seeking 2 female editorial models (5'10"+) for 2026 Autumn Couture print lookbook. Full wardrobe, makeup & styling provided.
              </p>
              <div className="pt-4 border-t border-black/10 flex justify-between items-center text-xs">
                <span className="text-[10px] font-mono text-gray-400">CLOSES IN 2 DAYS</span>
                <Link href="/casting-calls" className="font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                  Apply for Casting &rarr;
                </Link>
              </div>
            </div>

            {/* Casting Item 2 */}
            <div className="p-8 rounded-2xl border border-black/10 bg-gray-50/50 hover:bg-white hover:border-black transition-all space-y-4 group shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    RUNWAY COUTURE
                  </span>
                  <h3 className="font-['Syne'] text-2xl font-extrabold uppercase text-black mt-3">
                    Balenciaga Winter Runway
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">New York, USA • Call Time: Sept 18</p>
                </div>
                <span className="text-sm font-mono font-extrabold text-black">$4,800 / DAY</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Male runway models (6'1"-6'3") for major fashion week runway presentation. Prior runway experience required.
              </p>
              <div className="pt-4 border-t border-black/10 flex justify-between items-center text-xs">
                <span className="text-[10px] font-mono text-gray-400">CLOSES IN 4 DAYS</span>
                <Link href="/casting-calls" className="font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                  Apply for Casting &rarr;
                </Link>
              </div>
            </div>

            {/* Casting Item 3 */}
            <div className="p-8 rounded-2xl border border-black/10 bg-gray-50/50 hover:bg-white hover:border-black transition-all space-y-4 group shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    COMMERCIAL
                  </span>
                  <h3 className="font-['Syne'] text-2xl font-extrabold uppercase text-black mt-3">
                    Bvlgari Jewelry Campaign
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Milan, Italy • Call Time: Sept 08</p>
                </div>
                <span className="text-sm font-mono font-extrabold text-black">$5,200 / DAY</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Commercial portrait modeling for high-jewelry print & billboard campaign. Must have clean hands and neck profile.
              </p>
              <div className="pt-4 border-t border-black/10 flex justify-between items-center text-xs">
                <span className="text-[10px] font-mono text-gray-400">CLOSES TODAY</span>
                <Link href="/casting-calls" className="font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                  Apply for Casting &rarr;
                </Link>
              </div>
            </div>

            {/* Casting Item 4 */}
            <div className="p-8 rounded-2xl border border-black/10 bg-gray-50/50 hover:bg-white hover:border-black transition-all space-y-4 group shadow-2xs">
              <div className="flex justify-between items-start">
                <div>
                  <span className="px-3 py-1 bg-black text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                    AVANT-GARDE
                  </span>
                  <h3 className="font-['Syne'] text-2xl font-extrabold uppercase text-black mt-3">
                    Yohji Yamamoto Tokyo Show
                  </h3>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">Tokyo, Japan • Call Time: Sept 22</p>
                </div>
                <span className="text-sm font-mono font-extrabold text-black">$2,900 / DAY</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Conceptual high-fashion show featuring avant-garde oversized silhouettes. Tokyo residency or available travel.
              </p>
              <div className="pt-4 border-t border-black/10 flex justify-between items-center text-xs">
                <span className="text-[10px] font-mono text-gray-400">CLOSES IN 1 DAY</span>
                <Link href="/casting-calls" className="font-bold uppercase tracking-wider text-black group-hover:translate-x-1 transition-transform">
                  Apply for Casting &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SECTION: MODEL PHYSICAL SPECS & STANDARDS MATRIX */}
      <section className="relative z-20 py-24 px-8 lg:px-16 bg-gray-50 border-b border-black/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="border-b border-black/10 pb-6">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-black/40">
              EDITORIAL STANDARDS & VERIFICATION
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold font-['Syne'] uppercase tracking-tight text-black mt-2">
              ROSTER SPECIFICATIONS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white border border-black/10 space-y-4">
              <span className="text-xs font-mono font-bold text-black/40">STANDARDS // 01</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">Male Roster Specs</h3>
              <ul className="space-y-2 text-xs font-mono text-gray-600">
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>HEIGHT RANGE:</span>
                  <span className="font-bold text-black">6'1" — 6'3"</span>
                </li>
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>WAIST SIZE:</span>
                  <span className="font-bold text-black">30" — 32"</span>
                </li>
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>CHEST SIZE:</span>
                  <span className="font-bold text-black">38" — 41"</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>SHOE SIZE:</span>
                  <span className="font-bold text-black">EU 43 - 45</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-black/10 space-y-4">
              <span className="text-xs font-mono font-bold text-black/40">STANDARDS // 02</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">Female Roster Specs</h3>
              <ul className="space-y-2 text-xs font-mono text-gray-600">
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>HEIGHT RANGE:</span>
                  <span className="font-bold text-black">5'10" — 6'0"</span>
                </li>
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>WAIST SIZE:</span>
                  <span className="font-bold text-black">23" — 25"</span>
                </li>
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>BUST SIZE:</span>
                  <span className="font-bold text-black">33" — 35"</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>HIPS SIZE:</span>
                  <span className="font-bold text-black">34" — 36"</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-black/10 space-y-4">
              <span className="text-xs font-mono font-bold text-black/40">STANDARDS // 03</span>
              <h3 className="text-xl font-extrabold font-['Syne'] uppercase text-black">Booking Rates</h3>
              <ul className="space-y-2 text-xs font-mono text-gray-600">
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>EDITORIAL HOURLY:</span>
                  <span className="font-bold text-black">$180 — $350 / HR</span>
                </li>
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>RUNWAY DAY RATE:</span>
                  <span className="font-bold text-black">$2,500 — $5,000 / DAY</span>
                </li>
                <li className="flex justify-between py-1 border-b border-black/5">
                  <span>COMMERCIAL BUYOUT:</span>
                  <span className="font-bold text-black">CUSTOM CONTRACT</span>
                </li>
                <li className="flex justify-between py-1">
                  <span>ESCROW PROTECTION:</span>
                  <span className="font-bold text-emerald-600">STRIPE CONNECT</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MODEL TALENT SPOTLIGHT */}
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

            {/* Editorial Category Filter Chips */}
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0 text-[11px] font-bold uppercase tracking-wider">
              <Link href="/client/models" className="px-4 py-1.5 bg-black text-white rounded-full">
                All Roster
              </Link>
              <Link href="/client/models" className="px-4 py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all">
                High Fashion
              </Link>
              <Link href="/client/models" className="px-4 py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all">
                Runway
              </Link>
              <Link href="/client/models" className="px-4 py-1.5 border border-black/20 rounded-full hover:bg-black hover:text-white transition-all">
                Editorial
              </Link>
            </div>
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

      {/* NEW SECTION: HOW NOVARA WORKS (4-STEP AGENCY WORKFLOW) */}
      <section className="relative z-20 py-24 px-8 lg:px-16 bg-black text-white">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-white/40">
                AGENCY INFRASTRUCTURE
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold font-['Syne'] uppercase tracking-tight text-white mt-2">
                HOW NOVARA OPERATES
              </h2>
            </div>
            <p className="text-xs text-white/60 max-w-sm mt-2 md:mt-0 font-medium">
              Transparent escrow payments, verified physical measurements, and instant direct casting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-2xl font-extrabold font-['Syne'] text-white/30">01</span>
              <h3 className="text-lg font-bold font-['Syne'] uppercase text-white">VERIFIED APPLICATION</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Talent completes a 6-step wizard logging physical measurements, comp card stats, and portfolio media.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-2xl font-extrabold font-['Syne'] text-white/30">02</span>
              <h3 className="text-lg font-bold font-['Syne'] uppercase text-white">DIRECT DISCOVERY</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Brands filter models by exact height, waist, location, date availability, and max hourly rates.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-2xl font-extrabold font-['Syne'] text-white/30">03</span>
              <h3 className="text-lg font-bold font-['Syne'] uppercase text-white">STRIPE ESCROW LOCK</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Booking funds are deposited securely into Stripe Connect escrow prior to call time.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl border border-white/10 bg-white/5">
              <span className="text-2xl font-extrabold font-['Syne'] text-white/30">04</span>
              <h3 className="text-lg font-bold font-['Syne'] uppercase text-white">AUTOMATED PAYOUT</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Escrow funds release automatically to talent upon shoot completion and mutual review.
              </p>
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
