import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu,
  BrainCircuit,
  KeyRound,
  Shield,
  Clock,
  Award,
  Layers,
  HelpCircle,
  Search,
  BookMarked,
  Check,
  Plus,
  Bot,
  Loader2,
  X,
  Code2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  geminiService,
  ROLE_SKILL_BENCHMARKS,
  CURATED_BOOKS,
  CareerGuidanceResult,
} from '../../services/geminiService';
import { groqService } from '../../services/groqService';

const ROLE_CATEGORIES: { [cat: string]: string[] } = {
  'All (20)': Object.keys(ROLE_SKILL_BENCHMARKS),
  'Web & Mobile': [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile App Developer (iOS & Android)',
    'UI/UX & Product Engineer',
  ],
  'Data & AI': [
    'Data Analyst',
    'Data Scientist',
    'Machine Learning Engineer',
    'AI & Deep Learning Specialist',
    'Data Engineer (Big Data & ETL)',
    'Computer Vision Engineer',
    'NLP & Conversational AI Engineer',
  ],
  'Cloud & DevOps': [
    'DevOps Engineer',
    'Cloud Solutions Architect',
    'Site Reliability Engineer (SRE)',
    'Database Administrator & SQL Architect',
    'Software QA & Test Automation Engineer',
  ],
  'Systems & Security': [
    'Cybersecurity Analyst & Ethical Hacker',
    'Systems & Embedded Software Engineer',
    'Blockchain & Web3 Developer',
  ],
};

export const StudentSkillProfiler: React.FC = () => {
  const {
    currentUser,
    userSkills,
    setUserSkills,
    targetCareerRole,
    setTargetCareerRole,
    geminiApiKey,
    setGeminiApiKey,
    navigate,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All (20)');
  const [selectedRole, setSelectedRole] = useState<string>(targetCareerRole || 'Frontend Developer');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills || []);
  const [guidance, setGuidance] = useState<CareerGuidanceResult | null>(null);

  // Groq AI Scanner State
  const [groqInputText, setGroqInputText] = useState('');
  const [isGroqScanning, setIsGroqScanning] = useState(false);
  const [groqScanMessage, setGroqScanMessage] = useState('');

  // Gemini Career Search State
  const [apiKeyInput, setApiKeyInput] = useState<string>(geminiApiKey || '');
  const [apiKeySaved, setApiKeySaved] = useState<boolean>(false);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiAdviceText, setAiAdviceText] = useState<string>('');

  useEffect(() => {
    setSelectedSkills(userSkills || []);
  }, [userSkills]);

  useEffect(() => {
    if (targetCareerRole) {
      setSelectedRole(targetCareerRole);
    }
  }, [targetCareerRole]);

  // Re-calculate guidance whenever role or skills change
  useEffect(() => {
    let isMounted = true;
    async function updateGuidance() {
      const res = await geminiService.getCareerRoadmapGuidance(selectedRole, selectedSkills, geminiApiKey);
      if (isMounted) {
        setGuidance(res);
        setAiAdviceText(res.aiAdvice);
      }
    }
    updateGuidance();
    return () => {
      isMounted = false;
    };
  }, [selectedRole, selectedSkills]);

  const toggleSkill = (skillName: string) => {
    let updated: string[];
    if (selectedSkills.includes(skillName)) {
      updated = selectedSkills.filter((s) => s !== skillName);
    } else {
      updated = [...selectedSkills, skillName];
    }
    setSelectedSkills(updated);
    setUserSkills(updated);
    localStorage.setItem('statintel_skills', JSON.stringify(updated));
  };

  const removeSkill = (skillName: string) => {
    const updated = selectedSkills.filter((s) => s !== skillName);
    setSelectedSkills(updated);
    setUserSkills(updated);
    localStorage.setItem('statintel_skills', JSON.stringify(updated));
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setTargetCareerRole(role);
    localStorage.setItem('statintel_target_role', role);
  };

  const handleScanWithGroq = async () => {
    if (!groqInputText.trim()) return;
    setIsGroqScanning(true);
    setGroqScanMessage('');

    try {
      const benchmark = ROLE_SKILL_BENCHMARKS[selectedRole];
      const targetSkills = benchmark ? benchmark.allSkills.map((s) => s.name) : undefined;
      const res = await groqService.identifySkills(groqInputText, targetSkills);

      if (res.skills && res.skills.length > 0) {
        const merged = Array.from(new Set([...selectedSkills, ...res.skills]));
        setSelectedSkills(merged);
        setUserSkills(merged);
        localStorage.setItem('statintel_skills', JSON.stringify(merged));
        setGroqScanMessage(`🎉 Groq AI detected ${res.skills.length} skills and updated your readiness score!`);
        setGroqInputText('');
      } else {
        setGroqScanMessage('No technical skills detected. Try entering specific technologies like "React, Python, Docker".');
      }
    } catch (err) {
      setGroqScanMessage('Groq scanner error. Please try again.');
    } finally {
      setIsGroqScanning(false);
      setTimeout(() => setGroqScanMessage(''), 4500);
    }
  };

  const handleSaveApiKey = () => {
    geminiService.setApiKey(apiKeyInput);
    setGeminiApiKey(apiKeyInput);
    setApiKeySaved(true);
    setTimeout(() => setApiKeySaved(false), 2500);
  };

  const handleAskGemini = async () => {
    setLoadingAi(true);
    const res = await geminiService.getCareerRoadmapGuidance(selectedRole, selectedSkills, apiKeyInput || geminiApiKey);
    setAiAdviceText(res.aiAdvice);
    setLoadingAi(false);
  };

  const activeBenchmark = ROLE_SKILL_BENCHMARKS[selectedRole] || ROLE_SKILL_BENCHMARKS['Frontend Developer'];
  const visibleRoles = ROLE_CATEGORIES[selectedCategory] || Object.keys(ROLE_SKILL_BENCHMARKS);

  // Filter curated books that match the selected role or show all if general
  const filteredBooks = CURATED_BOOKS.filter((b) =>
    b.roles.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()) || selectedRole.toLowerCase().includes(r.toLowerCase()))
  );
  const displayBooks = filteredBooks.length > 0 ? filteredBooks : CURATED_BOOKS.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Role Selection & Readiness Gauge */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-blue-950 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden border border-blue-800/40">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>20 Software Roles • Groq AI Skill Identification Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2 flex-wrap">
              <span>Target Role:</span>
              <span className="text-amber-300 underline decoration-amber-400/50 underline-offset-4">
                {selectedRole}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
              {activeBenchmark.description}
            </p>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 text-xs">
              <span className="text-blue-300 font-semibold mr-1">Category:</span>
              {Object.keys(ROLE_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'bg-white/10 hover:bg-white/20 text-blue-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Target Role Selector Tabs */}
            <div className="flex flex-wrap gap-1.5 pt-1 max-h-36 overflow-y-auto pr-1">
              {visibleRoles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-102 active:scale-98 ${
                    selectedRole === role
                      ? 'bg-white text-blue-950 font-bold shadow-md ring-2 ring-amber-400'
                      : 'bg-white/10 hover:bg-white/20 text-blue-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Readiness Score Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl text-center shrink-0 min-w-[200px] shadow-inner">
            <p className="text-xs uppercase font-bold text-blue-200 tracking-wider">Role Readiness</p>
            <div className="relative inline-flex items-center justify-center my-1.5">
              <span className="text-5xl font-black text-white tracking-tight">
                {guidance?.readinessScore || 0}%
              </span>
            </div>
            <p className="text-xs text-emerald-300 font-semibold">
              {selectedSkills.length} of {activeBenchmark.allSkills.length} Skills Mastered
            </p>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-linear-to-r from-amber-400 to-emerald-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, guidance?.readinessScore || 0)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: GROQ AI SKILL SCANNER */}
      <div className="p-6 rounded-2xl bg-linear-to-br from-indigo-50/80 via-white to-blue-50/50 border border-indigo-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Groq AI Skill Identifier & Matcher</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-100 text-indigo-800 font-bold">
                  Groq Ultra-Fast API
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Type or paste your technical background, code projects, or bullet points — Groq AI will instantly extract your skills.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200 px-3 py-1 rounded-full shadow-2xs">
            {selectedSkills.length} Active Skills
          </span>
        </div>

        {/* Input Textarea & Scan Button */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <textarea
            rows={2}
            value={groqInputText}
            onChange={(e) => setGroqInputText(e.target.value)}
            placeholder="Type your skills or paste a project summary (e.g. 'I developed a full-stack dashboard using React, Tailwind CSS, TypeScript, FastAPI backend with PostgreSQL, and deployed with Docker on AWS')"
            className="flex-1 p-3 border border-indigo-200 rounded-xl text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-600 shadow-2xs resize-none"
          />
          <button
            type="button"
            onClick={handleScanWithGroq}
            disabled={isGroqScanning || !groqInputText.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all shrink-0 hover:scale-102 active:scale-98"
          >
            {isGroqScanning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Scanning with Groq AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Analyze with Groq AI</span>
              </>
            )}
          </button>
        </div>

        {groqScanMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{groqScanMessage}</span>
          </div>
        )}

        {/* Active Skills Badges */}
        {selectedSkills.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Currently Identified Skills:</span>
              <button
                onClick={() => {
                  setSelectedSkills([]);
                  setUserSkills([]);
                  localStorage.removeItem('statintel_skills');
                }}
                className="text-[11px] text-rose-600 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-xs transition-all hover:bg-indigo-700 hover:scale-102"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="p-0.5 hover:bg-white/20 rounded-full text-white/80 hover:text-white transition-colors"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Role Benchmark Checklist */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>Core Skills for {selectedRole}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any skill card to toggle your mastery and immediately update your readiness score.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {selectedSkills.filter((s) => activeBenchmark.allSkills.some((b) => b.name === s)).length} of {activeBenchmark.allSkills.length} benchmarked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeBenchmark.allSkills.map((skill) => {
            const isKnown = selectedSkills.some(
              (s) => s.toLowerCase() === skill.name.toLowerCase() || skill.name.toLowerCase().includes(s.toLowerCase())
            );
            return (
              <div
                key={skill.id}
                onClick={() => toggleSkill(skill.name)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between hover:scale-102 active:scale-98 ${
                  isKnown
                    ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                    {skill.category}
                  </span>
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isKnown ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {isKnown ? <Check className="w-3 h-3 stroke-[3]" /> : <Plus className="w-3 h-3" />}
                  </span>
                </div>

                <div className="mt-2.5">
                  <p className={`text-xs font-bold ${isKnown ? 'text-emerald-950' : 'text-slate-900'}`}>
                    {skill.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                    {skill.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Dynamic Roadmap & AI Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: What to Learn Next */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Step-by-Step Learning Roadmap for {selectedRole}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prioritized sequence of missing competencies required to reach 100% role readiness.
            </p>
          </div>

          {guidance?.skillsToLearn && guidance.skillsToLearn.length > 0 ? (
            <div className="space-y-3">
              {guidance.skillsToLearn.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-all flex items-start justify-between gap-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-bold text-slate-900">{st.name}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          st.importance === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {st.importance} Priority
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 pl-7">{st.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      ~{st.estimatedHours} hrs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="font-bold text-sm">Congratulations! 100% Skills Mastered!</p>
              <p className="text-xs text-emerald-700 mt-1">
                You have selected all core foundational competencies for {selectedRole}. Proceed to Grounded Assessments to certify your mastery.
              </p>
            </div>
          )}

          {/* Direct CTA to AI Quiz */}
          <div className="pt-2">
            <button
              onClick={() => navigate('quiz-generator')}
              className="w-full py-3 px-4 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-101 active:scale-99"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Practice & Validate Skills in AI Quiz Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: AI Career Advisor */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-500" />
              <span>2026 Industry Career Intelligence</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live AI analysis of what hiring managers look for in {selectedRole}.
            </p>
          </div>

          {/* AI Response Box */}
          <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-xs text-slate-800 space-y-2">
            <div className="flex items-center justify-between text-indigo-800 font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Hiring & Competency Guidance</span>
              </span>
              {loadingAi && <span className="text-blue-600 animate-pulse">Analyzing...</span>}
            </div>
            <p className="leading-relaxed text-slate-700 font-normal">
              {aiAdviceText}
            </p>
          </div>

          {/* API Key Configuration Input */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Google Gemini API Key (Optional)</span>
              </label>
              <span className="text-[10px] text-slate-400">Stored locally</span>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste Gemini API key (AIzaSy...)"
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Save
              </button>
            </div>

            {apiKeySaved && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> API Key saved successfully!
              </p>
            )}

            <button
              type="button"
              onClick={handleAskGemini}
              disabled={loadingAi}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Search 2026 Job Requirements with AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: Curated Book Recommendations */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>Recommended Master Textbooks & Reading Plan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Industry-standard literature prescribed by senior engineering leaders.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Curated for <strong className="text-slate-900">{selectedRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayBooks.map((book) => (
            <div
              key={book.id}
              className="rounded-2xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all overflow-hidden flex flex-col hover:scale-101"
            >
              {/* Book Spine / Header */}
              <div className={`p-4 bg-linear-to-r ${book.coverColor} text-white space-y-1`}>
                <span className="px-2 py-0.5 bg-black/25 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {book.level}
                </span>
                <h4 className="font-bold text-sm leading-snug">{book.title}</h4>
                <p className="text-xs text-white/90">by {book.author}</p>
              </div>

              {/* Book Details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 text-xs">
                <p className="text-slate-600 leading-relaxed font-normal">
                  {book.summary}
                </p>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Key Reading Chapters</p>
                  <p className="text-xs font-semibold text-slate-800 mt-0.5">{book.keyChapters}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

