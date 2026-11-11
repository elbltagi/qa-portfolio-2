import {
  crossModule,
  defectSeverity,
  moduleStories,
  reportDate,
  staticSeverity,
  totals,
} from './toolshop';

/**
 * Governance and measurement for a finished project.
 *
 * Every value here is measured, not targeted. Where a metric could not be
 * measured, it says so rather than showing a placeholder — and where a
 * criterion was not met, it says that too.
 */

const moduleCount = moduleStories.length;
const executedModules = moduleStories.filter((m) => m.cases.executed > 0).length;
const reviewedModules = moduleStories.filter(
  (m) => m.staticFindings.total > 0
).length;
const modulesWithBugReport = moduleStories.filter(
  (m) => m.artifacts.bugReport
).length;
const failuresWrittenUp = totals.failed - totals.failuresAwaitingWriteUp;

export type CriterionOutcome = 'met' | 'not-met' | 'partial';

export interface Criterion {
  id: string;
  text: string;
  outcome: CriterionOutcome;
  /** The measured fact behind the outcome. */
  evidence: string;
}

export const entryCriteria: Criterion[] = [
  {
    id: 'EN-1',
    text: 'A user story exists for every module in scope, with acceptance criteria agreed.',
    outcome: 'met',
    evidence: `${moduleCount} of ${moduleCount} user stories written and delivered.`,
  },
  {
    id: 'EN-2',
    text: 'Test cases are designed and mapped to their module and test area.',
    outcome: 'met',
    evidence: `${totals.cases} cases written across 53 test areas.`,
  },
  {
    id: 'EN-3',
    text: 'Stories and case workbooks are peer-reviewed before execution begins.',
    outcome: 'partial',
    evidence: `${reviewedModules} of ${moduleCount} modules were statically reviewed; ${
      moduleCount - reviewedModules
    } was not.`,
  },
  {
    id: 'EN-4',
    text: 'Each case carries a priority so coverage can be judged if execution is cut short.',
    outcome: 'met',
    evidence: 'Every case in every workbook carries a priority rating.',
  },
  {
    id: 'EN-5',
    text: 'A defect report workbook exists for each module before execution starts.',
    outcome: 'partial',
    evidence: `${modulesWithBugReport} of ${moduleCount} modules delivered a bug report.`,
  },
];

export const exitCriteria: Criterion[] = [
  {
    id: 'EX-1',
    text: 'Every written test case has been executed or formally deferred with a reason.',
    outcome: 'not-met',
    evidence: `${totals.notRun} cases were never executed and were not formally deferred.`,
  },
  {
    id: 'EX-2',
    text: 'Every module in scope has been executed at least once.',
    outcome: 'met',
    evidence: `All ${executedModules} of ${moduleCount} modules were executed. US-005 Checkout, Address and Payment was the last to run.`,
  },
  {
    id: 'EX-3',
    text: 'Every observed failure has been written up as a defect report.',
    outcome: 'not-met',
    evidence: `${totals.failuresAwaitingWriteUp} of ${totals.failed} failures were never written up.`,
  },
  {
    id: 'EX-4',
    text: 'Every module has been statically reviewed before execution.',
    outcome: 'not-met',
    evidence: `US-007 Authentication and Password Recovery has no static review findings.`,
  },
  {
    id: 'EX-5',
    text: 'Every logged finding carries a severity rating.',
    outcome: 'not-met',
    evidence: `${staticSeverity.unrated} static findings on US-001 were left unrated.`,
  },
  {
    id: 'EX-6',
    text: 'The end-to-end purchase journey completes to a confirmed order.',
    outcome: 'not-met',
    evidence: `${crossModule.e2e.totals.blocked} of ${crossModule.e2e.totals.total} steps are blocked; the journey never reached confirmation.`,
  },
  {
    id: 'EX-7',
    text: 'Test summary reporting is produced and reconciled against the workbooks.',
    outcome: 'met',
    evidence: `Per-module and project-level reports delivered ${reportDate}.`,
  },
];

export interface QualityMetric {
  id: string;
  name: string;
  formula: string;
  /** The measured value, or null where it could not be measured. */
  measured: string | null;
  target: string;
  /** Whether the measurement met the target. */
  outcome: CriterionOutcome | 'not-measured';
  why: string;
}

export const qualityMetrics: QualityMetric[] = [
  {
    id: 'req-coverage',
    name: 'Requirement coverage',
    formula: '(Modules with ≥ 1 test case ÷ modules in scope) × 100',
    measured: '100%',
    target: '100%',
    outcome: 'met',
    why: `All ${moduleCount} modules had cases written against them.`,
  },
  {
    id: 'exec-progress',
    name: 'Execution progress',
    formula: '(Cases executed ÷ cases written) × 100',
    measured: `${totals.execRate}%`,
    target: '100%',
    outcome: 'not-met',
    why: `${totals.notRun} of ${totals.cases} cases were never run.`,
  },
  {
    id: 'pass-rate',
    name: 'Pass rate of executed cases',
    formula: '(Cases passed ÷ cases executed) × 100',
    measured: `${totals.passRate}%`,
    target: 'Reported, not targeted',
    outcome: 'met',
    why: `${totals.passed} passed of ${totals.executed} executed. This excludes the ${totals.notRun} never run — it is not a coverage figure.`,
  },
  {
    id: 'defect-density',
    name: 'Defect density',
    formula: 'Defects logged ÷ modules executed',
    measured: `${(defectSeverity.total / executedModules).toFixed(1)} per module`,
    target: 'Reported per module',
    outcome: 'met',
    why: `${defectSeverity.total} defects across ${executedModules} executed modules; Registration alone accounts for ${
      moduleStories.find((m) => m.id === 'US-006')?.defects.total ?? 0
    }.`,
  },
  {
    id: 'writeup-coverage',
    name: 'Failure write-up coverage',
    formula: '(Failures in modules with a bug report ÷ all failures) × 100',
    measured: `${((failuresWrittenUp / totals.failed) * 100).toFixed(1)}%`,
    target: '100%',
    outcome: 'not-met',
    why: `${totals.failuresAwaitingWriteUp} failures exist only as a Failed verdict in a workbook.`,
  },
  {
    id: 'static-coverage',
    name: 'Static review coverage',
    formula: '(Modules statically reviewed ÷ modules in scope) × 100',
    measured: `${((reviewedModules / moduleCount) * 100).toFixed(0)}%`,
    target: '100%',
    outcome: 'not-met',
    why: 'US-007 Authentication and Password Recovery was never statically reviewed.',
  },
  {
    id: 'dre',
    name: 'Defect removal efficiency',
    formula: '(Defects found before release ÷ total defects found) × 100',
    measured: null,
    target: '≥ 90%',
    outcome: 'not-measured',
    why: 'Requires post-release defect data. This is a training application with no release to measure against.',
  },
  {
    id: 'reopen-rate',
    name: 'Defect reopen rate',
    formula: '(Reopened defects ÷ defects marked fixed) × 100',
    measured: null,
    target: '≤ 10%',
    outcome: 'not-measured',
    why: 'No fixes were delivered back to the team, so no defect was ever retested.',
  },
];

export type RiskOutcome = 'materialised' | 'avoided' | 'partial';

export interface RiskEntry {
  id: string;
  risk: string;
  likelihood: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  outcome: RiskOutcome;
  /** What actually happened, measured. */
  whatHappened: string;
}

export const riskRegister: RiskEntry[] = [
  {
    id: 'R-01',
    risk: 'A module is designed but never executed, leaving a silent coverage hole.',
    likelihood: 'Medium',
    impact: 'High',
    outcome: 'avoided',
    whatHappened: `Every module was executed in the end. ${totals.notRun} written case across the project was never run, in US-010 Site Preferences.`,
  },
  {
    id: 'R-02',
    risk: 'Observed failures are recorded as a verdict but never written up as defects.',
    likelihood: 'Medium',
    impact: 'High',
    outcome: 'materialised',
    whatHappened: `US-008 and US-009 produced ${totals.failuresAwaitingWriteUp} failures between them and delivered no bug report.`,
  },
  {
    id: 'R-03',
    risk: 'Static review is skipped under time pressure, so defects are found later and cost more.',
    likelihood: 'Medium',
    impact: 'Medium',
    outcome: 'materialised',
    whatHappened:
      'US-007 Authentication and Password Recovery was executed without any static review.',
  },
  {
    id: 'R-04',
    risk: 'The end-to-end journey cannot complete because account creation or payment blocks it.',
    likelihood: 'High',
    impact: 'High',
    outcome: 'materialised',
    whatHappened: `${crossModule.e2e.totals.blocked} of ${crossModule.e2e.totals.total} journey steps are blocked. The run stopped before creating an account, entering a password and confirming payment.`,
  },
  {
    id: 'R-05',
    risk: 'Module handovers are weaker than the modules themselves.',
    likelihood: 'Medium',
    impact: 'High',
    outcome: 'materialised',
    whatHappened: `${crossModule.integration.totals.failed} of ${crossModule.integration.totals.total} integration cases failed — a ${Math.round(
      (crossModule.integration.totals.failed /
        crossModule.integration.totals.total) *
        100
    )}% failure rate against ${(100 - totals.passRate).toFixed(1)}% for module-level cases.`,
  },
  {
    id: 'R-06',
    risk: 'Findings are logged without a severity, so they cannot be prioritised.',
    likelihood: 'Low',
    impact: 'Medium',
    outcome: 'materialised',
    whatHappened: `${staticSeverity.unrated} static findings on US-001 Home Page carry no severity. They are reported as Unrated, not folded into Low.`,
  },
];

/**
 * Artifact delivery per module. The delivered data records which of the four
 * artifacts each module produced; it does not record browsers or viewports, so
 * no environment matrix is claimed here.
 */
export const artifactMatrix = {
  artifacts: ['User story', 'Test cases', 'Static review', 'Bug report'] as const,
  rows: moduleStories.map((story) => ({
    id: story.id,
    module: story.module,
    shortName: story.shortName,
    delivered: [
      story.artifacts.story,
      story.artifacts.cases,
      story.artifacts.static,
      story.artifacts.bugReport,
    ],
    count: `${story.artifacts.delivered}/${story.artifacts.of}`,
  })),
  note: `${moduleStories.filter((s) => s.artifacts.delivered === s.artifacts.of).length} of ${moduleCount} modules delivered all four artifacts.`,
};
