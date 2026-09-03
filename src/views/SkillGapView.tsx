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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
              <Target className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Official Skill Gap Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated divergence diagnosis between your verified competencies and the Senior Statistical Officer cadre mandate.
          </p>
        </div>

        <button
          onClick={() => navigate('learning-path')}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Recommended Learning Path</span>
        </button>
      </div>

      {/* Comparative Gap Visualizer Banner */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Current Level vs. Role Benchmark Deficits
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Red indicates urgent capability gaps in high-priority statistical domains.
        </p>

        <div className="space-y-3.5">
          {skillGaps.map((gap) => {
            const deficit = gap.requiredScore - gap.currentScore;
            return (
              <div key={gap.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                    {gap.competencyName}
                    <span className="text-[10.5px] text-slate-400 font-normal">({gap.domain})</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px]">
                      Current: <strong>{gap.currentScore}%</strong> ({gap.currentLevel}) • Target: <strong>{gap.requiredScore}%</strong> ({gap.requiredLevel})
                    </span>
                    <span className="font-bold text-rose-600 text-[11px]">
                      -{deficit}% Deficit
                    </span>
                  </div>
                </div>

                <div className="relative w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                  {/* Current Score Bar */}
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-blue-600 rounded-l-full z-10"
                    style={{ width: `${gap.currentScore}%` }}
                  />
                  {/* Deficit Span */}
                  <div
                    className="absolute top-0 bottom-0 bg-rose-200 dark:bg-rose-950/60"
                    style={{
                      left: `${gap.currentScore}%`,
                      width: `${deficit}%`,
                    }}
                  />
                  {/* Benchmark Target Tick */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-20"
                    style={{ left: `${gap.requiredScore}%` }}
                    title={`Target: ${gap.requiredScore}%`}
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
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
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                domainFilter === dom
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
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
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      Priority #{gap.priorityRank} • {gap.severity}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {gap.domain}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                    {gap.roleRelevance}% Role Relevance
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {gap.competencyName}
                </h3>

                {/* Level Comparison Box */}
                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-3 text-center">
                  <div>
                    <p className="text-[10px] text-slate-400">Current Level</p>
                    <p className="text-sm font-bold text-blue-600">{gap.currentLevel} ({gap.currentScore}%)</p>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-700">
                    <p className="text-[10px] text-slate-400">Target Level</p>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{gap.requiredLevel} ({gap.requiredScore}%)</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400">Gap Deficit</p>
                    <p className="text-sm font-bold text-rose-600">-{gap.gapLevels} Levels</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {gap.rationale}
                </p>
              </div>

              {/* Recommended Course & Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est. time to bridge: <strong className="text-slate-700 dark:text-slate-300">{gap.estimatedTimeToBridge}</strong></span>
                </div>

                {linkedCourse ? (
                  <button
                    onClick={() => {
                      setWhyRecommendedCourse(linkedCourse);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                  >
                    <span>Bridge Gap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('courses')}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold"
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
