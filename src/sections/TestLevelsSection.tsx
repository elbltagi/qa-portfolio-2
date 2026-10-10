import React, { useState, useRef } from 'react';
import { Layers, Box, Cpu, Workflow, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { TestLevel } from '../types';

interface TestLevelsSectionProps {
  levels: TestLevel[];
}

export const TestLevelsSection: React.FC<TestLevelsSectionProps> = ({ levels }) => {
  const [activeLevelId, setActiveLevelId] = useState<string>('level-system');

  const activeLevel = levels.find((l) => l.id === activeLevelId) || levels[2];
  const sectionRef = useRef<HTMLElement>(null);
  const layersContainerRef = useRef<HTMLDivElement>(null);
  const detailPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!layersContainerRef.current) return;
        const layerElements = layersContainerRef.current.querySelectorAll('.test-level-layer');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        });

        // Stagger assembly of layers
        tl.fromTo(
          layerElements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );

        if (detailPanelRef.current) {
          tl.fromTo(
            detailPanelRef.current,
            { opacity: 0, x: 20 },
            { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
            "-=0.4"
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set('.test-level-layer', { opacity: 1, y: 0 });
        if (detailPanelRef.current) gsap.set(detailPanelRef.current, { opacity: 1, x: 0 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  const getLevelIcon = (id: string) => {
    switch (id) {
      case 'level-component':
        return <Box className="w-5 h-5 text-accent" />;
      case 'level-integration':
        return <Workflow className="w-5 h-5 text-accent" />;
      case 'level-system':
        return <Cpu className="w-5 h-5 text-accent" />;
      default:
        return <Layers className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="test-levels"
      className="section-padding bg-canvas bg-canvas-texture border-b border-canvas-border"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
              07 / Hierarchy of Verification
            </span>
            <h2 className="text-fluid-section-title font-display font-black text-ink uppercase">
              Test Levels<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="text-ink-muted max-w-md text-sm sm:text-base leading-relaxed font-light">
            Understanding software verification from isolated unit components up to full end-to-end customer workflows.
          </p>
        </div>

        {/* Interactive Layered Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 pt-8 sm:pt-10 items-stretch">
          {/* Left Column: Stacked Layer Diagram */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-tech uppercase text-ink-subtle tracking-wider block mb-2">
              Select Level to Inspect Architecture
            </span>

            <div ref={layersContainerRef} className="space-y-3">
              {levels.slice().reverse().map((lvl) => {
                const isSelected = lvl.id === activeLevelId;
                const isPrimary = lvl.id === 'level-system';

                return (
                  <div
                    key={lvl.id}
                    onClick={() => setActiveLevelId(lvl.id)}
                    className={`test-level-layer group cursor-pointer p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                      isSelected
                        ? 'bg-ink text-canvas-surface border-ink shadow-lg -translate-y-1'
                        : 'bg-canvas-surface border-canvas-border hover:border-canvas-muted text-ink shadow-xs'
                    }`}
                  >
                    {/* Active accent bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-accent rounded-r-full" />
                    )}

                    <div className="flex items-center justify-between gap-3 pl-1">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`p-2.5 rounded-xl ${
                            isSelected ? 'bg-charcoal-800' : 'bg-canvas-muted border border-canvas-border'
                          }`}
                        >
                          {getLevelIcon(lvl.id)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-tech font-bold text-accent">
                              {lvl.shortName}
                            </span>
                            {isPrimary && (
                              <span className="text-[10px] font-tech uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                                Primary Focus
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg sm:text-xl font-display font-bold mt-0.5">
                            {lvl.name}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-tech px-2.5 py-1 rounded-full border hidden sm:inline-block ${
                          isSelected
                            ? 'border-charcoal-700 text-charcoal-300'
                            : 'border-canvas-border text-ink-subtle'
                        }`}
                      >
                        {lvl.tagline}
                      </span>
                    </div>

                    {/* Mobile Inline Expanded Details Accordion */}
                    {isSelected && (
                      <div className="lg:hidden mt-4 pt-4 border-t border-charcoal-800 space-y-3.5 text-xs animate-in fade-in duration-200">
                        <div className="space-y-1">
                          <span className="text-[10px] font-tech uppercase text-charcoal-400 font-semibold tracking-wider">
                            Architectural Definition
                          </span>
                          <p className="text-canvas-surface/90 leading-relaxed font-light">
                            {lvl.description}
                          </p>
                        </div>
                        <div className="p-3.5 rounded-xl bg-charcoal-900 border border-charcoal-800 space-y-1">
                          <span className="text-[10px] font-tech uppercase text-accent font-bold tracking-wider block">
                            Proposed Project Scope
                          </span>
                          <p className="text-canvas-surface/90 leading-relaxed text-[11px]">
                            {lvl.plannedFocus}
                          </p>
                        </div>
                        <div className="p-3 rounded-xl bg-charcoal-900/60 border border-charcoal-800 flex items-start gap-2 text-[11px] text-charcoal-300">
                          <AlertCircle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                          <p className="leading-relaxed">
                            <strong>Access Boundary:</strong> {lvl.accessNotice}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep Explanation Display Panel (Desktop) */}
          <div ref={detailPanelRef} className="hidden lg:block lg:col-span-7">
            <div className="h-full rounded-3xl bg-canvas-surface border border-canvas-border p-7 sm:p-10 lg:p-12 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="border-b border-canvas-border pb-5">
                  <div className="flex items-center gap-2 text-xs font-tech text-accent uppercase font-bold tracking-wider mb-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{activeLevel.shortName} Verification Scope</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                    {activeLevel.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-tech text-ink-subtle uppercase tracking-wider mt-1">
                    Scope: {activeLevel.tagline}
                  </p>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <span className="text-xs font-tech uppercase text-ink-subtle tracking-wider font-semibold">
                    Architectural Definition
                  </span>
                  <p className="text-base sm:text-lg text-ink leading-relaxed font-light">
                    {activeLevel.description}
                  </p>
                </div>

                {/* Planned Focus */}
                <div className="p-5 rounded-2xl bg-canvas-muted/40 border border-canvas-border space-y-1.5">
                  <span className="text-xs font-tech uppercase text-accent font-bold tracking-wider block">
                    Proposed Graduation Project Application
                  </span>
                  <p className="text-sm text-ink leading-relaxed">
                    {activeLevel.plannedFocus}
                  </p>
                </div>

                {/* Boundary / Access Note */}
                <div className="p-4 rounded-xl bg-canvas-muted/70 border border-canvas-border flex items-start gap-3 text-xs text-ink-muted">
                  <AlertCircle className="w-4 h-4 text-ink-ghost shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Access Boundary Clarification:</strong> {activeLevel.accessNotice}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-canvas-border text-xs font-tech text-ink-subtle">
                <span>Methodology Framework: ISTQB Verification Levels</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
