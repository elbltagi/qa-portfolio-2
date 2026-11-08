import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bug, FileWarning, ShieldAlert, UserCog } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import {
  defectHeadline,
  defectLifecycle,
  defectsByModule,
  lifecycleReached,
  modulesWithoutBugReport,
  priorityScale,
  severityScale,
  triageGuidance,
  workedDefectReport,
} from '../data/defects';

const kindTone: Record<string, string> = {
  open: 'border-rose-300 bg-rose-50 text-rose-700',
  progress: 'border-amber-300 bg-amber-50 text-amber-700',
  verify: 'border-sky-300 bg-sky-50 text-sky-700',
  closed: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  rejected: 'border-canvas-border bg-canvas-muted text-ink-muted',
};

const severityTone: Record<string, string> = {
  High: 'bg-rose-500',
  Medium: 'bg-orange-400',
  Low: 'bg-amber-300',
  Unrated: 'bg-charcoal-300',
};

/** Weight for the triage heat grid, highest severity and priority first. */
const severityWeight: Record<string, number> = {
  High: 4,
  Medium: 3,
  Low: 2,
  Unrated: 1,
};

interface DefectSectionProps {
  /** Detail pages render their own title block, so the inline header is dropped. */
  hideHeading?: boolean;
}

export const DefectSection: React.FC<DefectSectionProps> = ({
  hideHeading = false,
}) => {
  const [activeState, setActiveState] = useState(defectLifecycle[0].id);
  const current =
    defectLifecycle.find((s) => s.id === activeState) ?? defectLifecycle[0];

  return (
    <section
      id="defects"
      className="section-padding bg-canvas bg-canvas-texture border-b border-canvas-border scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {!hideHeading && (
          <SectionHeading
            index="10"
            eyebrow="Defect Management"
            title="When Something Breaks"
            description="Finding a defect is the easy half. These are the workflow, the triage scale and the report standard the team agreed before execution — so six testers file one consistent record instead of six different ones."
          />
        )}

        {/* Lifecycle */}
        <Reveal className={hideHeading ? '' : 'mt-8'}>
          <div className="rounded-2xl border border-canvas-border bg-canvas-surface p-5 sm:p-6">
            <h3 className="font-tech text-[10px] tracking-ultra uppercase text-ink-subtle mb-2">
              Defect lifecycle — select a state
            </h3>
            <p className="text-[11px] text-ink-muted leading-relaxed mb-5 border-l-2 border-amber-300 pl-2.5">
              {lifecycleReached.note}
            </p>

            <div className="flex flex-wrap gap-2 mb-5">
              {defectLifecycle.map((state) => {
                const isActive = state.id === activeState;
                return (
                  <button
                    key={state.id}
                    type="button"
                    onClick={() => setActiveState(state.id)}
                    aria-pressed={isActive}
                    className={`min-h-[40px] px-3 py-2 rounded-lg border font-tech text-[11px] uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'bg-ink text-canvas-surface border-ink shadow-md -translate-y-0.5'
                        : `${kindTone[state.kind]} hover:-translate-y-0.5`
                    }`}
                  >
                    {state.name}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="rounded-xl bg-canvas border border-canvas-border p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center gap-3 mb-2.5">
                  <h4 className="font-display font-bold text-lg text-ink">
                    {current.name}
                  </h4>
                  <span className="inline-flex items-center gap-1.5 font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
                    <UserCog className="w-3.5 h-3.5 text-accent" />
                    Owner: {current.owner}
                  </span>
                </div>

                <p className="text-sm text-ink-muted leading-relaxed mb-4">
                  {current.description}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-ink-ghost">
                    {current.next.length ? 'Can move to' : 'Terminal state'}
                  </span>
                  {current.next.map((nextId) => {
                    const target = defectLifecycle.find((s) => s.id === nextId);
                    if (!target) return null;
                    return (
                      <button
                        key={nextId}
                        type="button"
                        onClick={() => setActiveState(nextId)}
                        className="font-tech text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-canvas-border bg-canvas-surface text-ink hover:border-accent hover:text-accent transition-colors"
                      >
                        {target.name} →
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Headline figures */}
        <Reveal className="mt-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { value: String(defectHeadline.logged), label: 'Defects logged' },
              { value: String(defectHeadline.failures), label: 'Failures observed' },
              {
                value: String(defectHeadline.awaitingWriteUp),
                label: 'Never written up',
                warn: true,
              },
              {
                value: `${defectHeadline.modulesReporting}/${defectHeadline.moduleCount}`,
                label: 'Modules with a bug report',
              },
            ].map((figure) => (
              <div
                key={figure.label}
                className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border shadow-xs ${
                  figure.warn
                    ? 'bg-orange-50 border-orange-200'
                    : 'bg-canvas-surface border-canvas-border'
                }`}
              >
                <span
                  className={`block font-display font-black text-xl sm:text-2xl tabular-nums ${
                    figure.warn ? 'text-orange-700' : 'text-ink'
                  }`}
                >
                  {figure.value}
                </span>
                <span className="block font-tech text-[10px] uppercase tracking-wider text-ink-subtle mt-0.5">
                  {figure.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Where the failures went unreported */}
        <Reveal className="mt-4">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/70 p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileWarning className="w-4 h-4 text-orange-600 shrink-0" />
              <h3 className="font-tech text-[10px] tracking-ultra uppercase text-orange-800">
                Failures with no defect report
              </h3>
            </div>
            <p className="text-xs text-orange-900/80 leading-relaxed mb-4">
              These modules were executed and produced failures, but no bug report
              was delivered. The failures exist only as a Failed verdict in a
              workbook.
            </p>
            <ul className="flex flex-wrap gap-2">
              {modulesWithoutBugReport.map((module) => (
                <li
                  key={module.id}
                  className="font-tech text-[11px] px-2.5 py-1.5 rounded-lg bg-canvas-surface border border-orange-200 text-ink"
                >
                  <span className="text-orange-700 font-bold">{module.id}</span>{' '}
                  {module.module}{' '}
                  <span className="text-orange-700 font-bold tabular-nums">
                    {module.failures} failures
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Defects by module */}
        <Reveal className="mt-4">
          <div className="rounded-2xl border border-canvas-border bg-canvas-surface p-5 sm:p-6">
            <h3 className="font-tech text-[10px] tracking-ultra uppercase text-ink-subtle mb-5">
              Defects logged by module
            </h3>
            <div className="space-y-2.5">
              {defectsByModule.map((row) => {
                const max = Math.max(
                  ...defectsByModule.map((r) => r.total),
                  1
                );
                return (
                  <div key={row.id} className="flex items-center gap-3 sm:gap-4">
                    <span className="w-32 sm:w-48 shrink-0 text-xs text-ink-muted truncate">
                      <span className="font-tech text-ink-ghost mr-1.5">
                        {row.id}
                      </span>
                      {row.shortName}
                    </span>
                    <span className="flex-1 min-w-0 h-2 rounded-full bg-canvas-muted overflow-hidden">
                      <span
                        className={`block h-full rounded-full ${
                          row.hasBugReport ? 'bg-accent' : 'bg-orange-400'
                        }`}
                        style={{ width: `${(row.total / max) * 100}%` }}
                      />
                    </span>
                    <span className="font-tech text-[10px] text-ink-subtle shrink-0 w-28 text-right tabular-nums">
                      {row.total} logged · {row.failed} failed
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] font-tech text-ink-ghost mt-4 leading-relaxed">
              An orange bar marks a module that produced failures without
              delivering a bug report.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          {/* Severity & triage */}
          <Reveal className="lg:col-span-6" delay={0.05}>
            <div className="rounded-2xl border border-canvas-border bg-canvas-surface p-5 sm:p-6 h-full">
              <div className="flex items-center gap-2 mb-5">
                <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
                <h3 className="font-tech text-[10px] tracking-ultra uppercase text-ink-subtle">
                  Severity scale
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                {severityScale.map((level) => (
                  <div key={level.code} className="flex gap-3">
                    <span
                      className={`w-1 rounded-full shrink-0 ${severityTone[level.code]}`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2 mb-0.5">
                        <code className="font-tech text-[10px] font-bold text-ink">
                          {level.code}
                        </code>
                        <span className="font-semibold text-sm text-ink">
                          {level.name}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted leading-relaxed">
                        {level.definition}
                      </p>
                      <p className="text-[11px] text-ink-subtle mt-0.5">
                        <strong className="text-ink font-semibold tabular-nums">
                          {level.count}
                        </strong>{' '}
                        logged at this severity
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="font-tech text-[10px] tracking-ultra uppercase text-ink-subtle mb-3 pt-4 border-t border-canvas-border">
                Severity × priority triage
              </h3>

              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-[10px] min-w-[300px]">
                  <thead>
                    <tr>
                      <th className="w-8" />
                      {priorityScale.map((p) => (
                        <th
                          key={p.code}
                          className="font-tech font-normal text-ink-ghost uppercase tracking-wider pb-1.5"
                          title={p.definition}
                        >
                          {p.code}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {severityScale.map((s) => (
                      <tr key={s.code}>
                        <th
                          className="font-tech font-normal text-ink-ghost uppercase tracking-wider text-left pr-1.5"
                          title={s.definition}
                        >
                          {s.code}
                        </th>
                        {priorityScale.map((p) => {
                          const key = `${s.code}-${p.code}`;
                          const weight =
                            severityWeight[s.code] * (5 - Number(p.code[1]));
                          return (
                            <td key={key} className="p-0.5">
                              <span
                                title={triageGuidance[key]}
                                className="flex items-center justify-center h-9 rounded cursor-help text-ink font-tech transition-transform hover:scale-105"
                                style={{
                                  backgroundColor: `rgba(49, 91, 250, ${
                                    0.05 + (weight / 16) * 0.3
                                  })`,
                                }}
                              >
                                {key}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-[10px] font-tech text-ink-ghost mt-3 leading-relaxed">
                Hover any cell for the agreed triage call. Severity is how badly
                it breaks; priority is how soon it gets fixed — they are rated
                separately and on purpose.
              </p>
            </div>
          </Reveal>

          {/* Specimen report */}
          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="rounded-2xl border border-canvas-border bg-canvas-surface overflow-hidden h-full flex flex-col">
              <div className="px-5 sm:px-6 py-4 bg-ink text-canvas-surface">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-tech text-[10px] tracking-ultra uppercase text-white/50">
                    A logged defect
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <code className="font-tech text-xs text-accent">
                    {workedDefectReport.id}
                  </code>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white leading-tight">
                    {workedDefectReport.title}
                  </h3>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-3 bg-emerald-50 border-b border-emerald-200 flex items-start gap-2">
                <Bug className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                  {workedDefectReport.status}. Reproduced here exactly as written
                  in the delivered {workedDefectReport.module} bug report.
                </p>
              </div>

              <dl className="divide-y divide-canvas-border flex-1">
                {workedDefectReport.fields.map((field) => (
                  <div
                    key={field.label}
                    className={`px-5 sm:px-6 py-3 ${
                      field.emphasis === 'expected'
                        ? 'bg-emerald-50/60'
                        : field.emphasis === 'actual'
                        ? 'bg-rose-50/60'
                        : ''
                    }`}
                  >
                    <dt className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-ink-ghost mb-1">
                      {field.label}
                    </dt>
                    <dd className="text-xs text-ink-muted leading-relaxed">
                      {field.list ? (
                        <ol className="space-y-1">
                          {field.list.map((step, i) => (
                            <li key={step} className="flex gap-2">
                              <span className="font-tech text-ink-ghost shrink-0">
                                {i + 1}.
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      ) : (
                        field.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
