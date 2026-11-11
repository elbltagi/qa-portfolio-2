import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '../lib/router';
import { Reveal } from '../components/Reveal';
import {
  crossModule,
  defectSeverity,
  moduleStories,
  staticSeverity,
  totals,
} from '../data/toolshop';
import type { ModuleStory } from '../data/toolshop';

/**
 * The test summary figures, one module at a time.
 *
 * This mirrors the delivered dashboard in 06 Dashboard: counts, rates and
 * totals for a chosen user story, and nothing else — no case titles, no
 * defect descriptions, no commentary. The written detail is the report
 * directly below this on the page.
 *
 * Everything is derived from the generated data, including the project-wide
 * view, which is summed here rather than read from a second copy.
 */

interface Props {
  hideHeading?: boolean;
}

/** A project-wide row shaped like a module so one renderer handles both. */
type View = {
  id: string;
  label: string;
  written: number;
  executed: number;
  passed: number;
  failed: number;
  blocked: number;
  notRun: number;
  passRate: number | null;
  execRate: number;
  defects: { total: number; high: number; medium: number; low: number };
  statics: number;
  areas: number;
  owner: string | null;
  stateLabel: string;
  reported: boolean;
  failuresUnlogged: number;
};

const projectView = (): View => ({
  id: 'ALL',
  label: 'All modules',
  written: totals.cases,
  executed: totals.executed,
  passed: totals.passed,
  failed: totals.failed,
  blocked: totals.blocked,
  notRun: totals.notRun,
  passRate: totals.passRate,
  execRate: totals.execRate,
  defects: {
    total: defectSeverity.total,
    high: defectSeverity.high,
    medium: defectSeverity.medium,
    low: defectSeverity.low,
  },
  statics: staticSeverity.total,
  areas: moduleStories.reduce((n, m) => n + m.areas.length, 0),
  owner: null,
  stateLabel: `${moduleStories.length} modules`,
  reported: moduleStories.every((m) => m.defects.reported),
  failuresUnlogged: totals.failuresAwaitingWriteUp,
});

const moduleView = (m: ModuleStory): View => ({
  id: m.id,
  label: m.module,
  written: m.cases.written,
  executed: m.cases.executed,
  passed: m.cases.passed,
  failed: m.cases.failed,
  blocked: m.cases.blocked,
  notRun: m.cases.notRun,
  passRate: m.cases.passRate,
  execRate: m.cases.execRate,
  defects: {
    total: m.defects.total,
    high: m.defects.high,
    medium: m.defects.medium,
    low: m.defects.low,
  },
  statics: m.staticFindings.total,
  areas: m.areas.length,
  owner: m.owner,
  stateLabel: m.stateLabel,
  reported: m.defects.reported,
  failuresUnlogged: m.defects.failuresUnlogged,
});

/** A single figure. The number leads; the label explains it. */
const Tile: React.FC<{ value: string | number; label: string; tone?: string }> = ({
  value,
  label,
  tone = 'text-ink',
}) => (
  <div className="rounded-xl border border-canvas-border bg-canvas-surface px-3.5 py-3">
    <span
      className={`block font-display font-black text-xl sm:text-2xl tabular-nums leading-none ${tone}`}
    >
      {value}
    </span>
    <span className="mt-1.5 block font-tech text-[10px] uppercase tracking-wider text-ink-subtle leading-tight">
      {label}
    </span>
  </div>
);

/** A labelled proportional bar. Segments of zero are dropped, not rendered flat. */
const Bar: React.FC<{
  parts: Array<{ label: string; value: number; fill: string }>;
  total: number;
}> = ({ parts, total }) => {
  const shown = parts.filter((p) => p.value > 0);
  if (total <= 0 || shown.length === 0) {
    return (
      <div className="h-2.5 w-full rounded-full bg-canvas-muted" aria-hidden="true" />
    );
  }
  return (
    <>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-canvas-muted">
        {shown.map((p) => (
          <div
            key={p.label}
            className={p.fill}
            style={{ width: `${(p.value / total) * 100}%` }}
            title={`${p.label}: ${p.value}`}
          />
        ))}
      </div>
      <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5">
        {shown.map((p) => (
          <li
            key={p.label}
            className="flex items-center gap-1.5 font-tech text-[10px] uppercase tracking-wider text-ink-subtle"
          >
            <span className={`h-2 w-2 rounded-full ${p.fill}`} aria-hidden="true" />
            {p.label}
            <span className="text-ink font-bold tabular-nums">{p.value}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export const TestSummaryDashboard: React.FC<Props> = ({ hideHeading }) => {
  const [selected, setSelected] = useState<string>('ALL');

  const story = moduleStories.find((m) => m.id === selected);
  const v = story ? moduleView(story) : projectView();
  const isAll = v.id === 'ALL';

  const outcome = [
    { label: 'Passed', value: v.passed, fill: 'bg-emerald-500' },
    { label: 'Failed', value: v.failed, fill: 'bg-rose-500' },
    { label: 'Blocked', value: v.blocked, fill: 'bg-amber-500' },
    { label: 'Never run', value: v.notRun, fill: 'bg-ink/25' },
  ];

  const severity = [
    { label: 'High', value: v.defects.high, fill: 'bg-rose-600' },
    { label: 'Medium', value: v.defects.medium, fill: 'bg-amber-500' },
    { label: 'Low', value: v.defects.low, fill: 'bg-emerald-500' },
  ];

  return (
    <section
      id="dashboard"
      className="section-padding bg-canvas-muted/40 border-b border-canvas-border scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {!hideHeading && (
          <h2 className="text-fluid-section-title font-display font-black text-ink uppercase mb-6">
            Test Summary Dashboard
          </h2>
        )}

        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <p className="font-tech text-[10px] sm:text-[11px] uppercase tracking-ultra text-accent">
                Dashboard
              </p>
              <h3 className="font-display font-black uppercase tracking-tight text-lg sm:text-xl text-ink mt-1">
                Figures, one module at a time
              </h3>
            </div>
            <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
              Counts and rates only — the written detail is below
            </p>
          </div>
        </Reveal>

        {/* Module picker. Buttons rather than a select: there are only eleven
            choices and they double as a legend of what exists. */}
        <Reveal>
          <div
            role="tablist"
            aria-label="Choose a module"
            className="flex flex-wrap gap-2 mb-6"
          >
            {[
              { id: 'ALL', label: 'All modules' },
              ...moduleStories.map((m) => ({
                id: m.id,
                label: `${m.id} ${m.shortName}`,
              })),
            ].map((item) => {
              const active = item.id === selected;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelected(item.id)}
                  className={`min-h-[40px] rounded-xl border px-3 py-2 font-tech text-[11px] uppercase tracking-wider transition-all ${
                    active
                      ? 'bg-ink text-canvas-surface border-ink shadow-sm'
                      : 'bg-canvas-surface text-ink-muted border-canvas-border hover:border-accent/50 hover:text-ink'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl sm:rounded-3xl border border-canvas-border bg-canvas-surface/60 p-4 sm:p-6 lg:p-7">
            {/* Header of the selected view */}
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5 pb-4 mb-5 border-b border-canvas-border">
              <div className="flex items-baseline gap-3 min-w-0">
                <code className="font-tech text-xs text-accent shrink-0">{v.id}</code>
                <h4 className="font-display font-bold text-base sm:text-lg text-ink truncate">
                  {v.label}
                </h4>
              </div>
              <span className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
                {v.stateLabel}
                {v.owner ? ` · ${v.owner}` : ''} · {v.areas}{' '}
                {v.areas === 1 ? 'test area' : 'test areas'}
              </span>
            </div>

            {/* Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
              <Tile value={v.written} label="Cases written" />
              <Tile value={v.executed} label="Executed" />
              <Tile
                value={`${v.execRate}%`}
                label="Execution rate"
                tone={v.execRate === 100 ? 'text-emerald-700' : 'text-amber-700'}
              />
              <Tile
                value={v.passRate === null ? '—' : `${v.passRate}%`}
                label="Pass rate of executed"
                tone={v.passRate === null ? 'text-ink-ghost' : 'text-ink'}
              />
              <Tile
                value={v.defects.total}
                label="Defects logged"
                tone={v.defects.total > 0 ? 'text-rose-700' : 'text-ink-ghost'}
              />
              <Tile value={v.statics} label="Static findings" />
            </div>

            {/* Case outcome */}
            <div className="mt-6">
              <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle mb-2.5">
                {v.written} written cases by outcome
              </p>
              <Bar parts={outcome} total={v.written} />
            </div>

            {/* Defect severity, or the reason there is none */}
            <div className="mt-6 pt-5 border-t border-canvas-border">
              <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle mb-2.5">
                {v.defects.total > 0
                  ? `${v.defects.total} defects by severity`
                  : 'Defects by severity'}
              </p>
              {v.defects.total > 0 ? (
                <Bar parts={severity} total={v.defects.total} />
              ) : (
                <p className="flex items-start gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-800 leading-relaxed">
                  <span className="font-bold shrink-0">!</span>
                  {v.failuresUnlogged > 0
                    ? `No bug report was written for this module. ${v.failuresUnlogged} failed cases were never logged as defects.`
                    : 'No defects were logged against this module.'}
                </p>
              )}
            </div>

            {/* Cross-module suites only belong to the project-wide view. */}
            {isAll && (
              <div className="mt-6 pt-5 border-t border-canvas-border grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle mb-2.5">
                    Integration suite
                  </p>
                  <Bar
                    parts={[
                      {
                        label: 'Passed',
                        value: crossModule.integration.totals.passed,
                        fill: 'bg-emerald-500',
                      },
                      {
                        label: 'Failed',
                        value: crossModule.integration.totals.failed,
                        fill: 'bg-rose-500',
                      },
                    ]}
                    total={crossModule.integration.totals.total}
                  />
                </div>
                <div>
                  <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle mb-2.5">
                    End-to-end purchase journey
                  </p>
                  <Bar
                    parts={[
                      {
                        label: 'Passed',
                        value: crossModule.e2e.totals.passed,
                        fill: 'bg-emerald-500',
                      },
                      {
                        label: 'Blocked',
                        value: crossModule.e2e.totals.blocked,
                        fill: 'bg-amber-500',
                      },
                    ]}
                    total={crossModule.e2e.totals.total}
                  />
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* The dashboard is reached from the report, so it has to lead back
            to it: PageShell gives it no prev/next, only Home. */}
        <Reveal>
          <Link
            to="/summary"
            className="group mt-5 inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-canvas-border bg-canvas-surface px-4 py-2.5 no-underline transition-colors hover:border-accent"
          >
            <ArrowLeft className="w-4 h-4 shrink-0 text-ink-ghost group-hover:text-accent group-hover:-translate-x-1 transition-all" />
            <span className="font-display font-bold text-sm text-ink group-hover:text-accent transition-colors">
              Back to the test summary report
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};
