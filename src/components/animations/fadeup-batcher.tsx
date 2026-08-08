// src/components/animations/fadeup-batcher.tsx

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FadeUpBatcher() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = gsap.utils.toArray<HTMLElement>(".fade-up");

    if (elements.length === 0) {
      return;
    }

    const tweens: gsap.core.Tween[] = [];
    const triggers: ScrollTrigger[] = [];

    elements.forEach((element) => {
      const delay = Number(element.dataset.fadeDelay ?? 0);
      const duration = Number(element.dataset.fadeDuration ?? 0.5);
      const yOffset = Number(element.dataset.fadeYOffset ?? 50);

      const tween = gsap.fromTo(
        element,
        {
          opacity: 0,
          y: yOffset,
        },
        {
          opacity: 1,
          y: 0,
          delay,
          duration,
          ease: "power2.out",
          paused: true,
          overwrite: "auto",
        }
      );

      const trigger = ScrollTrigger.create({
        trigger: element,
        start: "top 100%",
        end: "bottom 10%",

        onEnter: () => {
          tween.play();
        },

        onEnterBack: () => {
          tween.play();
        },

        onLeaveBack: () => {
          tween.reverse();
        },
      });

      tweens.push(tween);
      triggers.push(trigger);
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((trigger) => trigger.kill());
      tweens.forEach((tween) => tween.kill());

      gsap.killTweensOf(elements);

      elements.forEach((element) => {
        gsap.set(element, {
          clearProps: "all",
        });
      });
    };
  }, [pathname]);

  return null;
}


// // src/components/animations/fadeup-batcher.tsx
// "use client";

// import { useEffect, useRef } from "react";
// import { usePathname } from "next/navigation";
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";

// gsap.registerPlugin(ScrollTrigger);

// export default function FadeUpBatcher() {
//   const pathname = usePathname();
//   const initializedRef = useRef<Set<HTMLElement>>(new Set());

//   useEffect(() => {
//     const initializeAnimations = () => {
//       document.querySelectorAll<HTMLElement>(".fade-up").forEach((el) => {
//         if (initializedRef.current.has(el)) return;
//         initializedRef.current.add(el);

//         const delay    = parseFloat(el.dataset.fadeDelay    ?? "0");
//         const duration = parseFloat(el.dataset.fadeDuration ?? "0.5");
//         const yOffset  = parseFloat(el.dataset.fadeYOffset  ?? "50");

//         // Initial CSS
//         gsap.set(el, {
//           opacity: 0,
//           y: yOffset,
//           willChange: "transform, opacity",
//         });

//         // Build the tween (paused)
//         const tween = gsap.fromTo(
//           el,
//           { opacity: 0, y: yOffset },
//           {
//             opacity: 1,
//             y: 0,
//             delay,
//             duration,
//             ease: "power2.out",
//             paused: true,
//           }
//         );

//         // Create ScrollTrigger
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top 100%",
//           end: "bottom 10%",
//           onEnter:      () => tween.play(),
//           onLeaveBack:  () => tween.reverse(),
//           onEnterBack:  () => tween.play(),
//         });
//       });
//     };

//     // Schedule initialization during idle or next tick
//     let handleId: number;
//     if (typeof window.requestIdleCallback === "function") {
//       handleId = window.requestIdleCallback(initializeAnimations, { timeout: 200 });
//     } else {
//       handleId = window.setTimeout(initializeAnimations, 200);
//     }

//     return () => {
//       // Cleanup triggers for any elements that were removed
//       initializedRef.current.forEach((el) => {
//         if (!document.body.contains(el)) {
//           ScrollTrigger.getAll()
//             .filter((st) => st.trigger === el)
//             .forEach((st) => st.kill());
//           initializedRef.current.delete(el);
//         }
//       });

//       // Cancel the idle callback or timeout
//       if (typeof window.cancelIdleCallback === "function") {
//         window.cancelIdleCallback(handleId);
//       } else {
//         clearTimeout(handleId);
//       }
//     };
//   }, [pathname]); // rerun when route changes

//   return null;
// }
