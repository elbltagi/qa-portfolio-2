import { defectSeverity, moduleStories, staticSeverity, totals } from '../data/toolshop';
import { countAreas } from './traceability';
import { qualityMetrics, riskRegister } from '../data/quality';

/**
 * The site map. One source of truth for the navbar, the chapter rail, the
 * footer, the home page's Explore grid and the detail-page routes.
 *
 * Every headline figure is computed from the delivered data, so a card can
 * never disagree with the page it introduces.
 */

export interface Chapter {
  id: string;
  index: string;
  label: string;
  short: string;
  tone?: 'light' | 'dark';
}

export const chapters: Chapter[] = [
  { id: 'project-name', index: '01', label: 'Result', short: 'Result' },
  { id: 'overview', index: '02', label: 'Mission', short: 'Mission' },
  { id: 'team', index: '03', label: 'The Team', short: 'Team' },
  { id: 'explore', index: '04', label: 'The Work', short: 'Work', tone: 'dark' },
  { id: 'testing-types', index: '05', label: 'Disciplines', short: 'Disciplines' },
  { id: 'testing-activities', index: '06', label: 'Activities', short: 'Activities' },
  { id: 'test-levels', index: '07', label: 'Levels', short: 'Levels' },
  { id: 'timeline', index: '08', label: 'Timeline', short: 'Timeline' },
];

export interface DetailPage {
  path: string;
  index: string;
  title: string;
  short: string;
  eyebrow: string;
  blurb: string;
  figure: string;
  figureLabel: string;
  stats: Array<{ value: string; label: string }>;
}

const areaCount = countAreas(moduleStories);
const notMetCriteria = 6; // exit criteria recorded as not met

export const detailPages: DetailPage[] = [
  {
    path: '/stories',
    index: '01',
    title: 'User Stories',
    short: 'Stories',
    eyebrow: 'Modules Under Test',
    blurb:
      'One user story per module, each with the test cases written against it and the verdicts they returned.',
    figure: String(moduleStories.length),
    figureLabel: 'User stories delivered',
    stats: [
      { value: String(totals.cases), label: 'Cases written' },
      { value: `${totals.executed}`, label: 'Cases executed' },
    ],
  },
  {
    path: '/test-cases',
    index: '02',
    title: 'Test Cases',
    short: 'Cases',
    eyebrow: 'Written, Run and Not Run',
    blurb:
      'Every test area mapped to its module, with what was executed and what it returned — including the areas that were never run.',
    figure: String(totals.cases),
    figureLabel: 'Test cases written',
    stats: [
      { value: `${totals.executed}`, label: 'Executed' },
      { value: String(totals.notRun), label: 'Never run' },
    ],
  },
  {
    path: '/bugs',
    index: '03',
    title: 'Bugs',
    short: 'Bugs',
    eyebrow: 'What We Found',
    blurb:
      'The defects logged, how they were rated, and the failures that were observed but never written up.',
    figure: String(defectSeverity.total),
    figureLabel: 'Bugs logged',
    stats: [
      { value: String(totals.failed), label: 'Failures observed' },
      { value: String(totals.failuresAwaitingWriteUp), label: 'Never written up' },
    ],
  },
  {
    path: '/summary',
    index: '04',
    title: 'Test Summary Report',
    short: 'Summary',
    eyebrow: 'The Result, Measured',
    blurb:
      'What the run actually measured against what it set out to achieve, and which of the identified risks materialised.',
    figure: `${totals.passRate}%`,
    figureLabel: 'Pass rate of executed cases',
    stats: [
      { value: `${notMetCriteria} of 7`, label: 'Exit criteria not met' },
      { value: `${riskRegister.length} of ${riskRegister.length}`, label: 'Risks materialised' },
    ],
  },
];

export const findDetailPage = (path: string): DetailPage | undefined =>
  detailPages.find((page) => page.path === path);

/** Re-exported so pages can show the same roll-ups without re-deriving them. */
export const siteTotals = { totals, defectSeverity, staticSeverity, areaCount, qualityMetrics };
