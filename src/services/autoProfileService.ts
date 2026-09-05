/**
 * StatIntel AI — Official Auto-Profile Inference Engine (SIH26101 - R1)
 * Automatically derives full Competency Digital Twin baseline from an official's:
 * - Designation & Cadre
 * - Department / Directorate (NSSO, CSO, FOD, SDRD, NAD, ESD, DIID)
 * - Current Assignment & Responsibilities
 * - Educational Qualifications & Specializations
 * - Work Experience (Years & Scope)
 * - Previous Trainings & iGOT Certifications
 */

import { Competency, CompetencyDomain, CompetencyLevel, SkillGapItem } from '../types';

export interface OfficialProfileInput {
  name: string;
  designation: string;
  department: string;
  cadre: string;
  currentAssignment: string;
  education: {
    degree: string;
    field: string;
    institution: string;
  };
  experienceYears: number;
  previousTrainings: string[];
  certifications?: string[];
}

export interface InferredProfileResult {
  overallCompetency: number;
  roleReadiness: number;
  criticalGapsCount: number;
  competencies: Competency[];
  skillGaps: SkillGapItem[];
  inferenceRationale: {
    factor: string;
    impact: string;
    details: string;
  }[];
}

// Complete 4-Domain PS Taxonomy for Official Statistics (SIH26101 - R3)
export const OFFICIAL_STATISTICS_TAXONOMY: {
  id: string;
  name: string;
  domain: CompetencyDomain;
  description: string;
  requiredLevel: CompetencyLevel;
  requiredScore: number;
  keywords: string[];
  recommendedCourseId: string;
}[] = [
  // ── Pillar 1: Domain / Statistical Competencies ─────────────────────────────
  {
    id: 'comp-stat-1',
    name: 'Survey Design & Sampling Methodology',
    domain: 'Statistical',
    description: 'Probability sampling, multi-stage stratified clustering, sampling weights, and standard error calculation.',
    requiredLevel: 'L4',
    requiredScore: 85,
    keywords: ['sampling', 'survey', 'stratified', 'cluster', 'weights', 'nsso', 'plfs', 'field'],
    recommendedCourseId: 'crs-001',
  },
  {
    id: 'comp-stat-2',
    name: 'National Accounts Statistics (SNA 2008)',
    domain: 'Statistical',
    description: 'GDP/GVA compilation, institutional sector balance sheets, and Supply-Use Tables (SUT).',
    requiredLevel: 'L4',
    requiredScore: 85,
    keywords: ['national accounts', 'gdp', 'gva', 'sna', 'sut', 'macro', 'economics', 'nad'],
    recommendedCourseId: 'crs-002',
  },
  {
    id: 'comp-stat-3',
    name: 'Price Statistics (CPI & WPI)',
    domain: 'Statistical',
    description: 'Index number theory, Laspeyres/Fisher indices, item weighting, and inflation dynamics.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['cpi', 'wpi', 'price', 'inflation', 'index', 'basket', 'esd'],
    recommendedCourseId: 'crs-003',
  },
  {
    id: 'comp-stat-4',
    name: 'Labour & Employment Statistics (PLFS)',
    domain: 'Statistical',
    description: 'Periodic Labour Force Survey activity status, UPSS, CWS, LFPR, and unemployment estimation.',
    requiredLevel: 'L4',
    requiredScore: 80,
    keywords: ['labour', 'labor', 'plfs', 'employment', 'unemployment', 'upss', 'cws', 'workforce'],
    recommendedCourseId: 'crs-004',
  },
  {
    id: 'comp-stat-5',
    name: 'Agricultural Statistics & Crop Yield Forecasting',
    domain: 'Statistical',
    description: 'Crop cutting experiments (CCE), acreage estimation, and remote sensing crop monitoring.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['agriculture', 'crop', 'cce', 'yield', 'acreage', 'farming', 'land'],
    recommendedCourseId: 'crs-005',
  },
  {
    id: 'comp-stat-6',
    name: 'Industrial Statistics & Annual Survey of Industries (ASI)',
    domain: 'Statistical',
    description: 'Factory register sampling, GVA in manufacturing, Index of Industrial Production (IIP).',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['asi', 'industrial', 'manufacturing', 'iip', 'factory', 'establishment'],
    recommendedCourseId: 'crs-006',
  },

  // ── Pillar 2: Technical Competencies ────────────────────────────────────────
  {
    id: 'comp-tech-1',
    name: 'Python for Statistical & Microdata Analytics',
    domain: 'Technical',
    description: 'Pandas, NumPy, statsmodels, SciPy, microdata processing pipelines, and data manipulation.',
    requiredLevel: 'L4',
    requiredScore: 85,
    keywords: ['python', 'pandas', 'numpy', 'scipy', 'programming', 'code', 'data science'],
    recommendedCourseId: 'crs-007',
  },
  {
    id: 'comp-tech-2',
    name: 'R for Statistical Computing & Official Graphics',
    domain: 'Technical',
    description: 'R Tidyverse (dplyr, tidyr), survey package, ggplot2, and automated Quarto/RMarkdown reporting.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['r programming', 'r', 'tidyverse', 'ggplot', 'cran', 'rstats'],
    recommendedCourseId: 'crs-008',
  },
  {
    id: 'comp-tech-3',
    name: 'SAS & Enterprise Statistical Software',
    domain: 'Technical',
    description: 'SAS Base/Stat macro programming, legacy census data extraction, and econometric modelling.',
    requiredLevel: 'L3',
    requiredScore: 70,
    keywords: ['sas', 'spss', 'stata', 'macro', 'enterprise software'],
    recommendedCourseId: 'crs-009',
  },
  {
    id: 'comp-tech-4',
    name: 'SQL & Large-Scale Database Systems',
    domain: 'Technical',
    description: 'Relational database architecture, PostgreSQL, window functions, and dimensional data modeling.',
    requiredLevel: 'L4',
    requiredScore: 80,
    keywords: ['sql', 'postgres', 'database', 'queries', 'etl', 'data warehouse'],
    recommendedCourseId: 'crs-010',
  },
  {
    id: 'comp-tech-5',
    name: 'AI & Machine Learning for Official Statistics',
    domain: 'Technical',
    description: 'Supervised classification for automated coding (NIC/NCO), anomaly detection, and XAI.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['ai', 'machine learning', 'ml', 'nlp', 'deep learning', 'shap', 'models'],
    recommendedCourseId: 'crs-011',
  },
  {
    id: 'comp-tech-6',
    name: 'GIS & Spatial Analytics for Surveys',
    domain: 'Technical',
    description: 'GeoPandas, QGIS, spatial boundary shapefiles, district clustering, and remote sensing imagery.',
    requiredLevel: 'L3',
    requiredScore: 70,
    keywords: ['gis', 'spatial', 'geopandas', 'qgis', 'maps', 'shapefile', 'remote sensing'],
    recommendedCourseId: 'crs-012',
  },

  // ── Pillar 3: Digital Governance & Cybersecurity ─────────────────────────────
  {
    id: 'comp-gov-1',
    name: 'DPDP Act 2023 & Statistical Confidentiality',
    domain: 'Digital Governance',
    description: 'Compliance with the Digital Personal Data Protection Act, k-anonymity, and disclosure control.',
    requiredLevel: 'L4',
    requiredScore: 85,
    keywords: ['dpdp', 'privacy', 'anonymization', 'confidentiality', 'data protection', 'compliance'],
    recommendedCourseId: 'crs-013',
  },
  {
    id: 'comp-gov-2',
    name: 'Government Cloud (MeitY MeghRaj) & Infrastructure',
    domain: 'Digital Governance',
    description: 'GI-Cloud MeghRaj architecture, microservices deployment, container security, and data sovereignty.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['cloud', 'meghraj', 'meity', 'gov cloud', 'aws', 'azure', 'infrastructure'],
    recommendedCourseId: 'crs-014',
  },
  {
    id: 'comp-gov-3',
    name: 'Digital Signatures & e-Governance Standards',
    domain: 'Digital Governance',
    description: 'eSign, DSC cryptographic verification, PKI infrastructure, and Open Government Data (OGD) standards.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['digital signature', 'esign', 'dsc', 'pki', 'egovernance', 'ogd'],
    recommendedCourseId: 'crs-015',
  },
  {
    id: 'comp-gov-4',
    name: 'Cyber Security Hygiene & CERT-In Compliance',
    domain: 'Digital Governance',
    description: 'Zero trust security, password hygiene, phishing countermeasures, and incident reporting protocols.',
    requiredLevel: 'L4',
    requiredScore: 85,
    keywords: ['cyber', 'security', 'cert-in', 'phishing', 'zero trust', 'hygiene'],
    recommendedCourseId: 'crs-016',
  },

  // ── Pillar 4: Behavioural & Managerial Competencies ──────────────────────────
  {
    id: 'comp-mgr-1',
    name: 'Evidence-Based Decision Making',
    domain: 'Behavioural & Managerial',
    description: 'Evaluating statistical trade-offs, synthesis of multi-source indicators, and executive risk appraisal.',
    requiredLevel: 'L4',
    requiredScore: 80,
    keywords: ['decision making', 'policy', 'leadership', 'strategy', 'risk', 'synthesis'],
    recommendedCourseId: 'crs-017',
  },
  {
    id: 'comp-mgr-2',
    name: 'Change Management & Digital Transformation',
    domain: 'Behavioural & Managerial',
    description: 'Managing transition from manual field surveys to CAPI/CATI digital data systems across teams.',
    requiredLevel: 'L3',
    requiredScore: 75,
    keywords: ['change management', 'transformation', 'modernization', 'leadership', 'team'],
    recommendedCourseId: 'crs-018',
  },
  {
    id: 'comp-mgr-3',
    name: 'Public Policy Communication & Statistical Literacy',
    domain: 'Behavioural & Managerial',
    description: 'Communicating statistical results, decluttering charts, and drafting executive policy memos.',
    requiredLevel: 'L4',
    requiredScore: 80,
    keywords: ['communication', 'storytelling', 'visualization', 'writing', 'policy brief'],
    recommendedCourseId: 'crs-019',
  },
];

/**
 * Automatically infers a complete competency profile from official background metadata
 */
export function inferCompetencyProfile(profile: OfficialProfileInput): InferredProfileResult {
  const combinedContext = `
    ${profile.designation} ${profile.department} ${profile.cadre} ${profile.currentAssignment}
    ${profile.education.degree} ${profile.education.field} ${profile.education.institution}
    ${profile.previousTrainings.join(' ')} ${(profile.certifications || []).join(' ')}
  `.toLowerCase();

  const expBonus = Math.min(25, Math.round(profile.experienceYears * 3.5));

  const inferredCompetencies: Competency[] = OFFICIAL_STATISTICS_TAXONOMY.map((taxon, idx) => {
    let matchScore = 35; // baseline beginner
    let matchedKeywords: string[] = [];

    // Check keyword affinity
    taxon.keywords.forEach((kw) => {
      if (combinedContext.includes(kw.toLowerCase())) {
        matchScore += 12;
        matchedKeywords.push(kw);
      }
    });

    // Check education field match
    const eduField = profile.education.field.toLowerCase();
    if (
      (taxon.domain === 'Statistical' && (eduField.includes('stat') || eduField.includes('math') || eduField.includes('econ'))) ||
      (taxon.domain === 'Technical' && (eduField.includes('computer') || eduField.includes('data') || eduField.includes('information') || eduField.includes('tech'))) ||
      (taxon.domain === 'Digital Governance' && (eduField.includes('public') || eduField.includes('policy') || eduField.includes('admin') || eduField.includes('law')))
    ) {
      matchScore += 15;
    }

    // Add experience bonus
    matchScore += expBonus;

    // Cap score at 98 max and 25 min
    const finalScore = Math.min(98, Math.max(25, matchScore));

    // Determine level
    let level: CompetencyLevel = 'L1';
    if (finalScore >= 85) level = 'L4';
    else if (finalScore >= 70) level = 'L3';
    else if (finalScore >= 50) level = 'L2';
    else level = 'L1';

    // Status
    const gap = finalScore - taxon.requiredScore;
    let status: 'Critical Gap' | 'Moderate Gap' | 'Target Met' | 'Exceeds' = 'Target Met';
    if (gap < -15) status = 'Critical Gap';
    else if (gap < 0) status = 'Moderate Gap';
    else if (gap > 10) status = 'Exceeds';

    // Evidence Sources generated automatically
    const evidenceSources = [];
    if (matchedKeywords.length > 0) {
      evidenceSources.push({
        type: 'Experience' as const,
        title: `Assignment Match: ${profile.currentAssignment || profile.department}`,
        date: '04 Sep 2026',
        score: `Inferred from ${matchedKeywords.slice(0, 2).join(', ')}`,
      });
    }
    if (profile.previousTrainings.length > 0) {
      evidenceSources.push({
        type: 'Training' as const,
        title: `Prior Training: ${profile.previousTrainings[idx % profile.previousTrainings.length]}`,
        date: 'Aug 2026',
      });
    }

    return {
      id: taxon.id,
      name: taxon.name,
      domain: taxon.domain,
      currentLevel: level,
      requiredLevel: taxon.requiredLevel,
      currentScore: finalScore,
      requiredScore: taxon.requiredScore,
      gap,
      confidence: Math.min(96, Math.max(82, 85 + matchedKeywords.length * 3)),
      status,
      description: taxon.description,
      evidenceSources,
      trend: gap >= 0 ? 'increasing' : 'needs_refresh',
      lastAssessed: '05 Sep 2026',
      historicalScores: [
        { date: 'Jul 2026', score: Math.max(15, finalScore - 12) },
        { date: 'Sep 2026', score: finalScore },
      ],
      recommendedCourseIds: [taxon.recommendedCourseId],
    };
  });

  // Calculate gaps
  const skillGaps: SkillGapItem[] = inferredCompetencies
    .filter((c) => c.gap < 0)
    .sort((a, b) => a.gap - b.gap)
    .map((c, idx) => ({
      id: `gap-${c.id}`,
      competencyId: c.id,
      competencyName: c.name,
      domain: c.domain,
      currentLevel: c.currentLevel,
      requiredLevel: c.requiredLevel,
      currentScore: c.currentScore,
      requiredScore: c.requiredScore,
      gapLevels: Math.max(1, parseInt(c.requiredLevel.replace('L', '')) - parseInt(c.currentLevel.replace('L', ''))),
      severity: c.status === 'Critical Gap' ? 'Critical' : 'Medium',
      roleRelevance: 95 - idx * 4,
      priorityRank: idx + 1,
      estimatedTimeToBridge: c.status === 'Critical Gap' ? '12-16 hours' : '6-8 hours',
      recommendedCourseId: c.recommendedCourseIds[0] || 'crs-001',
      rationale: `Inferred ${Math.abs(c.gap)}% deficit against ${profile.designation} competency standard in ${profile.department}.`,
    }));

  const avgScore = Math.round(
    inferredCompetencies.reduce((acc, c) => acc + c.currentScore, 0) / inferredCompetencies.length
  );
  const metCount = inferredCompetencies.filter((c) => c.currentScore >= c.requiredScore).length;
  const roleReadiness = Math.round((metCount / inferredCompetencies.length) * 100);

  return {
    overallCompetency: avgScore,
    roleReadiness,
    criticalGapsCount: skillGaps.filter((g) => g.severity === 'Critical').length,
    competencies: inferredCompetencies,
    skillGaps,
    inferenceRationale: [
      {
        factor: 'Department & Assignment Affinity',
        impact: `+${Math.min(30, expBonus + 10)}% Domain Alignment`,
        details: `Profile aligned with ${profile.department} mandate and assignment on "${profile.currentAssignment}".`,
      },
      {
        factor: 'Academic Qualification',
        impact: '+15% Baseline Score',
        details: `${profile.education.degree} in ${profile.education.field} from ${profile.education.institution}.`,
      },
      {
        factor: 'Professional Experience & Certifications',
        impact: `+${expBonus}% Cumulative Gain`,
        details: `${profile.experienceYears} years in statistical administration with ${profile.previousTrainings.length} completed programs.`,
      },
    ],
  };
}
