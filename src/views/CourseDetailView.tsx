import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
  Play,
  Shield,
  BookOpen,
  Award,
  TrendingUp,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CourseDetailView: React.FC = () => {
  const {
    activeCourseId,
    courses,
    navigate,
    setWhyRecommendedCourse,
    enrollCourse,
    updateCourseProgress,
  } = useApp();

  const course = courses.find((c) => c.id === activeCourseId) || courses[0];
  const [completedModules, setCompletedModules] = useState<string[]>(
    course.modules.filter((m) => m.completed).map((m) => m.id)
  );

  const toggleModule = (modId: string) => {
    let next: string[];
    if (completedModules.includes(modId)) {
      next = completedModules.filter((id) => id !== modId);
    } else {
      next = [...completedModules, modId];
    }
    setCompletedModules(next);

    const calculatedProgress = Math.round((next.length / course.modules.length) * 100);
    updateCourseProgress(course.id, calculatedProgress);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate('courses')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Course Marketplace</span>
      </button>

      {/* Main Course Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold">
              {course.provider}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
              {course.domain}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              {course.matchScore}% Cadre Match
            </span>
            <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
              <Star className="w-4 h-4 fill-amber-400" /> {course.rating} ({course.reviewCount} reviews)
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
          {course.title}
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {course.description}
        </p>

        {/* Quick Meta Strip */}
        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" /> Duration: <strong className="text-slate-800 dark:text-slate-200">{course.duration}</strong>
          </span>
          <span>Difficulty: <strong className="text-slate-800 dark:text-slate-200">{course.difficulty}</strong></span>
          <span>Language: <strong className="text-slate-800 dark:text-slate-200">{course.language}</strong></span>
          <span>Status: <strong className="text-blue-600">{course.status}</strong></span>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              enrollCourse(course.id);
            }}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{course.status === 'In Progress' ? 'Continue Programme' : 'Enroll Now'}</span>
          </button>

          <button
            onClick={() => setWhyRecommendedCourse(course)}
            className="px-4 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center gap-1.5 hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Why This Course? (Explainable AI)</span>
          </button>

          <button
            onClick={() => navigate('quiz-generator')}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs flex items-center gap-1.5 ml-auto"
          >
            <FileCheck className="w-4 h-4 text-purple-600" />
            <span>Generate AI Quiz from Course PDF</span>
          </button>
        </div>
      </div>

      {/* AI Section: Why this course matters for you */}
      <div className="p-6 rounded-2xl bg-linear-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-slate-900 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Why This Course Matters for Your Senior Statistical Officer Role
          </h2>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {course.whyRecommended.summary}
        </p>

        {/* Competency Level Trajectory */}
        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">Current Verified Level</p>
            <p className="text-xl font-bold text-rose-600">L2 (48%)</p>
            <p className="text-[10px] text-slate-500">Working Practitioner</p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">Expected Course Outcome</p>
            <p className="text-xl font-bold text-emerald-600">L3 (66%)</p>
            <p className="text-[10px] text-slate-500">Proficient Specialist</p>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <p className="text-[11px] text-slate-400">Cadre Role Target</p>
            <p className="text-xl font-bold text-blue-600">L4 (75%)</p>
            <p className="text-[10px] text-slate-500">Advanced Division Lead</p>
          </div>
        </div>
      </div>

      {/* Curriculum Modules */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Curriculum & Hands-on Modules ({course.modules.length})
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Click checkbox to log completed module
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {course.modules.map((mod, idx) => {
            const isDone = completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => toggleModule(mod.id)}
                className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        isDone ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      Module {idx + 1}: {mod.title}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-mono shrink-0">
                  {mod.duration}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prerequisites & Outcomes Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Prerequisites
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {course.prerequisites.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Verified Learning Outcomes
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            {course.outcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
