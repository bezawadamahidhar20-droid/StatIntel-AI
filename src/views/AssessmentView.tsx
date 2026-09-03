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
      <div className="p-12 text-center bg-[#080808] text-white">
        <p className="font-mono text-xs text-[#888888]">No assessment selected.</p>
        <button
          onClick={() => navigate('quiz-generator')}
          className="mt-4 px-4 py-2 bg-[#D8FE41] text-black font-mono font-bold uppercase text-xs"
        >
          Generate Assessment
        </button>
      </div>
    );
  }

  const answeredCount = selectedAnswers.filter((a) => a !== -1).length;
  const progressPercent = Math.round((answeredCount / currentAssessment.questions.length) * 100);

  return (
    <div className="space-y-6 bg-[#080808] text-white">
      {/* Top Test Header Bar */}
      <div className="bg-[#121212] border border-[#222222] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#D8FE41]/10 border border-[#D8FE41]/40 text-[#D8FE41] text-[10px] font-mono font-bold tracking-widest uppercase">
              NSSTA / MoSPI Adaptive Assessment
            </span>
            <span className="text-xs font-mono text-[#888888]">
              Target: <span className="text-white font-bold">{currentAssessment.targetCompetency}</span>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-white">
            {currentAssessment.title}
          </h1>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#181818] border border-[#333333]">
            <Clock className="w-4 h-4 text-[#D8FE41]" />
            <span className="font-mono text-sm font-black text-white">
              {formatTime(secondsRemaining)}
            </span>
          </div>

          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#D8FE41] hover:bg-[#c4eb34] text-black font-mono font-black uppercase text-xs tracking-wider shadow-[0_0_12px_rgba(216,254,65,0.3)] transition-all"
          >
            Submit & Boost Twin
          </button>
        </div>
      </div>

      {/* Main Assessment Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Question */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#121212] border border-[#222222] p-6 space-y-6">
            {/* Question Meta Bar */}
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-[#D8FE41] text-black font-mono font-black text-xs">
                  QUESTION {currentQuestionIndex + 1} OF {currentAssessment.questions.length}
                </span>
                <span className="text-[11px] font-mono text-[#888888] uppercase">
                  Difficulty: <span className="text-white font-bold">{currentQ.difficulty}</span>
                </span>
              </div>

              <button
                onClick={handleToggleFlag}
                className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 border transition-all ${
                  flaggedQuestions[currentQuestionIndex]
                    ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                    : 'border-[#333333] text-[#777777] hover:text-white'
                }`}
              >
                {flaggedQuestions[currentQuestionIndex] ? '★ Flagged' : '☆ Flag for Review'}
              </button>
            </div>

            {/* Question Text */}
            <div className="py-2">
              <h2 className="text-base sm:text-lg font-mono font-bold text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`p-4 border cursor-pointer font-mono transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-[#1a1a1a] border-[#D8FE41] text-white shadow-[0_0_12px_rgba(216,254,65,0.15)]'
                        : 'bg-[#141414] border-[#252525] text-[#aaaaaa] hover:border-[#444444] hover:text-white'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 shrink-0 flex items-center justify-center font-bold text-xs border ${
                        isSelected
                          ? 'bg-[#D8FE41] text-black border-[#D8FE41]'
                          : 'bg-[#1e1e1e] text-[#888888] border-[#333333]'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {opt}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Source Reference Grounding Note */}
            <div className="p-3 bg-[#0d0d0d] border border-[#222222] flex items-center gap-2.5 text-xs font-mono text-[#888888]">
              <FileText className="w-4 h-4 text-[#D8FE41] shrink-0" />
              <span>Grounded in MoSPI Source: <span className="text-white">{currentQ.sourceReference}</span></span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#222222]">
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 border border-[#333333] text-[#888888] hover:text-white disabled:opacity-40 disabled:pointer-events-none font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
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
                  className="px-5 py-2 bg-[#222222] hover:bg-[#333333] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#D8FE41] hover:bg-[#c4eb34] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(216,254,65,0.3)]"
                >
                  <span>Complete & Submit Assessment</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette & Overview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#121212] border border-[#222222] p-6 space-y-5">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#D8FE41] border-b border-[#222222] pb-3">
              Question Palette
            </h3>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-[#888888]">
                <span>Progress</span>
                <span className="text-white font-bold">
                  {answeredCount} / {currentAssessment.questions.length} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#1e1e1e] h-2">
                <div
                  className="bg-[#D8FE41] h-full transition-all duration-300"
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
                    className={`h-9 font-mono font-bold text-xs flex items-center justify-center border transition-all ${
                      isCurrent
                        ? 'border-[#D8FE41] bg-[#D8FE41] text-black font-black'
                        : isFlagged
                        ? 'border-amber-400 bg-amber-950/30 text-amber-300'
                        : isAnswered
                        ? 'border-[#383838] bg-[#1e1e1e] text-[#D8FE41]'
                        : 'border-[#222222] bg-[#141414] text-[#666666] hover:text-white'
                    }`}
                  >
                    {qIdx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="pt-3 border-t border-[#222222] space-y-2 text-[10px] font-mono text-[#888888]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#D8FE41] inline-block" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#1e1e1e] border border-[#383838] inline-block" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#141414] border border-[#222222] inline-block" />
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-amber-400/20 border border-amber-400 inline-block" />
                <span>Flagged for Review</span>
              </div>
            </div>

            {/* Assessment Info */}
            <div className="p-3 bg-[#151515] border border-[#252525] text-xs font-mono space-y-1.5">
              <p className="text-[#888888]">
                <strong className="text-white">Domain:</strong> {currentAssessment.domain}
              </p>
              <p className="text-[#888888]">
                <strong className="text-white">Questions:</strong> {currentAssessment.totalQuestions}
              </p>
              <p className="text-[#888888]">
                <strong className="text-white">Engine:</strong> Closed-Loop Digital Twin Sync
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
