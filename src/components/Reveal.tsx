import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: Direction;
  once?: boolean;
  as?: 'div' | 'section' | 'span' | 'li';
}

const offsetFor = (direction: Direction, distance: number) => {
  switch (direction) {
    case 'up':
      return { y: distance };
    case 'down':
      return { y: -distance };
    case 'left':
      return { x: distance };
    case 'right':
      return { x: -distance };
    default:
      return {};
  }
};

/**
 * Scroll-triggered entrance used across every section so the whole page shares
 * one motion language. Collapses to a plain fade when the visitor asks for
 * reduced motion.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.65,
  distance = 24,
  direction = 'up',
  once = true,
  as = 'div',
}) => {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, ...offsetFor(direction, distance) };

  return (
    <MotionTag
      className={className}
      initial={hidden}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      // `amount: 'some'` fires as soon as any part is on screen, so content
      // still appears on short viewports and on elements taller than the fold.
      viewport={{ once, amount: 'some' }}
      transition={{
        duration: reduceMotion ? 0.2 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </MotionTag>
  );
};

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  step?: number;
  delay?: number;
}

/**
 * Wraps a list so each direct <StaggerItem> child enters in sequence.
 */
export const Stagger: React.FC<StaggerProps> = ({
  children,
  className,
  step = 0.07,
  delay = 0,
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 'some' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : step,
            delayChildren: reduceMotion ? 0 : delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export const staggerItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <motion.div className={className} variants={staggerItemVariants}>
    {children}
  </motion.div>
);
