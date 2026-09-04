import React from 'react';
import { X, Award, CheckCircle2, TrendingUp, BookOpen, Sparkles, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';
import { Competency } from '../../types';
import { useApp } from '../../context/AppContext';

interface CompetencyDetailDrawerProps {
  competency: Competency | null;
  onClose: () => void;
}

export const CompetencyDetailDrawer: React.FC<CompetencyDetailDrawerProps> = ({
  competency,
  onClose,
}) => {
  const { courses, setWhyRecommendedCourse, navigate } = useApp();

  if (!competency) return null;

  const gap = competency.currentScore - competency.requiredScore;
  const isCritical = competency.status === 'Critical Gap';
  const isTargetMet = competency.status === 'Target Met' || competency.status === 'Exceeds';

  // Find linked recommended courses
  const linkedCourses = courses.filter((c) =>
    competency.recommendedCourseIds.includes(c.id) ||
    c.competenciesCovered.includes(competency.name)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans text-slate-800">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase px-2.5 py-0.5 rounded-md border border-slate-200 bg-white text-slate-600">
                  {competency.domain}
                </span>
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-md border ${
                    isCritical
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : isTargetMet
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {competency.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {competency.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Score & Level Matrix */}
            <div className="p-4 border border-slate-200 bg-slate-50/50 rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <p className="text-xs font-medium text-slate-500 uppercase">Verified Level</p>
                  <p className="text-2xl font-bold text-blue-700 mt-1">
                    {competency.currentLevel}
                  </p>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {competency.currentScore}% Score
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs">
                  <p className="text-xs font-medium text-slate-500 uppercase">Target Required</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {competency.requiredLevel}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">
                    {competency.requiredScore}% Benchmark
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200">
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Role Capability Gap</span>
                  <span className={gap < 0 ? 'text-rose-600' : 'text-emerald-700'}>
                    {gap >= 0 ? `+${gap}% (Target Achieved)` : `${gap}% deficit`}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isCritical ? 'bg-rose-500' : isTargetMet ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, competency.currentScore)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 font-medium mt-2">
                  <span>Confidence: {competency.confidence}%</span>
                  <span>Last Assessed: {competency.lastAssessed}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Competency Definition & Scope
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {competency.description}
              </p>
            </div>

            {/* Evidence Sources */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Verified Evidence & Assessment History
              </h3>
              <div className="space-y-2.5">
                {competency.evidenceSources.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-slate-200 bg-white rounded-lg shadow-2xs flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">
                          {ev.title}
                        </span>
                        <span className="px-2 py-0.5 border border-slate-200 bg-slate-50 text-slate-600 text-[10px] font-semibold rounded">
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" /> {ev.date}
                      </p>
                    </div>
                    {ev.score && (
                      <span className="px-2 py-1 rounded-md border border-blue-200 bg-blue-50 text-blue-700 font-semibold text-xs shrink-0">
                        {ev.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Score Progress */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Historical Trajectory
              </h3>
              <div className="p-3 border border-slate-200 bg-slate-50/50 rounded-xl">
                <div className="flex items-center justify-between gap-2">
                  {competency.historicalScores.map((hs, i) => (
                    <div key={i} className="flex-1 text-center">
                      <p className="text-xs font-bold text-slate-800">
                        {hs.score}%
                      </p>
                      <div className="w-full bg-slate-200 h-1.5 my-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${hs.score}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-slate-500">{hs.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Learning */}
            {linkedCourses.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Recommended Interventions to Close Gap
                </h3>
                <div className="space-y-3">
                  {linkedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-slate-200 bg-white rounded-xl shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-sm font-bold text-slate-900">
                          {course.title}
                        </h4>
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                          {course.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setWhyRecommendedCourse(course);
                          }}
                          className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Why Recommended?
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            navigate('course-detail', { courseId: course.id });
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                          View Course
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                navigate('quiz-generator');
              }}
              className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Generate AI Quiz for this Skill
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

