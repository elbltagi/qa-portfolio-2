import React, { useRef } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Drift in pixels across the full pass through the viewport. Positive
   * values lag behind the scroll; negative values run ahead of it.
   */
  distance?: number;
  /** Softens the motion so it never feels mechanically tied to the wheel. */
  damped?: boolean;
}

/**
 * Moves its children slightly against the scroll as the element crosses the
 * viewport. Used on secondary columns and decorative layers so sections gain
 * depth without anything appearing to detach.
 *
 * Does nothing when the visitor asks for reduced motion.
 */
export const Parallax: React.FC<ParallaxProps> = ({
  children,
  className,
  distance = 40,
  damped = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const raw = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const smoothed = useSpring(raw, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.5,
  });

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: damped ? smoothed : raw }}
    >
      {children}
    </motion.div>
  );
};

interface ScrollLineProps {
  className?: string;
  tone?: 'light' | 'dark';
}

/**
 * A rule that draws itself from left to right as the section scrolls past —
 * a quiet scroll-linked accent under each chapter header.
 */
export const ScrollLine: React.FC<ScrollLineProps> = ({
  className = '',
  tone = 'light',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90%', 'start 40%'],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  return (
    <div
      ref={ref}
      className={`h-px w-full overflow-hidden ${
        tone === 'dark' ? 'bg-white/10' : 'bg-ink/10'
      } ${className}`}
    >
      <motion.div
        className="h-full w-full bg-accent origin-left"
        style={{ scaleX: reduceMotion ? 1 : scaleX }}
      />
    </div>
  );
};
