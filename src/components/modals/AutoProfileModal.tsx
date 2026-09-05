import React, { useState } from 'react';
import {
  Sparkles,
  UserCheck,
  Building2,
  Briefcase,
  GraduationCap,
  Calendar,
  Layers,
  Award,
  ArrowRight,
  CheckCircle2,
  X,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { inferCompetencyProfile, OfficialProfileInput } from '../../services/autoProfileService';

interface AutoProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_PROFILES: { label: string; data: OfficialProfileInput }[] = [
  {
    label: 'NSSO FOD — Senior Statistical Officer',
    data: {
      name: 'Dr. Rajesh Kumar Sharma',
      designation: 'Senior Statistical Officer (SSO)',
      department: 'NSSO Field Operations Division (FOD)',
      cadre: 'Subordinate Statistical Service (SSS)',
      currentAssignment: 'Supervision of PLFS Round 80 and Annual Survey of Unincorporated Enterprises (ASUSE)',
      education: {
        degree: 'M.Sc. Statistics',
        field: 'Mathematical Statistics & Sample Surveys',
        institution: 'Indian Statistical Institute (ISI), Kolkata',
      },
      experienceYears: 7,
      previousTrainings: [
        'National Accounts & GVA Compilation (NSSTA)',
        'CAPI Tablet Field Data Collection Protocols (NSSO)',
        'iGOT Karmayogi: Code of Ethics in Public Administration',
      ],
      certifications: ['iGOT Sunbird: Sampling Weight Computation', 'ISO 9001 Data Quality Lead Auditor'],
    },
  },
  {
    label: 'CSO ESD — Price & Economic Statistics Officer',
    data: {
      name: 'Pooja Verma, ISS',
      designation: 'Assistant Director (Economic Statistics)',
      department: 'Central Statistics Office — Economic Statistics Division (ESD)',
      cadre: 'Indian Statistical Service (ISS)',
      currentAssignment: 'Revision of Consumer Price Index (CPI) Base Year and Index of Industrial Production (IIP)',
      education: {
        degree: 'M.A. Applied Economics',
        field: 'Econometrics & Time Series Analysis',
        institution: 'Delhi School of Economics (DSE)',
      },
      experienceYears: 4,
      previousTrainings: [
        'Advanced Econometrics in R & SAS (NSSTA)',
        'IMF Price Index Compilation Guidelines (Online)',
        'iGOT Karmayogi: Data Governance & DPDP Act 2023',
      ],
      certifications: ['iGOT Sunbird: Macroeconomic Accounting Essentials'],
    },
  },
  {
    label: 'MoSPI DIID — Data Engineering & IT Specialist',
    data: {
      name: 'Anand Sundaram',
      designation: 'Data Analyst / Junior Statistical Officer',
      department: 'Data Informatics and Innovation Division (DIID)',
      cadre: 'Subordinate Statistical Service (SSS)',
      currentAssignment: 'National Data Warehouse ETL pipelines, API integration, and cloud migration to MeghRaj',
      education: {
        degree: 'B.Tech Computer Science & Statistics',
        field: 'Big Data Systems & Database Architecture',
        institution: 'National Institute of Technology (NIT) Trichy',
      },
      experienceYears: 3,
      previousTrainings: [
        'Python Microdata Analytics (NSSTA)',
        'PostgreSQL & Cloud Databases for e-Governance',
        'CERT-In Cyber Security Hygiene',
      ],
      certifications: ['MeghRaj Cloud Practitioner', 'Python for Statistical Computing'],
    },
  },
];

export const AutoProfileModal: React.FC<AutoProfileModalProps> = ({ isOpen, onClose }) => {
  const { applyInferredProfile, addNotification } = useApp();

  const [formData, setFormData] = useState<OfficialProfileInput>(PRESET_PROFILES[0].data);
  const [trainingInput, setTrainingInput] = useState('');
  const [isInferring, setIsInferring] = useState(false);
  const [previewResult, setPreviewResult] = useState<ReturnType<typeof inferCompetencyProfile> | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof PRESET_PROFILES[0]) => {
    setFormData(preset.data);
    setPreviewResult(null);
  };

  const handleAddTraining = () => {
    if (trainingInput.trim()) {
      setFormData({
        ...formData,
        previousTrainings: [...formData.previousTrainings, trainingInput.trim()],
      });
      setTrainingInput('');
    }
  };

  const handleRemoveTraining = (index: number) => {
    setFormData({
      ...formData,
      previousTrainings: formData.previousTrainings.filter((_, i) => i !== index),
    });
  };

  const handleRunInference = () => {
    setIsInferring(true);
    setTimeout(() => {
      const result = inferCompetencyProfile(formData);
      setPreviewResult(result);
      setIsInferring(false);
    }, 600);
  };

  const handleApplyToTwin = () => {
    if (!previewResult) return;
    if (applyInferredProfile) {
      applyInferredProfile(previewResult, formData);
    }
    addNotification({
      title: 'Digital Twin Updated',
      message: `Competency profile inferred for ${formData.name} (${formData.designation}) across 12 PS competencies.`,
      type: 'achievement',
      linkView: 'digital-twin',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-blue-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">Auto-Create Competency Profile (R1)</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-400/20 border border-blue-400/30 text-blue-200">
                  SIH26101 P0
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-0.5">
                AI baseline derivation from designation, department, assignment, qualifications & previous trainings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              ⚡ Quick Presets (Official Cadres):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {PRESET_PROFILES.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left p-3 rounded-xl border text-xs transition-all ${
                    formData.designation === p.data.designation
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-semibold shadow-sm ring-1 ring-blue-500/30'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className="font-semibold">{p.label}</div>
                  <div className="text-[11px] text-slate-500 font-normal mt-0.5 truncate">{p.data.department}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Official Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Designation & Cadre
              </label>
              <input
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Department / Directorate
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-600" /> Years of Statistical Experience
              </label>
              <input
                type="number"
                min="0"
                max="40"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-blue-600" /> Current Assignment & Responsibilities
              </label>
              <textarea
                rows={2}
                value={formData.currentAssignment}
                onChange={(e) => setFormData({ ...formData, currentAssignment: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Sampling frame design for NSS 80th Round, CAPI tablet data validation..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" /> Educational Qualifications
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Degree (e.g. M.Sc. Statistics)"
                  value={formData.education.degree}
                  onChange={(e) =>
                    setFormData({ ...formData, education: { ...formData.education, degree: e.target.value } })
                  }
                  className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Field of Specialization"
                  value={formData.education.field}
                  onChange={(e) =>
                    setFormData({ ...formData, education: { ...formData.education, field: e.target.value } })
                  }
                  className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Institution / University"
                  value={formData.education.institution}
                  onChange={(e) =>
                    setFormData({ ...formData, education: { ...formData.education, institution: e.target.value } })
                  }
                  className="px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Previous Trainings */}
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <Award className="w-3.5 h-3.5 text-blue-600" /> Previous Trainings & iGOT Karmayogi Courses
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Add training (e.g. National Accounts GVA at NSSTA, SAS Data Analysis)..."
                  value={trainingInput}
                  onChange={(e) => setTrainingInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTraining();
                    }
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTraining}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.previousTrainings.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-full font-medium"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTraining(idx)}
                      className="hover:text-rose-600 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Inference Preview Section */}
          {previewResult && (
            <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/80 border border-indigo-200 rounded-xl p-5 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Inferred Competency Profile Preview</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="text-slate-600">
                    Baseline Score:{' '}
                    <strong className="text-indigo-700 text-sm font-black">{previewResult.overallCompetency}%</strong>
                  </span>
                  <span className="text-slate-600">
                    Role Readiness:{' '}
                    <strong className="text-emerald-700 text-sm font-black">{previewResult.roleReadiness}%</strong>
                  </span>
                  <span className="text-slate-600">
                    Identified Gaps:{' '}
                    <strong className="text-rose-700 text-sm font-black">{previewResult.skillGaps.length}</strong>
                  </span>
                </div>
              </div>

              {/* Rationale Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {previewResult.inferenceRationale.map((r, i) => (
                  <div key={i} className="bg-white/80 border border-indigo-100 p-3 rounded-lg text-xs">
                    <div className="font-bold text-slate-800">{r.factor}</div>
                    <div className="text-emerald-700 font-semibold my-0.5">{r.impact}</div>
                    <div className="text-slate-500 text-[11px] leading-relaxed">{r.details}</div>
                  </div>
                ))}
              </div>

              {/* Inferred Competency Levels Sample */}
              <div className="border-t border-indigo-100 pt-3">
                <label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
                  Taxonomy Mapping (Sample 4 of 12 PS Competencies):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {previewResult.competencies.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-lg"
                    >
                      <div className="truncate mr-2">
                        <div className="font-semibold text-slate-800 truncate">{c.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{c.domain} Pillar</div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-bold text-[11px]">
                          {c.currentLevel} ({c.currentScore}%)
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            c.gap < 0 ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {c.gap < 0 ? `${c.gap}% Gap` : 'Standard Met'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Compliant with MoSPI & iGOT Karmayogi Competency Dictionary
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRunInference}
              disabled={isInferring}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isInferring ? 'animate-spin' : ''}`} />
              {previewResult ? 'Re-infer Competencies' : 'Run Auto-Inference'}
            </button>

            {previewResult && (
              <button
                type="button"
                onClick={handleApplyToTwin}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-2 animate-in zoom-in-95"
              >
                <CheckCircle2 className="w-4 h-4" />
                Apply to Digital Twin
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
