import type { ModuleStory, TestArea } from '../data/toolshop';

/**
 * Builds the traceability matrix from the delivered data.
 *
 * A row is one test area inside one module — the finest grain the delivered
 * workbooks record. Nothing here is invented: every count comes from the
 * module's own `areas[]` breakdown.
 */

export type AreaVerdict = 'passed' | 'mixed' | 'failed' | 'not-run' | 'blocked';

export interface TraceRow {
  /** Stable row key, e.g. "US-001::Search". */
  key: string;
  storyId: string;
  module: string;
  shortName: string;
  owner: string;
  area: TestArea;
  verdict: AreaVerdict;
  /** Pass rate of executed cases in this area; null when none were executed. */
  passRate: number | null;
}

function verdictFor(area: TestArea): AreaVerdict {
  const executed = area.passed + area.failed;
  if (executed === 0) {
    return area.blocked > 0 ? 'blocked' : 'not-run';
  }
  if (area.failed === 0) return 'passed';
  if (area.passed === 0) return 'failed';
  return 'mixed';
}

export function buildTraceRows(stories: ModuleStory[]): TraceRow[] {
  return stories.flatMap((story) =>
    story.areas.map((area) => {
      const executed = area.passed + area.failed;
      return {
        key: `${story.id}::${area.name}`,
        storyId: story.id,
        module: story.module,
        shortName: story.shortName,
        owner: story.owner,
        area,
        verdict: verdictFor(area),
        passRate:
          executed === 0 ? null : Math.round((area.passed / executed) * 1000) / 10,
      };
    })
  );
}

export interface ModuleSummary {
  storyId: string;
  module: string;
  shortName: string;
  owner: string;
  stateLabel: string;
  areas: number;
  written: number;
  executed: number;
  passed: number;
  failed: number;
  blocked: number;
  notRun: number;
  passRate: number | null;
  defects: number;
  staticFindings: number;
  artifacts: string;
}

export function buildModuleSummaries(stories: ModuleStory[]): ModuleSummary[] {
  return stories.map((story) => ({
    storyId: story.id,
    module: story.module,
    shortName: story.shortName,
    owner: story.owner,
    stateLabel: story.stateLabel,
    areas: story.areas.length,
    written: story.cases.written,
    executed: story.cases.executed,
    passed: story.cases.passed,
    failed: story.cases.failed,
    blocked: story.cases.blocked,
    notRun: story.cases.notRun,
    passRate: story.cases.passRate,
    defects: story.defects.total,
    staticFindings: story.staticFindings.total,
    artifacts: `${story.artifacts.delivered}/${story.artifacts.of}`,
  }));
}

/** Total test areas across every module. */
export const countAreas = (stories: ModuleStory[]) =>
  stories.reduce((total, story) => total + story.areas.length, 0);
