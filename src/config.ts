/**
 * Global Configuration for StatIntel-AI Platform
 */

export interface MinistryConfig {
  ministryName: string;
  departmentName: string;
  problemStatementId: string;
  problemStatementTitle: string;
  edition: string;
  version: string;
  badgeLabel: string;
  portalUrl: string;
}

export const APP_CONFIG: MinistryConfig = {
  ministryName: 'Ministry of Statistics and Programme Implementation (MoSPI)',
  departmentName: 'National Statistical Office (NSO) & Data Intelligence Directorate',
  problemStatementId: 'SIH-2024-PS-1628',
  problemStatementTitle: 'AI-Powered Statistical Intelligence & Dynamic Competency Analytics Platform',
  edition: 'Smart India Hackathon 2024 Grand Finale Edition',
  version: '2.4.0-PROD',
  badgeLabel: 'Official MoSPI Intelligence Portal',
  portalUrl: 'https://statintel.gov.in',
};

export default APP_CONFIG;
