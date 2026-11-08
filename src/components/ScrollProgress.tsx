import React from 'react';

interface ScrollProgressProps {
  /** Document scroll position, 0 → 1. */
  progress: number;
}

/**
 * Hairline reading-progress bar pinned to the very top of the viewport.
 */
export const ScrollProgress: React.FC<ScrollProgressProps> = ({ progress }) => (
  <div
    aria-hidden="true"
    className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none"
  >
    <div
      className="h-full bg-accent origin-left transition-transform duration-150 ease-out"
      style={{ transform: `scaleX(${progress})`, width: '100%' }}
    />
  </div>
);
