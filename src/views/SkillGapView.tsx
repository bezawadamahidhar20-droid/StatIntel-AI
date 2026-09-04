import React, { useState } from 'react';
import {
  Target,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Filter,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SkillGapItem } from '../types';

export const SkillGapView: React.FC = () => {
  const { skillGaps, navigate, courses, setWhyRecommendedCourse } = useApp();
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [domainFilter, setDomainFilter] = useState<string>('All');

  const filteredGaps = skillGaps.filter((g) => {
    const matchesSeverity = severityFilter === 'All' || g.severity === severityFilter;
    const matchesDomain = domainFilter === 'All' || g.domain === domainFilter;
    return matchesSeverity && matchesDomain;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Official Skill Gap Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Automated divergence diagnosis between verified officer competencies and MoSPI Senior Statistical Officer cadre mandates.
          </p>
        </div>

        <button
          onClick={() => navigate('learning-path')}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Recommended Learning Path</span>
        </button>
      </div>

      {/* Comparative Gap Visualizer Banner */}
      <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          Current Level vs. Role Benchmark Deficits
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-normal">
          Rose deficit bar indicates capability divergence requiring targeted capacity building interventions.
        </p>

        <div className="space-y-4">
          {skillGaps.map((gap) => {
            const deficit = gap.requiredScore - gap.currentScore;
            return (
              <div key={gap.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    {gap.competencyName}
                    <span className="text-[11px] text-slate-400 font-normal">({gap.domain})</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">
                      Current: <strong className="text-slate-800">{gap.currentScore}%</strong> ({gap.currentLevel}) • Target: <strong className="text-slate-800">{gap.requiredScore}%</strong> ({gap.requiredLevel})
                    </span>
                    <span className="font-bold text-rose-600 text-xs">
                      -{deficit}% Deficit
                    </span>
                  </div>
                </div>

                <div className="relative w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  {/* Current Score Bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-l-full z-10"
                    style={{ width: `${gap.currentScore}%` }}
                  />
                  {/* Deficit Span */}
                  <div
                    className="absolute top-0 bottom-0 bg-rose-200"
                    style={{
                      left: `${gap.currentScore}%`,
                      width: `${deficit}%`,
                    }}
                  />
                  {/* Benchmark Target Tick */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-500 z-20"
                    style={{ left: `${gap.requiredScore}%` }}
                    title={`Benchmark: ${gap.requiredScore}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {['All', 'Critical', 'Medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === sev
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 mr-1">Domain:</span>
          {['All', 'Technical', 'Statistical', 'Digital Governance'].map((dom) => (
            <button
              key={dom}
              onClick={() => setDomainFilter(dom)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                domainFilter === dom
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Gap Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredGaps.map((gap) => {
          const linkedCourse = courses.find((c) => c.id === gap.recommendedCourseId);
          const isCritical = gap.severity === 'Critical';

          return (
            <div
              key={gap.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      Priority #{gap.priorityRank} • {gap.severity}
                    </span>
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {gap.domain}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-blue-700">
                    {gap.roleRelevance}% Role Relevance
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {gap.competencyName}
                </h3>

                {/* Level Comparison Box */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 mb-3 text-center">
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Current Level</p>
                    <p className="text-sm font-bold text-blue-700 mt-0.5">{gap.currentLevel} ({gap.currentScore}%)</p>
                  </div>
                  <div className="border-x border-slate-200">
                    <p className="text-[11px] text-slate-500 font-medium">Target Benchmark</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{gap.requiredLevel} ({gap.requiredScore}%)</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-500 font-medium">Deficit</p>
                    <p className="text-sm font-bold text-rose-600 mt-0.5">-{gap.gapLevels} Levels</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                  {gap.rationale}
                </p>
              </div>

              {/* Recommended Course & Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est. time to bridge: <strong className="text-slate-700 font-semibold">{gap.estimatedTimeToBridge}</strong></span>
                </div>

                {linkedCourse ? (
                  <button
                    onClick={() => {
                      setWhyRecommendedCourse(linkedCourse);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <span>Bridge Gap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('courses')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    Browse Solutions
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

