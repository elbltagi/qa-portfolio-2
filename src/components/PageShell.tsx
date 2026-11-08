import React from 'react';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { Link } from '../lib/router';
import { detailPages } from '../lib/chapters';
import type { DetailPage } from '../lib/chapters';
import { Reveal } from './Reveal';
import { BlurTextReveal } from './BlurTextReveal';

interface PageShellProps {
  page: DetailPage;
  children: React.ReactNode;
}

/**
 * Shared chrome for every detail page: breadcrumb back to the home page, a
 * full-width title block, and prev/next links so the four pages read as one
 * set rather than four dead ends.
 */
export const PageShell: React.FC<PageShellProps> = ({ page, children }) => {
  const position = detailPages.findIndex((p) => p.path === page.path);
  const previous = position > 0 ? detailPages[position - 1] : null;
  const next =
    position >= 0 && position < detailPages.length - 1
      ? detailPages[position + 1]
      : null;

  return (
    <>
      {/* Title block */}
      <header className="bg-canvas bg-canvas-texture border-b border-canvas-border pt-[86px] sm:pt-[96px] pb-8 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <Reveal>
            {/* A bare anchor returns to the home page and scrolls to Explore. */}
            <Link
              to="#explore"
              className="inline-flex min-h-[44px] items-center gap-2 font-tech text-[11px] uppercase tracking-widest text-ink-subtle hover:text-accent transition-colors mb-3 -mt-2 sm:mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to the exhibition</span>
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-tech text-[11px] tracking-ultra uppercase text-accent">
                {page.index}
              </span>
              <span className="h-px w-10 bg-ink/15" />
              <span className="font-tech text-[11px] tracking-widest uppercase text-ink-subtle">
                {page.eyebrow}
              </span>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-end">
            <BlurTextReveal
              as="h1"
              text={page.title}
              accentSuffix="."
              delay={0.1}
              distance={32}
              blur={16}
              className="lg:col-span-7 text-fluid-page-title font-display font-black uppercase tracking-tighter text-ink leading-[1.02]"
            />

            <Reveal className="lg:col-span-5 lg:pb-2" delay={0.16}>
              <p className="text-fluid-body text-ink-muted font-light leading-relaxed max-w-xl">
                {page.blurb}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-5 pt-5 border-t border-canvas-border">
                <div>
                  <span className="block font-display font-black text-2xl text-ink tabular-nums">
                    {page.figure}
                  </span>
                  <span className="block font-tech text-[10px] sm:text-[9px] uppercase tracking-wider text-ink-subtle">
                    {page.figureLabel}
                  </span>
                </div>
                {page.stats.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <span className="block font-display font-bold text-lg text-ink-muted truncate">
                      {stat.value}
                    </span>
                    <span className="block font-tech text-[10px] sm:text-[9px] uppercase tracking-wider text-ink-ghost">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Prev / next */}
      <nav
        aria-label="Detail page navigation"
        className="bg-canvas border-t border-canvas-border"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="sm:justify-self-start w-full sm:w-auto">
            {previous && (
              <Link
                to={previous.path}
                className="group flex min-h-[44px] items-center gap-3 text-left"
              >
                <ArrowLeft className="w-4 h-4 text-ink-ghost group-hover:text-accent group-hover:-translate-x-1 transition-all shrink-0" />
                <span className="min-w-0">
                  <span className="block font-tech text-[10px] sm:text-[9px] uppercase tracking-widest text-ink-ghost">
                    Previous
                  </span>
                  <span className="block font-display font-bold text-sm text-ink group-hover:text-accent transition-colors truncate">
                    {previous.title}
                  </span>
                </span>
              </Link>
            )}
          </div>

          <Link
            to="/"
            className="sm:justify-self-center inline-flex min-h-[44px] items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-canvas-border text-ink text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>

          <div className="sm:justify-self-end w-full sm:w-auto">
            {next && (
              <Link
                to={next.path}
                className="group flex min-h-[44px] items-center gap-3 sm:text-right sm:flex-row-reverse"
              >
                <ArrowRight className="w-4 h-4 text-ink-ghost group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                <span className="min-w-0">
                  <span className="block font-tech text-[10px] sm:text-[9px] uppercase tracking-widest text-ink-ghost">
                    Next
                  </span>
                  <span className="block font-display font-bold text-sm text-ink group-hover:text-accent transition-colors truncate">
                    {next.title}
                  </span>
                </span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
