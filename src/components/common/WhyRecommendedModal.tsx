import React from 'react';
import { X, Sparkles, CheckCircle2, TrendingUp, Compass, Award, Building, ArrowRight } from 'lucide-react';
import { Course } from '../../types';
import { useApp } from '../../context/AppContext';

interface WhyRecommendedModalProps {
  course: Course | null;
  onClose: () => void;
}

export const WhyRecommendedModal: React.FC<WhyRecommendedModalProps> = ({
  course,
  onClose,
}) => {
  const { navigate, enrollCourse } = useApp();

  if (!course) return null;

  const { whyRecommended } = course;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans text-slate-800">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Dialog Panel */}
        <div className="relative w-full max-w-2xl transform overflow-hidden bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-slate-200 rounded-2xl">
          {/* Top Badge & Close */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Explainable AI Recommendation Rationale
              </span>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {course.matchScore}% Match Index
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {course.title}
          </h2>
          <p className="text-xs text-slate-500 mb-6 font-medium">
            Provider: <span className="font-semibold text-slate-700">{course.provider}</span> • Duration: {course.duration}
          </p>

          {/* Core Reasoning Cards */}
          <div className="space-y-4 mb-6">
            {/* Primary Synthesis */}
            <div className="p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 border border-blue-200 text-blue-700 rounded-lg shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 mb-1">
                    AI Competency Synthesis
                  </h4>
                  <p className="text-sm text-slate-700 font-normal leading-relaxed">
                    {whyRecommended.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Gap Addressed vs Expected Improvement */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 border border-slate-200 bg-slate-50 rounded-xl">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  Identified Cadre Gap
                </p>
                <p className="text-xs text-slate-800 font-medium leading-normal">
                  {whyRecommended.gapAddressed}
                </p>
              </div>

              <div className="p-4 border border-emerald-200 bg-emerald-50/50 rounded-xl">
                <p className="text-xs font-semibold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Projected Competency Gain
                </p>
                <p className="text-xs text-emerald-900 font-medium leading-normal">
                  {whyRecommended.expectedImprovement}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendation Factor Breakdown */}
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-blue-600" />
              Recommendation Factor Attribution Weights
            </h4>
            <div className="space-y-2.5">
              {whyRecommended.factors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      {factor.label}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {factor.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-3.5 border border-slate-200 bg-slate-50/70 rounded-xl text-xs text-slate-600 leading-relaxed mb-6">
            <span className="font-semibold text-slate-900">Transparency Note:</span> Recommendations are computed by matching your official competency levels against the MoSPI ISS Cadre Competency Dictionary, NSSO field deployment guidelines, and past assessment diagnostics.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                enrollCourse(course.id);
                onClose();
                navigate('course-detail', { courseId: course.id });
              }}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              {course.status === 'In Progress' ? 'Continue Course' : 'Enroll in Course'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

