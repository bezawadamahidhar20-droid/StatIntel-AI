/**
 * StatIntel AI — Competency taxonomy
 * Aligned to SIH26101 (MoSPI) named competency domains + the Karmayogi Competency Model
 * (behavioural / functional / domain).
 *
 * Drop into: src/data/competencies.ts
 */

export type Pillar = 'statistical' | 'technical' | 'governance' | 'behavioural';
export type Proficiency = 0 | 1 | 2 | 3 | 4 | 5;

export const PROFICIENCY_LABELS: Record<Proficiency, { label: string; labelHi: string; help: string }> = {
  0: { label: 'Not known',        labelHi: 'ज्ञात नहीं',      help: 'No exposure' },
  1: { label: 'Awareness',        labelHi: 'जागरूकता',        help: "I've heard of it / read about it" },
  2: { label: 'Working',          labelHi: 'कार्यसाधक',       help: 'I can do it with help or documentation' },
  3: { label: 'Practitioner',     labelHi: 'व्यवसायी',        help: 'I do this independently in my current work' },
  4: { label: 'Advanced',         labelHi: 'उन्नत',           help: "I handle complex cases and review others' work" },
  5: { label: 'Expert / Trainer', labelHi: 'विशेषज्ञ / प्रशिक्षक', help: 'I can train others and set standards' },
};

export interface Competency {
  id: string;
  name: string;
  nameHi: string;
  pillar: Pillar;
  kcmCategory: 'domain' | 'functional' | 'behavioural';
  /** powers fuzzy type-ahead on the "enter your skills" screen */
  aliases: string[];
  prerequisites: string[];
  /** hours to move L0→L1, L1→L2, L2→L3, L3→L4, L4→L5 */
  hoursPerLevel: [number, number, number, number, number];
}

const c = (
  id: string, name: string, nameHi: string, pillar: Pillar,
  kcmCategory: Competency['kcmCategory'], aliases: string[],
  prerequisites: string[], hoursPerLevel: Competency['hoursPerLevel'],
): Competency => ({ id, name, nameHi, pillar, kcmCategory, aliases, prerequisites, hoursPerLevel });

export const COMPETENCIES: Competency[] = [
  // ─────────────────────────── PILLAR 1 · STATISTICAL & DOMAIN ───────────────────────────
  c('stat.survey_design', 'Survey Design', 'सर्वेक्षण डिज़ाइन', 'statistical', 'domain',
    ['questionnaire design', 'schedule design', 'survey methodology', 'NSS round design'], [], [8, 14, 20, 28, 36]),
  c('stat.sampling', 'Sampling & Estimation', 'प्रतिचयन एवं आकलन', 'statistical', 'domain',
    ['sample design', 'stratified sampling', 'multistage sampling', 'weights', 'design effect', 'Neyman allocation', 'PPS'],
    ['stat.survey_design'], [10, 16, 24, 32, 40]),
  c('stat.small_area_estimation', 'Small Area Estimation', 'लघु क्षेत्र आकलन', 'statistical', 'domain',
    ['SAE', 'district level estimates', 'Fay-Herriot', 'model based estimation'],
    ['stat.sampling', 'stat.econometrics'], [12, 20, 30, 40, 50]),
  c('stat.national_accounts', 'National Accounts (GDP/GVA)', 'राष्ट्रीय लेखा', 'statistical', 'domain',
    ['GDP', 'GVA', 'SNA 2008', 'national income', 'input output', 'base year revision', 'NAS'], [], [12, 20, 30, 40, 50]),
  c('stat.price_statistics', 'Price Statistics (CPI / WPI)', 'मूल्य सांख्यिकी', 'statistical', 'domain',
    ['CPI', 'WPI', 'inflation', 'price index', 'Laspeyres', 'base revision', 'price collection'], [], [10, 16, 24, 32, 40]),
  c('stat.index_numbers', 'Index Numbers & IIP', 'सूचकांक एवं आईआईपी', 'statistical', 'domain',
    ['IIP', 'index of industrial production', 'Paasche', 'Fisher index', 'chain linking'], [], [8, 14, 20, 28, 34]),
  c('stat.labour_statistics', 'Labour Statistics', 'श्रम सांख्यिकी', 'statistical', 'domain',
    ['PLFS', 'employment unemployment', 'LFPR', 'WPR', 'labour force survey', 'usual status'], [], [8, 14, 22, 30, 38]),
  c('stat.agricultural_statistics', 'Agricultural Statistics', 'कृषि सांख्यिकी', 'statistical', 'domain',
    ['crop estimation', 'GCES', 'area production yield', 'AIDIS', 'land use statistics'], [], [8, 14, 22, 30, 38]),
  c('stat.industrial_statistics', 'Industrial Statistics (ASI)', 'औद्योगिक सांख्यिकी', 'statistical', 'domain',
    ['ASI', 'annual survey of industries', 'factory sector', 'NIC classification', 'unorganised sector'], [], [8, 14, 22, 30, 38]),
  c('stat.sdg_indicators', 'SDG Indicator Framework', 'एसडीजी सूचक ढांचा', 'statistical', 'domain',
    ['SDG', 'NIF', 'national indicator framework', 'sustainable development goals', 'SDG monitoring'], [], [6, 12, 18, 26, 32]),
  c('stat.metadata_sdmx', 'Metadata Standards & SDMX', 'मेटाडेटा मानक एवं एसडीएमएक्स', 'statistical', 'domain',
    ['SDMX', 'metadata', 'data documentation', 'DDI', 'data dictionary', 'statistical classification'], [], [6, 12, 20, 28, 34]),
  c('stat.data_quality', 'Data Quality Frameworks (DQAF)', 'डेटा गुणवत्ता ढांचा', 'statistical', 'domain',
    ['DQAF', 'data quality assurance', 'validation', 'consistency checks', 'quality control', 'scrutiny'], [], [8, 14, 20, 28, 34]),
  c('stat.time_series', 'Time-Series & Forecasting', 'काल श्रेणी एवं पूर्वानुमान', 'statistical', 'domain',
    ['ARIMA', 'seasonal adjustment', 'X-13', 'nowcasting', 'trend cycle', 'forecasting'],
    ['stat.econometrics'], [10, 18, 26, 34, 42]),
  c('stat.demography_census', 'Demography & Census', 'जनसांख्यिकी एवं जनगणना', 'statistical', 'domain',
    ['census', 'population projection', 'vital statistics', 'CRS', 'SRS', 'life table'], [], [8, 14, 22, 30, 38]),
  c('stat.econometrics', 'Econometrics & Statistical Inference', 'अर्थमिति एवं सांख्यिकीय अनुमान', 'statistical', 'domain',
    ['regression', 'hypothesis testing', 'panel data', 'inference', 'OLS', 'causal inference'], [], [10, 18, 26, 34, 42]),

  // ─────────────────────────── PILLAR 2 · TECHNICAL & DIGITAL ───────────────────────────
  c('tech.python', 'Python', 'पायथन', 'technical', 'functional',
    ['pandas', 'numpy', 'jupyter', 'py', 'scipy', 'statsmodels'], [], [12, 20, 28, 40, 50]),
  c('tech.r', 'R', 'आर', 'technical', 'functional',
    ['rstudio', 'tidyverse', 'ggplot2', 'dplyr', 'survey package'], [], [12, 20, 28, 40, 50]),
  c('tech.sql', 'SQL', 'एसक्यूएल', 'technical', 'functional',
    ['postgres', 'mysql', 'queries', 'joins', 'rdbms', 'database queries'], [], [8, 14, 20, 28, 36]),
  c('tech.stata', 'Stata', 'स्टाटा', 'technical', 'functional',
    ['do file', 'svyset', 'stata programming'], [], [8, 14, 20, 28, 34]),
  c('tech.spss', 'SPSS', 'एसपीएसएस', 'technical', 'functional',
    ['pspp', 'spss syntax'], [], [6, 12, 18, 24, 30]),
  c('tech.sas', 'SAS', 'एसएएस', 'technical', 'functional',
    ['sas programming', 'proc sql', 'sas macro'], [], [10, 16, 24, 32, 40]),
  c('tech.excel', 'Advanced Excel', 'उन्नत एक्सेल', 'technical', 'functional',
    ['pivot table', 'vlookup', 'power query', 'spreadsheet', 'macros'], [], [4, 8, 14, 20, 26]),
  c('tech.gis', 'GIS & Geospatial Analysis', 'जीआईएस एवं भू-स्थानिक', 'technical', 'functional',
    ['qgis', 'arcgis', 'shapefile', 'geospatial', 'mapping', 'remote sensing', 'spatial analysis'], [], [10, 18, 26, 36, 44]),
  c('tech.dataviz', 'Data Visualisation & BI', 'डेटा विज़ुअलाइज़ेशन', 'technical', 'functional',
    ['power bi', 'tableau', 'dashboard', 'charts', 'superset', 'metabase'], [], [6, 12, 18, 26, 32]),
  c('tech.aiml', 'AI / Machine Learning', 'एआई / मशीन लर्निंग', 'technical', 'functional',
    ['machine learning', 'ml', 'deep learning', 'scikit-learn', 'xgboost', 'nlp', 'llm', 'predictive modelling'],
    ['tech.python', 'stat.econometrics'], [16, 26, 36, 48, 60]),
  c('tech.bigdata', 'Big Data Analytics', 'बिग डेटा विश्लेषण', 'technical', 'functional',
    ['spark', 'hadoop', 'pyspark', 'distributed computing', 'data lake'],
    ['tech.python', 'tech.sql'], [14, 22, 32, 42, 52]),
  c('tech.cloud', 'Cloud Computing', 'क्लाउड कंप्यूटिंग', 'technical', 'functional',
    ['aws', 'azure', 'gcp', 'meghraj', 'containers', 'docker', 'kubernetes'], [], [10, 18, 26, 36, 44]),
  c('tech.apis_opendata', 'APIs & Open Data', 'एपीआई एवं ओपन डेटा', 'technical', 'functional',
    ['rest api', 'data.gov.in', 'json', 'ogd platform', 'api integration', 'web services'], [], [6, 12, 18, 26, 32]),
  c('tech.data_engineering', 'Data Engineering & ETL', 'डेटा इंजीनियरिंग', 'technical', 'functional',
    ['etl', 'pipeline', 'airflow', 'dbt', 'data warehouse', 'ingestion'],
    ['tech.sql', 'tech.python'], [12, 20, 30, 40, 50]),
  c('tech.capi_tools', 'CAPI / Survey Software', 'सीएपीआई सर्वे सॉफ्टवेयर', 'technical', 'functional',
    ['cspro', 'odk', 'survey solutions', 'kobo', 'tablet based data collection', 'e-schedule'], [], [6, 12, 18, 24, 30]),

  // ─────────────────────────── PILLAR 3 · DIGITAL GOVERNANCE ───────────────────────────
  c('gov.cybersecurity', 'Cybersecurity Hygiene', 'साइबर सुरक्षा', 'governance', 'functional',
    ['cyber security', 'infosec', 'phishing', 'cert-in', 'password hygiene', 'security audit'], [], [4, 10, 16, 24, 30]),
  c('gov.dpdp_privacy', 'Data Privacy & DPDP Act 2023', 'डेटा गोपनीयता एवं डीपीडीपी अधिनियम', 'governance', 'functional',
    ['dpdp', 'data protection', 'privacy', 'consent', 'anonymisation', 'personal data'], [], [6, 10, 16, 24, 30]),
  c('gov.statistical_confidentiality', 'Statistical Confidentiality & Collection of Statistics Act', 'सांख्यिकीय गोपनीयता', 'governance', 'domain',
    ['collection of statistics act', 'microdata release', 'disclosure control', 'respondent confidentiality'], [], [4, 8, 14, 20, 26]),
  c('gov.digital_signatures', 'Digital Signatures & e-Sign', 'डिजिटल हस्ताक्षर', 'governance', 'functional',
    ['dsc', 'e-sign', 'pki', 'digital certificate'], [], [3, 6, 10, 16, 20]),
  c('gov.govt_cloud', 'Government Cloud (MeghRaj)', 'सरकारी क्लाउड', 'governance', 'functional',
    ['meghraj', 'nic cloud', 'gi cloud', 'empanelled cloud'], [], [4, 8, 14, 20, 26]),
  c('gov.dpi', 'Digital Public Infrastructure', 'डिजिटल सार्वजनिक अवसंरचना', 'governance', 'functional',
    ['dpi', 'aadhaar', 'upi', 'digilocker', 'india stack', 'data exchange'], [], [4, 10, 16, 22, 28]),
  c('gov.eoffice', 'e-Office & Digital Workflows', 'ई-ऑफिस', 'governance', 'functional',
    ['e-office', 'efile', 'noting drafting', 'digital file movement'], [], [3, 6, 10, 14, 18]),
  c('gov.open_data_policy', 'Open Government Data Policy', 'ओपन डेटा नीति', 'governance', 'functional',
    ['ndsap', 'open data', 'data sharing policy', 'dissemination policy'], [], [4, 8, 12, 18, 24]),

  // ─────────────────────── PILLAR 4 · BEHAVIOURAL & MANAGERIAL ───────────────────────
  c('beh.leadership', 'Leadership', 'नेतृत्व', 'behavioural', 'behavioural',
    ['team leadership', 'strategic leadership', 'people management'], [], [6, 12, 20, 30, 40]),
  c('beh.communication', 'Communication', 'संचार', 'behavioural', 'behavioural',
    ['presentation', 'public speaking', 'briefing', 'written communication'], [], [4, 10, 16, 24, 30]),
  c('beh.project_management', 'Project Management', 'परियोजना प्रबंधन', 'behavioural', 'functional',
    ['pmp', 'planning', 'gantt', 'survey operations management', 'milestones'], [], [8, 14, 22, 30, 38]),
  c('beh.ethics', 'Statistical Ethics & Integrity', 'सांख्यिकीय नैतिकता', 'behavioural', 'behavioural',
    ['ethics', 'code of conduct', 'professional integrity', 'fundamental principles of official statistics'], [], [3, 6, 10, 16, 20]),
  c('beh.decision_making', 'Decision Making', 'निर्णय-निर्माण', 'behavioural', 'behavioural',
    ['judgement', 'problem solving', 'evidence based decisions'], [], [4, 10, 16, 24, 30]),
  c('beh.change_management', 'Change Management', 'परिवर्तन प्रबंधन', 'behavioural', 'behavioural',
    ['transformation', 'adoption', 'process reform', 'digital transition'], [], [6, 12, 18, 26, 34]),
  c('beh.report_writing', 'Report Writing & Data Storytelling', 'रिपोर्ट लेखन', 'behavioural', 'functional',
    ['technical writing', 'press note', 'data storytelling', 'documentation', 'report drafting'], [], [6, 12, 18, 26, 32]),
  c('beh.field_supervision', 'Field Supervision', 'क्षेत्र पर्यवेक्षण', 'behavioural', 'functional',
    ['field work', 'investigator supervision', 'field inspection', 'sample verification', 'FOD supervision'], [], [6, 12, 18, 26, 32]),
  c('beh.training_mentoring', 'Training & Mentoring', 'प्रशिक्षण एवं परामर्श', 'behavioural', 'functional',
    ['faculty', 'instructional design', 'capacity building', 'training delivery', 'mentoring'], [], [6, 12, 20, 28, 36]),
  c('beh.stakeholder_coordination', 'Inter-Ministerial & Stakeholder Coordination', 'हितधारक समन्वय', 'behavioural', 'behavioural',
    ['coordination', 'inter departmental', 'liaison', 'state coordination', 'committee work'], [], [6, 12, 18, 26, 32]),
];

export const COMPETENCY_BY_ID: Record<string, Competency> =
  Object.fromEntries(COMPETENCIES.map((x) => [x.id, x]));

export const PILLAR_META: Record<Pillar, { label: string; labelHi: string; color: string }> = {
  statistical: { label: 'Statistical & Domain',      labelHi: 'सांख्यिकीय',     color: '#0F172A' },
  technical:   { label: 'Technical & Digital',       labelHi: 'तकनीकी',         color: '#F59E0B' },
  governance:  { label: 'Digital Governance',        labelHi: 'डिजिटल शासन',   color: '#3B82F6' },
  behavioural: { label: 'Behavioural & Managerial',  labelHi: 'व्यवहारिक',      color: '#10B981' },
};
