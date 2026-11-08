import { useState } from 'react';
import { chapters } from '../lib/chapters';
import { useScrollMeasure } from './useScrollMeasure';

/**
 * Tracks which chapter is currently under the reading line, plus how far
 * through the document the visitor has scrolled (0 → 1).
 */
export function useActiveChapter() {
  const [activeId, setActiveId] = useState<string>(chapters[0].id);
  const [progress, setProgress] = useState<number>(0);

  useScrollMeasure(() => {
    const scrollTop = window.scrollY;
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;
    setProgress(scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0);

    // The reading line sits a third of the way down the viewport.
    const readingLine = scrollTop + window.innerHeight * 0.33;

    let current = chapters[0].id;
    for (const chapter of chapters) {
      const el = document.getElementById(chapter.id);
      if (el && el.offsetTop <= readingLine) {
        current = chapter.id;
      }
    }
    setActiveId(current);
  });

  return { activeId, progress };
}
