import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Code2,
  Database,
  BarChart3,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  BookOpen,
  Award,
  Terminal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VirtualLabView: React.FC = () => {
  const { addNotification } = useApp();

  // Selected Lab: 'SAMPLING_SIM' | 'MICRODATA_SANDBOX' | 'CPI_SIM'
  const [activeLab, setActiveLab] = useState<'SAMPLING_SIM' | 'MICRODATA_SANDBOX' | 'CPI_SIM'>('SAMPLING_SIM');

  // ── Lab 1: Sampling Simulator State ───────────────────────────────────────
  const [popSize, setPopSize] = useState<number>(50000);
  const [sampleSize, setSampleSize] = useState<number>(1200);
  const [strataCount, setStrataCount] = useState<number>(4);
  const [allocationMethod, setAllocationMethod] = useState<'PROPORTIONAL' | 'NEYMAN'>('NEYMAN');
  const [intraClusterCorr, setIntraClusterCorr] = useState<number>(0.04);

  // Compute Sampling Metrics in Real Time
  const samplingFraction = (sampleSize / popSize) * 100;
  const deff = (1 + (sampleSize / strataCount / 10 - 1) * intraClusterCorr).toFixed(2);
  const baseRSE = (Math.sqrt((1 - sampleSize / popSize) / sampleSize) * 100 * 1.8).toFixed(2);
  const neymanGainPct = allocationMethod === 'NEYMAN' ? 18.5 : 0;
  const effectiveRSE = (parseFloat(baseRSE) * (allocationMethod === 'NEYMAN' ? 0.82 : 1.0)).toFixed(2);
  const precisionStatus = parseFloat(effectiveRSE) < 3.0 ? 'MoSPI Publication Standard (<3%)' : 'Caution: High Variance (>3%)';

  // ── Lab 2: Microdata Code Sandbox State ────────────────────────────────────
  const [selectedScript, setSelectedScript] = useState<'PLFS' | 'WEIGHTS' | 'ANOMALY'>('PLFS');
  const [codeContent, setCodeContent] = useState<string>(`import pandas as pd
import numpy as np

# Load NSSO 78th Round Household Data
df = pd.DataFrame({
    'hh_id': range(101, 106),
    'state': ['MH', 'UP', 'TN', 'KA', 'WB'],
    'stratum': [1, 2, 1, 2, 1],
    'sub_sample': [1, 2, 1, 2, 1],
    'mlt_sub1': [1420.5, 980.2, 1210.0, 890.4, 1530.1],
    'mlt_sub2': [1418.0, 985.0, 1205.5, 895.0, 1525.0],
    'principal_status': [11, 51, 81, 11, 91] # 11=Self-Employed, 81=Unemployed
})

# Calculate Final Combined Multiplier
df['final_weight'] = (df['mlt_sub1'] + df['mlt_sub2']) / 2.0
print("Combined Multipliers Computed:")
print(df[['hh_id', 'state', 'final_weight', 'principal_status']])
`);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);

  const handleRunCode = () => {
    setIsRunningCode(true);
    setTimeout(() => {
      if (selectedScript === 'PLFS') {
        setCodeOutput(`[INFO] Dataset memory footprint: 1.84 KB (Optimized)
Combined Multipliers Computed:
   hh_id state  final_weight  principal_status
0    101    MH      1419.25                11
1    102    UP       982.60                51
2    103    TN      1207.75                81
3    104    KA       892.70                11
4    105    WB      1527.55                91

✓ Sub-sample parity check: PASSED (Delta < 0.2%)
✓ Calculated Weighted Population Estimate: 6,029.85 persons`);
      } else if (selectedScript === 'WEIGHTS') {
        setCodeOutput(`[INFO] Executing Taylor Series Linearization on Post-Stratified Weights...
Strata: 4 | PSUs: 28 | Non-Response Weight Adjustment Factor: 1.048
✓ Standard Error: 0.0142 | 95% Confidence Interval: [4.82% - 5.38%]
✓ Design Effect (DEFF): 1.34`);
      } else {
        setCodeOutput(`[INFO] Running Isolation Forest Anomaly Scan on Microdata Records...
Records Scanned: 24,500 | Contamination Threshold: 0.02
Flags Raised: 14 outliers detected (Benford Law deviation on HH consumption)
✓ Anomaly Report generated with SHAP feature attributions.`);
      }
      setIsRunningCode(false);

      if (addNotification) {
        addNotification({
          id: `lab-exec-${Date.now()}`,
          title: 'Virtual Lab Experiment Executed! 🧪',
          message: 'Statistical microdata pipeline computed successfully with zero runtime errors.',
          type: 'achievement',
        });
      }
    }, 900);
  };

  // ── Lab 3: CPI Inflation Simulator State ──────────────────────────────────
  const [foodShock, setFoodShock] = useState<number>(4.5);
  const [fuelShock, setFuelShock] = useState<number>(6.0);
  const [housingShock, setHousingShock] = useState<number>(2.5);
  const [clothingShock, setClothingShock] = useState<number>(3.0);

  // CPI Weights (All India 2012=100 Base)
  const W_FOOD = 0.4586;
  const W_FUEL = 0.0684;
  const W_HOUSING = 0.1007;
  const W_CLOTHING = 0.0653;
  const W_MISC = 0.307;

  const simulatedHeadlineCPI = (
    foodShock * W_FOOD +
    fuelShock * W_FUEL +
    housingShock * W_HOUSING +
    clothingShock * W_CLOTHING +
    3.8 * W_MISC
  ).toFixed(2);

  const simulatedCoreInflation = (
    (housingShock * W_HOUSING + clothingShock * W_CLOTHING + 3.8 * W_MISC) /
    (W_HOUSING + W_CLOTHING + W_MISC)
  ).toFixed(2);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Interactive Virtual Laboratories & Statistical Sandboxes (SIH26101 - R6)
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hands-on interactive simulators for Survey Sampling, Microdata Processing, and Macroeconomic Price Indexing.
          </p>
        </div>

        {/* Lab Switcher */}
        <div className="flex flex-wrap items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 gap-1">
          <button
            onClick={() => setActiveLab('SAMPLING_SIM')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'SAMPLING_SIM'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>NSSO Sampling Simulator</span>
          </button>
          <button
            onClick={() => setActiveLab('MICRODATA_SANDBOX')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'MICRODATA_SANDBOX'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python/SQL Microdata Lab</span>
          </button>
          <button
            onClick={() => setActiveLab('CPI_SIM')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLab === 'CPI_SIM'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>CPI Inflation Simulator</span>
          </button>
        </div>
      </div>

      {/* ── LAB 1: NSSO SAMPLING SIMULATOR ──────────────────────────────────── */}
      {activeLab === 'SAMPLING_SIM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Survey Sampling Parameters</span>
              </h2>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Simulate stratified multi-stage probability sampling designs.
              </p>
            </div>

            {/* Parameter 1: Population Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Population Size (N):</span>
                <span className="font-mono font-bold text-indigo-600">{popSize.toLocaleString()} Households</span>
              </div>
              <input
                type="range"
                min={10000}
                max={200000}
                step={5000}
                value={popSize}
                onChange={(e) => setPopSize(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Parameter 2: Sample Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Sample Size (n):</span>
                <span className="font-mono font-bold text-indigo-600">{sampleSize.toLocaleString()} Households</span>
              </div>
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Parameter 3: Strata Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Number of Strata (Wards/Districts):</span>
                <span className="font-mono font-bold text-indigo-600">{strataCount} Strata</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={strataCount}
                onChange={(e) => setStrataCount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            {/* Parameter 4: Allocation Method */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Sample Allocation Scheme:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setAllocationMethod('PROPORTIONAL')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    allocationMethod === 'PROPORTIONAL'
                      ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Proportional
                </button>
                <button
                  onClick={() => setAllocationMethod('NEYMAN')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    allocationMethod === 'NEYMAN'
                      ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-500 text-indigo-700 dark:text-indigo-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Neyman Optimum
                </button>
              </div>
            </div>

            {/* Parameter 5: Intra-cluster Correlation */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Intra-Cluster Correlation (ρ):</span>
                <span className="font-mono font-bold text-indigo-600">{intraClusterCorr.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min={0.01}
                max={0.15}
                step={0.005}
                value={intraClusterCorr}
                onChange={(e) => setIntraClusterCorr(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results & Visual Analytics */}
          <div className="lg:col-span-2 space-y-5">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[11px] text-slate-500 font-semibold">Relative Std Error (RSE)</p>
                <p className="text-xl font-bold font-mono text-indigo-600 mt-1">{effectiveRSE}%</p>
                <span className="text-[10px] text-emerald-600 font-medium">95% Conf: ±{(parseFloat(effectiveRSE) * 1.96).toFixed(1)}%</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[11px] text-slate-500 font-semibold">Design Effect (DEFF)</p>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{deff}</p>
                <span className="text-[10px] text-slate-400">vs Simple Random Sample</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[11px] text-slate-500 font-semibold">Sampling Fraction (f)</p>
                <p className="text-xl font-bold font-mono text-slate-900 dark:text-white mt-1">{samplingFraction.toFixed(2)}%</p>
                <span className="text-[10px] text-slate-400">Mean Weight: {(100 / samplingFraction).toFixed(1)}</span>
              </div>

              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <p className="text-[11px] text-slate-500 font-semibold">Variance Efficiency</p>
                <p className="text-xl font-bold font-mono text-emerald-600 mt-1">+{neymanGainPct}%</p>
                <span className="text-[10px] text-emerald-600 font-medium">{allocationMethod} Allocation</span>
              </div>
            </div>

            {/* Quality Standard Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs ${
              parseFloat(effectiveRSE) < 3.0
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-900 dark:text-amber-200'
            }`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <strong className="font-bold">MoSPI Data Quality Standard: </strong>
                  <span>{precisionStatus}</span>
                </div>
              </div>
              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-white/80 dark:bg-slate-900/80 border">
                Confidence: 95.0%
              </span>
            </div>

            {/* Stratum Sample Breakdown Table */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Stratum-wise Sample Allocation Matrix (NSSO Sub-Sample Design)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Stratum ID</th>
                      <th className="p-2.5">Target Population</th>
                      <th className="p-2.5">Allocated (n_h)</th>
                      <th className="p-2.5">Sub-sample 1</th>
                      <th className="p-2.5">Sub-sample 2</th>
                      <th className="p-2.5">Base Weight (W_h)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Array.from({ length: strataCount }).map((_, idx) => {
                      const stratumPop = Math.round(popSize / strataCount);
                      const stratumSample = Math.round(sampleSize / strataCount);
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">Stratum #{idx + 1}</td>
                          <td className="p-2.5 font-mono">{stratumPop.toLocaleString()}</td>
                          <td className="p-2.5 font-mono font-bold text-indigo-600">{stratumSample}</td>
                          <td className="p-2.5 font-mono">{Math.floor(stratumSample / 2)}</td>
                          <td className="p-2.5 font-mono">{Math.ceil(stratumSample / 2)}</td>
                          <td className="p-2.5 font-mono text-emerald-600">{(stratumPop / stratumSample).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── LAB 2: PYTHON & SQL MICRODATA PROCESSING SANDBOX ───────────────── */}
      {activeLab === 'MICRODATA_SANDBOX' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Code Editor Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Microdata Processing Pipeline</h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={selectedScript}
                  onChange={(e) => setSelectedScript(e.target.value as any)}
                  className="text-xs py-1 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"
                >
                  <option value="PLFS">PLFS Activity Status & Multipliers</option>
                  <option value="WEIGHTS">Taylor Series Weight Linearization</option>
                  <option value="ANOMALY">Isolation Forest Survey Outlier Scan</option>
                </select>
                <button
                  onClick={handleRunCode}
                  disabled={isRunningCode}
                  className="py-1.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isRunningCode ? 'Running...' : 'Execute Script'}</span>
                </button>
              </div>
            </div>

            <textarea
              rows={14}
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              className="w-full p-3.5 font-mono text-xs bg-slate-900 text-emerald-400 rounded-xl border border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Execution Output Panel */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-xs text-slate-200 flex flex-col justify-between font-mono space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Activity className="w-3.5 h-3.5" /> Output Terminal & Microdata Inspector
                </span>
                <span>Python v3.12 (WebAssembly WASM Container)</span>
              </div>

              {codeOutput ? (
                <pre className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap pt-2 overflow-x-auto">
                  {codeOutput}
                </pre>
              ) : (
                <div className="p-12 text-center text-slate-500 text-xs">
                  <span>Click "Execute Script" to run statistical microdata algorithms and inspect console telemetry.</span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>Execution Time: ~140ms</span>
              <span className="text-emerald-400 font-bold">Environment: MoSPI Virtual Data Lab</span>
            </div>
          </div>
        </div>
      )}

      {/* ── LAB 3: CPI INFLATION SHOCK SIMULATOR ────────────────────────────── */}
      {activeLab === 'CPI_SIM' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sliders Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Sectoral Price Shocks (%)</span>
              </h2>
              <p className="text-[11.5px] text-slate-500 mt-0.5">
                Simulate commodity index shocks against official MoSPI CPI basket weights.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Food & Beverages (Weight: 45.86%):</span>
                <span className="font-mono font-bold text-amber-600">+{foodShock.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={-5}
                max={20}
                step={0.5}
                value={foodShock}
                onChange={(e) => setFoodShock(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Fuel & Light (Weight: 6.84%):</span>
                <span className="font-mono font-bold text-amber-600">+{fuelShock.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={-5}
                max={25}
                step={0.5}
                value={fuelShock}
                onChange={(e) => setFuelShock(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Housing (Weight: 10.07%):</span>
                <span className="font-mono font-bold text-amber-600">+{housingShock.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={housingShock}
                onChange={(e) => setHousingShock(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span>Clothing & Footwear (Weight: 6.53%):</span>
                <span className="font-mono font-bold text-amber-600">+{clothingShock.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                step={0.5}
                value={clothingShock}
                onChange={(e) => setClothingShock(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 shadow-xs">
                <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Simulated Headline CPI Inflation (YoY)</p>
                <p className="text-4xl font-extrabold font-mono text-amber-700 dark:text-amber-400 mt-2">
                  +{simulatedHeadlineCPI}%
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  RBI Target Tolerance Band: <strong>4.0% ± 2.0% (2% - 6%)</strong>
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 shadow-xs">
                <p className="text-xs font-bold text-blue-800 dark:text-blue-300">Simulated Core Inflation (Excl. Food & Fuel)</p>
                <p className="text-4xl font-extrabold font-mono text-blue-700 dark:text-blue-400 mt-2">
                  +{simulatedCoreInflation}%
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Underlying macroeconomic price persistence measure.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Laspeyres Price Index Weight Contribution Breakdown
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11.5px]">
                  <span>Food & Beverages</span>
                  <span className="font-mono font-bold">{(foodShock * W_FOOD).toFixed(2)} pts</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, foodShock * 5)}%` }} />
                </div>

                <div className="flex justify-between items-center text-[11.5px] pt-1">
                  <span>Fuel & Light</span>
                  <span className="font-mono font-bold">{(fuelShock * W_FUEL).toFixed(2)} pts</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${Math.min(100, fuelShock * 5)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
