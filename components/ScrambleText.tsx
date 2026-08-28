'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/** Configurable Constants at top of file for easy tuning */
export const DEFAULT_SCRAMBLE_CONFIG = {
  CHARACTER_SET: '0123456789#$%&*',
  CYCLES_PER_CHAR: 10,
  CYCLE_SPEED_MS: 40,
  STAGGER_CHAR_MS: 25,
  STAGGER_LINE_MS: 200,
  SHINE_COLOR: 'rgba(255, 255, 255, 0.25)',
  SHINE_OPACITY: 0.18,
  SHINE_ANGLE: '115deg',
  SHINE_WIDTH: '300px',
  SHINE_DURATION: 1.8,
};

export interface ScrambleTextProps {
  text: string;
  trigger?: 'onMount' | 'onScroll';
  scrambleCharacterSet?: string;
  cyclesPerCharacter?: number;
  cycleSpeedMs?: number;
  staggerPerCharacterMs?: number;
  staggerPerLineMs?: number;
  shineColor?: string;
  shineOpacity?: number;
  shineAngle?: string;
  shineWidth?: string;
  shineDuration?: number;
  className?: string;
}

export function ScrambleText({
  text,
  trigger = 'onMount',
  scrambleCharacterSet = DEFAULT_SCRAMBLE_CONFIG.CHARACTER_SET,
  cyclesPerCharacter = DEFAULT_SCRAMBLE_CONFIG.CYCLES_PER_CHAR,
  cycleSpeedMs = DEFAULT_SCRAMBLE_CONFIG.CYCLE_SPEED_MS,
  staggerPerCharacterMs = DEFAULT_SCRAMBLE_CONFIG.STAGGER_CHAR_MS,
  staggerPerLineMs = DEFAULT_SCRAMBLE_CONFIG.STAGGER_LINE_MS,
  shineColor = DEFAULT_SCRAMBLE_CONFIG.SHINE_COLOR,
  shineOpacity = DEFAULT_SCRAMBLE_CONFIG.SHINE_OPACITY,
  shineAngle = DEFAULT_SCRAMBLE_CONFIG.SHINE_ANGLE,
  shineWidth = DEFAULT_SCRAMBLE_CONFIG.SHINE_WIDTH,
  shineDuration = DEFAULT_SCRAMBLE_CONFIG.SHINE_DURATION,
  className = '',
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);

  // Split text into lines, then characters
  const lines = text.split('\n');

  // Track displayed text state per character slot (initialized with actual text)
  const [displayText, setDisplayText] = useState<string[][]>(() =>
    lines.map((line) => line.split(''))
  );

  useEffect(() => {
    if (!containerRef.current) return;

    // Accessibility Check: Skip animation if OS prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayText(lines.map((line) => line.split('')));
      return;
    }

    const startAnimation = () => {
      // Clear any prior active timers
      timeoutsRef.current.forEach(clearTimeout);
      intervalsRef.current.forEach(clearInterval);
      timeoutsRef.current = [];
      intervalsRef.current = [];

      // 1. Animate Background Glass Light Sweep
      if (shineRef.current) {
        gsap.fromTo(
          shineRef.current,
          { xPercent: -100, opacity: 0 },
          {
            xPercent: 200,
            opacity: shineOpacity,
            duration: shineDuration,
            ease: 'power2.inOut',
          }
        );
      }

      // 2. Scramble/Decode Execution Engine
      lines.forEach((line, lineIndex) => {
        const lineOffsetMs = lineIndex * staggerPerLineMs;

        line.split('').forEach((finalChar, charIndex) => {
          const charIndexInLine = charIndex;

          // Keep spaces and punctuation un-scrambled
          if (finalChar === ' ' || !/[a-zA-Z0-9—]/.test(finalChar)) {
            setDisplayText((prev) => {
              const updated = prev.map((l) => [...l]);
              updated[lineIndex][charIndexInLine] = finalChar;
              return updated;
            });
            return;
          }

          const startDelay = lineOffsetMs + charIndexInLine * staggerPerCharacterMs;

          // Delay before this character begins scrambling
          const tId = setTimeout(() => {
            let cycleCount = 0;

            const iId = setInterval(() => {
              cycleCount++;

              if (cycleCount >= cyclesPerCharacter) {
                // Lock in final character
                clearInterval(iId);
                setDisplayText((prev) => {
                  const updated = prev.map((l) => [...l]);
                  updated[lineIndex][charIndexInLine] = finalChar;
                  return updated;
                });
              } else {
                // Cycle through random characters from character set
                const randomChar =
                  scrambleCharacterSet[
                    Math.floor(Math.random() * scrambleCharacterSet.length)
                  ];

                setDisplayText((prev) => {
                  const updated = prev.map((l) => [...l]);
                  updated[lineIndex][charIndexInLine] = randomChar;
                  return updated;
                });
              }
            }, cycleSpeedMs);

            intervalsRef.current.push(iId);
          }, startDelay);

          timeoutsRef.current.push(tId);
        });
      });
    };

    if (trigger === 'onMount') {
      const mountTimer = setTimeout(() => {
        startAnimation();
      }, 50);
      return () => {
        clearTimeout(mountTimer);
        timeoutsRef.current.forEach(clearTimeout);
        intervalsRef.current.forEach(clearInterval);
      };
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        timeoutsRef.current.forEach(clearTimeout);
        intervalsRef.current.forEach(clearInterval);
      };
    }
  }, [
    text,
    trigger,
    scrambleCharacterSet,
    cyclesPerCharacter,
    cycleSpeedMs,
    staggerPerCharacterMs,
    staggerPerLineMs,
    shineDuration,
    shineOpacity,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden py-1 ${className}`}
    >
      {/* SOFT DIAGONAL BACKGROUND LIGHT SWEEP */}
      <div
        ref={shineRef}
        style={{
          background: `linear-gradient(${shineAngle}, transparent 0%, ${shineColor} 50%, transparent 100%)`,
          width: shineWidth,
        }}
        className="absolute inset-y-0 -left-full z-0 pointer-events-none blur-md transform -skew-x-12"
      />

      {/* SCRAMBLE/DECODE TEXT DISPLAY */}
      <div className="relative z-10 space-y-1">
        {displayText.map((lineChars, lIdx) => (
          <div key={`line-${lIdx}`} className="leading-relaxed">
            {lineChars.map((char, cIdx) => (
              <span
                key={`char-${lIdx}-${cIdx}`}
                className={
                  lines[lIdx][cIdx] !== char
                    ? 'font-mono text-black/70 font-bold'
                    : 'transition-colors duration-150'
                }
              >
                {char}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
