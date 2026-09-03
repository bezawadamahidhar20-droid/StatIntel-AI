import { User, Competency, SkillGapItem, Course, Assessment, QuizResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class APIClient {
  private token: string | null = localStorage.getItem('statintel_token');

  public setToken(token: string) {
    self.token = token;
    localStorage.setItem('statintel_token', token);
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();
    if (!response.ok || !json.success) {
      throw new Error(json.error?.message || 'API Request Failed');
    }

    return json.data as T;
  }

  // Auth APIs
  async login(email: string, password: string): Promise<{ user: User; access_token: string }> {
    const data = await this.request<{ user: User; access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.setToken(data.access_token);
    return data;
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  // Competency Digital Twin APIs
  async getCompetencyTwin(): Promise<{ overallCompetency: number; competencies: Competency[] }> {
    return this.request<{ overallCompetency: number; competencies: Competency[] }>('/users/me/competency-twin');
  }

  // Skill Gaps APIs
  async getSkillGaps(): Promise<SkillGapItem[]> {
    return this.request<SkillGapItem[]>('/skill-gaps');
  }

  // Course APIs
  async getCourses(): Promise<Course[]> {
    return this.request<Course[]>('/courses');
  }

  async enrollCourse(courseId: string): Promise<Course> {
    return this.request<Course>(`/courses/${courseId}/enroll`, { method: 'POST' });
  }

  // Recommendations APIs
  async getRecommendations(): Promise<Course[]> {
    return this.request<Course[]>('/recommendations');
  }

  // Assessment & Quiz APIs
  async getAssessments(): Promise<Assessment[]> {
    return this.request<Assessment[]>('/assessments');
  }

  async submitAssessment(assessmentId: string, answers: number[], timeSpentSeconds: number): Promise<QuizResult> {
    return this.request<QuizResult>(`/assessments/${assessmentId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpentSeconds }),
    });
  }

  async generateQuiz(params: {
    documentName: string;
    numberOfQuestions: number;
    difficulty: string;
    competency: string;
  }): Promise<Assessment> {
    return this.request<Assessment>('/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Assistant Chat API
  async chatAssistant(message: string): Promise<{ reply: string }> {
    return this.request<{ reply: string }>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }
}

export const apiClient = new APIClient();
