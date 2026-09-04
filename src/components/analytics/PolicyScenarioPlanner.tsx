import React, { useState, useEffect } from 'react';
import {
  Sliders,
  TrendingUp,
  Target,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  ShieldCheck,
  Zap,
  BarChart2,
  Table,
} from 'lucide-react';
import {
  simulatePolicyScenario,
  ScenarioSimulationResult,
  PriorityDistrictGap,
} from '../../services/scenarioService';

export const PolicyScenarioPlanner: React.FC = () => {
  const [geography, setGeography] = useState<string>('Tamil Nadu');
  const [indicator, setIndicator] = useState<string>('literacy_rate');
  const [currentValue, setCurrentValue] = useState<number>(80.09);
  const [targetValue, setTargetValue] = useState<number>(86.5);
  const [targetYear, setTargetYear] = useState<number>(2030);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scenarioData, setScenarioData] = useState<ScenarioSimulationResult | null>(null);

  // Default benchmarks when state changes
  const stateBenchmarks: Record<string, Record<string, number>> = {
    'Tamil Nadu': { literacy_rate: 80.09, cpi_inflation: 189.9, iip_growth: 154.2, unemployment_rate: 4.8, urbanization_rate: 48.4, gdp_growth: 8.1 },
    'Maharashtra': { literacy_rate: 82.34, cpi_inflation: 191.2, iip_growth: 158.4, unemployment_rate: 5.2, urbanization_rate: 45.2, gdp_growth: 8.4 },
    'Kerala': { literacy_rate: 94.0, cpi_inflation: 193.1, iip_growth: 149.0, unemployment_rate: 8.2, urbanization_rate: 47.7, gdp_growth: 6.8 },
    'Karnataka': { literacy_rate: 75.36, cpi_inflation: 192.5, iip_growth: 152.0, unemployment_rate: 4.8, urbanization_rate: 38.6, gdp_growth: 7.9 },
    'Gujarat': { literacy_rate: 78.03, cpi_inflation: 190.4, iip_growth: 162.8, unemployment_rate: 4.1, urbanization_rate: 42.6, gdp_growth: 8.9 },
    'Uttar Pradesh': { literacy_rate: 67.68, cpi_inflation: 194.8, iip_growth: 141.5, unemployment_rate: 7.4, urbanization_rate: 22.3, gdp_growth: 7.2 },
    'Delhi': { literacy_rate: 86.21, cpi_inflation: 188.6, iip_growth: 148.0, unemployment_rate: 5.8, urbanization_rate: 97.5, gdp_growth: 7.4 },
  };

  const handleGeographyChange = (geo: string) => {
    setGeography(geo);
    const benchmark = stateBenchmarks[geo]?.[indicator] ?? 80.0;
    setCurrentValue(benchmark);
    setTargetValue(+(benchmark + 5.5).toFixed(1));
  };

  const handleIndicatorChange = (ind: string) => {
    setIndicator(ind);
    const benchmark = stateBenchmarks[geography]?.[ind] ?? 80.0;
    setCurrentValue(benchmark);
    setTargetValue(+(benchmark + 5.5).toFixed(1));
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await simulatePolicyScenario({
        geography,
        indicator,
        current_value: currentValue,
        target_value: targetValue,
        target_year: targetYear,
        base_year: 2026,
      });
      setScenarioData(res);
    } catch (err: any) {
      setError(err.message || 'Simulation execution failed.');
    } finally {
      setLoading(false);
    }
  };

  // Initial simulation load
  useEffect(() => {
    handleRunSimulation();
  }, []);

  // Compute SVG chart coordinates
  const svgMetrics = React.useMemo(() => {
    if (!scenarioData) return null;

    const allValues: number[] = [
      ...scenarioData.historical_observations.map((h) => h.value),
      ...scenarioData.baseline_forecast.map((b) => b.upper_bound),
      ...scenarioData.baseline_forecast.map((b) => b.lower_bound),
      ...scenarioData.target_trajectory.map((t) => t.target_value),
    ];

    const minVal = Math.min(...allValues) - 1.5;
    const maxVal = Math.max(...allValues) + 1.5;
    const range = maxVal - minVal || 1;

    const startYear = 2021;
    const endYear = scenarioData.target_year;
    const totalYears = endYear - startYear;

    const width = 640;
    const height = 240;
    const paddingX = 40;
    const paddingY = 25;
    const chartW = width - paddingX * 2;
    const chartH = height - paddingY * 2;

    const getX = (year: number) => paddingX + ((year - startYear) / totalYears) * chartW;
    const getY = (val: number) => height - paddingY - ((val - minVal) / range) * chartH;

    // Build SVG paths
    const histPoints = scenarioData.historical_observations.map((h) => ({
      x: getX(h.year),
      y: getY(h.value),
      year: h.year,
      val: h.value,
    }));
    const histPath = histPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Baseline points (starting from 2026 current value)
    const basePoints = [
      { x: getX(scenarioData.base_year), y: getY(scenarioData.current_value), year: scenarioData.base_year, val: scenarioData.current_value },
      ...scenarioData.baseline_forecast.map((b) => ({
        x: getX(b.year),
        y: getY(b.baseline_forecast),
        year: b.year,
        val: b.baseline_forecast,
      })),
    ];
    const basePath = basePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    // Confidence area polygon (upper + reversed lower)
    const upperPoints = scenarioData.baseline_forecast.map((b) => ({ x: getX(b.year), y: getY(b.upper_bound) }));
    const lowerPoints = [...scenarioData.baseline_forecast].reverse().map((b) => ({ x: getX(b.year), y: getY(b.lower_bound) }));
    const baseCoord = { x: getX(scenarioData.base_year), y: getY(scenarioData.current_value) };
    const confPolygon = [
      baseCoord,
      ...upperPoints,
      ...lowerPoints,
      baseCoord,
    ].map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

    // Target trajectory points
    const targetPoints = scenarioData.target_trajectory.map((t) => ({
      x: getX(t.year),
      y: getY(t.target_value),
      year: t.year,
      val: t.target_value,
    }));
    const targetPath = targetPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const yearLabels = [];
    for (let yr = startYear; yr <= endYear; yr++) {
      yearLabels.push({ year: yr, x: getX(yr) });
    }

    return {
      width,
      height,
      minVal,
      maxVal,
      histPoints,
      histPath,
      basePoints,
      basePath,
      confPolygon,
      targetPoints,
      targetPath,
      yearLabels,
    };
  }, [scenarioData]);

  return (
    <div className="space-y-6">
      {/* Title & Scientific Integrity Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-orange-600 rounded-xl text-white shadow-md shadow-orange-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                  Policy Simulation & Scenario Planner
                </h2>
                <span className="text-[10px] px-2.5 py-0.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-full font-bold">
                  Feature B
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Model-backed target trajectory formulation and differential gap analysis across Indian states & districts.
              </p>
            </div>
          </div>

          {/* Scientific Disclaimer Badge */}
          <div className="p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl max-w-lg">
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Methodological Notice:</strong> This engine calculates target planning trajectories and model-based baseline forecasts. It does not estimate causal policy interventions.
              </span>
            </div>
          </div>
        </div>

        {/* Input Controls Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Geography Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              State / Geography
            </label>
            <select
              value={geography}
              onChange={(e) => handleGeographyChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
            >
              {Object.keys(stateBenchmarks).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Indicator Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-indigo-500" />
              Statistical Indicator
            </label>
            <select
              value={indicator}
              onChange={(e) => handleIndicatorChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 cursor-pointer"
            >
              <option value="literacy_rate">Literacy Rate (%)</option>
              <option value="cpi_inflation">Consumer Price Index (CPI)</option>
              <option value="iip_growth">Index of Industrial Production (IIP)</option>
              <option value="unemployment_rate">Unemployment Rate (PLFS)</option>
              <option value="urbanization_rate">Urbanization Rate (%)</option>
              <option value="gdp_growth">GSDP Growth Rate (%)</option>
            </select>
          </div>

          {/* Current Value (Observed) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              Observed Value (2026)
            </label>
            <input
              type="number"
              step="0.1"
              value={currentValue}
              onChange={(e) => setCurrentValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Target Value */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              Target Objective
            </label>
            <input
              type="number"
              step="0.1"
              value={targetValue}
              onChange={(e) => setTargetValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Target Year & Action */}
          <div className="space-y-1.5 flex flex-col justify-end">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value={2028}>Target 2028</option>
                  <option value={2029}>Target 2029</option>
                  <option value={2030}>Target 2030</option>
                  <option value={2032}>Target 2032</option>
                  <option value={2035}>Target 2035</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={loading}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Simulate</span>
                    <ArrowRight className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 5 Key Metric Cards (Phase 5) */}
      {scenarioData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Current Situation */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Observed Baseline
            </span>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {scenarioData.current_value}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Official {scenarioData.geography} (2026)
            </p>
          </div>

          {/* 2. Model Baseline Forecast */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              2. Baseline Forecast ({scenarioData.target_year})
            </span>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400">
              {scenarioData.metrics.baseline_forecast_target_year}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Prophet/LSTM Projected Path
            </p>
          </div>

          {/* 3. Target Objective */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              3. Target Objective ({scenarioData.target_year})
            </span>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {scenarioData.target_value}%
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Target Planning Milestone
            </p>
          </div>

          {/* 4. Gap to Baseline */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              4. Gap to Baseline
            </span>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400">
              {scenarioData.metrics.gap_to_baseline_forecast > 0 ? `+${scenarioData.metrics.gap_to_baseline_forecast}%` : `${scenarioData.metrics.gap_to_baseline_forecast}%`}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Delta over natural trajectory
            </p>
          </div>

          {/* 5. Required Annual Rate */}
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
              5. Required Velocity
            </span>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400">
              +{scenarioData.metrics.annual_average_change_required}% / yr
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Annual rate to reach target
            </p>
          </div>
        </div>
      )}

      {/* Main Visualization & Priority Districts Grid */}
      {scenarioData && svgMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart View (Phase 6) */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Trajectory Analysis: Historical vs. Baseline Forecast vs. Target Path
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visualizing {scenarioData.geography} &bull; {scenarioData.indicator_display} (2021 &ndash; {scenarioData.target_year})
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold flex-wrap">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  Historical
                </span>
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Baseline Forecast (95% Band)
                </span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Target Path
                </span>
              </div>
            </div>

            {/* Pure Responsive SVG Line & Band Visualization */}
            <div className="w-full bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4">
              <svg viewBox={`0 0 ${svgMetrics.width} ${svgMetrics.height}`} className="w-full h-64 overflow-visible">
                {/* Background horizontal grid lines */}
                {[0.25, 0.5, 0.75].map((pct, idx) => {
                  const y = svgMetrics.height - 25 - pct * (svgMetrics.height - 50);
                  return (
                    <line
                      key={idx}
                      x1={40}
                      y1={y}
                      x2={svgMetrics.width - 40}
                      y2={y}
                      stroke="#94a3b8"
                      strokeOpacity={0.18}
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* 95% Confidence Band Polygon */}
                <path d={svgMetrics.confPolygon} fill="#3b82f6" fillOpacity={0.14} />

                {/* Historical Path */}
                <path d={svgMetrics.histPath} fill="none" stroke="#64748b" strokeWidth={2.5} />

                {/* Baseline Forecast Path (Dashed) */}
                <path
                  d={svgMetrics.basePath}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  strokeDasharray="5 4"
                />

                {/* Target Trajectory Path */}
                <path d={svgMetrics.targetPath} fill="none" stroke="#10b981" strokeWidth={3} />

                {/* Historical Dots */}
                {svgMetrics.histPoints.map((p, i) => (
                  <circle key={`h-${i}`} cx={p.x} cy={p.y} r={4} fill="#64748b" />
                ))}

                {/* Baseline Dots */}
                {svgMetrics.basePoints.map((p, i) => (
                  <circle key={`b-${i}`} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
                ))}

                {/* Target Dots */}
                {svgMetrics.targetPoints.map((p, i) => (
                  <g key={`t-${i}`}>
                    <circle cx={p.x} cy={p.y} r={5} fill="#10b981" stroke="#ffffff" strokeWidth={1.5} />
                    {i === svgMetrics.targetPoints.length - 1 && (
                      <text
                        x={p.x}
                        y={p.y - 12}
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-emerald-600 dark:fill-emerald-400"
                      >
                        {p.val}%
                      </text>
                    )}
                  </g>
                ))}

                {/* X-Axis Year Labels */}
                {svgMetrics.yearLabels.map((lbl, idx) => (
                  <text
                    key={idx}
                    x={lbl.x}
                    y={svgMetrics.height - 8}
                    textAnchor="middle"
                    className="text-[10px] font-medium fill-slate-400"
                  >
                    {lbl.year}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Priority Districts Intervention Table (Phase 8) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Priority Districts Gap Ranking
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Districts in {scenarioData.geography} ranked by required progress gap to meet {scenarioData.target_value}%.
              </p>

              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                      <th className="pb-2">District</th>
                      <th className="pb-2">Current</th>
                      <th className="pb-2">Gap</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {scenarioData.priority_districts.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                          {d.district}
                        </td>
                        <td className="py-2.5 text-slate-600 dark:text-slate-400">
                          {d.current_value}%
                        </td>
                        <td className="py-2.5 font-bold text-amber-600 dark:text-amber-400">
                          +{d.gap}%
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              d.priority_tier === 'Critical Priority'
                                ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                                : d.priority_tier === 'Moderate Priority'
                                ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {d.priority_tier}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
              <span>Source: Census & MoSPI Benchmark Statistical Dataset</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyScenarioPlanner;
