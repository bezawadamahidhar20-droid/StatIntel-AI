/**
 * StatIntel AI - Google Gemini API Client Service
 * Supports direct client-side calls to Google Gemini REST API using user-provided key,
 * with resilient fallback to built-in curriculum intelligence if no key is configured.
 */

export interface GeminiQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceReference: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CareerGuidanceResult {
  role: string;
  readinessScore: number;
  skillsMastered: string[];
  skillsToLearn: { name: string; importance: 'High' | 'Medium'; estimatedHours: number; description: string }[];
  recommendedBooks: {
    title: string;
    author: string;
    level: string;
    coverColor: string;
    keyChapters: string;
    summary: string;
  }[];
  aiAdvice: string;
}

// Curated Book Catalog by Domain
export const CURATED_BOOKS = [
  {
    id: 'book-1',
    title: 'Python for Data Analysis (3rd Edition)',
    author: 'Wes McKinney (Creator of Pandas)',
    roles: ['Data Analyst', 'Machine Learning Engineer'],
    level: 'Essential',
    coverColor: 'from-amber-500 to-orange-600',
    keyChapters: 'Ch 4 (NumPy Basics), Ch 5 (Pandas), Ch 8 (Data Wrangling), Ch 9 (Plotting with Matplotlib & Seaborn)',
    summary: 'The authoritative practical guide for data manipulation and visualization using Python, NumPy, and Pandas.',
  },
  {
    id: 'book-2',
    title: 'Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow (3rd Edition)',
    author: 'Aurélien Géron',
    roles: ['Machine Learning Engineer', 'Data Scientist'],
    level: 'Core Foundation',
    coverColor: 'from-blue-600 to-indigo-700',
    keyChapters: 'Ch 1 (The ML Landscape), Ch 2 (End-to-End ML Project), Ch 3 (Classification), Ch 4 (Training Models), Ch 10 (Neural Networks)',
    summary: 'Best-in-class practical book for learning classification, regression, feature engineering, and neural networks with Scikit-Learn and PyTorch/TensorFlow.',
  },
  {
    id: 'book-3',
    title: 'An Introduction to Statistical Learning (ISLR with Python/R)',
    author: 'Gareth James, Daniela Witten, Trevor Hastie, Robert Tibshirani',
    roles: ['Data Analyst', 'Statistical Scientist & ISS Officer', 'Machine Learning Engineer'],
    level: 'Must-Read',
    coverColor: 'from-emerald-600 to-teal-700',
    keyChapters: 'Ch 2 (Statistical Learning Overview), Ch 3 (Linear Regression), Ch 4 (Classification & Logistic), Ch 5 (Resampling & Cross-Validation)',
    summary: 'The gold standard textbook bridging classical statistics with modern machine learning, written by Stanford professors.',
  },
  {
    id: 'book-4',
    title: 'Sampling Techniques (3rd Edition)',
    author: 'William G. Cochran (Harvard University)',
    roles: ['Statistical Scientist & ISS Officer', 'Data Analyst'],
    level: 'National Standard',
    coverColor: 'from-rose-600 to-red-700',
    keyChapters: 'Ch 2 (Simple Random Sampling), Ch 3 (Sampling for Proportions), Ch 5 (Stratified Random Sampling), Ch 9 (Cluster Sampling)',
    summary: 'The official reference textbook prescribed by MoSPI and UPSC Indian Statistical Service (ISS) for survey and sampling design.',
  },
  {
    id: 'book-5',
    title: 'Storytelling with Data: A Data Visualization Guide for Business',
    author: 'Cole Nussbaumer Knaflic',
    roles: ['Data Analyst', 'Business Intelligence Analyst'],
    level: 'Practical',
    coverColor: 'from-purple-600 to-indigo-800',
    keyChapters: 'Ch 2 (Choosing an Effective Visual), Ch 3 (Clutter is Your Enemy), Ch 4 (Focus Your Audience’s Attention), Ch 6 (How to Tell a Story)',
    summary: 'Teaches how to eliminate chart clutter and craft compelling executive dashboards using Matplotlib, Seaborn, and modern visualization techniques.',
  },
  {
    id: 'book-6',
    title: 'Practical Statistics for Data Scientists (2nd Edition)',
    author: 'Peter Bruce & Andrew Bruce',
    roles: ['Data Analyst', 'Machine Learning Engineer', 'Statistical Scientist & ISS Officer'],
    level: 'Practical Bridge',
    coverColor: 'from-cyan-600 to-blue-700',
    keyChapters: 'Ch 1 (Exploratory Data Analysis), Ch 2 (Data Sampling & Distributions), Ch 3 (Statistical Experiments & Significance Testing), Ch 4 (Regression)',
    summary: 'A fast-paced guide for coders explaining what statistical concepts (p-values, distributions, confidence intervals) really mean in real code.',
  },
];

// Role Skill Benchmarks
export const ROLE_SKILL_BENCHMARKS: Record<string, {
  name: string;
  description: string;
  allSkills: { id: string; name: string; category: string; description: string; importance: 'High' | 'Medium' }[];
}> = {
  'Data Analyst': {
    name: 'Data Analyst',
    description: 'Transform raw datasets into actionable statistical insights, dashboards, and executive reports.',
    allSkills: [
      { id: 'py_basics', name: 'Python Core Syntax', category: 'Programming', description: 'Variables, loops, functions, lists, dicts', importance: 'High' },
      { id: 'numpy', name: 'NumPy Arrays & Math', category: 'Libraries', description: 'Vectorized math, array slicing, matrix operations', importance: 'High' },
      { id: 'pandas', name: 'Pandas Data Wrangling', category: 'Libraries', description: 'DataFrames, merge, groupby, missing data, filtering', importance: 'High' },
      { id: 'matplotlib', name: 'Matplotlib Visualizations', category: 'Visualization', description: 'Line, bar, scatter, histograms, subplots', importance: 'High' },
      { id: 'seaborn', name: 'Seaborn Statistical Plots', category: 'Visualization', description: 'Heatmaps, pairplots, distribution plots', importance: 'Medium' },
      { id: 'sql', name: 'SQL & Database Querying', category: 'Data', description: 'SELECT, JOINs, GROUP BY, aggregations, subqueries', importance: 'High' },
      { id: 'stats', name: 'Statistical Testing & EDA', category: 'Statistics', description: 'Mean/median, standard deviation, t-test, p-values', importance: 'High' },
      { id: 'bi_tools', name: 'Power BI / Excel Dashboards', category: 'Reporting', description: 'Pivot tables, VLOOKUP/XLOOKUP, interactive dashboards', importance: 'Medium' },
    ],
  },
  'Machine Learning Engineer': {
    name: 'Machine Learning Engineer',
    description: 'Design, train, validate, and deploy predictive models and deep learning pipelines.',
    allSkills: [
      { id: 'py_oop', name: 'Python OOP & Modularity', category: 'Programming', description: 'Classes, methods, inheritance, packages', importance: 'High' },
      { id: 'numpy_linalg', name: 'NumPy & Linear Algebra', category: 'Math', description: 'Matrix dot products, eigenvalues, tensor shapes', importance: 'High' },
      { id: 'pandas_feat', name: 'Pandas Feature Engineering', category: 'Data', description: 'One-hot encoding, scaling, imputation, pipelines', importance: 'High' },
      { id: 'sklearn', name: 'Scikit-Learn Algorithms', category: 'Machine Learning', description: 'Linear/Logistic regression, Trees, Random Forests, SVM', importance: 'High' },
      { id: 'model_eval', name: 'Model Evaluation Metrics', category: 'Machine Learning', description: 'ROC-AUC, Precision, Recall, F1-score, Cross-validation', importance: 'High' },
      { id: 'pytorch', name: 'PyTorch / Neural Networks', category: 'Deep Learning', description: 'Tensors, autograd, forward/backward pass, loss functions', importance: 'Medium' },
      { id: 'mlops', name: 'MLOps & Model Deployment', category: 'Engineering', description: 'FastAPI model serving, Docker, MLflow, tracking', importance: 'Medium' },
      { id: 'opt_math', name: 'Optimization & Calculus', category: 'Math', description: 'Gradient descent, learning rates, loss surfaces', importance: 'Medium' },
    ],
  },
  'Statistical Scientist & ISS Officer': {
    name: 'Official Statistical Scientist (MoSPI / ISS)',
    description: 'Design national sample surveys, estimate economic indicators, and ensure rigorous official data governance.',
    allSkills: [
      { id: 'prob_dist', name: 'Probability & Distributions', category: 'Theory', description: 'Normal, Binomial, Poisson, Chi-square, F, t-distribution', importance: 'High' },
      { id: 'sampling', name: 'Sampling Theory & Methods', category: 'Survey', description: 'Simple Random, Stratified, PPS, Cluster, Multi-stage sampling', importance: 'High' },
      { id: 'timeseries', name: 'Time Series & Forecasting', category: 'Modeling', description: 'ARIMA, moving averages, seasonal decomposition, CPI/IIP', importance: 'High' },
      { id: 'econometrics', name: 'Econometric Modeling', category: 'Economics', description: 'Multiple linear regression, heteroskedasticity, multicollinearity', importance: 'High' },
      { id: 'survey_design', name: 'MoSPI / NSSO Methodology', category: 'Official Data', description: 'Household Consumer Expenditure Survey, PLFS, ASI schedules', importance: 'High' },
      { id: 'python_r', name: 'Statistical Computing (R/Python)', category: 'Computing', description: 'Microdata extraction, multiplier weighting, survey packages', importance: 'High' },
      { id: 'dpdp_gov', name: 'Data Governance & DPDP Act', category: 'Governance', description: 'Anonymization, privacy, metadata standards, official cataloging', importance: 'Medium' },
    ],
  },
};

class GeminiService {
  /**
   * Returns the currently configured Gemini API Key from localStorage or environment
   */
  public getApiKey(): string {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gemini_api_key');
      if (stored && stored.trim().length > 5) return stored.trim();
    }
    return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  }

  public setApiKey(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gemini_api_key', key.trim());
    }
  }

  /**
   * Generate grounded multiple-choice questions for any topic using Google Gemini REST API,
   * falling back to smart dynamic generation if offline or API key is absent.
   */
  public async generateTopicQuiz(params: {
    topic: string;
    numQuestions: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    apiKey?: string;
  }): Promise<GeminiQuizQuestion[]> {
    const key = params.apiKey || this.getApiKey();

    if (key) {
      try {
        const prompt = `You are a Senior Statistical & Computer Science Examiner for university students and data science aspirants.
Generate exactly ${params.numQuestions} high-quality Multiple Choice Questions (MCQs) on the topic: "${params.topic}".
Target Difficulty: ${params.difficulty}.

Ensure questions test practical understanding (e.g. what function in NumPy/Pandas/Scikit-Learn to use, formula interpretation, or statistical reasoning).
Provide the result as a strict JSON array of objects with keys:
- "id": string like "q-1", "q-2"
- "question": string with the question text
- "options": array of exactly 4 strings
- "correctIndex": integer 0 to 3
- "explanation": string explaining why the correct answer is right and why others are wrong
- "sourceReference": string specifying the textbook or library documentation (e.g. "NumPy v1.26 Docs", "Wes McKinney Python for Data Analysis Ch 4")
- "difficulty": "${params.difficulty}"

Output ONLY the raw JSON array. No markdown code blocks, no backticks, no conversational text.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json',
            },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const cleanText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            if (Array.isArray(parsed) && parsed.length > 0) {
              return parsed;
            }
          }
        }
      } catch (err) {
        console.warn('[GeminiService] Live Gemini API call failed, falling back to smart generation:', err);
      }
    }

    // Dynamic offline generator matching the topic
    return this.generateSmartFallbackQuiz(params.topic, params.numQuestions, params.difficulty);
  }

  /**
   * Smart fallback questions covering NumPy, Matplotlib, Pandas, ML, Statistics, and MoSPI sampling
   */
  private generateSmartFallbackQuiz(
    topic: string,
    numQuestions: number,
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  ): GeminiQuizQuestion[] {
    const topicLower = topic.toLowerCase();

    const pool: GeminiQuizQuestion[] = [];

    if (topicLower.includes('numpy') || topicLower.includes('array') || topicLower.includes('python')) {
      pool.push(
        {
          id: 'q-num-1',
          question: 'In NumPy, how do you perform element-wise multiplication between two 2D arrays A and B of identical shape?',
          options: ['A * B', 'np.dot(A, B)', 'np.multiply_matrices(A, B)', 'A @ B'],
          correctIndex: 0,
          explanation: 'In NumPy, the "*" operator performs element-wise multiplication. Matrix multiplication is done using "@" or "np.matmul()".',
          sourceReference: 'NumPy v1.26 Reference Manual • Vectorized Arithmetic',
          difficulty,
        },
        {
          id: 'q-num-2',
          question: 'Which NumPy method creates an array of 50 evenly spaced numbers between 0 and 10, inclusive?',
          options: ['np.arange(0, 10, 50)', 'np.linspace(0, 10, 50)', 'np.interval(0, 10, 50)', 'np.grid(0, 10, 50)'],
          correctIndex: 1,
          explanation: 'np.linspace(start, stop, num) specifies the exact number of evenly spaced samples including both endpoints by default.',
          sourceReference: 'Python for Data Analysis by Wes McKinney • Ch 4',
          difficulty,
        },
        {
          id: 'q-num-3',
          question: 'What is the shape of a NumPy array created by arr = np.zeros((3, 4, 2))?',
          options: ['3 rows, 4 columns, 2 depth (3D tensor)', '2 rows, 4 columns, 3 depth', '12 rows, 2 columns', '24 elements in a 1D vector'],
          correctIndex: 0,
          explanation: 'The tuple (3, 4, 2) represents 3 matrices of size 4 rows by 2 columns, totaling 24 elements in 3 dimensions.',
          sourceReference: 'NumPy Array Manipulation Architecture',
          difficulty,
        }
      );
    }

    if (topicLower.includes('matplot') || topicLower.includes('plot') || topicLower.includes('visual')) {
      pool.push(
        {
          id: 'q-plt-1',
          question: 'In Matplotlib (pyplot), which function creates a grid of subplots returning both the Figure and Axes array?',
          options: ['plt.figure_grid()', 'plt.subplots(nrows, ncols)', 'plt.make_axes()', 'plt.multiplot()'],
          correctIndex: 1,
          explanation: 'fig, axes = plt.subplots(nrows, ncols) is the standard object-oriented interface for generating multiple subplots.',
          sourceReference: 'Storytelling with Data & Matplotlib Documentation',
          difficulty,
        },
        {
          id: 'q-plt-2',
          question: 'When visualizing the probability distribution of a continuous statistical variable, which Matplotlib function is most appropriate?',
          options: ['plt.bar()', 'plt.hist(data, bins=30, density=True)', 'plt.pie()', 'plt.scatter_matrix()'],
          correctIndex: 1,
          explanation: 'plt.hist() with density=True normalizes bin heights so the total area equals 1, representing probability density.',
          sourceReference: 'Practical Statistics for Data Scientists Ch 1',
          difficulty,
        },
        {
          id: 'q-plt-3',
          question: 'How do you prevent overlapping axis labels and titles across multiple subplots in Matplotlib?',
          options: ['plt.tight_layout()', 'plt.clear_overlap()', 'plt.adjust_padding()', 'plt.autoscale(False)'],
          correctIndex: 0,
          explanation: 'plt.tight_layout() automatically adjusts subplot params so that subplots and labels fit cleanly within the figure area.',
          sourceReference: 'Python Data Science Handbook • Visualization',
          difficulty,
        }
      );
    }

    if (topicLower.includes('pandas') || topicLower.includes('wrangling') || topicLower.includes('data')) {
      pool.push(
        {
          id: 'q-pan-1',
          question: 'In Pandas, which method groups data by categorical columns and computes aggregate statistical measures (mean, sum)?',
          options: ['df.aggregate_by()', 'df.groupby()', 'df.pivot_table()', 'df.cluster()'],
          correctIndex: 1,
          explanation: 'df.groupby(["column"]).agg({"metric": "mean"}) implements the split-apply-combine workflow for grouped summaries.',
          sourceReference: 'Wes McKinney Python for Data Analysis • Ch 10',
          difficulty,
        },
        {
          id: 'q-pan-2',
          question: 'How do you check for and count missing (null / NaN) values per column in a Pandas DataFrame df?',
          options: ['df.isnull().sum()', 'df.count_missing()', 'df.dropna(axis=1)', 'df.isna().count()'],
          correctIndex: 0,
          explanation: 'df.isnull().sum() creates a boolean mask of missing values and sums True (1) per column.',
          sourceReference: 'Pandas User Guide • Missing Data Handling',
          difficulty,
        }
      );
    }

    if (topicLower.includes('learning') || topicLower.includes('machine') || topicLower.includes('model') || topicLower.includes('scikit')) {
      pool.push(
        {
          id: 'q-ml-1',
          question: 'In Scikit-Learn, why must the StandardScaler be fit ONLY on the training set (fit_transform) and NOT on the test set (transform only)?',
          options: [
            'To prevent data leakage from the test set into training',
            'Because the test set has no mean or standard deviation',
            'To reduce training computational time',
            'Scikit-Learn raises a ValueError if you fit on test data',
          ],
          correctIndex: 0,
          explanation: 'Fitting scalers on test data causes data leakage, as test distribution statistics would bias model training.',
          sourceReference: 'Hands-On Machine Learning by Aurélien Géron • Ch 2',
          difficulty,
        },
        {
          id: 'q-ml-2',
          question: 'Which metric is most informative when evaluating a classification model trained on a heavily imbalanced dataset (e.g. 99% negative, 1% positive)?',
          options: ['Overall Accuracy', 'Precision-Recall AUC (PR-AUC) or F1-score', 'Mean Squared Error (MSE)', 'R-squared (R²)'],
          correctIndex: 1,
          explanation: 'A trivial model predicting always negative gets 99% accuracy. PR-AUC and F1-score specifically evaluate true positive discovery under severe imbalance.',
          sourceReference: 'An Introduction to Statistical Learning (ISLR) • Ch 4',
          difficulty,
        }
      );
    }

    // Default statistical and sampling questions if specific topic pool is short
    pool.push(
      {
        id: 'q-stat-gen-1',
        question: `Regarding ${topic}: What is the primary difference between Population Parameter and Sample Statistic?`,
        options: [
          'Parameters describe the whole population (fixed, often unknown); statistics are calculated from sample data',
          'Statistics are always larger than parameters',
          'Parameters are estimated with Python, statistics with Excel',
          'There is no difference in modern data science',
        ],
        correctIndex: 0,
        explanation: 'A parameter is a fixed numerical characteristic of the entire population (e.g. μ), while a statistic is an estimator computed from sample data (e.g. x̄).',
        sourceReference: 'Sampling Techniques by William G. Cochran • Ch 2',
        difficulty,
      },
      {
        id: 'q-stat-gen-2',
        question: `When building an analytical pipeline for ${topic}, what is the Central Limit Theorem (CLT) guarantee?`,
        options: [
          'The sample mean distribution approaches normal as sample size increases, regardless of population distribution shape',
          'Every population must follow a bell-shaped normal curve',
          'Larger samples always produce a smaller mean',
          'All variance drops to zero if n > 30',
        ],
        correctIndex: 0,
        explanation: 'The Central Limit Theorem guarantees that the distribution of sample means approaches normality as n increases, provided variance is finite.',
        sourceReference: 'Practical Statistics for Data Scientists • Ch 2',
        difficulty,
      }
    );

    return pool.slice(0, numQuestions);
  }

  /**
   * Search what a student should learn for their target career job,
   * calculating exact gap metrics and book recommendations.
   */
  public async getCareerRoadmapGuidance(
    targetRole: string,
    knownSkills: string[],
    apiKey?: string
  ): Promise<CareerGuidanceResult> {
    const benchmark = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS['Data Analyst'];

    const mastered = benchmark.allSkills.filter((s) =>
      knownSkills.some((k) => k.toLowerCase().includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(k.toLowerCase()))
    );

    const toLearn = benchmark.allSkills.filter((s) => !mastered.some((m) => m.id === s.id)).map((s) => ({
      name: s.name,
      importance: s.importance,
      estimatedHours: s.importance === 'High' ? 14 : 8,
      description: s.description,
    }));

    const readinessScore = Math.round((mastered.length / (benchmark.allSkills.length || 1)) * 100);

    const books = CURATED_BOOKS.filter((b) => b.roles.includes(targetRole) || b.roles.includes('Data Analyst')).slice(0, 4);

    let aiAdvice = `Based on your profile, you already have ${mastered.length} core competencies. Focus your next 3 weeks on ${toLearn.slice(0, 2).map((s) => s.name).join(' and ')} to reach job-readiness for 2026 entry-level roles.`;

    const key = apiKey || this.getApiKey();
    if (key) {
      try {
        const prompt = `Student knows: ${knownSkills.join(', ')}. Target role: ${targetRole}.
In 2 concise, highly encouraging sentences, tell them the exact modern library, tool, and study tip they should focus on next for 2026 hiring standards.`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        });
        if (res.ok) {
          const data = await res.json();
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) aiAdvice = reply.trim();
        }
      } catch (e) {
        // keep fallback advice
      }
    }

    return {
      role: targetRole,
      readinessScore,
      skillsMastered: mastered.map((s) => s.name),
      skillsToLearn: toLearn,
      recommendedBooks: books,
      aiAdvice,
    };
  }
}

export const geminiService = new GeminiService();
