export type UserRole = 'LEARNER' | 'ADMIN' | 'TRAINER';

export interface User {
  id: string;
  name: string;
  designation: string;
  department: string;
  cadre: string; // e.g. "Indian Statistical Service (ISS) - Batch 2019"
  employeeId: string;
  email: string;
  avatar: string;
  role: UserRole;
  overallCompetency: number;
  roleReadiness: number;
  criticalGapsCount: number;
  learningHours: number;
  assessmentAverage: number;
  institution?: string;
  degree?: string;
  academicYear?: string;
  targetGoal?: string;
}

export type CompetencyDomain = 'Statistical' | 'Technical' | 'Digital Governance' | 'Behavioural & Managerial';

export type CompetencyLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface Competency {
  id: string;
  name: string;
  domain: CompetencyDomain;
  currentLevel: CompetencyLevel;
  requiredLevel: CompetencyLevel;
  currentScore: number; // 0 - 100
  requiredScore: number; // 0 - 100
  gap: number; // current - required (negative means gap)
  confidence: number; // AI confidence in assessment (e.g. 94%)
  status: 'Critical Gap' | 'Moderate Gap' | 'Target Met' | 'Exceeds';
  description: string;
  evidenceSources: {
    type: 'Assessment' | 'Training' | 'Experience' | 'Certification';
    title: string;
    date: string;
    score?: string;
  }[];
  trend: 'increasing' | 'stable' | 'needs_refresh';
  lastAssessed: string;
  historicalScores: { date: string; score: number }[];
  recommendedCourseIds: string[];
}

export interface SkillGapItem {
  id: string;
  competencyId: string;
  competencyName: string;
  domain: CompetencyDomain;
  currentLevel: CompetencyLevel;
  requiredLevel: CompetencyLevel;
  currentScore: number;
  requiredScore: number;
  gapLevels: number;
  severity: 'Critical' | 'Medium' | 'Low';
  roleRelevance: number; // e.g. 95%
  priorityRank: number;
  estimatedTimeToBridge: string; // e.g. "12-16 hours"
  recommendedCourseId: string;
  rationale: string;
}

export interface Course {
  id: string;
  title: string;
  provider: 'iGOT Karmayogi' | 'NSSTA TPAC' | 'MoSPI Training Division';
  domain: CompetencyDomain;
  competenciesCovered: string[];
  duration: string; // e.g. "6 hours"
  durationHours: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  rating: number;
  reviewCount: number;
  matchScore: number; // e.g. 96%
  status: 'Recommended' | 'In Progress' | 'Completed' | 'Not Started';
  progress?: number; // 0 - 100
  description: string;
  whyRecommended: {
    summary: string;
    gapAddressed: string;
    expectedImprovement: string;
    factors: {
      label: string;
      percentage: number;
    }[];
  };
  modules: {
    id: string;
    title: string;
    duration: string;
    completed?: boolean;
  }[];
  prerequisites: string[];
  outcomes: string[];
}

export interface LearningPathStep {
  stepNumber: number;
  courseId: string;
  courseTitle: string;
  provider: 'iGOT Karmayogi' | 'NSSTA TPAC' | 'MoSPI Training Division';
  domain: CompetencyDomain;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  matchScore: number;
  competenciesImproved: string[];
  expectedImprovement: string;
  status: 'Completed' | 'In Progress' | 'Up Next' | 'Locked';
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  competency: string;
  sourceReference: string; // e.g. "Page 12 — Sampling_Methodology_NSSO_78.pdf"
  approved: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  domain: CompetencyDomain;
  targetCompetency: string;
  sourceDocName?: string;
  totalQuestions: number;
  durationMinutes: number;
  questions: Question[];
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Adaptive';
  createdBy: 'AI Generator' | 'NSSTA Faculty' | 'System';
}

export interface QuizResult {
  assessmentId: string;
  assessmentTitle: string;
  targetCompetency: string;
  score: number;
  total: number;
  accuracy: number;
  timeSpentSeconds: number;
  competencyBefore: number;
  competencyAfter: number;
  competencyGain: number;
  answers: {
    questionId: string;
    selectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
  }[];
  timestamp: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'course_completed' | 'quiz_passed' | 'competency_upgraded' | 'certificate_earned';
  title: string;
  description: string;
  badge: string;
  competencyAffected?: string;
  levelChange?: string;
}

export interface Certificate {
  id: string;
  credentialId: string;
  courseTitle: string;
  provider: string;
  issueDate: string;
  expiryDate?: string;
  recipientName: string;
  recipientRole: string;
  competenciesAcquired: string[];
  grade: string;
  verificationUrl: string;
}

export interface DepartmentHeatmapRow {
  department: string;
  totalStaff: number;
  readinessScore: number;
  scores: {
    competency: string;
    score: number; // 0-100
    gapSeverity: 'Normal' | 'Moderate' | 'Critical';
    staffAffected: number;
  }[];
}

export interface PredictiveSkillItem {
  skill: string;
  currentDemand: number;
  projectedGrowth: number; // percentage e.g. +42%
  urgency: 'High' | 'Medium' | 'Emerging';
  drivers: string;
  targetOfficers: number;
}

export interface WorkforceOverview {
  totalLearners: number;
  activeLearners: number;
  overallReadiness: number;
  criticalGapsCount: number;
  heatmap: DepartmentHeatmapRow[];
  predictiveSkills: PredictiveSkillItem[];
}

export interface LearningPathResponse {
  targetCompetency: string;
  targetLevel: string;
  estimatedDuration: string;
  overallProgress: number;
  steps: LearningPathStep[];
}

