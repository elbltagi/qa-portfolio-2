import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Stagger, StaggerItem } from '../components/Reveal';
import { Link } from '../lib/router';
import { detailPages } from '../lib/chapters';
import type { ModuleStory } from '../types';

interface ExploreSectionProps {
  stories: ModuleStory[];
}

/**
 * The home page's index of the detailed reporting: one card per detail page,
 * each leading with its headline figure. The figures come from
 * src/lib/chapters.ts, which computes them from the delivered data.
 */
export const ExploreSection: React.FC<ExploreSectionProps> = ({ stories }) => (
  <section
    id="explore"
    className="section-padding bg-ink text-canvas-surface border-b border-charcoal-800"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <SectionHeading
        index="04"
        eyebrow="The Work in Detail"
        title="Explore the Results"
        tone="dark"
        description={`The reporting behind this run — the ${stories.length} modules and their verdicts, the traceability matrix, the defects, and what the measurements show. Each opens on its own page.`}
      />

      <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-8">
        {detailPages.map((page) => (
          <StaggerItem key={page.path} className="h-full">
            <Link
              to={page.path}
              className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 hover:border-accent/50 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 no-underline"
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <span className="font-tech text-[10px] tracking-ultra uppercase text-white/35">
                  {page.index} / {page.eyebrow}
                </span>
              </div>

              <div className="mb-1">
                <span className="font-display font-black text-4xl sm:text-5xl text-white group-hover:text-accent transition-colors duration-300 tabular-nums">
                  {page.figure}
                </span>
              </div>
              <span className="font-tech text-[10px] uppercase tracking-wider text-accent mb-4 block">
                {page.figureLabel}
              </span>

              <h3 className="font-display font-bold text-xl text-white mb-2 leading-tight">
                {page.title}
              </h3>
              <p className="text-xs text-white/55 leading-relaxed mb-5 flex-1">
                {page.blurb}
              </p>

              <div className="flex flex-wrap gap-x-5 gap-y-2 pb-5 mb-5 border-b border-white/10">
                {page.stats.map((stat) => (
                  <div key={stat.label} className="min-w-0">
                    <span className="block font-display font-bold text-sm text-white/85 truncate">
                      {stat.value}
                    </span>
                    <span className="block font-tech text-[9px] uppercase tracking-wider text-white/35">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <span className="inline-flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-full bg-white/[0.07] text-white text-xs font-semibold group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                <span>Explore {page.short}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  </section>
);
