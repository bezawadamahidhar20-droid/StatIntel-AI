import React from 'react';
import { X, Sparkles, TrendingUp, TrendingDown, HelpCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../services/i18n';

export interface ShapFeature {
  feature: string;
  value?: number;
  shap_value: number;
  impact: 'positive' | 'negative';
  importance_pct?: number;
}

interface ExplainAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictionTitle: string;
  predictionValue: string | number;
  confidenceScore: number;
  shapFeatures: ShapFeature[];
  baselineValue?: number;
}

export const ExplainAIModal: React.FC<ExplainAIModalProps> = ({
  isOpen,
  onClose,
  predictionTitle,
  predictionValue,
  confidenceScore,
  shapFeatures,
  baselineValue = 180.0,
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                SHAP Explainable AI Breakdown
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold rounded-full">
                  TreeSHAP Engine
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interpretable feature attribution for official government decision support
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prediction Summary Header Card */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Target Indicator</span>
              <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">{predictionTitle}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Model Prediction</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400 block">{predictionValue}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Confidence Score</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 inline" />
                {Math.round(confidenceScore * 100)}%
              </span>
            </div>
          </div>

          {/* SHAP Waterfall Attribution Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Top Feature Drivers (SHAP Value Contribution)
              </h4>
              <span className="text-xs text-slate-400">Baseline E[f(x)] = {baselineValue}</span>
            </div>

            <div className="space-y-3">
              {shapFeatures.map((feat, idx) => {
                const isPositive = feat.shap_value >= 0;
                const absShap = Math.abs(feat.shap_value);
                const barWidth = Math.min(100, Math.max(15, absShap * 150));

                return (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                        )}
                        <span>{feat.feature}</span>
                        {feat.value !== undefined && (
                          <span className="text-slate-400 font-normal">({feat.value})</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className={`font-bold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                          {isPositive ? '+' : ''}{feat.shap_value}
                        </span>
                        {feat.importance_pct && (
                          <span className="text-slate-400 text-[10px]">({feat.importance_pct}%)</span>
                        )}
                      </div>
                    </div>

                    {/* Visual contribution bar */}
                    <div className="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden flex">
                      {isPositive ? (
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      ) : (
                        <div
                          className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%` }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p>
              <strong>Methodological Note:</strong> SHAP (SHapley Additive exPlanations) uses game theoretic Shapley values to fairly allocate the contribution of each economic indicator to the model's output deviation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExplainAIModal;
