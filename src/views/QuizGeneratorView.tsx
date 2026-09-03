import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sliders,
  BookOpen,
  ArrowRight,
  HelpCircle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleUploadDocuments } from '../data/mockData';
import { Assessment, Question, CompetencyDomain } from '../types';

export const QuizGeneratorView: React.FC = () => {
  const {
    competencies,
    addNewGeneratedAssessment,
    navigate,
    setActiveAssessmentId,
  } = useApp();

  const [selectedDocId, setSelectedDocId] = useState(sampleUploadDocuments[0].id);
  const [selectedCompetencyName, setSelectedCompetencyName] = useState(
    'Survey Design & Sampling Methodology'
  );
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Adaptive'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [customPrompt, setCustomPrompt] = useState(
    'Focus on Circular Systematic Sampling, First Stage Units (FSUs), and weight calibration under NSSO multi-stage design.'
  );

  // Generated questions state
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([
    {
      id: 'gen-q1',
      question:
        'In the NSSO 78th Round survey on domestic tourism, what constitutes the First Stage Unit (FSU) in the rural sector?',
      options: [
        'Census Villages according to the 2011 Population Census',
        'Gram Panchayat Administrative Wards',
        'Households categorized under BPL registries',
        'District Statistical Enumeration Blocks',
      ],
      correctIndex: 0,
      explanation:
        'As per Section 2.1 of the 78th Round Instructions to Field Staff, the rural FSUs are the 2011 Census villages (with sub-division for large villages exceeding 1200 population).',
      difficulty: 'Medium',
      competency: 'Survey Design & Sampling Methodology',
      sourceReference: 'Page 14, Section 2.1 — NSSO_78th_Round_Instructions.pdf',
      approved: true,
    },
    {
      id: 'gen-q2',
      question:
        'Under circular systematic sampling with random start, what is the mandatory condition regarding the sampling interval k = N/n?',
      options: [
        'k must strictly be an integer rounded down to the nearest multiple of 5',
        'The random start r must be chosen uniformly between 1 and N (or integer nearest to k)',
        'Sample units must be re-shuffled after every 10th selection',
        'The sample weight must be doubled for all odd-numbered clusters',
      ],
      correctIndex: 1,
      explanation:
        'In circular systematic sampling, a random start r is drawn from 1 to N, and subsequent units are r + j*k (mod N).',
      difficulty: 'Medium',
      competency: 'Survey Design & Sampling Methodology',
      sourceReference: 'Page 28, Section 4.3 — NSSO_Sampling_Methodology.pdf',
      approved: true,
    },
    {
      id: 'gen-q3',
      question:
        'When an FSU has a large population (>1,200), what procedure does MoSPI prescribe before household listing?',
      options: [
        'Arbitrary elimination of households residing on the village periphery',
        'Sub-division into hamlet-groups of approximately equal population size (approx. 600)',
        'Postponing the survey until the following quarter',
        'Double sampling of the first 50 registered households',
      ],
      correctIndex: 1,
      explanation:
        'Large FSUs are divided into hamlet-groups (rural) or sub-blocks (urban) of approximately equal population (approx. 600) with known selection probability.',
      difficulty: 'Hard',
      competency: 'Survey Design & Sampling Methodology',
      sourceReference: 'Page 32, Section 5.1 — NSSO_Field_Manual_Vol1.pdf',
      approved: true,
    },
    {
      id: 'gen-q4',
      question:
        'How are multiplier weights (design weights) adjusted when one hamlet-group is selected out of 4 formed in an FSU?',
      options: [
        'The weight is multiplied by 4 (inverse of selection probability 1/4)',
        'The weight is divided by 4',
        'The weight remains completely unaffected',
        'Weight adjustments are prohibited under MoSPI standards',
      ],
      correctIndex: 0,
      explanation:
        'The sampling weight is inversely proportional to the selection probability. If 1 hamlet-group is chosen out of H groups with SRS, the sub-sampling factor of H is applied to the multiplier.',
      difficulty: 'Hard',
      competency: 'Survey Design & Sampling Methodology',
      sourceReference: 'Page 41, Multiplier Estimation Formulas — SDRD_Technical_Note.pdf',
      approved: true,
    },
    {
      id: 'gen-q5',
      question:
        'Which statistical test is officially recommended by MoSPI to examine non-response bias across socio-economic strata?',
      options: [
        'Chi-Square Goodness-of-Fit comparing respondent demographics with baseline census distributions',
        'Single-sample Student t-test on nominal expenditure',
        'Pearson correlation between enumerator ID and response latency',
        'Durbin-Watson serial autocorrelation check',
      ],
      correctIndex: 0,
      explanation:
        'To diagnose selective non-response bias, respondent demographics are tested against master census/frame distributions using Chi-square goodness-of-fit.',
      difficulty: 'Medium',
      competency: 'Survey Design & Sampling Methodology',
      sourceReference: 'Page 62, Chapter 6: Quality Indicators — MoSPI_NSSO_Guidelines.pdf',
      approved: true,
    },
  ]);

  const handleGenerateQuestions = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
    }, 900);
  };

  const handleToggleApprove = (id: string) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, approved: !q.approved } : q))
    );
  };

  const handleLaunchAssessment = () => {
    const activeDoc = sampleUploadDocuments.find((d) => d.id === selectedDocId);
    const newAssessment: Assessment = {
      id: `asmt-gen-${Date.now()}`,
      title: `${selectedCompetencyName} Grounded Diagnostic`,
      description: `AI diagnostic assessment grounded in ${activeDoc?.title || 'MoSPI Official Guidelines'} covering ${selectedCompetencyName}.`,
      domain: 'Statistical' as CompetencyDomain,
      targetCompetency: selectedCompetencyName,
      sourceDocName: activeDoc?.filename || 'MoSPI Grounding Document',
      totalQuestions: generatedQuestions.length,
      durationMinutes: 15,
      questions: generatedQuestions,
      difficulty,
      createdBy: 'AI Generator',
    };

    addNewGeneratedAssessment(newAssessment);
    setActiveAssessmentId(newAssessment.id);
    navigate('assessment', { assessmentId: newAssessment.id });
  };

  const selectedDoc = sampleUploadDocuments.find((d) => d.id === selectedDocId);

  return (
    <div className="space-y-8 bg-[#080808] text-white">
      {/* Header Banner */}
      <div className="border-b border-[#222222] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#D8FE41]/10 border border-[#D8FE41]/40 rounded text-[11px] font-mono font-bold tracking-widest text-[#D8FE41] uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D8FE41]" />
            <span>GROUNDED AI QUIZ & DIAGNOSTIC ENGINE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-display text-white">
            AI Quiz Generator
          </h1>
          <p className="text-sm text-[#999999] font-mono mt-1 max-w-2xl">
            Generate verifiable, high-rigor adaptive assessment questions grounded in official MoSPI survey manuals, statistical codes, and legal acts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('assessment')}
            className="px-4 py-2.5 rounded bg-[#161616] hover:bg-[#222222] border border-[#333333] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all"
          >
            Go to Assessments →
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generation Controls & Document Grounding */}
        <div className="lg:col-span-5 space-y-6">
          {/* Grounding Source Selection */}
          <div className="bg-[#121212] border border-[#222222] rounded-none p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D8FE41]" />
                <span>1. Select Official Grounding Source</span>
              </h2>
              <span className="text-[10px] font-mono text-[#777777] uppercase">RAG Grounded</span>
            </div>

            <div className="space-y-2.5">
              {sampleUploadDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3.5 border cursor-pointer transition-all ${
                    selectedDocId === doc.id
                      ? 'bg-[#181818] border-[#D8FE41] shadow-[0_0_12px_rgba(216,254,65,0.15)]'
                      : 'bg-[#141414] border-[#222222] hover:border-[#444444]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <FileText
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          selectedDocId === doc.id ? 'text-[#D8FE41]' : 'text-[#888888]'
                        }`}
                      />
                      <div>
                        <p className="text-xs font-bold font-mono text-white leading-tight">
                          {doc.title}
                        </p>
                        <p className="text-[11px] text-[#888888] font-mono mt-1">
                          {doc.pages} pages • {doc.domain} Domain • {doc.size}
                        </p>
                      </div>
                    </div>
                    {selectedDocId === doc.id && (
                      <span className="w-2 h-2 rounded-full bg-[#D8FE41] animate-pulse shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Custom Document */}
            <div className="border border-dashed border-[#333333] hover:border-[#D8FE41] p-4 text-center cursor-pointer transition-colors bg-[#0a0a0a]">
              <Upload className="w-5 h-5 mx-auto text-[#888888] mb-1.5" />
              <p className="text-xs font-mono font-bold uppercase text-white">Upload New MoSPI Circular / Manual</p>
              <p className="text-[10px] font-mono text-[#666666] mt-0.5">PDF, DOCX up to 25MB with auto-vectorization</p>
            </div>
          </div>

          {/* Assessment Parameters */}
          <div className="bg-[#121212] border border-[#222222] rounded-none p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#222222] pb-3">
              <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D8FE41]" />
                <span>2. Target Competency & Scope</span>
              </h2>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#999999] mb-1.5 font-bold">
                  Target Competency
                </label>
                <select
                  value={selectedCompetencyName}
                  onChange={(e) => setSelectedCompetencyName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 rounded-none focus:border-[#D8FE41] focus:outline-none"
                >
                  {competencies.map((comp) => (
                    <option key={comp.id} value={comp.name}>
                      {comp.name} ({comp.currentLevel} / {comp.currentScore}%)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#999999] mb-1.5 font-bold">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 rounded-none focus:border-[#D8FE41] focus:outline-none"
                  >
                    <option value="Easy">Easy (Conceptual)</option>
                    <option value="Medium">Medium (Operational)</option>
                    <option value="Hard">Hard (Methodological)</option>
                    <option value="Adaptive">Adaptive (Dynamic)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#999999] mb-1.5 font-bold">
                    Question Count
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 rounded-none focus:border-[#D8FE41] focus:outline-none"
                  >
                    <option value={5}>5 Questions (Rapid)</option>
                    <option value={8}>8 Questions (Standard)</option>
                    <option value={10}>10 Questions (Rigorous)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#999999] mb-1.5 font-bold">
                  Syllabus Focus Prompt
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-[#181818] border border-[#333333] text-white p-2.5 rounded-none focus:border-[#D8FE41] focus:outline-none leading-relaxed text-xs"
                  placeholder="Specify focus sections, formulas, or statistical acts..."
                />
              </div>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="w-full py-3 bg-[#D8FE41] hover:bg-[#c4eb34] text-black font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_15px_rgba(216,254,65,0.3)] flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin text-black" />
                    <span>Extracting & Synthesizing Grounded Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Generate Grounded Questions</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Grounded Questions Preview & Review */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#121212] border border-[#222222] rounded-none p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#222222] pb-4 gap-3">
              <div>
                <h2 className="text-sm font-black font-mono uppercase tracking-widest text-[#D8FE41] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D8FE41]" />
                  <span>3. Review & Validate Grounded Questions</span>
                </h2>
                <p className="text-[11px] font-mono text-[#888888] mt-0.5">
                  Grounded in: <span className="text-white font-bold">{selectedDoc?.filename}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-[#1c1c1c] border border-[#333333] text-[10px] font-mono font-bold text-white uppercase">
                  {generatedQuestions.filter((q) => q.approved).length} / {generatedQuestions.length} Approved
                </span>
                <button
                  onClick={handleLaunchAssessment}
                  className="px-4 py-2 bg-[#D8FE41] hover:bg-[#c4eb34] text-black text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(216,254,65,0.3)] transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Launch Assessment</span>
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {generatedQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 border transition-all ${
                    q.approved
                      ? 'bg-[#151515] border-[#2e2e2e]'
                      : 'bg-[#101010] border-rose-900/40 opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#222222] text-[#D8FE41] font-mono font-bold text-[10px]">
                        Q{idx + 1}
                      </span>
                      <span className="px-2 py-0.5 bg-[#1a1a1a] border border-[#333333] text-[#888888] font-mono text-[10px] uppercase">
                        {q.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleApprove(q.id)}
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 border ${
                        q.approved
                          ? 'border-[#D8FE41]/50 text-[#D8FE41] bg-[#D8FE41]/10'
                          : 'border-[#555555] text-[#888888]'
                      }`}
                    >
                      {q.approved ? 'Approved ✓' : 'Click to Approve'}
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-mono font-bold text-white mb-3 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-2.5 text-xs font-mono border ${
                          oIdx === q.correctIndex
                            ? 'border-[#D8FE41]/60 bg-[#D8FE41]/10 text-white font-bold'
                            : 'border-[#222222] bg-[#121212] text-[#888888]'
                        }`}
                      >
                        <span className="text-[#D8FE41] font-bold mr-2">
                          {String.fromCharCode(65 + oIdx)}.
                        </span>
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>

                  {/* Source Reference & Explanation */}
                  <div className="p-2.5 bg-[#0d0d0d] border border-[#222222] text-[11px] font-mono text-[#888888] space-y-1">
                    <p className="text-[#D8FE41] font-bold">
                      CITATION: <span className="text-white font-normal">{q.sourceReference}</span>
                    </p>
                    <p className="text-[#aaaaaa] leading-relaxed">
                      <span className="font-bold text-[#888888]">RATIONALE:</span> {q.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Launch CTA Bar */}
            <div className="pt-4 border-t border-[#222222] flex items-center justify-between">
              <span className="text-xs font-mono text-[#888888]">
                Ready to take test? Your score will update your Competency Digital Twin in real-time.
              </span>
              <button
                onClick={handleLaunchAssessment}
                className="px-6 py-3 bg-[#D8FE41] hover:bg-[#c4eb34] text-black text-xs font-mono font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_0_15px_rgba(216,254,65,0.35)] transition-all"
              >
                <span>Take Grounded Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
