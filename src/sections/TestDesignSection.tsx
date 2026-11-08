import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Layers,
  Minus,
  XCircle,
} from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal } from '../components/Reveal';
import { illustrativeNotice, techniqueSpecimens } from '../data/testDesign';
import type { TechniqueSpecimen } from '../data/testDesign';

const panelMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const VerdictPill: React.FC<{ valid: boolean; children: React.ReactNode }> = ({
  valid,
  children,
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-tech uppercase tracking-wider border ${
      valid
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-rose-50 text-rose-700 border-rose-200'
    }`}
  >
    {valid ? (
      <CheckCircle2 className="w-3 h-3" />
    ) : (
      <XCircle className="w-3 h-3" />
    )}
    {children}
  </span>
);

const AnalysisPanel: React.FC<{ specimen: TechniqueSpecimen }> = ({ specimen }) => {
  if (specimen.partitions) {
    return (
      <div className="divide-y divide-canvas-border">
        {specimen.partitions.map((partition) => (
          <div key={partition.label} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <span className="text-sm font-semibold text-ink leading-snug">
                {partition.label}
              </span>
              <VerdictPill valid={partition.kind === 'valid'}>
                {partition.kind}
              </VerdictPill>
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <code className="font-tech bg-canvas-muted text-ink px-1.5 py-0.5 rounded">
                {partition.representative}
              </code>
              <ArrowRight className="w-3 h-3 text-ink-ghost shrink-0" />
              <span className="text-ink-muted">{partition.expected}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (specimen.boundaries) {
    return (
      <div>
        {/* Boundary number line */}
        <div className="flex items-stretch gap-1 mb-5">
          {specimen.boundaries.map((point) => (
            <div key={point.value} className="flex-1 min-w-0 text-center group">
              <div
                className={`h-1.5 rounded-full mb-2 transition-colors ${
                  point.verdict === 'valid' ? 'bg-emerald-400' : 'bg-rose-300'
                }`}
              />
              <code
                className={`block font-tech text-[10px] sm:text-xs truncate ${
                  point.verdict === 'valid' ? 'text-emerald-700' : 'text-rose-600'
                }`}
                title={point.position}
              >
                {point.value}
              </code>
            </div>
          ))}
        </div>

        <div className="divide-y divide-canvas-border">
          {specimen.boundaries.map((point) => (
            <div
              key={point.value}
              className="py-2 flex items-center justify-between gap-3 text-xs"
            >
              <span className="text-ink-muted">{point.position}</span>
              <div className="flex items-center gap-2 shrink-0">
                <code className="font-tech bg-canvas-muted text-ink px-1.5 py-0.5 rounded">
                  {point.value}
                </code>
                <VerdictPill valid={point.verdict === 'valid'}>
                  {point.verdict}
                </VerdictPill>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (specimen.decisionTable) {
    const { conditions, rules } = specimen.decisionTable;
    return (
      <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
        <table className="w-full text-xs border-collapse min-w-[460px]">
          <thead>
            <tr>
              <th className="text-left font-tech uppercase tracking-wider text-[10px] text-ink-subtle pb-2 pr-3">
                Condition
              </th>
              {rules.map((rule) => (
                <th
                  key={rule.id}
                  className="font-tech uppercase tracking-wider text-[10px] text-ink-subtle pb-2 px-2 text-center"
                >
                  {rule.id}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {conditions.map((condition, rowIndex) => (
              <tr key={condition} className="border-t border-canvas-border">
                <td className="py-2.5 pr-3 text-ink-muted leading-snug">
                  {condition}
                </td>
                {rules.map((rule) => {
                  const cell = rule.conditions[rowIndex];
                  return (
                    <td key={rule.id} className="py-2.5 px-2 text-center">
                      {cell === '—' ? (
                        <Minus className="w-3.5 h-3.5 text-ink-ghost mx-auto" />
                      ) : (
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-tech font-bold text-[11px] ${
                            cell === 'Y'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {cell}
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="border-t-2 border-ink/15">
              <td className="py-2.5 pr-3 font-tech uppercase tracking-wider text-[10px] text-ink align-top">
                Outcome
              </td>
              {rules.map((rule) => (
                <td
                  key={rule.id}
                  className="py-2.5 px-2 text-center align-top text-[11px] leading-snug"
                >
                  <span
                    className={
                      rule.outcome === 'valid' ? 'text-emerald-700' : 'text-rose-600'
                    }
                  >
                    {rule.action}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (specimen.transitions) {
    const states = Array.from(
      new Set(specimen.transitions.flatMap((t) => [t.from, t.to]))
    );

    return (
      <div>
        <div className="flex flex-wrap gap-2 mb-5">
          {states.map((state) => (
            <span
              key={state}
              className="px-3 py-1.5 rounded-lg bg-ink text-canvas-surface font-tech text-[11px] uppercase tracking-wider"
            >
              {state}
            </span>
          ))}
        </div>

        <div className="divide-y divide-canvas-border">
          {specimen.transitions.map((transition) => (
            <div
              key={`${transition.from}-${transition.event}`}
              className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-xs"
            >
              <span className="font-tech text-ink font-semibold shrink-0 w-28 truncate">
                {transition.from}
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className={`h-px flex-1 ${
                    transition.kind === 'happy' ? 'bg-accent/40' : 'bg-ink/15'
                  }`}
                />
                <span
                  className={`text-[11px] leading-snug ${
                    transition.kind === 'happy' ? 'text-accent' : 'text-ink-muted'
                  }`}
                >
                  {transition.event}
                </span>
                <ArrowRight
                  className={`w-3.5 h-3.5 shrink-0 ${
                    transition.kind === 'happy' ? 'text-accent' : 'text-ink-ghost'
                  }`}
                />
              </div>
              <span className="font-tech text-ink font-semibold shrink-0 w-28 truncate sm:text-right">
                {transition.to}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

interface TestDesignSectionProps {
  /** Detail pages render their own title block, so the inline header is dropped. */
  hideHeading?: boolean;
}

export const TestDesignSection: React.FC<TestDesignSectionProps> = ({
  hideHeading = false,
}) => {
  const [activeId, setActiveId] = useState(techniqueSpecimens[0].id);
  const specimen =
    techniqueSpecimens.find((t) => t.id === activeId) ?? techniqueSpecimens[0];

  return (
    <section
      id="test-design"
      className="section-padding bg-canvas border-b border-canvas-border scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {!hideHeading && (
          <SectionHeading
            index="05"
            eyebrow="Test Design Lab"
            title="How We Derive Tests"
            description="Test cases are not invented — they are derived. Each example below applies a formal design technique to a real Toolshop module. These illustrate the method; they are not the delivered case workbooks."
          />
        )}

        {/* Technique selector */}
        <Reveal className={hideHeading ? '' : 'mt-8'}>
          <div
            role="tablist"
            aria-label="Test design techniques"
            // snap + a visible edge: four tabs do not fit a phone, and
            // no-scrollbar removes the only hint that more exist.
            className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1 -mx-1 px-1"
          >
            {techniqueSpecimens.map((technique) => {
              const isActive = technique.id === activeId;
              return (
                <button
                  key={technique.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveId(technique.id)}
                  className={`group shrink-0 snap-start min-h-[44px] text-left px-4 py-3 rounded-xl border transition-all duration-300 ${
                    isActive
                      ? 'bg-ink text-canvas-surface border-ink shadow-md'
                      : 'bg-canvas-surface text-ink border-canvas-border hover:border-accent/50 hover:-translate-y-0.5'
                  }`}
                >
                  <span
                    className={`block font-tech text-[10px] tracking-ultra uppercase mb-1 ${
                      isActive ? 'text-accent' : 'text-ink-ghost'
                    }`}
                  >
                    {technique.abbreviation}
                  </span>
                  <span className="block font-display font-bold text-sm whitespace-nowrap">
                    {technique.name}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div key={specimen.id} {...panelMotion} className="mt-6">
            {/* Context strip */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              <div className="lg:col-span-7 rounded-2xl border border-canvas-border bg-canvas-surface p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FlaskConical className="w-4 h-4 text-accent shrink-0" />
                  <span className="font-tech text-[10px] tracking-ultra uppercase text-ink-subtle">
                    Illustrated against
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2 mb-2">
                  <code className="font-tech text-xs bg-accent/10 text-accent px-2 py-0.5 rounded">
                    {specimen.moduleId}
                  </code>
                  <h3 className="font-display font-bold text-lg text-ink">
                    {specimen.moduleName}
                  </h3>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed mb-3">
                  {specimen.underTest}
                </p>
                <p className="text-xs text-ink-subtle leading-relaxed border-l-2 border-canvas-muted pl-3">
                  {specimen.rationale}
                </p>
              </div>

              {/* What the module actually returned + reduction */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="rounded-2xl border border-canvas-border bg-canvas-muted/50 p-5 flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-accent shrink-0" />
                    <span className="font-tech text-[10px] tracking-ultra uppercase text-ink-subtle">
                      What this module returned
                    </span>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    {specimen.actualResult}
                  </p>
                </div>

                {specimen.reduction && (
                  <div className="rounded-2xl border border-canvas-border bg-ink text-canvas-surface p-5">
                    <span className="font-tech text-[10px] tracking-ultra uppercase text-white/50 block mb-3">
                      Coverage economics
                    </span>
                    {/* Both halves are prose-length ("5 classes → 4 cases"),
                        so on a phone the row has to wrap rather than run off
                        the card. */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2.5">
                      <span className="font-display font-black text-base sm:text-xl text-white/40 line-through">
                        {specimen.reduction.exhaustive}
                      </span>
                      <ArrowRight className="w-4 h-4 text-accent shrink-0" />
                      <span className="font-display font-black text-base sm:text-xl text-accent">
                        {specimen.reduction.designed}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/55 leading-relaxed">
                      {specimen.reduction.note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis + derived cases */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5 rounded-2xl border border-canvas-border bg-canvas-surface p-5">
                <div className="flex items-center gap-2 pb-4 mb-4 border-b border-canvas-border">
                  <Layers className="w-4 h-4 text-accent shrink-0" />
                  <h4 className="font-tech text-[10px] tracking-ultra uppercase text-ink">
                    Step 1 — Analysis
                  </h4>
                </div>
                <AnalysisPanel specimen={specimen} />
              </div>

              <div className="lg:col-span-7 rounded-2xl border border-canvas-border bg-canvas-surface p-5">
                <div className="flex items-center justify-between gap-2 pb-4 mb-4 border-b border-canvas-border">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-accent shrink-0" />
                    <h4 className="font-tech text-[10px] tracking-ultra uppercase text-ink">
                      Step 2 — Derived test cases
                    </h4>
                  </div>
                  <span className="font-tech text-[10px] text-ink-ghost uppercase tracking-wider">
                    {specimen.cases.length} designed
                  </span>
                </div>

                <div className="space-y-3">
                  {specimen.cases.map((testCase) => (
                    <details
                      key={testCase.id}
                      className="group rounded-xl border border-canvas-border bg-canvas hover:border-accent/40 transition-colors"
                    >
                      <summary className="flex items-start gap-3 p-3.5 cursor-pointer list-none">
                        <code className="font-tech text-[10px] bg-ink text-canvas-surface px-2 py-1 rounded shrink-0 mt-0.5">
                          {testCase.id}
                        </code>
                        <span className="flex-1 min-w-0 text-sm text-ink font-medium leading-snug">
                          {testCase.title}
                        </span>
                        <span className="flex items-center gap-1.5 shrink-0">
                          {testCase.negative && (
                            <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                              Neg
                            </span>
                          )}
                          <span
                            className={`font-tech text-[10px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                              testCase.priority === 'High'
                                ? 'bg-accent/10 text-accent border-accent/25'
                                : 'bg-canvas-muted text-ink-muted border-canvas-border'
                            }`}
                          >
                            {testCase.priority}
                          </span>
                        </span>
                      </summary>

                      <div className="px-3.5 pb-4 pt-1 space-y-3 text-xs border-t border-canvas-border/70 mt-1">
                        <div className="pt-3">
                          <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-ink-ghost block mb-1">
                            Precondition
                          </span>
                          <p className="text-ink-muted leading-relaxed">
                            {testCase.precondition}
                          </p>
                        </div>

                        <div>
                          <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-ink-ghost block mb-1.5">
                            Steps
                          </span>
                          <ol className="space-y-1">
                            {testCase.steps.map((step, i) => (
                              <li
                                key={step}
                                className="flex gap-2 text-ink-muted leading-relaxed"
                              >
                                <span className="font-tech text-ink-ghost shrink-0">
                                  {i + 1}.
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div>
                          <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-ink-ghost block mb-1">
                            Test data
                          </span>
                          <code className="font-tech bg-canvas-muted text-ink px-1.5 py-0.5 rounded">
                            {testCase.data}
                          </code>
                        </div>

                        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5">
                          <span className="font-tech text-[10px] sm:text-[9px] uppercase tracking-ultra text-emerald-700 block mb-1">
                            Expected result
                          </span>
                          <p className="text-emerald-900/85 leading-relaxed">
                            {testCase.expected}
                          </p>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <Reveal className="mt-6">
          <p className="text-[11px] font-tech text-amber-800 leading-relaxed border border-amber-200 bg-amber-50 rounded-xl px-4 py-3">
            <strong className="uppercase tracking-wider">Illustrative:</strong>{' '}
            {illustrativeNotice}
          </p>
        </Reveal>
      </div>
    </section>
  );
};
