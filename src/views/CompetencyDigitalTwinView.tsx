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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CompetencyRadar } from '../components/common/CompetencyRadar';
import { CompetencyDomain, Competency } from '../types';

export const CompetencyDigitalTwinView: React.FC = () => {
  const { competencies, setSelectedCompetency, navigate, currentUser } = useApp();
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="space-y-6 max-w-7xl mx-auto font-mono text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#222222]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#181818] border border-[#D8FE41]/40 text-[#D8FE41]">
              <Cpu className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white font-display">
              Official Competency Digital Twin
            </h1>
          </div>
          <p className="text-xs text-[#888888] mt-1">
            Real-time verified computational model representing your dynamic capability profile across official statistical systems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('quiz-generator')}
            className="px-4 py-2 bg-[#D8FE41] hover:bg-[#c9ef32] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(216,254,65,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Validate Skills with AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Top Visual: Radar Chart & Multi-Domain Metrics */}
      <div className="grid lg:grid-cols-12 gap-6 items-center">
        {/* Radar Chart Display */}
        <div className="lg:col-span-6 border border-[#222222] bg-[#121212] p-5 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2 border-b border-[#1f1f1f] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#777777]">
              Multivariate Competency Radar
            </h3>
            <span className="text-[10px] font-bold text-[#D8FE41] uppercase tracking-wider">
              ISS Cadre Standard
            </span>
          </div>

          <CompetencyRadar
            competencies={competencies}
            size={380}
            onSelectCompetency={(comp) => setSelectedCompetency(comp)}
          />
        </div>

        {/* Competency Level Maturity Explainer */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 border border-[#222222] bg-[#121212]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D8FE41]" />
              Digital Twin Verification Architecture
            </h3>
            <p className="text-xs text-[#888888] leading-relaxed mb-4">
              Your digital twin is continuously calibrated via:
            </p>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#161616] border border-[#262626]">
                <span className="font-bold text-[#D8FE41] uppercase block mb-0.5 text-[11px]">
                  1. Grounded Assessments
                </span>
                <span className="text-[#777777] text-[10px]">
                  Direct quiz submissions from NSSTA & MoSPI course materials.
                </span>
              </div>

              <div className="p-3 bg-[#161616] border border-[#262626]">
                <span className="font-bold text-emerald-400 uppercase block mb-0.5 text-[11px]">
                  2. iGOT Accreditations
                </span>
                <span className="text-[#777777] text-[10px]">
                  Verified completions on the national Karmayogi platform.
                </span>
              </div>

              <div className="p-3 bg-[#161616] border border-[#262626]">
                <span className="font-bold text-amber-400 uppercase block mb-0.5 text-[11px]">
                  3. Field Survey Records
                </span>
                <span className="text-[#777777] text-[10px]">
                  Operational deployment in PLFS, UFS, and ASI rounds.
                </span>
              </div>

              <div className="p-3 bg-[#161616] border border-[#262626]">
                <span className="font-bold text-white uppercase block mb-0.5 text-[11px]">
                  4. Cadre Benchmarking
                </span>
                <span className="text-[#777777] text-[10px]">
                  MoSPI ISS Senior Statistical Officer role expectation matrices.
                </span>
              </div>
            </div>
          </div>

          {/* Level Taxonomy Guide */}
          <div className="p-4 border border-[#222222] bg-[#141414] text-xs flex items-center justify-between gap-2">
            <div className="text-center flex-1">
              <span className="font-bold text-white">L1</span>
              <p className="text-[10px] text-[#777777] uppercase">Awareness</p>
            </div>
            <div className="text-center flex-1 border-l border-[#262626]">
              <span className="font-bold text-white">L2</span>
              <p className="text-[10px] text-[#777777] uppercase">Practitioner</p>
            </div>
            <div className="text-center flex-1 border-l border-[#262626]">
              <span className="font-bold text-[#D8FE41]">L3</span>
              <p className="text-[10px] text-[#777777] uppercase">Proficient</p>
            </div>
            <div className="text-center flex-1 border-l border-[#262626]">
              <span className="font-bold text-emerald-400">L4</span>
              <p className="text-[10px] text-[#777777] uppercase">Advanced</p>
            </div>
            <div className="text-center flex-1 border-l border-[#262626]">
              <span className="font-bold text-purple-400">L5</span>
              <p className="text-[10px] text-[#777777] uppercase">Expert</p>
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
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedDomain === dom
                  ? 'bg-[#D8FE41] text-black shadow-[0_0_8px_rgba(216,254,65,0.4)]'
                  : 'bg-[#141414] text-[#888888] border border-[#282828] hover:bg-[#1f1f1f] hover:text-white'
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
          placeholder="Filter competency title..."
          className="px-3 py-1.5 border border-[#282828] bg-[#121212] text-xs text-white placeholder:text-[#666666] focus:outline-hidden focus:border-[#D8FE41] w-full sm:w-64 font-mono"
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
              className="p-4 border border-[#222222] bg-[#121212] hover:border-[#D8FE41]/60 hover:shadow-[0_0_12px_rgba(216,254,65,0.12)] transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Domain & Status Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                    {comp.domain}
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 border ${
                      isCritical
                        ? 'bg-rose-950/60 text-rose-300 border-rose-800'
                        : isTargetMet
                        ? 'bg-[#D8FE41]/10 text-[#D8FE41] border-[#D8FE41]/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-800'
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wide text-white mb-2 line-clamp-1">
                  {comp.name}
                </h3>

                <p className="text-xs text-[#888888] line-clamp-2 mb-4 leading-relaxed">
                  {comp.description}
                </p>
              </div>

              <div>
                {/* Score vs Target Progress Bar */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="text-white">
                      LVL: <strong className="text-[#D8FE41]">{comp.currentLevel}</strong> ({comp.currentScore}%)
                    </span>
                    <span className="text-[#777777]">
                      REQ: {comp.requiredLevel} ({comp.requiredScore}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#202020] h-1.5 overflow-hidden">
                    <div
                      className={`h-full ${
                        isCritical ? 'bg-rose-500' : isTargetMet ? 'bg-[#D8FE41]' : 'bg-amber-400'
                      }`}
                      style={{ width: `${comp.currentScore}%` }}
                    />
                  </div>
                </div>

                {/* Evidence count & Footer */}
                <div className="pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-[10px] text-[#777777] uppercase font-bold">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D8FE41]" />
                    {comp.evidenceSources.length} verified evidence
                  </span>
                  <span className="text-[#D8FE41] flex items-center">
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
