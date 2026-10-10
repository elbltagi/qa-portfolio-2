import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowRight, AlertCircle, FileCheck, Layers, Terminal, Database, Smartphone } from 'lucide-react';
import { gsap } from '../lib/gsap';
import type { TestingType } from '../types';

interface TestingTypesSectionProps {
  types: TestingType[];
}

export const TestingTypesSection: React.FC<TestingTypesSectionProps> = ({ types }) => {
  const [selectedId, setSelectedId] = useState<string>(types[0]?.id || 'type-static');

  const selectedType = types.find((t) => t.id === selectedId) || types[0];

  const detailPanelRef = useRef<HTMLDivElement>(null);
  const badgeNumRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentBlocksRef = useRef<HTMLDivElement>(null);

  // Smooth, stable kinetic transition on type switch
  useEffect(() => {
    if (!detailPanelRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (badgeNumRef.current) {
      tl.fromTo(
        badgeNumRef.current,
        { y: 8, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25 }
      );
    }

    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 },
        "-=0.18"
      );
    }

    if (contentBlocksRef.current) {
      tl.fromTo(
        contentBlocksRef.current.children,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.05 },
        "-=0.2"
      );
    }
  }, [selectedId]);

  const handleSelectType = (id: string) => {
    setSelectedId(id);
    if (window.innerWidth < 1024 && detailPanelRef.current) {
      setTimeout(() => {
        detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  };

  const getIconForType = (id: string) => {
    switch (id) {
      case 'type-static':
        return <FileCheck className="w-5 h-5 text-accent" />;
      case 'type-manual':
        return <Layers className="w-5 h-5 text-accent" />;
      case 'type-api':
        return <Terminal className="w-5 h-5 text-accent" />;
      case 'type-automation':
        return <ShieldCheck className="w-5 h-5 text-accent" />;
      case 'type-database':
        return <Database className="w-5 h-5 text-accent" />;
      case 'type-mobile':
        return <Smartphone className="w-5 h-5 text-accent" />;
      default:
        return <Layers className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <section id="testing-types" className="section-padding bg-canvas bg-canvas-texture border-b border-canvas-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
              05 / Testing Strategy
            </span>
            <h2 className="text-fluid-section-title font-display font-black text-ink uppercase">
              Testing Types<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="text-ink-muted max-w-md text-sm sm:text-base leading-relaxed font-light">
            We plan to combine non-functional requirement analysis, exploratory testing, and automated scripts into one cohesive strategy.
          </p>
        </div>

        {/* Interactive Kinetic Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 pt-6 sm:pt-10 items-stretch">
          {/* Left Column: Interactive Type Selector (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2">
            <div className="space-y-2">
              {types.map((item, idx) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectType(item.id)}
                    className={`w-full group p-3.5 sm:p-5 rounded-xl sm:rounded-2xl text-left transition-all border flex items-center justify-between relative overflow-hidden ${
                      isSelected
                        ? 'bg-ink text-white border-ink shadow-md -translate-y-0.5'
                        : 'bg-canvas-surface border-canvas-border hover:border-canvas-muted text-ink shadow-xs'
                    }`}
                  >
                    {/* Active vertical accent bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-2 bottom-2 w-1.5 bg-accent rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 pl-1">
                      {/* Number index */}
                      <span
                        className={`font-tech text-xs sm:text-base font-bold transition-colors ${
                          isSelected ? 'text-accent' : 'text-ink-ghost group-hover:text-accent'
                        }`}
                      >
                        0{idx + 1}
                      </span>

                      <div>
                        <h3
                          className={`text-base sm:text-xl font-display font-bold leading-tight ${
                            isSelected ? 'text-white' : 'text-ink'
                          }`}
                        >
                          {item.name}
                        </h3>
                        <span
                          className={`text-[11px] sm:text-xs font-tech tracking-wider uppercase block mt-0.5 ${
                            isSelected ? 'text-charcoal-400' : 'text-ink-subtle'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                        isSelected
                          ? 'text-accent translate-x-1'
                          : 'text-ink-ghost group-hover:translate-x-1'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Strategic Kinetic Panel (7 Cols) */}
          <div className="lg:col-span-7">
            <div
              ref={detailPanelRef}
              className="h-full min-h-0 lg:min-h-[460px] rounded-2xl sm:rounded-3xl bg-canvas-surface border border-canvas-border p-5 sm:p-10 lg:p-12 flex flex-col justify-between shadow-xs sm:shadow-sm relative overflow-hidden"
            >
              <div className="space-y-6 sm:space-y-8">
                {/* Header row with badges */}
                <div className="flex items-center justify-between border-b border-canvas-border pb-6 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-canvas-muted border border-canvas-border">
                      {getIconForType(selectedType.id)}
                    </div>
                    <div>
                      <span
                        ref={badgeNumRef}
                        className="text-[11px] font-tech text-accent uppercase tracking-widest block font-bold"
                      >
                        Strategy {selectedType.badge}
                      </span>
                      <h3
                        ref={titleRef}
                        className="text-2xl sm:text-3xl font-display font-extrabold text-ink"
                      >
                        {selectedType.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-tech font-bold uppercase tracking-wider ${
                      selectedType.isConditional
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-accent-subtle text-accent border border-accent/20'
                    }`}
                  >
                    {selectedType.status}
                  </span>
                </div>

                {/* Content blocks animated via GSAP */}
                <div ref={contentBlocksRef} className="space-y-5">
                  {/* Purpose block */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-tech uppercase text-ink-subtle tracking-wider font-semibold">
                      Strategic Purpose
                    </span>
                    <p className="text-base sm:text-lg text-ink font-light leading-relaxed">
                      {selectedType.purpose}
                    </p>
                  </div>

                  {/* Proposed Approach */}
                  <div className="p-5 rounded-2xl bg-canvas-muted/40 border border-canvas-border space-y-1.5">
                    <span className="text-xs font-tech uppercase text-accent font-bold tracking-wider block">
                      Proposed Method & Implementation
                    </span>
                    <p className="text-sm text-ink leading-relaxed">
                      {selectedType.proposedApproach}
                    </p>
                  </div>

                  {/* Expected Outputs */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-tech uppercase text-ink-subtle tracking-wider font-semibold">
                      Expected Deliverables & Artifacts
                    </span>
                    <p className="text-sm font-tech text-ink bg-canvas-muted/30 p-3.5 rounded-xl border border-canvas-border">
                      {selectedType.expectedOutputs}
                    </p>
                  </div>

                  {/* Conditional Notice where applicable */}
                  {selectedType.accessNotice && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Boundary Condition:</strong> {selectedType.accessNotice}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer indicator */}
              <div className="pt-6 border-t border-canvas-border flex items-center justify-between text-xs font-tech text-ink-subtle mt-4">
                <span>Proposed Quality Technique</span>
                <span>DEPI Software Testing Track</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
