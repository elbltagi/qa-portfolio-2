import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

/** The project's cobalt accent — the colour each word is tinted before it lands. */
const ACCENT = '#315BFA';
const INK = '#181818';
const WHITE = '#FFFFFF';

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

interface BlurTextRevealProps {
  /** Plain text; it is split on spaces so each word animates in turn. */
  text: string;
  as?: Tag;
  className?: string;
  /** Picks the colour the words settle on. */
  tone?: 'light' | 'dark';
  /** Overrides the settled colour outright. */
  color?: string;
  /** Colour the words carry while they are still blurred. */
  tint?: string;
  /** A trailing character that keeps the accent colour, e.g. the full stop. */
  accentSuffix?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Starting blur radius in pixels. */
  blur?: number;
  /** Starting vertical offset in pixels. */
  distance?: number;
  once?: boolean;
}

/**
 * Word-by-word entrance: each word starts offset, blurred and tinted cobalt,
 * then slides up, sharpens and settles into its final colour. Collapses to a
 * plain fade when the visitor asks for reduced motion.
 */
export const BlurTextReveal: React.FC<BlurTextRevealProps> = ({
  text,
  as = 'span',
  className,
  tone = 'light',
  color,
  tint = ACCENT,
  accentSuffix,
  delay = 0,
  stagger = 0.06,
  duration = 0.8,
  blur = 14,
  distance = 26,
  once = true,
}) => {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  const settled = color ?? (tone === 'dark' ? WHITE : INK);
  const words = text.split(' ').filter(Boolean);

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: reduceMotion ? 0 : delay,
      },
    },
  };

  const word: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: distance,
          filter: `blur(${blur}px)`,
          color: tint,
        },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      color: settled,
      transition: {
        duration: reduceMotion ? 0.2 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  // The suffix never leaves the accent colour — it only sharpens into place.
  const suffix: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: distance, filter: `blur(${blur}px)` },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: reduceMotion ? 0.2 : duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 'some' }}
      variants={container}
    >
      {words.map((value, index) => (
        <React.Fragment key={`${value}-${index}`}>
          <motion.span
            className="inline-block will-change-[filter,transform,opacity]"
            variants={word}
          >
            {value}
          </motion.span>
          {index < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}

      {accentSuffix ? (
        <motion.span
          className="inline-block text-accent will-change-[filter,transform,opacity]"
          variants={suffix}
        >
          {accentSuffix}
        </motion.span>
      ) : null}
    </MotionTag>
  );
};
