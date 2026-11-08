import React from 'react';
import { PageShell } from '../components/PageShell';
import { UserStoriesSection } from '../sections/UserStoriesSection';
import { TraceabilitySection } from '../sections/TraceabilitySection';
import { DefectSection } from '../sections/DefectSection';
import { MetricsSection } from '../sections/MetricsSection';
import { findDetailPage } from '../lib/chapters';
import type { ModuleStory } from '../types';

/**
 * One page per delivered artefact: the user stories, the test cases written
 * against them, the bugs those cases found, and the summary report. Each is
 * the shared PageShell wrapped around the section that already renders that
 * data on its own.
 */

const page = (path: string) => findDetailPage(path)!;

export const StoriesPage: React.FC<{ stories: ModuleStory[] }> = ({ stories }) => (
  <PageShell page={page('/stories')}>
    <UserStoriesSection stories={stories} hideHeading />
  </PageShell>
);

export const TestCasesPage: React.FC<{ stories: ModuleStory[] }> = ({
  stories,
}) => (
  <PageShell page={page('/test-cases')}>
    <TraceabilitySection stories={stories} hideHeading />
  </PageShell>
);

export const BugsPage: React.FC = () => (
  <PageShell page={page('/bugs')}>
    <DefectSection hideHeading />
  </PageShell>
);

export const SummaryPage: React.FC = () => (
  <PageShell page={page('/summary')}>
    <MetricsSection hideHeading />
  </PageShell>
);
