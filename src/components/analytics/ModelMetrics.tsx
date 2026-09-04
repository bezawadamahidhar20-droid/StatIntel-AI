import React, { useState } from 'react';
import { Brain, Cpu, TrendingUp, CheckCircle2, RotateCw, Sparkles, Award } from 'lucide-react';

export const ModelMetrics: React.FC = () => {
  const [retraining, setRetraining] = useState<boolean>(false);
  const [lastRetrained, setLastRetrained] = useState<string>('Today at 04:30 AM IST (Automated Cron)');

  const handleRetrain = () => {
    setRetraining(true);
    setTimeout(() => {
      setRetraining(false);
      setLastRetrained('Just now (Manual Trigger)');
    }, 1200);
  };

  const modelComparisons = [
    { model: 'Prophet + LSTM Hybrid (StatIntel)', rmse: '0.42 pts', r2: '0.96', f1: '0.93', latency: '42 ms', rank: '1st (Selected)' },
    { model: 'SARIMAX (Seasonal Baseline)', rmse: '0.78 pts', r2: '0.88', f1: '0.84', latency: '85 ms', rank: '2nd' },
    { model: 'XGBoost Regressor (Tabular Only)', rmse: '0.65 pts', r2: '0.91', f1: '0.89', latency: '38 ms', rank: '3rd' },
    { model: 'Classical Holt-Winters', rmse: '1.14 pts', r2: '0.79', f1: '0.76', latency: '18 ms', rank: '4th' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-purple-600 rounded-xl text-white shadow-md shadow-purple-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              AI/ML Model Registry, Accuracy & Drift Dashboard
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Continuous validation against statistical baselines & automated retraining telemetry
            </p>
          </div>
        </div>

        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 cursor-pointer"
        >
          <RotateCw className={`w-3.5 h-3.5 ${retraining ? 'animate-spin' : ''}`} />
          <span>{retraining ? 'Retraining on Live NSO Feeds...' : 'Trigger Pipeline Retrain'}</span>
        </button>
      </div>

      {/* Model Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Training Corpus</span>
          <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono block">1,428,940</span>
          <span className="text-[10px] text-emerald-600 font-bold">+18.4% Live Growth</span>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Forecasting RMSE</span>
          <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">0.42</span>
          <span className="text-[10px] text-slate-400">Lower is better</span>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Macro F1-Score</span>
          <span className="text-xl sm:text-2xl font-black text-purple-600 dark:text-purple-400 font-mono block">93.4%</span>
          <span className="text-[10px] text-slate-400">Development Tier Classification</span>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Data Drift Status</span>
          <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono block">None</span>
          <span className="text-[10px] text-emerald-600 font-bold">KS-Test p &gt; 0.05</span>
        </div>
      </div>

      {/* Model Benchmark Comparison Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Comparative Evaluation vs Established Econometric Baselines
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Model Architecture</th>
                <th className="py-2.5 px-3">RMSE Error</th>
                <th className="py-2.5 px-3">R² Coefficient</th>
                <th className="py-2.5 px-3">F1 Score</th>
                <th className="py-2.5 px-3">Inference Speed</th>
                <th className="py-2.5 px-3">Benchmark Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {modelComparisons.map((row, idx) => (
                <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${idx === 0 ? 'bg-purple-50/50 dark:bg-purple-950/20 font-bold' : ''}`}>
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {idx === 0 && <Award className="w-4 h-4 text-purple-600" />}
                    {row.model}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400">{row.rmse}</td>
                  <td className="py-2.5 px-3 font-mono">{row.r2}</td>
                  <td className="py-2.5 px-3 font-mono">{row.f1}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{row.latency}</td>
                  <td className="py-2.5 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      idx === 0
                        ? 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {row.rank}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
        <span>Last automated retraining cycle: <strong className="text-slate-600 dark:text-slate-300">{lastRetrained}</strong></span>
        <span>Validation Scheme: 5-Fold Expanding Window Time-Series Cross Validation</span>
      </div>
    </div>
  );
};

export default ModelMetrics;
