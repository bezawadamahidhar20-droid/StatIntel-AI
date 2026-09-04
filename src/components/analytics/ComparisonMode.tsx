import React, { useState } from 'react';
import { ArrowLeftRight, TrendingUp, Layers, Check, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../services/i18n';

export const ComparisonMode: React.FC = () => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<'yoy' | 'state'>('state');
  const [stateA, setStateA] = useState<string>('Maharashtra');
  const [stateB, setStateB] = useState<string>('Tamil Nadu');

  const statesData: Record<string, { cpi: number; iip: number; literacy: number; urban: number; growth: number }> = {
    Maharashtra: { cpi: 191.2, iip: 158.4, literacy: 86.2, urban: 45.2, growth: 8.4 },
    'Tamil Nadu': { cpi: 189.9, iip: 154.2, literacy: 80.1, urban: 48.4, growth: 8.1 },
    Gujarat: { cpi: 190.4, iip: 162.8, literacy: 78.0, urban: 42.6, growth: 8.9 },
    Karnataka: { cpi: 192.5, iip: 152.0, literacy: 75.4, urban: 38.6, growth: 7.9 },
    'Uttar Pradesh': { cpi: 194.8, iip: 141.5, literacy: 67.7, urban: 22.3, growth: 7.2 },
  };

  const stateList = Object.keys(statesData);
  const dataA = statesData[stateA];
  const dataB = statesData[stateB];

  // YoY data
  const yoyComparisons = [
    { metric: 'CPI Combined Inflation', fy25: '5.12%', fy26: '4.42%', delta: '-0.70%', favorable: true },
    { metric: 'IIP Manufacturing Growth', fy25: '4.8%', fy26: '5.7%', delta: '+0.90%', favorable: true },
    { metric: 'PLFS Urban Unemployment', fy25: '6.8%', fy26: '6.4%', delta: '-0.40%', favorable: true },
    { metric: 'Forex Reserves Total', fy25: '$651.5B', fy26: '$688.4B', delta: '+$36.9B', favorable: true },
    { metric: 'Bank Credit Expansion', fy25: '13.9%', fy26: '14.8%', delta: '+0.90%', favorable: true },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t('comparisonTitle')}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cross-state differential benchmarking and fiscal year comparative trajectory
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setMode('state')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'state'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('stateVsState')}
          </button>
          <button
            onClick={() => setMode('yoy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'yoy'
                ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {t('yoyMode')}
          </button>
        </div>
      </div>

      {mode === 'state' ? (
        <div className="space-y-5">
          {/* State Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('selectStateA')}
              </label>
              <select
                value={stateA}
                onChange={(e) => setStateA(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {stateList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t('selectStateB')}
              </label>
              <select
                value={stateB}
                onChange={(e) => setStateB(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden"
              >
                {stateList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparative Metric Rows */}
          <div className="space-y-3">
            {[
              { label: 'GSDP Growth Rate', valA: `${dataA.growth}%`, valB: `${dataB.growth}%`, higherIsBetter: true },
              { label: 'Industrial Output Index (IIP)', valA: `${dataA.iip} pts`, valB: `${dataB.iip} pts`, higherIsBetter: true },
              { label: 'Consumer Inflation (CPI)', valA: `${dataA.cpi} pts`, valB: `${dataB.cpi} pts`, higherIsBetter: false },
              { label: 'Literacy Rate', valA: `${dataA.literacy}%`, valB: `${dataB.literacy}%`, higherIsBetter: true },
              { label: 'Urban Population Share', valA: `${dataA.urban}%`, valB: `${dataB.urban}%`, higherIsBetter: true },
            ].map((row, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="font-bold text-blue-600 dark:text-blue-400 w-1/4">
                  {row.valA}
                </div>
                <div className="font-semibold text-slate-700 dark:text-slate-300 text-center w-2/4">
                  {row.label}
                </div>
                <div className="font-bold text-indigo-600 dark:text-indigo-400 text-right w-1/4">
                  {row.valB}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* YoY Mode Table */
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Key Economic Indicator</th>
                <th className="py-3 px-4">FY 2024-25</th>
                <th className="py-3 px-4">FY 2025-26</th>
                <th className="py-3 px-4">Net Trajectory Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {yoyComparisons.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.metric}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">{row.fy25}</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-slate-100 font-mono font-bold">{row.fy26}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComparisonMode;
