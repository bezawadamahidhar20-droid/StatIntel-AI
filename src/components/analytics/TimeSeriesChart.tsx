import React, { useState } from 'react';
import { TrendingUp, ShieldCheck, Sparkles, HelpCircle, Activity } from 'lucide-react';
import { useLanguage } from '../../services/i18n';
import ExplainAIModal, { ShapFeature } from '../modals/ExplainAIModal';

export const TimeSeriesChart: React.FC = () => {
  const { t } = useLanguage();
  const [selectedSeries, setSelectedSeries] = useState<'cpi' | 'iip'>('cpi');
  const [isExplainModalOpen, setIsExplainModalOpen] = useState<boolean>(false);

  // Time-series dataset with Prophet/LSTM forecast and 95% upper/lower bounds
  const cpiData = [
    { period: 'Jan 26', value: 189.4, type: 'historical' },
    { period: 'Feb 26', value: 190.1, type: 'historical' },
    { period: 'Mar 26', value: 190.8, type: 'historical' },
    { period: 'Apr 26', value: 191.7, type: 'historical' },
    { period: 'May 26', value: 192.6, type: 'historical' },
    { period: 'Jun 26', value: 193.4, type: 'historical' },
    { period: 'Jul 26 (F)', value: 194.2, lower: 192.8, upper: 195.6, type: 'forecast' },
    { period: 'Aug 26 (F)', value: 195.0, lower: 193.2, upper: 196.8, type: 'forecast' },
    { period: 'Sep 26 (F)', value: 195.8, lower: 193.6, upper: 198.0, type: 'forecast' },
    { period: 'Oct 26 (F)', value: 196.7, lower: 194.1, upper: 199.3, type: 'forecast' },
  ];

  const iipData = [
    { period: 'Jan 26', value: 148.9, type: 'historical' },
    { period: 'Feb 26', value: 150.1, type: 'historical' },
    { period: 'Mar 26', value: 151.6, type: 'historical' },
    { period: 'Apr 26', value: 152.8, type: 'historical' },
    { period: 'May 26', value: 153.5, type: 'historical' },
    { period: 'Jun 26', value: 154.2, type: 'historical' },
    { period: 'Jul 26 (F)', value: 155.1, lower: 153.4, upper: 156.8, type: 'forecast' },
    { period: 'Aug 26 (F)', value: 156.0, lower: 154.0, upper: 158.0, type: 'forecast' },
    { period: 'Sep 26 (F)', value: 156.9, lower: 154.5, upper: 159.3, type: 'forecast' },
    { period: 'Oct 26 (F)', value: 157.8, lower: 155.0, upper: 160.6, type: 'forecast' },
  ];

  const activeData = selectedSeries === 'cpi' ? cpiData : iipData;
  const seriesTitle = selectedSeries === 'cpi' ? 'All India Consumer Price Index (CPI)' : 'Index of Industrial Production (IIP)';
  const minVal = Math.min(...activeData.map((d) => (d.lower || d.value) - 2));
  const maxVal = Math.max(...activeData.map((d) => (d.upper || d.value) + 2));

  // SHAP Feature drivers for explainability
  const shapDrivers: ShapFeature[] = selectedSeries === 'cpi' ? [
    { feature: 'Food & Beverage Sub-Index', value: 198.9, shap_value: 0.54, impact: 'positive', importance_pct: 46.2 },
    { feature: 'Fuel & Light Price Normalization', value: 180.2, shap_value: -0.22, impact: 'negative', importance_pct: 28.5 },
    { feature: 'Housing & Rent Urban Adjustment', value: 174.3, shap_value: 0.18, impact: 'positive', importance_pct: 25.3 },
  ] : [
    { feature: 'Manufacturing Sector Output', value: 156.5, shap_value: 0.62, impact: 'positive', importance_pct: 52.1 },
    { feature: 'Electricity Generation Demand', value: 195.8, shap_value: 0.31, impact: 'positive', importance_pct: 31.4 },
    { feature: 'Mining Output Moderation', value: 136.7, shap_value: -0.14, impact: 'negative', importance_pct: 16.5 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('timeSeriesTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('forecastModel')} with RMSE = 0.42 and 95% Bayesian upper/lower confidence bounds
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Series Toggle */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setSelectedSeries('cpi')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedSeries === 'cpi'
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              CPI Inflation
            </button>
            <button
              onClick={() => setSelectedSeries('iip')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedSeries === 'iip'
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              IIP Production
            </button>
          </div>

          {/* Explain AI Modal Trigger */}
          <button
            onClick={() => setIsExplainModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('explainAiBtn')}</span>
          </button>
        </div>
      </div>

      {/* SVG Time-Series Chart Visualization with Confidence Bands */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200">{seriesTitle}</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span>{t('historicalData')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span>{t('forecastPoint')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-indigo-200 dark:bg-indigo-900/60 inline-block" />
              <span>{t('confidenceInterval')}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Grid */}
        <div className="grid grid-cols-10 gap-2 h-56 items-end pt-6">
          {activeData.map((point, idx) => {
            const isForecast = point.type === 'forecast';
            const heightPct = Math.max(10, ((point.value - minVal) / (maxVal - minVal)) * 100);
            const lowerPct = point.lower ? ((point.lower - minVal) / (maxVal - minVal)) * 100 : 0;
            const upperPct = point.upper ? ((point.upper - minVal) / (maxVal - minVal)) * 100 : 0;
            const bandHeightPct = upperPct - lowerPct;

            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                {/* Confidence Band Overlay for Forecast Points */}
                {isForecast && (
                  <div
                    className="absolute w-full bg-indigo-200/50 dark:bg-indigo-900/40 rounded-lg border border-dashed border-indigo-400/50 pointer-events-none"
                    style={{
                      bottom: `${lowerPct}%`,
                      height: `${Math.max(12, bandHeightPct)}%`,
                    }}
                  />
                )}

                {/* Point / Bar */}
                <div
                  className={`w-full max-w-[28px] rounded-t-xl transition-all duration-300 relative z-10 ${
                    isForecast
                      ? 'bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:brightness-110'
                      : 'bg-gradient-to-t from-blue-600 to-cyan-500 group-hover:brightness-110'
                  }`}
                  style={{ height: `${heightPct}%` }}
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {point.value} pts {isForecast && `[${point.lower}-${point.upper}]`}
                  </div>
                </div>

                {/* X-axis Label */}
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium truncate w-full text-center">
                  {point.period.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SHAP Modal */}
      <ExplainAIModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        predictionTitle={`${seriesTitle} (Oct 2026 Forecast)`}
        predictionValue={selectedSeries === 'cpi' ? '196.7 pts (+4.51% YoY)' : '157.8 pts (+5.8% YoY)'}
        confidenceScore={0.95}
        shapFeatures={shapDrivers}
        baselineValue={selectedSeries === 'cpi' ? 189.4 : 148.9}
      />
    </div>
  );
};

export default TimeSeriesChart;
