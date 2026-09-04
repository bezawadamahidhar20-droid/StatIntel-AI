import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Globe,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MapPin,
  ShieldAlert,
  ArrowLeftRight,
  Database,
  Layers,
  ChevronRight,
  Download,
  Zap,
} from 'lucide-react';
import { APP_CONFIG } from '../config';
import { useLanguage } from '../services/i18n';
import LanguageToggle from '../components/common/LanguageToggle';
import KPICards from '../components/analytics/KPICards';
import IndiaMap from '../components/analytics/IndiaMap';
import TimeSeriesChart from '../components/analytics/TimeSeriesChart';
import AnomalyAlert from '../components/analytics/AnomalyAlert';
import ComparisonMode from '../components/analytics/ComparisonMode';
import DrillDown from '../components/analytics/DrillDown';
import DataUpload from '../components/analytics/DataUpload';
import ExecutiveReportGenerator from '../components/analytics/ExecutiveReportGenerator';
import AlertThresholdSettings from '../components/analytics/AlertThresholdSettings';
import AuditTrailViewer from '../components/analytics/AuditTrailViewer';
import CostSavingsCalculator from '../components/analytics/CostSavingsCalculator';
import ScalabilityMetrics from '../components/analytics/ScalabilityMetrics';
import ModelMetrics from '../components/analytics/ModelMetrics';
import NaturalLanguageQueryBar from '../components/analytics/NaturalLanguageQueryBar';
import { CensusDistrictData } from '../services/api/types';

export const StatisticalIntelligenceDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'forecasting' | 'anomalies' | 'comparison' | 'reports' | 'upload' | 'audit' | 'metrics'>('overview');
  const [selectedDistrict, setSelectedDistrict] = useState<CensusDistrictData | null>(null);

  return (
    <div className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  {t('appName')} &mdash; {t('dashboard')}
                </h1>
                <span className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold rounded-full">
                  {APP_CONFIG.problemStatementId}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xl">
                {APP_CONFIG.ministryName}
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="max-w-7xl mx-auto mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'National Overview', icon: Activity },
            { id: 'map', label: t('indiaMap'), icon: MapPin },
            { id: 'forecasting', label: t('forecasting'), icon: TrendingUp },
            { id: 'anomalies', label: t('anomalies'), icon: ShieldAlert },
            { id: 'comparison', label: 'Comparison Mode', icon: ArrowLeftRight },
            { id: 'reports', label: t('reports'), icon: FileSpreadsheet },
            { id: 'upload', label: t('dataUpload'), icon: UploadCloud },
            { id: 'metrics', label: 'Fiscal ROI & Model Registry', icon: Zap },
            { id: 'audit', label: 'Audit Trail', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Multilingual Natural Language Analytics Query Bar */}
        <NaturalLanguageQueryBar onNavigateTab={(tab) => setActiveTab(tab as any)} />

        {/* KPI Cards Strip (always visible at top of dashboard) */}
        <KPICards />


        {/* Dynamic Tab Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <DrillDown onLevelChange={(lvl, item) => console.log('Drill-down to:', lvl, item)} />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <TimeSeriesChart />
              </div>
              <div className="lg:col-span-5">
                <AnomalyAlert />
              </div>
            </div>
            <IndiaMap onSelectDistrict={(d) => setSelectedDistrict(d)} />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <DrillDown onLevelChange={(lvl, item) => console.log('Drill-down to:', lvl, item)} />
            <IndiaMap onSelectDistrict={(d) => setSelectedDistrict(d)} />
          </div>
        )}

        {activeTab === 'forecasting' && (
          <div className="space-y-6">
            <TimeSeriesChart />
            <ComparisonMode />
          </div>
        )}

        {activeTab === 'anomalies' && (
          <div className="space-y-6">
            <AnomalyAlert />
            <AlertThresholdSettings />
          </div>
        )}

        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <ComparisonMode />
            <IndiaMap />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <ExecutiveReportGenerator />
          </div>
        )}

        {activeTab === 'upload' && (
          <div className="space-y-6">
            <DataUpload />
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <CostSavingsCalculator />
            <ScalabilityMetrics />
            <ModelMetrics />
          </div>
        )}

        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AuditTrailViewer />
          </div>
        )}
      </main>
    </div>
  );
};

export default StatisticalIntelligenceDashboard;
