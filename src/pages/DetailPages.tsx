import React from 'react';
import { PageShell } from '../components/PageShell';
import { UserStoriesSection } from '../sections/UserStoriesSection';
import { TestDesignSection } from '../sections/TestDesignSection';
import { TraceabilitySection } from '../sections/TraceabilitySection';
import { DefectSection } from '../sections/DefectSection';
import { MetricsSection } from '../sections/MetricsSection';
import { findDetailPage } from '../lib/chapters';
import type { ModuleStory } from '../types';

const page = (path: string) => findDetailPage(path)!;

export const StoriesPage: React.FC<{ stories: ModuleStory[] }> = ({ stories }) => (
  <PageShell page={page('/stories')}>
    <UserStoriesSection stories={stories} hideHeading />
  </PageShell>
);

export const TestDesignPage: React.FC = () => (
  <PageShell page={page('/test-design')}>
    <TestDesignSection hideHeading />
  </PageShell>
);

export const TraceabilityPage: React.FC<{ stories: ModuleStory[] }> = ({
  stories,
}) => (
  <PageShell page={page('/traceability')}>
    <TraceabilitySection stories={stories} hideHeading />
  </PageShell>
);

export const DefectsPage: React.FC = () => (
  <PageShell page={page('/defects')}>
    <DefectSection hideHeading />
  </PageShell>
);

export const MetricsPage: React.FC = () => (
  <PageShell page={page('/metrics')}>
    <MetricsSection hideHeading />
  </PageShell>
);
