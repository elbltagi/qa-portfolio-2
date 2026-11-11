import {
  appUrl,
  areaCount,
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
  // The six disciplines the project set out to use. Two were carried out and
  // four were not; the four are listed because leaving them off would hide
  // which kinds of defect this run could never have found.
  testingTypes: [
    {
      id: 'type-static',
      name: 'Static Testing',
      badge: '01',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Review user stories and test cases before execution, to catch ambiguity and missing acceptance criteria early.',
      approach:
        'Each module story and case workbook was reviewed by a second team member, and every finding was logged against the module it belonged to.',
      outputs: `${staticSeverity.total} findings — ${staticSeverity.high} high, ${staticSeverity.medium} medium, ${staticSeverity.low} low, ${staticSeverity.unrated} left unrated.`,
      coverageNotice: `${modulesWithoutStaticReview.length} of ${moduleStories.length} modules were never statically reviewed: ${modulesWithoutStaticReview
        .map((m) => `${m.id} ${m.module}`)
        .join(', ')}.`,
    },
    {
      id: 'type-manual',
      name: 'Manual Testing',
      badge: '02',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Execute every written test case against the live storefront by hand, and record a verdict for each one.',
      approach: `Manual execution through the browser across all ${moduleStories.length} modules. Every case was run and judged by a person; no tooling was involved at any point.`,
      outputs: `${totals.executed} executed — ${totals.passed} passed, ${totals.failed} failed, ${totals.blocked} blocked.`,
      coverageNotice: `${totals.failuresAwaitingWriteUp} of the ${totals.failed} failures this produced were never written up as defects, and ${totals.notRun} case was never run.`,
    },
    {
      id: 'type-api',
      name: 'API Testing',
      badge: '03',
      status: 'Not performed (no API access)',
      wasSkipped: true,
      purpose:
        'Exercise the application endpoints directly, underneath the interface, where the browser cannot reach.',
      approach:
        'Not carried out. Testing was confined to the live web interface; no endpoint documentation or API credentials were obtained.',
      outputs:
        'No API case was written or executed, and no API defect is reported.',
      coverageNotice:
        'Any defect reachable only through the API is outside everything this report covers.',
    },
    {
      id: 'type-automation',
      name: 'Automation Testing',
      badge: '04',
      status: 'Not performed',
      wasSkipped: true,
      purpose:
        'Re-run a regression suite automatically, so the same checks can be repeated cheaply against every later build.',
      approach: `Not carried out. All ${totals.executed} executed cases were run by hand and no script was written.`,
      outputs:
        'No automated suite exists, so no part of this run can be repeated without a person to repeat it.',
      coverageNotice:
        'Re-testing a fix, or catching a regression, would mean executing the cases manually a second time.',
    },
    {
      id: 'type-database',
      name: 'Database Testing',
      badge: '05',
      status: 'Not performed (no DB access)',
      wasSkipped: true,
      purpose:
        'Check stored records directly, to confirm the data behind the interface matches what the interface shows.',
      approach:
        'Not carried out. No database credentials were obtained, so no query was run against the application data.',
      outputs:
        'No data-integrity check was made, and no finding of that kind is reported.',
      coverageNotice:
        'Where the stored data and the interface disagree, this run would not have seen it.',
    },
    {
      id: 'type-mobile',
      name: 'Mobile App Testing',
      badge: '06',
      status: 'Executed',
      wasSkipped: false,
      purpose:
        'Verify an application on a mobile build, where layout, touch interaction and device behaviour differ from the desktop.',
      approach:
        'Carried out as a separate effort against a mobile app, with its own test cases, bug reports and summary reports.',
      outputs: 'Cases written, executed and reported, with defects logged.',
      coverageNotice:
        'This discipline was exercised on a separate mobile application, so its figures are not part of the Toolshop totals on this site.',
    },
  ],

  // One entry per discipline in the Testing Types section, in the same order.
  // The two that were carried out describe what the team did and what it
  // produced. The four that were not describe what each would have involved,
  // in the conditional, so a card read on its own cannot be mistaken for work
  // that happened.
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
        {
          name: 'Leaving the gap visible',
          description: `${modulesWithoutStaticReview.length} of ${moduleStories.length} modules were never reviewed at all: ${modulesWithoutStaticReview
            .map((m) => `${m.id} ${m.module}`)
            .join(', ')}.`,
        },
      ],
    },
    manual: {
      title: 'Manual Testing',
      activities: [
        {
          name: 'Test case creation',
          description: `${totals.cases} cases were written across ${areaCount} test areas, each with an ID, preconditions, steps, data and an expected result, and each mapped to its module.`,
        },
        {
          name: 'Test case execution',
          description: `${totals.executed} cases were executed by hand in the browser — ${totals.passed} passed, ${totals.failed} failed, ${totals.blocked} blocked — alongside ${crossModule.integration.totals.total} cross-module cases and a ${crossModule.e2e.totals.total}-step purchase journey. ${totals.notRun} cases were never run.`,
        },
        {
          name: 'Bug reporting',
          description: `${defectSeverity.total} defects were logged with reproduction steps, expected and actual behaviour and a severity. ${totals.failuresAwaitingWriteUp} observed failures were never written up and exist only as a Failed verdict in a workbook.`,
        },
        {
          name: 'Test summary report',
          description: `Execution and defect figures were consolidated into the delivered dashboard this site reports from: ${totals.execRate}% of cases executed, ${totals.passRate}% of those passing.`,
        },
      ],
    },
    api: {
      title: 'API Testing',
      wasSkipped: true,
      accessNote: 'Not performed — no endpoint documentation or API access',
      activities: [
        {
          name: 'Test case creation',
          description:
            'Would have covered request parameters, payload headers and expected response codes. No API case was written.',
        },
        {
          name: 'Test case execution',
          description:
            'Would have sent requests against confirmed endpoints and validated status codes, headers and body data.',
        },
        {
          name: 'Bug reporting',
          description:
            'Would have documented incorrect status codes, schema mismatches and unexpected server error payloads.',
        },
        {
          name: 'Test summary report',
          description:
            'Would have consolidated endpoint results and contract validation outcomes. No such report exists.',
        },
      ],
    },
    automation: {
      title: 'Automation Testing',
      wasSkipped: true,
      accessNote: 'Not performed — every case was run by hand',
      activities: [
        {
          name: 'Writing test scripts',
          description:
            'Would have authored modular scripts for the stable functional cases using an approved automation tool. No script was written.',
        },
        {
          name: 'Test execution',
          description:
            'Would have run the suite against the storefront and captured execution traces or screenshots.',
        },
        {
          name: 'Test summary report',
          description:
            'Would have documented suite results, script run times and pass/fail status. There is no suite to report on.',
        },
      ],
    },
    database: {
      title: 'Database Testing',
      wasSkipped: true,
      accessNote: 'Not performed — no direct database access',
      activities: [
        {
          name: 'Test case creation',
          description:
            'Would have developed verification cases and SQL queries for stored user records, cart data and orders.',
        },
        {
          name: 'Test execution',
          description:
            'Would have run those queries against the target tables and checked consistency with storefront actions. No query was run.',
        },
      ],
    },
    mobile: {
      title: 'Mobile App Testing',
      wasSkipped: false,
      activities: [
        {
          name: 'Test case creation',
          description:
            'Cases tailored for mobile screens, orientations, input fields and touch navigation.',
        },
        {
          name: 'Test case execution',
          description: 'Run on a mobile build and given a recorded verdict.',
        },
        {
          name: 'Bug reporting',
          description:
            'Mobile-specific defects logged with steps, expected and actual behaviour and a severity.',
        },
        {
          name: 'Test summary report',
          description:
            'Findings consolidated into per-module summary reports for the mobile effort.',
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
        'Run once as a single end-to-end journey, reaching every step.',
      outcome: `${crossModule.e2e.totals.passed} of ${crossModule.e2e.totals.total} steps passed; ${crossModule.e2e.totals.failed} failed and none were blocked.`,
    },
  ],

  // The delivery pipeline the project actually went through. These are stages,
  // not dated weeks - the delivered data records artifacts and verdicts, not a
  // calendar, so no schedule is claimed here.
  // The nine-week plan the project set out to follow. Six stages were
  // delivered and three were never carried out. The delivered workbooks
  // record artifacts and verdicts, not dates, so a week here is the planned
  // slot, and each stage is judged by what it produced rather than by when.
  testingPhases: [
    {
      id: 'phase-planning',
      phaseNumber: 'Week 1',
      title: 'Project Planning & Scope Definition',
      status: 'Completed',
      isFinal: false,
      wasSkipped: false,
      description: `The application under test was chosen and its scope fixed at ${moduleStories.length} functional modules, each assigned to a team member.`,
      keyActivities: [
        `${moduleStories.length} modules agreed as the scope of testing`,
        'One owner assigned per module',
        'Four artifacts planned per module: story, cases, static review, bug report',
      ],
      deliverables: `Scope fixed at ${moduleStories.length} modules`,
    },
    {
      id: 'phase-stories',
      phaseNumber: 'Week 2',
      title: 'Feature Verification & User Story Writing',
      status: 'Completed',
      isFinal: false,
      wasSkipped: false,
      description: `The storefront was explored module by module and one user story written per module, each with its acceptance criteria.`,
      keyActivities: [
        `${moduleStories.length} user stories written, one per module`,
        'Acceptance criteria agreed per story',
        'Scope of each module fixed before case design',
      ],
      deliverables: `${moduleStories.length} of ${moduleStories.length} user stories delivered`,
    },
    {
      id: 'phase-static',
      phaseNumber: 'Week 3',
      title: 'Static Review & Test Design',
      status: 'Completed with a gap',
      isFinal: false,
      wasSkipped: false,
      description: `Stories and workbooks were peer-reviewed before any case was executed, producing ${staticSeverity.total} findings, and the ${areaCount} test areas were identified.`,
      keyActivities: [
        `${staticSeverity.total} findings raised across ${
          moduleStories.length - modulesWithoutStaticReview.length
        } modules`,
        `${staticSeverity.high} high, ${staticSeverity.medium} medium, ${staticSeverity.low} low, ${staticSeverity.unrated} left unrated`,
        `${modulesWithoutStaticReview.length} module was never reviewed at all: ${modulesWithoutStaticReview
          .map((m) => `${m.id} ${m.module}`)
          .join(', ')}`,
      ],
      deliverables: `${staticSeverity.total} static findings; ${modulesWithoutStaticReview.length} module never reviewed`,
    },
    {
      id: 'phase-cases',
      phaseNumber: 'Week 4',
      title: 'Manual Test Case Creation',
      status: 'Completed',
      isFinal: false,
      wasSkipped: false,
      description: `${totals.cases} test cases written across ${areaCount} test areas, each carrying an ID, preconditions, steps, data, a priority and an expected result.`,
      keyActivities: [
        `${totals.cases} cases written across ${areaCount} test areas`,
        'Each case assigned a priority',
        'Cases mapped to their module and area',
      ],
      deliverables: `${totals.cases} test cases across ${moduleStories.length} workbooks`,
    },
    {
      id: 'phase-execution',
      phaseNumber: 'Week 5',
      title: 'Manual Test Execution & Bug Reporting',
      status: 'Completed with gaps',
      isFinal: false,
      wasSkipped: false,
      description: `${totals.executed} of ${totals.cases} cases executed by hand through the browser, and ${defectSeverity.total} defects written up. This is the stage where the coverage gaps opened.`,
      keyActivities: [
        `${totals.executed} cases executed (${totals.execRate}%) — ${totals.passed} passed, ${totals.failed} failed, ${totals.blocked} blocked`,
        `${defectSeverity.total} defects logged: ${defectSeverity.high} high, ${defectSeverity.medium} medium, ${defectSeverity.low} low`,
        `${totals.notRun} cases never run; ${totals.failuresAwaitingWriteUp} failures never written up — ${modulesWithoutBugReport
          .map((m) => m.id)
          .join(' and ')} have no bug report at all`,
      ],
      deliverables: `${totals.passRate}% pass rate of executed cases; ${defectSeverity.total} defect reports`,
    },
    {
      id: 'phase-api-mobile-db',
      phaseNumber: 'Week 6',
      title: 'API, Mobile & Database Testing',
      // One of the three happened. The week is not "carried out" on the
      // strength of that, and the other two are still not absolved.
      status: 'Partly carried out',
      isFinal: false,
      wasSkipped: false,
      description:
        'Planned as a conditional stage across three disciplines. Mobile app testing was carried out; the API and database work depended on credentials that were never obtained.',
      keyActivities: [
        'Mobile app testing was carried out as a separate effort',
        'No API endpoint documentation or credentials were obtained',
        'No database access was granted, so no query was run',
      ],
      deliverables: 'Mobile testing delivered; no API or database case written',
    },
    {
      id: 'phase-automation-scripts',
      phaseNumber: 'Week 7',
      title: 'Automation Script Development',
      status: 'Not carried out',
      isFinal: false,
      wasSkipped: true,
      description:
        'Planned as the point where the stable functional cases would be turned into automated scripts. No script was written.',
      keyActivities: [
        'No automation tool was adopted',
        'No script was authored against any of the stable cases',
        `All ${totals.executed} executed cases were run by hand instead`,
      ],
      deliverables: 'Nothing delivered — no automated suite exists',
    },
    {
      id: 'phase-automation-run',
      phaseNumber: 'Week 8',
      title: 'Automation Test Execution & Reporting',
      status: 'Not carried out',
      isFinal: false,
      wasSkipped: true,
      description:
        'Dependent on Week 7, which did not happen. With no suite to run, there was nothing to execute or report at this stage.',
      keyActivities: [
        'No suite existed to execute',
        'No execution traces or automation screenshots were captured',
        'No automation coverage figure is reported anywhere on this site',
      ],
      deliverables: 'Nothing delivered — nothing to run',
    },
    {
      id: 'phase-reporting',
      phaseNumber: 'Week 9',
      title: 'Final Test Summary & Presentation',
      status: 'Completed',
      isFinal: true,
      wasSkipped: false,
      description: `Test summary reports and this exhibition delivered on ${reportDate}, presenting the result including the coverage that was never achieved.`,
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
