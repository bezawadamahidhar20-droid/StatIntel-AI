import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  Cpu,
  Target,
  Sparkles,
  HelpCircle,
  Shield,
  Bot,
  ArrowRight,
  X,
  FileText,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

export const CommandPalette: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    navigate,
    courses,
    competencies,
    assessments,
    setSelectedCompetency,
    setActiveCourseId,
    setActiveAssessmentId,
    switchRole,
    userRole,
  } = useApp();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  // Filter items based on query
  const trimmed = query.trim().toLowerCase();

  const matchingCourses = courses
    .filter(
      (c) =>
        c.title.toLowerCase().includes(trimmed) ||
        c.provider.toLowerCase().includes(trimmed) ||
        c.competenciesCovered.some((comp) => comp.toLowerCase().includes(trimmed))
    )
    .slice(0, 3);

  const matchingCompetencies = competencies
    .filter(
      (comp) =>
        comp.name.toLowerCase().includes(trimmed) ||
        comp.domain.toLowerCase().includes(trimmed)
    )
    .slice(0, 3);

  const matchingAssessments = assessments
    .filter(
      (a) =>
        a.title.toLowerCase().includes(trimmed) ||
        a.targetCompetency.toLowerCase().includes(trimmed)
    )
    .slice(0, 2);

  const quickActions = [
    {
      title: 'Generate AI Quiz from Official Document',
      view: 'quiz-generator' as AppView,
      icon: Sparkles,
      color: 'text-indigo-600',
    },
    {
      title: 'View Competency Digital Twin & Radar',
      view: 'digital-twin' as AppView,
      icon: Cpu,
      color: 'text-blue-600',
    },
    {
      title: 'Analyze Critical Skill Gaps',
      view: 'skill-gaps' as AppView,
      icon: Target,
      color: 'text-rose-600',
    },
    {
      title: 'Ask Karmayogi AI Learning Assistant',
      view: 'assistant' as AppView,
      icon: Bot,
      color: 'text-teal-600',
    },
    {
      title: userRole === 'LEARNER' ? 'Switch to Admin / MoSPI HRD View' : 'Switch to Learner Official View',
      action: () => switchRole(userRole === 'LEARNER' ? 'ADMIN' : 'LEARNER'),
      icon: Shield,
      color: 'text-amber-600',
    },
  ].filter((qa) => qa.title.toLowerCase().includes(trimmed));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => setSearchOpen(false)}
      />

      <div className="relative mx-auto max-w-2xl transform divide-y divide-slate-100 dark:divide-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-black/5 transition-all">
        {/* Search Bar */}
        <div className="flex items-center px-4 py-3.5">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, competency (Python, Sampling), course, or assessment..."
            className="w-full bg-transparent border-0 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          {quickActions.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Quick Actions
              </p>
              <div className="space-y-1">
                {quickActions.map((qa, idx) => {
                  const Icon = qa.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (qa.action) qa.action();
                        else if (qa.view) navigate(qa.view);
                        setSearchOpen(false);
                      }}
                      className="w-full px-3 py-2 rounded-lg text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${qa.color}`} />
                        <span className="font-medium">{qa.title}</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Matching Competencies */}
          {matchingCompetencies.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Competencies ({matchingCompetencies.length})
              </p>
              <div className="space-y-1">
                {matchingCompetencies.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      setSelectedCompetency(comp);
                      setSearchOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <Cpu className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-semibold">{comp.name}</p>
                        <p className="text-[10.5px] text-slate-400">
                          {comp.domain} • Score: {comp.currentScore}% (Target {comp.requiredScore}%)
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold">
                      {comp.currentLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Courses */}
          {matchingCourses.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Recommended Courses ({matchingCourses.length})
              </p>
              <div className="space-y-1">
                {matchingCourses.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCourseId(c.id);
                      navigate('course-detail', { courseId: c.id });
                      setSearchOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-semibold line-clamp-1">{c.title}</p>
                        <p className="text-[10.5px] text-slate-400">
                          {c.provider} • {c.duration}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                      {c.matchScore}% Match
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matching Assessments */}
          {matchingAssessments.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Assessments ({matchingAssessments.length})
              </p>
              <div className="space-y-1">
                {matchingAssessments.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      setActiveAssessmentId(a.id);
                      navigate('assessment', { assessmentId: a.id });
                      setSearchOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-lg text-left flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    <div className="flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="font-semibold line-clamp-1">{a.title}</p>
                        <p className="text-[10.5px] text-slate-400">
                          {a.totalQuestions} Questions • {a.targetCompetency}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold">
                      Take Test
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingCourses.length === 0 &&
            matchingCompetencies.length === 0 &&
            matchingAssessments.length === 0 &&
            quickActions.length === 0 && (
              <div className="text-center py-6 text-slate-400">
                <p>No matching statistical competencies, courses, or actions found.</p>
              </div>
            )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press ESC to exit</span>
          <span>MoSPI Official Statistics Skill Graph</span>
        </div>
      </div>
    </div>
  );
};
