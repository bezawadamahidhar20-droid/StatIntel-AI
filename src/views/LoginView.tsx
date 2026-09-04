import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Shield,
  BookOpen,
  User,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { loginAsStudent, loginAsAdmin, navigate } = useApp();
  const [mode, setMode] = useState<'demo' | 'login' | 'admin'>('demo');

  // Student Registration Form
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('3rd Year (Semester 5-6)');
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [email, setEmail] = useState('');

  // Student Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Passcode
  const [passcode, setPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent({
      name: name.trim() || 'Student Scholar',
      college: college.trim() || 'University',
      degree: degree.trim() || 'Degree Program',
      year,
      targetRole,
      email: email.trim(),
    });
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const extractedName = loginEmail.includes('@')
      ? loginEmail.split('@')[0].replace(/[._-]/g, ' ')
      : loginEmail;
    const capitalizedName = extractedName
      ? extractedName
          .split(' ')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      : 'Student Scholar';

    loginAsStudent({
      name: capitalizedName,
      college: 'University / Institute',
      degree: 'Degree Program',
      year: 'Undergraduate',
      targetRole: 'Data Analyst',
      email: loginEmail.trim(),
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const ok = loginAsAdmin(passcode);
    if (!ok) {
      setAdminError('Invalid passcode. Use "admin2026" for SIH evaluation.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-800">
      {/* Top Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-900 text-amber-400 font-bold text-xl mb-3 shadow-md border border-blue-800">
          <GraduationCap className="w-8 h-8 text-amber-400" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-800 mb-2">
          <span>Student Statistical Intelligence & Competency Benchmark</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          StatIntel AI
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Benchmarked against National MoSPI Curricula & Data Science Standards
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-6 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('demo');
                setAdminError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'demo' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Student Registration</span>
            </button>

            <button
              onClick={() => {
                setMode('login');
                setAdminError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Student Sign In</span>
            </button>

            <button
              onClick={() => {
                setMode('admin');
                setAdminError('');
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'admin' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-blue-600" />
              <span>Faculty Admin</span>
            </button>
          </div>

          {/* MODE 1: Demo New Student */}
          {mode === 'demo' && (
            <form onSubmit={handleDemoSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email / Roll ID
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    College / University *
                  </label>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Degree / Branch *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Year *
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
                    <option value="Postgraduate (Year 1)">Postgraduate (Year 1)</option>
                    <option value="Postgraduate (Year 2)">Postgraduate (Year 2)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Career Goal *
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Data Scientist & Statistical Analyst">Data Scientist & Statistical Analyst</option>
                    <option value="National Statistical Service (ISS / MoSPI) Aspirant">National Statistical Service (ISS / MoSPI) Aspirant</option>
                    <option value="Survey Sampling & Econometric Researcher">Survey Sampling & Econometric Researcher</option>
                  </select>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Launch Student Skill Intelligence & Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* MODE 2: Student Sign In */}
          {mode === 'login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Student Email or Roll Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
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
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <span>Sign In to Student Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* MODE 3: Faculty Admin */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Faculty / Institutional Admin Passcode Gate</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Restricted to University Deans, Faculty Advisors, and MoSPI Academy heads.
                </p>
              </div>

              {adminError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Admin Passcode / Security Key *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin passcode..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
                  <span className="font-semibold text-blue-700">SIH Evaluator Master Passcode:</span>
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
                <span>Verify & Enter Faculty Portal</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => navigate('landing')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              ← Return to Public Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
