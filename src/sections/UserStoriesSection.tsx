import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ChevronDown,
  FileCheck2,
  FileWarning,
  User,
} from 'lucide-react';
import { BlurTextReveal } from '../components/BlurTextReveal';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal';
import { totals } from '../data/toolshop';
import type { ModuleState, ModuleStory } from '../types';

interface UserStoriesSectionProps {
  stories: ModuleStory[];
  /** Detail pages render their own title block, so the inline header is dropped. */
  hideHeading?: boolean;
}

const stateTone: Record<ModuleState, string> = {
  executed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  'executed-no-bugreport': 'bg-orange-50 text-orange-700 border-orange-200',
  'not-executed': 'bg-rose-50 text-rose-700 border-rose-200',
};

/** Proportional pass / fail / blocked / not-run bar for a module. */
const ResultBar: React.FC<{ story: ModuleStory }> = ({ story }) => {
  const { written, passed, failed, blocked, notRun } = story.cases;
  const segments = [
    { key: 'passed', value: passed, className: 'bg-emerald-400' },
    { key: 'failed', value: failed, className: 'bg-rose-400' },
    { key: 'blocked', value: blocked, className: 'bg-orange-400' },
    { key: 'notRun', value: notRun, className: 'bg-canvas-muted' },
  ].filter((segment) => segment.value > 0);

  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-canvas-muted">
      {segments.map((segment) => (
        <div
          key={segment.key}
          className={segment.className}
          style={{ width: `${(segment.value / written) * 100}%` }}
          title={`${segment.key}: ${segment.value}`}
        />
      ))}
    </div>
  );
};

export const UserStoriesSection: React.FC<UserStoriesSectionProps> = ({
  stories,
  hideHeading = false,
}) => {
  const [stateFilter, setStateFilter] = useState<ModuleState | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const states = useMemo(() => {
    const counts = new Map<ModuleState, { label: string; count: number }>();
    for (const story of stories) {
      const existing = counts.get(story.state);
      counts.set(story.state, {
        label: story.stateLabel,
        count: (existing?.count ?? 0) + 1,
      });
    }
    return Array.from(counts.entries());
  }, [stories]);

  const visible =
    stateFilter === 'all'
      ? stories
      : stories.filter((story) => story.state === stateFilter);

  return (
    <section
      id="user-stories"
      className="section-padding bg-canvas-muted/40 border-b border-canvas-border scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {!hideHeading && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 section-header-spacing border-b border-canvas-border">
            <div>
              <span className="font-tech text-xs tracking-widest uppercase text-accent block mb-1.5">
                04 / Modules Under Test
              </span>
              <BlurTextReveal
                as="h2"
                text="User Stories"
                accentSuffix="."
                className="text-fluid-section-title font-display font-black text-ink uppercase"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 rounded-2xl bg-canvas-surface border border-canvas-border font-tech text-xs text-ink shadow-xs">
                <span className="text-ink-subtle block text-[10px] uppercase">
                  Delivered
                </span>
                <strong className="text-base text-accent">{stories.length}</strong>{' '}
                User Stories
              </div>
            </div>
          </div>
        )}

        {/* Summary strip */}
        <Reveal className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { value: String(totals.cases), label: 'Cases written' },
              {
                value: `${totals.executed}`,
                label: `Executed (${totals.execRate}%)`,
              },
              { value: `${totals.passRate}%`, label: 'Pass rate of executed' },
              { value: String(totals.notRun), label: 'Never run' },
            ].map((figure) => (
              <div
                key={figure.label}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs"
              >
                <span className="block font-display font-black text-xl sm:text-2xl text-ink tabular-nums">
                  {figure.value}
                </span>
                <span className="block font-tech text-[10px] uppercase tracking-wider text-ink-subtle mt-0.5">
                  {figure.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* State filter */}
        <Reveal className="mt-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setStateFilter('all')}
              aria-pressed={stateFilter === 'all'}
              className={`min-h-[40px] px-3 py-2 rounded-lg border font-tech text-[11px] uppercase tracking-wider transition-all ${
                stateFilter === 'all'
                  ? 'bg-ink text-canvas-surface border-ink shadow-sm'
                  : 'bg-canvas-surface text-ink-muted border-canvas-border hover:border-accent/50'
              }`}
            >
              All <span className="opacity-60">{stories.length}</span>
            </button>
            {states.map(([state, { label, count }]) => (
              <button
                key={state}
                type="button"
                onClick={() => setStateFilter(state)}
                aria-pressed={stateFilter === state}
                className={`min-h-[40px] px-3 py-2 rounded-lg border font-tech text-[11px] uppercase tracking-wider transition-all ${
                  stateFilter === state
                    ? 'bg-ink text-canvas-surface border-ink shadow-sm'
                    : `${stateTone[state]} hover:-translate-y-0.5`
                }`}
              >
                {label} <span className="opacity-60">{count}</span>
              </button>
            ))}
          </div>
        </Reveal>

        {/* Module cards */}
        <Stagger className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-5">
          {visible.map((story) => {
            const isExpanded = expandedId === story.id;

            return (
              <StaggerItem key={story.id} className="h-full">
                <div className="h-full rounded-2xl bg-canvas-surface border border-canvas-border shadow-xs hover:border-accent/40 transition-colors overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : story.id)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-4 sm:p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <code className="font-tech text-[10px] bg-ink text-canvas-surface px-1.5 py-0.5 rounded">
                            {story.id}
                          </code>
                          <span
                            className={`font-tech text-[10px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              stateTone[story.state]
                            }`}
                          >
                            {story.stateLabel}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-ink leading-tight truncate">
                          {story.module}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-display font-black text-xl text-ink tabular-nums">
                          {story.cases.passRate === null
                            ? '—'
                            : `${story.cases.passRate}%`}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-ink-ghost transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <ResultBar story={story} />

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5 font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
                      <span>{story.cases.written} written</span>
                      <span>{story.cases.executed} executed</span>
                      {story.cases.passed > 0 && (
                        <span className="text-emerald-700">
                          {story.cases.passed} passed
                        </span>
                      )}
                      {story.cases.failed > 0 && (
                        <span className="text-rose-600">
                          {story.cases.failed} failed
                        </span>
                      )}
                      {story.cases.blocked > 0 && (
                        <span className="text-orange-600">
                          {story.cases.blocked} blocked
                        </span>
                      )}
                      {story.cases.notRun > 0 && (
                        <span className="text-ink-ghost">
                          {story.cases.notRun} not run
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-3 border-t border-canvas-border font-tech text-[10px] text-ink-subtle">
                      <span className="inline-flex items-center gap-1">
                        <User className="w-3 h-3 text-accent" />
                        {story.owner}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FileCheck2 className="w-3 h-3 text-accent" />
                        {story.artifacts.delivered}/{story.artifacts.of} artifacts
                      </span>
                      <span>{story.defects.total} defects</span>
                      <span>{story.staticFindings.total} static</span>
                      <span>{story.areas.length} areas</span>
                    </div>

                    {/* Gaps stated on the card itself, not buried. */}
                    {story.cases.failed > 0 && story.defects.total === 0 && (
                      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1.5 leading-relaxed">
                        <FileWarning className="w-3.5 h-3.5 shrink-0 mt-px" />
                        {story.cases.failed} failures recorded with no bug report
                        delivered.
                      </p>
                    )}
                    {story.cases.executed === 0 && (
                      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 leading-relaxed">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-px" />
                        {story.cases.written} cases written and reviewed; none
                        executed. No verdict exists for this module.
                      </p>
                    )}
                    {story.staticFindings.total === 0 && (
                      <p className="mt-3 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 leading-relaxed">
                        <FileWarning className="w-3.5 h-3.5 shrink-0 mt-px" />
                        No static review was carried out on this module.
                      </p>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden border-t border-canvas-border bg-canvas"
                      >
                        <div className="p-4 sm:p-5">
                          <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-ink-ghost block mb-2.5">
                            Test areas ({story.areas.length})
                          </span>
                          <ul className="space-y-1.5">
                            {story.areas.map((area) => (
                              <li
                                key={area.name}
                                className="flex items-center justify-between gap-3 text-xs"
                              >
                                <span className="text-ink-muted truncate">
                                  {area.name}
                                </span>
                                <span className="font-tech text-[10px] shrink-0 tabular-nums space-x-1.5">
                                  <span className="text-ink">{area.total}</span>
                                  {area.passed > 0 && (
                                    <span className="text-emerald-700">
                                      {area.passed}P
                                    </span>
                                  )}
                                  {area.failed > 0 && (
                                    <span className="text-rose-600">
                                      {area.failed}F
                                    </span>
                                  )}
                                  {area.blocked > 0 && (
                                    <span className="text-orange-600">
                                      {area.blocked}B
                                    </span>
                                  )}
                                  {area.notRun > 0 && (
                                    <span className="text-ink-ghost">
                                      {area.notRun}N
                                    </span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-4 pt-3 border-t border-canvas-border grid grid-cols-3 gap-3 font-tech text-[10px] text-ink-subtle">
                            <div>
                              <span className="block uppercase tracking-wider text-ink-ghost">
                                Priority
                              </span>
                              <span className="text-ink">
                                {story.priority.high}H · {story.priority.medium}M ·{' '}
                                {story.priority.low}L
                              </span>
                            </div>
                            <div>
                              <span className="block uppercase tracking-wider text-ink-ghost">
                                Integration
                              </span>
                              <span className="text-ink">
                                {story.crossModule.integration.total === 0
                                  ? '—'
                                  : `${story.crossModule.integration.passed}/${story.crossModule.integration.total} passed`}
                              </span>
                            </div>
                            <div>
                              <span className="block uppercase tracking-wider text-ink-ghost">
                                End-to-end
                              </span>
                              <span className="text-ink">
                                {story.crossModule.e2e.total === 0
                                  ? '—'
                                  : `${story.crossModule.e2e.passed}/${story.crossModule.e2e.total} passed`}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-6">
          <p className="text-[11px] font-tech text-ink-subtle leading-relaxed border-t border-canvas-border pt-4">
            Owners are recorded as they appear in the delivered workbooks, which
            anonymise them. Every count on this page is read from those workbooks.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
