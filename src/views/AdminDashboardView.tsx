import React, { useState } from 'react';
import {
  Users,
  Building2,
  TrendingUp,
  BrainCircuit,
  Flame,
  CalendarDays,
  Sparkles,
  Shield,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  departmentHeatmapData,
  predictiveSkillItems,
} from '../data/mockData';

export const AdminDashboardView: React.FC = () => {
  const { switchRole, navigate } = useApp();
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'predictive' | 'planner'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHeatmap =
    selectedDivision === 'All'
      ? departmentHeatmapData
      : departmentHeatmapData.filter((d) => d.department.includes(selectedDivision));

  return (
    <div className="space-y-8 bg-[#080808] text-white">
      {/* Header Banner */}
      <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#D8FE41]/10 border border-[#D8FE41]/40 rounded text-[11px] font-mono font-bold tracking-widest text-[#D8FE41] uppercase mb-2">
            <Shield className="w-3.5 h-3.5 text-[#D8FE41]" />
            <span>EXECUTIVE CADRE INTELLIGENCE • MOSPI & NSSTA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display text-white">
            Workforce Competency Intelligence
          </h1>
          <p className="text-sm text-[#999999] font-mono mt-1 max-w-2xl">
            Macro-level skill telemetry, departmental heatmaps, and predictive AI training planning for 1,240+ Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS) officers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              switchRole('LEARNER');
              navigate('dashboard');
            }}
            className="px-4 py-2.5 rounded bg-[#161616] hover:bg-[#222222] border border-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            ← Switch to Learner View
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-[#D8FE41] hover:bg-[#c4eb34] text-black text-xs font-mono font-black uppercase tracking-wider shadow-[0_0_12px_rgba(216,254,65,0.3)] transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cadre Audit Report</span>
          </button>
        </div>
      </div>

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Total Statistical Cadre Tracked
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">1,248</span>
            <span className="text-xs font-mono text-[#D8FE41]">Across 5 Divisions</span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            Active digital twins synced with iGOT Karmayogi Bharat
          </p>
        </div>

        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Cadre Average Readiness
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-[#D8FE41]">74.8%</span>
            <span className="text-xs font-mono text-[#D8FE41]">+5.2% QoQ</span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            MoSPI Benchmark Target: 80% by Q4 2026
          </p>
        </div>

        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Critical Skill Gaps Identified
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-rose-400">142</span>
            <span className="text-xs font-mono text-rose-300">Requires Intervention</span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            Top concentration: DPDP Act Compliance & Python Microdata
          </p>
        </div>

        <div className="bg-[#121212] border border-[#222222] p-6 space-y-2">
          <p className="text-[11px] font-mono font-bold uppercase text-[#888888] tracking-wider">
            Training ROI & Gain Ratio
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-display text-white">3.4x</span>
            <span className="text-xs font-mono text-[#D8FE41]">High Efficacy</span>
          </div>
          <p className="text-[11px] font-mono text-[#777777]">
            +7.8% score boost per 10 hours completed on NSSTA courses
          </p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#222222] overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Workforce Overview', icon: Users },
          { id: 'heatmap', label: 'Division Competency Heatmap', icon: Flame },
          { id: 'predictive', label: 'Predictive Skill Demand', icon: BrainCircuit },
          { id: 'planner', label: 'AI Training Planner', icon: CalendarDays },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-[#D8FE41] text-[#D8FE41] bg-[#121212]'
                  : 'border-transparent text-[#888888] hover:text-white hover:bg-[#0f0f0f]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Workforce Overview & Macro Insights */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Division Breakdown Card */}
            <div className="lg:col-span-8 bg-[#121212] border border-[#222222] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222222] pb-4 gap-2">
                <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D8FE41]" />
                  <span>Division-Level Statistical Capacity Index</span>
                </h2>
                <span className="text-[11px] font-mono text-[#888888]">
                  Updated Live from MoSPI Cadre DB
                </span>
              </div>

              <div className="space-y-4">
                {departmentHeatmapData.map((dept) => (
                  <div key={dept.department} className="p-4 bg-[#161616] border border-[#262626] space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono font-bold text-white">{dept.department}</p>
                        <p className="text-[11px] font-mono text-[#888888]">
                          {dept.totalStaff} Officers Enrolled
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-mono font-black text-[#D8FE41]">
                          {dept.readinessScore}%
                        </span>
                        <p className="text-[10px] font-mono text-[#888888] uppercase">Readiness Index</p>
                      </div>
                    </div>

                    <div className="w-full bg-[#202020] h-2">
                      <div
                        className="bg-[#D8FE41] h-full"
                        style={{ width: `${dept.readinessScore}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono">
                      {dept.scores.map((sc) => (
                        <span
                          key={sc.competency}
                          className={`px-2 py-0.5 border ${
                            sc.gapSeverity === 'Critical'
                              ? 'border-rose-900/60 bg-rose-950/40 text-rose-300'
                              : sc.gapSeverity === 'Moderate'
                              ? 'border-amber-900/60 bg-amber-950/40 text-amber-300'
                              : 'border-[#333333] bg-[#1a1a1a] text-[#888888]'
                          }`}
                        >
                          {sc.competency.slice(0, 18)}...: <strong className="text-white">{sc.score}%</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: AI Priority Alerts */}
            <div className="lg:col-span-4 bg-[#121212] border border-[#222222] p-6 space-y-5">
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2 border-b border-[#222222] pb-4">
                <AlertTriangle className="w-4 h-4 text-[#D8FE41]" />
                <span>Urgent Cadre Recommendations</span>
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 bg-rose-950/20 border border-rose-900/50 space-y-1.5">
                  <p className="text-rose-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                    <span>Critical Alert: DPDP Act 2023</span>
                  </p>
                  <p className="text-[#cccccc] text-[11px] leading-relaxed">
                    124 Field Officers in FOD lack mandatory statutory compliance certification on personal data handling.
                  </p>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="mt-2 text-[10px] font-bold text-[#D8FE41] underline uppercase"
                  >
                    Schedule Targeted NSSTA Cohort →
                  </button>
                </div>

                <div className="p-3.5 bg-amber-950/20 border border-amber-900/50 space-y-1.5">
                  <p className="text-amber-300 font-bold uppercase text-[11px]">
                    Emerging Gap: Python Microdata Analysis
                  </p>
                  <p className="text-[#cccccc] text-[11px] leading-relaxed">
                    SDRD officers transitioning from SPSS/STATA require Python & Polars automated validation pipelines.
                  </p>
                </div>

                <div className="p-3.5 bg-[#161616] border border-[#2a2a2a] space-y-1.5">
                  <p className="text-[#D8FE41] font-bold uppercase text-[11px]">
                    Success: 78th Round Sampling
                  </p>
                  <p className="text-[#aaaaaa] text-[11px] leading-relaxed">
                    91% of SDRD senior statistical officers successfully certified on circular systematic sampling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Full Division Competency Heatmap */}
      {activeTab === 'heatmap' && (
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222222] pb-4 gap-3">
            <div>
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#D8FE41]" />
                <span>Division Competency Gap Matrix</span>
              </h2>
              <p className="text-xs font-mono text-[#888888] mt-0.5">
                Red indicates critical training deficit (&lt;65%). Green indicates benchmark compliance (&gt;80%).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#888888]">Filter:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-[#181818] border border-[#333333] text-white p-2 font-mono text-xs focus:border-[#D8FE41] focus:outline-none"
              >
                <option value="All">All MoSPI Divisions</option>
                <option value="SDRD">SDRD (Survey Design)</option>
                <option value="FOD">FOD (Field Operations)</option>
                <option value="CPD">CPD (Coordination)</option>
                <option value="ESD">ESD (Economic Statistics)</option>
                <option value="NAD">NAD (National Accounts)</option>
              </select>
            </div>
          </div>

          {/* Matrix Grid */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#222222] text-[#888888] uppercase text-[10px] tracking-wider">
                  <th className="p-3 bg-[#161616]">Division / Cadre</th>
                  <th className="p-3 bg-[#161616]">Staff</th>
                  <th className="p-3 bg-[#161616]">Readiness</th>
                  <th className="p-3 bg-[#161616]">Survey Sampling</th>
                  <th className="p-3 bg-[#161616]">Python Analytics</th>
                  <th className="p-3 bg-[#161616]">DPDP Act 2023</th>
                  <th className="p-3 bg-[#161616]">SDMX & Meta</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {filteredHeatmap.map((dept) => (
                  <tr key={dept.department} className="hover:bg-[#181818] transition-colors">
                    <td className="p-3 font-bold text-white max-w-[200px]">
                      {dept.department}
                    </td>
                    <td className="p-3 text-[#aaaaaa]">{dept.totalStaff}</td>
                    <td className="p-3 font-black text-[#D8FE41]">
                      {dept.readinessScore}%
                    </td>
                    {dept.scores.map((s, idx) => (
                      <td key={idx} className="p-3">
                        <div
                          className={`p-2 border text-center font-bold text-xs ${
                            s.gapSeverity === 'Critical'
                              ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                              : s.gapSeverity === 'Moderate'
                              ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                              : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                          }`}
                        >
                          <span>{s.score}%</span>
                          <span className="block text-[9px] font-normal opacity-80">
                            {s.staffAffected} at risk
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Predictive Skill Demand Forecast */}
      {activeTab === 'predictive' && (
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222222] pb-4 gap-3">
            <div>
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#D8FE41]" />
                <span>AI Predictive Skill Demand (2026 - 2028 Horizon)</span>
              </h2>
              <p className="text-xs font-mono text-[#888888] mt-0.5">
                Machine learning forecast based on new statutory mandates, UN statistical guidelines, and census modernisation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveSkillItems.map((item) => (
              <div key={item.skill} className="p-5 bg-[#151515] border border-[#262626] space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        item.urgency === 'High'
                          ? 'border-rose-800 text-rose-300 bg-rose-950/30'
                          : 'border-amber-800 text-amber-300 bg-amber-950/30'
                      }`}
                    >
                      {item.urgency} Urgency
                    </span>
                    <h3 className="text-sm font-mono font-bold text-white mt-1.5">
                      {item.skill}
                    </h3>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-xl font-black text-[#D8FE41]">
                      +{item.projectedGrowth}%
                    </span>
                    <p className="text-[10px] text-[#888888] uppercase">Growth Demand</p>
                  </div>
                </div>

                <div className="p-3 bg-[#0d0d0d] border border-[#202020] text-xs font-mono text-[#aaaaaa]">
                  <p className="text-[#888888] uppercase text-[10px] font-bold">Policy & Methodological Drivers:</p>
                  <p className="text-white mt-0.5 leading-relaxed">{item.drivers}</p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#888888]">
                  <span>Target Officers to Certify: <strong className="text-white">{item.targetOfficers}</strong></span>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="text-[#D8FE41] hover:underline font-bold text-[11px] uppercase"
                  >
                    Generate NSSTA Cohort →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: AI Training Planner */}
      {activeTab === 'planner' && (
        <div className="bg-[#121212] border border-[#222222] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222222] pb-4 gap-3">
            <div>
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-[#D8FE41]" />
                <span>AI Automated Training Cohort Planner</span>
              </h2>
              <p className="text-xs font-mono text-[#888888] mt-0.5">
                Automatically bundle officers with matching competency deficits into targeted NSSTA workshops and iGOT mandatory tracks.
              </p>
            </div>

            <button
              onClick={() => alert('New training cohort created and scheduled on NSSTA Training Portal.')}
              className="px-4 py-2 bg-[#D8FE41] hover:bg-[#c4eb34] text-black font-mono text-xs font-black uppercase tracking-wider shadow-[0_0_12px_rgba(216,254,65,0.3)]"
            >
              + Create New NSSTA Cohort
            </button>
          </div>

          <div className="space-y-4 font-mono">
            {[
              {
                title: 'DPDP Act 2023 & Anonymization Workshop for Field Staff',
                targetDivision: 'FOD (Field Operations)',
                cadreCount: 84,
                dates: 'Nov 12 - Nov 16, 2026',
                format: 'Hybrid (NSSTA TPAC + iGOT Virtual)',
                status: 'Scheduled',
              },
              {
                title: 'NSSO 79th Round Advanced Sampling Calibration Masterclass',
                targetDivision: 'SDRD (Survey Design & Research)',
                cadreCount: 46,
                dates: 'Dec 02 - Dec 06, 2026',
                format: 'In-Person (NSSTA Greater Noida)',
                status: 'Enrollment Open',
              },
              {
                title: 'Python, Polars & Microdata Quality Control Pipelines',
                targetDivision: 'ESD & NAD',
                cadreCount: 62,
                dates: 'Dec 15 - Dec 22, 2026',
                format: 'iGOT Karmayogi Self-Paced Track',
                status: 'Draft Proposal',
              },
            ].map((cohort, cIdx) => (
              <div key={cIdx} className="p-4 bg-[#151515] border border-[#252525] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#D8FE41]/10 border border-[#D8FE41]/40 text-[#D8FE41] text-[10px] font-bold uppercase">
                      {cohort.status}
                    </span>
                    <span className="text-xs text-[#888888]">{cohort.targetDivision}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{cohort.title}</h3>
                  <p className="text-[11px] text-[#888888]">
                    {cohort.cadreCount} Officers Assigned • {cohort.dates} • {cohort.format}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => alert(`Reviewing roster for ${cohort.title}`)}
                    className="px-3 py-1.5 bg-[#202020] hover:bg-[#303030] text-white text-xs font-bold uppercase border border-[#333333]"
                  >
                    View Roster
                  </button>
                  <button
                    onClick={() => alert(`Broadcasted notifications to ${cohort.cadreCount} officers.`)}
                    className="px-3 py-1.5 bg-[#D8FE41] hover:bg-[#c4eb34] text-black text-xs font-black uppercase"
                  >
                    Notify Cadre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
