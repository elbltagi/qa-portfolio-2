import React, { useState, useRef } from 'react';
import { ExternalLink, CheckCircle2, ShoppingCart, Layers, Globe, Shield, Terminal } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { ProjectOverviewData, ProjectMeta } from '../types';

interface OverviewSectionProps {
  overview: ProjectOverviewData;
  meta: ProjectMeta;
  totalStoriesCount: number;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  overview,
  meta,
  totalStoriesCount,
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
              scale: 0.84,
              clipPath: 'inset(12% 16% 12% 16% round 24px)',
              boxShadow: '0 8px 24px -10px rgba(0, 0, 0, 0.1)',
            },
            {
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0% round 28px)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.35)',
              ease: 'power2.out',
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
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
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
            Our graduation project aims to evaluate the functionality and reliability of Automation Test Store through planned, structured software testing.
          </p>
        </div>

        {/* Highlights Grid - Compact & Balanced */}
        <div
          ref={metricsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-6 sm:py-7 border-b border-canvas-border"
        >
          <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs hover:border-accent/40 transition-colors">
            <span className="text-[10px] font-tech uppercase text-ink-subtle block mb-1">Target Application</span>
            <span className="text-base sm:text-lg font-display font-bold text-ink">E-Commerce Store</span>
            <span className="text-xs text-ink-subtle block mt-0.5">AbanteCart Practice Platform</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs hover:border-accent/40 transition-colors">
            <span className="text-[10px] font-tech uppercase text-ink-subtle block mb-1">Project Duration</span>
            <span className="text-base sm:text-lg font-display font-bold text-accent">{meta.duration}</span>
            <span className="text-xs text-ink-subtle block mt-0.5">Proposal & Planning</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs hover:border-accent/40 transition-colors">
            <span className="text-[10px] font-tech uppercase text-ink-subtle block mb-1">Planned Approach</span>
            <span className="text-base sm:text-lg font-display font-bold text-ink">Manual First</span>
            <span className="text-xs text-ink-subtle block mt-0.5">Then Automation Scripts</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs hover:border-accent/40 transition-colors">
            <span className="text-[10px] font-tech uppercase text-ink-subtle block mb-1">Proposed Stories</span>
            <span className="text-base sm:text-lg font-display font-bold text-ink">{totalStoriesCount} Identified</span>
            <span className="text-xs text-ink-subtle block mt-0.5">Across 10 Modules</span>
          </div>
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
                className={`flex-1 sm:flex-initial text-center px-3.5 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
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
                className={`flex-1 sm:flex-initial text-center px-3.5 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
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
                className={`flex-1 sm:flex-initial text-center px-3.5 sm:px-4 py-1.5 rounded-xl sm:rounded-full text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'scope'
                    ? 'bg-ink text-canvas-surface shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Planned Testing Work
              </button>
            </div>

            {/* Tab 1: Project Mission */}
            {activeTab === 'mission' && (
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
                  Systematic Quality Assurance for Real-World E-Commerce Workflows
                </h3>
                <p className="text-ink-muted leading-relaxed font-light">
                  As software testing trainees under the Digital Egypt Pioneers Initiative (DEPI), our graduation project focuses on establishing a disciplined testing lifecycle. We will explore the target storefront, analyze user requirements, design rigorous test suites, and report actionable findings.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Complete Requirement Verification:</strong> We will define clear acceptance criteria for all 10 target storefront modules.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Dual Manual & Automated Focus:</strong> Establishing baseline manual execution before writing automated regression test scripts.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Standardized Bug Documentation:</strong> Logging reproducible defects with clear severity ratings, environmental details, and screenshots.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Why This Target? */}
            {activeTab === 'target' && (
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
                  Why Automation Test Store Was Selected
                </h3>
                <p className="text-ink-muted leading-relaxed font-light">
                  <strong className="text-ink font-semibold">Automation Test Store</strong> is an authentic web application built on open-source e-commerce architecture (AbanteCart), specifically intended for training test automation and quality engineers.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <ShoppingCart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Authentic Purchase Funnels:</strong> Includes product search, dynamic filtering, cart modifications, and multi-step checkout processes.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Layers className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Diverse UI Components:</strong> Rich form controls, date pickers, dropdown selects, image carousels, and currency selectors.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <p className="text-sm text-ink font-light">
                      <strong className="font-semibold text-ink">Realistic Boundary Conditions:</strong> Offers fertile ground for boundary value analysis, negative testing, and session handling validation.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Planned Testing Work */}
            {activeTab === 'scope' && (
              <div className="space-y-4">
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-ink leading-tight">
                  Our Proposed Testing Deliverables
                </h3>
                <p className="text-ink-muted leading-relaxed font-light">
                  Over the 9-week project timeline, our team proposes to systematically produce standard testing artifacts:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">01. Stories & Design</span>
                    <p className="text-xs text-ink-muted">Writing structured user stories and ambiguity review logs.</p>
                  </div>
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">02. Manual Test Suites</span>
                    <p className="text-xs text-ink-muted">Test cases covering positive, negative, and edge paths.</p>
                  </div>
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">03. Automated Scripts</span>
                    <p className="text-xs text-ink-muted">Regression scripts for core shopping cart & search journeys.</p>
                  </div>
                  <div className="p-3.5 bg-canvas-surface rounded-xl border border-canvas-border">
                    <span className="text-xs font-tech text-accent font-bold block mb-1">04. Final Summary</span>
                    <p className="text-xs text-ink-muted">Comprehensive Graduation Project Test Summary Report.</p>
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
              className="rounded-3xl bg-ink text-canvas-surface p-6 sm:p-8 shadow-2xl border border-charcoal-800 relative overflow-hidden transition-all"
            >
              {/* Browser mockup chrome */}
              <div className="flex items-center justify-between pb-4 border-b border-charcoal-800 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-900 text-charcoal-400 text-xs font-tech">
                  <Globe className="w-3.5 h-3.5 text-accent" />
                  <span>https://automationteststore.com</span>
                </div>
                <span className="text-[10px] font-tech text-charcoal-500 uppercase">Target v1.2</span>
              </div>

              {/* Architectural storefront preview details */}
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-tech tracking-wider text-accent uppercase block mb-1">
                    Storefront Architecture
                  </span>
                  <h4 className="text-2xl font-display font-bold text-canvas-surface">
                    AbanteCart Open-Source E-Commerce
                  </h4>
                  <p className="text-sm text-charcoal-400 mt-2 font-light leading-relaxed">
                    A fully-featured web application hosting an extensive catalog of apparel, makeup, fragrances, skincare, and books with shopping cart states and session cookies.
                  </p>
                </div>

                {/* Modules breakdown pills */}
                <div className="space-y-2">
                  <span className="text-xs font-tech text-charcoal-400 uppercase tracking-wider block">
                    10 Functional Modules in Testing Scope:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Authentication',
                      'Account Management',
                      'Catalog & Navigation',
                      'Search',
                      'Product Details',
                      'Shopping Cart',
                      'Checkout',
                      'Offers & Marketing',
                      'Support & Info',
                      'Site Preferences',
                    ].map((mod) => (
                      <span
                        key={mod}
                        className="px-2.5 py-1 rounded-md bg-charcoal-900 border border-charcoal-800 text-xs text-charcoal-300 font-tech"
                      >
                        {mod}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scope boundaries notice */}
                <div className="p-4 rounded-xl bg-charcoal-900/90 border border-charcoal-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-tech text-amber-400">
                    <Terminal className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider">Proposal Stage Boundary</span>
                  </div>
                  <p className="text-xs text-charcoal-400 leading-relaxed">
                    Testing will be conducted against the live web interface. Backend APIs, database instances, and mobile builds will be incorporated conditionally upon confirmed credential access.
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
