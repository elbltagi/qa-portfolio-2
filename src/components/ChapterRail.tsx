import React, { useState } from 'react';
import { chapters } from '../lib/chapters';
import { useScrollMeasure } from '../hooks/useScrollMeasure';

interface ChapterRailProps {
  activeId: string;
}

/**
 * True once the dark footer has reached the middle of the viewport, where the
 * rail sits. The rail retires there rather than trying to stay legible over a
 * section that is not a chapter at all.
 */
function useFooterReached() {
  const [reached, setReached] = useState(false);

  useScrollMeasure(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    setReached(footer.getBoundingClientRect().top <= window.innerHeight / 2);
  });

  return reached;
}

/**
 * Fixed vertical index on the right edge of wide screens. Each chapter is a
 * tick that grows and labels itself on hover, so eight chapters stay
 * navigable without crowding the top bar.
 *
 * The rail floats over whatever section is on screen, so it reads that
 * section's tone and flips to light-on-dark rather than disappearing into an
 * inverted background.
 */
export const ChapterRail: React.FC<ChapterRailProps> = ({ activeId }) => {
  const activeChapter = chapters.find((chapter) => chapter.id === activeId);
  const onDark = activeChapter?.tone === 'dark';
  const atFooter = useFooterReached();

  return (
    <nav
      aria-label="Chapter index"
      aria-hidden={atFooter}
      className={`hidden xl:flex fixed right-5 2xl:right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-2.5 transition-opacity duration-300 ${
        atFooter ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {chapters.map((chapter) => {
        const isActive = activeId === chapter.id;

        return (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-current={isActive ? 'true' : undefined}
            className="group flex items-center justify-end gap-2.5 py-0.5 focus:outline-none"
          >
            <span
              className={`font-tech text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? 'opacity-100 text-accent translate-x-0'
                  : `opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 ${
                      onDark ? 'text-white/80' : 'text-ink-muted'
                    }`
              }`}
            >
              <span
                className={`mr-1 ${onDark ? 'text-white/40' : 'text-ink-ghost'}`}
              >
                {chapter.index}
              </span>
              {chapter.short}
            </span>

            <span
              className={`block h-px rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-7 bg-accent'
                  : onDark
                  ? 'w-3.5 bg-white/30 group-hover:w-5 group-hover:bg-white/60'
                  : 'w-3.5 bg-ink/25 group-hover:w-5 group-hover:bg-ink/50'
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
};
