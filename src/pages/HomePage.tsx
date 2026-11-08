import React from 'react';
import { HeroSection } from '../sections/HeroSection';
import { OverviewSection } from '../sections/OverviewSection';
import { TeamSection } from '../sections/TeamSection';
import { ExploreSection } from '../sections/ExploreSection';
import { TestingTypesSection } from '../sections/TestingTypesSection';
import { TestingActivitiesSection } from '../sections/TestingActivitiesSection';
import { TestLevelsSection } from '../sections/TestLevelsSection';
import { TimelineSection } from '../sections/TimelineSection';
import type { ProjectStatePayload } from '../types';

interface HomePageProps {
  data: ProjectStatePayload;
}

/**
 * The home page reads as one narrative: who we are, what we are testing, how
 * we will approach it and when. The detailed artefacts sit one click away
 * behind the Explore grid so this page stays scannable.
 */
export const HomePage: React.FC<HomePageProps> = ({ data }) => (
  <main>
    {/* 01. Opening statement */}
    <HeroSection meta={data.projectMeta} stories={data.moduleStories} />

    {/* 02. Mission & target application */}
    <OverviewSection
      overview={data.projectOverview}
      meta={data.projectMeta}
      stories={data.moduleStories}
    />

    {/* 03. The team behind the work */}
    <TeamSection team={data.teamIntroduction} />

    {/* 04. Index of the detailed artefacts */}
    <ExploreSection stories={data.moduleStories} />

    {/* 05. Testing types strategy */}
    <TestingTypesSection types={data.testingTypes} />

    {/* 06. Hands-on QA workflow */}
    <TestingActivitiesSection activitiesData={data.testingActivitiesData} />

    {/* 07. Hierarchy of verification */}
    <TestLevelsSection levels={data.testLevelsData} />

    {/* 08. Nine-week roadmap */}
    <TimelineSection phases={data.testingPhases} />
  </main>
);
