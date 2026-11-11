import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from '../lib/router';
import { Reveal } from '../components/Reveal';
import {
  crossModule,
  moduleStories,
  reportDate,
  teamName,
  projectName,
} from '../data/toolshop';
import type { ModuleStory, SeverityCounts, TestArea } from '../data/toolshop';

/**
 * The delivered dashboard, rendered on the site.
 *
 * This is a port of "06 Dashboard/index.html" rather than a new design: the
 * same panel, the same subheads in the same order, the same KPI tiles, rings,
 * bars and tables, so the page here and the file the team hands over are one
 * artefact. Its styling lives under `.tsd` in src/styles/index.css, lifted
 * from that file's stylesheet.
 *
 * Figures come from the generated data, which is produced from the very same
 * JSON the original reads at runtime.
 */

const CROSS = 'X-MOD';

/** "US-004" -> "04", matching the chapter numbering of the house style. */
const ix = (id: string) =>
  String(Number(String(id).replace(/\D/g, '')) || 0).padStart(2, '0');

const n = (v: number | null | undefined) =>
  v == null ? '—' : Number(v).toLocaleString('en-GB');
const pct = (v: number | null) => (v == null ? '—' : `${v}%`);

/** A tile is only coloured when it has something to report; a zero stays quiet. */
const k = (v: number, cls: string) => (v ? ` is-${cls}` : ' is-zero');

const STATE_TONE: Record<string, string> = {
  Complete: 'pass',
  'Partial coverage': 'blocked',
  'No bug report': 'blocked',
  'Not executed': 'notrun',
  'No coverage': 'fail',
};

type Cell = { v: string; cls?: string; html?: React.ReactNode };
const tone = (v: number, cls: string): Cell =>
  v ? { v: String(v), cls } : { v: '0', cls: 'zero' };
const z = (v: number): Cell => (v ? { v: String(v) } : { v: '0', cls: 'zero' });

const Subhead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="subhead">{children}</div>
);

const Kpi: React.FC<{ label: string; value: React.ReactNode; tone?: string }> = ({
  label,
  value,
  tone: t,
}) => (
  <div className={`kpi${t ?? ''}`}>
    <dt>{label}</dt>
    <dd>{value}</dd>
  </div>
);

/** The stacked bar plus its legend. Segments of zero are dropped entirely. */
const Bar: React.FC<{
  total: number;
  parts: Array<{ cls: string; label: string; value: number }>;
  label: string;
}> = ({ total, parts, label }) => {
  if (!total) return null;
  const shown = parts.filter((p) => p.value > 0);
  return (
    <>
      <div className="bar" role="img" aria-label={label}>
        {shown.map((p) => (
          <i
            key={p.cls}
            className={p.cls}
            style={{ width: `${((p.value / total) * 100).toFixed(3)}%` }}
          />
        ))}
      </div>
      <div className="legend">
        {shown.map((p) => (
          <span key={p.cls}>
            <i className={`dot ${p.cls}`} />
            {p.label} <b>{p.value}</b>
          </span>
        ))}
      </div>
    </>
  );
};

const Ring: React.FC<{
  value: number | null;
  label: string;
  sub: string;
  tone: string;
}> = ({ value, label, sub, tone: t }) => {
  const r = 34;
  const C = 2 * Math.PI * r;
  const v = value == null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <figure className="ring">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle className="tr" cx="40" cy="40" r={r} fill="none" strokeWidth="9" />
        <circle
          className="vl"
          cx="40"
          cy="40"
          r={r}
          fill="none"
          strokeWidth="9"
          stroke={`var(--${t})`}
          strokeDasharray={`${((C * v) / 100).toFixed(2)} ${C.toFixed(2)}`}
        />
      </svg>
      <figcaption>
        <span className="big">{value == null ? '—' : pct(value)}</span>
        {label}
        <br />
        {sub}
      </figcaption>
    </figure>
  );
};

const Table: React.FC<{
  headers: string[];
  rows: Array<Array<string | Cell>>;
  num?: number[];
  foot?: string[];
}> = ({ headers, rows, num = [], foot }) => {
  if (!rows.length) return null;
  return (
    <div className="scroll-x">
      <table className="tbl">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={h} className={num.includes(i) ? 'num' : undefined}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, i) => {
                const c: Cell = typeof cell === 'string' ? { v: cell } : cell;
                const cls = [num.includes(i) ? 'num' : '', c.cls ?? '']
                  .filter(Boolean)
                  .join(' ');
                return (
                  <td key={i} className={cls || undefined}>
                    {c.html ?? c.v}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        {foot && (
          <tfoot>
            <tr>
              {foot.map((c, i) => (
                <td key={i} className={num.includes(i) ? 'num' : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

const sevRow = (cls: string, name: string): Cell => ({
  v: name,
  html: (
    <span className={`sev ${cls}`}>
      <i />
      {name}
    </span>
  ),
});

const SeverityTable: React.FC<{ label: string; g: SeverityCounts }> = ({ label, g }) => {
  const rows: Array<Array<string | Cell>> = [
    [sevRow('s-high', 'High'), tone(g.high, 'v-fail')],
    [sevRow('s-med', 'Medium'), tone(g.medium, 'v-blocked')],
    [sevRow('s-low', 'Low'), tone(g.low, 'v-low')],
  ];
  // Only the Home Page static review leaves findings without a severity.
  if (g.unrated) rows.push([sevRow('s-unrated', 'Unrated'), tone(g.unrated, 'v-notrun')]);
  return (
    <Table headers={[label, 'Count']} rows={rows} num={[1]} foot={['Total', String(g.total)]} />
  );
};

/**
 * Severity alone, in a third of a row, buried the two numbers that matter
 * most: how bad the logged defects are, and how many failures were never
 * written up at all. Both lead here, as they do in the original.
 */
const Defects: React.FC<{ d: ModuleStory['defects'] }> = ({ d }) => {
  if (!d.total) {
    return (
      <>
        <dl className="kpis">
          <Kpi label="Logged" value="0" tone=" is-zero" />
          {d.failuresUnlogged > 0 && (
            <Kpi
              label="Failed, never written up"
              value={n(d.failuresUnlogged)}
              tone=" is-fail"
            />
          )}
        </dl>
        <div className="arts mt">
          <span className={`chip c-${d.failuresUnlogged ? 'fail' : 'notrun'}`}>
            {d.failuresUnlogged ? 'No bug report' : 'No defects logged'}
          </span>
        </div>
      </>
    );
  }

  const p = d.priority;
  const r = d.rootCause;
  const priorityRows: Array<Array<string | Cell>> = [
    ['High', tone(p.high, 'v-fail')],
    ['Medium', tone(p.medium, 'v-blocked')],
    ['Low', tone(p.low, 'v-low')],
  ];
  if (p.unset) priorityRows.push(['Not set', tone(p.unset, 'v-notrun')]);

  return (
    <>
      <dl className="kpis">
        <Kpi label="Logged" value={n(d.total)} />
        <Kpi label="High" value={n(d.high)} tone={k(d.high, 'fail')} />
        <Kpi label="Medium" value={n(d.medium)} tone={k(d.medium, 'blocked')} />
        <Kpi label="Low" value={n(d.low)} tone={k(d.low, 'low')} />
        {d.unrated > 0 && <Kpi label="Unrated" value={n(d.unrated)} tone=" is-notrun" />}
      </dl>
      <div className="mt">
        <Bar
          total={d.total}
          label={`${d.high} high, ${d.medium} medium, ${d.low} low of ${d.total} defects`}
          parts={[
            { cls: 'h', label: 'High', value: d.high },
            { cls: 'm', label: 'Medium', value: d.medium },
            { cls: 'l', label: 'Low', value: d.low },
            { cls: 'u', label: 'Unrated', value: d.unrated },
          ]}
        />
      </div>
      <div className="grid-2 mt-lg">
        <div>
          <Subhead>Defect priority</Subhead>
          <Table
            headers={['Priority', 'Count']}
            rows={priorityRows}
            num={[1]}
            foot={['Total', String(d.total)]}
          />
        </div>
        <div>
          <Subhead>Root cause</Subhead>
          <Table
            headers={['Layer', 'Count']}
            rows={[
              ['Front end', z(r.frontEnd)],
              ['Back end', z(r.backEnd)],
              ['Not stated', z(r.unstated)],
            ]}
            num={[1]}
            foot={['Total', String(d.total)]}
          />
        </div>
      </div>
    </>
  );
};

const PanelHead: React.FC<{
  index: string;
  title: string;
  id: string;
  meta: string;
  state?: string;
}> = ({ index, title, id, meta, state }) => (
  <div className="panel-head">
    <div className="eyebrow">
      <span className="ix">{index}</span>
      <i className="rule" />
      Bug Hunters · Quality starts with our review
    </div>
    <h1>
      {title}
      <span className="dot">.</span>
    </h1>
    <div className="headline">
      <span className="story-id">{id}</span>
      <span className="meta">{meta}</span>
      {state && <span className={`chip c-${STATE_TONE[state] ?? 'notrun'}`}>{state}</span>}
    </div>
  </div>
);

const StoryPanel: React.FC<{ s: ModuleStory }> = ({ s }) => {
  const c = s.cases;
  const art = (on: boolean, L: string, label: string) => (
    <span
      key={L}
      className={`art${on ? ' on' : ''}`}
      title={`${label}${on ? '' : ' — missing'}`}
    >
      <b>{L}</b>
      {label}
    </span>
  );

  return (
    <div className="panel">
      <PanelHead
        index={ix(s.id)}
        title={s.module}
        id={s.id}
        meta={`${s.owner} · ${reportDate}`}
        state={s.stateLabel}
      />
      <div className="panel-body">
        <Subhead>Test cases</Subhead>
        <dl className="kpis">
          <Kpi label="Written" value={n(c.written)} />
          <Kpi label="Executed" value={n(c.executed)} />
          <Kpi label="Passed" value={n(c.passed)} tone={k(c.passed, 'pass')} />
          <Kpi label="Failed" value={n(c.failed)} tone={k(c.failed, 'fail')} />
          <Kpi label="Blocked" value={n(c.blocked)} tone={k(c.blocked, 'blocked')} />
          <Kpi label="Not run" value={n(c.notRun)} tone={k(c.notRun, 'notrun')} />
        </dl>
        <div className="mt">
          <Bar
            total={c.written}
            label={`${c.passed} passed, ${c.failed} failed, ${c.blocked} blocked, ${c.notRun} not run of ${c.written}`}
            parts={[
              { cls: 'p', label: 'Passed', value: c.passed },
              { cls: 'f', label: 'Failed', value: c.failed },
              { cls: 'b', label: 'Blocked', value: c.blocked },
              { cls: 'n', label: 'Not run', value: c.notRun },
            ]}
          />
        </div>

        <Subhead>Rates</Subhead>
        <div className="rings">
          <Ring
            value={c.passRate}
            label="pass rate"
            sub={`${c.passed} of ${c.executed} executed`}
            tone={
              c.passRate == null
                ? 'notrun'
                : c.passRate >= 90
                  ? 'pass'
                  : c.passRate >= 70
                    ? 'blocked'
                    : 'fail'
            }
          />
          <Ring
            value={c.execRate}
            label="executed"
            sub={`${c.executed} of ${c.written} written`}
            tone={c.execRate >= 100 ? 'pass' : c.execRate > 0 ? 'blocked' : 'notrun'}
          />
        </div>

        <Subhead>Artifacts delivered</Subhead>
        <div className="arts">
          {art(s.artifacts.story, 'S', 'User story')}
          {art(s.artifacts.cases, 'T', 'Test cases')}
          {art(s.artifacts.static, 'R', 'Static testing report')}
          {art(s.artifacts.bugReport, 'B', 'Bug report')}
          <span className="art-count">
            {s.artifacts.delivered} of {s.artifacts.of}
          </span>
        </div>

        {s.areas.length > 1 && (
          <>
            <Subhead>By test area</Subhead>
            <Table
              headers={['Area', 'Total', 'Pass', 'Fail', 'Blocked', 'Not run']}
              rows={s.areas.map((a: TestArea) => [
                a.name,
                String(a.total),
                tone(a.passed, 'v-pass'),
                tone(a.failed, 'v-fail'),
                tone(a.blocked, 'v-blocked'),
                tone(a.notRun, 'v-notrun'),
              ])}
              num={[1, 2, 3, 4, 5]}
              foot={[
                'Total',
                String(c.written),
                String(c.passed),
                String(c.failed),
                String(c.blocked),
                String(c.notRun),
              ]}
            />
          </>
        )}

        <Subhead>Defects</Subhead>
        <Defects d={s.defects} />

        <div className="grid-2 mt-lg">
          <div>
            <Subhead>Case priority</Subhead>
            <Table
              headers={['Priority', 'Count', 'Share']}
              rows={(
                [
                  ['High', s.priority.high],
                  ['Medium', s.priority.medium],
                  ['Low', s.priority.low],
                ] as Array<[string, number]>
              )
                .concat(s.priority.unset ? [['Not set', s.priority.unset]] : [])
                .map(([label, v]) => [
                  label,
                  String(v),
                  pct(+((v / c.written) * 100).toFixed(1)),
                ])}
              num={[1, 2]}
            />
          </div>
          <div>
            <Subhead>Static findings</Subhead>
            <SeverityTable label="Severity" g={s.staticFindings} />
          </div>
        </div>

        {(s.crossModule.integration.total > 0 || s.crossModule.e2e.total > 0) && (
          <>
            <Subhead>Cross-module coverage</Subhead>
            {/* Both suites report the same four outcomes. The integration
                workbook has no blocked or not-run case, but the columns stay
                so the two rows line up. */}
            <Table
              headers={['Suite', 'Total', 'Pass', 'Fail', 'Blocked', 'Not run']}
              rows={[
                ...(s.crossModule.integration.total
                  ? [
                      [
                        'Integration cases',
                        String(s.crossModule.integration.total),
                        tone(s.crossModule.integration.passed, 'v-pass'),
                        tone(s.crossModule.integration.failed, 'v-fail'),
                        tone(0, 'v-blocked'),
                        tone(0, 'v-notrun'),
                      ] as Array<string | Cell>,
                    ]
                  : []),
                ...(s.crossModule.e2e.total
                  ? [
                      [
                        'End-to-end steps',
                        String(s.crossModule.e2e.total),
                        tone(s.crossModule.e2e.passed, 'v-pass'),
                        tone(0, 'v-fail'),
                        tone(s.crossModule.e2e.blocked, 'v-blocked'),
                        tone(0, 'v-notrun'),
                      ] as Array<string | Cell>,
                    ]
                  : []),
              ]}
              num={[1, 2, 3, 4, 5]}
            />
          </>
        )}
      </div>
    </div>
  );
};

const CrossPanel: React.FC = () => {
  const i = crossModule.integration.totals;
  const e = crossModule.e2e.totals;
  return (
    <div className="panel">
      <PanelHead
        index="XM"
        title="Cross-module suites"
        id={CROSS}
        meta={`Integration and end-to-end · ${reportDate}`}
      />
      <div className="panel-body">
        <Subhead>Integration test cases</Subhead>
        <dl className="kpis">
          <Kpi label="Total" value={n(i.total)} />
          <Kpi label="Passed" value={n(i.passed)} tone={k(i.passed, 'pass')} />
          <Kpi label="Failed" value={n(i.failed)} tone={k(i.failed, 'fail')} />
        </dl>
        <div className="mt">
          <Bar
            total={i.total}
            label={`${i.passed} passed, ${i.failed} failed of ${i.total}`}
            parts={[
              { cls: 'p', label: 'Passed', value: i.passed },
              { cls: 'f', label: 'Failed', value: i.failed },
            ]}
          />
        </div>

        <Subhead>End-to-end purchase journey</Subhead>
        <dl className="kpis">
          <Kpi label="Steps" value={n(e.total)} />
          <Kpi label="Passed" value={n(e.passed)} tone={k(e.passed, 'pass')} />
          <Kpi label="Failed" value={n(0)} tone={k(0, 'fail')} />
          <Kpi label="Blocked" value={n(e.blocked)} tone={k(e.blocked, 'blocked')} />
          <Kpi label="Not run" value={n(0)} tone={k(0, 'notrun')} />
        </dl>
        <div className="mt">
          <Bar
            total={e.total}
            label={`${e.passed} passed, ${e.blocked} blocked of ${e.total}`}
            parts={[
              { cls: 'p', label: 'Passed', value: e.passed },
              { cls: 'b', label: 'Blocked', value: e.blocked },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export const TestSummaryDashboard: React.FC<{ hideHeading?: boolean }> = ({
  hideHeading,
}) => {
  const ids = [...moduleStories.map((m) => m.id), CROSS];
  const [selected, setSelected] = useState<string>(moduleStories[0].id);

  const position = ids.indexOf(selected);
  const step = (delta: number) => {
    const next = ids[position + delta];
    if (next) setSelected(next);
  };

  const story = moduleStories.find((m) => m.id === selected);

  return (
    <section
      id="dashboard"
      className="section-padding bg-canvas bg-canvas-texture border-b border-canvas-border scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {!hideHeading && (
          <h2 className="text-fluid-section-title font-display font-black text-ink uppercase mb-6">
            Test Summary Dashboard
          </h2>
        )}

        <div className="tsd mx-auto max-w-[1020px]">
          {/* The original's toolbar: step through the stories, or jump. */}
          <Reveal>
            <div className="picker mb-5">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={position <= 0}
                aria-label="Previous story"
                title="Previous story"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <select
                aria-label="Choose a user story"
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              >
                {moduleStories.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.id} — {m.module}
                  </option>
                ))}
                <option value={CROSS}>Cross-module suites</option>
              </select>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={position >= ids.length - 1}
                aria-label="Next story"
                title="Next story"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </Reveal>

          <Reveal>{story ? <StoryPanel s={story} /> : <CrossPanel />}</Reveal>

          <p className="mt-4 font-tech text-[10px] uppercase tracking-wider text-ink-subtle leading-relaxed">
            Figures only — counts and rates, read from the delivered workbooks
            and reports. {teamName} · {projectName}
          </p>
        </div>

        {/* Reached from the report, so it has to lead back to it. */}
        <Reveal>
          <Link
            to="/summary"
            className="group mt-6 inline-flex min-h-[44px] items-center gap-2.5 rounded-xl border border-canvas-border bg-canvas-surface px-4 py-2.5 no-underline transition-colors hover:border-accent"
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
