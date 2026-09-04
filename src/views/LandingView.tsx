import React from 'react';
import {
  Shield,
  Sparkles,
  ArrowRight,
  Cpu,
  Target,
  BookOpen,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  Users,
  Building,
  TrendingUp,
  FileCheck,
  GraduationCap,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingView: React.FC = () => {
  const {
    navigate,
    isAuthenticated,
    setIsAuthModalOpen,
    setIsAdminAuthModalOpen,
  } = useApp();

  const handleStudentStart = () => {
    if (isAuthenticated) {
      navigate('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAdminStart = () => {
    setIsAdminAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* Student & MoSPI Academic Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>National Statistical Education & Student Competency Benchmark</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Where Do Your <span className="text-blue-600">Statistical Skills</span> Stand?
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
              Test your practical knowledge in survey design, data analytics, econometric modeling, and official statistics. Get your dynamic AI <strong>Student Digital Twin</strong>, pinpoint your skill gaps, and follow personalized learning roadmaps.
            </p>

            {/* Core CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStudentStart}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:gap-3"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Test My Skills (Demo New Student)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-200 transition-all flex items-center gap-2"
              >
                <span>Student Sign In</span>
              </button>

              <button
                onClick={handleAdminStart}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium text-sm transition-all flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Faculty / Admin Portal</span>
              </button>
            </div>

            {/* Trust Metric Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-100">
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900">4,200+</p>
                <p className="text-xs text-slate-500">Students Evaluated</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-blue-600">32+</p>
                <p className="text-xs text-slate-500">Statistical Competency Maps</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-emerald-600">18+</p>
                <p className="text-xs text-slate-500">Universities & Academies</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-indigo-600">100%</p>
                <p className="text-xs text-slate-500">MoSPI Grounded Diagnostics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Closed-Loop Architecture Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Student Competency Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            How Students Benchmark & Elevate Their Skills
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A continuous closed-loop cycle connecting classroom theory with practical national datasets and industry benchmarks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              1. Student Digital Twin
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-dimensional competency model tracking Statistical Theory, Applied Programming (Python/R), Survey Sampling, and Data Governance.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              2. Academic Gap Discovery
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated benchmarking against Data Scientist and Indian Statistical Service (ISS) roles to identify critical concept deficits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              3. Personalized Roadmaps
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Explainable AI course recommendations from iGOT Karmayogi, Swayam, and NSSTA Academic modules tailored to bridge your exact deficits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              4. Grounded Assessment
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Diagnostic tests grounded in official survey manuals (PLFS, ASI, National Accounts) that directly upgrade your verified Digital Twin scores.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-300">
              StatIntel AI — Student Statistical Skill Intelligence Platform
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Smart India Hackathon (SIH 2026) Demonstration Prototype • MoSPI Aligned
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={handleStudentStart}
              className="hover:text-white transition-colors"
            >
              Student Portal
            </button>
            <span>•</span>
            <button
              onClick={handleAdminStart}
              className="hover:text-white transition-colors"
            >
              Faculty / Admin Portal
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:text-white transition-colors"
            >
              Demo New Student
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
