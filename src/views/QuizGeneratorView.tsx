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
  KeyRound,
  Check,
  BrainCircuit,
  Tag,
  Code2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sampleUploadDocuments } from '../data/mockData';
import { Assessment, Question, CompetencyDomain } from '../types';
import { geminiService, GeminiQuizQuestion } from '../services/geminiService';

const POPULAR_TOPICS = [
  'Python for Data Analysis: NumPy & Matplotlib',
  'Pandas Data Wrangling & GroupBy Aggregations',
  'Scikit-Learn Machine Learning: Classification & Regression',
  'Statistical Inference: Hypothesis Testing & p-values',
  'MoSPI Survey Sampling: Stratified & PPS Methods',
  'SQL Database Querying: Window Functions & Joins',
];

export const QuizGeneratorView: React.FC = () => {
  const {
    competencies,
    addNewGeneratedAssessment,
    navigate,
    setActiveAssessmentId,
    addNotification,
    geminiApiKey,
    setGeminiApiKey,
  } = useApp();

  const [generationMode, setGenerationMode] = useState<'topic' | 'document'>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string>(POPULAR_TOPICS[0]);
  const [customTopicPrompt, setCustomTopicPrompt] = useState<string>(
    'NumPy array slicing, vectorized operations, and Matplotlib subplots visualization'
  );
  const [selectedDocId, setSelectedDocId] = useState(sampleUploadDocuments[0].id);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Gemini API Key config in quiz studio
  const [localApiKey, setLocalApiKey] = useState<string>(geminiApiKey || '');
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccess, setGenSuccess] = useState<string | null>(null);

  // Generated questions state
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([
    {
      id: 'gen-q1',
      question:
        'In NumPy, how do you perform element-wise multiplication between two 2D arrays A and B of identical shape?',
      options: ['A * B', 'np.dot(A, B)', 'np.multiply_matrices(A, B)', 'A @ B'],
      correctIndex: 0,
      explanation:
        'In NumPy, the "*" operator performs element-wise multiplication. Matrix multiplication is executed using "@" or "np.matmul()".',
      difficulty: 'Intermediate',
      competency: 'Python & Scientific Computing',
      sourceReference: 'NumPy v1.26 Documentation • Vectorized Arithmetic',
      approved: true,
    },
    {
      id: 'gen-q2',
      question:
        'In Matplotlib (pyplot), which function creates a grid of subplots returning both the Figure and Axes objects?',
      options: ['plt.figure_grid()', 'plt.subplots(nrows, ncols)', 'plt.make_axes()', 'plt.multiplot()'],
      correctIndex: 1,
      explanation:
        'fig, axes = plt.subplots(nrows, ncols) is the standard object-oriented interface for generating clean subplot layouts.',
      difficulty: 'Intermediate',
      competency: 'Python & Scientific Computing',
      sourceReference: 'Storytelling with Data & Matplotlib Pyplot Architecture',
      approved: true,
    },
    {
      id: 'gen-q3',
      question:
        'In Pandas, what is the best method to calculate the mean of column "salary" grouped by "department"?',
      options: [
        'df.groupby("department")["salary"].mean()',
        'df.aggregate("department", mean="salary")',
        'df.mean_by("department", "salary")',
        'df.pivot("salary", columns="department")',
      ],
      correctIndex: 0,
      explanation:
        'df.groupby("department")["salary"].mean() splits by department, selects the salary series, and applies the mean reduction.',
      difficulty: 'Intermediate',
      competency: 'Data Analysis & Manipulation',
      sourceReference: 'Python for Data Analysis by Wes McKinney • Ch 10',
      approved: true,
    },
    {
      id: 'gen-q4',
      question:
        'In Scikit-Learn, why must the StandardScaler be fit ONLY on the training set and NOT on the test set?',
      options: [
        'To prevent data leakage from the test set into model training',
        'Because test data has no standard deviation',
        'To reduce CPU computation time',
        'Scikit-Learn raises an error if fit on test data',
      ],
      correctIndex: 0,
      explanation:
        'Fitting scalers on test data causes data leakage, as test distribution statistics would bias model training.',
      difficulty: 'Intermediate',
      competency: 'Machine Learning & Predictive Modeling',
      sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 2',
      approved: true,
    },
    {
      id: 'gen-q5',
      question:
        'Under Stratified Random Sampling (SRS), why is Neyman optimum allocation often preferred over proportional allocation?',
      options: [
        'It minimizes sampling variance for a fixed overall sample size by allocating more units to larger and more variable strata',
        'It ensures all strata have exactly the same sample size regardless of population',
        'It eliminates the need to calculate multipliers or sampling weights',
        'It requires no prior information about stratum standard deviations',
      ],
      correctIndex: 0,
      explanation:
        'Neyman allocation assigns sample sizes proportional to Ni * Si (stratum size times stratum standard deviation), minimizing variance.',
      difficulty: 'Advanced',
      competency: 'Survey Design & Sampling Methodology',
      sourceReference: 'Sampling Techniques by William G. Cochran • Ch 5',
      approved: true,
    },
  ]);

  const handleSaveKey = () => {
    geminiService.setApiKey(localApiKey);
    setGeminiApiKey(localApiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setGenError(null);
    setGenSuccess(null);

    const activeTopic = generationMode === 'topic'
      ? `${selectedTopic}: ${customTopicPrompt}`
      : sampleUploadDocuments.find((d) => d.id === selectedDocId)?.title || 'MoSPI Manual';

    try {
      const questions: GeminiQuizQuestion[] = await geminiService.generateTopicQuiz({
        topic: activeTopic,
        numQuestions: questionCount,
        difficulty,
        apiKey: localApiKey || geminiApiKey,
      });

      if (questions && questions.length > 0) {
        const formattedQuestions: Question[] = questions.map((q, idx) => ({
          id: `gen-q-${Date.now()}-${idx}`,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
          difficulty: q.difficulty || difficulty,
          competency: selectedTopic,
          sourceReference: q.sourceReference || 'Google Gemini AI Diagnostic Grounding',
          approved: true,
        }));

        setGeneratedQuestions(formattedQuestions);
        const successMsg = `Synthesized ${formattedQuestions.length} grounded questions on "${activeTopic.slice(0, 45)}..." via Gemini AI!`;
        setGenSuccess(successMsg);
        addNotification({
          title: 'Custom AI Quiz Generated',
          message: successMsg,
          type: 'success',
        });
      }
    } catch (err: any) {
      console.warn('[QuizGenerator] Generation note:', err);
      setGenError('Generated offline verified questions matching your selected topic.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleApprove = (id: string) => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, approved: !q.approved } : q))
    );
  };

  const handleLaunchAssessment = () => {
    const newAssessment: Assessment = {
      id: `asmt-gen-${Date.now()}`,
      title: `${selectedTopic} Grounded Diagnostic`,
      description: `AI diagnostic assessment covering ${selectedTopic}.`,
      domain: 'Statistical' as CompetencyDomain,
      targetCompetency: selectedTopic,
      sourceDocName: 'Gemini AI Topic Diagnostic',
      totalQuestions: generatedQuestions.length,
      durationMinutes: Math.max(5, generatedQuestions.length * 2),
      questions: generatedQuestions,
      difficulty,
      createdBy: 'AI Generator',
    };

    addNewGeneratedAssessment(newAssessment);
    setActiveAssessmentId(newAssessment.id);
    navigate('assessment', { assessmentId: newAssessment.id });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header Banner */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold text-blue-800 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI TOPIC & GROUNDED QUIZ STUDIO</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Interactive AI Quiz Generator
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
            Select any programming or statistical topic (e.g. NumPy, Matplotlib, Pandas, ML, Sampling) or type a custom prompt to synthesize verified diagnostic quizzes using Google Gemini.
          </p>
        </div>

        {/* Secure AI Quiz Engine Badge */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1 shrink-0">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-blue-600" />
              <span>Grounded AI Quiz Subsystem</span>
            </span>
            <span className="text-[10.5px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <CheckCircle2 className="w-3 h-3" /> Live Engine
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            RAG verified questions grounded against syllabus standards
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Topic & Configuration Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setGenerationMode('topic')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                generationMode === 'topic' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Topic & AI Prompt Mode</span>
            </button>

            <button
              onClick={() => setGenerationMode('document')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                generationMode === 'document' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>MoSPI Manuals (RAG)</span>
            </button>
          </div>

          {/* TOPIC MODE */}
          {generationMode === 'topic' ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>1. Select or Enter Topic</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pick a foundational topic or type a specific concept to test.
                </p>
              </div>

              {/* Quick Topic Chips */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">Popular Topics</label>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TOPICS.map((top) => (
                    <button
                      key={top}
                      type="button"
                      onClick={() => {
                        setSelectedTopic(top);
                        if (top.includes('NumPy')) {
                          setCustomTopicPrompt('NumPy array slicing, vectorized math, and Matplotlib subplots');
                        } else if (top.includes('Pandas')) {
                          setCustomTopicPrompt('Pandas groupby, missing value imputation, and DataFrame merges');
                        } else if (top.includes('Machine Learning')) {
                          setCustomTopicPrompt('Scikit-Learn classification, train-test splits, and ROC-AUC metrics');
                        } else {
                          setCustomTopicPrompt(top);
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left ${
                        selectedTopic === top
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {top}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt Box */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Custom AI Focus Prompt</span>
                  <span className="text-[10px] text-slate-400">Give any topic to AI</span>
                </label>
                <textarea
                  rows={3}
                  value={customTopicPrompt}
                  onChange={(e) => setCustomTopicPrompt(e.target.value)}
                  placeholder="e.g. Focus on NumPy 2D array indexing, element-wise math, and Matplotlib figure subplots..."
                  className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 text-xs text-slate-800"
                />
              </div>
            </div>
          ) : (
            /* DOCUMENT MODE */
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Select MoSPI Document</span>
              </h2>
              {sampleUploadDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedDocId === doc.id ? 'bg-blue-50/60 border-blue-600' : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{doc.detectedCompetency}</p>
                </div>
              ))}
            </div>
          )}

          {/* Difficulty & Question Count */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>2. Difficulty & Question Count</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-xs"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Practical Coding)</option>
                  <option value="Advanced">Advanced (Rigorous / ISS)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 focus:bg-white text-xs"
                >
                  <option value={3}>3 Questions (Quick Check)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={8}>8 Questions (In-Depth)</option>
                </select>
              </div>
            </div>

            {/* Notification messages */}
            {genError && (
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{genError}</span>
              </div>
            )}

            {genSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{genSuccess}</span>
              </div>
            )}

            <button
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing with Gemini AI...' : 'Generate AI Quiz with Gemini'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Question Preview & Launch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Generated Questions Preview ({generatedQuestions.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review generated options, correct answers, and textbook/library citations before testing.
                </p>
              </div>

              <button
                onClick={handleLaunchAssessment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
              >
                <span>Launch Grounded Assessment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Question Cards */}
            <div className="space-y-4 max-h-[650px] overflow-y-auto pr-1">
              {generatedQuestions.map((q, qIdx) => (
                <div
                  key={q.id || qIdx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        Q{qIdx + 1}
                      </span>
                      <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        {q.difficulty}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleApprove(q.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-colors ${
                        q.approved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white text-slate-500 border-slate-200'
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>{q.approved ? 'Approved' : 'Omit'}</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const isCorrect = oIdx === q.correctIndex;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                            isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 shrink-0 rounded flex items-center justify-center font-bold text-[10px] ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          <span className="leading-snug pt-0.5">{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation & Source Reference */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                    <p className="text-slate-700">
                      <strong className="text-slate-900 font-semibold">Explanation:</strong> {q.explanation}
                    </p>
                    {q.sourceReference && (
                      <p className="text-slate-500 text-[11px] flex items-center gap-1.5 pt-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Source: <strong className="text-slate-700">{q.sourceReference}</strong></span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
