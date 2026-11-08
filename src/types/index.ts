import type { ModuleStory } from '../data/toolshop';

export type {
  CaseCounts,
  CrossModuleRefs,
  ModuleArtifacts,
  ModuleState,
  ModuleStory,
  PriorityCounts,
  SeverityCounts,
  TestArea,
} from '../data/toolshop';

export interface ProjectMeta {
  name: string;
  track: string;
  /** Where the project stands, e.g. "Execution complete". */
  status: string;
  /** Date the reporting was delivered. */
  reportDate: string;
  initiative: string;
  liveAppUrl: string;
  fullProjectName: string;
  /** The team that carried out the testing. */
  team: string;
  /** One line on the coverage the run did and did not achieve. */
  coverageNotice: string;
}

export interface ProjectOverviewData {
  heading: string;
  targetUrl: string;
  statusBadge: string;
  briefOverview: string;
  keyHighlights: Array<{
    label: string;
    value: string;
    sub: string;
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

export interface TestingType {
  id: string;
  name: string;
  badge: string;
  /** What actually happened, e.g. "Executed" or "Not performed". */
  status: string;
  purpose: string;
  /** True when the discipline was not carried out on this project. */
  wasSkipped: boolean;
  /** What the discipline actually produced. */
  outputs: string;
  /** How it was carried out. */
  approach: string;
  /** Shown when coverage was partial or absent. */
  coverageNotice?: string;
}

export interface TestingActivityItem {
  name: string;
  description: string;
}

export interface TestingActivityCategory {
  title: string;
  accessNote?: string;
  /** True when the category was not carried out. */
  wasSkipped?: boolean;
  skippedNote?: string;
  activities: TestingActivityItem[];
}

export type TestingActivitiesRecord = Record<string, TestingActivityCategory>;

export interface TestLevel {
  id: string;
  name: string;
  tagline: string;
  shortName: string;
  description: string;
  /** What this level actually covered on this project. */
  coverageNotice: string;
  /** The result observed at this level. */
  outcome: string;
}

export interface TestingPhase {
  id: string;
  title: string;
  status: string;
  /** True for the phase the project finished on. */
  isFinal: boolean;
  /** True for a planned stage the project never carried out. */
  wasSkipped: boolean;
  description: string;
  phaseNumber: string;
  keyActivities: string[];
  /** What the phase actually delivered. */
  deliverables: string;
}

export interface ProjectStatePayload {
  projectMeta: ProjectMeta;
  projectOverview: ProjectOverviewData;
  teamIntroduction: TeamIntroductionData;
  /** The ten user stories, one per module, with their execution results. */
  moduleStories: ModuleStory[];
  testingTypes: TestingType[];
  testingActivitiesData: TestingActivitiesRecord;
  testLevelsData: TestLevel[];
  testingPhases: TestingPhase[];
}
