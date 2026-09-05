import React from 'react';
import { Zap, Target } from 'lucide-react';

export const ScalabilityMetrics: React.FC = () => {
  const benchmarks = [
    { metric: 'Citizen Demographic Records', target: '1.428 Billion', note: 'Census 2011 reference registry', status: 'Design' },
    { metric: 'Throughput Peak Load', target: '10,000 req/sec', note: 'Illustrative demo goal — no load test run', status: 'Target' },
    { metric: 'Time-Series Forecast Latency (p99)', target: '< 150 ms', note: 'Illustrative demo goal', status: 'Target' },
    { metric: 'SHAP Feature Attribution Speed', target: '< 200 ms', note: 'Illustrative demo goal', status: 'Target' },
    { metric: 'GeoJSON Spatial Render Time', target: '< 300 ms', note: 'Illustrative demo goal', status: 'Target' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">
            National-Scale Architecture Profile
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Illustrative capacity targets for the national dashboard (28 States, 8 UTs, 788 districts) — demo build, not production load-tested
          </p>
        </div>
      </div>

      {/* 4 Big Scale Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Citizen Records Scope</span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono block">1.4B+</span>
          <span className="text-[10px] text-slate-500">Census 2011 population reference</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Throughput Design Target</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">10,000+</span>
          <span className="text-[10px] text-slate-500">Requests per second (goal)</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inference Latency (p99)</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 font-mono block">&lt; 50ms</span>
          <span className="text-[10px] text-slate-500">Latency target</span>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Availability Target</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 font-mono block">99.9%</span>
          <span className="text-[10px] text-slate-500">Not production-monitored in demo</span>
        </div>
      </div>

      {/* Capacity Targets Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="py-3 px-4">Performance Dimension</th>
              <th className="py-3 px-4">Illustrative Design Target</th>
              <th className="py-3 px-4">Note</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {benchmarks.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.metric}</td>
                <td className="py-3 px-4 text-slate-900 dark:text-slate-100 font-mono font-bold">{row.target}</td>
                <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{row.note}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300">
                    <Target className="w-3 h-3" />
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScalabilityMetrics;
