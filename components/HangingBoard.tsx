'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ScrambleText } from '@/components/ScrambleText';

export function HangingBoard() {
  return (
    <div className="relative flex flex-col items-end group origin-top">
      {/* Metallic Hanging Wires extending from top boundary */}
      <div className="absolute -top-[100px] right-8 flex space-x-28 pointer-events-none z-10">
        {/* Left Wire */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full border-2 border-black bg-white shadow-md" />
          <div className="w-[2px] h-[100px] bg-gradient-to-b from-black via-gray-500 to-black shadow-xs" />
        </div>
        {/* Right Wire */}
        <div className="flex flex-col items-center">
          <div className="w-3 h-3 rounded-full border-2 border-black bg-white shadow-md" />
          <div className="w-[2px] h-[100px] bg-gradient-to-b from-black via-gray-500 to-black shadow-xs" />
        </div>
      </div>

      {/* 3D Swaying Funky Blackboard Container */}
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05, rotate: 0 }}
        style={{ transformOrigin: 'top center' }}
        className="relative mt-2 px-6 py-5 rounded-3xl bg-gradient-to-b from-[#1a1a1a] via-[#111111] to-[#080808] text-white border-2 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[280px] text-right cursor-pointer select-none overflow-hidden"
      >
        {/* Metallic Corner Rivet Eyelets */}
        <div className="absolute -top-1.5 left-7 w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-400 flex items-center justify-center shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>
        <div className="absolute -top-1.5 right-7 w-3.5 h-3.5 rounded-full bg-neutral-800 border border-neutral-400 flex items-center justify-center shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]" />
        </div>

        {/* Funky Neon Top Tag */}
        <div className="flex items-center justify-end space-x-2 mb-2 pb-1.5 border-b border-white/10">
          <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block mr-1" />
            ★ STYLING STATEMENT
          </span>
        </div>

        {/* Funky Stylish White Texting Quote */}
        <div className="py-1">
          <ScrambleText
            text="STYLE IS A WAY TO SAY WHO YOU ARE WITHOUT HAVING TO SPEAK"
            trigger="onMount"
            staggerPerCharacterMs={22}
            shineColor="rgba(255, 255, 255, 0.6)"
            className="font-serif italic font-extrabold text-sm md:text-base text-white tracking-wider leading-snug drop-shadow-[0_2px_10px_rgba(255,255,255,0.35)]"
          />
        </div>

        {/* Funky Footer Accent */}
        <div className="mt-3 pt-2 border-t border-white/10 flex justify-between items-center text-[9px] font-mono tracking-widest text-white/40 uppercase">
          <span>RACHEL ZOE</span>
          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">2026</span>
        </div>

        {/* Metallic Gloss Reflection Beam Sweep */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />
      </motion.div>
    </div>
  );
}
