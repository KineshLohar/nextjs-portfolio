"use client";

import { useRef, ReactNode, useLayoutEffect, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

gsap.registerPlugin(ScrollTrigger);

interface FadeUpProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    yOffset?: number;
    className?: string;
}

export const FadeUp = ({
    children,
    delay = 0.7,
    duration = 0.5,
    yOffset = 50,
    className = ''
}: FadeUpProps) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const animation = useRef<gsap.core.Tween | null>(null);
    const hasAnimated = useRef(false);

    useIsomorphicLayoutEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const ctx = gsap.context(() => {
            animation.current = gsap.fromTo(element,
                { opacity: 0, y: yOffset },
                {
                    opacity: 1,
                    y: 0,
                    delay,
                    duration,
                    ease: "power2.out",
                    paused: true,
                    onComplete: () => { hasAnimated.current = true },
                    onReverseComplete: () => { hasAnimated.current = false }
                }
            );

            ScrollTrigger.create({
                trigger: element,
                start: "top 100%",
                end: "bottom 10%",
                onEnter: () => {
                    if (!hasAnimated.current) {
                        animation.current?.play();
                    }
                },
                onLeaveBack: () => {
                    const rect = element.getBoundingClientRect();
                    if (rect.top > window.innerHeight) {
                        // Reset only when element is completely above viewport
                        animation.current?.progress(0).pause();
                        hasAnimated.current = false;
                    } else {
                        // Smooth reverse when partially visible
                        animation.current?.reverse();
                    }
                },
                onEnterBack: () => {
                    if (hasAnimated.current) {
                        // Restart animation when coming back into view
                        animation.current?.play();
                    }
                }
            });
        }, elementRef);

        return () => ctx.revert();
    }, [delay, duration, yOffset]);

    return (
        <div
            ref={elementRef}
            className={`will-change-transform ${className}`}
            style={{ opacity: 0, transform: `translateY(${yOffset}px)` }}
        >
            {children}
        </div>
    );
};