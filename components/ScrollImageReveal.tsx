'use client';

// topImageSrc and bottomImageSrc are two crops taken from the same single source photo, split at the same horizontal line (y=385px of 1024px, the belt), at the same image width (1536px). Do not substitute independently generated or photographed images here — they will not align at the seam.

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollImageRevealProps {
  topImageSrc?: string; // waist-up photo, e.g. "/model-top.png"
  bottomImageSrc?: string; // lower-body photo, e.g. "/model-bottom.png"
  heroContent?: React.ReactNode;
  nextSectionContent?: React.ReactNode;
  scaleDrift?: number;
  rotationDrift?: number;
  className?: string;
}

export function ScrollImageReveal({
  topImageSrc = '/model-top.png',
  bottomImageSrc = '/model-bottom.png',
  heroContent,
  nextSectionContent,
  scaleDrift = 1.03,
  rotationDrift = 1,
  className = '',
}: ScrollImageRevealProps) {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const translatingContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const nextContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinSectionRef.current || !translatingContainerRef.current) return;

    // Accessibility check: Skip motion if OS prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // SINGLE GSAP TIMELINE TIED TO SCROLLTRIGGER PIN
      // end: '+=100%' pins for exactly one viewport height of scroll distance
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: true,
          scrub: 1, // Smooth scrub lag
          invalidateOnRefresh: true,
        },
      });

      // 1. Continuous vertical image translation from top image (0) to bottom stacked image (-100vh)
      tl.to(
        translatingContainerRef.current,
        {
          y: '-100vh',
          scale: scaleDrift,
          rotate: rotationDrift,
          ease: 'none',
        },
        0
      );

      // 2. Hero content fades OUT during first half of scroll progress (0% -> 50%)
      if (heroContentRef.current) {
        tl.to(
          heroContentRef.current,
          {
            opacity: 0,
            y: -50,
            ease: 'power1.inOut',
          },
          0
        );
      }

      // 3. Next section content fades IN during second half of scroll progress (50% -> 100%)
      if (nextContentRef.current) {
        // Set initial hidden state
        gsap.set(nextContentRef.current, { opacity: 0, y: 50 });

        tl.to(
          nextContentRef.current,
          {
            opacity: 1,
            y: 0,
            ease: 'power1.inOut',
          },
          0.5 // Starts at midpoint of 100% pin scroll
        );
      }
    }, pinSectionRef);

    return () => ctx.revert();
  }, [scaleDrift, rotationDrift]);

  return (
    <div
      ref={pinSectionRef}
      className={`relative w-full h-screen bg-white text-black overflow-hidden ${className}`}
    >
      {/* 3x3 ARCHITECTURAL GRID OVERLAY */}
      <div className="architectural-grid-white z-10 pointer-events-none">
        <div /><div /><div />
        <div /><div /><div />
        <div /><div /><div />
      </div>

      {/* TWO STACKED 100VH IMAGES INSIDE 200VH TRANSLATING CONTAINER */}
      {/* These images are cropped from a wide source photo with extra whitespace on the sides — if the cover-fit zoom crops too tightly into the model, the fix is to re-crop the source image tighter around the model (not a CSS change). */}
      <div
        ref={translatingContainerRef}
        className="absolute inset-x-0 top-0 z-0 h-[200vh] w-full pointer-events-none will-change-transform flex flex-col"
      >
        {/* TOP IMAGE (FIRST 100VH - PRE-ALIGNED WAIST UP CROP) */}
        <div className="relative w-full h-[100vh] overflow-hidden">
          <Image
            src={topImageSrc}
            alt="NOVERA Waist Up Editorial Model"
            fill
            priority
            quality={100}
            unoptimized
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            className="object-cover object-top"
          />
        </div>

        {/* BOTTOM IMAGE (SECOND 100VH - PRE-ALIGNED LOWER BODY CROP WITH ZERO GAP AT SEAM) */}
        <div className="relative w-full h-[100vh] overflow-hidden">
          <Image
            src={bottomImageSrc}
            alt="NOVERA Lower Body Editorial Model"
            fill
            priority
            quality={100}
            unoptimized
            style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
            className="object-cover object-bottom"
          />
        </div>
      </div>

      {/* VIEWPORT OVERLAY CONTAINER (100VH STICKY/PINNED VIEWPORT) */}
      <div className="relative z-20 h-screen w-full flex flex-col justify-between px-8 lg:px-16 pt-[90px] pb-12 pointer-events-none">
        
        {/* HERO SECTION CONTENT (FADES OUT 0% -> 50%) */}
        <div ref={heroContentRef} className="h-full flex flex-col justify-between pointer-events-auto">
          {heroContent}
        </div>

        {/* NEXT SECTION CONTENT (FADES IN 50% -> 100%) */}
        <div
          ref={nextContentRef}
          className="absolute inset-x-0 bottom-0 top-[90px] px-8 lg:px-16 flex flex-col justify-between pointer-events-auto opacity-0"
        >
          {nextSectionContent}
        </div>
      </div>
    </div>
  );
}
