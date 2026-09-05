import React from 'react';
import { Brain, Cpu, TrendingUp, ShieldCheck, Sparkles, Database, MapPin, MessageSquareText } from 'lucide-react';

export const ModelMetrics: React.FC = () => {
  const components = [
    {
      name: 'Trend-Decomposition Forecaster',
      implementation: 'Polynomial trend + residual-based confidence bounds (Prophet/LSTM-style simulation)',
      metrics: 'rmse, r2_score',
      basis: 'In-sample fit on the user-supplied historical series',
    },
    {
      name: 'GradientBoosting Tier Classifier',
      implementation: 'sklearn GradientBoostingClassifier (Aspirational / Developing / High-Performing)',
      metrics: 'training_accuracy, f1_score',
      basis: 'In-sample fit on synthetic reference vectors drawn around Census-derived distributions',
    },
    {
      name: 'Isolation Forest Anomaly Detector',
      implementation: 'sklearn IsolationForest',
      metrics: 'anomaly flags, contamination',
      basis: 'Computed on the submitted records with a fixed contamination prior',
    },
    {
      name: 'Multilingual Semantic Parser',
      implementation: 'Rule & lexical resolver (Unicode script detection + MoSPI entity mappings)',
      metrics: 'engine, supported_languages, parser_type',
      basis: 'Deterministic keyword/script resolution (no trained model)',
    },
    {
      name: 'Policy Scenario Planner',
      implementation: 'Baseline forecast + linear target trajectory & gap analysis',
      metrics: 'model_rmse, model_r2, gap metrics',
      basis: 'Derived from the forecaster output and planning assumptions',
    },
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
              AI/ML Model Registry & Metric Transparency
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Honest inventory of deployed components and how each reported metric is actually produced
            </p>
          </div>
        </div>
      </div>

      {/* Model Components Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block pt-1">Forecasting</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white block">Trend decomposition</span>
          <span className="text-[10px] text-slate-400">Metrics computed per request on supplied series</span>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block pt-1">Tier Classifier</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white block">GradientBoostingClassifier</span>
          <span className="text-[10px] text-slate-400">Fitted on synthetic reference vectors (in-sample only)</span>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block pt-1">Anomaly Detection</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white block">IsolationForest</span>
          <span className="text-[10px] text-slate-400">Fixed contamination prior; flags per submitted record</span>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <MessageSquareText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block pt-1">Natural Language</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white block">Rule & lexical parser</span>
          <span className="text-[10px] text-slate-400">Deterministic; no trained accuracy claim</span>
        </div>
      </div>

      {/* Deployed Components & Metric Basis Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Deployed Components & Basis of Reported Metrics
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2.5 px-3">Component</th>
                <th className="py-2.5 px-3">Implementation</th>
                <th className="py-2.5 px-3">Metrics Reported</th>
                <th className="py-2.5 px-3">Metric Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {components.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors align-top">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.implementation}</td>
                  <td className="py-2.5 px-3 font-mono text-purple-600 dark:text-purple-400">{row.metrics}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{row.basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scientific Methodology & Trust Framework Card (Requirement 12) */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          StatIntel-AI Methodology & Trust Framework (MoSPI PS-1628)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 dark:text-slate-300">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">1. Reference Data</span>
            Curated from official Census 2011, PLFS, and MoSPI statistical tables. Benchmark indicators provide grounded reference distributions.
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">2. Predictive Forecasting</span>
            Trend-decomposition forecaster (Prophet/LSTM-style simulation) with polynomial drift and empirical confidence intervals (95% bounds).
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">3. Multi-Class Classification</span>
            Gradient Boosting Classifier (`GradientBoostingClassifier`) categorizing districts into Aspirational, Developing, and High-Performing tiers.
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">4. Model Feature Attribution</span>
            Local normalized baseline difference attribution evaluating feature direction and magnitude without fabricating unverified causal claims.
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">5. Bounded Counterfactuals</span>
            Iterative perturbation search identifying minimal feasible metric shifts that alter model classification tiers under genuine domain constraints.
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white block mb-0.5">6. Policy Scenario Planner</span>
            Delineates model-driven baseline forecasts from linear target planning trajectories with differential gap analysis across priority districts.
          </div>
        </div>
      </div>

      <div className="pt-2 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          Demo build: models are lightweight simulations — no production training pipeline, load tests, or live drift monitoring are implied.
        </span>
        <span className="text-slate-400">Reported metrics are in-sample / synthetic unless stated otherwise.</span>
      </div>
    </div>
  );
};

export default ModelMetrics;
