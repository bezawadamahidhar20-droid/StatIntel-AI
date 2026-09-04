/**
 * Connector for Census India Open Data Feeds & District Demographic Indicators
 * Provides State and District level population, literacy, sex ratio, and worker participation metrics.
 */

import { fetchWithRetry } from './http';
import { ApiResponse, CensusDistrictData } from './types';

const CENSUS_API_BASE =
  (typeof process !== 'undefined' && process.env?.BACKEND_URL ? `${process.env.BACKEND_URL}/api/v1/census` : null) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL ? `${(import.meta as any).env.VITE_API_BASE_URL}/census` : null) ||
  (typeof window === 'undefined' ? 'http://localhost:8000/api/v1/census' : '/api/v1/census');

export class CensusService {
  /**
   * Fetches district-level demographic profile by state or all India
   */
  public async getDistrictData(stateCode?: string): Promise<ApiResponse<CensusDistrictData[]>> {
    const fallbackDistricts: CensusDistrictData[] = [
      {
        districtCode: 'IN-MH-PUN',
        districtName: 'Pune',
        stateCode: 'MH',
        stateName: 'Maharashtra',
        totalPopulation: 9429408,
        malePopulation: 4924105,
        femalePopulation: 4505303,
        sexRatio: 915,
        literacyRate: 86.15,
        maleLiteracyRate: 90.84,
        femaleLiteracyRate: 81.05,
        urbanizationRate: 60.9,
        workerParticipationRate: 41.2,
        decadalGrowthRate: 30.3,
        areaSqKm: 15643,
        populationDensity: 603,
      },
      {
        districtCode: 'IN-KA-BLR',
        districtName: 'Bengaluru Urban',
        stateCode: 'KA',
        stateName: 'Karnataka',
        totalPopulation: 9621551,
        malePopulation: 5022661,
        femalePopulation: 4598890,
        sexRatio: 916,
        literacyRate: 87.67,
        maleLiteracyRate: 91.01,
        femaleLiteracyRate: 84.01,
        urbanizationRate: 90.9,
        workerParticipationRate: 44.1,
        decadalGrowthRate: 47.2,
        areaSqKm: 2196,
        populationDensity: 4381,
      },
      {
        districtCode: 'IN-DL-CEN',
        districtName: 'Central Delhi',
        stateCode: 'DL',
        stateName: 'Delhi',
        totalPopulation: 582320,
        malePopulation: 308630,
        femalePopulation: 273690,
        sexRatio: 887,
        literacyRate: 85.14,
        maleLiteracyRate: 88.42,
        femaleLiteracyRate: 81.44,
        urbanizationRate: 100.0,
        workerParticipationRate: 38.5,
        decadalGrowthRate: -10.3,
        areaSqKm: 25,
        populationDensity: 23293,
      },
      {
        districtCode: 'IN-UP-LKO',
        districtName: 'Lucknow',
        stateCode: 'UP',
        stateName: 'Uttar Pradesh',
        totalPopulation: 4589838,
        malePopulation: 2394476,
        femalePopulation: 2195362,
        sexRatio: 917,
        literacyRate: 77.29,
        maleLiteracyRate: 82.56,
        femaleLiteracyRate: 71.54,
        urbanizationRate: 66.2,
        workerParticipationRate: 33.1,
        decadalGrowthRate: 25.8,
        areaSqKm: 2528,
        populationDensity: 1816,
      },
      {
        districtCode: 'IN-TN-CHE',
        districtName: 'Chennai',
        stateCode: 'TN',
        stateName: 'Tamil Nadu',
        totalPopulation: 4646732,
        malePopulation: 2335844,
        femalePopulation: 2310888,
        sexRatio: 989,
        literacyRate: 90.18,
        maleLiteracyRate: 93.70,
        femaleLiteracyRate: 86.64,
        urbanizationRate: 100.0,
        workerParticipationRate: 39.8,
        decadalGrowthRate: 6.98,
        areaSqKm: 175,
        populationDensity: 26553,
      },
      {
        districtCode: 'IN-GJ-AHM',
        districtName: 'Ahmedabad',
        stateCode: 'GJ',
        stateName: 'Gujarat',
        totalPopulation: 7214225,
        malePopulation: 3788051,
        femalePopulation: 3426174,
        sexRatio: 904,
        literacyRate: 85.31,
        maleLiteracyRate: 90.74,
        femaleLiteracyRate: 79.35,
        urbanizationRate: 84.0,
        workerParticipationRate: 37.9,
        decadalGrowthRate: 22.3,
        areaSqKm: 8087,
        populationDensity: 892,
      },
    ];

    const filteredFallback = stateCode
      ? fallbackDistricts.filter((d) => d.stateCode === stateCode)
      : fallbackDistricts;

    const url = stateCode ? `${CENSUS_API_BASE}/districts?state=${stateCode}` : `${CENSUS_API_BASE}/districts`;

    return fetchWithRetry<CensusDistrictData[]>(url, {
      retries: 3,
      retryDelayMs: 500,
      useCache: true,
      cacheTTLMs: 24 * 60 * 60 * 1000, // 24-hr cache for census data
      cacheKey: `census_districts_${stateCode || 'all'}`,
      fallbackData: filteredFallback,
    });
  }

  /**
   * Fetches National & State-level aggregated demographic indicators
   */
  public async getNationalOverview(): Promise<ApiResponse<{
    totalPopulation: number;
    sexRatio: number;
    overallLiteracyRate: number;
    urbanPopulationPct: number;
    activeDistrictsCount: number;
  }>> {
    const fallback = {
      totalPopulation: 1428627663, // 1.428 Billion
      sexRatio: 943,
      overallLiteracyRate: 77.7,
      urbanPopulationPct: 35.4,
      activeDistrictsCount: 788,
    };

    return fetchWithRetry(`${CENSUS_API_BASE}/national-overview`, {
      retries: 3,
      retryDelayMs: 500,
      useCache: true,
      cacheTTLMs: 24 * 60 * 60 * 1000,
      cacheKey: 'census_national_overview',
      fallbackData: fallback,
    });
  }
}

export const census = new CensusService();
export default census;
