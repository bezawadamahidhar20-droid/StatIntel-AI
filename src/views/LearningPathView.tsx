import React, { useState, useEffect } from 'react';
import {
  Route,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  Play,
  Lock,
  Target,
  UserCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { LearningPathStep } from '../types';
import { learningPathSteps } from '../data/mockData';
import { StudentSkillProfiler } from '../components/common/StudentSkillProfiler';

export const LearningPathView: React.FC = () => {
  const {
    currentUser,
    targetCareerRole,
    userSkills,
    competencies,
    skillGaps,
    courses,
    navigate,
    setWhyRecommendedCourse,
    enrollCourse,
  } = useApp();

  const [pathSteps, setPathSteps] = useState<LearningPathStep[]>(learningPathSteps);
  const [pathMeta, setPathMeta] = useState<{
    targetCompetency: string;
    targetLevel: string;
    estimatedDuration: string;
    overallProgress: number;
  }>({
    targetCompetency: 'Survey Design & Sampling Methodology',
    targetLevel: 'L4 (Advanced)',
    estimatedDuration: '28 hours total',
    overallProgress: 35,
  });
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  const activeTargetRole = targetCareerRole || currentUser.designation || 'Data Analyst';

  // Acquired / Known Skills (Skills user has)
  const skillsYouHave = competencies.filter(
    (c) => c.currentScore >= c.requiredScore || (userSkills && userSkills.some((s) => s.toLowerCase() === c.name.toLowerCase()))
  );

  // Missing Skills / Gaps (Skills user does not have yet)
  const skillsYouNeed = skillGaps.length > 0
    ? skillGaps
    : competencies.filter((c) => c.gap < 0).map((c) => ({
        id: `gap-${c.id}`,
        competencyName: c.name,
        severity: c.status === 'Critical Gap' ? 'Critical' : 'Medium',
        currentScore: c.currentScore,
        requiredScore: c.requiredScore,
        gapLevels: 1,
        estimatedTimeToBridge: '8-12 hours',
      }));

  useEffect(() => {
    let isMounted = true;
    async function fetchLearningPath() {
      try {
        const res = await apiClient.getLearningPath();
        if (isMounted && res && res.steps && res.steps.length > 0) {
          setPathSteps(res.steps);
          setPathMeta({
            targetCompetency: res.targetCompetency,
            targetLevel: res.targetLevel,
            estimatedDuration: res.estimatedDuration,
            overallProgress: res.overallProgress,
          });
          setIsLiveConnected(true);
        }
      } catch (err) {
        console.warn('[LearningPath] Live backend unavailable, using baseline pathway:', err);
        if (isMounted) {
          setIsLiveConnected(false);
        }
      }
    }
    fetchLearningPath();
    return () => {
      isMounted = false;
    };
  }, []);

  const completedCount = pathSteps.filter((s) => s.status === 'Completed').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <Route className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Personalized Adaptive Skill Roadmap
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Welcome, <strong>{currentUser.name}</strong> • AI Competency Gap Analysis & Guided Curricula for{' '}
            <strong className="text-blue-700 dark:text-blue-400">{activeTargetRole}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono rounded">
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveConnected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'
              }`}
            />
            <span className="text-slate-600 dark:text-slate-300 font-semibold">
              {isLiveConnected ? 'FASTAPI LIVE SYNC' : 'OFFLINE CACHED'}
            </span>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            Roadmap Progress: <strong className="text-blue-600">{pathMeta.overallProgress}%</strong> ({completedCount} of{' '}
            {pathSteps.length} completed)
          </span>
        </div>
      </div>

      {/* ── SKILLS YOU HAVE VS SKILLS YOU DO NOT HAVE CARD ───────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                AI Competency Diagnostics Overview
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Role Target: {activeTargetRole}
            </h2>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center">
              <span className="text-emerald-400 text-sm font-black">{skillsYouHave.length}</span>
              <span className="text-[10px] text-slate-300 block uppercase">Skills Mastered</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center">
              <span className="text-rose-400 text-sm font-black">{skillsYouNeed.length}</span>
              <span className="text-[10px] text-slate-300 block uppercase">Missing Gaps</span>
            </div>
            <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-center">
              <span className="text-amber-400 text-sm font-black">{currentUser.roleReadiness || 68}%</span>
              <span className="text-[10px] text-slate-300 block uppercase">Readiness</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 p-5 gap-5">
          {/* Left: Skills You Have */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Skills You Have ({skillsYouHave.length})</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Verified Proficient
              </span>
            </div>

            {skillsYouHave.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No skills registered yet. Enter your known skills below.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skillsYouHave.map((s, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{s.name}</span>
                    <span className="text-[10px] bg-emerald-200/80 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                      {s.currentScore ? `${s.currentScore}%` : 'L3'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Skills You Do NOT Have (Missing Skills) */}
          <div className="space-y-3 md:pl-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-700 flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Skills You Need / Missing Gaps ({skillsYouNeed.length})</span>
              </h3>
              <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                In Roadmap Below
              </span>
            </div>

            {skillsYouNeed.length === 0 ? (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You meet all competency standards for {activeTargetRole}.</span>
              </div>
            ) : (
              <div className="space-y-2">
                {skillsYouNeed.slice(0, 4).map((g: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl text-xs"
                  >
                    <div className="flex items-center gap-2 truncate mr-2">
                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      <span className="font-bold text-rose-950 truncate">{g.competencyName}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          g.severity === 'Critical'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}
                      >
                        {g.severity || 'Gap'}
                      </span>
                      <button
                        onClick={() => navigate('courses')}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-colors shadow-2xs"
                      >
                        <span>Learn</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Student Skill Profiler & Career Roadmap Studio */}
      <StudentSkillProfiler />

      {/* Path Roadmap Container */}
      <div className="pt-6 border-t border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Detailed Official Curricula Pathway
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Sequential micro-credentials from iGOT Karmayogi Bharat and National Statistical Academy (NSSTA).
        </p>
      </div>

      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-linear-to-b before:from-blue-600 before:via-indigo-500 before:to-slate-300 dark:before:to-slate-700">
        {pathSteps.map((step) => {
          const linkedCourse = courses.find((c) => c.id === step.courseId);
          const isCompleted = step.status === 'Completed';
          const isInProgress = step.status === 'In Progress';
          const isUpNext = step.status === 'Up Next';
          const isLocked = step.status === 'Locked';

          return (
            <div key={step.stepNumber} className="relative group">
              {/* Step Circle Node */}
              <div
                className={`absolute -left-6 sm:-left-10 top-5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs border-2 transition-transform group-hover:scale-110 ${
                  isCompleted
                    ? 'bg-emerald-500 border-white text-white'
                    : isInProgress
                    ? 'bg-blue-600 border-white text-white ring-4 ring-blue-100 dark:ring-blue-900/50'
                    : isUpNext
                    ? 'bg-white dark:bg-slate-900 border-indigo-500 text-indigo-600'
                    : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isLocked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  step.stepNumber
                )}
              </div>

              {/* Step Card */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  isInProgress
                    ? 'bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 shadow-md ring-1 ring-blue-100 dark:ring-blue-950'
                    : isCompleted
                    ? 'bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      Step {step.stepNumber} • {step.domain}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {step.provider}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {step.matchScore}% Match
                    </span>
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                        isInProgress
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {step.courseTitle}
                </h3>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Duration: {step.duration}
                  </span>
                  <span>•</span>
                  <span>Difficulty: {step.difficulty}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Target Outcome: {step.expectedImprovement}
                  </span>
                </div>

                {/* Competencies Improved Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Skills:</span>
                  {step.competenciesImproved.map((ci, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[11px] font-medium border border-blue-100 dark:border-blue-900"
                    >
                      {ci}
                    </span>
                  ))}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  {linkedCourse && (
                    <button
                      onClick={() => setWhyRecommendedCourse(linkedCourse)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why Recommended? (Explainable AI)</span>
                    </button>
                  )}

                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => navigate('quiz-generator')}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Generate Quiz
                    </button>

                    {linkedCourse && (
                      <button
                        onClick={() => {
                          enrollCourse(linkedCourse.id);
                          navigate('course-detail', { courseId: linkedCourse.id });
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors ${
                          isInProgress
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{isInProgress ? 'Continue Course' : 'Start Course'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
