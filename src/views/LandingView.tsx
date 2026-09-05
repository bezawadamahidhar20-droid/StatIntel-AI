import React, { useState } from 'react';
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
  Play,
  Database,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../services/i18n';
import LanguageToggle from '../components/common/LanguageToggle';
import DemoVideoModal from '../components/modals/DemoVideoModal';

export const LandingView: React.FC = () => {
  const {
    navigate,
    isAuthenticated,
    setIsAuthModalOpen,
    setIsAdminAuthModalOpen,
  } = useApp();
  const { t } = useLanguage();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

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
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans min-h-screen">
      {/* Top Banner with Language Toggle and SIH ID */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 font-bold rounded-md border border-blue-400/30">
              {APP_CONFIG.problemStatementId}
            </span>
            <span className="hidden sm:inline">&bull;</span>
            <span className="truncate">{APP_CONFIG.ministryName}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-emerald-400 flex items-center gap-1 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Census 2011 District Baselines · Reference Datasets
            </span>
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/60 dark:from-blue-950/40 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            {/* MoSPI Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{APP_CONFIG.badgeLabel} &bull; {APP_CONFIG.edition}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              AI-Powered <span className="text-blue-600 dark:text-blue-400">Statistical Intelligence</span> for National Governance
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Econometric time-series forecasting, Isolation Forest anomaly detection, district-level geospatial heatmaps, and model feature attribution over Census 2011 district baselines and MoSPI/RBI reference indicators.
            </p>

            {/* Core CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleStudentStart}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all hover:gap-3 cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Launch Intelligence Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-sm border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-4 h-4 fill-current text-blue-600" />
                <span>{t('demoVideo')}</span>
              </button>

              <button
                onClick={handleAdminStart}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>{t('loginAsAdmin')}</span>
              </button>
            </div>

            {/* Reference Metrics Strip */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-100 dark:border-slate-800">
              <div className="p-2">
                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">1.4B+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Citizens (Census 2011 Reference)</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">788</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Districts (Census Registry)</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">8</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Core MoSPI / RBI Indicators</p>
              </div>
              <div className="p-2">
                <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">EN · हि · த</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Natural-Language Query Languages</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Architected for Smart India Hackathon Excellence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Combining official government data connectors with explainable machine learning models
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-3 bg-blue-600 text-white rounded-xl w-fit shadow-md shadow-blue-500/20">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Direct Government Feeds
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero mock data. Direct connectors for api.data.gov.in, MoSPI (CPI, IIP, PLFS, ASI), RBI DBIE macroeconomic rates, and Census demographic indexes.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-3 bg-emerald-600 text-white rounded-xl w-fit shadow-md shadow-emerald-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              AI/ML Predictive Models
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              FastAPI backend running trend-decomposition (Prophet/LSTM-style) time-series forecasting, Isolation Forest anomaly outlier detection, and GradientBoosting development tier classification.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="p-3 bg-purple-600 text-white rounded-xl w-fit shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              SHAP Explainable AI
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every model prediction is paired with SHAP-style feature attribution vectors (normalized baseline deviation), delivering transparency for ministry policy makers and analysts.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Video Modal */}
      <DemoVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};

export default LandingView;
