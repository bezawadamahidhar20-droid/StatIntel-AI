/**
 * iGOT Karmayogi (Sunbird ED / Lern) API Client
 * Seamless integration for Indian Civil Services & MoSPI Officers.
 * Supports Live (Bearer Token), Sandbox (dev.karmayogibharat.net), and Offline Mock Modes.
 */

import { fetchWithRetry } from './http';
import { ApiResponse } from './types';

const IGOT_API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL
    ? `${(import.meta as any).env.VITE_API_BASE_URL}/integrations/igot`
    : null) ||
  (typeof window === 'undefined' ? 'http://localhost:8000/api/v1/integrations/igot' : '/api/v1/integrations/igot');

export interface IGOTCourse {
  id: string;
  external_provider: string;
  external_course_id: string;
  providerCourseId?: string;
  title: string;
  description: string;
  provider: string;
  provider_type?: string;
  domain: string;
  level: string;
  duration: string;
  duration_hours: number;
  delivery_mode?: string;
  competencies_covered: string[];
  poster?: string;
  rating?: number;
  externalUrl: string;
  source_class?: string;
  sync_source?: string;
  matchScore?: number;
  rationale?: string;
  targetCompetency?: string;
}

export interface IGOTEnrollResponse {
  enrolled: boolean;
  redirectUrl?: string;
  reason?: string;
  mode?: string;
  raw?: any;
}

export interface IGOTHealthResponse {
  status: string;
  mode: 'live' | 'sandbox' | 'mock';
  base_url: string;
  credentialed: boolean;
  sandbox_url: string;
}

export class IGOTService {
  /**
   * Search courses on iGOT Karmayogi catalog
   */
  public async searchCourses(
    query = '',
    domain = 'All',
    limit = 20
  ): Promise<ApiResponse<IGOTCourse[]>> {
    const params = new URLSearchParams({
      query,
      domain: domain !== 'All' ? domain : '',
      limit: limit.toString(),
    });

    const fallbackCourses: IGOTCourse[] = [
      {
        id: 'igot-do_11396102948123852811',
        external_provider: 'iGOT Karmayogi',
        external_course_id: 'do_11396102948123852811',
        title: 'Statistical Data Analysis & Sampling Techniques for Public Policy',
        description: 'Comprehensive grounding in official sampling methodology, stratified random sampling, survey weights, and standard error calculation for central and state government officers.',
        provider: 'National Statistical Systems Training Academy (NSSTA)',
        domain: 'Official Statistics',
        level: 'Intermediate',
        duration: '12h 00m',
        duration_hours: 12.0,
        competencies_covered: ['Survey Design & Sampling', 'Statistical Data Analysis'],
        externalUrl: 'https://portal.igotkarmayogi.gov.in/app/toc/do_11396102948123852811/overview',
        rating: 4.8,
        matchScore: 96,
        rationale: 'Official government curriculum mapped to National Statistical System competency standards.',
      },
      {
        id: 'igot-do_11396102948123852812',
        external_provider: 'iGOT Karmayogi',
        external_course_id: 'do_11396102948123852812',
        title: 'Python for Microdata Processing & NSSO Survey Analytics',
        description: 'Automate data extraction, cleaning, and weighted analysis of National Sample Survey (NSS) and PLFS unit-level microdata using Python, Pandas, and Statsmodels.',
        provider: 'Karmayogi Bharat Digital Academy',
        domain: 'Data Science & AI',
        level: 'Intermediate',
        duration: '15h 00m',
        duration_hours: 15.0,
        competencies_covered: ['Python for Statistical & Microdata Analytics', 'Statistical Data Analysis'],
        externalUrl: 'https://portal.igotkarmayogi.gov.in/app/toc/do_11396102948123852812/overview',
        rating: 4.9,
        matchScore: 98,
        rationale: 'Essential for processing large-scale survey unit-level microdata and automated reporting.',
      },
      {
        id: 'igot-do_11396102948123852813',
        external_provider: 'iGOT Karmayogi',
        external_course_id: 'do_11396102948123852813',
        title: 'System of National Accounts (SNA 2008) & GDP Compilation',
        description: 'Understand international SNA 2008 principles, Gross Value Added (GVA), institutional sector accounts, and Supply-Use Table (SUT) balancing methodology.',
        provider: 'National Accounts Division, MoSPI',
        domain: 'Economics & Governance',
        level: 'Advanced',
        duration: '14h 00m',
        duration_hours: 14.0,
        competencies_covered: ['National Accounts Statistics', 'Micro & Macro Economics'],
        externalUrl: 'https://portal.igotkarmayogi.gov.in/app/toc/do_11396102948123852813/overview',
        rating: 4.7,
        matchScore: 94,
        rationale: 'Directly addresses macroeconomic estimation, GVA compilation, and GDP deflators.',
      },
      {
        id: 'igot-do_11396102948123852816',
        external_provider: 'iGOT Karmayogi',
        external_course_id: 'do_11396102948123852816',
        title: 'Digital Personal Data Protection (DPDP) Act 2023 & Statistical Confidentiality',
        description: 'Mandatory orientation for public servants on the DPDP Act 2023, data principal rights, anonymization techniques, k-anonymity, and statistical disclosure control.',
        provider: 'Ministry of Electronics & Information Technology (MeitY)',
        domain: 'Public Policy & Law',
        level: 'Beginner',
        duration: '8h 00m',
        duration_hours: 8.0,
        competencies_covered: ['DPDP Act 2023 & Data Privacy', 'Data Quality Assurance Frameworks'],
        externalUrl: 'https://portal.igotkarmayogi.gov.in/app/toc/do_11396102948123852816/overview',
        rating: 4.9,
        matchScore: 92,
        rationale: 'Regulatory compliance certification required for all government data custodians.',
      },
    ];

    return fetchWithRetry<IGOTCourse[]>(`${IGOT_API_BASE}/courses?${params.toString()}`, {
      retries: 2,
      retryDelayMs: 400,
      useCache: true,
      cacheTTLMs: 30 * 60 * 1000,
      cacheKey: `igot_courses_${query}_${domain}_${limit}`,
      fallbackData: fallbackCourses,
    });
  }

  /**
   * Fetch single course details by ID
   */
  public async getCourseDetail(courseId: string): Promise<ApiResponse<IGOTCourse>> {
    return fetchWithRetry<IGOTCourse>(`${IGOT_API_BASE}/courses/${courseId}`, {
      retries: 2,
      retryDelayMs: 400,
      useCache: true,
      cacheTTLMs: 60 * 60 * 1000,
      cacheKey: `igot_course_${courseId}`,
    });
  }

  /**
   * Enroll the user on iGOT Karmayogi
   */
  public async enrollCourse(courseId: string, batchId?: string): Promise<ApiResponse<IGOTEnrollResponse>> {
    const rawCid = courseId.replace('igot-', '');
    const defaultRedirect = `https://portal.igotkarmayogi.gov.in/app/toc/${rawCid}/overview`;

    return fetchWithRetry<IGOTEnrollResponse>(`${IGOT_API_BASE}/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course_id: courseId, batch_id: batchId }),
      retries: 1,
      useCache: false,
      fallbackData: {
        enrolled: false,
        redirectUrl: defaultRedirect,
        mode: 'portal_redirect',
      },
    });
  }

  /**
   * Get authenticated user's enrolments and progress
   */
  public async getMyLearning(): Promise<ApiResponse<any[]>> {
    return fetchWithRetry<any[]>(`${IGOT_API_BASE}/my-learning`, {
      retries: 2,
      useCache: false,
      fallbackData: [],
    });
  }

  /**
   * Health status of iGOT Karmayogi connection
   */
  public async getHealth(): Promise<ApiResponse<IGOTHealthResponse>> {
    return fetchWithRetry<IGOTHealthResponse>(`${IGOT_API_BASE}/health`, {
      retries: 1,
      useCache: true,
      cacheTTLMs: 5 * 60 * 1000,
      fallbackData: {
        status: 'healthy',
        mode: 'mock',
        base_url: 'https://portal.igotkarmayogi.gov.in',
        credentialed: false,
        sandbox_url: 'https://dev.karmayogibharat.net',
      },
    });
  }
}

export const igotApi = new IGOTService();
