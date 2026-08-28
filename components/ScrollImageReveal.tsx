'use client';

// This uses ONE image scaled once via object-fit: cover at height: 200vh, then panned via translateY. Do not split this into two separate image files/containers — doing so causes each piece to be scaled independently, breaking visual continuity at the seam.

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollImageRevealProps {
  imageSrc?: string; // single full-body image, e.g. "/full-length-model.png"
  heroContent?: React.ReactNode;
  nextSectionContent?: React.ReactNode;
  scaleDrift?: number;
  rotationDrift?: number;
  className?: string;
}

export function ScrollImageReveal({
  imageSrc = '/full-length-model.png',
  heroContent,
  nextSectionContent,
  scaleDrift = 1.03,
  rotationDrift = 1,
  className = '',
}: ScrollImageRevealProps) {
  const pinSectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const nextContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pinSectionRef.current || !imageRef.current) return;

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

      // 1. Continuous vertical image translation from top half (0) to bottom half (-100vh)
      tl.to(
        imageRef.current,
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

      {/* SINGLE UNIFORMLY SCALED FULL-BODY IMAGE (200VH TALL - INSIDE 100VH PINNED WINDOW) */}
      <div
        ref={imageRef}
        className="absolute inset-x-0 top-0 z-0 w-full h-[200vh] pointer-events-none will-change-transform"
      >
        <Image
          src={imageSrc}
          alt="NOVERA Full Body High Fashion Editorial Model"
          fill
          priority
          quality={100}
          unoptimized
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          className="object-cover object-top"
        />
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
