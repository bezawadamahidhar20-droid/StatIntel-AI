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
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingView: React.FC = () => {
  const { navigate, switchRole } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-950/20 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* MoSPI / iGOT Karmayogi badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>MoSPI Official Statistical Cadre • iGOT Karmayogi Bharat</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              Build a <span className="text-blue-600 dark:text-blue-400">Future-Ready</span> Statistical Workforce
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              AI-powered competency intelligence, personalized iGOT/NSSTA learning recommendations, and continuous grounded assessment for India’s Official Statistical System.
            </p>

            {/* Core CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  switchRole('LEARNER');
                  navigate('dashboard');
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:gap-3"
              >
                <span>Launch Learner Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  switchRole('ADMIN');
                  navigate('admin-dashboard');
                }}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <span>Workforce Admin Portal</span>
              </button>

              <button
                onClick={() => navigate('login')}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all"
              >
                Sign In with SSO
              </button>
            </div>

            {/* Trust Metric Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-100 dark:border-slate-800/80">
              <div className="p-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">2,480+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Statistical Officers</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">32+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Core Competency Maps</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">96%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Explainable AI Match</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Grounded Assessments</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Closed-Loop Architecture Section */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Closed-Loop Competency Framework
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            How Official Statistical Intelligence Operates
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            A dynamic feedback cycle connecting individual skill mastery with national data quality mandates.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              1. Digital Twin
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Continuous multi-dimensional modeling across Statistical, Technical, Digital Governance, and Managerial domains.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold mb-4">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              2. Skill Gap Intelligence
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Automated benchmarking against Senior Statistical Officer and ISS cadre role standards to identify critical capability deficits.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              3. Explainable AI Pathway
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent course recommendations from iGOT Karmayogi & NSSTA TPAC with clear attribution factors and expected level gains.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold mb-4">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              4. Grounded Assessment
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload official survey manuals to synthesize grounded diagnostic MCQs that instantly feed verified score improvements back into your Digital Twin.
            </p>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-300">
              National Statistical Systems Training Academy (NSSTA) • MoSPI
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Government of India Smart India Hackathon (SIH 2026) Demonstration Prototype
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => navigate('dashboard')}
              className="hover:text-white transition-colors"
            >
              Enter Learner App
            </button>
            <span>•</span>
            <button
              onClick={() => {
                switchRole('ADMIN');
                navigate('admin-dashboard');
              }}
              className="hover:text-white transition-colors"
            >
              Enter Admin Portal
            </button>
            <span>•</span>
            <button
              onClick={() => navigate('login')}
              className="hover:text-white transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
