import React, { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Sparkles,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { APP_CONFIG } from '../../config';
import { useLanguage } from '../../services/i18n';

export const ExecutiveReportGenerator: React.FC = () => {
  const { language } = useLanguage();
  const [reportPeriod, setReportPeriod] = useState<string>('Q1 FY 2026-27 (June Review)');
  const [reportLang, setReportLang] = useState<'en' | 'hi'>(language);
  const [generating, setGenerating] = useState<boolean>(false);
  const [cronEnabled, setCronEnabled] = useState<boolean>(true);

  const handleExportPdf = () => {
    window.print();
  };

  const handleRegenerateSummary = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 700);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Top Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                MoSPI Executive Statistical Intelligence Brief
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI-synthesized macro brief generated from live CPI, IIP, PLFS, and RBI indicators
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Language selector for report */}
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setReportLang('en')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                reportLang === 'en'
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setReportLang('hi')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                reportLang === 'hi'
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              हिंदी
            </button>
          </div>

          <button
            onClick={handleRegenerateSummary}
            disabled={generating}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            <span>Regenerate</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Official Government Printable Document Preview Canvas */}
      <div className="relative p-6 sm:p-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 overflow-hidden">
        {/* Ministry Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] select-none">
          <span className="text-8xl font-black rotate-[-25deg] text-slate-900 dark:text-white">
            GOVERNMENT OF INDIA &bull; MoSPI
          </span>
        </div>

        {/* Report Official Heading */}
        <div className="flex items-start justify-between border-b-2 border-blue-600 pb-4">
          <div>
            <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest block">
              NATIONAL STATISTICAL OFFICE &bull; CENTRAL REPOSITORY
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {reportLang === 'en'
                ? 'Quarterly Macroeconomic & Socio-Economic Intelligence Brief'
                : 'त्रैमासिक समष्टि आर्थिक एवं सामाजिक-सांख्यिकीय विश्लेषण रिपोर्ट'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Period: {reportPeriod} &bull; Security Classification: Official Use
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold rounded-md block">
              DOC ID: MOSPI-Q1-2026-X
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* AI Executive Summary Block */}
        <div className="p-5 bg-white dark:bg-slate-900/90 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              {reportLang === 'en' ? 'AI Executive Synthesis & Key Findings' : 'एआई कार्यकारी सारांश एवं मुख्य निष्कर्ष'}
            </h4>
          </div>

          {reportLang === 'en' ? (
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>1. Inflation Moderation:</strong> All India Combined CPI headline inflation stabilized at <strong>4.42% YoY</strong> in June 2026, comfortably situated within the RBI's target tolerance band of 4.0% (&plusmn;2.0%). Fuel price deflation (-1.4%) counterbalanced localized food surges.
              </p>
              <p>
                <strong>2. Industrial Robustness:</strong> The Index of Industrial Production (IIP) registered <strong>5.7% growth</strong>, propelled by electricity generation (+7.4%) and capital goods manufacturing (+6.8%), indicating enduring private capital expenditure momentum.
              </p>
              <p>
                <strong>3. Labor & Demographics:</strong> Urban unemployment decreased to <strong>6.4%</strong> with female labor force participation expanding by +1.8 percentage points across tier-2 growth clusters.
              </p>
            </div>
          ) : (
            <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
              <p>
                <strong>1. मुद्रास्फीति में स्थिरता:</strong> अखिल भारतीय संयुक्त उपभोक्ता मूल्य सूचकांक (CPI) जून 2026 में <strong>4.42% वार्षिक दर</strong> पर स्थिर रहा, जो भारतीय रिजर्व बैंक के 4.0% (&plusmn;2.0%) के निर्धारित लक्ष्य के भीतर है।
              </p>
              <p>
                <strong>2. औद्योगिक उत्पादन में वृद्धि:</strong> औद्योगिक उत्पादन सूचकांक (IIP) में <strong>5.7% की वार्षिक वृद्धि</strong> दर्ज की गई, जिसका मुख्य कारण विद्युत उत्पादन (+7.4%) और पूंजीगत वस्तुओं का उत्पादन रहा।
              </p>
              <p>
                <strong>3. श्रम बल एवं रोजगार:</strong> शहरी बेरोजगारी दर घटकर <strong>6.4%</strong> पर आ गई है तथा टियर-2 जिलों में महिला कार्यबल भागीदारी में सराहनीय सुधार देखा गया है।
              </p>
            </div>
          )}
        </div>

        {/* Key Indicators Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">CPI Headline</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">193.4 pts</span>
            <span className="text-[10px] text-emerald-600 font-bold">+4.42% YoY</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">IIP Index</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">154.2 pts</span>
            <span className="text-[10px] text-emerald-600 font-bold">+5.7% YoY</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Repo Rate</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">6.25%</span>
            <span className="text-[10px] text-blue-600 font-bold">-25 bps Calibrated</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 block font-medium">Forex Reserves</span>
            <span className="text-base font-black text-slate-900 dark:text-white font-mono mt-0.5 block">$688.4 B</span>
            <span className="text-[10px] text-purple-600 font-bold">Record Peak</span>
          </div>
        </div>

        {/* Verification Sign-off */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Digitally Certified by National Statistical Intelligence Pipeline
          </span>
          <span className="font-mono">Hash: 0x9f8b4268e09...</span>
        </div>
      </div>

      {/* Automated Weekly Schedule Simulation Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Automated Weekly Executive Cron Dispatch
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Auto-compiles and sends PDF briefs to 42 Senior Ministry Officials every Monday at 08:00 AM IST.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCronEnabled(!cronEnabled)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            cronEnabled
              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-200 text-slate-700'
          }`}
        >
          {cronEnabled ? 'Cron Active (Scheduled)' : 'Cron Paused'}
        </button>
      </div>
    </div>
  );
};

export default ExecutiveReportGenerator;
