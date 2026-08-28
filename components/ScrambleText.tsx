'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/** CONFIGURABLE CONSTANTS AT TOP OF FILE */
export const SCRAMBLE_DEFAULTS = {
  CHARACTER_SET: '0123456789#$%&*+=',
  CHAR_DURATION: 0.5,
  STAGGER_PER_CHAR: 0.025,
  STAGGER_PER_LINE: 0.18,
  EASE: 'power2.out',
};

export interface ScrambleTextProps {
  text: string;
  trigger?: 'onMount' | 'onScroll';
  scrambleCharacterSet?: string;
  charDuration?: number;
  staggerPerChar?: number;
  staggerPerLine?: number;
  ease?: string;
  className?: string;
}

export function ScrambleText({
  text,
  trigger = 'onScroll',
  scrambleCharacterSet = SCRAMBLE_DEFAULTS.CHARACTER_SET,
  charDuration = SCRAMBLE_DEFAULTS.CHAR_DURATION,
  staggerPerChar = SCRAMBLE_DEFAULTS.STAGGER_PER_CHAR,
  staggerPerLine = SCRAMBLE_DEFAULTS.STAGGER_PER_LINE,
  ease = SCRAMBLE_DEFAULTS.EASE,
  className = '',
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const lines = text.split('\n');

  useEffect(() => {
    if (!containerRef.current) return;

    // Accessibility check: OS reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      spanRefs.current.forEach((span) => {
        if (span && span.dataset.finalChar) {
          span.textContent = span.dataset.finalChar;
        }
      });
      return;
    }

    const runAnimation = () => {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;

      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // GSAP Master Timeline (Frame-synced via requestAnimationFrame)
      const masterTimeline = gsap.timeline();

      lines.forEach((line, lineIdx) => {
        const lineStartTime = lineIdx * staggerPerLine;
        const lineSpans: { span: HTMLSpanElement; finalChar: string }[] = [];

        spanRefs.current.forEach((span) => {
          if (span && span.dataset.lineIdx === String(lineIdx) && span.dataset.finalChar) {
            lineSpans.push({
              span,
              finalChar: span.dataset.finalChar,
            });
          }
        });

        lineSpans.forEach((item, charIdx) => {
          const { span, finalChar } = item;

          // Keep spaces and punctuation un-scrambled
          if (finalChar === ' ' || !/[a-zA-Z0-9—]/.test(finalChar)) {
            span.textContent = finalChar;
            return;
          }

          const proxy = { progress: 0 };
          let prevChar = '';

          masterTimeline.to(
            proxy,
            {
              progress: 1,
              duration: charDuration,
              ease: ease,
              onUpdate: () => {
                if (proxy.progress >= 1) {
                  span.textContent = finalChar;
                } else {
                  // Pick a random char that is NOT equal to the previous one
                  let nextChar =
                    scrambleCharacterSet[
                      Math.floor(Math.random() * scrambleCharacterSet.length)
                    ];
                  while (nextChar === prevChar && scrambleCharacterSet.length > 1) {
                    nextChar =
                      scrambleCharacterSet[
                        Math.floor(Math.random() * scrambleCharacterSet.length)
                      ];
                  }
                  prevChar = nextChar;

                  // IMPERATIVE DIRECT DOM UPDATE (Zero React state re-renders)
                  span.textContent = nextChar;
                }
              },
              onComplete: () => {
                span.textContent = finalChar;
              },
            },
            lineStartTime + charIdx * staggerPerChar
          );
        });
      });

      timelineRef.current = masterTimeline;
    };

    if (trigger === 'onMount') {
      runAnimation();
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            runAnimation();
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(containerRef.current);

      return () => {
        observer.disconnect();
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
      };
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [
    text,
    trigger,
    scrambleCharacterSet,
    charDuration,
    staggerPerChar,
    staggerPerLine,
    ease,
  ]);

  let globalCharIndex = 0;

  return (
    <div
      ref={containerRef}
      className={`relative inline-block overflow-hidden py-1 ${className}`}
    >
      <div className="relative z-10 space-y-1">
        {lines.map((line, lIdx) => (
          <div key={`line-${lIdx}`} className="leading-relaxed">
            {line.split('').map((char, cIdx) => {
              const refIdx = globalCharIndex++;
              const isSpecial = char === ' ' || !/[a-zA-Z0-9—]/.test(char);

              return (
                <span
                  key={`c-${lIdx}-${cIdx}`}
                  ref={(el) => {
                    spanRefs.current[refIdx] = el;
                  }}
                  data-line-idx={lIdx}
                  data-final-char={char}
                  className={
                    isSpecial
                      ? 'inline'
                      : 'inline-block font-mono tabular-nums min-w-[1ch] text-center'
                  }
                >
                  {isSpecial ? char : scrambleCharacterSet[0]}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
