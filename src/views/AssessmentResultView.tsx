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
    <div className="space-y-8 bg-[#080808] text-white">
      {/* Top Completion Header */}
      <div className="bg-[#121212] border border-[#222222] p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D8FE41]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D8FE41]/10 border border-[#D8FE41]/40 text-[#D8FE41] text-xs font-mono font-bold uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4 text-[#D8FE41]" />
            <span>CLOSED-LOOP ASSESSMENT COMPLETE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black font-display uppercase tracking-tight text-white">
            Competency Twin Synchronized
          </h1>

          <p className="text-sm font-mono text-[#aaaaaa] leading-relaxed">
            Your validated answers from <strong className="text-white">{result.assessmentTitle}</strong> have directly upgraded your official MoSPI Competency Digital Twin and refreshed your career role readiness.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid: High-contrast Bold Typography */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score & Accuracy */}
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Accuracy Rate
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-[#D8FE41]">
              {result.accuracy}%
            </span>
            <span className="text-xs font-mono text-[#888888]">
              ({result.score}/{result.total} Correct)
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            MoSPI Benchmarking: Exceeds standard pass threshold of 70%
          </p>
        </div>

        {/* Competency Gain */}
        <div className="bg-[#121212] border border-[#D8FE41]/50 p-6 space-y-2 shadow-[0_0_15px_rgba(216,254,65,0.1)]">
          <p className="text-[11px] font-mono font-bold uppercase text-[#D8FE41] tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#D8FE41]" />
            <span>Digital Twin Boost</span>
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">
              +{result.competencyGain}%
            </span>
            <span className="text-xs font-mono text-[#888888]">
              ({result.competencyBefore}% → {result.competencyAfter}%)
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#D8FE41]">
            Target Competency: {result.targetCompetency}
          </p>
        </div>

        {/* Role Readiness */}
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Overall Role Readiness
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">
              {currentUser.roleReadiness}%
            </span>
            <span className="text-xs font-mono text-[#D8FE41] font-bold">
              +4% Increase
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            Cadre Target: 85% for Senior Posting Qualification
          </p>
        </div>

        {/* Duration */}
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Time Taken
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">
              {minutes}m {seconds}s
            </span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            Average speed: ~48s per grounded methodological item
          </p>
        </div>
      </div>

      {/* Closed Loop Visual Demonstration Card */}
      <div className="bg-[#121212] border border-[#222222] p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222222] pb-4 gap-3">
          <div>
            <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#D8FE41]" />
              <span>Closed-Loop Digital Twin Impact Summary</span>
            </h2>
            <p className="text-xs font-mono text-[#888888] mt-0.5">
              Live feedback loop executed: Assessment → Evidence Audit → Competency Twin → Gap Reduction
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('digital-twin')}
              className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Cpu className="w-3.5 h-3.5 text-[#D8FE41]" />
              <span>Inspect Digital Twin</span>
            </button>
            <button
              onClick={() => navigate('skill-gaps')}
              className="px-3.5 py-1.5 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-[#D8FE41]" />
              <span>Inspect Skill Gaps</span>
            </button>
          </div>
        </div>

        {/* Competency Level Transition Visualization */}
        <div className="p-6 bg-[#0e0e0e] border border-[#222222] space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase text-[#888888]">Target Competency</p>
              <p className="text-base font-mono font-black text-white">{result.targetCompetency}</p>
            </div>

            <div className="flex items-center gap-4 font-mono">
              <div className="text-right">
                <p className="text-[10px] text-[#888888] uppercase">Before Test</p>
                <p className="text-lg font-bold text-[#888888]">{result.competencyBefore}%</p>
              </div>

              <div className="px-3 py-1 bg-[#D8FE41] text-black font-black text-xs uppercase tracking-widest flex items-center gap-1">
                <span>+{result.competencyGain}%</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>

              <div>
                <p className="text-[10px] text-[#D8FE41] uppercase font-bold">Updated Score</p>
                <p className="text-lg font-black text-white">{result.competencyAfter}%</p>
              </div>
            </div>
          </div>

          <div className="w-full bg-[#181818] h-3 rounded-none overflow-hidden relative">
            <div
              className="bg-[#444444] h-full absolute left-0"
              style={{ width: `${result.competencyBefore}%` }}
            />
            <div
              className="bg-[#D8FE41] h-full absolute"
              style={{
                left: `${result.competencyBefore}%`,
                width: `${result.competencyGain}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-[#888888]">
            <span>L1: Beginner (0-39)</span>
            <span>L2: Developing (40-59)</span>
            <span className="text-white font-bold">L3: Operational (60-79)</span>
            <span className="text-[#D8FE41] font-bold">L4: Advanced (80-92) ★ TARGET MET</span>
            <span>L5: Expert (93-100)</span>
          </div>
        </div>

        {/* Recommended Next Actions in Sequence */}
        <div className="pt-2">
          <p className="text-xs font-mono font-bold uppercase text-[#888888] mb-3">
            Recommended Next Step in Workflow
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('learning-path')}
              className="p-4 bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#D8FE41] text-left transition-all"
            >
              <Route className="w-5 h-5 text-[#D8FE41] mb-2" />
              <p className="text-xs font-mono font-bold text-white uppercase">6. View Learning Path</p>
              <p className="text-[11px] font-mono text-[#888888] mt-1">
                See how your next steps are dynamically prioritized.
              </p>
            </button>

            <button
              onClick={() => navigate('courses')}
              className="p-4 bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#D8FE41] text-left transition-all"
            >
              <BookOpen className="w-5 h-5 text-[#D8FE41] mb-2" />
              <p className="text-xs font-mono font-bold text-white uppercase">7. Explore Courses</p>
              <p className="text-[11px] font-mono text-[#888888] mt-1">
                Browse official iGOT and NSSTA micro-modules.
              </p>
            </button>

            <button
              onClick={() => {
                switchRole('ADMIN');
                navigate('admin-dashboard');
              }}
              className="p-4 bg-[#151515] hover:bg-[#1a1a1a] border border-[#252525] hover:border-[#D8FE41] text-left transition-all"
            >
              <BarChart3 className="w-5 h-5 text-[#D8FE41] mb-2" />
              <p className="text-xs font-mono font-bold text-white uppercase">10. Admin Dashboard</p>
              <p className="text-[11px] font-mono text-[#888888] mt-1">
                Inspect organizational workforce intelligence & division heatmaps.
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
