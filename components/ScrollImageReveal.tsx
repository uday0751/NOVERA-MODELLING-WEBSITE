'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/** Configurable Constants at top of file for easy tuning */
export const DEFAULT_CONFIG = {
  IMAGE_SRC: '/full-length-model.png',
  REVEAL_MODE: 'pinned' as 'pinned' | 'parallax',
  HERO_CROP_BOTTOM_PERCENT: 55, // Show top 55% (head to waist) in section 1
  NEXT_SECTION_CROP_PERCENT: 100, // Show full 100% (down to boots) by section 2
  SCALE_DRIFT: 1.03, // Subtle scale drift (1 -> 1.03)
  ROTATION_DRIFT: 1, // Subtle rotation drift (0deg -> 1deg)
};

export interface ScrollImageRevealProps {
  imageSrc?: string;
  revealMode?: 'pinned' | 'parallax';
  heroCropBottomPercent?: number;
  nextSectionCropPercent?: number;
  scaleDrift?: number;
  rotationDrift?: number;
  heroContent?: React.ReactNode;
  nextSectionContent?: React.ReactNode;
  className?: string;
}

export function ScrollImageReveal({
  imageSrc = DEFAULT_CONFIG.IMAGE_SRC,
  revealMode = DEFAULT_CONFIG.REVEAL_MODE,
  heroCropBottomPercent = DEFAULT_CONFIG.HERO_CROP_BOTTOM_PERCENT,
  nextSectionCropPercent = DEFAULT_CONFIG.NEXT_SECTION_CROP_PERCENT,
  scaleDrift = DEFAULT_CONFIG.SCALE_DRIFT,
  rotationDrift = DEFAULT_CONFIG.ROTATION_DRIFT,
  heroContent,
  nextSectionContent,
  className = '',
}: ScrollImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !innerImageRef.current) return;

    // 1. Accessibility Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Skip motion animations if OS prefers reduced motion
    }

    const ctx = gsap.context(() => {
      // Shift image upwards as user scrolls into Section 2
      const shiftDistance = (nextSectionCropPercent - heroCropBottomPercent) * 8; // smooth vertical shift

      gsap.to(innerImageRef.current, {
        y: -shiftDistance,
        scale: scaleDrift,
        rotate: rotationDrift,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [revealMode, heroCropBottomPercent, nextSectionCropPercent, scaleDrift, rotationDrift]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-white text-black ${className}`}
    >
      {/* STICKY FULL MODEL IMAGE CONTAINER (PIVOTAL DISPLAY SPANNING BOTH SECTIONS) */}
      <div className="sticky top-0 h-screen w-full z-0 flex items-center justify-center overflow-hidden pointer-events-none p-4 md:p-8">
        <div
          ref={innerImageRef}
          className="relative w-full max-w-5xl h-[160vh] md:h-[180vh] transition-transform duration-75"
        >
          <Image
            src={imageSrc}
            alt="ALVORE High Fashion Editorial Full Body Model"
            fill
            priority
            quality={100}
            unoptimized
            className="object-contain object-top"
          />
        </div>
      </div>

      {/* OVERLAY CONTENT SPANNING 2 VIEWPORTS ABOVE THE STICKY IMAGE */}
      <div className="relative z-20 -mt-[100vh]">
        {/* 3x3 Architectural Grid Overlay */}
        <div className="architectural-grid-white z-10 pointer-events-none">
          <div /><div /><div />
          <div /><div /><div />
          <div /><div /><div />
        </div>

        {/* SECTION 1: HERO SECTION (WAIST LOOK) */}
        <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 pt-[90px] pb-12">
          {heroContent}
        </section>

        {/* SECTION 2: NEXT SECTION (FULL REVEAL TILL LEGS/SHOES) */}
        <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 py-16 border-t border-black/10">
          {nextSectionContent}
        </section>
      </div>
    </div>
  );
}
