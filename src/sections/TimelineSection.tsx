import React, { useState, useRef } from 'react';
import { Calendar, ChevronDown, PackageCheck } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { TestingPhase } from '../types';

interface TimelineSectionProps {
  phases: TestingPhase[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ phases }) => {
  const [expandedWeek, setExpandedWeek] = useState<string>('week-1');

  const sectionRef = useRef<HTMLElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const weekCardsRef = useRef<HTMLDivElement[]>([]);

  weekCardsRef.current = [];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Scrubbed vertical growing line
        if (progressBarRef.current && timelineTrackRef.current) {
          gsap.fromTo(
            progressBarRef.current,
            { scaleY: 0, transformOrigin: 'top center' },
            {
              scaleY: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: timelineTrackRef.current,
                start: 'top 75%',
                end: 'bottom 85%',
                scrub: 0.5,
              },
            }
          );
        }

        // 2. Animate each week row once on entrance
        weekCardsRef.current.forEach((card) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                once: true,
              },
            }
          );
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        if (progressBarRef.current) gsap.set(progressBarRef.current, { scaleY: 1 });
        weekCardsRef.current.forEach((card) => {
          if (card) gsap.set(card, { opacity: 1, y: 0 });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="timeline"
      className="section-padding bg-canvas-muted/40 border-b border-canvas-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
              08 / Project Schedule
            </span>
            <h2 className="text-fluid-section-title font-display font-black text-ink uppercase">
              Testing Timeline<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-0.5">
            <span className="text-xl sm:text-2xl font-display font-bold text-accent">
              9 Weeks Total
            </span>
            <span className="text-[11px] font-tech uppercase text-ink-subtle tracking-wider">
              One Cohesive Quality Journey
            </span>
          </div>
        </div>

        {/* Planning Horizon Banner */}
        <div className="my-7 sm:my-8 p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-subtle text-accent flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-display font-bold text-ink">
                Proposed 9-Week Execution Horizon
              </h4>
              <p className="text-xs text-ink-muted">
                This schedule outlines our planned progression from initial exploratory scope to final graduation defense.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-canvas-muted text-ink text-xs font-tech shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Current Stage: Week 1 (Planning / Proposal)</span>
          </div>
        </div>

        {/* Timeline Interactive Stack with vertical animated track */}
        <div ref={timelineTrackRef} className="relative space-y-4 pt-4 pl-4 sm:pl-8">
          {/* Vertical progress track on desktop/tablet */}
          <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-canvas-border rounded-full hidden sm:block">
            <div
              ref={progressBarRef}
              className="w-full h-full bg-accent rounded-full origin-top"
            />
          </div>

          {phases.map((phase, index) => {
            const isExpanded = expandedWeek === phase.id;
            const isCurrent = phase.isCurrent;

            return (
              <div
                key={phase.id}
                ref={(el) => {
                  if (el) weekCardsRef.current[index] = el;
                }}
                className={`rounded-3xl transition-all duration-300 border relative overflow-hidden ${
                  isExpanded
                    ? 'bg-canvas-surface border-accent ring-1 ring-accent/30 shadow-md'
                    : isCurrent
                    ? 'bg-canvas-surface border-canvas-border hover:border-accent/40 shadow-xs'
                    : 'bg-canvas-surface/90 border-canvas-border hover:border-canvas-muted shadow-xs'
                }`}
              >
                {/* Woonpact-style Header clickable bar with oversized week number */}
                <button
                  type="button"
                  onClick={() => setExpandedWeek(isExpanded ? '' : phase.id)}
                  className="w-full p-5 sm:p-7 text-left flex items-center justify-between gap-4 focus:outline-hidden group"
                >
                  <div className="flex items-center gap-4 sm:gap-8">
                    {/* Oversized Week Numeral (Woonpact-inspired) */}
                    <div className="flex items-baseline gap-1 shrink-0">
                      <span
                        className={`font-display font-black text-3xl sm:text-4xl lg:text-5xl tracking-tighter transition-colors ${
                          isExpanded
                            ? 'text-accent'
                            : isCurrent
                            ? 'text-ink'
                            : 'text-ink-ghost group-hover:text-ink'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <span className="text-[10px] font-tech text-ink-subtle uppercase">
                        WK
                      </span>
                    </div>

                    {/* Phase title & subtitle */}
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-tech text-xs uppercase text-accent font-bold">
                          {phase.phaseNumber}
                        </span>
                        <span className="text-ink-ghost">•</span>
                        <h3 className="text-base sm:text-xl font-display font-bold text-ink group-hover:text-accent transition-colors">
                          {phase.title}
                        </h3>
                        {isCurrent && (
                          <span className="text-[10px] font-tech uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-subtle font-tech mt-1 hidden sm:block">
                        Status: <span className="text-ink font-medium">{phase.status}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-tech text-ink-ghost hidden md:inline-block">
                      {phase.keyActivities.length} Planned Activities
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isExpanded
                          ? 'rotate-180 bg-accent text-white shadow-xs'
                          : 'bg-canvas-muted text-ink group-hover:bg-canvas-border'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Expanded Details Panel */}
                {isExpanded && (
                  <div className="px-5 pb-7 sm:px-8 sm:pb-8 pt-3 border-t border-canvas-border grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
                    <div className="lg:col-span-7 space-y-4">
                      <div>
                        <span className="text-xs font-tech uppercase text-ink-subtle tracking-wider font-semibold block mb-1">
                          Phase Description & Scope
                        </span>
                        <p className="text-sm text-ink-muted leading-relaxed font-light">
                          {phase.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-tech uppercase text-ink-subtle tracking-wider font-semibold block">
                          Key Planned Activities:
                        </span>
                        <ul className="space-y-2">
                          {phase.keyActivities.map((act, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-xs text-ink">
                              <span className="text-accent font-bold shrink-0">↳</span>
                              <span className="leading-relaxed">{act}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-canvas-muted/50 border border-canvas-border space-y-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-tech text-accent font-bold uppercase mb-1.5">
                          <PackageCheck className="w-4 h-4" />
                          <span>Planned Deliverables</span>
                        </div>
                        <p className="text-xs text-ink font-medium leading-relaxed">
                          {phase.plannedDeliverables}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-canvas-border flex items-center justify-between text-[11px] font-tech text-ink-subtle">
                        <span>Milestone Phase 0{index + 1}</span>
                        <span>Stage: {phase.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
