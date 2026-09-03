import React from 'react';
import {
  Route,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  Play,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { learningPathSteps } from '../data/mockData';

export const LearningPathView: React.FC = () => {
  const {
    courses,
    navigate,
    setWhyRecommendedCourse,
    enrollCourse,
  } = useApp();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <Route className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Your Personalized Learning Path
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Synthesized dynamically using your ISS cadre role requirements, active skill gap diagnostics, and MoSPI modernization priorities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Path Progress: <strong className="text-blue-600">20%</strong> (1 of 5 completed)
          </span>
        </div>
      </div>

      {/* Path Roadmap Container */}
      <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-linear-to-b before:from-blue-600 before:via-indigo-500 before:to-slate-300 dark:before:to-slate-700">
        {learningPathSteps.map((step) => {
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
