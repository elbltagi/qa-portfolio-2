import React from 'react';
import { CheckCircle2, DoorOpen, Gauge, LogOut, MinusCircle, TriangleAlert, XCircle } from 'lucide-react';
import { SectionHeading } from '../components/SectionHeading';
import { Reveal, Stagger, StaggerItem } from '../components/Reveal';
import {
  artifactMatrix,
  entryCriteria,
  exitCriteria,
  qualityMetrics,
  riskRegister,
} from '../data/quality';
import type { CriterionOutcome } from '../data/quality';

/** Icon and colour for a met / partial / not-met outcome. */
const outcomeStyle: Record<
  CriterionOutcome | 'not-measured',
  { icon: typeof CheckCircle2; className: string; label: string }
> = {
  met: { icon: CheckCircle2, className: 'text-emerald-300', label: 'Met' },
  partial: { icon: MinusCircle, className: 'text-amber-300', label: 'Partial' },
  'not-met': { icon: XCircle, className: 'text-rose-300', label: 'Not met' },
  'not-measured': {
    icon: MinusCircle,
    className: 'text-white/40',
    label: 'Not measured',
  },
};

const exposureTone = (likelihood: string, impact: string) => {
  const score =
    (likelihood === 'High' ? 3 : likelihood === 'Medium' ? 2 : 1) *
    (impact === 'High' ? 3 : impact === 'Medium' ? 2 : 1);

  if (score >= 6) return { label: 'High', className: 'bg-rose-400/15 text-rose-300 border-rose-400/25' };
  if (score >= 3) return { label: 'Medium', className: 'bg-amber-400/15 text-amber-300 border-amber-400/25' };
  return { label: 'Low', className: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/25' };
};

interface MetricsSectionProps {
  /** Detail pages render their own title block, so the inline header is dropped. */
  hideHeading?: boolean;
}

export const MetricsSection: React.FC<MetricsSectionProps> = ({
  hideHeading = false,
}) => (
  <section
    id="metrics"
    className="section-padding bg-charcoal-950 text-canvas-surface border-b border-charcoal-800 scroll-mt-20"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      {!hideHeading && (
        <SectionHeading
          index="11"
          eyebrow="Governance, Metrics & Risk"
          title="How We'll Know"
          tone="dark"
          description="A test plan is only credible if it says in advance when testing may start, when it may stop, what will be measured and what could go wrong. These are those commitments, agreed before the first test runs."
        />
      )}

      {/* Entry / exit gates */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${hideHeading ? '' : 'mt-8'}`}>
        {[
          { icon: DoorOpen, title: 'Entry criteria', sub: 'Testing may begin when', items: entryCriteria },
          { icon: LogOut, title: 'Exit criteria', sub: 'Testing may stop when', items: exitCriteria },
        ].map((gate, gateIndex) => (
          <Reveal key={gate.title} delay={gateIndex * 0.07}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 h-full">
              <div className="flex items-center gap-2 mb-1">
                <gate.icon className="w-4 h-4 text-accent shrink-0" />
                <h3 className="font-display font-bold text-base text-white">
                  {gate.title}
                </h3>
              </div>
              <p className="font-tech text-[10px] uppercase tracking-ultra text-white/40 mb-5 pl-6">
                {gate.sub}
              </p>

              <ul className="space-y-3">
                {gate.items.map((criterion) => {
                  const style = outcomeStyle[criterion.outcome];
                  const Icon = style.icon;
                  return (
                    <li key={criterion.id} className="flex gap-3">
                      <Icon
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${style.className}`}
                        aria-label={style.label}
                      />
                      <span className="min-w-0">
                        <span className="text-xs text-white/70 leading-relaxed block">
                          {criterion.text}
                        </span>
                        <span className="text-[11px] text-white/45 leading-relaxed block mt-1 border-l-2 border-white/10 pl-2">
                          {criterion.evidence}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Metrics */}
      <Reveal className="mt-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-1">
            <Gauge className="w-4 h-4 text-accent shrink-0" />
            <h3 className="font-display font-bold text-base text-white">
              Metrics we commit to reporting
            </h3>
          </div>
          <p className="font-tech text-[10px] uppercase tracking-ultra text-white/40 mb-5 pl-6">
Measured from the delivered workbooks · target shown beside each
          </p>

          <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {qualityMetrics.map((metric) => (
              <StaggerItem key={metric.id}>
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 h-full hover:border-accent/35 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {metric.name}
                    </h4>
                    <span
                      className={`font-display font-black text-lg shrink-0 whitespace-nowrap tabular-nums ${
                        outcomeStyle[metric.outcome].className
                      }`}
                    >
                      {metric.measured ?? '—'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3 font-tech text-[10px] uppercase tracking-wider">
                    <span className="text-white/35">Target</span>
                    <span className="text-white/60">{metric.target}</span>
                    <span
                      className={`ml-auto px-1.5 py-0.5 rounded border border-white/10 ${
                        outcomeStyle[metric.outcome].className
                      }`}
                    >
                      {outcomeStyle[metric.outcome].label}
                    </span>
                  </div>

                  <code className="block font-tech text-[10px] text-white/50 leading-relaxed bg-black/25 rounded-lg px-2.5 py-2 mb-3">
                    {metric.formula}
                  </code>

                  <p className="text-[11px] text-white/55 leading-relaxed">
                    {metric.why}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Reveal>

      {/* Coverage matrix + risk register */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
        <Reveal className="lg:col-span-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 h-full">
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
              <h3 className="font-tech text-[10px] tracking-ultra uppercase text-white/55">
                Artifact delivery
              </h3>
            </div>

            <div className="space-y-1.5 mb-5">
              {artifactMatrix.rows.map((row) => (
                <div key={row.id} className="flex items-center gap-2 text-[11px]">
                  <code className="font-tech text-[10px] text-white/40 w-12 shrink-0">
                    {row.id}
                  </code>
                  <span className="text-white/70 truncate flex-1 min-w-0">
                    {row.shortName}
                  </span>
                  <span className="flex gap-1 shrink-0">
                    {row.delivered.map((was, i) => (
                      <span
                        key={artifactMatrix.artifacts[i]}
                        title={artifactMatrix.artifacts[i]}
                        className={`w-2 h-2 rounded-sm ${
                          was ? 'bg-emerald-400' : 'bg-rose-400/60'
                        }`}
                      />
                    ))}
                  </span>
                  <span className="font-tech text-[10px] text-white/40 w-8 text-right shrink-0 tabular-nums">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/50 leading-relaxed border-t border-white/10 pt-4">
              Squares are user story, test cases, static review and bug report, in
              that order. {artifactMatrix.note} The delivered data records no
              browser or viewport detail, so no environment matrix is claimed.
            </p>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.07}>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden h-full">
            <div className="flex items-center gap-2 px-5 sm:px-6 py-4 border-b border-white/10">
              <TriangleAlert className="w-4 h-4 text-accent shrink-0" />
              <h3 className="font-tech text-[10px] tracking-ultra uppercase text-white/55">
Risk register — every one of these materialised
              </h3>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {riskRegister.map((risk) => {
                const exposure = exposureTone(risk.likelihood, risk.impact);
                return (
                  <div
                    key={risk.id}
                    className="px-5 sm:px-6 py-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <code className="font-tech text-[10px] text-accent shrink-0 mt-0.5">
                        {risk.id}
                      </code>
                      <p className="flex-1 min-w-0 text-xs text-white/80 leading-relaxed">
                        {risk.risk}
                      </p>
                      <span
                        className={`font-tech text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${exposure.className}`}
                      >
                        {exposure.label}
                      </span>
                    </div>

                    <div className="pl-[34px]">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-1.5 font-tech text-[9px] uppercase tracking-wider text-white/35">
                        <span>Likelihood: {risk.likelihood}</span>
                        <span>Impact: {risk.impact}</span>
                      </div>
                      <p className="text-[11px] text-white/55 leading-relaxed border-l-2 border-rose-400/40 pl-3">
                        <span className="font-tech uppercase tracking-wider text-rose-300/80 mr-1.5">
                          {risk.outcome}:
                        </span>
                        {risk.whatHappened}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);
