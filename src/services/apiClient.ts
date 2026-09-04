import {
  User,
  Competency,
  SkillGapItem,
  Course,
  Assessment,
  QuizResult,
  DepartmentHeatmapRow,
  PredictiveSkillItem,
  WorkforceOverview,
  LearningPathResponse,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000/api/v1' : '/api/v1');

class APIClient {
  private token: string | null = localStorage.getItem('statintel_token');

  public setToken(token: string) {
    this.token = token;
    localStorage.setItem('statintel_token', token);
  }

  public clearToken() {
    this.token = null;
    localStorage.removeItem('statintel_token');
  }

  public getToken(): string | null {
    return this.token;
  }

  public async ensureAuth(role: 'LEARNER' | 'ADMIN' = 'LEARNER'): Promise<string> {
    if (this.token) return this.token;
    try {
      const email = role === 'ADMIN' ? 'vandana.sengupta@gov.in' : 'rajesh.sharma@mospi.gov.in';
      const data = await this.login(email, 'password123');
      return data.access_token;
    } catch {
      return '';
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.error?.message || json.detail || 'API Request Failed');
      }

      return json.data as T;
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message?.includes('fetch')) {
        console.warn(`[StatIntel Network Error] Backend at ${API_BASE_URL} is unreachable.`);
        throw new Error('StatIntel backend server is currently unreachable. Please check backend status.');
      }
      throw err;
    }
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

  // Learning Path APIs
  async getLearningPath(): Promise<LearningPathResponse> {
    await this.ensureAuth('LEARNER');
    return this.request<LearningPathResponse>('/learning/path');
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
    documentName?: string;
    documentText?: string;
    numberOfQuestions: number;
    difficulty: string;
    competency: string;
  }): Promise<Assessment> {
    await this.ensureAuth('LEARNER');
    return this.request<Assessment>('/quiz/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async uploadDocumentAndGenerateQuiz(formData: FormData): Promise<any> {
    await this.ensureAuth('LEARNER');
    return this.request<any>('/quiz/upload', {
      method: 'POST',
      body: formData,
    });
  }

  // Workforce Intelligence APIs
  async getWorkforceOverview(): Promise<WorkforceOverview> {
    await this.ensureAuth('ADMIN');
    return this.request<WorkforceOverview>('/workforce/overview');
  }

  async getWorkforceHeatmap(): Promise<DepartmentHeatmapRow[]> {
    await this.ensureAuth('ADMIN');
    return this.request<DepartmentHeatmapRow[]>('/workforce/heatmap');
  }

  async getPredictiveSkillDemand(): Promise<PredictiveSkillItem[]> {
    await this.ensureAuth('ADMIN');
    return this.request<PredictiveSkillItem[]>('/workforce/skill-demand');
  }

  // Admin Operations & Presentation Reset
  async resetDemoState(): Promise<any> {
    await this.ensureAuth('ADMIN');
    return this.request<any>('/admin/demo-reset', { method: 'POST' });
  }

  // Assistant Chat API
  async chatAssistant(message: string): Promise<{ reply: string }> {
    return this.request<{ reply: string }>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Course Curriculum & Detailed Learning APIs
  async getCourseCurriculum(courseId: string): Promise<any> {
    await this.ensureAuth('LEARNER');
    return this.request<any>(`/courses/${courseId}/curriculum`);
  }

  async completeTopic(topicId: string, score: number = 100): Promise<any> {
    await this.ensureAuth('LEARNER');
    return this.request<any>(`/learning/topics/${topicId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ score }),
    });
  }

  async trackResourceProgress(resourceId: string, completed: boolean = true, timeSpentMins: number = 5): Promise<any> {
    await this.ensureAuth('LEARNER');
    return this.request<any>(`/learning/resources/${resourceId}/progress`, {
      method: 'POST',
      body: JSON.stringify({ completed, time_spent_mins: timeSpentMins }),
    });
  }

  async generateTopicNotes(topicId: string): Promise<any> {
    await this.ensureAuth('LEARNER');
    return this.request<any>(`/learning/topics/${topicId}/generate-notes`, {
      method: 'POST',
    });
  }

  async submitModuleAssessment(moduleId: string, score: number, answers: any = {}): Promise<any> {
    await this.ensureAuth('LEARNER');
    return this.request<any>(`/learning/modules/${moduleId}/assessment`, {
      method: 'POST',
      body: JSON.stringify({ score, answers }),
    });
  }

  // MoSPI / NSSTA Catalog APIs
  async getNsstaCatalog(params?: { role?: string; domain?: string; level?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.role) query.set('role', params.role);
    if (params?.domain) query.set('domain', params.domain);
    if (params?.level) query.set('level', params.level);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request<any[]>(`/catalog/nssta${qs}`);
  }

  async getNsstaRoleCourses(roleName: string): Promise<any[]> {
    return this.request<any[]>(`/catalog/nssta/roles/${encodeURIComponent(roleName)}`);
  }

  async verifyResourceUrl(url: string): Promise<any> {
    return this.request<any>('/catalog/verify-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  }
}

export const apiClient = new APIClient();

