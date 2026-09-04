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
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  geminiService,
  ROLE_SKILL_BENCHMARKS,
  CURATED_BOOKS,
  CareerGuidanceResult,
} from '../../services/geminiService';

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

  const [selectedRole, setSelectedRole] = useState<string>(targetCareerRole || 'Data Analyst');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(userSkills || []);
  const [guidance, setGuidance] = useState<CareerGuidanceResult | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState<string>(geminiApiKey || '');
  const [apiKeySaved, setApiKeySaved] = useState<boolean>(false);
  const [loadingAi, setLoadingAi] = useState<boolean>(false);
  const [aiAdviceText, setAiAdviceText] = useState<string>('');

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

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    setTargetCareerRole(role);
    localStorage.setItem('statintel_target_role', role);
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

  const activeBenchmark = ROLE_SKILL_BENCHMARKS[selectedRole] || ROLE_SKILL_BENCHMARKS['Data Analyst'];

  return (
    <div className="space-y-6">
      {/* Top Banner with Role Selection & Readiness Gauge */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Interactive Student Skill Profiler & Career Roadmap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Target Career: <span className="text-amber-300">{selectedRole}</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
              Select the tools and languages you already know (e.g. Python, NumPy, Matplotlib). We will compute your missing skill gaps, build your step-by-step roadmap, and recommend exact textbooks.
            </p>

            {/* Target Role Selector Tabs */}
            <div className="flex flex-wrap gap-2 pt-2">
              {Object.keys(ROLE_SKILL_BENCHMARKS).map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedRole === role
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-blue-100'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Readiness Score Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl text-center shrink-0 min-w-[180px]">
            <p className="text-xs uppercase font-bold text-blue-200 tracking-wider">Role Readiness</p>
            <p className="text-4xl font-extrabold text-white my-1">
              {guidance?.readinessScore || 0}%
            </p>
            <p className="text-[11px] text-emerald-300 font-semibold">
              {selectedSkills.length} of {activeBenchmark.allSkills.length} Skills Mastered
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Skill Selector */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <span>Step 1: Check Off Skills You Already Know</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any skill chip to toggle whether you have studied or coded in it.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {selectedSkills.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {activeBenchmark.allSkills.map((skill) => {
            const isKnown = selectedSkills.includes(skill.name);
            return (
              <div
                key={skill.id}
                onClick={() => toggleSkill(skill.name)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  isKnown
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-white'
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

      {/* SECTION 2: Dynamic Learning Roadmap & Next Skills to Learn */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: What to Learn Next */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span>Step 2: What You Should Learn Next (Roadmap)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your personalized sequence to reach 100% {selectedRole} qualification.
            </p>
          </div>

          {guidance?.skillsToLearn && guidance.skillsToLearn.length > 0 ? (
            <div className="space-y-3">
              {guidance.skillsToLearn.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 transition-all flex items-start justify-between gap-3"
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
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Test Missing Skills in AI Quiz Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Google Gemini AI Job Advisor & API Key Config */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-500" />
              <span>Gemini AI Career Search Assistant</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live AI analysis of what you should learn for 2026 hiring standards.
            </p>
          </div>

          {/* AI Response Box */}
          <div className="p-4 rounded-xl bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-200 text-xs text-slate-800 space-y-2">
            <div className="flex items-center justify-between text-indigo-800 font-bold text-[11px]">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Job Market Recommendation</span>
              </span>
              {loadingAi && <span className="text-blue-600 animate-pulse">Analyzing with Gemini...</span>}
            </div>
            <p className="leading-relaxed text-slate-700 font-normal">
              {aiAdviceText}
            </p>
          </div>

          {/* Gemini API Key Configuration Input */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Google Gemini API Key</span>
              </label>
              <span className="text-[10px] text-slate-400">Stored locally</span>
            </div>

            <div className="flex gap-2">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste AI Studio API key (AIzaSy...)"
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

      {/* SECTION 3: Curated Book Recommendations with Authors & Chapters */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" />
              <span>Step 3: Recommended Textbooks & Author Syllabi</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Prescribed academic literature bridging theoretical statistics with modern programming.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Curated for <strong className="text-slate-900">{selectedRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURATED_BOOKS.map((book) => (
            <div
              key={book.id}
              className="rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all overflow-hidden flex flex-col"
            >
              {/* Book Spine / Header */}
              <div className={`p-4 bg-linear-to-r ${book.coverColor} text-white space-y-1`}>
                <span className="px-2 py-0.5 bg-black/20 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
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
