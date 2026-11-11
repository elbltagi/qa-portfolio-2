import React, { useState, useRef } from 'react';
import { ExternalLink, CheckCircle2, AlertTriangle, ShoppingCart, Layers, Globe, Shield, Terminal } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import { staticSeverity, totals } from '../data/toolshop';
import type { ProjectOverviewData, ProjectMeta, ModuleStory } from '../types';

interface OverviewSectionProps {
  overview: ProjectOverviewData;
  meta: ProjectMeta;
  stories: ModuleStory[];
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  overview,
  meta,
  stories,
}) => {
  const [activeTab, setActiveTab] = useState<'mission' | 'target' | 'scope'>('mission');
  const sectionRef = useRef<HTMLElement>(null);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Headline entrance
        gsap.fromTo(
          headlineRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headlineRef.current,
              start: 'top 85%',
            },
          }
        );

        // 2. Metrics cards stagger reveal
        if (metricsRef.current) {
          gsap.fromTo(
            metricsRef.current.children,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: metricsRef.current,
                start: 'top 85%',
              },
            }
          );
        }

        // 3. Cinematic expanding preview frame with scrub (Woonpact-inspired masked window expansion)
        if (previewCardRef.current && previewWrapperRef.current) {
          const expandTl = gsap.timeline({
            scrollTrigger: {
              trigger: previewWrapperRef.current,
              start: 'top 85%',
              end: 'top 25%',
              scrub: 1.2,
            },
          });

          expandTl.fromTo(
            previewCardRef.current,
            {
              scale: 0.93,
              opacity: 0.88,
              boxShadow: '0 8px 24px -10px rgba(0, 0, 0, 0.1)',
            },
            {
              scale: 1,
              opacity: 1,
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              ease: 'power2.out',
              clearProps: 'transform,scale,opacity',
            }
          );
        }

        // 4. Text narrative reveal
        if (textContentRef.current) {
          gsap.fromTo(
            textContentRef.current,
            { opacity: 0, x: -20 },
            {
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: textContentRef.current,
                start: 'top 80%',
              },
            }
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [
            headlineRef.current,
            metricsRef.current?.children,
            previewCardRef.current,
            textContentRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scale: 1, clipPath: 'none' }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="section-padding bg-canvas-muted/40 border-b border-canvas-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1">
              02 / Project Overview
            </span>
            <h2
              ref={headlineRef}
              className="text-fluid-section-title font-display font-black text-ink uppercase"
            >
              The Testing Mission<span className="text-accent">.</span>
            </h2>
          </div>
          <p className="text-ink-muted max-w-md text-sm sm:text-base leading-relaxed font-light">
            {overview.briefOverview}
          </p>
        </div>

        {/* Highlights Grid - Compact & Balanced */}
        <div
          ref={metricsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 py-5 sm:py-6 border-b border-canvas-border"
        >
          {overview.keyHighlights.map((highlight, index) => (
            <div
              key={highlight.label}
              className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs hover:border-accent/40 transition-colors"
            >
              <span className="text-[10px] font-tech uppercase text-ink-subtle block mb-0.5">
                {highlight.label}
              </span>
              <span
                className={`text-sm sm:text-base font-display font-bold ${
                  index === 1 ? 'text-accent' : 'text-ink'
                }`}
              >
                {highlight.value}
              </span>
              <span className="text-xs text-ink-subtle block mt-0.5">
                {highlight.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Narrative & Visual Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 pt-8 sm:pt-10 items-start">
          {/* Left Narrative Column */}
          <div ref={textContentRef} className="lg:col-span-6 space-y-5">
            {/* Interactive Tab Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-canvas-muted rounded-2xl sm:rounded-full w-full sm:w-fit border border-canvas-border">
              <button
                type="button"
                onClick={() => setActiveTab('mission')}
                className={`flex-1 sm:flex-initial inline-flex min-h-[40px] items-center justify-center text-center px-3.5 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'mission'
                    ? 'bg-ink text-canvas-surface shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Project Mission
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('target')}
                className={`flex-1 sm:flex-initial inline-flex min-h-[40px] items-center justify-center text-center px-3.5 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'target'
                    ? 'bg-ink text-canvas-surface shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Why This Store?
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('scope')}
                className={`flex-1 sm:flex-initial inline-flex min-h-[40px] items-center justify-center text-center px-3.5 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'scope'
                    ? 'bg-ink text-canvas-surface shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                What We Delivered
              </button>
            </div>

            {/* Tab 1: Project Mission */}
            {activeTab === 'mission' && (
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
                  A Finished Run, Reported Honestly
                </h3>
                <p className="text-ink-muted leading-relaxed font-light">
                  The {meta.team}, software testing trainees under the Digital Egypt
                  Pioneers Initiative, tested {stories.length} modules of{' '}
                  {meta.name}. Execution is complete and the reporting was delivered
                  on {meta.reportDate}. The result is mixed, and this site shows it
                  as it is.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">
                        {totals.cases} cases across {stories.length} modules:
                      </strong>{' '}
                      every module in scope received a user story and a case
                      workbook.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">
                        {totals.executed} executed, {totals.passed} passed:
                      </strong>{' '}
                      a {totals.passRate}% pass rate of what was run — measured
                      against executed cases, not written ones.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">
                        {totals.failuresAwaitingWriteUp} failures never written up:
                      </strong>{' '}
                      two modules were executed and produced failures that exist
                      only as a verdict in a workbook. That gap is reported, not
                      hidden.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Why This Target? */}
            {activeTab === 'target' && (
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
                  Why the Toolshop Was Selected
                </h3>
                <p className="text-ink-muted leading-relaxed font-light">
                  <strong className="text-ink font-semibold">
                    Practice Software Testing — Toolshop
                  </strong>{' '}
                  is a purpose-built practice application for quality engineers: a
                  real storefront with a full catalogue, cart, checkout and account
                  area, and no risk of a test order reaching a real customer.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Authentic purchase funnel:</strong> catalogue, search, price and brand filters, cart, and a multi-step checkout — the areas that produced most of our {totals.failed} failures.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Dense form surface:</strong> the registration form alone carries twelve distinct fields, and accounts for the single largest cluster of defects we logged.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Real boundary conditions:</strong> price sliders, quantity selectors and session handling gave boundary analysis and negative testing somewhere genuine to bite.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Planned Testing Work */}
            {activeTab === 'scope' && (
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
                  What We Actually Delivered
                </h3>
                <p className="text-ink-muted leading-relaxed font-light">
                  Four artifacts per module were planned.{' '}
                  {stories.filter((s) => s.artifacts.delivered === s.artifacts.of).length}{' '}
                  of {stories.length} modules delivered all four.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">
                      01. User Stories
                    </span>
                    <p className="text-xs text-ink-muted">
                      {stories.length} of {stories.length} delivered, one per module.
                    </p>
                  </div>
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">
                      02. Test Cases
                    </span>
                    <p className="text-xs text-ink-muted">
                      {totals.cases} cases across 53 test areas, each with a priority.
                    </p>
                  </div>
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">
                      03. Static Review
                    </span>
                    <p className="text-xs text-ink-muted">
                      {staticSeverity.total} findings across 9 of {stories.length}{' '}
                      modules. One was never reviewed.
                    </p>
                  </div>
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">
                      04. Bug Reports
                    </span>
                    <p className="text-xs text-ink-muted">
                      {totals.defectsLogged} defects logged;{' '}
                      {totals.failuresAwaitingWriteUp} failures never written up.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <a
                href={overview.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors group"
              >
                <span>Visit Live Application: {overview.targetUrl}</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Expanding Website Preview Frame (ScrollTrigger scrub) */}
          <div ref={previewWrapperRef} className="lg:col-span-6 w-full">
            <div
              ref={previewCardRef}
              className="rounded-2xl sm:rounded-3xl bg-ink text-canvas-surface p-5 sm:p-6 lg:p-7 shadow-xl border border-charcoal-800 relative overflow-hidden transition-all"
            >
              {/* Browser mockup chrome */}
              {/* The address pill is the only flexible item here: on a phone
                  it is wider than the space left by the dots and the label,
                  so it must be allowed to shrink and truncate rather than
                  push "Under test" off the card. */}
              <div className="flex items-center gap-2 sm:gap-3 pb-3.5 border-b border-charcoal-800 mb-4 sm:mb-5">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 px-2.5 py-0.5 rounded-full bg-charcoal-900 text-charcoal-400 text-[11px] sm:text-xs font-tech">
                  <Globe className="w-3.5 h-3.5 text-accent shrink-0" />
                  <span className="truncate">{meta.liveAppUrl}</span>
                </div>
                <span className="text-[10px] font-tech text-charcoal-500 uppercase shrink-0">
                  Under test
                </span>
              </div>

              {/* Architectural storefront preview details */}
              <div className="space-y-4 sm:space-y-5">
                <div>
                  <span className="text-xs font-tech tracking-wider text-accent uppercase block mb-1">
                    Storefront Architecture
                  </span>
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-display font-bold text-canvas-surface">
                    Practice Software Testing — Toolshop
                  </h4>
                  <p className="text-xs sm:text-sm text-charcoal-400 mt-1.5 font-light leading-relaxed">
                    A purpose-built practice storefront: a tool catalogue with
                    search, brand and category filters, a price slider, cart,
                    multi-step checkout, customer accounts and order history.
                  </p>
                </div>

                {/* Modules breakdown pills */}
                <div className="space-y-1.5">
                  <span className="text-xs font-tech text-charcoal-400 uppercase tracking-wider block">
                    {stories.length} Modules Under Test:
                  </span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {stories.map((story) => (
                      <span
                        key={story.id}
                        title={`${story.id} — ${story.stateLabel}`}
                        className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border text-[11px] sm:text-xs font-tech ${
                          story.cases.executed === 0
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                            : 'bg-charcoal-900 border-charcoal-800 text-charcoal-300'
                        }`}
                      >
                        {story.shortName}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scope boundaries notice */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-charcoal-900/90 border border-charcoal-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-tech text-amber-400">
                    <Terminal className="w-3.5 h-3.5" />
                    <span className="font-semibold uppercase tracking-wider">Coverage Boundary</span>
                  </div>
                  <p className="text-xs text-charcoal-400 leading-relaxed">
                    Toolshop was tested against the live web interface only. No
                    backend API or database testing was performed. Mobile app
                    testing was carried out, but as a separate effort against a
                    mobile application, so it is not counted in these figures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
