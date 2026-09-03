import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  ChevronRight,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface FlowStep {
  id: AppView;
  number: number;
  label: string;
  roleRequired?: 'LEARNER' | 'ADMIN';
}

export const FLOW_STEPS: FlowStep[] = [
  { id: 'landing', number: 1, label: 'Landing' },
  { id: 'login', number: 2, label: 'Login' },
  { id: 'dashboard', number: 3, label: 'Learner Dashboard' },
  { id: 'digital-twin', number: 4, label: 'Competency Digital Twin' },
  { id: 'skill-gaps', number: 5, label: 'Skill Gap' },
  { id: 'learning-path', number: 6, label: 'Learning Path' },
  { id: 'courses', number: 7, label: 'Courses' },
  { id: 'quiz-generator', number: 8, label: 'Quiz Generator' },
  { id: 'assessment', number: 9, label: 'Assessment' },
  { id: 'admin-dashboard', number: 10, label: 'Admin Dashboard', roleRequired: 'ADMIN' },
];

export const FlowStepper: React.FC = () => {
  const { activeView, navigate, switchRole, userRole } = useApp();

  const currentStepIndex = FLOW_STEPS.findIndex((s) => {
    if (activeView === 'course-detail') return s.id === 'courses';
    if (activeView === 'assessment-result') return s.id === 'assessment';
    if (activeView.startsWith('admin-')) return s.id === 'admin-dashboard';
    return s.id === activeView;
  });

  const nextStep = currentStepIndex >= 0 && currentStepIndex < FLOW_STEPS.length - 1
    ? FLOW_STEPS[currentStepIndex + 1]
    : null;

  const prevStep = currentStepIndex > 0
    ? FLOW_STEPS[currentStepIndex - 1]
    : null;

  const handleStepClick = (step: FlowStep) => {
    if (step.roleRequired && userRole !== step.roleRequired) {
      switchRole(step.roleRequired);
    } else if (!step.roleRequired && userRole === 'ADMIN' && step.id !== 'admin-dashboard') {
      switchRole('LEARNER');
    }
    navigate(step.id);
  };

  const handleNext = () => {
    if (nextStep) {
      handleStepClick(nextStep);
    }
  };

  const handlePrev = () => {
    if (prevStep) {
      handleStepClick(prevStep);
    }
  };

  return (
    <aside aria-label="End-to-end evaluation flow" className="w-full bg-[#0d0d0d] border-b border-[#222222] px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Step Label & Sequence indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-[#D8FE41]/10 border border-[#D8FE41]/40 rounded text-[10px] font-mono font-bold tracking-widest text-[#D8FE41] uppercase">
            <Sparkles className="w-3 h-3 text-[#D8FE41]" />
            <span>SIH WORKFLOW SEQUENCE</span>
          </div>
          <span className="text-xs font-mono text-[#888888] hidden sm:inline">
            STEP {currentStepIndex >= 0 ? currentStepIndex + 1 : 1} OF 10
          </span>
        </div>

        {/* Interactive Step Pills */}
        <nav aria-label="Evaluation workflow steps" className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs">
          {FLOW_STEPS.map((step, idx) => {
            const isCurrent =
              activeView === step.id ||
              (step.id === 'courses' && activeView === 'course-detail') ||
              (step.id === 'assessment' && activeView === 'assessment-result') ||
              (step.id === 'admin-dashboard' && activeView.startsWith('admin-'));
            const isCompleted = currentStepIndex > idx;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(step)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-[#D8FE41] text-black font-extrabold shadow-[0_0_12px_rgba(216,254,65,0.4)]'
                      : isCompleted
                      ? 'bg-[#181818] text-[#D8FE41] border border-[#2a2a2a] hover:border-[#D8FE41]/40'
                      : 'bg-[#141414] text-[#777777] hover:text-white border border-[#202020]'
                  }`}
                  title={`Jump to ${step.label}`}
                >
                  <span className="opacity-70">{step.number}.</span>
                  <span>{step.label}</span>
                  {isCompleted && <CheckCircle2 className="w-2.5 h-2.5 text-[#D8FE41]" />}
                </button>
                {idx < FLOW_STEPS.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-[#333333] shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Quick Next Button */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {prevStep && (
            <button
              onClick={handlePrev}
              className="px-2.5 py-1 rounded bg-[#161616] hover:bg-[#222222] text-white border border-[#2a2a2a] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Prev</span>
            </button>
          )}

          {nextStep && (
            <button
              onClick={handleNext}
              className="px-3 py-1 rounded bg-[#D8FE41] hover:bg-[#c4eb34] text-black text-[11px] font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_10px_rgba(216,254,65,0.25)] transition-all"
            >
              <span>Next: {nextStep.label}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
