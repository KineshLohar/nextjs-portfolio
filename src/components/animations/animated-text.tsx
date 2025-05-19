'use client'

import { motion } from 'framer-motion';
import React, { JSX } from 'react';

interface AnimatedTextProps {
  as?: keyof JSX.IntrinsicElements; // This allows you to pass any valid HTML element
  children: React.ReactNode; // Content inside the element (like text or other components)
  animation?: 'fade' | 'rise' | 'slide'; // Type of animation to apply
  className?: string; // Custom className to apply additional styling
  initial?: string; // Initial animation state
  animate?: string; // Final animation state
  transition?: object; // Transition settings for animation
  delay?: number; // Delay for animation start
  variant?: { [key: string]: any }; // Custom animation variants
  href?: string;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  as = 'div', // Default to 'div' element
  children,
  animation = 'fade', // Default to fade animation
  className = '',
  initial = 'hidden',
  animate = 'visible',
  transition = { duration: 0.2, delay: 0 },
  variant,
  href,
}) => {
  // Define animation variants
  const getVariants = () => {
    switch (animation) {
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
      case 'rise':
        return {
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        };
      case 'slide':
        return {
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        };
    }
  };

  const Element = (motion[as as keyof typeof motion] || motion.div) as typeof motion.div;

  return (
    <Element
      className={className}
      variants={variant || getVariants()}
      initial={initial}
      animate={animate}
      transition={transition}
    >
      {children}
    </Element>
  );
};

