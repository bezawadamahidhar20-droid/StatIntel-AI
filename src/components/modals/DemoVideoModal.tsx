import React from 'react';
import { X, Play, Sparkles, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { APP_CONFIG } from '../../config';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <Play className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                StatIntel-AI 30-Second Platform Walkthrough
              </h3>
              <p className="text-xs text-slate-400">
                {APP_CONFIG.ministryName} &mdash; Problem ID: {APP_CONFIG.problemStatementId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation Canvas */}
        <div className="p-8 bg-gradient-to-b from-slate-950 to-slate-900 flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-full aspect-video max-w-xl bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6 shadow-inner group">
            {/* Animated Grid / Radar background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-slate-950 pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-md">
              <div className="inline-flex p-4 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 shadow-xl shadow-blue-500/10 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-white">
                AI Statistical Intelligence in Action
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interactive walkthrough of trend-decomposition (Prophet/LSTM-style) forecasting, Isolation Forest anomaly alerts, SHAP-style feature attribution, and multilingual natural-language querying over Census 2011 district baselines and MoSPI reference indicators.
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Census / MoSPI Reference Data
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-950/80 border border-blue-500/40 text-blue-400 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Explainable Predictions
                </span>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            Click anywhere or hit Close to test the interactive live system directly.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Launch Interactive Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoVideoModal;
