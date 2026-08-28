'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap } from 'gsap';

export function ThreeDBadge() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  // Framer Motion 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Physics Spring Config for buttery-smooth 3D movement
  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!badgeRef.current) return;
    const rect = badgeRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // GSAP 3D Shimmer & Subtle Breathing Effect
  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      // Continuous 3D letter float animation
      gsap.to(textRef.current, {
        translateZ: 8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      style={{ perspective: 1000 }}
      className="inline-block translate-y-4"
    >
      <motion.div
        ref={badgeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-black/20 bg-gradient-to-b from-white via-gray-50 to-gray-100/90 backdrop-blur-md shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden select-none"
      >
        {/* 3D Inner Layer Depth Shadow */}
        <div
          style={{ transform: 'translateZ(10px)' }}
          className="relative flex items-center space-x-2.5"
        >
          {/* Live Pulsing Status Dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black" />
          </span>

          {/* 3D Styled Text (Syne Bold + Italic Serif Combination) */}
          <span
            ref={textRef}
            style={{ transformStyle: 'preserve-3d' }}
            className="text-[9px] md:text-[10px] tracking-[0.28em] font-extrabold uppercase font-['Syne'] text-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)] group-hover:tracking-[0.38em] transition-all duration-500"
          >
            HIGH FASHION{' '}
            <span className="font-serif italic font-normal lowercase text-black/80 group-hover:text-black">
              agency
            </span>
          </span>
        </div>

        {/* 3D Metallic Gloss Sweep Overlay */}
        <div
          style={{ transform: 'translateZ(15px)' }}
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
