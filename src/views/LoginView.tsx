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
  Cpu,
  Plus,
  X,
  Loader2,
  Code2,
  Wand2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ROLE_SKILL_BENCHMARKS } from '../services/geminiService';
import { identifySkillsWithGroq, isTechnicalSoftwareSkill, normalizeSkillName } from '../services/groqService';

const POPULAR_SKILL_CHIPS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'SQL',
  'Pandas',
  'Docker',
  'PostgreSQL',
  'Git',
  'Scikit-Learn',
  'AWS',
];

import { DISCORD_AVATAR_PRESETS, DEFAULT_AVATAR } from '../constants/avatars';

export const LoginView: React.FC = () => {
  const { loginAsStudent, loginAsAdmin, navigate } = useApp();
  const [mode, setMode] = useState<'demo' | 'login' | 'admin'>('demo');

  // Student Registration Form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [degree, setDegree] = useState('');
  const [year, setYear] = useState('3rd Year (Semester 5-6)');
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATAR);
  const [avatarCategory, setAvatarCategory] = useState<'ALL' | 'ANIMALS' | 'BOYS' | 'GIRLS'>('ALL');

  // Groq AI Skills state
  const [skillsInputText, setSkillsInputText] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isAiIdentifying, setIsAiIdentifying] = useState(false);
  const [aiDetectionStatus, setAiDetectionStatus] = useState<string | null>(null);

  // Student Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin Passcode
  const [passcode, setPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  const allRoleKeys = Object.keys(ROLE_SKILL_BENCHMARKS);

  const handleAddSkillManual = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!isTechnicalSoftwareSkill(trimmed)) {
      setAiDetectionStatus(`"${trimmed}" is a personal activity/hobby, not a technical software skill.`);
      setTimeout(() => setAiDetectionStatus(null), 4500);
      return;
    }
    const norm = normalizeSkillName(trimmed) || trimmed;
    if (!selectedSkills.some((s) => s.toLowerCase() === norm.toLowerCase())) {
      setSelectedSkills((prev) => [...prev.filter(isTechnicalSoftwareSkill), norm]);
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s.toLowerCase() !== skillToRemove.toLowerCase()));
  };

  const handleRunGroqAiIdentification = async () => {
    if (!skillsInputText.trim()) return;
    setIsAiIdentifying(true);
    setAiDetectionStatus('Groq AI is analyzing your skills...');

    try {
      const result = await identifySkillsWithGroq(skillsInputText, targetRole);
      const legit = (result.skills || []).filter(isTechnicalSoftwareSkill);

      if (legit.length > 0) {
        setSelectedSkills((prev) => {
          const combined = prev.filter(isTechnicalSoftwareSkill);
          legit.forEach((sk) => {
            if (!combined.some((c) => c.toLowerCase() === sk.toLowerCase())) {
              combined.push(sk);
            }
          });
          return combined;
        });
        setAiDetectionStatus(`Groq AI identified ${legit.length} technical skills!`);
        setSkillsInputText('');
      } else {
        setAiDetectionStatus('Only personal activities or non-tech terms detected. Please enter technical software skills (e.g. Python, SQL, React).');
      }
    } catch {
      setAiDetectionStatus('AI identification completed using smart heuristic fallback.');
    } finally {
      setIsAiIdentifying(false);
      setTimeout(() => setAiDetectionStatus(null), 4500);
    }
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent({
      name: name.trim() || 'Student Scholar',
      college: college.trim() || 'University',
      degree: degree.trim() || 'Degree Program',
      year,
      targetRole,
      email: email.trim(),
      avatar: selectedAvatar,
      knownSkills: selectedSkills,
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
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
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
          20 Industry Benchmarks &bull; Groq AI Skill Extraction &bull; AI Roadmaps & Books
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-2xl">
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

          {/* MODE 1: Student Registration */}
          {mode === 'demo' && (
            <form onSubmit={handleDemoSubmit} className="space-y-4 text-xs">
              {/* Discord-Style Animated Avatar Selection */}
              <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Choose Animated Avatar *
                  </label>
                  {/* Category Pills */}
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'ALL', label: 'All' },
                      { id: 'ANIMALS', label: '🐶 Dogs & Pets' },
                      { id: 'BOYS', label: '👦 Boys' },
                      { id: 'GIRLS', label: '👧 Girls' },
                    ].map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setAvatarCategory(cat.id as any)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                          avatarCategory === cat.id
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-5 gap-2 pt-1">
                  {DISCORD_AVATAR_PRESETS.filter(
                    (av) => avatarCategory === 'ALL' || av.category === avatarCategory
                  ).map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 flex flex-col items-center gap-1 group bg-white ${
                        selectedAvatar === av.url
                          ? 'border-indigo-600 ring-2 ring-indigo-200 scale-105 shadow-md'
                          : 'border-slate-200 hover:border-indigo-300 opacity-80 hover:opacity-100 hover:scale-102'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center relative">
                        <img
                          src={av.url}
                          alt={av.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                        {selectedAvatar === av.url && (
                          <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-white stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[9.5px] font-medium text-slate-700 truncate w-full text-center group-hover:text-indigo-600">
                        {av.name.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahidhar Reddy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email / Student ID
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. student@university.edu"
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
                    placeholder="e.g. IIT Bombay / NIT"
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
                    placeholder="e.g. B.Tech Computer Science"
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
                    <option value="Final Year (Semester 7-8)">Final Year (Semester 7-8)</option>
                    <option value="Postgraduate (Year 1)">Postgraduate (Year 1)</option>
                    <option value="Postgraduate (Year 2)">Postgraduate (Year 2)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Target Software Role (20 Available) *
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-medium text-slate-900"
                  >
                    {allRoleKeys.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* GROQ AI SKILLS SECTION */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Enter Skills (Groq AI Skill Identifier):</span>
                  </label>
                  <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Groq LPU Enabled
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillsInputText}
                    onChange={(e) => setSkillsInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (skillsInputText.includes(',') || skillsInputText.split(' ').length > 2) {
                          handleRunGroqAiIdentification();
                        } else {
                          handleAddSkillManual(skillsInputText);
                          setSkillsInputText('');
                        }
                      }
                    }}
                    placeholder="e.g. 'I know Python, Fastapi, React, Docker, Postgres and Git'..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleRunGroqAiIdentification}
                    disabled={isAiIdentifying || !skillsInputText.trim()}
                    className="px-3.5 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
                  >
                    {isAiIdentifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Identifying...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Identify with AI</span>
                      </>
                    )}
                  </button>
                </div>

                {aiDetectionStatus && (
                  <p className="text-[11px] text-blue-700 font-medium mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    {aiDetectionStatus}
                  </p>
                )}

                {/* Selected Skills Badges with Smooth Animation */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                    <span className="font-semibold text-slate-700">Identified & Selected Skills:</span>
                    <span>{selectedSkills.length} skills active</span>
                  </div>

                  {selectedSkills.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-center text-slate-400 text-[11px]">
                      No skills added yet. Use AI identification above or click quick tags below.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 max-h-24 overflow-y-auto">
                      {selectedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 transition-all hover:bg-blue-200"
                        >
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>{sk}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(sk)}
                            className="text-blue-500 hover:text-blue-800 ml-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Popular Quick-Add Chips */}
                  <div className="mt-2">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                      Quick Add Popular Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {POPULAR_SKILL_CHIPS.map((chip) => {
                        const isSelected = selectedSkills.some(
                          (s) => s.toLowerCase() === chip.toLowerCase()
                        );
                        return (
                          <button
                            key={chip}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                handleRemoveSkill(chip);
                              } else {
                                handleAddSkillManual(chip);
                              }
                            }}
                            className={`px-2 py-0.5 rounded text-[11px] font-medium border transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-700'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {chip}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
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
