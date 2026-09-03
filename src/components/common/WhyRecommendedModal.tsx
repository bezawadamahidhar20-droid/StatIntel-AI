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
    <div className="fixed inset-0 z-50 overflow-y-auto font-mono text-white">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        {/* Dialog Panel */}
        <div className="relative w-full max-w-2xl transform overflow-hidden bg-[#0e0e0e] p-6 sm:p-8 text-left shadow-2xl transition-all border border-[#262626]">
          {/* Top Badge & Close */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#161616] text-[#D8FE41] border border-[#D8FE41]/40">
                <Sparkles className="w-3.5 h-3.5 text-[#D8FE41]" />
                Explainable AI Recommendation Rationale
              </span>
              <span className="px-2 py-0.5 text-[10px] font-black uppercase bg-[#D8FE41] text-black">
                {course.matchScore}% Match Index
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 border border-[#333333] bg-[#161616] text-[#888888] hover:text-white hover:bg-[#222222]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-xl font-black uppercase tracking-wide text-white mb-1 font-display">
            {course.title}
          </h2>
          <p className="text-xs text-[#888888] mb-6">
            Provider: <span className="font-bold text-white">{course.provider}</span> • Duration: {course.duration}
          </p>

          {/* Core Reasoning Cards */}
          <div className="space-y-4 mb-6">
            {/* Primary Synthesis */}
            <div className="p-4 border border-[#D8FE41]/30 bg-[#141414]">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#181818] border border-[#D8FE41]/40 text-[#D8FE41] shrink-0 mt-0.5">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#D8FE41] mb-1">
                    AI Competency Synthesis
                  </h4>
                  <p className="text-xs text-[#dddddd] font-medium leading-relaxed">
                    {whyRecommended.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Gap Addressed vs Expected Improvement */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-4 border border-[#222222] bg-[#141414]">
                <p className="text-[10px] font-bold uppercase text-[#777777] mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#777777]" />
                  Identified Cadre Gap
                </p>
                <p className="text-xs text-[#cccccc] leading-normal">
                  {whyRecommended.gapAddressed}
                </p>
              </div>

              <div className="p-4 border border-[#222222] bg-[#141414]">
                <p className="text-[10px] font-bold uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Projected Competency Gain
                </p>
                <p className="text-xs text-emerald-200 leading-normal">
                  {whyRecommended.expectedImprovement}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendation Factor Breakdown */}
          <div className="mb-6">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#777777] mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#D8FE41]" />
              Recommendation Factor Attribution Weights
            </h4>
            <div className="space-y-2.5">
              {whyRecommended.factors.map((factor, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-[#aaaaaa]">
                      {factor.label}
                    </span>
                    <span className="font-bold text-white">
                      {factor.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#202020] overflow-hidden">
                    <div
                      className="h-full bg-[#D8FE41] transition-all duration-700"
                      style={{ width: `${factor.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transparency Disclaimer */}
          <div className="p-3 border border-[#222222] bg-[#141414] text-[10px] text-[#777777] leading-relaxed mb-6">
            <span className="font-bold text-white uppercase">Transparency Note:</span> Recommendations are computed by matching your official competency levels against the MoSPI ISS Cadre Competency Dictionary, NSSO field deployment guidelines, and past assessment diagnostics.
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#333333] bg-[#161616] text-xs font-bold uppercase tracking-wider text-white hover:bg-[#222222]"
            >
              Close
            </button>
            <button
              onClick={() => {
                enrollCourse(course.id);
                onClose();
                navigate('course-detail', { courseId: course.id });
              }}
              className="px-5 py-2 bg-[#D8FE41] hover:bg-[#c9ef32] text-black text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(216,254,65,0.3)]"
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
