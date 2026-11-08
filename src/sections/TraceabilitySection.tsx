import React, { useMemo, useState } from 'react';
import { GitBranch, Layers, Target } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { buildModuleSummaries, buildTraceRows } from '../lib/traceability';
import type { AreaVerdict } from '../lib/traceability';
import { totals } from '../data/toolshop';
import type { ModuleStory } from '../types';

interface TraceabilitySectionProps {
  stories: ModuleStory[];
  hideHeading?: boolean;
}

const verdictTone: Record<AreaVerdict, string> = {
  passed: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25',
  mixed: 'bg-amber-400/15 text-amber-300 border-amber-400/25',
  failed: 'bg-rose-400/15 text-rose-300 border-rose-400/25',
  blocked: 'bg-orange-400/15 text-orange-300 border-orange-400/25',
  'not-run': 'bg-white/5 text-white/45 border-white/15',
};

const verdictLabel: Record<AreaVerdict, string> = {
  passed: 'All passed',
  mixed: 'Mixed',
  failed: 'All failed',
  blocked: 'Blocked',
  'not-run': 'Not run',
};

export const TraceabilitySection: React.FC<TraceabilitySectionProps> = ({
  stories,
  hideHeading = false,
}) => {
  const rows = useMemo(() => buildTraceRows(stories), [stories]);
  const modules = useMemo(() => buildModuleSummaries(stories), [stories]);

  const [activeModule, setActiveModule] = useState<string | null>(null);

  const visibleRows = activeModule
    ? rows.filter((row) => row.storyId === activeModule)
    : rows;

  const maxWritten = Math.max(...modules.map((m) => m.written), 1);
  const notRunAreas = rows.filter((r) => r.verdict === 'not-run').length;

  return (
    <section
      id="traceability"
      className="section-padding bg-ink text-canvas-surface border-b border-charcoal-800 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {!hideHeading && (
          <SectionHeading
            index="09"
            eyebrow="Requirements Traceability"
            title="Coverage, Area by Area"
            tone="dark"
            description="Every test area mapped back to its module, with what was executed and what it returned. The areas that were never run are shown as not run, not as passed."
          />
        )}

        {/* Headline figures */}
        <Reveal className={hideHeading ? '' : 'mt-8'}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                icon: Layers,
                value: String(rows.length),
                label: 'Test areas',
                sub: `Across ${stories.length} modules`,
              },
              {
                icon: Target,
                value: String(totals.cases),
                label: 'Cases written',
                sub: `${totals.executed} executed`,
              },
              {
                icon: GitBranch,
                value: `${totals.execRate}%`,
                label: 'Execution rate',
                sub: `${totals.notRun} never run`,
              },
              {
                icon: Target,
                value: String(notRunAreas),
                label: 'Areas never run',
                sub: 'Reported, not hidden',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5"
              >
                <stat.icon className="w-4 h-4 text-accent mb-3" />
                <div className="font-display font-black text-2xl sm:text-3xl text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 font-medium">{stat.label}</div>
                <div className="text-[10px] font-tech text-white/40 mt-1 uppercase tracking-wider">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Module coverage bars */}
        <Reveal className="mt-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h3 className="font-tech text-[10px] tracking-ultra uppercase text-white/55">
                Cases written and executed, by module
              </h3>
              {activeModule && (
                <button
                  type="button"
                  onClick={() => setActiveModule(null)}
                  className="font-tech text-[10px] uppercase tracking-wider text-accent hover:text-white transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {modules.map((module) => {
                const isActive = activeModule === module.storyId;
                const executedPct = (module.executed / maxWritten) * 100;
                const writtenPct = (module.written / maxWritten) * 100;

                return (
                  <button
                    key={module.storyId}
                    type="button"
                    onClick={() =>
                      setActiveModule(isActive ? null : module.storyId)
                    }
                    aria-pressed={isActive}
                    className={`w-full group flex items-center gap-3 sm:gap-4 text-left rounded-lg px-2 py-1.5 -mx-2 transition-colors ${
                      isActive ? 'bg-white/[0.06]' : 'hover:bg-white/[0.04]'
                    }`}
                  >
                    <span
                      className={`w-32 sm:w-48 shrink-0 text-xs truncate transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-white/65 group-hover:text-white'
                      }`}
                    >
                      <span className="font-tech text-white/35 mr-1.5">
                        {module.storyId}
                      </span>
                      {module.shortName}
                    </span>

                    {/* Written is the full bar; executed is the filled part. */}
                    <span className="flex-1 min-w-0 h-2 rounded-full bg-white/[0.07] overflow-hidden relative">
                      <span
                        className="absolute inset-y-0 left-0 rounded-full bg-white/15"
                        style={{ width: `${writtenPct}%` }}
                      />
                      <span
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                          isActive ? 'bg-accent' : 'bg-accent/60 group-hover:bg-accent/85'
                        }`}
                        style={{ width: `${executedPct}%` }}
                      />
                    </span>

                    <span className="font-tech text-[10px] text-white/45 shrink-0 w-28 sm:w-36 text-right tabular-nums">
                      {module.executed}/{module.written} exec
                      {module.passRate === null ? ' · —' : ` · ${module.passRate}%`}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-[10px] font-tech text-white/35 mt-4 leading-relaxed">
              The pale bar is cases written; the solid bar is cases executed. US-005
              Checkout shows a full pale bar and no solid one — 72 cases written and
              reviewed, none run.
            </p>
          </div>
        </Reveal>

        {/* The matrix */}
        <Reveal className="mt-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 sm:px-6 py-4 border-b border-white/10">
              <h3 className="font-tech text-[10px] tracking-ultra uppercase text-white/55">
                Traceability matrix
                {activeModule && (
                  <span className="text-accent"> · {activeModule}</span>
                )}
              </h3>
              <span className="font-tech text-[10px] uppercase tracking-wider text-white/40">
                {visibleRows.length} of {rows.length} test areas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[760px]">
                <thead>
                  <tr className="text-left font-tech text-[9px] uppercase tracking-ultra text-white/40">
                    <th className="px-5 sm:px-6 py-3 font-normal">Story</th>
                    <th className="px-3 py-3 font-normal">Module</th>
                    <th className="px-3 py-3 font-normal">Test area</th>
                    <th className="px-3 py-3 font-normal text-right">Cases</th>
                    <th className="px-3 py-3 font-normal text-right">Pass</th>
                    <th className="px-3 py-3 font-normal text-right">Fail</th>
                    <th className="px-3 py-3 font-normal text-right">Blocked</th>
                    <th className="px-3 py-3 font-normal text-right">Not run</th>
                    <th className="px-5 sm:px-6 py-3 font-normal text-right">
                      Verdict
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((row) => (
                    <tr
                      key={row.key}
                      className="border-t border-white/[0.07] hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-5 sm:px-6 py-3">
                        <code className="font-tech text-[10px] text-accent">
                          {row.storyId}
                        </code>
                      </td>
                      <td className="px-3 py-3 text-white/60 max-w-[180px] truncate">
                        {row.shortName}
                      </td>
                      <td className="px-3 py-3 text-white/85 max-w-[200px] truncate">
                        {row.area.name}
                      </td>
                      <td className="px-3 py-3 text-right text-white/70 tabular-nums">
                        {row.area.total}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-emerald-300/80">
                        {row.area.passed || '—'}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-rose-300/80">
                        {row.area.failed || '—'}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-orange-300/80">
                        {row.area.blocked || '—'}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums text-white/45">
                        {row.area.notRun || '—'}
                      </td>
                      <td className="px-5 sm:px-6 py-3 text-right">
                        <span
                          className={`font-tech text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                            verdictTone[row.verdict]
                          }`}
                        >
                          {verdictLabel[row.verdict]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6">
          <p className="text-[11px] font-tech text-white/35 leading-relaxed border-t border-white/10 pt-4">
            Every row is a test area recorded in a delivered workbook. A verdict of
            “Not run” means no case in that area was executed — it is never counted
            towards the pass rate.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
