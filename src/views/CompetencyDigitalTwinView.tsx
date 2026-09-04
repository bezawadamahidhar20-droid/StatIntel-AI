import React, { useState } from 'react';
import {
  Cpu,
  TrendingUp,
  ShieldCheck,
  Award,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  PieChart,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompetencyRadar } from '../components/common/CompetencyRadar';
import { CompetencyDomain, Competency } from '../types';

export const CompetencyDigitalTwinView: React.FC = () => {
  const { competencies, setSelectedCompetency, navigate, currentUser } = useApp();
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [chartMode, setChartMode] = useState<'radar' | 'bar'>('radar');

  const domains: (string | CompetencyDomain)[] = [
    'All',
    'Statistical',
    'Technical',
    'Digital Governance',
    'Behavioural & Managerial',
  ];

  const filteredCompetencies = competencies.filter((c) => {
    const matchesDomain = selectedDomain === 'All' || c.domain === selectedDomain;
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Official Competency Digital Twin
            </h1>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Dynamic computational model calibrated against the MoSPI ISS Competency Dictionary and verified evidence logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle between Radar Chart and Bar Chart */}
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setChartMode('radar')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                chartMode === 'radar'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Radar View</span>
            </button>
            <button
              onClick={() => setChartMode('bar')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md transition-colors ${
                chartMode === 'bar'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Comparative Bar View</span>
            </button>
          </div>

          <button
            onClick={() => navigate('quiz-generator')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Validate via AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Top Visual: Radar/Bar Chart & Multi-Domain Metrics */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Chart Display Area */}
        <div className="lg:col-span-6 border border-slate-200 bg-white rounded-xl shadow-xs p-6 flex flex-col justify-between">
          <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {chartMode === 'radar' ? 'Multivariate Competency Radar' : 'Direct Benchmark Gap Comparison'}
            </h3>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              ISS Cadre Benchmark
            </span>
          </div>

          {chartMode === 'radar' ? (
            <div className="py-2 flex justify-center">
              <CompetencyRadar
                competencies={competencies}
                size={360}
                onSelectCompetency={(comp) => setSelectedCompetency(comp)}
              />
            </div>
          ) : (
            <div className="space-y-4 py-2">
              {competencies.slice(0, 6).map((c) => {
                const deficit = c.requiredScore - c.currentScore;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCompetency(c)}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-900">{c.name}</span>
                      <span className="font-bold text-slate-700">
                        {c.currentScore}% vs Req {c.requiredScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                      <div
                        className="bg-blue-600 h-full rounded-l-full"
                        style={{ width: `${Math.min(100, c.currentScore)}%` }}
                        title={`Current: ${c.currentScore}%`}
                      />
                      {deficit > 0 && (
                        <div
                          className="bg-rose-400/70 h-full"
                          style={{ width: `${deficit}%` }}
                          title={`Deficit: ${deficit}%`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-2 text-center">
            Click any competency node to view verified audit logs and evidence sources.
          </p>
        </div>

        {/* Competency Level Maturity Explainer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 border border-slate-200 bg-white rounded-xl shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Digital Twin Calibration Pipeline
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Your digital twin is dynamically validated across multiple official data sources:
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl">
                <span className="font-semibold text-blue-900 block mb-0.5 text-xs">
                  1. Grounded Assessments
                </span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  Direct quiz and diagnostic exams from NSSTA & MoSPI course materials.
                </span>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <span className="font-semibold text-emerald-900 block mb-0.5 text-xs">
                  2. iGOT Karmayogi Records
                </span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  Verified course accreditations on the national platform.
                </span>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                <span className="font-semibold text-amber-900 block mb-0.5 text-xs">
                  3. Field Survey Records
                </span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  Operational deployments in PLFS, UFS, and ASI survey rounds.
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-semibold text-slate-900 block mb-0.5 text-xs">
                  4. Cadre Benchmarking
                </span>
                <span className="text-slate-600 text-[11px] leading-normal">
                  MoSPI ISS Senior Statistical Officer capability matrix.
                </span>
              </div>
            </div>
          </div>

          {/* Level Taxonomy Guide */}
          <div className="p-4 border border-slate-200 bg-white rounded-xl shadow-xs text-xs flex items-center justify-between gap-2">
            <div className="text-center flex-1">
              <span className="font-bold text-slate-800">L1</span>
              <p className="text-[11px] text-slate-500 font-medium">Awareness</p>
            </div>
            <div className="text-center flex-1 border-l border-slate-200">
              <span className="font-bold text-slate-800">L2</span>
              <p className="text-[11px] text-slate-500 font-medium">Practitioner</p>
            </div>
            <div className="text-center flex-1 border-l border-slate-200">
              <span className="font-bold text-blue-700">L3</span>
              <p className="text-[11px] text-blue-600 font-semibold">Proficient</p>
            </div>
            <div className="text-center flex-1 border-l border-slate-200">
              <span className="font-bold text-emerald-700">L4</span>
              <p className="text-[11px] text-emerald-600 font-semibold">Advanced</p>
            </div>
            <div className="text-center flex-1 border-l border-slate-200">
              <span className="font-bold text-purple-700">L5</span>
              <p className="text-[11px] text-purple-600 font-semibold">Expert</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedDomain === dom
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter competency title or domain..."
          className="px-3.5 py-2 border border-slate-200 bg-white rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent w-full sm:w-64"
        />
      </div>

      {/* Competency Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompetencies.map((comp) => {
          const isCritical = comp.status === 'Critical Gap';
          const isTargetMet = comp.status === 'Target Met' || comp.status === 'Exceeds';

          return (
            <div
              key={comp.id}
              onClick={() => setSelectedCompetency(comp)}
              className="p-5 border border-slate-200 bg-white rounded-xl shadow-xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Domain & Status Tag */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {comp.domain}
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                      isCritical
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : isTargetMet
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                  {comp.name}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {comp.description}
                </p>
              </div>

              <div>
                {/* Score vs Target Progress Bar */}
                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-800">
                      Level: <strong className="text-blue-700">{comp.currentLevel}</strong> ({comp.currentScore}%)
                    </span>
                    <span className="text-slate-500">
                      Target: {comp.requiredLevel} ({comp.requiredScore}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isCritical ? 'bg-rose-500' : isTargetMet ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${comp.currentScore}%` }}
                    />
                  </div>
                </div>

                {/* Evidence count & Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    {comp.evidenceSources.length} verified logs
                  </span>
                  <span className="text-blue-600 font-semibold flex items-center text-xs">
                    Inspect <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

