import React, { useState } from 'react';
import {
  Shield,
  ShieldCheck,
  Lock,
  FileCheck,
  Server,
  UserCheck,
  Key,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Download,
  Fingerprint,
  Cpu,
  BadgeAlert,
  Building,
} from 'lucide-react';

export const ComplianceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dpdp' | 'certin' | 'meghraj' | 'unfpos' | 'parichay'>('dpdp');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 md:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4" />
              Government Standards & Cybersecurity Compliance (SIH26101 - R10)
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              StatIntel-AI Security & Compliance Trust Center
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Engineered in strict adherence to the Digital Personal Data Protection (DPDP) Act 2023, CERT-In Cyber Security Guidelines, MeitY GI-Cloud (MeghRaj) specifications, and UN Fundamental Principles of Official Statistics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center">
              <div className="text-xl font-bold text-emerald-400">100%</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider">CERT-In Aligned</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10 text-center">
              <div className="text-xl font-bold text-blue-400">Section 8</div>
              <div className="text-[11px] text-slate-300 uppercase tracking-wider">DPDP Compliant</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'dpdp', label: 'DPDP Act 2023', icon: Lock, badge: 'Data Privacy' },
          { id: 'certin', label: 'CERT-In Security', icon: Shield, badge: 'Cybersecurity' },
          { id: 'meghraj', label: 'MeitY MeghRaj Cloud', icon: Server, badge: 'GI-Cloud' },
          { id: 'parichay', label: 'Parichay SSO & RBAC', icon: Key, badge: 'NSSO SSO' },
          { id: 'unfpos', label: 'UN-FPoS Principles', icon: Globe2, badge: 'Official Statistics' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'dpdp' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">DPDP Act 2023 Data Minimization</h3>
                  <p className="text-xs text-slate-500">Adherence to Section 4 & 6: Lawful processing for purpose</p>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Purpose Limitation:</strong> Statistical officer competencies and microdata quiz logs are processed strictly for capacity-building evaluations and role readiness.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Data Anonymization:</strong> PII fields (Aadhaar, employee identifiers) are salted with SHA-256 before assessment scoring calculations.
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Consent Lifecycle:</strong> Clear affirmative consent recorded upon first login via Parichay SSO with right to erase local caching.
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Data Principal Rights (Section 11-14)</h3>
                  <p className="text-xs text-slate-500">Empowering government officials over their learning data</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800">Right to Access</div>
                  <div className="text-slate-500 text-[11px] mt-1">Export full Skill Passport & Assessment logs in PDF/JSON format.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800">Right to Correction</div>
                  <div className="text-slate-500 text-[11px] mt-1">One-click auto-profile re-inferencer to rectify designation and training records.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800">Right to Erasure</div>
                  <div className="text-slate-500 text-[11px] mt-1">Purge quiz practice logs without impacting verified iGOT certifications.</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="font-bold text-slate-800">Grievance Redressal</div>
                  <div className="text-slate-500 text-[11px] mt-1">Automated escalation link to NSSTA Data Protection Officer (DPO).</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certin' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">CERT-In Cybersecurity Directive Guidelines</h3>
                  <p className="text-xs text-slate-500">Compliance with No. 20(3)/2022-CERT-In directions</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                Audit Status: Passed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-900">Mandatory NTP Time Synchronization</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  All backend audit events, quiz submissions, and token handshakes are synchronized with National Physical Laboratory (NPL) NTP servers.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-900">180-Day Secure Log Retention</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Immutable audit trail storing API transaction hashes, authentication sessions, and iGOT sync calls encrypted with AES-256-GCM.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="text-xs font-bold text-slate-900">6-Hour Incident Notification Bridge</div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Automated telemetry monitoring for suspicious role elevation or unauthenticated endpoint probing triggering webhook alerts.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meghraj' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">MeitY GI-Cloud (MeghRaj) Cloud-Ready Architecture</h3>
                <p className="text-xs text-slate-500">Ready for deployment on NIC / National Data Centre (NDC) GI-Cloud infrastructure</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Containerized Microservices
                </div>
                <p className="text-slate-600 leading-relaxed">
                  FastAPI ML backend and Vite/React UI packaged as rootless OCI-compliant containers ready for Kubernetes (K8s) orchestration on MeghRaj.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" /> Data Sovereignty & In-Country Hosting
                </div>
                <p className="text-slate-600 leading-relaxed">
                  100% data residency guaranteed within Indian boundaries (NDC Bhubaneswar / Hyderabad / Pune) with zero offshore egress.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'parichay' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Parichay National SSO & Role-Based Access Control (RBAC)</h3>
                <p className="text-xs text-slate-500">Government single sign-on with multi-factor authentication (MFA)</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl">
                <div className="font-bold text-purple-900">LEARNER Role</div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Individual statistical officer or aspirant accessing personal Digital Twin, adaptive roadmaps, and virtual labs.
                </p>
              </div>
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <div className="font-bold text-blue-900">ADMIN / NSSTA Cadre Manager</div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Directorate access to cadre-wide heatmaps, Kirkpatrick training effectiveness, and predictive capacity analytics.
                </p>
              </div>
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                <div className="font-bold text-emerald-900">TRAINER / Content Author</div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Faculty authoring studio to create grounded MCQs from official documents and YouTube/NSSO lecture videos.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'unfpos' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">UN Fundamental Principles of Official Statistics (UN-FPoS)</h3>
                <p className="text-xs text-slate-500">Adopted by the UN Statistical Commission and Government of India</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">Principle 1 & 2: Relevance, Impartiality & Professional Standards</div>
                <p className="text-slate-600 text-[11px] mt-1">
                  Assessments strictly evaluate methodological competence according to internationally validated standards (SNA 2008, ILO-ICLS, CPI Manual).
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900">Principle 6: Strict Confidentiality of Microdata</div>
                <p className="text-slate-600 text-[11px] mt-1">
                  All Virtual Laboratories utilize synthesized or anonymized unit-level records adhering to MoSPI data dissemination guidelines.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
