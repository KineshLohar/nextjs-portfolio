'use client'

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
}

export default function FadeUp({ children, delay = 0 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, {
    once: true, // Trigger only once
    margin: '-50px 0px', // Start animation 50px before element enters view
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [inView, controls]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: { 
            opacity: 1, 
            y: 0,
            transition: {
              duration: 0.6,
              delay,
              ease: [0.16, 0.77, 0.47, 0.97]
            }
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}