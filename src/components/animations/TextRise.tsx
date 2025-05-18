'use client'

import { useInView, motion, useAnimation } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface TextRiseProps {
  children: React.ReactNode
}

export default function TextRise({
  children,
}: TextRiseProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    once: true
  })

  const mainControls = useAnimation();

  useEffect(() => {
    if(inView){
      mainControls.start("visible")
    }
  },[inView])

  return (
    <div ref={ref} className="relative overflow-hidden w-full">
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 }
        }}
        initial='hidden'
        animate={mainControls}
        transition={{ duration: 0.8, delay: 0.3}}
      >
        {children}
      </motion.div>
    </div>
  )
}
