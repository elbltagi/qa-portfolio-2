import { useEffect, useRef } from 'react';

/**
 * Runs `measure` once on mount and then on every scroll and resize, throttled
 * to roughly one frame.
 *
 * Deliberately avoids requestAnimationFrame: browsers suspend rAF in
 * background, hidden or throttled tabs, which leaves anything derived from it
 * frozen at its last value until a real repaint happens. A timestamp throttle
 * keeps the same cadence without that failure mode.
 *
 * `measure` is held in a ref, so callers do not need to memoise it.
 */
export function useScrollMeasure(measure: () => void) {
  const latest = useRef(measure);
  latest.current = measure;

  useEffect(() => {
    let lastRun = 0;
    let timer: number | undefined;

    const run = () => {
      lastRun = Date.now();
      latest.current();
    };

    const onScroll = () => {
      const elapsed = Date.now() - lastRun;
      if (elapsed >= 16) {
        run();
        return;
      }
      if (timer === undefined) {
        timer = window.setTimeout(() => {
          timer = undefined;
          run();
        }, 16 - elapsed);
      }
    };

    run();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      if (timer !== undefined) window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
}
