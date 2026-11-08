import React, { useEffect, useRef, useState } from 'react';
import { onBooted } from './../lib/boot';

/**
 * A dot that tracks the pointer exactly, inside a ring that trails behind it.
 *
 * Both are painted white and composited with mix-blend-mode: difference, so
 * the cursor inverts whatever is under it. That is what keeps it readable on
 * the cream page, the dark Explore section and the footer without the
 * component needing to know which section the pointer happens to be over.
 *
 * It replaces the native cursor, so it only ever runs where a native cursor
 * exists: a fine pointer, and only once the boot curtain has lifted. Hiding
 * the real cursor any earlier would leave the visitor with no pointer at all
 * for the length of the load.
 */

/** Anything that should make the ring open up as the pointer arrives. */
const INTERACTIVE =
  'a, button, summary, label, select, [role="button"], [role="tab"], [data-cursor="hover"]';

/** Where a precise caret matters more than the effect. */
const TEXT_INPUT = 'input, textarea, [contenteditable="true"]';

const RING_REST = 34;
const DOT_REST = 6;

export const Cursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  // Decide whether this visitor should get a custom cursor at all, and wait
  // for the curtain before taking the native one away.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const fine = window.matchMedia('(pointer: fine)');
    let stop = () => {};

    // Re-evaluated on change, not just at mount: a tablet whose keyboard is
    // attached or removed switches pointer type under a live page.
    const sync = () => {
      stop();
      stop = () => {};
      if (fine.matches) stop = onBooted(() => setActive(true));
      else setActive(false);
    };

    sync();
    fine.addEventListener('change', sync);

    // A hybrid device that starts on a mouse and moves to touch.
    const onTouch = () => setActive(false);
    window.addEventListener('touchstart', onTouch, { once: true, passive: true });

    return () => {
      stop();
      fine.removeEventListener('change', sync);
      window.removeEventListener('touchstart', onTouch);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const root = document.documentElement;
    root.classList.add('custom-cursor');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // With reduced motion the ring simply sits on the pointer: the trailing
    // lag is the part that constitutes motion here.
    const ringEase = reduce ? 1 : 0.18;
    const dotEase = reduce ? 1 : 0.45;
    const scaleEase = reduce ? 1 : 0.2;

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let dotX = pointerX;
    let dotY = pointerY;
    let ringX = pointerX;
    let ringY = pointerY;

    let targetScale = 1;
    let scale = 1;
    let seen = false;
    let frame = 0;

    const show = () => {
      if (seen) return;
      seen = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!seen) {
        // Place it where the pointer already is rather than flying in from
        // the middle of the screen on the first movement.
        dotX = ringX = pointerX;
        dotY = ringY = pointerY;
        show();
      }
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target || typeof target.closest !== 'function') return;
      if (target.closest(TEXT_INPUT)) {
        targetScale = 0.4;
        return;
      }
      targetScale = target.closest(INTERACTIVE) ? 1.75 : 1;
    };

    const onDown = () => {
      targetScale = 0.8;
    };
    const onUp = (event: PointerEvent) => onOver(event);

    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
      seen = false;
    };

    const tick = () => {
      dotX += (pointerX - dotX) * dotEase;
      dotY += (pointerY - dotY) * dotEase;
      ringX += (pointerX - ringX) * ringEase;
      ringY += (pointerY - ringY) * ringEase;
      scale += (targetScale - scale) * scaleEase;

      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) scale(${scale.toFixed(3)})`;

      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
      <div
        ref={ringRef}
        style={{ width: RING_REST, height: RING_REST, opacity: 0 }}
        className="absolute top-0 left-0 rounded-full border border-white will-change-transform"
      />
      <div
        ref={dotRef}
        style={{ width: DOT_REST, height: DOT_REST, opacity: 0 }}
        className="absolute top-0 left-0 rounded-full bg-white will-change-transform"
      />
    </div>
  );
};
