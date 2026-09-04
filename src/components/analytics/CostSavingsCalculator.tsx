import React, { useState } from 'react';
import { Calculator, IndianRupee, TrendingDown, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const CostSavingsCalculator: React.FC = () => {
  const [reportsPerMonth, setReportsPerMonth] = useState<number>(450);
  const [analystsCount, setAnalystsCount] = useState<number>(24);
  const [hoursPerReport, setHoursPerReport] = useState<number>(18);

  // Cost calculation constants
  const manualHourlyRateINR = 1250; // Avg senior analyst cost
  const aiProcessingHours = 0.25; // 15 mins automated synthesis

  const manualAnnualHours = reportsPerMonth * hoursPerReport * 12;
  const aiAnnualHours = reportsPerMonth * aiProcessingHours * 12;
  const hoursSaved = manualAnnualHours - aiAnnualHours;

  const manualAnnualCostINR = manualAnnualHours * manualHourlyRateINR;
  const aiAnnualCostINR = (aiAnnualHours * manualHourlyRateINR) + 1200000; // + server infrastructure cost
  const savingsINR = manualAnnualCostINR - aiAnnualCostINR;
  const savingsCrores = (savingsINR / 10000000).toFixed(2);
  const timeReductionPct = Math.round(((hoursPerReport - aiProcessingHours) / hoursPerReport) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-md shadow-emerald-500/20">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            Ministry Fiscal ROI & Cost Savings Calculator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Estimated financial and human-capital efficiencies gained through automated statistical synthesis
          </p>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Reports Per Month */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Monthly Analyses & Briefs</span>
            <span className="text-blue-600 font-mono text-sm">{reportsPerMonth}</span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            value={reportsPerMonth}
            onChange={(e) => setReportsPerMonth(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400">Across Central & State Directorates</span>
        </div>

        {/* Staff Analysts Count */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Dedicated Statistical Officers</span>
            <span className="text-blue-600 font-mono text-sm">{analystsCount}</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            step="5"
            value={analystsCount}
            onChange={(e) => setAnalystsCount(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400">NSO & Ministry Cadre Staff</span>
        </div>

        {/* Manual Hours Per Report */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-700 dark:text-slate-300">Manual Hours Per Brief</span>
            <span className="text-blue-600 font-mono text-sm">{hoursPerReport} hrs</span>
          </div>
          <input
            type="range"
            min="4"
            max="40"
            step="2"
            value={hoursPerReport}
            onChange={(e) => setHoursPerReport(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
          <span className="text-[10px] text-slate-400">Data cleaning, aggregation & writing</span>
        </div>
      </div>

      {/* Big ROI Savings Banner */}
      <div className="p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-800 text-white rounded-2xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 block">
            Projected Annual Taxpayer Savings
          </span>
          <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight flex items-center justify-center sm:justify-start gap-1">
            <IndianRupee className="w-8 h-8 sm:w-11 sm:h-11 inline" />
            <span>{savingsCrores} Crores / Year</span>
          </div>
          <p className="text-xs text-emerald-100">
            Versus conventional manual spreadsheet compilation across {reportsPerMonth * 12} annual reports.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-center border border-white/20">
            <span className="text-xl font-black font-mono block">{timeReductionPct}%</span>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Turnaround Reduction</span>
          </div>
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-center border border-white/20">
            <span className="text-xl font-black font-mono block">{(hoursSaved / 1000).toFixed(1)}k</span>
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Hours Saved / Year</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostSavingsCalculator;
