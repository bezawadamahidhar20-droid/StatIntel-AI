import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Route,
  ArrowRight,
  BookOpen,
  BarChart3,
  RotateCcw,
  Target,
  Clock,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AssessmentResultView: React.FC = () => {
  const {
    lastQuizResult,
    navigate,
    switchRole,
    currentUser,
    competencies,
  } = useApp();

  // If no quiz result yet, provide default demo stats
  const result = lastQuizResult || {
    assessmentId: 'asmt-001',
    assessmentTitle: 'Survey Design & Sampling Methodology Grounded Diagnostic',
    targetCompetency: 'Survey Design & Sampling Methodology',
    score: 4,
    total: 5,
    accuracy: 80,
    timeSpentSeconds: 240,
    competencyBefore: 78,
    competencyAfter: 86,
    competencyGain: 8,
    answers: [],
    timestamp: 'Just now',
  };

  const minutes = Math.floor(result.timeSpentSeconds / 60);
  const seconds = result.timeSpentSeconds % 60;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Completion Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Closed-Loop Assessment Validated</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Competency Twin Synchronized
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed font-normal">
            Your answers from <strong className="text-slate-900">{result.assessmentTitle}</strong> have directly upgraded your official MoSPI Competency Digital Twin and updated your cadre readiness.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score & Accuracy */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Accuracy Rate
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">
              {result.accuracy}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({result.score}/{result.total} Correct)
            </span>
          </div>
          <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Exceeds standard 70% threshold</span>
          </p>
        </div>

        {/* Competency Gain */}
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-xs space-y-2 bg-blue-50/30">
          <p className="text-xs font-semibold uppercase text-blue-700 tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Digital Twin Boost</span>
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              +{result.competencyGain}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({result.competencyBefore}% → {result.competencyAfter}%)
            </span>
          </div>
          <p className="text-xs text-slate-600 truncate">
            Target: <span className="font-semibold text-slate-800">{result.targetCompetency}</span>
          </p>
        </div>

        {/* Role Readiness */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Role Readiness
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {currentUser.roleReadiness}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">
              +4% Increase
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cadre Target: 85% for Senior Posting
          </p>
        </div>

        {/* Duration */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
            Time Taken
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {minutes}m {seconds}s
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Pacing: ~48s per grounded question
          </p>
        </div>
      </div>

      {/* Closed Loop Visual Demonstration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <span>Closed-Loop Digital Twin Impact</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live feedback cycle: Grounded Assessment → Evidence Audit → Digital Twin Upgrade → Gap Reduction
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('digital-twin')}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              <span>Inspect Digital Twin</span>
            </button>
            <button
              onClick={() => navigate('skill-gaps')}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Inspect Skill Gaps</span>
            </button>
          </div>
        </div>

        {/* Competency Level Transition Visualization */}
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">Target Competency</p>
              <p className="text-base font-bold text-slate-900">{result.targetCompetency}</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[11px] text-slate-500 uppercase font-medium">Before Test</p>
                <p className="text-base font-semibold text-slate-600">{result.competencyBefore}%</p>
              </div>

              <div className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full flex items-center gap-1">
                <span>+{result.competencyGain}%</span>
                <ArrowRight className="w-3 h-3" />
              </div>

              <div>
                <p className="text-[11px] text-blue-600 uppercase font-semibold">Updated Score</p>
                <p className="text-lg font-bold text-slate-900">{result.competencyAfter}%</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden relative">
            <div
              className="bg-slate-400 h-full absolute left-0"
              style={{ width: `${result.competencyBefore}%` }}
            />
            <div
              className="bg-emerald-500 h-full absolute"
              style={{
                left: `${result.competencyBefore}%`,
                width: `${result.competencyGain}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>L1: Beginner (0-39)</span>
            <span>L2: Developing (40-59)</span>
            <span className="text-slate-700 font-semibold">L3: Operational (60-79)</span>
            <span className="text-emerald-700 font-bold">L4: Advanced (80-92) ★ TARGET MET</span>
            <span>L5: Expert (93-100)</span>
          </div>
        </div>

        {/* Recommended Next Actions in Sequence */}
        <div className="pt-2">
          <p className="text-xs font-bold uppercase text-slate-500 mb-3 tracking-wider">
            Recommended Next Step in Workflow
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('learning-path')}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all shadow-2xs group"
            >
              <Route className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">View Learning Path</p>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                See how next courses are dynamically prioritized.
              </p>
            </button>

            <button
              onClick={() => navigate('courses')}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all shadow-2xs group"
            >
              <BookOpen className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">Explore Courses</p>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Browse official iGOT and NSSTA micro-modules.
              </p>
            </button>

            <button
              onClick={() => {
                switchRole('ADMIN');
                navigate('admin-dashboard');
              }}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-xl text-left transition-all shadow-2xs group"
            >
              <BarChart3 className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-xs font-bold text-slate-900">Admin Dashboard</p>
              <p className="text-xs text-slate-500 mt-1 font-normal">
                Inspect organizational workforce heatmaps.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
