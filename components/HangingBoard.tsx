'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '@/components/ScrambleText';

export function HangingBoard() {
  return (
    <div className="relative z-40 flex flex-col items-end group origin-top my-1">
      {/* Single Central Metallic Hanging Wire extending from top boundary */}
      <div className="absolute -top-[100px] right-28 flex flex-col items-center pointer-events-none z-30">
        {/* Top Ceiling Mount Ring */}
        <div className="w-3 h-3 rounded-full border-2 border-black bg-white shadow-md" />
        {/* Single Central Rope/Wire */}
        <div className="w-[2px] h-[100px] bg-gradient-to-b from-black via-gray-500 to-black shadow-xs" />
      </div>

      {/* Tilted 3D Swaying Funky Blackboard Container Suspended from Single Wire */}
      <motion.div
        initial={{ rotate: -7 }}
        animate={{ rotate: [-9, -5, -9] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05, rotate: -4 }}
        style={{ transformOrigin: 'top center' }}
        className="relative z-40 mt-1 px-4 py-3 rounded-2xl bg-gradient-to-b from-[#1a1a1a] via-[#111111] to-[#080808] text-white border border-white/20 shadow-2xl max-w-[220px] text-right cursor-pointer select-none overflow-hidden -rotate-6"
      >
        {/* Single Metallic Center Eyelet Ring where single wire connects */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-400 flex items-center justify-center shadow-md z-50">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>

        {/* Bold White Top Tag */}
        <div className="flex items-center justify-end space-x-1.5 mb-1.5 pb-1 border-b border-white/10 pt-1">
          <span className="text-[8px] font-mono font-extrabold tracking-widest text-white uppercase flex items-center space-x-1 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]">
            <span className="h-1 w-1 rounded-full bg-white animate-ping inline-block mr-1" />
            ★ STYLING STATEMENT
          </span>
        </div>

        {/* Funky Stylish White Texting Quote (Compact Tilted Size) */}
        <div className="py-0.5">
          <ScrambleText
            text="STYLE IS A WAY TO SAY WHO YOU ARE WITHOUT HAVING TO SPEAK"
            trigger="onMount"
            staggerPerCharacterMs={20}
            shineColor="rgba(255, 255, 255, 0.5)"
            className="font-serif italic font-bold text-xs md:text-sm text-white tracking-wide leading-tight drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
          />
        </div>

        {/* Funky Footer Accent */}
        <div className="mt-2 pt-1.5 border-t border-white/10 flex justify-between items-center text-[8px] font-mono tracking-widest text-white/40 uppercase">
          <span>RACHEL ZOE</span>
          <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-white font-bold">2026</span>
        </div>

        {/* Metallic Gloss Reflection Beam Sweep */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
      </motion.div>
    </div>
  );
}
