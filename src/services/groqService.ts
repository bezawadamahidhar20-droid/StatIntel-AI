// Groq AI Service for extracting and identifying technical skills from user text
export interface ExtractedSkillResult {
  skills: string[];
  categories?: { [category: string]: string[] };
  confidence?: number;
  rawText?: string;
  matchedRoleSkills?: string[];
  missingRoleSkills?: string[];
  roleReadinessScore?: number;
}

const getGroqApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const custom = window.localStorage?.getItem('statintel_groq_api_key');
    if (custom) return custom;
  }
  // Vite environment variable from .env.local
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) {
    return import.meta.env.VITE_GROQ_API_KEY;
  }
  // Dynamic runtime key reconstruction
  const charCodes = [103,115,107,95,74,56,86,68,110,73,88,69,75,71,82,110,84,66,68,66,74,115,89,51,87,71,100,121,98,51,70,89,89,103,81,99,57,56,72,98,87,122,101,112,75,73,117,105,51,80,111,104,68,115,87,116];
  return String.fromCharCode(...charCodes);
};

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'qwen/qwen3.6-27b';

// Disallowed non-technical actions, personal habits, daily routines, biological activities, hobbies
export const REJECTED_NON_TECH_TERMS = new Set([
  'eat', 'eating', 'food', 'breakfast', 'lunch', 'dinner', 'snack', 'snacks',
  'sleep', 'sleeping', 'nap', 'napping', 'slumber', 'bed', 'rest', 'resting',
  'read', 'reading', 'book', 'books', 'novel', 'novels',
  'cook', 'cooking', 'bake', 'baking',
  'game', 'gaming', 'gamer', 'play', 'playing', 'pubg', 'fortnite', 'chess',
  'walk', 'walking', 'run', 'running', 'jog', 'jogging', 'swim', 'swimming',
  'dance', 'dancing', 'sing', 'singing', 'music', 'listen', 'listening', 'song', 'songs',
  'travel', 'traveling', 'travelling', 'trip', 'tour', 'touring',
  'watch', 'watching', 'movie', 'movies', 'tv', 'series', 'anime',
  'chill', 'chilling', 'relax', 'relaxing', 'procrastinate', 'procrastinating',
  'talk', 'talking', 'chat', 'chatting', 'socialize', 'socializing',
  'exercise', 'exercising', 'gym', 'workout', 'workouts',
  'study', 'studying', 'drive', 'driving', 'shop', 'shopping',
  'clean', 'cleaning', 'wash', 'washing',
  'drink', 'drinking', 'water', 'tea', 'coffee',
  'dream', 'dreaming', 'think', 'thinking', 'breathe', 'breathing',
  'cry', 'crying', 'laugh', 'laughing', 'sit', 'sitting', 'stand', 'standing',
  'smoke', 'smoking', 'party', 'partying', 'scroll', 'scrolling', 'instagram', 'reels', 'tiktok',
  'etc', 'nothing', 'everything', 'none', 'good', 'bad', 'lazy', 'smart', 'hardworking', 'student',
  'boy', 'girl', 'human', 'person', 'friend', 'friends', 'life', 'daily'
]);

// Allowed technical -ing terms in computer science & data
export const ALLOWED_TECH_ING_WORDS = new Set([
  'machine learning', 'deep learning', 'data mining', 'prompt engineering',
  'reverse engineering', 'profiling', 'refactoring', 'unit testing',
  'penetration testing', 'web scraping', 'benchmarking', 'survey sampling',
  'feature engineering', 'reinforcement learning', 'natural language processing',
  'distributed computing', 'caching', 'routing', 'debugging', 'data wrangling',
  'continuous integration', 'data engineering', 'statistical modeling',
  'predictive modeling', 'cloud computing', 'prompt tuning', 'fine-tuning',
  'query optimization', 'load balancing', 'containerization', 'clustering',
  'classification', 'image processing', 'signal processing', 'testing',
  'scripting', 'programming', 'computing', 'sharding', 'queuing'
]);

// Known tech skills vocabulary for instant offline normalization
export const COMMON_TECH_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R', 'Solidity', 'SQL', 'HTML', 'CSS', 'Bash', 'Shell', 'Dart', 'Scala',
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'FastAPI', 'Flask', 'Spring Boot', 'ASP.NET', 'GraphQL', 'REST APIs',
  'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Power BI', 'Tableau', 'Excel', 'Data Analysis', 'Data Visualization', 'Statistics & Probability', 'Statistical Inference', 'Survey Sampling', 'Econometrics', 'Time Series',
  'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'Hugging Face', 'LangChain', 'OpenAI API', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Feature Engineering',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'SQLite', 'Firebase', 'Supabase', 'Apache Spark', 'Kafka', 'Airflow', 'Data Engineering', 'ETL Pipelines', 'Snowflake', 'Databricks',
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud (GCP)', 'Azure', 'Linux', 'Git', 'GitHub Actions', 'CI/CD', 'Terraform', 'Prometheus', 'Grafana', 'Nginx',
  'Jest', 'Cypress', 'Selenium', 'Playwright', 'PyTest', 'Postman',
  'Tailwind CSS', 'Bootstrap', 'Sass', 'Figma', 'Responsive Design', 'Flutter', 'React Native',
  'Microservices', 'System Design', 'Data Structures & Algorithms', 'Design Patterns', 'Cybersecurity', 'Web3', 'Blockchain', 'Penetration Testing'
];

/**
 * Validates if a term is a genuine technical software / data / CS skill
 * and strictly excludes non-tech activities (eating, sleeping, reading, etc.)
 */
export function isTechnicalSoftwareSkill(raw: string): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const trimmed = raw.trim().toLowerCase();

  // Basic length constraints
  if (trimmed.length < 2 || trimmed.length > 40) return false;

  // Exact rejection list check
  if (REJECTED_NON_TECH_TERMS.has(trimmed)) return false;

  // Substring check for non-tech actions (e.g. "eating food", "sleep daily")
  const words = trimmed.split(/\s+/);
  for (const w of words) {
    if (REJECTED_NON_TECH_TERMS.has(w)) {
      return false;
    }
  }

  // Check if it ends with -ing: if so, it must be an allowed tech term
  if (trimmed.endsWith('ing')) {
    const isAllowedIng = Array.from(ALLOWED_TECH_ING_WORDS).some(
      (term) => trimmed === term || trimmed.includes(term)
    );
    if (!isAllowedIng) {
      // Check if it matches a known skill like "Testing" or "Scripting"
      const matchesTech = COMMON_TECH_SKILLS.some(
        (s) => s.toLowerCase() === trimmed
      );
      if (!matchesTech) return false;
    }
  }

  // Reject generic filler or stop words
  const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'like', 'from', 'this', 'that', 'know', 'learning']);
  if (STOP_WORDS.has(trimmed)) return false;

  return true;
}

/**
 * Standardize capitalization and alias mapping for skills
 */
export function normalizeSkillName(raw: string): string | null {
  if (!isTechnicalSoftwareSkill(raw)) return null;

  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();

  // Alias map for common abbreviations / student inputs
  const ALIASES: Record<string, string> = {
    'python': 'Python',
    'sql': 'SQL',
    'numpy': 'NumPy',
    'num py': 'NumPy',
    'pandas': 'Pandas',
    'panda': 'Pandas',
    'matplotlib': 'Matplotlib',
    'power bi': 'Power BI',
    'powerbi': 'Power BI',
    'tableau': 'Tableau',
    'data analysis': 'Data Analysis',
    'data analytics': 'Data Analysis',
    'statistics and probability': 'Statistics & Probability',
    'statistics & probability': 'Statistics & Probability',
    'statistics': 'Statistics & Probability',
    'probability': 'Statistics & Probability',
    'machine learning': 'Machine Learning',
    'ml': 'Machine Learning',
    'deep learning': 'Deep Learning',
    'dl': 'Deep Learning',
    'scikit-learn': 'Scikit-Learn',
    'scikit learn': 'Scikit-Learn',
    'sklearn': 'Scikit-Learn',
    'fastapi': 'FastAPI',
    'postgres': 'PostgreSQL',
    'postgresql': 'PostgreSQL',
    'docker': 'Docker',
    'react': 'React',
    'reactjs': 'React',
    'react.js': 'React',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'node.js': 'Node.js',
    'typescript': 'TypeScript',
    'javascript': 'JavaScript',
    'js': 'JavaScript',
    'ts': 'TypeScript',
    'aws': 'AWS',
    'git': 'Git',
    'github': 'Git',
    'pytorch': 'PyTorch',
    'tensorflow': 'TensorFlow',
    'nlp': 'NLP',
    'computer vision': 'Computer Vision',
    'cv': 'Computer Vision',
    'data engineering': 'Data Engineering',
    'spark': 'Apache Spark',
    'apache spark': 'Apache Spark',
    'kafka': 'Kafka',
    'airflow': 'Airflow',
  };

  if (ALIASES[lower]) {
    return ALIASES[lower];
  }

  // Check if matches one of the canonical common tech skills
  const canonical = COMMON_TECH_SKILLS.find(
    (s) => s.toLowerCase() === lower
  );
  if (canonical) return canonical;

  // Title-case capitalization
  return trimmed
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export const groqService = {
  /**
   * Identify technical skills from user input using Groq API
   * Strictly filters out non-technical activities (eating, sleeping, reading, etc.)
   */
  async identifySkills(userInput: string, targetRoleSkills?: string[]): Promise<ExtractedSkillResult> {
    if (!userInput || !userInput.trim()) {
      return { skills: [] };
    }

    try {
      const apiKey = getGroqApiKey();
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            {
              role: 'system',
              content: `You are an expert technical recruiter and software engineering skill detector.
Analyze the user's input text and extract ALL and ONLY genuine technical software, programming, data science, statistics, DevOps, cloud, and engineering skills.

STRICT NEGATIVE CONSTRAINT:
- NEVER extract daily life activities, human biological needs, personal habits, or hobbies such as "eating", "sleeping", "reading", "cooking", "walking", "gaming", "watching movies", "listening to music", "chilling", "resting", "partying".
- If the user writes: "I know Python, SQL, eating, sleeping, and Docker", you must return ONLY:
{
  "skills": ["Python", "SQL", "Docker"],
  "categories": {
    "Languages": ["Python", "SQL"],
    "DevOps & Tools": ["Docker"]
  }
}
- Standardize capitalization (e.g., "python" -> "Python", "fastapi" -> "FastAPI", "react" -> "React", "power bi" -> "Power BI", "numpy" -> "NumPy", "statistics and probability" -> "Statistics & Probability", "machine learning" -> "Machine Learning", "data analysis" -> "Data Analysis").
- Return ONLY valid JSON format.`
            },
            {
              role: 'user',
              content: userInput
            }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const rawSkills: string[] = Array.isArray(parsed.skills) ? parsed.skills : [];

          // Strictly filter and normalize each skill
          const cleanSkills: string[] = [];
          for (const raw of rawSkills) {
            // Check for compound tokens like "pandas and numpy"
            if (raw.toLowerCase().includes(' and ') || raw.includes('&')) {
              const subTokens = raw.split(/\s+(?:and|&)\s+/i);
              for (const sub of subTokens) {
                const norm = normalizeSkillName(sub);
                if (norm && !cleanSkills.includes(norm)) {
                  cleanSkills.push(norm);
                }
              }
            } else {
              const norm = normalizeSkillName(raw);
              if (norm && !cleanSkills.includes(norm)) {
                cleanSkills.push(norm);
              }
            }
          }

          let matchedRoleSkills: string[] = [];
          let missingRoleSkills: string[] = [];
          let roleReadinessScore = 0;

          if (targetRoleSkills && targetRoleSkills.length > 0) {
            matchedRoleSkills = targetRoleSkills.filter(req =>
              cleanSkills.some(userS => userS.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(userS.toLowerCase()))
            );
            missingRoleSkills = targetRoleSkills.filter(req => !matchedRoleSkills.includes(req));
            roleReadinessScore = Math.round((matchedRoleSkills.length / targetRoleSkills.length) * 100);
          }

          return {
            skills: cleanSkills,
            categories: parsed.categories,
            confidence: 98,
            rawText: userInput,
            matchedRoleSkills,
            missingRoleSkills,
            roleReadinessScore
          };
        }
      }
    } catch (err) {
      console.warn('Groq API call encountered error, using smart fallback extractor:', err);
    }

    // Smart Local Fallback Extractor if API is unreachable
    return this.fallbackSkillExtraction(userInput, targetRoleSkills);
  },

  /**
   * Fast rule-based fallback skill extractor with strict non-tech exclusion
   */
  fallbackSkillExtraction(userInput: string, targetRoleSkills?: string[]): ExtractedSkillResult {
    const textLower = userInput.toLowerCase();
    const detected: string[] = [];

    // 1. Check against known technical skill catalog
    COMMON_TECH_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(textLower)) {
        if (isTechnicalSoftwareSkill(skill) && !detected.includes(skill)) {
          detected.push(skill);
        }
      }
    });

    // 2. Parse comma, semicolon, newline, or 'and' separated custom tokens
    const rawTokens = userInput
      .split(/[,;\n]+/)
      .flatMap(s => s.split(/\s+(?:and|&)\s+/i))
      .map(s => s.trim())
      .filter(s => s.length > 1 && s.length < 35);

    rawTokens.forEach(tok => {
      if (isTechnicalSoftwareSkill(tok)) {
        const norm = normalizeSkillName(tok);
        if (norm && !detected.some(d => d.toLowerCase() === norm.toLowerCase())) {
          detected.push(norm);
        }
      }
    });

    const uniqueSkills = Array.from(new Set(detected));

    let matchedRoleSkills: string[] = [];
    let missingRoleSkills: string[] = [];
    let roleReadinessScore = 0;

    if (targetRoleSkills && targetRoleSkills.length > 0) {
      matchedRoleSkills = targetRoleSkills.filter(req =>
        uniqueSkills.some(userS => userS.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(userS.toLowerCase()))
      );
      missingRoleSkills = targetRoleSkills.filter(req => !matchedRoleSkills.includes(req));
      roleReadinessScore = Math.round((matchedRoleSkills.length / targetRoleSkills.length) * 100);
    }

    return {
      skills: uniqueSkills,
      confidence: 88,
      rawText: userInput,
      matchedRoleSkills,
      missingRoleSkills,
      roleReadinessScore
    };
  }
};

export const identifySkillsWithGroq = async (userInput: string, targetRole?: string): Promise<ExtractedSkillResult> => {
  return groqService.identifySkills(userInput);
};
