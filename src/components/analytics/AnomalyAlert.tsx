import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Sparkles, ArrowUpRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../services/i18n';
import ExplainAIModal, { ShapFeature } from '../modals/ExplainAIModal';

export interface AnomalyItem {
  id: string;
  region: string;
  indicator: string;
  observedValue: string;
  expectedValue: string;
  deviation: string;
  severity: 'Critical' | 'Warning' | 'Info';
  timestamp: string;
  shapFeatures: ShapFeature[];
}

export const AnomalyAlert: React.FC = () => {
  const { t } = useLanguage();
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyItem | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);

  const anomalyList: AnomalyItem[] = [
    {
      id: 'anom-01',
      region: 'Uttar Pradesh (Urban Cluster)',
      indicator: 'CPI Food & Beverage Spike',
      observedValue: '208.4 pts',
      expectedValue: '194.2 pts',
      deviation: '+7.3% Surge',
      severity: 'Critical',
      timestamp: '12 mins ago',
      shapFeatures: [
        { feature: 'Vegetable & Edible Oil Supply Disruption', value: 218.4, shap_value: 0.68, impact: 'positive', importance_pct: 54.2 },
        { feature: 'Transport Logistics Freight Increase', value: 184.2, shap_value: 0.28, impact: 'positive', importance_pct: 26.5 },
        { feature: 'Cereal Price Base Stability', value: 172.0, shap_value: -0.12, impact: 'negative', importance_pct: 19.3 },
      ],
    },
    {
      id: 'anom-02',
      region: 'Kerala (Southern Zone)',
      indicator: 'PLFS Female Labor Force Disparity',
      observedValue: '24.1%',
      expectedValue: '32.5%',
      deviation: '-8.4% Outlier',
      severity: 'Warning',
      timestamp: '1 hour ago',
      shapFeatures: [
        { feature: 'Tertiary Education Outflow Rate', value: 42.1, shap_value: -0.52, impact: 'negative', importance_pct: 48.0 },
        { feature: 'Care-Economy Urban Transition', value: 31.0, shap_value: -0.34, impact: 'negative', importance_pct: 32.5 },
        { feature: 'Organized Sector Absorption', value: 18.5, shap_value: 0.16, impact: 'positive', importance_pct: 19.5 },
      ],
    },
    {
      id: 'anom-03',
      region: 'Gujarat (Industrial Belt)',
      indicator: 'IIP Electricity Generation Surge',
      observedValue: '214.8 pts',
      expectedValue: '195.2 pts',
      deviation: '+10.0% Peak',
      severity: 'Warning',
      timestamp: '3 hours ago',
      shapFeatures: [
        { feature: 'Heavy Chemical & Refinery Baseload', value: 242.0, shap_value: 0.64, impact: 'positive', importance_pct: 58.2 },
        { feature: 'Renewable Grid Feed-in Variance', value: 190.2, shap_value: 0.26, impact: 'positive', importance_pct: 25.1 },
        { feature: 'Captive Thermal Maintenance Factor', value: 154.0, shap_value: -0.15, impact: 'negative', importance_pct: 16.7 },
      ],
    },
  ];

  const handleAcknowledge = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setAcknowledgedIds((prev) => [...prev, id]);
  };

  const activeAnomalies = anomalyList.filter((a) => !acknowledgedIds.includes(a.id));

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-600/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {t('anomalyHeading')}
          </h3>
        </div>
        <span className="text-xs px-2.5 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold rounded-full">
          {activeAnomalies.length} Active Deviations
        </span>
      </div>

      {/* Anomaly Cards List */}
      <div className="space-y-3">
        {activeAnomalies.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-xl flex flex-col items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span>All statistical indicators are operating within normal 3-sigma confidence bands.</span>
          </div>
        ) : (
          activeAnomalies.map((anom) => {
            const isCritical = anom.severity === 'Critical';
            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomaly(anom)}
                className={`cursor-pointer p-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCritical
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:border-rose-400'
                    : 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 hover:border-amber-400'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {anom.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {anom.region}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">({anom.timestamp})</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    <strong>{anom.indicator}</strong>: Observed {anom.observedValue} vs expected {anom.expectedValue} (
                    <span className="font-bold text-rose-600 dark:text-rose-400">{anom.deviation}</span>)
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedAnomaly(anom)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('viewShap')}</span>
                  </button>

                  <button
                    onClick={(e) => handleAcknowledge(anom.id, e)}
                    className="px-2.5 py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium transition-colors"
                  >
                    {t('dismiss')}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SHAP Modal for selected anomaly */}
      {selectedAnomaly && (
        <ExplainAIModal
          isOpen={!!selectedAnomaly}
          onClose={() => setSelectedAnomaly(null)}
          predictionTitle={`${selectedAnomaly.region} - ${selectedAnomaly.indicator}`}
          predictionValue={`${selectedAnomaly.observedValue} (${selectedAnomaly.deviation})`}
          confidenceScore={0.92}
          shapFeatures={selectedAnomaly.shapFeatures}
          baselineValue={190.0}
        />
      )}
    </div>
  );
};

export default AnomalyAlert;
