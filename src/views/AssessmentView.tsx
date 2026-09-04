import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Shield,
  FileText,
  RotateCcw,
  Flag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AssessmentView: React.FC = () => {
  const {
    assessments,
    activeAssessmentId,
    submitAssessmentAttempt,
    navigate,
  } = useApp();

  const currentAssessment =
    assessments.find((a) => a.id === activeAssessmentId) || assessments[0];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([]);

  // Initialize answers array when assessment changes
  useEffect(() => {
    if (currentAssessment) {
      setSelectedAnswers(new Array(currentAssessment.questions.length).fill(-1));
      setFlaggedQuestions(new Array(currentAssessment.questions.length).fill(false));
      setSecondsRemaining(currentAssessment.durationMinutes * 60);
      setCurrentQuestionIndex(0);
    }
  }, [currentAssessment]);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentAssessment, selectedAnswers]);

  const currentQ = currentAssessment?.questions[currentQuestionIndex];

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleToggleFlag = () => {
    const newFlags = [...flaggedQuestions];
    newFlags[currentQuestionIndex] = !newFlags[currentQuestionIndex];
    setFlaggedQuestions(newFlags);
  };

  const handleSubmit = () => {
    const timeSpent = currentAssessment.durationMinutes * 60 - secondsRemaining;
    submitAssessmentAttempt(currentAssessment.id, selectedAnswers, Math.max(15, timeSpent));
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentAssessment || !currentQ) {
    return (
      <div className="p-12 text-center bg-white rounded-xl border border-slate-200 text-slate-800 shadow-xs max-w-lg mx-auto">
        <p className="text-sm text-slate-500">No active assessment selected.</p>
        <button
          onClick={() => navigate('quiz-generator')}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
        >
          Generate Grounded Assessment
        </button>
      </div>
    );
  }

  const answeredCount = selectedAnswers.filter((a) => a !== -1).length;
  const progressPercent = Math.round((answeredCount / currentAssessment.questions.length) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Test Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full">
              NSSTA / MoSPI Adaptive Assessment
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Target Competency: <span className="text-slate-900 font-semibold">{currentAssessment.targetCompetency}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            {currentAssessment.title}
          </h1>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-mono text-sm font-bold text-slate-800">
              {formatTime(secondsRemaining)}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center gap-2"
          >
            <span>Submit Assessment</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Assessment Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
            {/* Question Meta Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs rounded-md">
                  Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Difficulty: <span className="text-slate-800 font-semibold capitalize">{currentQ.difficulty}</span>
                </span>
              </div>

              <button
                onClick={handleToggleFlag}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  flaggedQuestions[currentQuestionIndex]
                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${flaggedQuestions[currentQuestionIndex] ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{flaggedQuestions[currentQuestionIndex] ? 'Flagged for Review' : 'Flag Question'}</span>
              </button>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-1">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 text-blue-950 shadow-xs ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs border ${
                        isSelected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-normal leading-relaxed pt-0.5">
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Source Reference Grounding Note */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2.5 text-xs text-slate-600">
              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Grounded in MoSPI Source: <strong className="text-slate-900">{currentQ.sourceReference}</strong></span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Question</span>
              </button>

              {currentQuestionIndex < currentAssessment.questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(currentAssessment.questions.length - 1, prev + 1)
                    )
                  }
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Complete & Submit</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3">
              Question Palette
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Progress</span>
                <span className="text-slate-900 font-semibold">
                  {answeredCount} / {currentAssessment.questions.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Grid of Question Numbers */}
            <div className="grid grid-cols-5 gap-2 pt-2">
              {currentAssessment.questions.map((_, qIdx) => {
                const isCurrent = qIdx === currentQuestionIndex;
                const isAnswered = selectedAnswers[qIdx] !== -1;
                const isFlagged = flaggedQuestions[qIdx];

                return (
                  <button
                    key={qIdx}
                    onClick={() => setCurrentQuestionIndex(qIdx)}
                    className={`h-9 rounded-lg font-semibold text-xs flex items-center justify-center border transition-all ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                        : isFlagged
                        ? 'border-amber-300 bg-amber-50 text-amber-800'
                        : isAnswered
                        ? 'border-blue-200 bg-blue-50 text-blue-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-600 rounded-sm inline-block" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-50 border border-blue-200 rounded-sm inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-white border border-slate-200 rounded-sm inline-block" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-50 border border-amber-300 rounded-sm inline-block" />
                <span>Flagged for Review</span>
              </div>
            </div>

            {/* Assessment Info */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5 text-slate-600">
              <p>
                <strong className="text-slate-800 font-semibold">Domain:</strong> {currentAssessment.domain}
              </p>
              <p>
                <strong className="text-slate-800 font-semibold">Questions:</strong> {currentAssessment.totalQuestions}
              </p>
              <p>
                <strong className="text-slate-800 font-semibold">Engine:</strong> Closed-Loop Digital Twin Sync
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
