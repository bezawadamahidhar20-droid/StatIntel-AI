import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Play,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course } from '../types';

export const CoursesView: React.FC = () => {
  const { courses, navigate, setWhyRecommendedCourse, enrollCourse } = useApp();
  const [providerFilter, setProviderFilter] = useState<string>('All');
  const [domainFilter, setDomainFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = courses.filter((c) => {
    const matchesProvider = providerFilter === 'All' || c.provider === providerFilter;
    const matchesDomain = domainFilter === 'All' || c.domain === domainFilter;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.competenciesCovered.some((comp) => comp.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProvider && matchesDomain && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Official Statistical Learning Marketplace
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Integrated catalogue uniting iGOT Karmayogi Bharat and National Statistical Systems Training Academy (NSSTA) curricula.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
            {courses.length} Accredited Programmes Available
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by topic (Microdata, Sampling, GVA, Python, DPDP)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Provider Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 mr-1">Source:</span>
            {['All', 'iGOT Karmayogi', 'NSSTA TPAC', 'MoSPI Training Division'].map((prov) => (
              <button
                key={prov}
                onClick={() => setProviderFilter(prov)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  providerFilter === prov
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500 mr-1">Status:</span>
            {['All', 'Recommended', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => {
          const isRecommended = course.status === 'Recommended';
          const isInProgress = course.status === 'In Progress';
          const isCompleted = course.status === 'Completed';

          return (
            <div
              key={course.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Strip */}
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

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.competenciesCovered.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10.5px] truncate max-w-[200px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                {/* Progress bar if in progress */}
                {isInProgress && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                      <span>Course Progress</span>
                      <span className="font-bold text-amber-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                )}

                {/* Duration & Level Meta */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {course.duration}
                  </span>
                  <span>{course.difficulty}</span>
                  <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" /> {course.rating}
                  </span>
                </div>

                {/* CTAs */}
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
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors ${
                      isInProgress
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : isCompleted
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                        : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800'
                    }`}
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
    </div>
  );
};
