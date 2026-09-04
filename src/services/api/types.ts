/**
 * Type definitions for StatIntel-AI Government Data Connectors
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  source: 'live' | 'cache' | 'fallback';
  timestamp: string;
  metadata?: {
    totalRecords?: number;
    cachedAt?: number;
    attribution?: string;
    version?: string;
  };
  error?: string;
}

export interface DataGovInRecord {
  [key: string]: string | number | null;
}

export interface DataGovInResponse {
  index_name: string;
  title: string;
  desc: string;
  created: number;
  updated: number;
  created_date: string;
  updated_date: string;
  active: string;
  visualizable: string;
  catalog_uuid: string;
  source: string;
  org_type: string;
  org: string[];
  sector: string[];
  field: Array<{ id: string; name: string; type: string }>;
  target_bucket: { index: string; type: string; field: string };
  records: DataGovInRecord[];
  total: number;
  count: number;
  limit: string;
  offset: string;
}

export interface MospiIndicator {
  indicatorId: string;
  name: string;
  category: 'CPI' | 'IIP' | 'PLFS' | 'ASI' | 'GDP' | 'SUT';
  frequency: 'Monthly' | 'Quarterly' | 'Annual';
  baseYear: string;
  latestPeriod: string;
  latestValue: number;
  previousValue: number;
  yoyGrowthPct: number;
  unit: string;
  timeSeries: Array<{
    period: string;
    date: string;
    value: number;
    breakdown?: Record<string, number>;
  }>;
  stateBreakdown?: Array<{
    stateCode: string;
    stateName: string;
    value: number;
    growth: number;
  }>;
}

export interface RbiMacroIndicator {
  indicatorKey: string;
  title: string;
  category: 'Monetary Policy' | 'Inflation' | 'External Sector' | 'Banking & Credit' | 'Fiscal';
  currentRate: number;
  unit: string;
  lastUpdated: string;
  effectiveDate: string;
  targetOrThreshold?: string;
  historicalTrend: Array<{
    date: string;
    rate: number;
  }>;
  summary: string;
}

export interface CensusDistrictData {
  districtCode: string;
  districtName: string;
  stateCode: string;
  stateName: string;
  totalPopulation: number;
  malePopulation: number;
  femalePopulation: number;
  sexRatio: number; // Females per 1000 males
  literacyRate: number; // In %
  maleLiteracyRate: number;
  femaleLiteracyRate: number;
  urbanizationRate: number; // In %
  workerParticipationRate: number; // In %
  decadalGrowthRate: number; // In %
  areaSqKm: number;
  populationDensity: number;
}
