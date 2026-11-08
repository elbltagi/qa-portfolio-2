import React, { useCallback, useEffect, useState } from 'react';

/**
 * A minimal hash router, deliberately dependency-free.
 *
 * Routes live under `#/…` (`#/stories`), while a bare `#section` stays an
 * ordinary in-page anchor on the home page. That split lets the home page
 * keep native anchor scrolling while detail pages get real, shareable URLs
 * that survive a refresh on any static host — GitHub Pages included.
 */

export interface RouteState {
  /** Always starts with "/". "/" means the home page. */
  path: string;
  /** Element id to scroll to, when the hash is an anchor rather than a route. */
  anchor: string | null;
}

function readHash(): RouteState {
  const raw = window.location.hash.replace(/^#/, '');

  if (raw.startsWith('/')) {
    // A route may carry its own anchor, as in "/#explore" or "/stories#top".
    const [rawPath, rawAnchor] = raw.split('#');
    // Strip any trailing slash so "/stories/" and "/stories" match.
    const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : '/';
    return { path, anchor: rawAnchor || null };
  }

  return { path: '/', anchor: raw || null };
}

export function useRoute(): RouteState {
  const [route, setRoute] = useState<RouteState>(readHash);

  useEffect(() => {
    const onHashChange = () => setRoute(readHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Landing on a route scrolls to the top; landing on an anchor scrolls to it
  // once React has had a chance to paint the target.
  useEffect(() => {
    if (route.anchor) {
      const frame = window.requestAnimationFrame(() => {
        document
          .getElementById(route.anchor as string)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return () => window.cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: 'auto' });
    return undefined;
  }, [route.path, route.anchor]);

  return route;
}

export function navigate(to: string) {
  const next = to.startsWith('#') ? to : `#${to}`;
  if (window.location.hash === next) return;
  window.location.hash = next;
}

interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string;
  children: React.ReactNode;
}

/** Anchor that navigates within the app. `to` is a route ("/stories") or an anchor ("#team"). */
export const Link: React.FC<LinkProps> = ({ to, children, onClick, ...rest }) => {
  const href = to.startsWith('#') ? to : `#${to}`;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      // Re-navigating to the hash we are already on fires no hashchange, so
      // nudge the page back to the top ourselves.
      if (!event.defaultPrevented && window.location.hash === href) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [href, onClick]
  );

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
};
