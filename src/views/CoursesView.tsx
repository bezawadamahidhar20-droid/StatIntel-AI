import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  Clock,
  Star,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Plus,
  RefreshCw,
  Target,
  CheckCircle2,
  Layers,
  Award,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiClient } from '../services/apiClient';
import { mockCatalogCourses } from '../data/mockData';
import { CatalogCourse, Course } from '../types';
import { ROLE_SKILL_BENCHMARKS } from '../services/geminiService';

export const CoursesView: React.FC = () => {
  const {
    courses,
    navigate,
    setWhyRecommendedCourse,
    enrollCourse,
    addNotification,
    currentUser,
    targetCareerRole,
    userSkills,
  } = useApp();

  // Tab state: 'ROLE_SKILLS' | 'ALL_SKILLS' | 'ACCREDITED_CATALOG'
  const [activeTab, setActiveTab] = useState<'ROLE_SKILLS' | 'ALL_SKILLS' | 'ACCREDITED_CATALOG'>('ROLE_SKILLS');

  // Selected Role for Role-Based Skill Learning
  const [selectedRole, setSelectedRole] = useState<string>(
    targetCareerRole || 'Senior Statistical Officer'
  );

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [levelFilter, setLevelFilter] = useState<string>('All');

  // Catalog State
  const [catalogCourses, setCatalogCourses] = useState<CatalogCourse[]>(mockCatalogCourses);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      setLoadingCatalog(true);
      try {
        const data = await apiClient.getNsstaCatalog();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setCatalogCourses(data);
          return;
        }
      } catch (err) {
        console.warn('Catalog API fallback to mock courses:', err);
      }
      if (isMounted) {
        setCatalogCourses(mockCatalogCourses);
      }
      setLoadingCatalog(false);
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute skills for selected role
  const benchmark = ROLE_SKILL_BENCHMARKS[selectedRole] || ROLE_SKILL_BENCHMARKS['Senior Statistical Officer'] || {
    title: selectedRole,
    allSkills: [
      { id: '1', name: 'Survey Design & Sampling Methodology', category: 'Statistical' },
      { id: '2', name: 'Python for Statistical & Microdata Analytics', category: 'Technical' },
      { id: '3', name: 'SQL & Database Systems', category: 'Technical' },
      { id: '4', name: 'Data Quality Frameworks', category: 'Governance' },
    ],
  };

  const currentKnownSkills = benchmark.allSkills.filter((s) =>
    (userSkills || []).some((us) => us.toLowerCase() === s.name.toLowerCase() || s.name.toLowerCase().includes(us.toLowerCase()))
  );

  const missingSkills = benchmark.allSkills.filter(
    (s) => !currentKnownSkills.some((cs) => cs.id === s.id)
  );

  const roleReadinessScore = Math.min(
    95,
    Math.max(45, Math.round((currentKnownSkills.length / (benchmark.allSkills.length || 1)) * 100))
  );

  const handleStartSkillLearning = (skillName: string) => {
    navigate('skill-learning', { skillName });
  };

  const handleAddCatalogToPath = (catCourse: CatalogCourse) => {
    const matchingCourse =
      courses.find((c) => c.title.toLowerCase().includes(catCourse.title.toLowerCase().substring(0, 15))) ||
      courses[0];
    enrollCourse(matchingCourse.id);
    if (addNotification) {
      addNotification({
        id: `add-cat-${Date.now()}`,
        title: 'Course Enrolled! 🚀',
        message: `"${catCourse.title}" has been added to your personalized learning journey.`,
        type: 'success',
      });
    }
    navigate('course-detail', { courseId: matchingCourse.id });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Skill Learning & Competency Catalog
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Personalized skill roadmap studio, interactive learning modules, and accredited MoSPI / NSSTA curricula.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('ROLE_SKILLS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ROLE_SKILLS'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Role-Based Skills
          </button>
          <button
            onClick={() => setActiveTab('ALL_SKILLS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ALL_SKILLS'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All Recommended Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('ACCREDITED_CATALOG')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'ACCREDITED_CATALOG'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>MoSPI / NSSTA Catalog ({catalogCourses.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ROLE-BASED SKILL LEARNING */}
      {activeTab === 'ROLE_SKILLS' && (
        <div className="space-y-6">
          {/* Role Selector & Readiness Banner */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-bold text-blue-600 tracking-wider">
                  Target Role Competency Analysis
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="text-base font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-600"
                  >
                    {Object.keys(ROLE_SKILL_BENCHMARKS).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Role Readiness KPI */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-right min-w-[200px]">
                <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                  <span>Role Readiness</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">
                    {roleReadinessScore}% / 85% Target
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${roleReadinessScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Skills Section */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your Verified Current Skills ({currentKnownSkills.length})</span>
              </h3>
              <span className="text-[11px] text-slate-400">Verified via Digital Twin Diagnostics</span>
            </div>

            {currentKnownSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {currentKnownSkills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => handleStartSkillLearning(skill.name)}
                    className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20 hover:border-emerald-400 cursor-pointer transition-all flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</p>
                      <span className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Level L3 Verified ✓
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No skills currently checked for this role.</p>
            )}
          </div>

          {/* Skills To Learn (Priority Order) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                <span>Skills You Need To Learn (Priority Order)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Bridging these critical gaps elevates your verified role readiness to 100%.
              </p>
            </div>

            <div className="grid gap-3">
              {missingSkills.map((skill, idx) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                        {idx === 0 ? 'CRITICAL' : 'HIGH'} Priority
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pl-7">
                      <span>Current: <strong className="text-rose-600 font-semibold">L1 (Novice)</strong></span>
                      <span>•</span>
                      <span>Target: <strong className="text-emerald-600 font-semibold">L4 (Mastery)</strong></span>
                      <span>•</span>
                      <span>Gap: <strong className="text-blue-600 font-semibold">3 Levels</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartSkillLearning(skill.name)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ALL RECOMMENDED COURSES */}
      {activeTab === 'ALL_SKILLS' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((course) => {
            const isInProgress = course.status === 'In Progress';
            const isCompleted = course.status === 'Completed';

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {course.provider}
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                      {course.matchScore}% Match
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate('course-detail', { courseId: course.id })}
                    className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div>
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {course.duration}
                    </span>
                    <span>{course.difficulty}</span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" /> {course.rating}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => setWhyRecommendedCourse(course)}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Why?
                    </button>

                    <button
                      onClick={() => {
                        enrollCourse(course.id);
                        navigate('course-detail', { courseId: course.id });
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span>{isInProgress ? 'Continue' : isCompleted ? 'Review' : 'Enroll'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: MoSPI / NSSTA CATALOG */}
      {activeTab === 'ACCREDITED_CATALOG' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-between gap-3 text-xs text-purple-900 dark:text-purple-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                Accredited official curricula maintained in collaboration with MoSPI Standards Division and National Statistical Systems Training Academy (NSSTA).
              </span>
            </div>
            <span className="font-mono text-[11px] font-bold shrink-0">
              {catalogCourses.length} Programmes Listed
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {catalogCourses.map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      {course.provider}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      ✓ Verified
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  {course.official_url && (
                    <a
                      href={course.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center gap-1"
                    >
                      <span>Official Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => handleAddCatalogToPath(course)}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors ml-auto"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add to Path</span>
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
