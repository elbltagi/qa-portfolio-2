import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, LayoutGrid, X } from 'lucide-react';
import { chapters, detailPages, findDetailPage } from '../lib/chapters';
import { Link } from '../lib/router';

interface NavbarProps {
  targetUrl: string;
  activeId: string;
  /** Date the reporting was delivered, shown as a badge. */
  reportDate: string;
  /** Current route path; "/" on the home page. */
  currentPath: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  targetUrl,
  activeId,
  reportDate,
  currentPath,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);

  const detailPage = findDetailPage(currentPath);
  const isHome = !detailPage;

  const activeChapter =
    chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 35);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the overlay whenever the route changes.
  useEffect(() => setIndexOpen(false), [currentPath]);

  // Lock the page behind the overlay and close it on Escape.
  useEffect(() => {
    document.body.style.overflow = indexOpen ? 'hidden' : '';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndexOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [indexOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-canvas/95 backdrop-blur-md border-b border-canvas-border py-2 sm:py-2.5 shadow-sm'
            : 'bg-canvas/90 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-canvas-border/60 sm:border-transparent py-2.5 sm:py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-2.5 sm:gap-3 shrink-0 focus:outline-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-ink text-canvas-surface flex items-center justify-center font-display font-bold text-xs sm:text-sm tracking-tighter group-hover:bg-accent transition-colors duration-300">
              Q
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-[11px] sm:text-xs tracking-widest uppercase text-ink">
                The Quality Journey
              </span>
              <span className="text-[10px] tracking-wider text-ink-subtle uppercase font-tech">
                Bug Hunters QA / DEPI
              </span>
            </div>
          </Link>

          {/* Position readout: chapter on home, page name on a detail page */}
          <div className="hidden md:flex items-center gap-2.5 min-w-0 flex-1 justify-center">
            <span className="font-tech text-[10px] tracking-ultra uppercase text-accent shrink-0">
              {isHome ? activeChapter.index : detailPage.index}
            </span>
            <span className="h-px w-5 bg-ink/15 shrink-0" />
            <span className="font-tech text-[10px] tracking-widest uppercase text-ink-muted truncate">
              {isHome ? activeChapter.label : detailPage.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <span
              title="Reporting delivered"
              className="hidden lg:inline-flex items-center gap-1.5 font-tech text-[10px] sm:text-[9px] uppercase tracking-wider text-ink-subtle px-2 py-1 rounded-full border border-canvas-border"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {reportDate}
            </span>

            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full bg-ink text-white hover:bg-accent transition-colors tracking-wide shadow-sm"
            >
              <span>Test Store</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={() => setIndexOpen(true)}
              aria-label="Open site index"
              aria-expanded={indexOpen}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 px-3 py-2 rounded-full border border-canvas-border text-ink hover:border-accent hover:text-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline font-tech text-[10px] uppercase tracking-widest">
                Index
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen index */}
      <AnimatePresence>
        {indexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            role="dialog"
            aria-modal="true"
            aria-label="Site index"
            className="fixed inset-0 z-[55] bg-ink/95 backdrop-blur-lg overflow-y-auto"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="flex items-center justify-between mb-8 sm:mb-10">
                <span className="font-tech text-[10px] sm:text-xs tracking-ultra uppercase text-white/45">
                  Site Index
                </span>
                <button
                  type="button"
                  onClick={() => setIndexOpen(false)}
                  aria-label="Close site index"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 xl:gap-x-20 gap-y-10">
                {/* Home chapters */}
                <div>
                  <span className="font-tech text-[10px] uppercase tracking-ultra text-accent block mb-4">
                    The exhibition
                  </span>
                  <nav>
                    {chapters.map((chapter, i) => {
                      const isActive = isHome && chapter.id === activeId;
                      return (
                        <motion.a
                          key={chapter.id}
                          href={`#${chapter.id}`}
                          onClick={() => setIndexOpen(false)}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.025 * i, duration: 0.3 }}
                          className="group flex min-h-[44px] items-baseline gap-4 py-3 sm:py-2.5 border-b border-white/10 hover:border-accent/50 transition-colors"
                        >
                          <span
                            className={`font-tech text-[11px] shrink-0 transition-colors ${
                              isActive
                                ? 'text-accent'
                                : 'text-white/35 group-hover:text-accent'
                            }`}
                          >
                            {chapter.index}
                          </span>
                          <span
                            className={`font-display font-bold text-lg sm:text-xl uppercase tracking-tight transition-all duration-300 group-hover:translate-x-1.5 ${
                              isActive
                                ? 'text-accent'
                                : 'text-white group-hover:text-accent'
                            }`}
                          >
                            {chapter.label}
                          </span>
                          {isActive && (
                            <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-wider text-accent/70 ml-auto shrink-0">
                              Reading
                            </span>
                          )}
                        </motion.a>
                      );
                    })}
                  </nav>
                </div>

                {/* Detail pages */}
                <div>
                  <span className="font-tech text-[10px] uppercase tracking-ultra text-accent block mb-4">
                    The work in detail
                  </span>
                  <nav>
                    {detailPages.map((page, i) => {
                      const isActive = page.path === currentPath;
                      return (
                        <motion.div
                          key={page.path}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.025 * i, duration: 0.3 }}
                        >
                          <Link
                            to={page.path}
                            onClick={() => setIndexOpen(false)}
                            className="group flex min-h-[44px] items-baseline gap-4 py-3 sm:py-2.5 border-b border-white/10 hover:border-accent/50 transition-colors"
                          >
                            <span
                              className={`font-tech text-[11px] shrink-0 transition-colors ${
                                isActive
                                  ? 'text-accent'
                                  : 'text-white/35 group-hover:text-accent'
                              }`}
                            >
                              {page.index}
                            </span>
                            <span
                              className={`font-display font-bold text-lg sm:text-xl uppercase tracking-tight transition-all duration-300 group-hover:translate-x-1.5 ${
                                isActive
                                  ? 'text-accent'
                                  : 'text-white group-hover:text-accent'
                              }`}
                            >
                              {page.title}
                            </span>
                            <span className="font-tech text-[10px] text-white/30 ml-auto shrink-0 tabular-nums">
                              {page.figure}
                            </span>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="font-tech text-[11px] text-white/40">
                  Bug Hunters QA Team · DEPI Software Testing 2026
                </span>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-white text-ink text-xs font-semibold hover:bg-accent hover:text-white transition-colors"
                >
                  <span>Visit the Toolshop</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
