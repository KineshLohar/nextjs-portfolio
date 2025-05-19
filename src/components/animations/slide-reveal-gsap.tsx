"use client";

import { useRef, ReactNode, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

interface SlideRevealProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  delay?: number;
  duration?: number;
  xOffset?: number;
  className?: string;
}

export const SlideReveal = ({
  children,
  direction = 'left',
  delay = 0.5,
  duration = 1.5,
  xOffset = 100,
  className = ''
}: SlideRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!contentRef.current) return;

      ScrollTrigger.matchMedia({
        // Mobile
        "(max-width: 767px)": () => {
          const startX = direction === 'left' ? -xOffset : xOffset;

          gsap.fromTo(contentRef.current,
            {
              x: startX,
              opacity: 0
            },
            {
              x: 0,
              opacity: 1,
              delay,
              duration,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 100%",
                end: "bottom 40%",
                scrub: true,
                toggleActions: "play none none reverse"
              }
            }
          );
        },

        // Desktop and tablet
        "(min-width: 768px)": () => {
          const startX = direction === 'left' ? -xOffset : xOffset;

          gsap.fromTo(contentRef.current,
            {
              x: startX,
              opacity: 0
            },
            {
              x: 0,
              opacity: 1,
              delay,
              duration,
              ease: "power2.out",
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 90%",
                end: "bottom 20%",
                scrub: true,
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction, delay, duration, xOffset]);

  return (
    <div
      ref={containerRef}
      className={cn("will-change-transform", className)}
    >
      <div
        ref={contentRef}
        style={{ opacity: 0, transform: `translateX(${direction === 'left' ? -xOffset : xOffset}px)` }}
      >
        {children}
      </div>
    </div>
  );
};