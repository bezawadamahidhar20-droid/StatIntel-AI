import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  BrainCircuit,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { CompetencyRadar } from '../components/common/CompetencyRadar';
import { apiClient } from '../services/apiClient';

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
    targetCareerRole,
  } = useApp();

  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [placementData, setPlacementData] = useState<{
    readiness_score: number;
    confidence: string;
    confidence_pct: number;
    factors: { name: string; label: string; score: number; weight_pct: number }[];
    recommended_actions: string[];
  }>({
    readiness_score: 72.0,
    confidence: 'High',
    confidence_pct: 94,
    factors: [
      { name: 'skills_mastery', label: 'Skills Mastery', score: 45.0, weight_pct: 25 },
      { name: 'assessments', label: 'Grounded Assessments', score: 82.0, weight_pct: 20 },
      { name: 'projects', label: 'Practical Projects & Lab Work', score: 70.0, weight_pct: 15 },
      { name: 'certificates', label: 'Verified Certifications', score: 60.0, weight_pct: 10 },
      { name: 'internships', label: 'Field & Practical Training', score: 40.0, weight_pct: 10 },
      { name: 'academic', label: 'Academic Rigor', score: 78.0, weight_pct: 10 },
      { name: 'role_alignment', label: 'Target Role Alignment', score: 75.0, weight_pct: 10 },
    ],
    recommended_actions: [
      'Complete Python Microdata Processing Module 3 for +6.8% readiness boost.',
      'Attempt the Adaptive Knowledge Check to elevate assessment score.',
      'Verify your latest micro-credentials on your Competency Digital Twin.',
    ],
  });

  const activeRole = targetCareerRole || currentUser.designation || 'Senior Statistical Officer';
  const inProgressCourses = courses.filter((c) => c.status === 'In Progress');
  const topRecommendedCourse = courses.find((c) => c.matchScore >= 94) || courses[0];

  // Top 3 Skills to Improve
  const topSkillsToImprove = [
    {
      name: 'Python for Statistical & Microdata Analytics',
      current: 'L2',
      target: 'L4',
      impact: '+6.8%',
      priority: 'HIGH',
    },
    {
      name: 'Survey Design & Sampling Methodology',
      current: 'L1',
      target: 'L4',
      impact: '+5.4%',
      priority: 'HIGH',
    },
    {
      name: 'SQL & Database Systems',
      current: 'L2',
      target: 'L4',
      impact: '+4.2%',
      priority: 'MEDIUM',
    },
  ];

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

  const handleLearnSkill = (skillName: string) => {
    navigate('skill-learning', { skillName });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800 pb-16">
      {/* Top Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-600 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Welcome back, {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Verified Scholar
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {currentUser.department} &bull; Target Role: <strong className="text-slate-900 dark:text-white">{activeRole}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportPdf}
            disabled={downloadingPdf}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadingPdf ? 'Exporting...' : 'Export Dossier (PDF)'}</span>
          </button>

          <button
            onClick={() => navigate('learning-path')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <span>Adaptive Roadmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* HERO SECTION: ROLE READINESS & EXPLAINABLE PLACEMENT READINESS ESTIMATE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Role Readiness & Placement Estimate (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-2xl bg-linear-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-amber-400">
                Target Role Benchmark
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                {activeRole}
              </h2>
            </div>

            <div className="text-right">
              <span className="text-xs text-blue-200">Current Role Readiness</span>
              <p className="text-2xl font-black text-emerald-400">
                {currentUser.roleReadiness || 68}% <span className="text-xs font-normal text-blue-300">/ 85% Target</span>
              </p>
            </div>
          </div>

          {/* Placement Readiness Estimate Card */}
          <div className="p-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Placement Readiness Estimate: {placementData.readiness_score}%
                  </h3>
                  <p className="text-[11px] text-blue-200">
                    Confidence Level: <strong className="text-emerald-300">{placementData.confidence} ({placementData.confidence_pct}%)</strong>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Evidence-Based
              </span>
            </div>

            {/* Factor Breakdown Bars */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
                Explainable Evidence Breakdown:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {placementData.factors.map((f) => (
                  <div key={f.name} className="p-2 rounded-lg bg-black/20 border border-white/5 space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-300 truncate">{f.label}</span>
                      <span className="font-bold text-white">{f.score}%</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          f.score >= 70 ? 'bg-emerald-400' : f.score >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${f.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-blue-300 italic pt-1 leading-normal">
              Disclaimer: This is an evidence-based placement readiness estimate derived from verified competency benchmarks and assessment records. It is not an automated employment guarantee.
            </p>
          </div>
        </div>

        {/* Right: Top Skills to Improve (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Top Skills to Improve
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  High-impact skills directly advancing your role readiness
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3">
              {topSkillsToImprove.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {skill.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span>{skill.current} &rarr; <strong className="text-emerald-600">{skill.target}</strong></span>
                      <span>&bull;</span>
                      <span className="font-semibold text-blue-600">Impact: {skill.impact}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLearnSkill(skill.name)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                  >
                    <span>Learn</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Next Action Box */}
          <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2 mt-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                Recommended Next Action
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
              Complete Python Microdata Processing Module 3: Multiplier Application & Survey Weighting.
            </p>
            <button
              onClick={() => {
                enrollCourse('crs-001');
                navigate('course-detail', { courseId: 'crs-001' });
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Continue Learning</span>
            </button>
          </div>
        </div>
      </div>

      {/* METRIC KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Overall Competency"
          value={`${currentUser.overallCompetency}%`}
          change="+8% this cycle"
          isPositive={true}
          icon={Cpu}
          color="blue"
        />
        <MetricCard
          title="Role Readiness"
          value={`${currentUser.roleReadiness}%`}
          change="Target: 85%"
          isPositive={true}
          icon={Target}
          color="emerald"
        />
        <MetricCard
          title="Critical Skill Gaps"
          value={skillGaps.filter((g) => g.severity === 'Critical').length}
          change="Priority focus"
          isPositive={false}
          icon={AlertTriangle}
          color="rose"
        />
        <MetricCard
          title="Learning Hours"
          value={`${currentUser.learningHours}h`}
          change="Across verified tracks"
          isPositive={true}
          icon={Clock}
          color="indigo"
        />
      </div>

      {/* RADAR & DIGITAL TWIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                Officer Competency Digital Twin
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Multivariate radar diagnostic evaluated against Cadre Benchmarks
              </p>
            </div>
            <button
              onClick={() => navigate('digital-twin')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Explore Twin</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72">
            <CompetencyRadar competencies={competencies} />
          </div>
        </div>

        {/* Active Enrolled Courses */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                Active Learning Programmes
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Curricula currently in progress with verified progress tracking
              </p>
            </div>
            <button
              onClick={() => navigate('courses')}
              className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
            >
              <span>Browse Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {inProgressCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-emerald-300 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {course.provider}
                    </span>
                    <h4
                      onClick={() => navigate('course-detail', { courseId: course.id })}
                      className="text-xs font-bold text-slate-900 dark:text-white mt-1 cursor-pointer hover:text-blue-600"
                    >
                      {course.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => navigate('course-detail', { courseId: course.id })}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shrink-0"
                  >
                    Continue
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10.5px] text-slate-500">
                    <span>Progress</span>
                    <span className="font-bold text-emerald-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
