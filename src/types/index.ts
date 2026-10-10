export interface ProjectMeta {
  name: string;
  track: string;
  status: string;
  duration: string;
  initiative: string;
  liveAppUrl: string;
  fullProjectName: string;
  testingStatusNotice: string;
}

export interface ProjectOverviewData {
  heading: string;
  targetUrl: string;
  statusBadge: string;
  briefOverview: string;
  keyHighlights: Array<{
    label: string;
    value: string;
  }>;
}

export interface TeamMember {
  id: string;
  name: string;
  track: string;
  avatar: string;
  initials: string;
  objectPosition?: string;
  role?: string;
  url?: string;
  linkedinUrl?: string;
}

export interface TeamIntroductionData {
  heading: string;
  subtitle: string;
  members: TeamMember[];
}

export interface UserStory {
  id: string;
  url?: string | null;
  title: string;
  module: string;
  priority: string;
  description?: string | null;
  teamProgress?: string;
  evidenceStatus: string;
  verificationNote?: string | null;
}

export interface TestingType {
  id: string;
  name: string;
  badge: string;
  status: string;
  purpose: string;
  isConditional: boolean;
  expectedOutputs: string;
  proposedApproach: string;
  accessNotice?: string;
}

export interface TestingActivityItem {
  name: string;
  description: string;
}

export interface TestingActivityCategory {
  title: string;
  accessNote?: string;
  isConditional?: boolean;
  conditionalNote?: string;
  activities: TestingActivityItem[];
}

export type TestingActivitiesRecord = Record<string, TestingActivityCategory>;

export interface TestLevel {
  id: string;
  name: string;
  tagline: string;
  shortName: string;
  description: string;
  accessNotice: string;
  plannedFocus: string;
}

export interface TestingPhase {
  id: string;
  title: string;
  status: string;
  isCurrent: boolean;
  description: string;
  phaseNumber: string;
  keyActivities: string[];
  plannedDeliverables: string;
}

export interface ProjectStatePayload {
  projectMeta: ProjectMeta;
  projectOverview: ProjectOverviewData;
  teamIntroduction: TeamIntroductionData;
  proposedUserStories: UserStory[];
  testingTypes: TestingType[];
  testingActivitiesData: TestingActivitiesRecord;
  testLevelsData: TestLevel[];
  testingPhases: TestingPhase[];
}
