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
    <div className="fixed inset-0 z-50 overflow-hidden font-mono text-white">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#0d0d0d] shadow-2xl border-l border-[#262626] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-[#222222] bg-[#121212] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 border border-[#333333] bg-[#1a1a1a] text-[#aaaaaa]">
                  {competency.domain}
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 border ${
                    isCritical
                      ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                      : isTargetMet
                      ? 'bg-[#D8FE41]/10 text-[#D8FE41] border-[#D8FE41]/40'
                      : 'bg-amber-950/60 text-amber-300 border-amber-800'
                  }`}
                >
                  {competency.status}
                </span>
              </div>
              <h2 className="text-lg font-black uppercase tracking-wide text-white leading-tight font-display">
                {competency.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 border border-[#333333] bg-[#161616] text-[#888888] hover:text-white hover:bg-[#222222]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Score & Level Matrix */}
            <div className="p-4 border border-[#222222] bg-[#121212]">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-[#181818] border border-[#282828]">
                  <p className="text-[10px] uppercase font-bold text-[#777777]">Current Verified Level</p>
                  <p className="text-2xl font-black text-[#D8FE41] font-display">
                    {competency.currentLevel}
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {competency.currentScore}% Score
                  </p>
                </div>
                <div className="p-3 bg-[#181818] border border-[#282828]">
                  <p className="text-[10px] uppercase font-bold text-[#777777]">Cadre Required Level</p>
                  <p className="text-2xl font-black text-white font-display">
                    {competency.requiredLevel}
                  </p>
                  <p className="text-xs font-bold text-[#888888] mt-0.5">
                    {competency.requiredScore}% Target
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#1f1f1f]">
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#888888] uppercase">Role Capability Gap</span>
                  <span className={gap < 0 ? 'text-rose-400 font-bold' : 'text-[#D8FE41] font-bold'}>
                    {gap >= 0 ? `+${gap}% (Target Achieved)` : `${gap}% deficit`}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#202020] overflow-hidden">
                  <div
                    className={`h-full ${
                      isCritical ? 'bg-rose-500' : isTargetMet ? 'bg-[#D8FE41]' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, competency.currentScore)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#777777] uppercase font-bold mt-2">
                  <span>Confidence: {competency.confidence}%</span>
                  <span>Last Assessed: {competency.lastAssessed}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2">
                Competency Definition & Scope
              </h3>
              <p className="text-xs text-[#bbbbbb] leading-relaxed">
                {competency.description}
              </p>
            </div>

            {/* Evidence Sources */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#D8FE41]" />
                Verified Evidence & Assessment History
              </h3>
              <div className="space-y-2.5">
                {competency.evidenceSources.map((ev, idx) => (
                  <div
                    key={idx}
                    className="p-3 border border-[#222222] bg-[#141414] flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white">
                          {ev.title}
                        </span>
                        <span className="px-1.5 py-0.5 border border-[#333333] bg-[#1c1c1c] text-[#888888] text-[9px] uppercase font-bold">
                          {ev.type}
                        </span>
                      </div>
                      <p className="text-[#666666] text-[10px] flex items-center gap-1 uppercase font-bold">
                        <Calendar className="w-3 h-3 text-[#888888]" /> {ev.date}
                      </p>
                    </div>
                    {ev.score && (
                      <span className="px-2 py-1 border border-[#D8FE41]/40 bg-[#D8FE41]/10 text-[#D8FE41] font-bold text-[10px] shrink-0">
                        {ev.score}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Historical Score Progress */}
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-[#D8FE41]" />
                Historical Trajectory
              </h3>
              <div className="p-3 border border-[#222222] bg-[#141414]">
                <div className="flex items-center justify-between gap-2">
                  {competency.historicalScores.map((hs, i) => (
                    <div key={i} className="flex-1 text-center">
                      <p className="text-xs font-bold text-white">
                        {hs.score}%
                      </p>
                      <div className="w-full bg-[#202020] h-1 my-1 overflow-hidden">
                        <div
                          className="bg-[#D8FE41] h-full"
                          style={{ width: `${hs.score}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-[#666666] uppercase">{hs.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Learning */}
            {linkedCourses.length > 0 && (
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#D8FE41]" />
                  Recommended Interventions to Close Gap
                </h3>
                <div className="space-y-3">
                  {linkedCourses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 border border-[#282828] bg-[#141414]"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h4 className="text-xs font-bold uppercase tracking-wide text-white">
                          {course.title}
                        </h4>
                        <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-[#D8FE41] text-black shrink-0">
                          {course.matchScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-[#888888] line-clamp-2 mb-3">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#222222]">
                        <button
                          onClick={() => {
                            setWhyRecommendedCourse(course);
                          }}
                          className="text-xs font-bold text-[#D8FE41] hover:underline flex items-center gap-1 uppercase text-[10px]"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Why Recommended?
                        </button>
                        <button
                          onClick={() => {
                            onClose();
                            navigate('course-detail', { courseId: course.id });
                          }}
                          className="px-3 py-1.5 border border-[#333333] bg-[#1c1c1c] hover:bg-[#282828] text-white text-xs font-bold uppercase flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-[#D8FE41]" />
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
          <div className="p-4 border-t border-[#222222] bg-[#121212] flex items-center justify-between">
            <button
              onClick={() => {
                onClose();
                navigate('quiz-generator');
              }}
              className="px-3 py-2 border border-[#333333] bg-[#181818] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#222222]"
            >
              Generate AI Quiz for this Skill
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#D8FE41] hover:bg-[#c9ef32] text-black text-xs font-black uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
