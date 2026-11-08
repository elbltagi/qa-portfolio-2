import { defectSeverity, moduleStories, totals } from './toolshop';

/**
 * Defect management as it was actually practised on this project.
 *
 * The lifecycle and the severity/priority scales are the methodology the team
 * worked to. The counts and the worked example are real: the example below is
 * DEF-1 from the delivered Shopping Cart bug report, reproduced as written.
 */

export interface LifecycleState {
  id: string;
  name: string;
  owner: string;
  description: string;
  next: string[];
  kind: 'open' | 'progress' | 'verify' | 'closed' | 'rejected';
}

export const defectLifecycle: LifecycleState[] = [
  {
    id: 'new',
    name: 'New',
    owner: 'Tester',
    description:
      'A failure has been observed during execution and written up with reproduction steps, expected and actual behaviour, and evidence.',
    next: ['triaged'],
    kind: 'open',
  },
  {
    id: 'triaged',
    name: 'Triaged',
    owner: 'Team lead',
    description:
      'Severity and priority are agreed, duplicates are merged, and the report is checked for reproducibility.',
    next: ['assigned', 'rejected', 'deferred'],
    kind: 'open',
  },
  {
    id: 'assigned',
    name: 'Assigned',
    owner: 'Developer',
    description:
      'Ownership is accepted and the defect is scheduled into a fix cycle.',
    next: ['fixed'],
    kind: 'progress',
  },
  {
    id: 'fixed',
    name: 'Fixed',
    owner: 'Developer',
    description:
      'A change has been made and handed back with a note on what was altered.',
    next: ['retest'],
    kind: 'progress',
  },
  {
    id: 'retest',
    name: 'Retest',
    owner: 'Tester',
    description:
      'The original steps are re-executed on the new build, followed by confirmation and regression checks around the change.',
    next: ['closed', 'reopened'],
    kind: 'verify',
  },
  {
    id: 'reopened',
    name: 'Reopened',
    owner: 'Tester',
    description:
      'The failure still reproduces. The report returns to the developer with the new evidence appended.',
    next: ['assigned'],
    kind: 'open',
  },
  {
    id: 'closed',
    name: 'Closed',
    owner: 'Tester',
    description:
      'Confirmation testing passed and no regression was introduced nearby. The defect is retired.',
    next: [],
    kind: 'closed',
  },
  {
    id: 'deferred',
    name: 'Deferred',
    owner: 'Team lead',
    description:
      'Genuine but out of scope for this cycle. Recorded with a reason so it is not silently lost.',
    next: [],
    kind: 'rejected',
  },
  {
    id: 'rejected',
    name: 'Rejected',
    owner: 'Team lead',
    description:
      'Not a defect: works as specified, environment-specific, or a duplicate of an existing report.',
    next: [],
    kind: 'rejected',
  },
];

/**
 * How far this project actually got through that lifecycle. No fix was ever
 * delivered back, so nothing reached Retest or Closed.
 */
export const lifecycleReached = {
  reached: ['new', 'triaged'],
  note: `All ${defectSeverity.total} defects were written up and rated. No fix was delivered back to the team during the project, so no defect was retested or closed.`,
};

export interface SeverityLevel {
  code: string;
  name: string;
  definition: string;
  /** Number of logged defects at this severity. */
  count: number;
}

export const severityScale: SeverityLevel[] = [
  {
    code: 'High',
    name: 'High',
    definition:
      'A core flow cannot be completed, or data is wrong in a way the customer would act on.',
    count: defectSeverity.high,
  },
  {
    code: 'Medium',
    name: 'Medium',
    definition:
      'A function behaves incorrectly but the customer can still complete the flow another way.',
    count: defectSeverity.medium,
  },
  {
    code: 'Low',
    name: 'Low',
    definition:
      'Presentation, wording or a minor behaviour that inconveniences without blocking.',
    count: defectSeverity.low,
  },
  {
    code: 'Unrated',
    name: 'Unrated',
    definition:
      'Logged without a severity. Reported separately rather than assumed to be Low.',
    count: defectSeverity.unrated,
  },
];

export const priorityScale = [
  { code: 'P1', name: 'Immediate', definition: 'Blocks further testing; fix before the next run.' },
  { code: 'P2', name: 'High', definition: 'Fix within the current testing cycle.' },
  { code: 'P3', name: 'Medium', definition: 'Schedule into a later cycle before submission.' },
  { code: 'P4', name: 'Low', definition: 'Fix if capacity allows.' },
];

export const triageGuidance: Record<string, string> = {
  'High-P1': 'Stop-the-line. Escalate immediately.',
  'High-P2': 'Critical but a documented workaround exists for testers.',
  'High-P3': 'Rare path; schedule deliberately.',
  'High-P4': 'Review the rating — this pairing is usually a mistake.',
  'Medium-P1': 'Blocks a planned test run; unblock first.',
  'Medium-P2': 'Standard major defect.',
  'Medium-P3': 'Affects a secondary flow.',
  'Medium-P4': 'Low-traffic area; defer safely.',
  'Low-P1': 'Only if it blocks test progress.',
  'Low-P2': 'Visible to every customer.',
  'Low-P3': 'Standard minor defect.',
  'Low-P4': 'Backlog candidate.',
  'Unrated-P1': 'Rate it before triaging.',
  'Unrated-P2': 'Rate it before triaging.',
  'Unrated-P3': 'Rate it before triaging.',
  'Unrated-P4': 'Rate it before triaging.',
};

/** Defects logged per module, for the distribution chart. */
export const defectsByModule = moduleStories.map((story) => ({
  id: story.id,
  module: story.module,
  shortName: story.shortName,
  total: story.defects.total,
  high: story.defects.high,
  medium: story.defects.medium,
  low: story.defects.low,
  failed: story.cases.failed,
  hasBugReport: story.artifacts.bugReport,
}));

/** Modules that produced failures but delivered no bug report. */
export const modulesWithoutBugReport = moduleStories
  .filter((story) => story.cases.failed > 0 && !story.artifacts.bugReport)
  .map((story) => ({
    id: story.id,
    module: story.module,
    failures: story.cases.failed,
  }));

export interface DefectReportField {
  label: string;
  value: string;
  list?: string[];
  emphasis?: 'expected' | 'actual';
}

/**
 * A real logged defect, reproduced from the delivered Shopping Cart bug
 * report (US-004, DEF-1, dated 29 October 2026). Not a template.
 */
export const workedDefectReport = {
  id: 'DEF-1',
  module: 'US-004 Shopping Cart Management',
  title:
    'Empty cart message does not show when opening the cart page with no cart in the session',
  status: 'Logged 29 October 2026 — one of 50 defects on this project',
  fields: [
    { label: 'Module', value: 'Shopping Cart Management (US-004)' },
    { label: 'Severity', value: 'Low' },
    { label: 'Priority', value: 'Low' },
    { label: 'Root cause area', value: 'Front end' },
    {
      label: 'Description',
      value:
        'Opening the checkout page in a new session without adding any product shows the stepper and the footer only, with nothing between them. Removing the last product from a populated cart does show the empty message correctly, so only the no-cart case is affected.',
    },
    {
      label: 'Steps to reproduce',
      value: '',
      list: [
        'Open a new browser session, or clear the session storage.',
        'Go to https://practicesoftwaretesting.com/checkout directly without adding any product.',
        'Wait until the page finishes loading.',
        'Check the area under the stepper.',
      ],
    },
    {
      label: 'Expected result',
      value:
        'The message "The cart is empty. Nothing to display." is shown, as it is when the last product is removed from the cart.',
      emphasis: 'expected' as const,
    },
    {
      label: 'Actual result',
      value:
        'The page shows the CART / SIGN IN / BILLING ADDRESS / PAYMENT stepper and then the footer directly, with no table, no message and no explanation.',
      emphasis: 'actual' as const,
    },
    {
      label: 'Evidence',
      value: 'Screenshot attached to the delivered bug report workbook.',
    },
  ] as DefectReportField[],
};

/** Headline figures for the defect page. */
export const defectHeadline = {
  logged: defectSeverity.total,
  failures: totals.failed,
  awaitingWriteUp: totals.failuresAwaitingWriteUp,
  modulesReporting: moduleStories.filter((s) => s.artifacts.bugReport).length,
  moduleCount: moduleStories.length,
};
