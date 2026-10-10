import React, { useState, useRef, useEffect } from 'react';
import { CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { gsap } from '../lib/gsap';
import type { TestingActivitiesRecord } from '../types';

interface TestingActivitiesSectionProps {
  activitiesData: TestingActivitiesRecord;
}

export const TestingActivitiesSection: React.FC<TestingActivitiesSectionProps> = ({
  activitiesData,
}) => {
  // Ordered strictly according to 01-06 Testing Types order
  const preferredOrder = ['static', 'manual', 'api', 'automation', 'database', 'mobile'];
  const allKeys = Object.keys(activitiesData);
  const categoryKeys = [
    ...preferredOrder.filter((k) => allKeys.includes(k)),
    ...allKeys.filter((k) => !preferredOrder.includes(k)),
  ];

  const [selectedKey, setSelectedKey] = useState<string>(categoryKeys[0] || 'static');

  const activeCategory = activitiesData[selectedKey] || activitiesData['static'] || activitiesData['manual'];
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  // Strictly omit "Writing User Stories" as instructed
  const filteredActivities = (activeCategory?.activities || []).filter(
    (item) => !item.name.toLowerCase().includes('writing user stories')
  );

  // Animate steps smoothly when active category changes
  useEffect(() => {
    if (!stepsContainerRef.current) return;
    const items = stepsContainerRef.current.children;
    gsap.fromTo(
      items,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: 'power2.out',
      }
    );
  }, [selectedKey]);

  return (
    <section
      id="testing-activities"
      className="section-padding bg-canvas-muted/40 border-b border-canvas-border"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
              06 / Proposed QA Workflow
            </span>
            <h2 className="text-fluid-section-title font-display font-black text-ink uppercase">
              Testing Activities<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="text-ink-muted max-w-md text-sm sm:text-base leading-relaxed font-light">
            Explore the planned hands-on QA activities our team will perform across every testing phase.
          </p>
        </div>

        {/* Category Horizontal Filter Tabs (Responsive with smooth touch scroll) */}
        <div className="pt-6 pb-6 sm:pt-8 sm:pb-8 flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categoryKeys.map((key) => {
            const cat = activitiesData[key];
            const isSelected = key === selectedKey;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                  isSelected
                    ? 'bg-accent text-white border-accent shadow-md shadow-accent/20 ring-2 ring-accent/30'
                    : 'bg-canvas-surface text-ink-muted border-canvas-border hover:border-canvas-muted hover:text-ink shadow-xs'
                }`}
              >
                <span>{cat.title}</span>
                {cat.isConditional && (
                  <span
                    className={`ml-1.5 text-[9px] px-1.5 py-0.5 rounded-sm font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-500/20 text-amber-700'
                    }`}
                  >
                    Conditional
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Clean Process Activity Canvas */}
        <div className="p-7 sm:p-10 lg:p-12 rounded-3xl bg-canvas-surface border border-canvas-border shadow-sm space-y-8">
          {/* Header of Active Category */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-canvas-border">
            <div>
              <span className="text-xs font-tech uppercase text-accent tracking-wider block mb-1">
                Selected Discipline Workflow
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink">
                {activeCategory?.title}
              </h3>
            </div>

            {activeCategory?.accessNote && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-tech">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>{activeCategory.accessNote}</span>
              </div>
            )}
          </div>

          {/* Activities Cards Grid */}
          <div
            ref={stepsContainerRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6"
          >
            {filteredActivities.map((act, index) => (
              <div
                key={act.name}
                className="group p-6 rounded-2xl bg-canvas-muted/40 border border-canvas-border hover:border-accent/40 transition-all duration-300 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-tech text-xs font-bold text-accent bg-canvas-surface px-2.5 py-1 rounded-md border border-canvas-border shadow-xs">
                      Step 0{index + 1}
                    </span>
                    <h4 className="text-base sm:text-lg font-display font-bold text-ink group-hover:text-accent transition-colors">
                      {act.name}
                    </h4>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-ink-ghost group-hover:text-accent transition-colors" />
                </div>

                <p className="text-sm text-ink-muted leading-relaxed font-light pl-0.5">
                  {act.description}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom notice reminding that user story authoring is featured in Section 04 */}
          <div className="pt-6 border-t border-canvas-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-tech text-ink-subtle">
            <span>
              Note: Writing User Stories is organized in Section 04 (User Stories Feature Explorer).
            </span>
            <a
              href="#user-stories"
              className="inline-flex items-center gap-1 text-accent hover:underline font-semibold"
            >
              <span>Jump to User Stories Explorer</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
