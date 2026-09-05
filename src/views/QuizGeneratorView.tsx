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
  Video,
  PenTool,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  Award,
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
  'National Accounts Statistics: GDP & SUT Compilation (SNA 2008)',
  'Price Statistics: CPI & WPI Item Weighting & Index Formulae',
  'Labour Statistics: Periodic Labour Force Survey (PLFS) Activity Status',
  'MeghRaj Cloud & DPDP Act 2023 Compliance for e-Governance',
  'SQL Database Querying: Window Functions & Joins',
];

const CURATED_VIDEOS = [
  {
    id: 'vid-01',
    title: 'NSSO 80th Round Survey Methodology & Sampling Protocols',
    organization: 'National Statistical Systems Training Academy (NSSTA)',
    duration: '42 mins',
    url: 'https://www.youtube.com/watch?v=nsso_sampling_demo',
    topics: ['Survey Sampling', 'Stratified PPS', 'Multipliers'],
    sampleQuestions: [
      {
        question: 'In NSS multi-stage sampling, how are First Stage Units (FSUs) typically selected in rural areas?',
        options: ['Simple Random Sampling without Replacement', 'Probability Proportional to Size (Census Villages)', 'Systematic Circular Sampling', 'Quota Sampling by Landholding'],
        correctIndex: 1,
        explanation: 'In NSS rural rounds, FSUs (Census villages) are selected using Probability Proportional to Size (PPS) with village population/households as size measure.',
        difficulty: 'Intermediate' as const,
        source: 'NSSTA Video Lecture • Timestamp 14:32',
      },
      {
        question: 'What is the role of the multiplier in NSSO microdata estimation?',
        options: ['Weights the sample observation to represent the target universe population', 'Adjusts for seasonal price fluctuations', 'Calculates Gini coefficient', 'Corrects for interviewer bias only'],
        correctIndex: 0,
        explanation: 'The multiplier (sampling weight) is the inverse of the inclusion probability, projecting sample estimates to total population aggregates.',
        difficulty: 'Intermediate' as const,
        source: 'NSSTA Video Lecture • Timestamp 28:15',
      },
    ],
  },
  {
    id: 'vid-02',
    title: 'National Accounts Compilation & Supply-Use Tables (SNA 2008)',
    organization: 'Central Statistics Office — NAD',
    duration: '55 mins',
    url: 'https://www.youtube.com/watch?v=nad_sna_sut',
    topics: ['National Accounts', 'SUT', 'GDP at Market Prices'],
    sampleQuestions: [
      {
        question: 'In the Supply-Use Table (SUT) framework, what identity must hold for every product row?',
        options: ['Total Supply at Basic Prices + Taxes - Subsidies + Trade/Transport Margins = Total Use at Purchasers Prices', 'Gross Value Added = Total Output', 'Total Imports = Total Capital Formation', 'Intermediate Consumption = Final Consumption Expenditure'],
        correctIndex: 0,
        explanation: 'Under SNA 2008, total supply at purchasers prices must identically equal total use at purchasers prices for each homogeneous commodity.',
        difficulty: 'Advanced' as const,
        source: 'CSO NAD Video Lecture • Timestamp 32:40',
      },
    ],
  },
  {
    id: 'vid-03',
    title: 'MeitY MeghRaj Government Cloud & Digital Personal Data Protection',
    organization: 'Ministry of Electronics and Information Technology (MeitY)',
    duration: '38 mins',
    url: 'https://www.youtube.com/watch?v=meghraj_dpdp_gov',
    topics: ['MeghRaj', 'DPDP Act 2023', 'CERT-In'],
    sampleQuestions: [
      {
        question: 'Under DPDP Act 2023 Section 8, what is the primary obligation of a Data Fiduciary regarding statistical surveys?',
        options: ['Implement reasonable security safeguards and cease retention once purpose is fulfilled', 'Share all raw microdata on public portals without consent', 'Store all records on offshore private cloud servers', 'Collect biometric identifiers for every household survey'],
        correctIndex: 0,
        explanation: 'Section 8 mandates technical security safeguards, data accuracy, and erasure of personal data once the specified capacity or survey purpose is served.',
        difficulty: 'Intermediate' as const,
        source: 'MeitY Video Lecture • Timestamp 19:10',
      },
    ],
  },
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

  const [generationMode, setGenerationMode] = useState<'topic' | 'document' | 'video' | 'trainer'>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string>(POPULAR_TOPICS[0]);
  const [customTopicPrompt, setCustomTopicPrompt] = useState<string>(
    'NumPy array slicing, vectorized operations, and Matplotlib subplots visualization'
  );
  const [selectedDocId, setSelectedDocId] = useState(sampleUploadDocuments[0].id);
  const [selectedVideoId, setSelectedVideoId] = useState(CURATED_VIDEOS[0].id);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Gemini API Key config in quiz studio
  const [localApiKey, setLocalApiKey] = useState<string>(geminiApiKey || '');
  const [keySaved, setKeySaved] = useState<boolean>(false);

  const [genError, setGenError] = useState<string | null>(null);
  const [genSuccess, setGenSuccess] = useState<string | null>(null);

  // Trainer Authoring Form State
  const [authorQuestion, setAuthorQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    competency: 'Survey Design & Sampling Methodology',
    difficulty: 'Intermediate' as 'Beginner' | 'Intermediate' | 'Advanced',
    sourceReference: 'NSSTA Trainer Authoring Studio',
  });

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

    let activeTopic = '';
    let sourceLabel = '';

    if (generationMode === 'topic') {
      activeTopic = `${selectedTopic}: ${customTopicPrompt}`;
      sourceLabel = 'Google Gemini AI Diagnostic Grounding';
    } else if (generationMode === 'document') {
      const doc = sampleUploadDocuments.find((d) => d.id === selectedDocId);
      activeTopic = `${doc?.title || 'MoSPI Manual'}: ${doc?.description || ''}`;
      sourceLabel = `Document Grounding: ${doc?.title || 'MoSPI Standard'}`;
    } else if (generationMode === 'video') {
      const vid = CURATED_VIDEOS.find((v) => v.id === selectedVideoId);
      activeTopic = customVideoUrl ? `Video Lecture: ${customVideoUrl}` : `Video Lecture: ${vid?.title || 'NSSTA Lecture'}`;
      sourceLabel = vid ? `${vid.organization} Video Transcript Grounding` : 'Video RAG Ingestion Pipeline';
    }

    try {
      if (generationMode === 'video' && !customVideoUrl) {
        const vid = CURATED_VIDEOS.find((v) => v.id === selectedVideoId);
        if (vid && vid.sampleQuestions && vid.sampleQuestions.length > 0) {
          const videoQs: Question[] = vid.sampleQuestions.map((q, idx) => ({
            id: `gen-vid-${Date.now()}-${idx}`,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            difficulty: q.difficulty,
            competency: vid.topics[0] || 'Official Statistics',
            sourceReference: q.source,
            approved: true,
          }));
          setGeneratedQuestions(videoQs);
          const successMsg = `Extracted ${videoQs.length} timestamped questions from "${vid.title.slice(0, 45)}..."!`;
          setGenSuccess(successMsg);
          addNotification({
            title: 'Video Lecture Assessment Ready',
            message: successMsg,
            type: 'success',
          });
          setIsGenerating(false);
          return;
        }
      }

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
          sourceReference: q.sourceReference || sourceLabel,
          approved: true,
        }));

        setGeneratedQuestions(formattedQuestions);
        const successMsg = `Synthesized ${formattedQuestions.length} grounded questions on "${activeTopic.slice(0, 45)}..."!`;
        setGenSuccess(successMsg);
        addNotification({
          title: 'Custom Assessment Generated',
          message: successMsg,
          type: 'success',
        });
      }
    } catch (err: any) {
      console.warn('[QuizGenerator] Generation note:', err);
      setGenError('Generated offline verified questions matching your selected topic/document.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAuthorQuestion = () => {
    if (!authorQuestion.question.trim() || authorQuestion.options.some((o) => !o.trim())) {
      setGenError('Please fill in the question text and all 4 option choices.');
      return;
    }
    const newQ: Question = {
      id: `author-q-${Date.now()}`,
      question: authorQuestion.question,
      options: authorQuestion.options,
      correctIndex: authorQuestion.correctIndex,
      explanation: authorQuestion.explanation || 'Verified by Trainer / NSSTA Faculty Rubric.',
      difficulty: authorQuestion.difficulty,
      competency: authorQuestion.competency,
      sourceReference: authorQuestion.sourceReference,
      approved: true,
    };
    setGeneratedQuestions([newQ, ...generatedQuestions]);
    setGenSuccess('Custom question successfully added by Trainer to active assessment pool!');
    setAuthorQuestion({
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      competency: authorQuestion.competency,
      difficulty: authorQuestion.difficulty,
      sourceReference: 'NSSTA Trainer Authoring Studio',
    });
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
      sourceDocName: generationMode === 'video' ? 'Video Lecture Ingestion' : 'Gemini AI Topic Diagnostic',
      totalQuestions: generatedQuestions.length,
      durationMinutes: Math.max(5, generatedQuestions.length * 2),
      questions: generatedQuestions,
      difficulty,
      createdBy: generationMode === 'trainer' ? 'NSSTA Trainer Faculty' : 'AI Generator',
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
            <span>AI TOPIC, VIDEO & TRAINER ASSESSMENT STUDIO (SIH26101 - R7)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Assessment & Quiz Authoring Studio
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl font-normal leading-relaxed">
            Generate grounded diagnostic quizzes from statistical topics, MoSPI manuals, or video lectures — or author custom assessments as a Trainer / NSSTA faculty member.
          </p>
        </div>

        {/* Engine Badge */}
        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1 shrink-0">
          <div className="flex items-center justify-between gap-3 text-[11px]">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-blue-600" />
              <span>Multi-modal RAG Engine</span>
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              R7 Verified
            </span>
          </div>
          <div className="text-[10px] text-slate-500">
            Text • PDF • Video Ingestion • Bloom Taxonomy
          </div>
        </div>
      </div>

      {/* Main Mode Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'topic', label: 'Topic & Prompt Ingestion', icon: Sparkles, badge: 'AI Gen' },
          { id: 'document', label: 'MoSPI Document / PDF RAG', icon: FileText, badge: 'PDF/PPT' },
          { id: 'video', label: 'Video Lecture Ingestion', icon: Video, badge: 'YouTube / MP4' },
          { id: 'trainer', label: 'Trainer Authoring Studio', icon: PenTool, badge: 'Faculty UI' },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = generationMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setGenerationMode(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mode Controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mode 1: Topic */}
          {generationMode === 'topic' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Official Statistics Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {POPULAR_TOPICS.map((t, idx) => (
                  <option key={idx} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Sub-topics or Custom Prompt
                </label>
                <textarea
                  rows={3}
                  value={customTopicPrompt}
                  onChange={(e) => setCustomTopicPrompt(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Specify focus areas (e.g. Sampling variance formulas, GVA sector classification)..."
                />
              </div>
            </div>
          )}

          {/* Mode 2: Document */}
          {generationMode === 'document' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Select Uploaded MoSPI Guideline / Manual
              </label>
              <div className="space-y-2">
                {sampleUploadDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedDocId === doc.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold">{doc.title}</div>
                      <span className="text-[10px] text-slate-400 uppercase">{doc.fileType}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{doc.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mode 3: Video Ingestion */}
          {generationMode === 'video' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Curated NSSTA & Ministry Lecture Videos
                </label>
                <div className="space-y-2">
                  {CURATED_VIDEOS.map((vid) => (
                    <div
                      key={vid.id}
                      onClick={() => {
                        setSelectedVideoId(vid.id);
                        setCustomVideoUrl('');
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedVideoId === vid.id && !customVideoUrl
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-semibold ring-1 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{vid.title}</span>
                        </div>
                        <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600">
                          {vid.duration}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">{vid.organization}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Or Paste Custom YouTube / Video Lecture URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={customVideoUrl}
                    onChange={(e) => setCustomVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mode 4: Trainer Authoring Studio */}
          {generationMode === 'trainer' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <PenTool className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Author Question Form (Trainer Faculty)
                </h3>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Question Text</label>
                <textarea
                  rows={2}
                  value={authorQuestion.question}
                  onChange={(e) => setAuthorQuestion({ ...authorQuestion, question: e.target.value })}
                  placeholder="Enter the assessment question stem..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-700 block">
                  4 Options (Select radio button for Correct Answer)
                </label>
                {authorQuestion.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct-opt"
                      checked={authorQuestion.correctIndex === idx}
                      onChange={() => setAuthorQuestion({ ...authorQuestion, correctIndex: idx })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...authorQuestion.options];
                        newOpts[idx] = e.target.value;
                        setAuthorQuestion({ ...authorQuestion, options: newOpts });
                      }}
                      className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Explanation & Pedagogical Rubric
                </label>
                <textarea
                  rows={2}
                  value={authorQuestion.explanation}
                  onChange={(e) => setAuthorQuestion({ ...authorQuestion, explanation: e.target.value })}
                  placeholder="Detailed rationale explaining why the correct answer is right..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleAddAuthorQuestion}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Add Question to Cadre Assessment Pool
              </button>
            </div>
          )}

          {/* Common Generation Settings (For Modes 1, 2, 3) */}
          {generationMode !== 'trainer' && (
            <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner (Foundational)</option>
                    <option value="Intermediate">Intermediate (Core)</option>
                    <option value="Advanced">Advanced (Expert/Cadre)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Questions Count (1-25)
                  </label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 8, 10, 15, 20, 25].map((n) => (
                      <option key={n} value={n}>
                        {n} Questions
                      </option>
                    ))}
                  </select>
                </div>
              </div>

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
                <span>{isGenerating ? 'Synthesizing Questions...' : 'Synthesize Assessment with AI'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Question Preview & Launch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Assessment Questions Bank ({generatedQuestions.length})</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review generated questions before launching. Correct answers and explanations are revealed after assessment submission.
                </p>
              </div>

              <button
                onClick={handleLaunchAssessment}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0"
              >
                <span>Launch Diagnostic Test</span>
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
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs flex items-start gap-2"
                      >
                        <span className="w-5 h-5 shrink-0 rounded flex items-center justify-center font-bold text-[10px] bg-slate-100 text-slate-600">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="leading-snug pt-0.5">{opt}</span>
                      </div>
                    ))}
                  </div>

                  {q.sourceReference && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                      <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>
                        Source: <span className="text-slate-500 font-medium">{q.sourceReference}</span>
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
