/**
 * Bilingual i18n Translation Dictionary (English & Hindi) for StatIntel-AI
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi';

export const TRANSLATIONS = {
  en: {
    // Navigation & Header
    appName: 'StatIntel-AI',
    tagline: 'Statistical Intelligence Platform',
    dashboard: 'Intelligence Dashboard',
    indiaMap: 'District Analytics Map',
    forecasting: 'Predictive Forecasting',
    anomalies: 'Anomaly Alerts',
    reports: 'Executive Reports',
    dataUpload: 'Upload Datasets',
    builtFor: 'Built for MoSPI',
    problemId: 'Problem Statement: SIH-2024-PS-1628',
    
    // KPI Cards
    cpiTitle: 'Consumer Price Index (Combined)',
    iipTitle: 'Index of Industrial Production',
    repoRateTitle: 'RBI Policy Repo Rate',
    workforceReadiness: 'Workforce Competency Index',
    datasetsAnalyzed: 'Datasets Analyzed Live',
    
    // Analytics & Charts
    timeSeriesTitle: 'Time-Series Forecast & Uncertainty Bounds',
    forecastModel: 'Prophet + LSTM Hybrid Model',
    confidenceInterval: '95% Confidence Band',
    upperBound: 'Upper Bound',
    lowerBound: 'Lower Bound',
    historicalData: 'Historical Data',
    forecastPoint: 'Forecast Projection',
    
    // Anomaly Alerts
    anomalyHeading: 'Real-Time Statistical Anomalies',
    critical: 'Critical',
    warning: 'Warning',
    viewShap: 'View SHAP Explanation',
    dismiss: 'Acknowledge',
    
    // Comparison Mode
    comparisonTitle: 'Comparative Macroeconomic Analytics',
    yoyMode: 'Year-over-Year (YoY)',
    stateVsState: 'State vs State',
    selectStateA: 'Select Benchmark State',
    selectStateB: 'Select Comparison State',
    
    // Data Upload
    uploadTitle: 'Smart Dataset Ingestion & Auto-Clean',
    dragDropText: 'Drag and drop your CSV, Excel, or JSON dataset here',
    browseFiles: 'Browse Files',
    qualityScore: 'Data Cleanliness Score',
    readyForAnalysis: 'Verified Ready for Machine Learning Pipelines',
    
    // Buttons & Actions
    explainAiBtn: 'Explain Prediction (SHAP)',
    exportPdf: 'Export Official Report (PDF)',
    loginAsAdmin: 'Ministry Official Login',
    loginAsAnalyst: 'Analyst Access',
    demoVideo: 'Watch 30s Interactive Demo',
  },
  hi: {
    // Navigation & Header
    appName: 'स्टेटइंटेल-एआई',
    tagline: 'सांख्यिकी आसूचना एवं डेटा विश्लेषण मंच',
    dashboard: 'आसूचना डैशबोर्ड',
    indiaMap: 'जिला सांख्यिकी मानचित्र',
    forecasting: 'पूर्वानुमान एवं रुझान विश्लेषण',
    anomalies: 'विसंगति अलर्ट',
    reports: 'कार्यकारी रिपोर्ट',
    dataUpload: 'डेटासेट अपलोड करें',
    builtFor: 'सांख्यिकी एवं कार्यक्रम कार्यान्वयन मंत्रालय (MoSPI) हेतु निर्मित',
    problemId: 'समस्या विवरण आईडी: SIH-2024-PS-1628',
    
    // KPI Cards
    cpiTitle: 'उपभोक्ता मूल्य सूचकांक (संयुक्त)',
    iipTitle: 'औद्योगिक उत्पादन सूचकांक (IIP)',
    repoRateTitle: 'आरबीआई नीतिगत रेपो दर',
    workforceReadiness: 'कार्यबल सांख्यिकी दक्षता सूचकांक',
    datasetsAnalyzed: 'विश्लेषित राष्ट्रीय डेटासेट',
    
    // Analytics & Charts
    timeSeriesTitle: 'समय-श्रृंखला पूर्वानुमान एवं 95% विश्वास बैंड',
    forecastModel: 'प्रॉफेट + एलएसटीएम हाइब्रिड मॉडल',
    confidenceInterval: '95% विश्वास अंतराल',
    upperBound: 'उच्चतम सीमा',
    lowerBound: 'न्यूनतम सीमा',
    historicalData: 'ऐतिहासिक डेटा',
    forecastPoint: 'अनुमानित प्रक्षेपण',
    
    // Anomaly Alerts
    anomalyHeading: 'वास्तविक समय सांख्यिकीय विसंगतियां',
    critical: 'अति-गंभीर',
    warning: 'चेतावनी',
    viewShap: 'SHAP विश्लेषण देखें',
    dismiss: 'स्वीकार करें',
    
    // Comparison Mode
    comparisonTitle: 'तुलनात्मक समष्टि आर्थिक विश्लेषण',
    yoyMode: 'वर्ष-दर-वर्ष (YoY)',
    stateVsState: 'राज्य बनाम राज्य तुलना',
    selectStateA: 'मानक राज्य चुनें',
    selectStateB: 'तुलना हेतु राज्य चुनें',
    
    // Data Upload
    uploadTitle: 'डेटासेट अपलोड एवं स्वतः गुणवत्ता परीक्षण',
    dragDropText: 'अपनी सीएसवी (CSV), एक्सेल या जेसन फाइल यहां खींचें',
    browseFiles: 'फाइल चुनें',
    qualityScore: 'डेटा स्वच्छता एवं शुद्धता स्कोर',
    readyForAnalysis: 'मशीन लर्निंग विश्लेषण हेतु सत्यापित',
    
    // Buttons & Actions
    explainAiBtn: 'एआई पूर्वानुमान विश्लेषण (SHAP)',
    exportPdf: 'आधिकारिक पीडीएफ रिपोर्ट डाउनलोड करें',
    loginAsAdmin: 'मंत्रालय अधिकारी लॉगिन',
    loginAsAnalyst: 'डेटा विश्लेषक लॉगिन',
    demoVideo: '30 सेकंड का लाइव डेमो देखें',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['en']) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => TRANSLATIONS['en'][key] || String(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('statintel_lang') as Language) || 'en';
    }
    return 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('statintel_lang', lang);
    }
  };

  const t = (key: keyof typeof TRANSLATIONS['en']): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en'][key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
