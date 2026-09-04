import React, { useState } from 'react';
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

const MainLayout: React.FC = () => {
  const {
    activeView,
    selectedCompetency,
    setSelectedCompetency,
    whyRecommendedCourse,
    setWhyRecommendedCourse,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigate } = useApp();

  // Sync activeView with window.location.hash for deep-linking during SIH evaluation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash && hash !== activeView) {
        navigate(hash as any);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    const initialHash = window.location.hash.replace('#/', '');
    if (initialHash && initialHash !== activeView) {
      handleHashChange();
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  React.useEffect(() => {
    if (window.location.hash !== `#/${activeView}`) {
      window.location.hash = `#/${activeView}`;
    }
  }, [activeView]);

  // Determine which view to render
  const renderActiveView = () => {
    switch (activeView) {
      case 'landing':
        return <LandingView />;
      case 'login':
        return <LoginView />;
      case 'dashboard':
        return <LearnerDashboardView />;
      case 'digital-twin':
        return <CompetencyDigitalTwinView />;
      case 'skill-gaps':
        return <SkillGapView />;
      case 'learning-path':
        return <LearningPathView />;
      case 'courses':
        return <CoursesView />;
      case 'course-detail':
        return <CourseDetailView />;
      case 'quiz-generator':
        return <QuizGeneratorView />;
      case 'assessment':
        return <AssessmentView />;
      case 'assessment-result':
        return <AssessmentResultView />;
      case 'admin-dashboard':
      case 'admin-heatmap':
      case 'admin-training-effectiveness':
      case 'admin-predictive':
      case 'admin-training-planner':
        return <AdminDashboardView />;
      default:
        return <LearnerDashboardView />;
    }
  };

  // Views that have full-page hero layout or don't need persistent app sidebar
  const isFullPageView = activeView === 'landing' || activeView === 'login';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Persistent App Header with MoSPI Branding, Role Switcher & Notifications */}
      <AppHeader onMobileMenuToggle={() => setMobileMenuOpen(true)} />

      {/* SIH Workflow Stepper Navigator */}
      <FlowStepper />

      {isFullPageView ? (
        <main className="flex-1 w-full bg-slate-50">
          {renderActiveView()}
        </main>
      ) : (
        <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
          {/* Persistent Sidebar */}
          <AppSidebar
            mobileOpen={mobileMenuOpen}
            onMobileClose={() => setMobileMenuOpen(false)}
          />

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50 min-w-0">
            {renderActiveView()}
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
