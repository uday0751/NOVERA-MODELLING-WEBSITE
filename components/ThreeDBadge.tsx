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
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), springConfig);

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

  // GSAP 3D Subtle Breathing Float Effect
  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(textRef.current, {
        translateZ: 6,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, textRef);

    return () => ctx.revert();
  }, []);

  return (
    <div style={{ perspective: 1000 }} className="inline-block">
      <motion.div
        ref={badgeRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="group relative inline-flex items-center space-x-2.5 px-4 py-2 rounded-full border border-black/20 bg-gradient-to-b from-white via-gray-50 to-gray-100/95 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden select-none"
      >
        {/* 3D Inner Layer Depth */}
        <div
          style={{ transform: 'translateZ(10px)' }}
          className="relative flex items-center space-x-2.5"
        >
          {/* Live Pulsing Status Dot */}
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-black" />
          </span>

          {/* High Fashion Title */}
          <span
            ref={textRef}
            style={{ transformStyle: 'preserve-3d' }}
            className="text-[10px] md:text-[11px] tracking-[0.28em] font-extrabold uppercase font-['Syne'] text-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.12)]"
          >
            HIGH FASHION
          </span>

          {/* Elegant 3D Spring Hover Animated "agency" Text */}
          <motion.span
            whileHover={{ scale: 1.12, y: -2, rotate: -3 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="inline-block font-serif italic font-normal lowercase text-black/75 hover:text-black text-xs md:text-sm drop-shadow-xs hover:drop-shadow-md cursor-pointer transition-colors duration-300 ml-0.5"
          >
            agency
          </motion.span>
        </div>

        {/* 3D Metallic Gloss Sweep Overlay */}
        <div
          style={{ transform: 'translateZ(15px)' }}
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
