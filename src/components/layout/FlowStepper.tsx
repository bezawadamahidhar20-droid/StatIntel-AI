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
  stage: string;
  roleRequired?: 'LEARNER' | 'ADMIN';
}

export const FLOW_STEPS: FlowStep[] = [
  { id: 'dashboard', number: 1, label: 'Competency Overview', stage: 'Stage 1: Assess' },
  { id: 'digital-twin', number: 2, label: 'Digital Twin Model', stage: 'Stage 1: Assess' },
  { id: 'skill-gaps', number: 3, label: 'Gap Analysis', stage: 'Stage 2: Analyze' },
  { id: 'learning-path', number: 4, label: 'Adaptive Path', stage: 'Stage 3: Learn' },
  { id: 'courses', number: 5, label: 'MoSPI Modules', stage: 'Stage 3: Learn' },
  { id: 'quiz-generator', number: 6, label: 'AI Quiz Studio', stage: 'Stage 4: Certify' },
  { id: 'assessment', number: 7, label: 'Competency Exam', stage: 'Stage 4: Certify' },
  { id: 'admin-dashboard', number: 8, label: 'Cadre Intelligence', stage: 'Executive Governance', roleRequired: 'ADMIN' },
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
    <aside aria-label="End-to-end evaluation flow" className="w-full bg-white border-b border-slate-200 px-4 sm:px-6 py-2 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Step Label & Sequence indicator */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md text-xs font-semibold text-blue-800">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>SIH WORKFLOW PIPELINE</span>
          </div>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Step {currentStepIndex >= 0 ? currentStepIndex + 1 : 1} of {FLOW_STEPS.length}
          </span>
        </div>

        {/* Interactive Step Pills */}
        <nav aria-label="Evaluation workflow steps" className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : isCompleted
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100/70'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title={`Jump to ${step.label} (${step.stage})`}
                >
                  <span className={isCurrent ? 'text-blue-100' : 'text-slate-400'}>{step.number}.</span>
                  <span>{step.label}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                </button>
                {idx < FLOW_STEPS.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Quick Next / Prev Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
          {prevStep && (
            <button
              onClick={handlePrev}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Previous</span>
            </button>
          )}

          {nextStep && (
            <button
              onClick={handleNext}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Next: {nextStep.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

