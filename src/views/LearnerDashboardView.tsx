import React, { useState } from 'react';
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
  Download,
  FileSpreadsheet,
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
    addNotification,
  } = useApp();

  const [downloadingPdf, setDownloadingPdf] = useState(false);

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

  const handleExportPdf = () => {
    setDownloadingPdf(true);
    setTimeout(() => {
      setDownloadingPdf(false);
      addNotification({
        title: 'Competency Dossier Exported',
        message: `Official Student Competency Dossier (PDF) for ${currentUser.name} downloaded successfully.`,
        type: 'success',
      });
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* SIH Impact KPI Headline Banner */}
      <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-blue-950">
              SIH 2026 Student Intelligence Benchmark
            </span>
            <span className="text-xs text-blue-200 font-medium hidden sm:inline">
              National Statistical Education Benchmark
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
            Student Statistical Competency Intelligence & Career Readiness Twin
          </h2>
          <p className="text-xs text-blue-200 leading-normal max-w-2xl">
            Real-time competency digital twin bridging university statistical theory (Probability, Inference, Sampling) with official MoSPI datasets and industry data science benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs">
            <p className="text-xs text-blue-200">Students Evaluated</p>
            <p className="text-lg font-bold text-amber-300">4,200+ Scholars</p>
          </div>
          <div className="text-right px-3 py-1.5 bg-white/10 rounded-xl border border-white/10 backdrop-blur-xs">
            <p className="text-xs text-blue-200">Skill Growth</p>
            <p className="text-lg font-bold text-emerald-300">3.4x Faster</p>
          </div>
        </div>
      </div>

      {/* Top Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome, {currentUser.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full border border-blue-200 bg-blue-50 text-blue-700 text-xs font-semibold">
              {currentUser.designation}
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {currentUser.institution || currentUser.department} • {currentUser.cadre} • Student Skill Twin & Career Benchmark
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            disabled={downloadingPdf}
            className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{downloadingPdf ? 'Generating PDF...' : 'Export Dossier PDF'}</span>
          </button>
          <button
            onClick={() => navigate('quiz-generator')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Quiz Studio</span>
          </button>
          <button
            onClick={() => navigate('learning-path')}
            className="px-3.5 py-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Adaptive Path</span>
          </button>
        </div>
      </div>

      {/* Closed-Loop Journey Bar */}
      <div className="p-4 border border-blue-100 bg-blue-50/70 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-blue-950">
              Closed-Loop Competency Engine Active
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Pipeline: Digital Twin Model → Gap Diagnostics → Adaptive iGOT Modules → Grounded RAG Quiz → Verified Competency Score Update.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('digital-twin')}
          className="px-3 py-1.5 rounded-lg border border-blue-200 bg-white text-blue-700 font-semibold text-xs hover:bg-blue-50 transition-colors shrink-0 flex items-center gap-1 shadow-2xs"
        >
          <span>Inspect Digital Twin</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
          iconColor="text-rose-600"
          iconBg="bg-rose-50 border border-rose-100"
          trend={{ value: 'Action Required', isWarning: true }}
          onClick={() => navigate('skill-gaps')}
        />

        <MetricCard
          title="Active Modules"
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
        <div className="lg:col-span-7 border border-slate-200 bg-white rounded-xl shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Officer Competency Digital Twin
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Multi-axis radar comparing verified competency vs Senior Statistical Officer benchmark.
              </p>
            </div>
            <button
              onClick={() => navigate('digital-twin')}
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
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

          <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Click any radar node to inspect verified evidence sources</span>
            <span className="font-semibold text-slate-800">
              Confidence Index: 94.2%
            </span>
          </div>
        </div>

        {/* Right Column: Role Readiness Score & Urgent Gaps */}
        <div className="lg:col-span-5 space-y-6">
          {/* Role Readiness Score Card */}
          <div className="border border-slate-200 bg-white rounded-xl shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Cadre Benchmark Index
                </p>
                <h3 className="text-sm font-bold text-slate-900">
                  Role Readiness Score
                </h3>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-blue-700">
                  {currentUser.roleReadiness}%
                </span>
                <p className="text-[11px] text-slate-500 font-medium">Target: 85%</p>
              </div>
            </div>

            {/* Domain Breakdown Bars */}
            <div className="space-y-3.5 pt-1">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Statistical Competencies</span>
                  <span className="font-semibold text-blue-700">{statAvg}% (Target 85%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${statAvg}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Technical & Computational</span>
                  <span className="font-semibold text-rose-600">{techAvg}% (Target 75%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${techAvg}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Digital Governance & Cloud</span>
                  <span className="font-semibold text-amber-600">{govAvg}% (Target 68%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${govAvg}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                  <span>Behavioural & Operations</span>
                  <span className="font-semibold text-emerald-700">{mgrAvg}% (Target 80%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${mgrAvg}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 border border-blue-100 bg-blue-50/60 rounded-xl text-xs text-slate-700 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-blue-900">AI Diagnostic Insight:</strong> Bridging your Python gap (-27 pts) via the recommended iGOT pathway will raise overall Role Readiness from {currentUser.roleReadiness}% to ~82%.
              </span>
            </div>
          </div>

          {/* Urgent Skill Gaps */}
          <div className="border border-slate-200 bg-white rounded-xl shadow-xs p-6">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Priority Skill Gaps ({criticalGaps.length})
                </h3>
              </div>
              <button
                onClick={() => navigate('skill-gaps')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5">
              {criticalGaps.slice(0, 3).map((gap) => (
                <div
                  key={gap.id}
                  onClick={() => navigate('skill-gaps')}
                  className="p-3 border border-slate-200 hover:border-blue-300 bg-slate-50/50 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">
                      {gap.competencyName}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 font-semibold shrink-0">
                      -{gap.requiredScore - gap.currentScore}% Gap
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Current: {gap.currentLevel} ({gap.currentScore}%) → Benchmark: {gap.requiredLevel} ({gap.requiredScore}%)
                    </span>
                    <span className="text-blue-600 font-semibold flex items-center text-xs">
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
          <div className="border border-slate-200 bg-white rounded-xl shadow-xs p-6">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                Active Learning Module
              </span>
              <span className="text-xs font-medium text-slate-500">
                {inProgressCourses[0].progress || 45}% Completed
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1">
              {inProgressCourses[0].title}
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              Provider: {inProgressCourses[0].provider} • Duration: {inProgressCourses[0].duration}
            </p>

            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
              <div
                className="bg-blue-600 h-full rounded-full transition-all"
                style={{ width: `${inProgressCourses[0].progress || 45}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setWhyRecommendedCourse(inProgressCourses[0])}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Why Recommended?
              </button>
              <button
                onClick={() => navigate('course-detail', { courseId: inProgressCourses[0].id })}
                className="px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Continue Module</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
              </button>
            </div>
          </div>
        )}

        {/* Explainable Top Recommendation Spotlight */}
        <div className="border border-blue-200 bg-gradient-to-br from-white to-blue-50/40 rounded-xl shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 border-b border-blue-100 pb-3">
              <span className="text-xs font-semibold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                AI Top Cadre Recommendation
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                {topRecommendedCourse.matchScore}% Match
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1.5">
              {topRecommendedCourse.title}
            </h3>
            <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
              {topRecommendedCourse.whyRecommended.summary}
            </p>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setWhyRecommendedCourse(topRecommendedCourse)}
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Recommendation Rationale
            </button>
            <button
              onClick={() => navigate('course-detail', { courseId: topRecommendedCourse.id })}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Explore Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

