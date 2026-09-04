import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { FlowStepper } from './components/layout/FlowStepper';
import { CommandPalette } from './components/layout/CommandPalette';
import { CompetencyDetailDrawer } from './components/common/CompetencyDetailDrawer';
import { WhyRecommendedModal } from './components/common/WhyRecommendedModal';
import { AuthModal } from './components/common/AuthModal';
import { AdminAuthModal } from './components/common/AdminAuthModal';

// Views
import { LandingView } from './views/LandingView';
import { LoginView } from './views/LoginView';
import { LearnerDashboardView } from './views/LearnerDashboardView';
import { CompetencyDigitalTwinView } from './views/CompetencyDigitalTwinView';
import { SkillGapView } from './views/SkillGapView';
import { LearningPathView } from './views/LearningPathView';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { QuizGeneratorView } from './views/QuizGeneratorView';
import { AssessmentView } from './views/AssessmentView';
import { AssessmentResultView } from './views/AssessmentResultView';
import { AdminDashboardView } from './views/AdminDashboardView';
import type { AppView } from './context/AppContext';

const MainLayout: React.FC = () => {
  const {
    activeView,
    selectedCompetency,
    setSelectedCompetency,
    whyRecommendedCourse,
    setWhyRecommendedCourse,
    navigate,
    isAuthenticated,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Hash sync ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      const isAuth = isAuthenticated || localStorage.getItem('statintel_auth') === 'true';
      if (hash && hash !== activeView) {
        if (isAuth || hash === 'landing' || hash === 'login') {
          navigate(hash as AppView);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    const initialHash = window.location.hash.replace('#/', '');
    if (initialHash && initialHash !== activeView) handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeView, navigate, isAuthenticated]);

  useEffect(() => {
    if (window.location.hash !== `#/${activeView}`) {
      window.location.hash = `#/${activeView}`;
    }
  }, [activeView]);

  // ── View renderer ──────────────────────────────────────────────────────────
  const renderView = (view: AppView) => {
    switch (view) {
      case 'landing':             return <LandingView />;
      case 'login':               return <LoginView />;
      case 'dashboard':           return <LearnerDashboardView />;
      case 'digital-twin':        return <CompetencyDigitalTwinView />;
      case 'skill-gaps':          return <SkillGapView />;
      case 'learning-path':       return <LearningPathView />;
      case 'courses':             return <CoursesView />;
      case 'course-detail':       return <CourseDetailView />;
      case 'quiz-generator':      return <QuizGeneratorView />;
      case 'assessment':          return <AssessmentView />;
      case 'assessment-result':   return <AssessmentResultView />;
      case 'admin-dashboard':
      case 'admin-heatmap':
      case 'admin-training-effectiveness':
      case 'admin-predictive':
      case 'admin-training-planner':
        return <AdminDashboardView key={view} />;
      default:
        return <LearnerDashboardView />;
    }
  };

  const isFullPageView = activeView === 'landing' || activeView === 'login';

  return (
    <div className="h-full flex flex-col font-sans text-slate-900 bg-slate-50 selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Persistent App Header */}
      <AppHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* SIH Workflow Stepper Navigator */}
      <FlowStepper />

      {isFullPageView ? (
        <main
          key={activeView}
          className="flex-1 w-full overflow-y-auto bg-slate-50 view-enter"
          style={{ minHeight: 0 }}
        >
          {renderView(activeView)}
        </main>
      ) : (
        <div className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>
          {/* Persistent Sidebar */}
          <AppSidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Main Content Area — scrolls internally, window never scrolls */}
          <main
            key={activeView}
            className="flex-1 overflow-y-auto bg-slate-50 min-w-0 view-enter"
            style={{ minHeight: 0 }}
          >
            <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
              {renderView(activeView)}
            </div>
          </main>
        </div>
      )}

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Competency Deep Dive Drawer */}
      <CompetencyDetailDrawer
        competency={selectedCompetency}
        onClose={() => setSelectedCompetency(null)}
      />

      {/* Explainable AI Recommendation Modal */}
      <WhyRecommendedModal
        course={whyRecommendedCourse}
        onClose={() => setWhyRecommendedCourse(null)}
      />

      {/* Student Login & Demo New User Popup */}
      <AuthModal />

      {/* Institutional Admin Security Gate Modal */}
      <AdminAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

