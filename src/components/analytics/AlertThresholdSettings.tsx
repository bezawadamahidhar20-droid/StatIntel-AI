import React, { useState, useEffect } from 'react';
import { Settings, Sliders, Bell, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { alertService, AlertThresholdConfig, SystemAlert } from '../../services/alertService';

export const AlertThresholdSettings: React.FC = () => {
  const [config, setConfig] = useState<AlertThresholdConfig>(alertService.getThresholds());
  const [recentAlerts, setRecentAlerts] = useState<SystemAlert[]>(alertService.getDispatchedAlerts());
  const [saved, setSaved] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alertService.saveThresholds(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSendTestAlert = () => {
    const testAlert = alertService.triggerAlert({
      title: 'Manual Test Statistical Outlier Broadcast',
      message: 'Simulated alert verifying SMS, Email, and in-app webhook pipelines.',
      severity: 'INFO',
      metric: 'National Statistical Feed',
      observedDelta: '+0.0% (Test)',
      channel: 'SMS_AND_EMAIL',
    });
    setRecentAlerts(alertService.getDispatchedAlerts());
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              Alert System & Outlier Threshold Settings
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure sensitivity thresholds for automated SMS/Email anomaly dispatches
            </p>
          </div>
        </div>

        <button
          onClick={handleSendTestAlert}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Test Alert</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* CPI Threshold */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            CPI Spike Alert Threshold (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.cpiSpikeThresholdPct}
            onChange={(e) => setConfig({ ...config, cpiSpikeThresholdPct: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <span className="text-[10px] text-slate-500 block">Triggers CRITICAL tier when CPI YoY exceeds this %</span>
        </div>

        {/* IIP Dip Threshold */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            IIP Industrial Dip Threshold (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.iipDipThresholdPct}
            onChange={(e) => setConfig({ ...config, iipDipThresholdPct: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <span className="text-[10px] text-slate-500 block">Triggers WARNING when manufacturing slows by this delta</span>
        </div>

        {/* Unemployment Jump Threshold */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            PLFS Unemployment Jump (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={config.unemploymentJumpThresholdPct}
            onChange={(e) => setConfig({ ...config, unemploymentJumpThresholdPct: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white outline-hidden focus:ring-2 focus:ring-blue-600"
          />
          <span className="text-[10px] text-slate-500 block">Triggers WARNING when district unemployment surges</span>
        </div>

        <div className="sm:col-span-3 flex items-center justify-between pt-2">
          {saved ? (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Thresholds successfully saved and synced with Alert Engine.
            </span>
          ) : (
            <span className="text-xs text-slate-400">Settings applied immediately to live data streams.</span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};

export default AlertThresholdSettings;
