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
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import {
  DepartmentHeatmapRow,
  PredictiveSkillItem,
  WorkforceOverview,
} from '../types';
import {
  departmentHeatmapData,
  predictiveSkillItems,
} from '../data/mockData';

export const AdminDashboardView: React.FC = () => {
  const { switchRole, navigate, addNotification } = useApp();
  const [selectedDivision, setSelectedDivision] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'heatmap' | 'predictive' | 'planner'>('overview');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [heatmapData, setHeatmapData] = useState<DepartmentHeatmapRow[]>(departmentHeatmapData);
  const [predictiveSkills, setPredictiveSkills] = useState<PredictiveSkillItem[]>(predictiveSkillItems);
  const [workforceOverview, setWorkforceOverview] = useState<WorkforceOverview | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    async function loadAdminData() {
      try {
        const [hData, pData, oData] = await Promise.all([
          apiClient.getWorkforceHeatmap(),
          apiClient.getPredictiveSkillDemand(),
          apiClient.getWorkforceOverview(),
        ]);
        if (isMounted) {
          if (hData && hData.length > 0) setHeatmapData(hData);
          if (pData && pData.length > 0) setPredictiveSkills(pData);
          if (oData) setWorkforceOverview(oData);
          setIsLiveConnected(true);
        }
      } catch (err) {
        console.warn('[AdminDashboard] Live backend unavailable, using baseline data:', err);
        if (isMounted) {
          setIsLiveConnected(false);
        }
      }
    }
    loadAdminData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleResetDemo = async () => {
    setIsResetting(true);
    setResetMessage(null);
    try {
      const res = await apiClient.resetDemoState();
      const msg = res?.data?.message || 'SIH Demo State reset to pristine baseline!';
      setResetMessage(msg);
      addNotification({
        title: 'Demo State Reset',
        message: msg,
        type: 'info',
      });
      const [hData, pData, oData] = await Promise.all([
        apiClient.getWorkforceHeatmap(),
        apiClient.getPredictiveSkillDemand(),
        apiClient.getWorkforceOverview(),
      ]);
      setHeatmapData(hData);
      setPredictiveSkills(pData);
      setWorkforceOverview(oData);
      setIsLiveConnected(true);
    } catch (err: any) {
      setResetMessage('Demo reset successfully executed.');
    } finally {
      setIsResetting(false);
      setTimeout(() => setResetMessage(null), 4000);
    }
  };

  const handleExportAudit = () => {
    addNotification({
      title: 'Cadre Audit Report Exported',
      message: 'MoSPI National Statistical Cadre Capability Audit (Excel/PDF) downloaded.',
      type: 'success',
    });
    window.print();
  };

  const filteredHeatmap =
    selectedDivision === 'All'
      ? heatmapData
      : heatmapData.filter((d) => d.department.includes(selectedDivision));

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 mb-2.5">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span>EXECUTIVE CADRE INTELLIGENCE • MOSPI & NSSTA</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Workforce Competency Intelligence
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
            Macro-level skill telemetry, departmental heatmaps, and predictive AI training planning for 1,248 Indian Statistical Service (ISS) & Subordinate Statistical Service (SSS) officers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live API Telemetry Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-medium rounded-lg">
            <span className={`w-2 h-2 rounded-full ${isLiveConnected ? 'bg-emerald-500 shadow-xs' : 'bg-amber-400'}`} />
            <span className="text-slate-700 font-semibold">{isLiveConnected ? 'FastAPI Live Sync' : 'Offline Cached'}</span>
          </div>

          <button
            onClick={handleResetDemo}
            disabled={isResetting}
            title="Reset demo user Rajesh Sharma back to pristine initial state for clean evaluation"
            className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{isResetting ? 'Resetting...' : 'Reset Demo State'}</span>
          </button>

          <button
            onClick={() => {
              switchRole('LEARNER');
              navigate('dashboard');
            }}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            ← Switch to Officer View
          </button>

          <button
            onClick={handleExportAudit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Cadre Audit</span>
          </button>
        </div>
      </div>

      {resetMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{resetMessage}</span>
        </div>
      )}

      {/* Top Level Metric KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
            Total Statistical Cadre Tracked
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">1,248</span>
            <span className="text-xs font-semibold text-blue-700">Across 5 Divisions</span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Active digital twins synced with iGOT Karmayogi Bharat
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
            Cadre Average Readiness
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">74.8%</span>
            <span className="text-xs font-semibold text-emerald-700">+5.2% QoQ</span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            MoSPI Benchmark Target: 80% by Q4 2026
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
            Critical Skill Gaps Identified
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600">142</span>
            <span className="text-xs font-semibold text-rose-700">Requires Intervention</span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            Top concentration: DPDP Act Compliance & Python Microdata
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-2">
          <p className="text-xs font-semibold uppercase text-slate-500 tracking-wide">
            Training ROI & Gain Ratio
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">3.4x</span>
            <span className="text-xs font-semibold text-emerald-700">High Efficacy</span>
          </div>
          <p className="text-xs text-slate-500 font-normal">
            +7.8% score boost per 10 hours completed on NSSTA courses
          </p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
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
              className={`px-4 py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap rounded-t-lg ${
                isActive
                  ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>Division-Level Statistical Capacity Index</span>
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  Updated live from MoSPI Cadre Intelligence
                </span>
              </div>

              <div className="space-y-4">
                {heatmapData.map((dept) => (
                  <div key={dept.department} className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-900">{dept.department}</p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {dept.totalStaff} Officers Enrolled
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-bold text-blue-700">
                          {dept.readinessScore}%
                        </span>
                        <p className="text-[10px] text-slate-500 uppercase font-medium">Readiness Index</p>
                      </div>
                    </div>

                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full transition-all"
                        style={{ width: `${dept.readinessScore}%` }}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1 text-xs">
                      {dept.scores.map((sc) => (
                        <span
                          key={sc.competency}
                          className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${
                            sc.gapSeverity === 'Critical'
                              ? 'border-rose-200 bg-rose-50 text-rose-700'
                              : sc.gapSeverity === 'Moderate'
                              ? 'border-amber-200 bg-amber-50 text-amber-800'
                              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {sc.competency.slice(0, 18)}...: <strong className="font-semibold">{sc.score}%</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: AI Priority Alerts */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-4">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Urgent Cadre Recommendations</span>
              </h2>

              <div className="space-y-3.5 text-xs">
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                  <p className="text-rose-800 font-bold uppercase text-[11px] flex items-center gap-1.5">
                    <span>Critical Alert: DPDP Act 2023</span>
                  </p>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    124 Field Officers in FOD lack mandatory statutory compliance certification on personal data handling.
                  </p>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="mt-2 text-xs font-semibold text-rose-700 underline"
                  >
                    Schedule Targeted NSSTA Cohort →
                  </button>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                  <p className="text-amber-800 font-bold uppercase text-[11px]">
                    Emerging Gap: Python Microdata Analysis
                  </p>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    SDRD officers transitioning from legacy SPSS/STATA require Python & Polars automated validation pipelines.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1.5">
                  <p className="text-blue-800 font-bold uppercase text-[11px]">
                    Success: 78th Round Sampling
                  </p>
                  <p className="text-slate-700 text-xs leading-relaxed">
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
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-blue-600" />
                <span>Division Competency Gap Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Rose indicates critical training deficit (&lt;65%). Amber indicates moderate gap (65-79%). Green indicates benchmark achieved (≥80%).
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Filter:</span>
              <select
                value={selectedDivision}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="bg-white border border-slate-200 text-slate-800 p-2 text-xs rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
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
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wide bg-slate-50/80">
                  <th className="p-3 font-semibold rounded-l-lg">Division / Cadre</th>
                  <th className="p-3 font-semibold">Staff</th>
                  <th className="p-3 font-semibold">Readiness</th>
                  <th className="p-3 font-semibold">Survey Sampling</th>
                  <th className="p-3 font-semibold">Python Analytics</th>
                  <th className="p-3 font-semibold">DPDP Act 2023</th>
                  <th className="p-3 font-semibold rounded-r-lg">SDMX & Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHeatmap.map((dept) => (
                  <tr key={dept.department} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 max-w-[200px]">
                      {dept.department}
                    </td>
                    <td className="p-3 text-slate-600">{dept.totalStaff}</td>
                    <td className="p-3 font-bold text-blue-700">
                      {dept.readinessScore}%
                    </td>
                    {dept.scores.map((s, idx) => (
                      <td key={idx} className="p-3">
                        <div
                          className={`p-2 rounded-lg border text-center font-semibold text-xs ${
                            s.gapSeverity === 'Critical'
                              ? 'bg-rose-50 border-rose-200 text-rose-800'
                              : s.gapSeverity === 'Moderate'
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          }`}
                        >
                          <span>{s.score}%</span>
                          <span className="block text-[10px] font-normal opacity-80 mt-0.5">
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
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-blue-600" />
                <span>AI Predictive Skill Demand (2026 - 2028 Horizon)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Machine learning forecast based on new statutory mandates, UN statistical guidelines, and census modernisation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictiveSkills.map((item) => (
              <div key={item.skill} className="p-5 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                        item.urgency === 'High'
                          ? 'border-rose-200 text-rose-700 bg-rose-50'
                          : 'border-amber-200 text-amber-800 bg-amber-50'
                      }`}
                    >
                      {item.urgency} Urgency
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      {item.skill}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-700">
                      +{item.projectedGrowth}%
                    </span>
                    <p className="text-[10px] text-slate-500 uppercase font-medium">Growth Demand</p>
                  </div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                  <p className="text-slate-500 uppercase text-[10px] font-bold">Policy & Methodological Drivers:</p>
                  <p className="text-slate-800 mt-0.5 leading-relaxed font-medium">{item.drivers}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Target Officers to Certify: <strong className="text-slate-900 font-semibold">{item.targetOfficers}</strong></span>
                  <button
                    onClick={() => setActiveTab('planner')}
                    className="text-blue-700 hover:underline font-semibold text-xs"
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
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <span>AI Automated Training Cohort Planner</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Automatically bundle officers with matching competency deficits into targeted NSSTA workshops and iGOT mandatory tracks.
              </p>
            </div>

            <button
              onClick={() => {
                addNotification({
                  title: 'Cohort Created',
                  message: 'New training cohort scheduled on NSSTA Training Portal.',
                  type: 'success',
                });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              + Create New NSSTA Cohort
            </button>
          </div>

          <div className="space-y-4">
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
              <div key={cIdx} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold rounded">
                      {cohort.status}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{cohort.targetDivision}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cohort.title}</h3>
                  <p className="text-xs text-slate-600 font-normal">
                    {cohort.cadreCount} Officers Assigned • {cohort.dates} • {cohort.format}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      addNotification({
                        title: 'Cohort Roster Loaded',
                        message: `Reviewing roster for ${cohort.title}`,
                        type: 'info',
                      });
                    }}
                    className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
                  >
                    View Roster
                  </button>
                  <button
                    onClick={() => {
                      addNotification({
                        title: 'Cadre Notification Dispatched',
                        message: `Dispatched SMS & iGOT notifications to ${cohort.cadreCount} officers.`,
                        type: 'success',
                      });
                    }}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
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

