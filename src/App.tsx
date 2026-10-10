import React from 'react';
import { useProjectData } from './hooks/useProjectData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './sections/HeroSection';
import { OverviewSection } from './sections/OverviewSection';
import { TeamSection } from './sections/TeamSection';
import { UserStoriesSection } from './sections/UserStoriesSection';
import { TestingTypesSection } from './sections/TestingTypesSection';
import { TestingActivitiesSection } from './sections/TestingActivitiesSection';
import { TestLevelsSection } from './sections/TestLevelsSection';
import { TimelineSection } from './sections/TimelineSection';
import { Footer } from './components/Footer';
import { AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const { data, loading, error } = useProjectData();

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-ink">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-12 h-12 rounded-full bg-ink text-canvas-surface flex items-center justify-center font-display font-black text-xl mx-auto animate-pulse">
            Q
          </div>
          <span className="text-xs font-tech tracking-widest uppercase text-ink-subtle block">
            The Quality Journey • V2
          </span>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-ink">
            Curating Digital Exhibition...
          </h2>
          <p className="text-xs text-ink-muted font-tech">
            Loading project state & user story inventory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-accent selection:text-white">
      {/* Optional fallback notice if there is a connection error */}
      {error && (
        <div className="bg-amber-500 text-charcoal-950 px-4 py-2 text-xs font-tech flex items-center justify-center gap-2 border-b border-amber-600">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Notice: {error} Using cached project baseline.</span>
        </div>
      )}

      {/* Top Editorial Navbar */}
      <Navbar targetUrl={data.projectMeta.liveAppUrl} />

      {/* Main Exhibition Sequence */}
      <main>
        {/* 01. Project Name / Opening Statement */}
        <HeroSection meta={data.projectMeta} />

        {/* 02. Project Overview / Introducing the Mission */}
        <OverviewSection
          overview={data.projectOverview}
          meta={data.projectMeta}
          totalStoriesCount={data.proposedUserStories.length}
        />

        {/* 03. Team Members / The Signature Pin & Rotate Gallery */}
        <TeamSection team={data.teamIntroduction} />

        {/* 04. User Stories / Exploring the Store */}
        <UserStoriesSection stories={data.proposedUserStories} />

        {/* 05. Testing Types / Kinetic Typography Strategy */}
        <TestingTypesSection types={data.testingTypes} />

        {/* 06. Testing Activities / Animated QA Workflows */}
        <TestingActivitiesSection activitiesData={data.testingActivitiesData} />

        {/* 07. Test Levels / Assembling Architectural Diagram */}
        <TestLevelsSection levels={data.testLevelsData} />

        {/* 08. Testing Timeline / Scroll Storytelling Roadmap */}
        <TimelineSection phases={data.testingPhases} />
      </main>

      {/* Exhibition Footer */}
      <Footer meta={data.projectMeta} />
    </div>
  );
};

export default App;
