import {
  appUrl,
  crossModule,
  defectSeverity,
  moduleStories,
  projectName,
  reportDate,
  staticSeverity,
  teamName,
  totals,
} from '../data/toolshop';
import type { ProjectStatePayload } from '../types';

/**
 * The delivered project state, assembled from the generated dashboard data in
 * src/data/toolshop.ts.
 *
 * Every figure here is either read straight from that file or derived from it
 * in this module, so nothing can drift from the delivered workbooks. There is
 * no remote source: the site ships with its own results.
 */

const executedModules = moduleStories.filter((m) => m.cases.executed > 0);
const modulesWithoutBugReport = moduleStories.filter(
  (m) => m.cases.failed > 0 && m.defects.total === 0
);
const modulesWithoutStaticReview = moduleStories.filter(
  (m) => m.staticFindings.total === 0
);

export const projectState: ProjectStatePayload = {
  projectMeta: {
    name: projectName,
    track: 'Software Testing Track',
    status: 'Execution complete',
    reportDate,
    initiative: 'Digital Egypt Pioneers Initiative (DEPI)',
    liveAppUrl: appUrl,
    fullProjectName: `${projectName} — Software Testing Project`,
    team: teamName,
    coverageNotice: `${totals.executed} of ${totals.cases} written test cases were executed (${totals.execRate}%). The ${totals.notRun} that were not run are reported as not run, never as passed.`,
  },

  projectOverview: {
    heading: `${projectName} — Test Execution Report`,
    targetUrl: appUrl,
    statusBadge: `Execution complete · ${reportDate}`,
    briefOverview: `The ${teamName} wrote ${totals.cases} test cases across ${moduleStories.length} modules of ${projectName}, executed ${totals.executed} of them, and logged ${totals.defectsLogged} defects. This report presents what was found, including the coverage that was not achieved.`,
    keyHighlights: [
      {
        label: 'Application Under Test',
        value: 'Toolshop E-Commerce',
        sub: 'practicesoftwaretesting.com',
      },
      {
        label: 'Test Cases Executed',
        value: `${totals.executed} of ${totals.cases}`,
        sub: `${totals.execRate}% of those written`,
      },
      {
        label: 'Pass Rate of Executed',
        value: `${totals.passRate}%`,
        sub: `${totals.passed} passed, ${totals.failed} failed`,
      },
      {
        label: 'Defects Logged',
        value: `${totals.defectsLogged} Confirmed`,
        sub: `${totals.failuresAwaitingWriteUp} failures never written up`,
      },
    ],
  },

  teamIntroduction: {
    heading: 'The People Behind the Quality',
    subtitle: `We are the ${teamName}, software testing trainees from DEPI. We planned, designed and executed the test effort reported on this site.`,
    members: [
      {
        id: 'team-1',
        name: 'Youssef El Beltagi',
        track: 'DEPI Software Testing',
        role: 'Team Leader',
        avatar: '/images/team/member-1.png',
        initials: 'YE',
        objectPosition: '50% 20%',
        url: 'https://eg.linkedin.com/in/youssef-elbltagi',
        linkedinUrl: 'https://eg.linkedin.com/in/youssef-elbltagi',
      },
      {
        id: 'team-2',
        name: 'Abdulrahman El Moghazy',
        track: 'DEPI Software Testing',
        avatar: '/images/team/member-2.jpeg',
        initials: 'AE',
        objectPosition: '50% 32%',
        url: 'https://www.linkedin.com/in/abdulrhman-mohamed01/',
        linkedinUrl: 'https://www.linkedin.com/in/abdulrhman-mohamed01/',
      },
      {
        id: 'team-3',
        name: 'Hend Amr',
        track: 'DEPI Software Testing',
        avatar: '/images/team/member-3.jpeg',
        initials: 'HA',
        objectPosition: '50% 20%',
        url: 'https://www.linkedin.com/in/hend-amr-502281416/',
        linkedinUrl: 'https://www.linkedin.com/in/hend-amr-502281416/',
      },
      {
        id: 'team-4',
        name: 'Mostafa El Gohary',
        track: 'DEPI Software Testing',
        avatar: '/images/team/member-4.jpeg',
        initials: 'ME',
        objectPosition: '50% 16%',
        url: 'https://www.linkedin.com/in/mostafa-elgohary-7b679a392/?isSelfProfile=false',
        linkedinUrl:
          'https://www.linkedin.com/in/mostafa-elgohary-7b679a392/?isSelfProfile=false',
      },
      {
        id: 'team-5',
        name: 'Mosad Essam',
        track: 'DEPI Software Testing',
        avatar: '/images/team/member-5.jpeg',
        initials: 'ME',
        objectPosition: '50% 48%',
      },
      {
        id: 'team-6',
        name: 'Mohammed Maher',
        track: 'DEPI Software Testing',
        avatar: '/images/team/member-6.jpeg',
        initials: 'MM',
        objectPosition: 'center 25%',
      },
    ],
  },

  moduleStories,

  // Only the disciplines the delivered artifacts actually evidence. Nothing is
  // listed here that the project did not carry out.
  testingTypes: [
    {
      id: 'type-static',
      name: 'Static Testing',
      badge: '01',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Review user stories and test cases before execution to catch ambiguity and missing criteria early.',
      approach:
        'Each module’s story and case workbook was reviewed by a second team member and findings were logged against the module.',
      outputs: `${staticSeverity.total} findings — ${staticSeverity.high} high, ${staticSeverity.medium} medium, ${staticSeverity.low} low, ${staticSeverity.unrated} left unrated.`,
      coverageNotice: `${modulesWithoutStaticReview.length} of ${moduleStories.length} modules were never statically reviewed: ${modulesWithoutStaticReview
        .map((m) => `${m.id} ${m.module}`)
        .join(', ')}.`,
    },
    {
      id: 'type-functional',
      name: 'Functional Testing',
      badge: '02',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Verify each module against its user story and acceptance criteria through the browser.',
      approach: `Manual execution of ${totals.cases} written cases across ${moduleStories.length} modules, recording a verdict per case.`,
      outputs: `${totals.executed} executed — ${totals.passed} passed, ${totals.failed} failed, ${totals.blocked} blocked.`,
      coverageNotice: `${totals.notRun} cases were never executed, ${
        moduleStories.find((m) => m.id === 'US-005')?.cases.notRun ?? 0
      } of them the entire checkout and payment module.`,
    },
    {
      id: 'type-integration',
      name: 'Integration Testing',
      badge: '03',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Verify that data and state hand over correctly where two modules meet.',
      approach:
        'A dedicated cross-module suite exercising handovers such as catalogue to cart and registration to account.',
      outputs: `${crossModule.integration.totals.total} cases — ${crossModule.integration.totals.passed} passed, ${crossModule.integration.totals.failed} failed.`,
      coverageNotice:
        'The majority of the integration suite failed, which is the weakest result in the project.',
    },
    {
      id: 'type-e2e',
      name: 'End-to-End Testing',
      badge: '04',
      status: 'Partially executed',
      wasSkipped: false,
      purpose:
        'Walk the complete purchase journey as a customer would, from catalogue to confirmed order.',
      approach: `A single ${crossModule.e2e.totals.total}-step purchase journey run end to end.`,
      outputs: `${crossModule.e2e.totals.passed} steps passed, ${crossModule.e2e.totals.blocked} blocked.`,
      coverageNotice:
        'The run stopped before creating an account, entering a password and confirming payment, so every later step is blocked rather than failed.',
    },
    {
      id: 'type-defect-reporting',
      name: 'Defect Reporting',
      badge: '05',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Turn observed failures into reproducible, severity-rated defect reports.',
      approach:
        'A bug report workbook per module, each defect carrying steps, expected and actual behaviour, and a severity.',
      outputs: `${defectSeverity.total} defects — ${defectSeverity.high} high, ${defectSeverity.medium} medium, ${defectSeverity.low} low.`,
      coverageNotice: `${totals.failuresAwaitingWriteUp} failures were never written up: ${modulesWithoutBugReport
        .map((m) => `${m.id} ${m.module}`)
        .join(' and ')} have no bug report at all.`,
    },
  ],

  testingActivitiesData: {
    static: {
      title: 'Static Testing',
      activities: [
        {
          name: 'Reviewing user stories',
          description: `All ${moduleStories.length} user stories were written and peer-reviewed before any case was designed.`,
        },
        {
          name: 'Reviewing test cases',
          description: `Case workbooks were reviewed module by module, producing ${staticSeverity.total} findings.`,
        },
        {
          name: 'Recording findings by severity',
          description: `${staticSeverity.high} high, ${staticSeverity.medium} medium and ${staticSeverity.low} low findings were rated; ${staticSeverity.unrated} were left unrated and are reported as such.`,
        },
      ],
    },
    functional: {
      title: 'Functional Testing',
      activities: [
        {
          name: 'Designing cases by test area',
          description: `${totals.cases} cases were written across 53 distinct test areas, each mapped to its module.`,
        },
        {
          name: 'Executing and recording verdicts',
          description: `${totals.executed} cases were executed and given a pass, fail or blocked verdict in the workbook.`,
        },
        {
          name: 'Prioritising coverage',
          description:
            'Each case carries a priority, so the unexecuted remainder can be judged by what it would have covered.',
        },
      ],
    },
    integration: {
      title: 'Integration Testing',
      activities: [
        {
          name: 'Exercising module handovers',
          description: `${crossModule.integration.totals.total} cross-module cases were run where two modules meet.`,
        },
        {
          name: 'Recording the failures',
          description: `${crossModule.integration.totals.failed} of ${crossModule.integration.totals.total} failed, concentrated in account and order history handovers.`,
        },
      ],
    },
    e2e: {
      title: 'End-to-End Testing',
      wasSkipped: false,
      skippedNote:
        'Completed only as far as the account creation step; the remainder is blocked, not failed.',
      activities: [
        {
          name: 'Walking the purchase journey',
          description: `A ${crossModule.e2e.totals.total}-step journey from catalogue through to order confirmation.`,
        },
        {
          name: 'Stopping honestly at the blocker',
          description: `${crossModule.e2e.totals.blocked} steps could not be reached and are recorded as blocked rather than given a verdict.`,
        },
      ],
    },
    defects: {
      title: 'Defect Reporting',
      activities: [
        {
          name: 'Writing reproducible reports',
          description: `${defectSeverity.total} defects were logged with steps, expected and actual behaviour.`,
        },
        {
          name: 'Rating severity',
          description: `${defectSeverity.high} high, ${defectSeverity.medium} medium and ${defectSeverity.low} low.`,
        },
        {
          name: 'Leaving the gap visible',
          description: `${totals.failuresAwaitingWriteUp} observed failures were never written up and exist only as a Failed verdict in a workbook.`,
        },
      ],
    },
  },

  testLevelsData: [
    {
      id: 'level-component',
      name: 'Component Testing',
      tagline: 'Individual fields and controls',
      shortName: 'Level 1: Component',
      description:
        'Single inputs and controls checked in isolation — field validation, selectors, sliders and toggles.',
      coverageNotice:
        'Covered through the UI only; no unit-level access to the application code was available.',
      outcome: `Registration field validation alone accounts for ${
        moduleStories.find((m) => m.id === 'US-006')?.cases.failed ?? 0
      } of the project’s failures.`,
    },
    {
      id: 'level-integration',
      name: 'Integration Testing',
      tagline: 'Where two modules meet',
      shortName: 'Level 2: Integration',
      description:
        'Data and state handed from one module to the next — catalogue to cart, registration to account, order to invoice.',
      coverageNotice: `Covered by a dedicated ${crossModule.integration.totals.total}-case suite plus integration areas inside module workbooks.`,
      outcome: `${crossModule.integration.totals.failed} of ${crossModule.integration.totals.total} cross-module cases failed.`,
    },
    {
      id: 'level-system',
      name: 'System Testing',
      tagline: 'Each module end to end',
      shortName: 'Level 3: System',
      description:
        'Each module exercised as a whole against its user story and acceptance criteria.',
      coverageNotice: `${executedModules.length} of ${moduleStories.length} modules were executed at this level.`,
      outcome: `${totals.passed} passed and ${totals.failed} failed across ${totals.executed} executed cases.`,
    },
    {
      id: 'level-acceptance',
      name: 'Acceptance Testing',
      tagline: 'The complete customer journey',
      shortName: 'Level 4: Acceptance',
      description:
        'The full purchase journey a real customer would follow, from browsing to a confirmed order.',
      coverageNotice:
        'Attempted once as a single end-to-end journey; not repeated after the blocker.',
      outcome: `${crossModule.e2e.totals.passed} of ${crossModule.e2e.totals.total} steps passed; the journey never reached a confirmed order.`,
    },
  ],

  // The delivery pipeline the project actually went through. These are stages,
  // not dated weeks - the delivered data records artifacts and verdicts, not a
  // calendar, so no schedule is claimed here.
  testingPhases: [
    {
      id: 'phase-stories',
      phaseNumber: '01',
      title: 'User Stories Written',
      status: 'Delivered',
      isFinal: false,
      description: `One user story per module, defining scope and acceptance criteria for the ${moduleStories.length} areas of the application under test.`,
      keyActivities: [
        `${moduleStories.length} user stories written, one per module`,
        'Acceptance criteria agreed per story',
        'Scope of each module fixed before case design',
      ],
      deliverables: `${moduleStories.length} of ${moduleStories.length} user stories delivered`,
    },
    {
      id: 'phase-cases',
      phaseNumber: '02',
      title: 'Test Cases Designed',
      status: 'Delivered',
      isFinal: false,
      description: `${totals.cases} test cases written across 53 test areas, each carrying a priority and an expected result.`,
      keyActivities: [
        `${totals.cases} cases written across 53 test areas`,
        'Each case assigned a priority',
        'Cases mapped to their module and area',
      ],
      deliverables: `${totals.cases} test cases across ${moduleStories.length} workbooks`,
    },
    {
      id: 'phase-static',
      phaseNumber: '03',
      title: 'Static Review',
      status: 'Delivered with a gap',
      isFinal: false,
      description: `Stories and case workbooks peer-reviewed before execution, producing ${staticSeverity.total} findings.`,
      keyActivities: [
        `${staticSeverity.total} findings raised across ${
          moduleStories.length - modulesWithoutStaticReview.length
        } modules`,
        `${staticSeverity.high} high, ${staticSeverity.medium} medium, ${staticSeverity.low} low`,
        `${staticSeverity.unrated} findings left without a severity rating`,
      ],
      deliverables: `${staticSeverity.total} static findings; ${modulesWithoutStaticReview.length} module never reviewed`,
    },
    {
      id: 'phase-execution',
      phaseNumber: '04',
      title: 'Execution',
      status: 'Delivered with a gap',
      isFinal: false,
      description: `${totals.executed} of ${totals.cases} cases executed through the browser, each given a recorded verdict.`,
      keyActivities: [
        `${totals.executed} cases executed (${totals.execRate}%)`,
        `${totals.passed} passed, ${totals.failed} failed, ${totals.blocked} blocked`,
        `${totals.notRun} cases never run`,
      ],
      deliverables: `${totals.passRate}% pass rate of executed cases`,
    },
    {
      id: 'phase-defects',
      phaseNumber: '05',
      title: 'Defect Reporting',
      status: 'Delivered with a gap',
      isFinal: false,
      description: `${defectSeverity.total} defects written up with reproduction steps and a severity rating.`,
      keyActivities: [
        `${defectSeverity.total} defects logged`,
        `${defectSeverity.high} high, ${defectSeverity.medium} medium, ${defectSeverity.low} low`,
        `${totals.failuresAwaitingWriteUp} failures left without a defect report`,
      ],
      deliverables: `${defectSeverity.total} defect reports across ${
        moduleStories.length - modulesWithoutBugReport.length - 1
      } modules`,
    },
    {
      id: 'phase-reporting',
      phaseNumber: '06',
      title: 'Reporting Delivered',
      status: 'Complete',
      isFinal: true,
      description: `Test summary reports and this exhibition delivered on ${reportDate}, presenting the result including the coverage that was not achieved.`,
      keyActivities: [
        'Per-module test summary reports produced',
        'Project-level totals reconciled against the workbooks',
        'Outstanding gaps stated rather than omitted',
      ],
      deliverables: `Reporting delivered ${reportDate}`,
    },
  ],
};

/**
 * Kept as a named export so the data hook reads the same way it always did.
 * There is no remote source any more - the bundled state is the only one.
 */
export const fallbackProjectState = projectState;
