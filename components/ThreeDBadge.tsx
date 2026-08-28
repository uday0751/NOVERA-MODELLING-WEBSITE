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
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [14, -14]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-14, 14]), springConfig);

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

  // GSAP 3D Subtle Breathing Float & Shimmer Pulse
  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
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
    <div style={{ perspective: 1000 }} className="inline-block translate-y-7 whitespace-nowrap ml-auto">
      <motion.div
        ref={badgeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-black/30 bg-gradient-to-b from-white via-gray-100 to-white backdrop-blur-md shadow-xs hover:shadow-lg hover:border-black transition-all duration-300 cursor-pointer overflow-hidden select-none whitespace-nowrap"
      >
        {/* 3D Inner Layer Depth in Single Non-Wrapping Line */}
        <div
          style={{ transform: 'translateZ(10px)' }}
          className="relative flex items-center space-x-2 whitespace-nowrap"
        >
          {/* Live Pulsing Bright Indicator Dot */}
          <span className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-85" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black shadow-[0_0_6px_rgba(0,0,0,0.8)]" />
          </span>

          {/* HIGH FASHION Bright Metallic Text */}
          <span
            ref={textRef}
            style={{ transformStyle: 'preserve-3d' }}
            className="text-[9px] md:text-[10px] tracking-[0.24em] font-extrabold uppercase font-['Syne'] text-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] whitespace-nowrap"
          >
            HIGH FASHION
          </span>

          {/* ULTRA-BRIGHT METALLIC SHINE 3D "agency" TEXT */}
          <motion.span
            whileHover={{ scale: 1.12, y: -1, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 450, damping: 14 }}
            className="inline-block font-serif italic font-medium lowercase text-xs md:text-sm text-black drop-shadow-[0_0_10px_rgba(255,255,255,1)] hover:drop-shadow-[0_0_14px_rgba(0,0,0,0.5)] cursor-pointer transition-all duration-300 ml-0.5 relative whitespace-nowrap"
          >
            {/* Animated Ultra Bright Silver Metallics Text */}
            <span className="bg-gradient-to-r from-black via-gray-700 to-black bg-clip-text text-transparent group-hover:from-black group-hover:via-gray-400 group-hover:to-black transition-all duration-500 whitespace-nowrap">
              agency
            </span>
          </motion.span>
        </div>

        {/* ULTRA-BRIGHT METALLIC GLOSS SWEEP BEAM OVERLAY */}
        <div
          style={{ transform: 'translateZ(15px)' }}
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/90 to-transparent transition-transform duration-800 ease-in-out pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
