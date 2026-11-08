/**
 * The app's half of the boot handoff.
 *
 * The boot curtain lives in index.html because it has to paint before this
 * bundle is parsed (see the comment there). This module is the only thing that
 * knows how to talk to it, so no component has to reach for window globals or
 * document attributes directly.
 *
 * Entrance animations that would otherwise play behind the curtain — and be
 * over by the time anyone could see them — wait on `onBooted`.
 */

declare global {
  interface Window {
    /** Set by the curtain script the moment it starts lifting. */
    __qjBooted?: boolean;
    /** Set by main.tsx so the curtain can credit the mount even if it
     *  happened before the curtain's listener was attached. */
    __qjMounted?: boolean;
  }
}

const BOOTED_EVENT = 'app:booted';
const MOUNTED_EVENT = 'app:mounted';

/** True once the curtain has begun to lift, or if it never existed at all. */
export function isBooted(): boolean {
  if (typeof document === 'undefined') return true;
  if (window.__qjBooted) return true;
  // No curtain in the document means nothing is covering the page.
  if (!document.getElementById('boot-curtain')) return true;
  return document.documentElement.hasAttribute('data-booted');
}

/**
 * Calls back when the page becomes visible, immediately if it already is.
 * Returns an unsubscribe function, so it is safe inside an effect.
 */
export function onBooted(run: () => void): () => void {
  if (isBooted()) {
    run();
    return () => {};
  }

  let live = true;
  const handle = () => {
    if (!live) return;
    live = false;
    window.removeEventListener(BOOTED_EVENT, handle);
    run();
  };

  window.addEventListener(BOOTED_EVENT, handle);
  return () => {
    live = false;
    window.removeEventListener(BOOTED_EVENT, handle);
  };
}

/** Tells the curtain the app is up, which advances its progress. */
export function announceMounted(): void {
  if (typeof window === 'undefined') return;
  window.__qjMounted = true;
  try {
    window.dispatchEvent(new CustomEvent(MOUNTED_EVENT));
  } catch {
    // Older event constructors; the curtain also polls __qjMounted.
  }
}
