import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, ExternalLink, Filter, ChevronRight, Sparkles, CheckCircle2, X } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap } from '../lib/gsap';
import type { UserStory } from '../types';

interface UserStoriesSectionProps {
  stories: UserStory[];
}

export const UserStoriesSection: React.FC<UserStoriesSectionProps> = ({ stories }) => {
  const [selectedModule, setSelectedModule] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const storiesListRef = useRef<HTMLDivElement>(null);

  // Extract unique module list dynamically from live data
  const modules = useMemo(() => {
    const list = Array.from(new Set(stories.map((s) => s.module))).filter(Boolean);
    return ['All', ...list];
  }, [stories]);

  // Filtered stories based on module and search query
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      const matchesModule = selectedModule === 'All' || story.module === selectedModule;
      const matchesQuery =
        !searchQuery ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (story.description && story.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesModule && matchesQuery;
    });
  }, [stories, selectedModule, searchQuery]);

  // Smooth GSAP transition on module switch or search
  useEffect(() => {
    if (!storiesListRef.current) return;
    const elements = storiesListRef.current.children;
    if (elements.length > 0) {
      gsap.fromTo(
        elements,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.02,
          ease: 'power2.out',
        }
      );
    }
  }, [selectedModule, searchQuery]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "#stories-commitment-banner",
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: "#stories-commitment-banner",
              start: 'top 85%',
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="user-stories"
      className="section-padding bg-canvas-muted/40 border-b border-canvas-border"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
          <div>
            <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
              04 / Functional Feature Inventory
            </span>
            <h2 className="text-fluid-section-title font-display font-black text-ink uppercase">
              User Stories<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-2xl bg-canvas-surface border border-canvas-border font-tech text-xs text-ink shadow-xs">
              <span className="text-ink-subtle block text-[10px] uppercase">Verified Feature Inventory</span>
              <strong className="text-base text-accent">{stories.length}</strong> Proposed Features
            </div>
          </div>
        </div>

        {/* Required Academic Commitment Banner */}
        <div
          id="stories-commitment-banner"
          className="my-7 sm:my-8 p-5 sm:p-7 rounded-3xl bg-canvas-surface border border-accent/30 shadow-xs relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-subtle text-accent font-tech text-xs font-semibold uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Core Project Commitment</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-ink">
                We will write and review User Stories during our project.
              </h3>
              <p className="text-xs sm:text-sm text-ink-muted font-light max-w-2xl leading-relaxed">
                Our team will explore Automation Test Store, identify its features, and write structured user stories during the project.
              </p>
            </div>

            <div className="shrink-0 p-3.5 rounded-2xl bg-canvas-muted border border-canvas-border text-xs text-ink-muted font-tech space-y-1">
              <span className="text-[10px] text-ink-subtle uppercase tracking-wider block font-bold">
                Presentation Note
              </span>
              <p className="max-w-xs text-[11px]">
                Each distinct user-facing storefront feature serves as one proposed story for our initial presentation inventory.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Explorer Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pt-1 items-start">
          {/* Module Selector (Filter pills & Search) */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-ghost" />
              <input
                type="text"
                placeholder="Search features (e.g. login, cart, search)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-2xl bg-canvas-surface border border-canvas-border text-xs sm:text-sm text-ink placeholder:text-ink-ghost focus:outline-hidden focus:border-accent transition-colors shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-ghost hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Module Selector (Horizontal Swipeable Bar) */}
            <div className="flex lg:hidden overflow-x-auto gap-2 pb-1 pt-0.5 no-scrollbar -mx-6 px-6 sm:-mx-8 sm:px-8">
              {modules.map((mod: string) => {
                const count =
                  mod === 'All'
                    ? stories.length
                    : stories.filter((s) => s.module === mod).length;
                const isSelected = selectedModule === mod;

                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setSelectedModule(mod)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-all ${
                      isSelected
                        ? 'bg-accent text-white font-bold shadow-sm ring-1 ring-accent'
                        : 'bg-canvas-surface border border-canvas-border text-ink-muted hover:text-ink font-medium shadow-xs'
                    }`}
                  >
                    <span className="whitespace-nowrap">{mod}</span>
                    <span
                      className={`font-tech text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-canvas-muted text-ink-subtle'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Modules List */}
            <div className="hidden lg:block p-4 rounded-2xl bg-canvas-surface border border-canvas-border space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-canvas-border text-xs font-tech text-ink-ghost uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-accent" />
                  <span>Functional Modules</span>
                </span>
                <span>Count</span>
              </div>

              {modules.map((mod: string) => {
                const count =
                  mod === 'All'
                    ? stories.length
                    : stories.filter((s) => s.module === mod).length;
                const isSelected = selectedModule === mod;

                return (
                  <button
                    key={mod}
                    type="button"
                    onClick={() => setSelectedModule(mod)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs transition-all relative ${
                      isSelected
                        ? 'bg-accent text-white font-bold shadow-md shadow-accent/20'
                        : 'text-ink-muted hover:bg-canvas-muted hover:text-ink font-medium'
                    }`}
                  >
                    <span className="truncate pr-2">{mod}</span>
                    <span
                      className={`font-tech text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-canvas-muted text-ink-muted'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stories Listing (Editorial List + Inspector) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between px-2 text-xs font-tech text-ink-subtle">
              <span>
                Showing <strong>{filteredStories.length}</strong> of {stories.length} stories
              </span>
              <span>Click any card to inspect criteria & route</span>
            </div>

            {/* Stories Scroll Container (Compact height, prevents long scroll sequences) */}
            <div
              ref={storiesListRef}
              className="space-y-2.5 max-h-[540px] overflow-y-auto pr-2"
            >
              {filteredStories.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-canvas-surface border border-canvas-border text-ink-subtle">
                  <p className="text-sm">No stories match your current filter criteria.</p>
                </div>
              ) : (
                filteredStories.map((story: UserStory) => {
                  const isSelected = selectedStory?.id === story.id;
                  return (
                    <div
                      key={story.id}
                      onClick={() => setSelectedStory(isSelected ? null : story)}
                      className={`group cursor-pointer p-4 rounded-2xl border transition-all ${
                        isSelected
                          ? 'bg-canvas-surface border-accent ring-1 ring-accent shadow-sm'
                          : 'bg-canvas-surface border-canvas-border hover:border-canvas-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-tech text-[11px] font-bold text-accent">
                              {story.id}
                            </span>
                            <span className="text-ink-ghost">•</span>
                            <span className="text-xs font-tech text-ink-subtle uppercase">
                              {story.module}
                            </span>
                            <span
                              className={`text-[10px] font-tech font-bold px-2 py-0.5 rounded-full ${
                                story.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-canvas-muted text-ink-muted'
                              }`}
                            >
                              {story.priority}
                            </span>
                          </div>

                          <h4 className="text-base font-display font-bold text-ink group-hover:text-accent transition-colors">
                            {story.title}
                          </h4>

                          {story.description && (
                            <p className="text-xs text-ink-muted line-clamp-1 font-light">
                              {story.description}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-tech px-2.5 py-1 rounded-full bg-canvas-muted text-ink-muted hidden sm:inline-block">
                            {story.evidenceStatus}
                          </span>
                          <ChevronRight
                            className={`w-4 h-4 text-ink-ghost transition-transform ${
                              isSelected ? 'rotate-90 text-accent' : 'group-hover:translate-x-0.5'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expandable story details panel */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-canvas-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-tech">
                          <div>
                            <span className="text-ink-ghost uppercase text-[10px] block mb-1">
                              Verification Status
                            </span>
                            <div className="flex items-center gap-1.5 text-ink font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                              <span>{story.evidenceStatus}</span>
                            </div>
                            {story.verificationNote && (
                              <p className="text-[11px] text-ink-subtle mt-1.5 italic">
                                Note: {story.verificationNote}
                              </p>
                            )}
                          </div>

                          <div>
                            <span className="text-ink-ghost uppercase text-[10px] block mb-1">
                              Target Endpoint / Route
                            </span>
                            {story.url ? (
                              <a
                                href={story.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-accent hover:underline break-all"
                              >
                                <span>{story.url}</span>
                                <ExternalLink className="w-3 h-3 shrink-0" />
                              </a>
                            ) : (
                              <span className="text-ink-ghost">Integrated storefront view</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
