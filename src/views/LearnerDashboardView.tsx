import React from 'react';
import {
  Award,
  BookOpen,
  HelpCircle,
  Clock,
  TrendingUp,
  Cpu,
  Target,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Play,
  CheckCircle2,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { CompetencyRadar } from '../components/common/CompetencyRadar';

export const LearnerDashboardView: React.FC = () => {
  const {
    currentUser,
    competencies,
    skillGaps,
    courses,
    navigate,
    setSelectedCompetency,
    setWhyRecommendedCourse,
  } = useApp();

  const criticalGaps = skillGaps.filter((g) => g.severity === 'Critical');
  const inProgressCourses = courses.filter((c) => c.status === 'In Progress');
  const topRecommendedCourse = courses.find((c) => c.matchScore >= 94) || courses[0];

  // Calculate domain averages for Role Readiness breakdown
  const statisticalComps = competencies.filter((c) => c.domain === 'Statistical');
  const technicalComps = competencies.filter((c) => c.domain === 'Technical');
  const governanceComps = competencies.filter((c) => c.domain === 'Digital Governance');
  const managerialComps = competencies.filter((c) => c.domain === 'Behavioural & Managerial');

  const statAvg = Math.round(statisticalComps.reduce((acc, c) => acc + c.currentScore, 0) / (statisticalComps.length || 1));
  const techAvg = Math.round(technicalComps.reduce((acc, c) => acc + c.currentScore, 0) / (technicalComps.length || 1));
  const govAvg = Math.round(governanceComps.reduce((acc, c) => acc + c.currentScore, 0) / (governanceComps.length || 1));
  const mgrAvg = Math.round(managerialComps.reduce((acc, c) => acc + c.currentScore, 0) / (managerialComps.length || 1));

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-mono text-white">
      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
              Good day, {currentUser.name}
            </h1>
            <span className="px-2 py-0.5 border border-[#D8FE41]/40 bg-[#D8FE41]/10 text-[#D8FE41] text-[10px] font-bold uppercase tracking-wider">
              Senior Statistical Officer
            </span>
          </div>
          <p className="text-xs text-[#888888]">
            {currentUser.department} // Official Statistical Competency Twin & Closed-Loop Intelligence
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('quiz-generator')}
            className="px-3.5 py-2 bg-[#D8FE41] hover:bg-[#c9ef32] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(216,254,65,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Quiz Generator</span>
          </button>
          <button
            onClick={() => navigate('learning-path')}
            className="px-3 py-2 border border-[#333333] bg-[#141414] hover:bg-[#1f1f1f] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Target className="w-3.5 h-3.5 text-[#D8FE41]" />
            <span>Personalized Path</span>
          </button>
        </div>
      </div>

      {/* Closed-Loop Journey Bar */}
      <div className="p-3.5 border border-[#D8FE41]/30 bg-[#101010] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#181818] border border-[#D8FE41]/40 text-[#D8FE41] shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white uppercase tracking-wider">
              Closed-Loop Competency Engine Active
            </p>
            <p className="text-[11px] text-[#888888]">
              Flow: Digital Twin → Skill Gap → AI Path → Quiz Generator → Diagnostic Exam → Instant Verified Score Elevation.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('digital-twin')}
          className="px-3 py-1.5 border border-[#333333] bg-[#181818] text-[#D8FE41] font-bold text-xs hover:bg-[#222222] transition-colors shrink-0 flex items-center gap-1 uppercase tracking-wider"
        >
          <span>Explore Digital Twin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <MetricCard
          title="Overall Competency"
          value={`${currentUser.overallCompetency}%`}
          subtitle="Cadre benchmark: 80%"
          icon={Award}
          trend={{ value: '+4% this month', isPositive: true }}
          progress={{ current: currentUser.overallCompetency, total: 100 }}
          onClick={() => navigate('digital-twin')}
        />

        <MetricCard
          title="Critical Skill Gaps"
          value={currentUser.criticalGapsCount}
          subtitle="Priority: Python & AI/ML"
          icon={Target}
          iconColor="text-rose-400"
          trend={{ value: 'Action Required', isWarning: true }}
          onClick={() => navigate('skill-gaps')}
        />

        <MetricCard
          title="Courses In Progress"
          value={inProgressCourses.length}
          subtitle="NSSO Microdata Analytics"
          icon={BookOpen}
          onClick={() => navigate('courses')}
        />

        <MetricCard
          title="Learning Hours"
          value={`${currentUser.learningHours}h`}
          subtitle="Target: 50h annually"
          icon={Clock}
          trend={{ value: '76% of target', isPositive: true }}
        />

        <MetricCard
          title="Assessment Average"
          value={`${currentUser.assessmentAverage}%`}
          subtitle="Across 4 validated tests"
          icon={HelpCircle}
          trend={{ value: 'Top 15% cadre', isPositive: true }}
          onClick={() => navigate('assessment')}
        />
      </div>

      {/* Main Grid: Digital Twin Radar & Role Readiness */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Twin Snapshot */}
        <div className="lg:col-span-7 border border-[#222222] bg-[#121212] p-5">
          <div className="flex items-center justify-between mb-3 border-b border-[#1f1f1f] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#D8FE41]" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Competency Digital Twin Snapshot
                </h2>
              </div>
              <p className="text-[11px] text-[#777777] mt-0.5">
                Multi-axis radar comparing verified competency vs Senior Statistical Officer requirement benchmark.
              </p>
            </div>
            <button
              onClick={() => navigate('digital-twin')}
              className="text-xs font-bold text-[#D8FE41] hover:underline flex items-center gap-1 uppercase tracking-wider"
            >
              Full Profile <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="py-2 flex justify-center">
            <CompetencyRadar
              competencies={competencies}
              size={360}
              onSelectCompetency={(comp) => setSelectedCompetency(comp)}
            />
          </div>

          <div className="mt-2 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] text-[#777777]">
            <span>Click any radar vertex to inspect verified evidence sources</span>
            <span className="font-bold text-white">
              Confidence Index: 94.2%
            </span>
          </div>
        </div>

        {/* Right Column: Role Readiness Score & Urgent Gaps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Role Readiness Score Card */}
          <div className="border border-[#222222] bg-[#121212] p-5">
            <div className="flex items-center justify-between mb-4 border-b border-[#1f1f1f] pb-3">
              <div>
                <p className="text-[10px] font-bold text-[#777777] uppercase tracking-wider">
                  Cadre Benchmark Index
                </p>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Role Readiness Score
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-[#D8FE41] font-display">
                  {currentUser.roleReadiness}%
                </span>
                <p className="text-[10px] text-[#777777] uppercase font-bold">Target: 85%</p>
              </div>
            </div>

            {/* Domain Breakdown Bars */}
            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#aaaaaa] mb-1">
                  <span>Statistical Competencies</span>
                  <span className="text-[#D8FE41]">{statAvg}% (Target 85%)</span>
                </div>
                <div className="w-full bg-[#202020] h-1.5 overflow-hidden">
                  <div className="bg-[#D8FE41] h-full" style={{ width: `${statAvg}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#aaaaaa] mb-1">
                  <span>Technical & Computational</span>
                  <span className="text-rose-400">{techAvg}% (Target 75%)</span>
                </div>
                <div className="w-full bg-[#202020] h-1.5 overflow-hidden">
                  <div className="bg-rose-500 h-full" style={{ width: `${techAvg}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#aaaaaa] mb-1">
                  <span>Digital Governance & Cloud</span>
                  <span className="text-amber-400">{govAvg}% (Target 68%)</span>
                </div>
                <div className="w-full bg-[#202020] h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${govAvg}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-[#aaaaaa] mb-1">
                  <span>Behavioural & Operations</span>
                  <span className="text-white">{mgrAvg}% (Target 80%)</span>
                </div>
                <div className="w-full bg-[#202020] h-1.5 overflow-hidden">
                  <div className="bg-white h-full" style={{ width: `${mgrAvg}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 border border-[#D8FE41]/30 bg-[#151515] text-[11px] text-[#cccccc] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#D8FE41] shrink-0 mt-0.5" />
              <span>
                <strong className="text-white uppercase">AI Diagnostic Insight:</strong> Bridging your Python gap (-27 pts) via the recommended iGOT pathway will raise overall Role Readiness from {currentUser.roleReadiness}% to ~82%.
              </span>
            </div>
          </div>

          {/* Urgent Skill Gaps */}
          <div className="border border-[#222222] bg-[#121212] p-5">
            <div className="flex items-center justify-between mb-3 border-b border-[#1f1f1f] pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Immediate Skill Gaps ({criticalGaps.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('skill-gaps')}
                className="text-xs font-bold text-[#D8FE41] hover:underline uppercase tracking-wider"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {criticalGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.id}
                  onClick={() => navigate('skill-gaps')}
                  className="p-3 border border-[#222222] hover:border-[#D8FE41]/50 bg-[#161616] cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-bold text-white line-clamp-1">
                      {gap.competencyName}
                    </p>
                    <span className="text-[10px] px-1.5 py-0.2 border border-rose-800 bg-rose-950/60 text-rose-300 font-bold shrink-0">
                      -{gap.requiredScore - gap.currentScore}% Gap
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#888888]">
                    <span>
                      Current: {gap.currentLevel} ({gap.currentScore}%) → Req: {gap.requiredLevel} ({gap.requiredScore}%)
                    </span>
                    <span className="text-[#D8FE41] font-bold flex items-center uppercase text-[10px]">
                      Bridge <ArrowRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Course & Explainable Recommendation Spotlight */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Active Course Card */}
        {inProgressCourses.length > 0 && (
          <div className="border border-[#222222] bg-[#121212] p-5">
            <div className="flex items-center justify-between mb-3 border-b border-[#1f1f1f] pb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                Active Learning Module
              </span>
              <span className="text-xs font-bold text-[#888888]">
                {inProgressCourses[0].progress || 45}% Completed
              </span>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
              {inProgressCourses[0].title}
            </h3>
            <p className="text-xs text-[#888888] mb-4">
              Provider: {inProgressCourses[0].provider} • Duration: {inProgressCourses[0].duration}
            </p>

            <div className="w-full bg-[#202020] h-1.5 overflow-hidden mb-4">
              <div
                className="bg-[#D8FE41] h-full"
                style={{ width: `${inProgressCourses[0].progress || 45}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setWhyRecommendedCourse(inProgressCourses[0])}
                className="text-xs font-bold text-[#D8FE41] hover:underline flex items-center gap-1 uppercase"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Why Recommended?
              </button>
              <button
                onClick={() => navigate('course-detail', { courseId: inProgressCourses[0].id })}
                className="px-4 py-2 border border-[#333333] bg-[#181818] hover:bg-[#222222] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>Continue Module</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#D8FE41]" />
              </button>
            </div>
          </div>
        )}

        {/* Explainable Top Recommendation Spotlight */}
        <div className="border border-[#D8FE41]/30 bg-[#121212] p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-[#1f1f1f] pb-3">
              <span className="text-xs font-bold text-[#D8FE41] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D8FE41]" />
                AI Top Recommendation
              </span>
              <span className="px-2 py-0.5 bg-[#D8FE41] text-black text-[10px] font-black uppercase">
                {topRecommendedCourse.matchScore}% Match
              </span>
            </div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1.5">
              {topRecommendedCourse.title}
            </h3>
            <p className="text-xs text-[#888888] line-clamp-2 mb-4 leading-relaxed">
              {topRecommendedCourse.whyRecommended.summary}
            </p>
          </div>

          <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between">
            <button
              onClick={() => setWhyRecommendedCourse(topRecommendedCourse)}
              className="text-xs font-bold text-[#D8FE41] hover:underline flex items-center gap-1 uppercase"
            >
              <Sparkles className="w-3.5 h-3.5" />
              View Recommendation Rationale
            </button>
            <button
              onClick={() => navigate('course-detail', { courseId: topRecommendedCourse.id })}
              className="px-3.5 py-1.5 bg-[#D8FE41] hover:bg-[#c9ef32] text-black text-xs font-black uppercase tracking-wider"
            >
              Explore Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
