import React, { useState } from 'react';
import {
  X,
  GraduationCap,
  Sparkles,
  Shield,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const INITIAL_SKILL_OPTIONS = [
  'Python',
  'NumPy',
  'Matplotlib',
  'Pandas',
  'SQL',
  'Scikit-Learn',
  'PyTorch',
  'R Programming',
  'Probability & Inference',
  'Survey Sampling',
];

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    loginAsStudent,
    loginAsAdmin,
    isAuthenticated,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'register' | 'login' | 'admin'>('register');

  // Student Registration Form State (clean, empty defaults)
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('3rd Year (Semester 5-6)');
  const [targetRole, setTargetRole] = useState('Data Analyst');
  const [email, setEmail] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [registerError, setRegisterError] = useState('');

  // Student Sign In State (clean, empty defaults)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Passcode State
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAuthModalOpen || isAuthenticated) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    if (!name.trim()) {
      setRegisterError('Please enter your full name.');
      return;
    }
    if (!college.trim()) {
      setRegisterError('Please enter your college or university.');
      return;
    }
    if (!degree.trim()) {
      setRegisterError('Please enter your degree program.');
      return;
    }

    loginAsStudent({
      name: name.trim(),
      college: college.trim(),
      degree: degree.trim(),
      year,
      targetRole,
      email: email.trim(),
      knownSkills: selectedSkills,
    });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your student email or username.');
      return;
    }

    // Derive student display name from email if needed
    const extractedName = loginEmail.includes('@')
      ? loginEmail.split('@')[0].replace(/[._-]/g, ' ')
      : loginEmail;
    const capitalizedName = extractedName
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    loginAsStudent({
      name: capitalizedName || 'Student Scholar',
      college: 'University / Institute',
      degree: 'Degree Program',
      year: 'Undergraduate',
      targetRole: 'Data Analyst',
      email: loginEmail.trim(),
      knownSkills: selectedSkills.length > 0 ? selectedSkills : ['Python', 'NumPy'],
    });
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const success = loginAsAdmin(adminPasscode);
    if (!success) {
      setAdminError('Invalid Institutional Admin Passcode. Use "admin2026" for evaluation.');
    }
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
            Benchmark your statistical, data science, and machine learning skills with personalized AI roadmaps and adaptive quizzes.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-5 border-b border-white/15 pb-0 text-xs">
            <button
              onClick={() => {
                setActiveTab('register');
                setRegisterError('');
                setLoginError('');
                setAdminError('');
              }}
              className={`pb-2.5 px-3 font-semibold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'register'
                  ? 'border-amber-400 text-white font-bold'
                  : 'border-transparent text-blue-200 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Student Registration</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('login');
                setRegisterError('');
                setLoginError('');
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
                setRegisterError('');
                setLoginError('');
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
          {/* TAB 1: Student Registration */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="pb-1">
                <h3 className="text-sm font-bold text-slate-900">
                  Create Your Student Profile
                </h3>
                <p className="text-xs text-slate-500">
                  Enter your academic information to synthesize your statistical competency digital twin.
                </p>
              </div>

              {registerError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{registerError}</span>
                </div>
              )}

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
                    placeholder="Enter your full name"
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
                    placeholder="student@university.edu"
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
                    placeholder="e.g. IIT Madras / Delhi University / ISI Kolkata"
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
                    placeholder="e.g. B.Tech Computer Science / B.Sc Statistics"
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
                    <option value="Final Year (Semester 7-8)">Final Year (Semester 7-8)</option>
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
                    <option value="Data Analyst">Data Analyst (NumPy, Matplotlib, Pandas, SQL)</option>
                    <option value="Machine Learning Engineer">Machine Learning Engineer (Scikit-Learn, PyTorch, MLOps)</option>
                    <option value="Official Statistical Scientist (MoSPI / ISS)">Statistical Scientist (Inference, Sampling, Econometrics)</option>
                  </select>
                </div>
              </div>

              {/* Interactive Skill Selection */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Skills You Currently Know (Select all that apply):</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {selectedSkills.length} selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {INITIAL_SKILL_OPTIONS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
                          isSelected
                            ? 'bg-blue-600 border-blue-700 text-white shadow-xs'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Register & Launch Student Digital Twin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Student Sign In */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Student Sign In
                </h3>
                <p className="text-xs text-slate-500">
                  Sign in with your University Student Email or Roll ID.
                </p>
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Email or Roll ID *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your student email (e.g. rahul@university.edu)"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
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
              </div>
            </form>
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
                  Protected access for University Deans, Faculty Advisors, and Institutional Directors.
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
                      placeholder="Enter faculty admin passcode..."
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
