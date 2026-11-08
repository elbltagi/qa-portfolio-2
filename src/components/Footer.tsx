import React from 'react';
import { ArrowUp, ExternalLink, ShieldCheck } from 'lucide-react';
import { Link } from '../lib/router';
import { chapters, detailPages } from '../lib/chapters';
import type { ProjectMeta } from '../types';

interface FooterProps {
  meta: ProjectMeta;
}

export const Footer: React.FC<FooterProps> = ({ meta }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-ink text-canvas-surface pt-20 pb-12 border-t border-charcoal-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        {/* Top Editorial Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-charcoal-800">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-tech tracking-widest uppercase text-accent block">
              Test Execution Report • Delivered {meta.reportDate}
            </span>
            <h2 className="text-4xl sm:text-5xl font-display font-extrabold uppercase tracking-tight text-canvas-surface">
              The Quality Journey
            </h2>
            <p className="text-charcoal-400 text-sm leading-relaxed font-light">
Digital Egypt Pioneers Initiative (DEPI) Software Testing Track graduation project. The {meta.team} tested Practice Software Testing — Toolshop and reported the result, including the coverage the run did not achieve.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href={meta.liveAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-charcoal-900 border border-charcoal-700 text-xs font-semibold text-white hover:bg-accent hover:border-accent transition-colors shadow-xs"
            >
              <span className="text-white">Visit the Toolshop</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-canvas-surface text-ink text-xs font-semibold hover:bg-accent hover:text-white transition-colors"
            >
              <span>Return to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Site navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 pb-12 border-b border-charcoal-800">
          <div>
            <span className="uppercase text-canvas-surface font-bold tracking-wider text-xs font-tech block mb-4">
              The Exhibition
            </span>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {chapters.map((chapter) => (
                <li key={chapter.id}>
                  <a
                    href={`#${chapter.id}`}
                    className="group inline-flex items-baseline gap-2 text-xs text-charcoal-400 hover:text-white transition-colors"
                  >
                    <span className="font-tech text-[10px] text-charcoal-500 group-hover:text-accent transition-colors">
                      {chapter.index}
                    </span>
                    <span>{chapter.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="uppercase text-canvas-surface font-bold tracking-wider text-xs font-tech block mb-4">
              The Work in Detail
            </span>
            <ul className="space-y-2">
              {detailPages.map((page) => (
                <li key={page.path}>
                  <Link
                    to={page.path}
                    className="group inline-flex items-baseline gap-2 text-xs text-charcoal-400 hover:text-white transition-colors"
                  >
                    <span className="font-tech text-[10px] text-charcoal-500 group-hover:text-accent transition-colors">
                      {page.index}
                    </span>
                    <span>{page.title}</span>
                    <span className="font-tech text-[10px] text-charcoal-600 tabular-nums">
                      {page.figure}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Attribution & Metadata Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-tech text-charcoal-400">
          <div className="space-y-2">
            <span className="uppercase text-canvas-surface font-bold tracking-wider block">Initiative & Track</span>
            <p>{meta.initiative}</p>
            <p>{meta.track}</p>
            <p>Cohort 2026</p>
          </div>

          <div className="space-y-2">
            <span className="uppercase text-canvas-surface font-bold tracking-wider block">Academic Scope</span>
            <p>Target: Practice Software Testing — Toolshop</p>
            <p>Reported: {meta.reportDate}</p>
            <p>Stage: {meta.status}</p>
          </div>

          <div className="space-y-2">
            <span className="uppercase text-canvas-surface font-bold tracking-wider block">Methodology</span>
            <p>Black-box Testing & Boundary Analysis</p>
            <p>Equivalence Partitioning & Decision Tables</p>
            <p>Automated Regression Flow Foundations</p>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-charcoal-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-tech text-charcoal-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>
Every figure on this site is read from the delivered test workbooks and reports. Nothing is estimated.
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>DEPI Software Testing Team • 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
