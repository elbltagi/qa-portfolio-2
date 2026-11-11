import React, { useEffect } from 'react';
import { useProjectData } from './hooks/useProjectData';
import { useActiveChapter } from './hooks/useActiveChapter';
import { useRoute } from './lib/router';
import { findRoutablePage } from './lib/chapters';
import { announceMounted } from './lib/boot';
import { Cursor } from './components/Cursor';
import { Navbar } from './components/Navbar';
import { ChapterRail } from './components/ChapterRail';
import { ScrollProgress } from './components/ScrollProgress';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import {
  BugsPage,
  DashboardPage,
  StoriesPage,
  SummaryPage,
  TestCasesPage,
} from './pages/DetailPages';

const BASE_TITLE =
  'The Quality Journey — Practice Software Testing (Toolshop) Test Report';

export const App: React.FC = () => {
  const { data } = useProjectData();
  const { path } = useRoute();
  const { activeId, progress } = useActiveChapter();

  const detailPage = findRoutablePage(path);
  const isHome = !detailPage;

  // Let the boot curtain know the app is up; it holds until this lands.
  useEffect(() => {
    announceMounted();
  }, []);

  // Keep the document title in step with the route.
  useEffect(() => {
    document.title = detailPage
      ? `${detailPage.title} — The Quality Journey`
      : BASE_TITLE;
  }, [detailPage]);

  const renderDetail = () => {
    switch (path) {
      case '/stories':
        return <StoriesPage stories={data.moduleStories} />;
      case '/test-cases':
        return <TestCasesPage stories={data.moduleStories} />;
      case '/bugs':
        return <BugsPage />;
      case '/summary':
        return <SummaryPage />;
      case '/dashboard':
        return <DashboardPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink selection:bg-accent selection:text-white">
      <a
        href="#overview"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-white focus:text-sm"
      >
        Skip to content
      </a>

      <Cursor />
      <ScrollProgress progress={progress} />
      <Navbar
        targetUrl={data.projectMeta.liveAppUrl}
        activeId={activeId}
        reportDate={data.projectMeta.reportDate}
        currentPath={path}
      />
      {isHome && <ChapterRail activeId={activeId} />}

      {isHome ? <HomePage data={data} /> : renderDetail()}

      <Footer meta={data.projectMeta} />
    </div>
  );
};

export default App;
