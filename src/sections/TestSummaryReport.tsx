import React from 'react';
import { Reveal } from '../components/Reveal';
import { SectionHeading } from '../components/SectionHeading';
import {
  entryCriteria,
  exitCriteria,
  qualityMetrics,
  riskRegister,
  artifactMatrix,
} from '../data/quality';
import {
  crossModule,
  defectSeverity,
  moduleStories,
  reportDate,
  staticSeverity,
  teamName,
  totals,
  appUrl,
  areaCount,
} from '../data/toolshop';

/**
 * The test summary report, laid out as the document it is.
 *
 * Every other page on this site is something to operate — filters, tabs,
 * expandable rows. This one is the opposite on purpose: a single column read
 * top to bottom, numbered like a printed report, with nothing to click. The
 * only thing asked of the reader is that they reach the bottom.
 *
 * Every figure is derived here from the delivered data, never typed, so the
 * report cannot drift from the workbooks it reports on.
 */

interface TestSummaryReportProps {
  hideHeading?: boolean;
}

/** One numbered clause of the report. */
const Clause: React.FC<{
  n: string;
  title: string;
  children: React.ReactNode;
}> = ({ n, title, children }) => (
  <Reveal>
    <section className="border-t border-ink/15 pt-6 sm:pt-8">
      <div className="flex items-baseline gap-3 sm:gap-5 mb-4 sm:mb-5">
        <span className="font-tech text-[11px] text-accent shrink-0 tabular-nums">
          §{n}
        </span>
        <h2 className="font-display font-black uppercase tracking-tight text-base sm:text-lg text-ink">
          {title}
        </h2>
      </div>
      <div className="sm:pl-[3.1rem]">{children}</div>
    </section>
  </Reveal>
);

/** A met / not-met mark, never colour alone. */
const Mark: React.FC<{ ok: boolean; partial?: boolean }> = ({ ok, partial }) => (
  <span
    aria-hidden="true"
    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-tech text-[11px] leading-none ${
      ok
        ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
        : partial
          ? 'border-amber-300 bg-amber-50 text-amber-700'
          : 'border-rose-300 bg-rose-50 text-rose-700'
    }`}
  >
    {ok ? '✓' : partial ? '~' : '✕'}
  </span>
);

export const TestSummaryReport: React.FC<TestSummaryReportProps> = ({
  hideHeading,
}) => {
  const metExit = exitCriteria.filter((c) => c.outcome === 'met');
  const notMetExit = exitCriteria.filter((c) => c.outcome !== 'met');
  const entryMet = entryCriteria.filter((c) => c.outcome === 'met').length;
  const entryPartial = entryCriteria.filter((c) => c.outcome === 'partial').length;
  const materialised = riskRegister.filter((r) => r.outcome === 'materialised');
  const measured = qualityMetrics.filter((m) => m.measured !== null);
  const unmeasured = qualityMetrics.filter((m) => m.measured === null);

  const executedModules = moduleStories.filter((m) => m.cases.executed > 0).length;
  const noBugReport = moduleStories.filter(
    (m) => m.cases.failed > 0 && m.defects.total === 0
  );
  const noStatic = moduleStories.filter((m) => m.staticFindings.total === 0);

  // The four outcomes of every written case. They sum to totals.cases.
  const outcome = [
    { label: 'Passed', value: totals.passed, fill: 'bg-emerald-500' },
    { label: 'Failed', value: totals.failed, fill: 'bg-rose-500' },
    { label: 'Blocked', value: totals.blocked, fill: 'bg-amber-500' },
    { label: 'Never run', value: totals.notRun, fill: 'bg-ink/20' },
  ];

  const identification: Array<[string, string]> = [
    ['Report', 'TSR-01'],
    ['Application', appUrl.replace(/^https?:\/\//, '')],
    ['Prepared by', teamName],
    ['Modules in scope', `${moduleStories.length}`],
    ['Issued', reportDate],
    ['Status', 'Final'],
  ];

  return (
    <section
      id="summary"
      className="section-padding bg-canvas bg-canvas-texture border-b border-canvas-border scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {!hideHeading && (
          <SectionHeading
            index="11"
            eyebrow="The Result, Measured"
            title="Test Summary Report"
            description="What the run set out to achieve, what it achieved, and the distance between the two."
          />
        )}

        {/* The sheet. Narrow on purpose: this is prose and tables to read, not
            a dashboard to scan, and a short measure is what makes it legible. */}
        <div
          className={`mx-auto max-w-3xl bg-canvas-surface border border-ink/15 rounded-2xl sm:rounded-3xl shadow-sm px-5 py-7 sm:px-10 sm:py-10 lg:px-12 ${
            hideHeading ? '' : 'mt-8'
          }`}
        >
          {/* ---- Masthead ------------------------------------------------ */}
          <Reveal>
            <header className="pb-6 sm:pb-8">
              {/* Stacked on a phone: side by side there is only ~56px left
                  for the title next to the stamp, and the heading overflows
                  into it. From sm up, min-w-0 lets the title yield so the
                  stamp sits beside it instead of being pushed below. */}
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
                <div className="w-full min-w-0 sm:w-auto sm:flex-1">
                  <p className="font-tech text-[10px] sm:text-[11px] uppercase tracking-ultra text-accent mb-1.5">
                    Test Summary Report
                  </p>
                  <h1 className="font-display font-black uppercase tracking-tighter text-2xl sm:text-3xl lg:text-4xl text-ink leading-[1.05]">
                    Practice Software
                    <br />
                    Testing — Toolshop
                  </h1>
                </div>

                {/* The verdict, stamped. The wording is the measured fact,
                    not a grade: 6 of 7 exit criteria were not met. */}
                <div className="shrink-0 rotate-[-4deg]">
                  <div className="border-2 border-rose-500/70 rounded-lg px-3 py-2 text-center">
                    <span className="block font-display font-black uppercase text-sm sm:text-base tracking-tight text-rose-600 leading-none">
                      Exit criteria
                    </span>
                    <span className="block font-display font-black uppercase text-sm sm:text-base tracking-tight text-rose-600 leading-none mt-0.5">
                      not met
                    </span>
                    <span className="mt-1.5 block font-tech text-[9px] uppercase tracking-widest text-rose-500/80">
                      {notMetExit.length} of {exitCriteria.length}
                    </span>
                  </div>
                </div>
              </div>

              <dl className="mt-7 grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3.5 border-t border-ink/15 pt-5">
                {identification.map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <dt className="font-tech text-[10px] uppercase tracking-wider text-ink-ghost">
                      {label}
                    </dt>
                    <dd className="font-tech text-[11px] sm:text-xs text-ink mt-0.5 break-words">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </header>
          </Reveal>

          <div className="space-y-7 sm:space-y-9">
            {/* ---- §01 The result ---------------------------------------- */}
            <Clause n="01" title="The result">
              <p className="font-editorial-serif text-xl sm:text-2xl lg:text-[1.75rem] leading-[1.35] text-ink">
                The team wrote{' '}
                <strong className="font-semibold">{totals.cases} test cases</strong>{' '}
                across {moduleStories.length} modules, executed{' '}
                <strong className="font-semibold">{totals.executed}</strong> of them,
                and logged{' '}
                <strong className="font-semibold">{defectSeverity.total} defects</strong>
                . Of the cases that were run,{' '}
                <strong className="font-semibold">{totals.passRate}% passed</strong> —
                but {totals.notRun} were never run at all, so this is a report on an
                incomplete run.
              </p>

              {/* Every written case, in proportion. */}
              <div className="mt-7">
                <div className="flex h-3 w-full overflow-hidden rounded-full border border-ink/10">
                  {outcome.map((part) => (
                    <div
                      key={part.label}
                      className={part.fill}
                      style={{ width: `${(part.value / totals.cases) * 100}%` }}
                      title={`${part.label}: ${part.value}`}
                    />
                  ))}
                </div>
                <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {outcome.map((part) => (
                    <div key={part.label}>
                      <dt className="flex items-center gap-1.5 font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
                        <span
                          className={`h-2 w-2 rounded-full ${part.fill}`}
                          aria-hidden="true"
                        />
                        {part.label}
                      </dt>
                      <dd className="font-display font-black text-xl sm:text-2xl text-ink tabular-nums mt-0.5">
                        {part.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Clause>

            {/* ---- §02 Scope --------------------------------------------- */}
            <Clause n="02" title="What was tested">
              <p className="text-sm sm:text-base text-ink-muted font-light leading-relaxed">
                {moduleStories.length} modules of the live storefront, broken into{' '}
                {areaCount} test areas, each owned by one member of the team. Testing
                was carried out by hand through the browser. No API, database or
                mobile testing was performed, and no automated suite was written.
              </p>

              {/* Which of the four artefacts each module actually produced. */}
              <div className="mt-6 border border-ink/10 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-canvas-muted/50 border-b border-ink/10">
                  <span className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
                    Artefacts delivered per module
                  </span>
                  <span className="font-tech text-[10px] text-ink-subtle">
                    {artifactMatrix.artifacts.join(' · ')}
                  </span>
                </div>
                <ul>
                  {artifactMatrix.rows.map((row) => (
                    <li
                      key={row.id}
                      className="flex items-center gap-3 px-4 py-2 border-b border-ink/[0.07] last:border-b-0"
                    >
                      <code className="font-tech text-[10px] text-accent shrink-0 w-[3.5rem]">
                        {row.id}
                      </code>
                      <span className="text-xs text-ink-muted truncate flex-1 min-w-0">
                        {row.shortName}
                      </span>
                      <span className="flex gap-1 shrink-0" aria-hidden="true">
                        {row.delivered.map((done, i) => (
                          <span
                            key={artifactMatrix.artifacts[i]}
                            title={artifactMatrix.artifacts[i]}
                            className={`h-2.5 w-2.5 rounded-sm ${
                              done ? 'bg-accent' : 'bg-ink/15'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="font-tech text-[10px] text-ink-subtle tabular-nums shrink-0 w-8 text-right">
                        {row.count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-2.5 font-tech text-[10px] text-ink-subtle">
                {artifactMatrix.note}
              </p>
            </Clause>

            {/* ---- §03 Variances ----------------------------------------- */}
            <Clause n="03" title="Where the run fell short of the plan">
              <ul className="space-y-3.5">
                {[
                  `${totals.notRun} written case was never run, in US-010 Site Preferences. Every other case across all ${executedModules} modules was executed.`,
                  `${totals.failuresAwaitingWriteUp} observed failures were never written up as defects — ${noBugReport
                    .map((m) => m.id)
                    .join(' and ')} have no bug report at all.`,
                  `${noStatic.length} module was never statically reviewed: ${noStatic
                    .map((m) => `${m.id} ${m.shortName}`)
                    .join(', ')}.`,
                  `The end-to-end purchase journey is ${crossModule.e2e.totals.blocked} of ${crossModule.e2e.totals.total} steps blocked; it never reached a confirmed order.`,
                  `${crossModule.integration.totals.failed} of ${crossModule.integration.totals.total} cross-module integration cases failed.`,
                  `${staticSeverity.unrated} static findings carry no severity rating and are reported as unrated.`,
                  'Three planned weeks — API, mobile and database testing, and both automation weeks — were never carried out.',
                ].map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      className="mt-[0.6rem] h-1 w-3 shrink-0 bg-rose-400"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-ink-muted font-light leading-relaxed">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </Clause>

            {/* ---- §04 Defects ------------------------------------------- */}
            <Clause n="04" title="Defects">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { v: defectSeverity.total, l: 'Logged' },
                  { v: defectSeverity.high, l: 'High' },
                  { v: defectSeverity.medium, l: 'Medium' },
                  { v: defectSeverity.low, l: 'Low' },
                ].map((d) => (
                  <div key={d.l}>
                    <span className="block font-display font-black text-2xl sm:text-3xl text-ink tabular-nums">
                      {d.v}
                    </span>
                    <span className="block font-tech text-[10px] uppercase tracking-wider text-ink-subtle mt-0.5">
                      {d.l}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm text-ink-muted font-light leading-relaxed">
                {staticSeverity.total} further findings came from static review before
                execution. No fix was delivered back to the team during the project, so
                no defect was retested or closed, and neither defect removal efficiency
                nor reopen rate could be measured.
              </p>
            </Clause>

            {/* ---- §05 Exit criteria ------------------------------------- */}
            <Clause n="05" title="Entry and exit criteria">
              {/* Entry criteria carry their verdict but not their evidence:
                  they gate the start of testing, and by the time a summary
                  report is written what matters is how the run ended. */}
              <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle mb-3">
                Entry — {entryMet} met, {entryPartial} partial
              </p>
              <ul className="space-y-2 mb-7">
                {entryCriteria.map((criterion) => (
                  <li key={criterion.id} className="flex gap-3">
                    <Mark
                      ok={criterion.outcome === 'met'}
                      partial={criterion.outcome === 'partial'}
                    />
                    <p className="text-sm text-ink-muted font-light leading-snug">
                      {criterion.text}
                    </p>
                  </li>
                ))}
              </ul>

              <p className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle mb-3">
                Exit — {metExit.length} met, {notMetExit.length} not met
              </p>
              <ul className="space-y-4">
                {exitCriteria.map((criterion) => (
                  <li key={criterion.id} className="flex gap-3">
                    <Mark ok={criterion.outcome === 'met'} partial={criterion.outcome === 'partial'} />
                    <div className="min-w-0">
                      <p className="text-sm text-ink leading-snug">
                        <code className="font-tech text-[10px] text-ink-ghost mr-2">
                          {criterion.id}
                        </code>
                        {criterion.text}
                      </p>
                      <p className="mt-1 text-xs text-ink-subtle font-light leading-relaxed">
                        {criterion.evidence}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Clause>

            {/* ---- §06 Measured ------------------------------------------ */}
            <Clause n="06" title="What was measured">
              <ul className="divide-y divide-ink/10 border-y border-ink/10">
                {measured.map((metric) => (
                  <li
                    key={metric.id}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-2.5"
                  >
                    <span className="text-sm text-ink">{metric.name}</span>
                    <span className="flex items-baseline gap-2.5 font-tech text-xs">
                      <span className="text-ink-ghost">{metric.target}</span>
                      <span
                        className={
                          metric.outcome === 'met'
                            ? 'text-emerald-700 font-bold'
                            : 'text-rose-600 font-bold'
                        }
                      >
                        {metric.measured}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
              {unmeasured.length > 0 && (
                <p className="mt-3 font-tech text-[11px] text-ink-subtle leading-relaxed">
                  Not measured:{' '}
                  {unmeasured.map((m) => m.name.toLowerCase()).join(', ')} — no fix was
                  returned during the project, so there was nothing to retest.
                </p>
              )}
            </Clause>

            {/* ---- §07 Risks --------------------------------------------- */}
            <Clause n="07" title="Risks">
              <p className="text-sm text-ink-muted font-light leading-relaxed mb-4">
                {materialised.length} of {riskRegister.length} registered risks
                materialised.
              </p>
              <ul className="space-y-3">
                {riskRegister.map((risk) => (
                  <li key={risk.id} className="flex gap-3">
                    <Mark ok={risk.outcome === 'avoided'} partial={risk.outcome === 'partial'} />
                    <div className="min-w-0">
                      <p className="text-sm text-ink leading-snug">{risk.risk}</p>
                      <p className="mt-1 text-xs text-ink-subtle font-light leading-relaxed">
                        {risk.whatHappened}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </Clause>

            {/* ---- §08 Conclusion ---------------------------------------- */}
            <Clause n="08" title="Conclusion">
              <p className="font-editorial-serif text-lg sm:text-xl leading-[1.45] text-ink">
                On the evidence of this run, the application cannot be signed off.
                Execution is effectively complete at {totals.execRate}%, but{' '}
                {totals.failed} of the {totals.executed} cases run returned a failure,
                and the end-to-end purchase journey still never reached a confirmed
                order.
              </p>
              <p className="mt-4 text-sm text-ink-muted font-light leading-relaxed">
                What the run establishes is {totals.executed} executed cases across all{' '}
                {executedModules} modules at a {totals.passRate}% pass rate, and{' '}
                {defectSeverity.total} defects documented well enough to reproduce. The
                recommendation is to write up the {totals.failuresAwaitingWriteUp}{' '}
                outstanding failures in {noBugReport.map((m) => m.id).join(' and ')},
                statically review {noStatic.map((m) => m.id).join(', ')}, and unblock
                the end-to-end journey before any release decision is taken.
              </p>

              {/* Sign-off, as a document ends. */}
              <div className="mt-8 pt-5 border-t border-ink/15 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="block font-display font-bold text-sm text-ink">
                    {teamName}
                  </span>
                  <span className="block font-tech text-[10px] uppercase tracking-wider text-ink-subtle mt-0.5">
                    DEPI · Software Testing Track
                  </span>
                </div>
                <span className="font-tech text-[10px] uppercase tracking-wider text-ink-subtle">
                  Issued {reportDate}
                </span>
              </div>
            </Clause>
          </div>
        </div>
      </div>
    </section>
  );
};
