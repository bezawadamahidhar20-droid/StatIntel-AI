import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  Shield,
  BookOpen,
  Building,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginAsStudent,
    loginAsAdmin,
    isAuthenticated,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'admin'>('demo');

  // Demo New Student Form State
  const [name, setName] = useState('Aarav Sharma');
  const [college, setCollege] = useState('Department of Statistics, University of Delhi');
  const [degree, setDegree] = useState('B.Sc (Hons) Statistics & Data Analytics');
  const [year, setYear] = useState('Final Year (Semester 6)');
  const [targetRole, setTargetRole] = useState('Data Scientist & Statistical Analyst');
  const [email, setEmail] = useState('aarav.sharma@du.ac.in');

  // Student Login State
  const [loginEmail, setLoginEmail] = useState('aarav.sharma@du.ac.in');
  const [loginPassword, setLoginPassword] = useState('••••••••••••');

  // Admin Passcode State
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent({
      name,
      college,
      degree,
      year,
      targetRole,
      email,
    });
  };

  const handleQuickStudentLogin = () => {
    loginAsStudent({
      name: 'Aarav Sharma',
      college: 'Department of Statistics, University of Delhi',
      degree: 'B.Sc (Hons) Statistics & Data Analytics',
      year: 'Final Year (Semester 6)',
      targetRole: 'Data Scientist & Statistical Analyst',
      email: 'aarav.sharma@du.ac.in',
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const success = loginAsAdmin(adminPasscode);
    if (!success) {
      setAdminError('Invalid Institutional Admin Passcode. Use "admin2026" for SIH evaluation.');
    }
  };

  const handlePrefillDemo = () => {
    setName('Priya Patel');
    setCollege('Indian Statistical Institute (ISI), Kolkata');
    setDegree('M.Sc Applied Statistics & Machine Learning');
    setYear('Postgraduate (Year 2)');
    setTargetRole('National Statistical Service (ISS) & Policy Analyst');
    setEmail('priya.patel@isical.ac.in');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>Student Statistical Competency Intelligence Platform</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Welcome to StatIntel AI
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-lg">
            Test and benchmark your statistical skills against official National MoSPI & Data Science industry standards.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-b border-white/15 pb-0 text-xs">
            <button
              onClick={() => {
                setActiveTab('demo');
                setAdminError('');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'border-amber-400 text-white font-bold'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Demo New Student</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('login');
                setAdminError('');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'login'
                  ? 'border-amber-400 text-white font-bold'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Sign In</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setAdminError('');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'admin'
                  ? 'border-amber-400 text-white font-bold'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-300" />
              <span>Faculty / Admin Access</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: Demo New Student */}
          {activeTab === 'demo' && (
            <form onSubmit={handleDemoSubmit} className="space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Set Up Your Student Profile & Skill Twin
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide your academic details to synthesize your personalized statistical competency baseline.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handlePrefillDemo}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Fill Sample Student</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Email / Roll ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. aarav.sharma@du.ac.in"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    College / University / Institute *
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. Delhi University / ISI Kolkata / IIT Madras"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Degree Program / Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.Sc Statistics / M.Sc Data Science / B.Tech AI"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Year / Semester *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="1st Year (Semester 1-2)">1st Year (Semester 1-2)</option>
                    <option value="2nd Year (Semester 3-4)">2nd Year (Semester 3-4)</option>
                    <option value="3rd Year (Semester 5-6)">3rd Year (Semester 5-6)</option>
                    <option value="Final Year (Semester 6)">Final Year (Semester 6)</option>
                    <option value="Postgraduate / Masters (Year 1)">Postgraduate / Masters (Year 1)</option>
                    <option value="Postgraduate / Masters (Year 2)">Postgraduate / Masters (Year 2)</option>
                    <option value="Recent Graduate / Aspirant">Recent Graduate / Aspirant</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Career Benchmark / Goal *
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Data Scientist & Statistical Analyst">Data Scientist & Statistical Analyst</option>
                    <option value="National Statistical Service (ISS / MoSPI) Aspirant">National Statistical Service (ISS / MoSPI) Aspirant</option>
                    <option value="Quantitative Risk & Financial Modeling Analyst">Quantitative Risk & Financial Modeling Analyst</option>
                    <option value="Survey Design, Sampling & Socio-Economic Researcher">Survey Design, Sampling & Socio-Economic Researcher</option>
                    <option value="Machine Learning & Applied Econometrician">Machine Learning & Applied Econometrician</option>
                  </select>
                </div>
              </div>

              {/* Information Banner */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  Your profile will be benchmarked against <strong>MoSPI National Statistical Standards</strong>, <strong>NSSO/PLFS sampling methodologies</strong>, and <strong>iGOT Karmayogi learning frameworks</strong>.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Launch Student Skill Intelligence & Digital Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleQuickStudentLogin}
                  className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
                >
                  Quick Student Demo
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Student Sign In */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Registered Student Sign In
                </h3>
                <p className="text-xs text-slate-500">
                  Sign in with your University Student ID or Institutional Email.
                </p>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student ID or Institutional Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="student@university.edu.in"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleQuickStudentLogin}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Sign In as Student (Aarav Sharma)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Faculty / Admin Access */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Institutional Administrator & Faculty Gate</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Protected access for University Deans, Faculty Advisors, and MoSPI Academy Directors.
                </p>
              </div>

              {adminError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{adminError}</span>
                </div>
              )}

              <div className="text-xs space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Faculty Admin Passcode / Security Key *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="Enter admin passcode..."
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                    <span className="font-semibold text-blue-700">SIH Hackathon Evaluator Passcode:</span>
                    <code className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 font-mono font-bold text-slate-900 rounded">
                      admin2026
                    </code>
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Verify Passcode & Enter Faculty Dashboard</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Smart India Hackathon (SIH 2026) Student Competency Evaluation</span>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-blue-600 hover:underline font-semibold"
          >
            Explore Public Platform First
          </button>
        </div>
      </div>
    </div>
  );
};
