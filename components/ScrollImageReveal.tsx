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
  SCROLL_DISTANCE: '200vh',
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
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!containerRef.current || !imageWrapperRef.current) return;

    // 1. Accessibility Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return; // Skip motion animations if OS prefers reduced motion
    }

    const ctx = gsap.context(() => {
      // Calculate translate percentage required to move from top crop to lower crop
      const translatePercent = nextSectionCropPercent - heroCropBottomPercent;

      if (revealMode === 'pinned') {
        // Pinned Mode: Pin the image container while scrolling through both sections
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: imageWrapperRef.current,
          pinSpacing: false,
          scrub: true,
        });

        // Animate translateY, scale, and rotation tied to scroll progress
        gsap.to(imageWrapperRef.current, {
          yPercent: -translatePercent,
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
      } else {
        // Parallax Mode: Differential scroll speed relative to surrounding content
        gsap.to(imageWrapperRef.current, {
          yPercent: -(translatePercent * 1.5),
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, [revealMode, heroCropBottomPercent, nextSectionCropPercent, scaleDrift, rotationDrift]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full min-h-[200vh] bg-white text-black overflow-hidden ${className}`}
    >
      {/* 3x3 Architectural Grid Overlay */}
      <div className="architectural-grid-white z-10 pointer-events-none">
        <div /><div /><div />
        <div /><div /><div />
        <div /><div /><div />
      </div>

      {/* SINGLE FULL MODEL IMAGE CONTAINER (SPANS BOTH SECTIONS) */}
      <div
        ref={imageWrapperRef}
        className="absolute inset-0 z-0 flex justify-center pointer-events-none p-4 md:p-8 will-change-transform"
      >
        <div className="relative w-full max-w-5xl h-full min-h-[1800px] md:min-h-[2000px]">
          <Image
            ref={imageRef as any}
            src={imageSrc}
            alt="ALVORE High Fashion Editorial Full Body Model"
            fill
            priority
            quality={100}
            unoptimized
            className="object-contain object-top transition-transform duration-75"
          />
        </div>
      </div>

      {/* SECTION 1: HERO SECTION (TOP 50-55% CROPPED TILL WAIST) */}
      <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 pt-[90px] pb-12">
        {heroContent}
      </section>

      {/* SECTION 2: NEXT SECTION (FULL REVEAL TILL LEGS/SHOES) */}
      <section className="relative z-20 min-h-screen flex flex-col justify-between px-8 lg:px-16 py-16 bg-white/40 backdrop-blur-[2px] border-t border-black/10">
        {nextSectionContent}
      </section>
    </div>
  );
}
