import { supabase } from '../lib/supabase/client';
import type { ProjectStatePayload, UserStory } from '../types';

// Fallback baseline in case network fails or env keys are absent
export const fallbackProjectState: ProjectStatePayload = {
  projectMeta: {
    name: "Automation Test Store",
    track: "Software Testing Track",
    status: "Project Proposal / Planning Stage",
    duration: "9 Weeks",
    initiative: "Digital Egypt Pioneers Initiative (DEPI)",
    liveAppUrl: "https://automationteststore.com/",
    fullProjectName: "Automation Test Store — Software Testing Project",
    testingStatusNotice: "We have not started performing testing activities. All testing work is presented as proposed future activities."
  },
  projectOverview: {
    heading: "Automation Test Store — Quality Assurance Project",
    targetUrl: "https://automationteststore.com/",
    statusBadge: "Project Proposal / Planning Stage",
    briefOverview: "Our graduation project aims to evaluate the functionality and reliability of Automation Test Store, an e-commerce practice website. Our team plans to apply systematic testing techniques to explore its major functionalities, design test cases, execute tests, and document findings.",
    keyHighlights: [
      { label: "Target Application", value: "E-Commerce Web Store" },
      { label: "Project Duration", value: "9 Weeks" },
      { label: "Planned Approach", value: "Systematic Manual Testing First" },
      { label: "Proposed User Stories", value: "59 Features Identified" }
    ]
  },
  teamIntroduction: {
    heading: "The People Behind the Quality",
    subtitle: "We are software testing trainees from DEPI, working together on our graduation project to apply quality assurance principles to an e-commerce application.",
    members: [
      {
        id: "team-1",
        name: "Youssef El Beltagi",
        track: "DEPI Software Testing",
        role: "Team Leader",
        avatar: "/images/team/member-1.png",
        initials: "YE",
        objectPosition: "50% 20%",
        url: "https://eg.linkedin.com/in/youssef-elbltagi",
        linkedinUrl: "https://eg.linkedin.com/in/youssef-elbltagi"
      },
      {
        id: "team-2",
        name: "Abdulrahman El Moghazy",
        track: "DEPI Software Testing",
        avatar: "/images/team/member-2.jpeg",
        initials: "AE",
        objectPosition: "50% 32%",
        url: "https://www.linkedin.com/in/abdulrhman-mohamed01/",
        linkedinUrl: "https://www.linkedin.com/in/abdulrhman-mohamed01/"
      },
      {
        id: "team-3",
        name: "Hend Amr",
        track: "DEPI Software Testing",
        avatar: "/images/team/member-3.jpeg",
        initials: "HA",
        objectPosition: "50% 20%",
        url: "https://www.linkedin.com/in/hend-amr-502281416/",
        linkedinUrl: "https://www.linkedin.com/in/hend-amr-502281416/"
      },
      {
        id: "team-4",
        name: "Mostafa El Gohary",
        track: "DEPI Software Testing",
        avatar: "/images/team/member-4.jpeg",
        initials: "ME",
        objectPosition: "50% 16%",
        url: "https://www.linkedin.com/in/mostafa-elgohary-7b679a392/?isSelfProfile=false",
        linkedinUrl: "https://www.linkedin.com/in/mostafa-elgohary-7b679a392/?isSelfProfile=false"
      },
      {
        id: "team-5",
        name: "Mosad Essam",
        track: "DEPI Software Testing",
        avatar: "/images/team/member-5.jpeg",
        initials: "ME",
        objectPosition: "50% 48%"
      },
      {
        id: "team-6",
        name: "Mohammed Maher",
        track: "DEPI Software Testing",
        avatar: "/images/team/member-6.jpeg",
        initials: "MM",
        objectPosition: "center 25%"
      }
    ]
  },
  proposedUserStories: [],
  testingTypes: [
    {
      id: "type-static",
      name: "Static Testing",
      badge: "01",
      status: "Planned",
      purpose: "Catch defects early by reviewing documentation and identifying requirement ambiguities before execution.",
      isConditional: false,
      expectedOutputs: "Documented review notes, clarified criteria, and an ambiguity tracking list.",
      proposedApproach: "Review available specifications and website flows to discover gaps and clarify acceptance criteria."
    },
    {
      id: "type-manual",
      name: "Manual Testing",
      badge: "02",
      status: "Planned",
      purpose: "Verify user-facing web store features and shopping flows from a real end-user perspective.",
      isConditional: false,
      expectedOutputs: "Structured test cases, execution run logs, and defect reports with screenshots.",
      proposedApproach: "Execute step-by-step test cases across Chrome, Edge, and Firefox for positive and negative paths."
    },
    {
      id: "type-api",
      name: "API Testing",
      badge: "03",
      status: "Planned (Subject to Access)",
      purpose: "Validate backend endpoints, payload structures, and HTTP response codes where accessible.",
      accessNotice: "Subject to backend endpoint documentation & access confirmation",
      isConditional: false,
      expectedOutputs: "API test scenarios, request/response verification logs, and status code checks.",
      proposedApproach: "Send test requests to confirmed application endpoints using Postman once access is provided."
    },
    {
      id: "type-automation",
      name: "Automation Testing",
      badge: "04",
      status: "Planned",
      purpose: "Speed up regression checks and reliably verify repetitive high-value workflows.",
      isConditional: false,
      expectedOutputs: "Modular test scripts, automated execution test run logs, and summary reports.",
      proposedApproach: "Build automated test scripts for critical scenarios like login, search, and checkout."
    },
    {
      id: "type-database",
      name: "Database Testing",
      badge: "05",
      status: "Planned (Subject to Access)",
      purpose: "Confirm that storefront user actions correctly save and update data in the database.",
      accessNotice: "Subject to database instance access & permission confirmation",
      isConditional: false,
      expectedOutputs: "Database test queries, verification logs, and data integrity checks.",
      proposedApproach: "Run verification queries against user records, cart items, and placed orders if direct access is granted."
    },
    {
      id: "type-mobile",
      name: "Mobile App Testing",
      badge: "Conditional",
      status: "Conditional (Subject to App Access)",
      purpose: "Evaluate responsive mobile behavior and native app flows if a mobile client is approved.",
      accessNotice: "Conditional: Applicable only if an approved mobile application build is provided.",
      isConditional: true,
      expectedOutputs: "Mobile test cases, usability notes, and mobile defect reports.",
      proposedApproach: "Test responsive screen layouts, touch interactions, and mobile user journeys."
    }
  ],
  testingActivitiesData: {
    static: {
      title: "Static Testing",
      activities: [
        {
          name: "Reviewing User Stories",
          description: "Conducting team walkthroughs and peer reviews to evaluate user story clarity, testability, acceptance criteria, and edge cases."
        },
        {
          name: "Reviewing Requirements & Ambiguities",
          description: "Reviewing available requirements, discovering functional gaps, and logging ambiguities for instructor clarification prior to test execution."
        }
      ]
    },
    manual: {
      title: "Manual Testing",
      activities: [
        {
          name: "Test Case Creation",
          description: "Writing detailed test cases with unique IDs, preconditions, test steps, test data, and expected results."
        },
        {
          name: "Test Case Execution",
          description: "Executing test cases step-by-step on target web browsers and documenting actual outcomes."
        },
        {
          name: "Bug Reporting",
          description: "Logging reproducible defect tickets containing title, severity, priority, steps to reproduce, and visual evidence."
        },
        {
          name: "Test Summary Report",
          description: "Compiling execution statistics, pass/fail ratios, defect summaries, and testing recommendations."
        }
      ]
    },
    api: {
      title: "API Testing",
      accessNote: "Subject to backend endpoint documentation & access confirmation",
      activities: [
        {
          name: "Test Case Creation",
          description: "Designing API test cases covering request parameters, payload headers, and expected response codes."
        },
        {
          name: "Test Case Execution",
          description: "Sending HTTP requests against confirmed endpoints and validating status codes, headers, and body data."
        },
        {
          name: "Bug Reporting",
          description: "Documenting API failures, incorrect status codes, schema mismatches, or unexpected server error payloads."
        },
        {
          name: "Test Summary Report",
          description: "Consolidating API endpoint test results and contract validation outcomes into a structured report."
        }
      ]
    },
    mobile: {
      title: "Mobile App Testing",
      isConditional: true,
      conditionalNote: "Applicable only if an approved mobile application build is available for testing.",
      activities: [
        {
          name: "Test Case Creation",
          description: "Formulating test cases tailored for mobile viewports, orientations, input fields, and mobile navigation."
        },
        {
          name: "Test Case Execution",
          description: "Conducting manual mobile test runs on supported devices or responsive emulators."
        },
        {
          name: "Bug Reporting",
          description: "Logging mobile-specific defects such as broken touch controls, layout overflows, or crash behaviors."
        },
        {
          name: "Test Summary Report",
          description: "Synthesizing mobile testing findings and device compatibility observations."
        }
      ]
    },
    automation: {
      title: "Automation Testing",
      activities: [
        {
          name: "Writing Test Scripts",
          description: "Authoring modular automated scripts for selected, stable functional test cases using an approved automation tool."
        },
        {
          name: "Test Execution",
          description: "Executing the automated script suite against the test store and capturing execution traces or screenshots."
        },
        {
          name: "Test Summary Report",
          description: "Documenting automation suite results, script execution times, pass/fail status, and coverage."
        }
      ]
    },
    database: {
      title: "Database Testing",
      accessNote: "Subject to direct database access confirmation",
      activities: [
        {
          name: "Test Case Creation",
          description: "Developing verification test cases and SQL queries to validate stored user records, cart data, and orders."
        },
        {
          name: "Test Execution",
          description: "Executing database verification queries against target tables and checking data consistency with storefront actions."
        }
      ]
    }
  },
  testLevelsData: [
    {
      id: "level-component",
      name: "Component Testing",
      tagline: "Individual Functional Units",
      shortName: "Level 1: Component",
      description: "Focuses on testing individual functional components in isolation where they can be independently evaluated (e.g., input form validators, search query handlers, button interactions).",
      accessNotice: "Note: Testing at the internal component level may require technical access to isolated code or units that is not available through the public web interface.",
      plannedFocus: "Focus on independently verifiable UI component states and client-side input validations."
    },
    {
      id: "level-integration",
      name: "Integration Testing",
      tagline: "Connected Modules & Data Flow",
      shortName: "Level 2: Integration",
      description: "Focuses on verifying communication, data exchange, and contract consistency between connected functional components where accessible (e.g., catalog-to-cart handoff, cart-to-checkout data flow, form-to-server submission).",
      accessNotice: "Note: Deep integration testing between sub-services or third-party gateways may depend on backend access or mock environments not exposed on the public site.",
      plannedFocus: "Focus on end-to-end data transfer between user registration, shopping cart, and checkout stages."
    },
    {
      id: "level-system",
      name: "System Testing",
      tagline: "Complete End-to-End User Journeys",
      shortName: "Level 3: System",
      description: "Focuses on evaluating complete, end-to-end user workflows across the entire e-commerce website from a real customer's perspective on supported web browsers.",
      accessNotice: "Fully accessible through the live web application interface at https://automationteststore.com/.",
      plannedFocus: "Primary focus of our graduation project: verifying complete customer purchase and browsing journeys."
    },
    {
      id: "level-acceptance",
      name: "Acceptance Testing",
      tagline: "Business Requirements & User Acceptance",
      shortName: "Level 4: Acceptance",
      description: "Focuses on validating that the system meets user expectations, business requirements, and predefined acceptance criteria before final graduation project submission.",
      accessNotice: "Evaluated against documented user stories, acceptance criteria, and project stakeholder expectations.",
      plannedFocus: "Verify that user stories and end-to-end checkout scenarios fulfill all acceptance criteria defined for the graduation project."
    }
  ],
  testingPhases: [
    {
      id: "week-1",
      title: "Project Planning & Scope Definition",
      status: "CURRENT STAGE (PLANNING)",
      isCurrent: true,
      description: "Team alignment, exploration of Automation Test Store, scope definition, and presentation of the graduation project proposal.",
      phaseNumber: "Week 1",
      keyActivities: [
        "Exploratory analysis of storefront structure and modules",
        "Scope definition and high-level risk assessment",
        "Team roles, responsibilities, and project cadence alignment",
        "Initial graduation project proposal kickoff"
      ],
      plannedDeliverables: "Project Proposal Presentation, Initial Team Scope Agreement"
    },
    {
      id: "week-2",
      title: "Feature Verification & User Story Writing",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Conducting systematic feature verification across target modules and authoring structured user stories with acceptance criteria.",
      phaseNumber: "Week 2",
      keyActivities: [
        "Validate 10 functional storefront modules against live site",
        "Draft formal user stories with Given-When-Then acceptance criteria",
        "Identify core customer journeys and edge interactions",
        "Establish functional requirements traceability matrix"
      ],
      plannedDeliverables: "59 Proposed User Stories with Acceptance Criteria, Feature Inventory"
    },
    {
      id: "week-3",
      title: "Static Review & Test Design",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Performing peer reviews on user stories, identifying requirement ambiguities, and applying black-box test design techniques.",
      phaseNumber: "Week 3",
      keyActivities: [
        "Conduct peer reviews on drafted user stories for testability",
        "Log ambiguities, contradictory rules, and missing conditions",
        "Apply Equivalence Partitioning (EP) and Boundary Value Analysis (BVA)",
        "Outline positive, negative, and boundary test scenarios"
      ],
      plannedDeliverables: "User Story Peer Review Log, Ambiguity Log, Test Design Matrix"
    },
    {
      id: "week-4",
      title: "Manual Test Case Creation",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Authoring detailed manual test case suites with preconditions, step-by-step procedures, test data, and expected results.",
      phaseNumber: "Week 4",
      keyActivities: [
        "Author structured test cases with preconditions and exact steps",
        "Define specific test data sets (valid, invalid, boundary values)",
        "Incorporate responsive and cross-browser verification checkpoints",
        "Conduct team review and baseline test suite approval"
      ],
      plannedDeliverables: "Structured Test Case Suites for Approved Modules"
    },
    {
      id: "week-5",
      title: "Manual Test Execution & Bug Reporting",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Executing test cases manually across desktop browsers, logging actual results, and reporting reproducible defects with screenshots.",
      phaseNumber: "Week 5",
      keyActivities: [
        "Execute manual test case suites on target browsers",
        "Record actual vs expected results with evidence screenshots",
        "Log reproducible defect reports with severity and reproduction steps",
        "Verify defect fixes and conduct regression smoke checks"
      ],
      plannedDeliverables: "Test Execution Logs, Defect Reports / Bug Log with Evidence"
    },
    {
      id: "week-6",
      title: "API, Mobile & Database Testing (Subject to Access)",
      status: "Upcoming (Conditional)",
      isCurrent: false,
      description: "Conducting specialized testing for APIs, mobile interfaces, and database queries where technical access and credentials are confirmed.",
      phaseNumber: "Week 6",
      keyActivities: [
        "Validate public REST API endpoints and response payloads",
        "Execute mobile responsive viewport and device emulation tests",
        "Verify database records and consistency (subject to access permissions)",
        "Document technical access boundaries and environment constraints"
      ],
      plannedDeliverables: "API Collections, Mobile Viewport Notes, Database Verification Logs"
    },
    {
      id: "week-7",
      title: "Automation Script Development",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Authoring automated test scripts for selected high-priority functional regression flows using an approved automation framework.",
      phaseNumber: "Week 7",
      keyActivities: [
        "Set up test automation framework and locator strategy",
        "Implement Page Object Model (POM) pattern for target flows",
        "Automate priority smoke scenarios (Search, Cart, Checkout)",
        "Incorporate robust assertions and execution reporting hooks"
      ],
      plannedDeliverables: "Automated Test Scripts for Selected Regression Scenarios"
    },
    {
      id: "week-8",
      title: "Automation Test Execution & Reporting",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Running automated regression suites, evaluating script stability, analyzing failure logs, and documenting automation metrics.",
      phaseNumber: "Week 8",
      keyActivities: [
        "Execute automated regression suites across supported browsers",
        "Investigate script failures, locator flakiness, and issues",
        "Generate test execution summary reports and coverage metrics",
        "Compare automation results against manual baseline execution"
      ],
      plannedDeliverables: "Automation Run Reports, Test Execution Metrics Summary"
    },
    {
      id: "week-9",
      title: "Final Test Summary & Presentation",
      status: "Upcoming (Proposed)",
      isCurrent: false,
      description: "Synthesizing all test outcomes, metrics, defect logs, and project reflections into the final Graduation Project Test Summary Report.",
      phaseNumber: "Week 9",
      keyActivities: [
        "Consolidate comprehensive defect logs, pass rates, and metrics",
        "Synthesize testing conclusions, lessons learned, and recommendations",
        "Finalize graduation project test summary documentation",
        "Prepare and rehearse final presentation defense"
      ],
      plannedDeliverables: "Final Graduation Project Test Summary Report & Presentation Defense"
    }
  ]
};

export async function fetchProjectData(): Promise<{
  data: ProjectStatePayload;
  isLive: boolean;
  error: string | null;
}> {
  if (!supabase) {
    return {
      data: fallbackProjectState,
      isLive: false,
      error: "Supabase client not configured. Showing local baseline."
    };
  }

  try {
    // 1. Fetch user stories from public.user_stories table
    const { data: userStoriesData, error: userStoriesError } = await supabase
      .from('user_stories')
      .select('*')
      .order('id', { ascending: true });

    if (userStoriesError) {
      console.warn('[Supabase] Failed to fetch user_stories:', userStoriesError.message);
    }

    // 2. Fetch project state payload from public.project_state
    const { data: stateData, error: stateError } = await supabase
      .from('project_state')
      .select('data')
      .eq('id', 'default')
      .single();

    if (stateError) {
      console.warn('[Supabase] Failed to fetch project_state:', stateError.message);
    }

    // Determine the base state from project_state or fallback
    let combinedData: ProjectStatePayload = stateData?.data 
      ? (stateData.data as ProjectStatePayload)
      : fallbackProjectState;

    // Filter out "Writing User Stories" from Static Testing Activities if present in database
    // (Prompt explicitly mandates: "IMPORTANT: Do not add 'Writing User Stories' to this section.
    // That activity should be communicated in the User Stories section only.")
    if (combinedData.testingActivitiesData?.static?.activities) {
      combinedData.testingActivitiesData.static.activities = 
        combinedData.testingActivitiesData.static.activities.filter(
          act => !act.name.toLowerCase().includes('writing user stories')
        );
    }

    // If live user stories were retrieved, update proposedUserStories
    if (userStoriesData && userStoriesData.length > 0) {
      const mappedStories: UserStory[] = userStoriesData.map((item: any) => ({
        id: item.id,
        url: item.url || null,
        title: item.title,
        module: item.module,
        priority: item.priority || 'Medium',
        description: item.description || null,
        teamProgress: item.team_progress || 'Not Started',
        evidenceStatus: item.evidence_status || 'Visible UI',
        verificationNote: item.verification_note || null,
      }));

      combinedData = {
        ...combinedData,
        proposedUserStories: mappedStories
      };
    } else if (!combinedData.proposedUserStories || combinedData.proposedUserStories.length === 0) {
      combinedData.proposedUserStories = fallbackProjectState.proposedUserStories;
    }

    // Ensure highlights reflect current count
    const storyCount = combinedData.proposedUserStories.length;
    if (combinedData.projectOverview?.keyHighlights) {
      combinedData.projectOverview.keyHighlights = combinedData.projectOverview.keyHighlights.map(h => {
        if (h.label.includes('User Stories')) {
          return { ...h, value: `${storyCount} Features Identified` };
        }
        return h;
      });
    }

    // Ensure team members retain their LinkedIn profile links
    const memberLinkedInMap: Record<string, string> = {
      'team-1': 'https://eg.linkedin.com/in/youssef-elbltagi',
      'team-2': 'https://www.linkedin.com/in/abdulrhman-mohamed01/',
      'team-3': 'https://www.linkedin.com/in/hend-amr-502281416/',
      'team-4': 'https://www.linkedin.com/in/mostafa-elgohary-7b679a392/?isSelfProfile=false',
    };

    if (combinedData.teamIntroduction?.members) {
      combinedData.teamIntroduction.members = combinedData.teamIntroduction.members.map((member, index) => {
        const isLeader = member.id === 'team-1' || index === 0 || member.name.toLowerCase().includes('youssef');
        const mappedUrl = memberLinkedInMap[member.id] || memberLinkedInMap[`team-${index + 1}`];
        return {
          ...member,
          role: isLeader ? 'Team Leader' : member.role,
          url: member.url || mappedUrl,
          linkedinUrl: member.linkedinUrl || mappedUrl
        };
      });
    }

    // Ensure Acceptance Testing is present in testLevelsData
    if (combinedData.testLevelsData) {
      const hasAcceptance = combinedData.testLevelsData.some(l => l.id === 'level-acceptance');
      if (!hasAcceptance) {
        combinedData.testLevelsData.push({
          id: "level-acceptance",
          name: "Acceptance Testing",
          tagline: "Business Requirements & User Acceptance",
          shortName: "Level 4: Acceptance",
          description: "Focuses on validating that the system meets user expectations, business requirements, and predefined acceptance criteria before final graduation project submission.",
          accessNotice: "Evaluated against documented user stories, acceptance criteria, and project stakeholder expectations.",
          plannedFocus: "Verify that user stories and end-to-end checkout scenarios fulfill all acceptance criteria defined for the graduation project."
        });
      }
    }

    return {
      data: combinedData,
      isLive: true,
      error: null
    };
  } catch (err: any) {
    console.error('[Supabase] Exception fetching project data:', err);
    return {
      data: fallbackProjectState,
      isLive: false,
      error: err?.message || 'Unexpected error occurred while fetching from Supabase.'
    };
  }
}
