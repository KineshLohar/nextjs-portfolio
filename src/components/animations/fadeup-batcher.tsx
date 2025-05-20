"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FadeUpBatcher() {
  const pathname = usePathname();
  // Keep track of which elements we’ve already initialized
  const initialized = new Set<HTMLElement>();

  useEffect(() => {
    // Schedule initialization during idle time
    const handle = (window.requestIdleCallback ?? window.setTimeout)(() => {
      document.querySelectorAll<HTMLElement>(".fade-up").forEach((el) => {
        if (initialized.has(el)) return;      // skip already-done
        initialized.add(el);

        const delay = parseFloat(el.dataset.fadeDelay || "0");
        const duration = parseFloat(el.dataset.fadeDuration || "0.5");
        const yOffset = parseFloat(el.dataset.fadeYOffset || "50");

        // Set up initial CSS
        gsap.set(el, {
          opacity: 0,
          y: yOffset,
          willChange: "transform, opacity",
        });

        // Create one reusable tween per element:
        const tween = gsap.fromTo(
          el,
          { opacity: 0, y: yOffset },
          {
            opacity: 1,
            y: 0,
            delay,
            duration,
            ease: "power2.out",
            paused: true,
          }
        );

        // Attach a lazy ScrollTrigger:
        ScrollTrigger.create({
          trigger: el,
          start: "top 100%",
          end: "bottom 10%",
          onEnter: () => tween.play(),
          onLeaveBack: () => tween.reverse(),
          onEnterBack: () => tween.play(),
        });
      });
    }, { timeout: 200 });

    return () => {
      // Don’t kill *all* ScrollTriggers! Let existing ones persist.
      // We only remove callbacks for elements that unmounted:
      initialized.forEach((el) => {
        if (!document.body.contains(el)) {
          ScrollTrigger.getAll()
            .filter((st) => st.trigger === el)
            .forEach((st) => st.kill());
          initialized.delete(el);
        }
      });
      window.cancelIdleCallback
        ? window.cancelIdleCallback(handle as number)
        : clearTimeout(handle as number);
    };
  }, [pathname]);

  return null;
}
