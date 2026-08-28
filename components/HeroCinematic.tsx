'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ThreeDBadge } from '@/components/ThreeDBadge';
import { ScrambleText } from '@/components/ScrambleText';
import { HangingBoard } from '@/components/HangingBoard';

export function HeroCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const leftUiRef = useRef<HTMLDivElement>(null);
  const rightUiRef = useRef<HTMLDivElement>(null);
  const specBadgeLeftRef = useRef<HTMLDivElement>(null);
  const specBadgeRightRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial State: Pure Clean White Screen
      gsap.set(modelRef.current, { opacity: 0, scale: 0.95, y: 30 });
      gsap.set(headlineRef.current, { opacity: 0, y: 110, scale: 0.98 });
      gsap.set(headerRef.current, { opacity: 0, y: -20 });
      gsap.set(leftUiRef.current, { opacity: 0, y: 25 });
      gsap.set(rightUiRef.current, { opacity: 0, y: 25 });
      gsap.set(specBadgeLeftRef.current, { opacity: 0, y: 15 });
      gsap.set(specBadgeRightRef.current, { opacity: 0, y: 15 });
      gsap.set(bottomBarRef.current, { opacity: 0, y: 15 });

      // 2. Cinematic Entrance Timeline Sequence
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
      });

      // 0.20s - 1.40s: Model Reveal from Center
      tl.to(
        modelRef.current,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
        },
        0.2
      );

      // 0.70s - 2.00s: Massive "SPEAK ALVORE" Typography Entrance
      tl.to(
        headlineRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.3,
          ease: 'power4.out',
        },
        0.7
      );

      // 1.50s - 2.30s: Upper Navigation Bar Reveal
      tl.to(
        headerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        1.5
      );

      // 1.65s - 2.45s: Left & Right Editorial Content Reveal
      tl.to(
        [leftUiRef.current, rightUiRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
        },
        1.65
      );

      // 2.00s - 2.70s: Floating Spec Badges & Bottom Bar Finish Appearing
      tl.to(
        [specBadgeLeftRef.current, specBadgeRightRef.current, bottomBarRef.current],
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
        },
        2.0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-white text-black font-['Outfit'] overflow-hidden">
      
      {/* 3x3 ARCHITECTURAL GRID OVERLAY */}
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

      {/* FIXED FUTURISTIC HEADER NAVBAR (Revealed at 1.50s) */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-16 py-5 flex items-center justify-between border-b border-black/10 bg-white/85 backdrop-blur-xl shadow-2xs"
      >
        <Link href="/" className="font-['Syne'] font-extrabold text-2xl tracking-widest text-black flex items-center space-x-2">
          <span>NOVARA</span>
          <span className="text-[10px] font-mono font-bold tracking-normal px-2.5 py-0.5 rounded-full bg-black text-white uppercase">
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

      {/* MAIN CINEMATIC HERO CONTAINER */}
      <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 pt-[100px] pb-12 overflow-hidden">
        
        {/* Soft Ambient Glow Halo behind hero model */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-gray-200/50 via-gray-100/30 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

        {/* MASSIVE TYPOGRAPHY (z-10) — SPEAK ALVORE */}
        <div className="absolute inset-x-0 bottom-16 z-10 flex justify-center pointer-events-none text-center w-full px-2">
          <h1
            ref={headlineRef}
            className="text-[13.5vw] leading-none font-black font-['Syne'] tracking-tighter uppercase text-black/90 select-none whitespace-nowrap drop-shadow-sm"
          >
            SPEAK ALVORE
          </h1>
        </div>

        {/* MODEL REVEAL IMAGE (z-20) — OVERLAPS SPEAK ALVORE */}
        <div ref={modelRef} className="absolute inset-0 z-20 flex justify-center pointer-events-none p-4 md:p-8">
          <div className="relative w-full max-w-5xl h-full">
            <Image
              src="/user-clean-hero.png"
              alt="SPEAK ALVORE Editorial Model"
              fill
              priority
              quality={100}
              unoptimized
              className="object-contain object-center drop-shadow-md"
            />
          </div>
        </div>

        {/* Floating High-Fashion Editorial Spec Badges (z-30) */}
        <div
          ref={specBadgeLeftRef}
          className="absolute bottom-32 left-12 hidden lg:flex items-center space-x-3 px-4 py-2 rounded-full border border-black/15 bg-white/80 backdrop-blur-md shadow-xs z-30 pointer-events-none"
        >
          <span className="h-2 w-2 rounded-full bg-black animate-pulse" />
          <span className="text-[10px] font-mono font-bold tracking-widest text-black/80 uppercase">
            HEIGHT: 6'1" // TOKYO • PARIS • NYC
          </span>
        </div>

        <div
          ref={specBadgeRightRef}
          className="absolute top-36 right-16 hidden lg:flex items-center space-x-3 px-4 py-2 rounded-full border border-black/15 bg-white/80 backdrop-blur-md shadow-xs z-30 pointer-events-none"
        >
          <span className="text-[10px] font-mono font-bold tracking-widest text-black/80 uppercase">
            EDITORIAL COLLECTION 01 // 2026
          </span>
        </div>

        {/* Middle Content Overlay Grid (z-30) */}
        <div className="relative z-30 grid grid-cols-1 md:grid-cols-12 gap-8 my-auto pt-6">
          {/* Left Block: Quote & Action Button */}
          <div ref={leftUiRef} className="md:col-span-5 space-y-6 max-w-md">
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

          {/* Right Block: Hanging Board & 3D Interactive Badge */}
          <div ref={rightUiRef} className="md:col-span-3 text-right flex flex-col justify-end items-end space-y-6 relative z-40">
            {/* HANGING BLACK BOARD SIGNBOARD WITH FRAMER MOTION 3D SWAY */}
            <HangingBoard />

            {/* FRAMER MOTION & GSAP 3D INTERACTIVE BADGE */}
            <ThreeDBadge />
          </div>
        </div>

        {/* Hero Section Bottom Bar (z-30) */}
        <div ref={bottomBarRef} className="relative z-30 pt-6 mt-auto border-t border-black/10 flex justify-between items-center">
          <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
            SPEAK ALVORE EDITORIAL // 2026
          </span>
          <span className="text-xs font-mono font-bold tracking-widest text-black/40 uppercase">
            HIGH FASHION AGENCY
          </span>
        </div>
      </section>
    </div>
  );
}
