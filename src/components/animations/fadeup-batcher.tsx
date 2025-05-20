"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FadeUpBatcher() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".fade-up");

    const triggers: ScrollTrigger[] = [];

    elements.forEach((el) => {
      const delay = parseFloat(el.dataset.fadeDelay || "0.4");
      const duration = parseFloat(el.dataset.fadeDuration || "0.3");
      const yOffset = parseFloat(el.dataset.fadeYOffset || "40");

      // Set initial state
      gsap.set(el, {
        opacity: 0,
        y: yOffset,
        willChange: "transform, opacity"
      });

      const tween = gsap.fromTo(
        el,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          delay,
          duration,
          ease: "power2.out",
          paused: true
        }
      );

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 100%",
        end: "bottom 10%",
        onEnter: () => tween.play(),
        onLeaveBack: () => {
          const rect = el.getBoundingClientRect();
          if (rect.top > window.innerHeight) {
            tween.progress(0).pause(); // reset if fully out of view
          } else {
            tween.reverse(); // smoothly reverse
          }
        },
        onEnterBack: () => tween.play()
      });

      triggers.push(trigger);
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}
