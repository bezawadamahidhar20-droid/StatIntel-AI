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
  Bot,
  Loader2,
  Plus,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { groqService, isTechnicalSoftwareSkill, normalizeSkillName } from '../../services/groqService';
import { ROLE_SKILL_BENCHMARKS } from '../../services/geminiService';

const POPULAR_SKILL_SUGGESTIONS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'SQL',
  'NumPy',
  'Matplotlib',
  'Pandas',
  'Docker',
  'PostgreSQL',
  'Git',
  'Scikit-Learn',
  'PyTorch',
  'AWS',
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

  // Student Registration Form State
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('3rd Year (Semester 5-6)');
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [email, setEmail] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [registerError, setRegisterError] = useState('');

  // Groq AI Skill Input State
  const [aiSkillInput, setAiSkillInput] = useState('');
  const [isDetectingSkills, setIsDetectingSkills] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [groqDetectionMessage, setGroqDetectionMessage] = useState('');

  // Student Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Admin Passcode State
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isAuthModalOpen || isAuthenticated) return null;

  const roleList = Object.keys(ROLE_SKILL_BENCHMARKS);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;

    if (!isTechnicalSoftwareSkill(trimmed)) {
      setGroqDetectionMessage(`"${trimmed}" is a daily personal activity or hobby, not a technical software skill.`);
      setTimeout(() => setGroqDetectionMessage(''), 4500);
      return;
    }

    const norm = normalizeSkillName(trimmed) || trimmed;
    if (!selectedSkills.some((s) => s.toLowerCase() === norm.toLowerCase())) {
      setSelectedSkills((prev) => [...prev.filter(isTechnicalSoftwareSkill), norm]);
      setCustomSkillInput('');
    }
  };

  const handleIdentifySkillsWithGroq = async () => {
    if (!aiSkillInput.trim()) return;
    setIsDetectingSkills(true);
    setGroqDetectionMessage('');

    try {
      const benchmark = ROLE_SKILL_BENCHMARKS[targetRole];
      const targetSkills = benchmark ? benchmark.allSkills.map((s) => s.name) : undefined;
      const result = await groqService.identifySkills(aiSkillInput, targetSkills);

      // Strictly filter technical software skills
      const legitimateSkills = (result.skills || []).filter(isTechnicalSoftwareSkill);

      if (legitimateSkills.length > 0) {
        // Clean previously selected skills and merge new ones
        const cleanedExisting = selectedSkills.filter(isTechnicalSoftwareSkill);
        const updated = Array.from(new Set([...cleanedExisting, ...legitimateSkills]));
        setSelectedSkills(updated);
        setGroqDetectionMessage(`✨ Groq AI identified ${legitimateSkills.length} technical skills!`);
        setAiSkillInput('');
      } else {
        setGroqDetectionMessage('Only personal activities or non-tech terms detected. Please enter technical skills (e.g., Python, React, SQL).');
      }
    } catch (err) {
      setGroqDetectionMessage('Could not extract valid technical skills. Try typing e.g. "Python, Docker, SQL".');
    } finally {
      setIsDetectingSkills(false);
      setTimeout(() => setGroqDetectionMessage(''), 4500);
    }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Software & Statistical Competency Platform</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Welcome to StatIntel AI</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-slate-900">
              20 Software Roles
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
            Choose from 20 industry roles, identify your skills with Groq AI, and get a tailored career roadmap with recommended master books.
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
        <div className="p-6 max-h-[76vh] overflow-y-auto space-y-4">
          {/* TAB 1: Student Registration */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="pb-1 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Create Your Student Profile & Skill Twin
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select your target industry career and enter what you know — Groq AI will benchmark your readiness.
                  </p>
                </div>
              </div>

              {registerError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
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
                    placeholder="e.g. Mahidhar Bezawada"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
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
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Year / Semester *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                  >
                    <option value="1st Year (Semester 1-2)">1st Year (Semester 1-2)</option>
                    <option value="2nd Year (Semester 3-4)">2nd Year (Semester 3-4)</option>
                    <option value="3rd Year (Semester 5-6)">3rd Year (Semester 5-6)</option>
                    <option value="Final Year (Semester 7-8)">Final Year (Semester 7-8)</option>
                    <option value="Postgraduate / Masters (Year 1)">Postgraduate / Masters (Year 1)</option>
                    <option value="Postgraduate / Masters (Year 2)">Postgraduate / Masters (Year 2)</option>
                    <option value="Recent Graduate / Job Seeker">Recent Graduate / Job Seeker</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1 flex items-center justify-between">
                    <span>Target Career Benchmark (20 Roles) *</span>
                    <span className="text-[10px] text-blue-600 font-bold">Industry Standard</span>
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 bg-blue-50/50 rounded-lg text-xs font-semibold text-blue-950 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all shadow-2xs"
                  >
                    {roleList.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SECTION: GROQ AI SKILL IDENTIFIER */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-linear-to-br from-indigo-50/70 via-blue-50/40 to-slate-50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>Groq AI Skill Identifier</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-700 font-semibold">
                          Groq Ultra-Fast
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Type or paste your skills, projects, or background — AI will extract and structure them automatically.
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-indigo-700 self-start sm:self-center bg-indigo-100/70 px-2.5 py-1 rounded-full">
                    {selectedSkills.length} Skills Added
                  </span>
                </div>

                {/* AI Input Textarea + Button */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={aiSkillInput}
                    onChange={(e) => setAiSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleIdentifySkillsWithGroq();
                      }
                    }}
                    placeholder="e.g. I know Python, building APIs with FastAPI, Pandas, React, Docker, and PostgreSQL"
                    className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleIdentifySkillsWithGroq}
                    disabled={isDetectingSkills || !aiSkillInput.trim()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all shrink-0 hover:scale-102 active:scale-98"
                  >
                    {isDetectingSkills ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning with Groq AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Identify with AI</span>
                      </>
                    )}
                  </button>
                </div>

                {groqDetectionMessage && (
                  <p className="text-xs font-semibold text-emerald-700 animate-in fade-in">
                    {groqDetectionMessage}
                  </p>
                )}

                {/* Display Selected / Identified Skills as Interactive Badges */}
                {selectedSkills.length > 0 ? (
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-semibold text-slate-600">Your Identified Skills:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-xs transition-all animate-in zoom-in-95 hover:bg-indigo-700"
                        >
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="p-0.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors ml-0.5"
                            title={`Remove ${skill}`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    No skills identified yet. Type your skills above or click the popular suggestions below:
                  </p>
                )}

                {/* Quick 1-Click Suggestions */}
                <div className="pt-1.5 border-t border-indigo-100 flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="font-semibold text-slate-500 mr-1">Quick Add:</span>
                  {POPULAR_SKILL_SUGGESTIONS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white font-bold shadow-2xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-blue-300'
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
                  className="w-full py-3 px-4 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
                >
                  <span>Register & Launch My Career Roadmap ({targetRole})</span>
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
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
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
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
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
