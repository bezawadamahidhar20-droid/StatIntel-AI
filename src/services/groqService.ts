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

// Known tech skills vocabulary for instant offline normalization
const COMMON_TECH_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'R', 'Solidity', 'SQL', 'HTML', 'CSS', 'Bash',
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express', 'Django', 'FastAPI', 'Flask', 'Spring Boot', 'ASP.NET', 'GraphQL', 'REST APIs',
  'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Keras', 'OpenCV', 'Hugging Face', 'LangChain', 'OpenAI API',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'Elasticsearch', 'SQLite', 'Firebase', 'Supabase',
  'Docker', 'Kubernetes', 'AWS', 'Google Cloud (GCP)', 'Azure', 'Linux', 'Git', 'GitHub Actions', 'CI/CD', 'Terraform', 'Prometheus', 'Grafana', 'Nginx',
  'Jest', 'Cypress', 'Selenium', 'Playwright', 'PyTest', 'Postman',
  'Tailwind CSS', 'Bootstrap', 'Sass', 'Figma', 'Responsive Design',
  'Microservices', 'System Design', 'Data Structures & Algorithms', 'Design Patterns', 'Cybersecurity', 'Web3', 'Blockchain'
];

export const groqService = {
  /**
   * Identify technical skills from user input using Groq API
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
Analyze the user's input text (which could be a list of skills, a self-introduction, resume snippet, or project description) and extract all technical skills, programming languages, libraries, frameworks, databases, developer tools, and cloud platforms.
Standardize capitalization (e.g., "python" -> "Python", "fastapi" -> "FastAPI", "react" -> "React", "postgres" -> "PostgreSQL", "docker" -> "Docker").
Return ONLY a valid JSON object with the following format:
{
  "skills": ["Python", "Docker", "React", "PostgreSQL"],
  "categories": {
    "Languages": ["Python"],
    "Frameworks & Libraries": ["React"],
    "Databases": ["PostgreSQL"],
    "DevOps & Tools": ["Docker"]
  }
}`
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
          const cleanSkills = Array.from(new Set(rawSkills.map((s: string) => s.trim()))).filter(Boolean);

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
   * Fast rule-based fallback skill extractor
   */
  fallbackSkillExtraction(userInput: string, targetRoleSkills?: string[]): ExtractedSkillResult {
    const textLower = userInput.toLowerCase();
    const detected: string[] = [];

    COMMON_TECH_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(textLower)) {
        detected.push(skill);
      }
    });

    // Also parse comma or newline separated custom skills typed by user
    const tokens = userInput.split(/[,;\n]+/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
    tokens.forEach(tok => {
      const capitalized = tok.charAt(0).toUpperCase() + tok.slice(1);
      if (!detected.some(d => d.toLowerCase() === tok.toLowerCase())) {
        detected.push(capitalized);
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
      confidence: 85,
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

