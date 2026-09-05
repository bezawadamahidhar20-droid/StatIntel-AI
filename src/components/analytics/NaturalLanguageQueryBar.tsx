import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Search,
  Mic,
  MicOff,
  X,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Copy,
  Check,
  Globe2,
  ChevronRight,
  Database,
  Cpu,
} from 'lucide-react';
import { submitNLPQuery, NLPQueryResponse, StructuredQueryData } from '../../services/nlpService';

interface NaturalLanguageQueryBarProps {
  onNavigateTab?: (tab: 'overview' | 'map' | 'forecasting' | 'scenario' | 'explainability' | 'anomalies' | 'comparison' | 'reports') => void;
}

export const NaturalLanguageQueryBar: React.FC<NaturalLanguageQueryBarProps> = ({ onNavigateTab }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NLPQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeLangFilter, setActiveLangFilter] = useState<'all' | 'en' | 'hi' | 'ta'>('all');
  const [showDebugPipeline, setShowDebugPipeline] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
        handleExecuteQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('[Speech Recognition Error]:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition is not supported in this browser. Please use Google Chrome, Edge, or a Web Speech-compatible browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Set recognition language based on query or default to English/India
      if (activeLangFilter === 'hi') {
        recognitionRef.current.lang = 'hi-IN';
      } else if (activeLangFilter === 'ta') {
        recognitionRef.current.lang = 'ta-IN';
      } else {
        recognitionRef.current.lang = 'en-IN';
      }

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start voice recognition:', err);
        setIsListening(false);
      }
    }
  };

  const handleExecuteQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await submitNLPQuery(queryText);
      setResult(res);
      if (res.structured_query && !res.structured_query.is_valid) {
        setError(res.answer);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process natural language query.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecuteQuery(query);
  };

  const handleClear = () => {
    setQuery('');
    setResult(null);
    setError(null);
  };

  const handleCopyAnswer = () => {
    if (!result?.answer) return;
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Example questions categorised by language
  const exampleQueries = [
    {
      lang: 'en',
      badge: 'English',
      text: 'Show literacy trend in Tamil Nadu',
      label: '📈 Literacy Trend (TN)',
    },
    {
      lang: 'en',
      badge: 'English',
      text: 'Which districts have the highest literacy rate?',
      label: '🏆 Top Districts Ranking',
    },
    {
      lang: 'en',
      badge: 'English',
      text: 'What was the literacy growth in Tamil Nadu over the last 5 years?',
      label: '📊 5-Year Growth Delta',
    },
    {
      lang: 'en',
      badge: 'English',
      text: 'What factors influenced the prediction for Dharmapuri?',
      label: '🔬 Explain Prediction (SHAP)',
    },
    {
      lang: 'en',
      badge: 'English',
      text: 'What would need to change to improve the district tier?',
      label: '⚡ Counterfactual Analysis',
    },
    {
      lang: 'hi',
      badge: 'हिन्दी',
      text: 'तमिलनाडु में साक्षरता दर दिखाइए',
      label: '📈 तमिलनाडु साक्षरता दर',
    },
    {
      lang: 'hi',
      badge: 'हिन्दी',
      text: 'मॉडल भविष्यवाणी के मुख्य कारक क्या हैं?',
      label: '🔬 भविष्यवाणी के कारक (SHAP)',
    },
    {
      lang: 'ta',
      badge: 'தமிழ்',
      text: 'தமிழ்நாட்டின் கல்வியறிவு விகிதத்தை காட்டுங்கள்',
      label: '📈 கல்வியறிவு விகிதம்',
    },
    {
      lang: 'ta',
      badge: 'தமிழ்',
      text: 'கணிப்புக்கு காரணமான முக்கிய காரணிகள் என்ன?',
      label: '🔬 கணிப்பு காரணிகள் (SHAP)',
    },
  ];

  const filteredExamples =
    activeLangFilter === 'all'
      ? exampleQueries
      : exampleQueries.filter((q) => q.lang === activeLangFilter);

  // Dynamic badge color based on detected language
  const getLangBadge = (lang?: string) => {
    switch (lang) {
      case 'ta':
        return { label: 'தமிழ் (Tamil)', bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' };
      case 'hi':
        return { label: 'हिन्दी (Hindi)', bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      default:
        return { label: 'English (EN)', bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-blue-500 rounded-xl text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Ask StatIntel-AI &mdash; Multilingual Natural Language Analytics
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-full font-semibold">
                Multilingual NL Parser (EN/HI/TA)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ask questions in <strong className="text-slate-700 dark:text-slate-300">English</strong>, <strong className="text-slate-700 dark:text-slate-300">हिन्दी (Hindi)</strong>, or <strong className="text-slate-700 dark:text-slate-300">தமிழ் (Tamil)</strong> for instant statistical synthesis.
            </p>
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          {(['all', 'en', 'hi', 'ta'] as const).map((l) => (
            <button
              key={l}
              onClick={() => setActiveLangFilter(l)}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeLangFilter === l
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {l === 'all' ? 'All Languages' : l === 'en' ? 'English' : l === 'hi' ? 'हिन्दी' : 'தமிழ்'}
            </button>
          ))}
        </div>
      </div>

      {/* Query Form Input */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a statistical question (e.g. 'Show literacy trend in Tamil Nadu' or 'தமிழ்நாட்டில் அதிக கல்வியறிவு...')"
            className="w-full pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={isListening ? 'Listening... click to stop' : 'Voice search in English/Hindi/Tamil'}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Suggestion Chips */}
      <div className="flex items-center gap-1.5 flex-wrap pt-1">
        <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          Examples:
        </span>
        {filteredExamples.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setQuery(ex.text);
              handleExecuteQuery(ex.text);
            }}
            className="text-[11px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-300 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 rounded-lg transition-all cursor-pointer"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Result Presentation */}
      {result && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          {/* Main Answer Card */}
          <div className="p-4 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-blue-50/50 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-blue-950/30 border border-indigo-100 dark:border-indigo-900/40 rounded-xl space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    getLangBadge(result.detected_language).bg
                  }`}
                >
                  {getLangBadge(result.detected_language).label}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full">
                  Intent: {result.prediction}
                </span>
                {result.region_entity && (
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-indigo-500" />
                    {result.region_entity}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAnswer}
                  className="text-[11px] text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDebugPipeline(!showDebugPipeline)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Database className="w-3 h-3" />
                  <span>{showDebugPipeline ? 'Hide Pipeline' : 'Structured Query'}</span>
                </button>
              </div>
            </div>

            {/* Localized Natural Language Answer */}
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
              {result.answer}
            </p>

            {/* Supporting Data Points / Action Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-indigo-100/60 dark:border-indigo-900/30">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Period: <strong>{result.structured_query?.start_year || 2021}–{result.structured_query?.end_year || 2026}</strong>
                </span>
                {result.indicator && (
                  <>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span>
                      Indicator: <strong className="text-indigo-600 dark:text-indigo-400">{result.structured_query?.indicator_display || result.indicator}</strong>
                    </span>
                  </>
                )}
              </div>

              {/* Action Button linking to dashboard tabs */}
              {onNavigateTab && result.suggested_action && (
                <button
                  type="button"
                  onClick={() => {
                    if (result.suggested_action === 'view_map') {
                      onNavigateTab('map');
                    } else if (result.suggested_action === 'view_forecast') {
                      onNavigateTab('forecasting');
                    } else if (result.suggested_action === 'view_scenario') {
                      onNavigateTab('scenario');
                    } else if (result.suggested_action === 'view_explainability') {
                      onNavigateTab('explainability');
                    } else {
                      onNavigateTab('overview');
                    }
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 transition-all cursor-pointer self-start sm:self-auto"
                >
                  <span>
                    {result.suggested_action === 'view_map'
                      ? 'View District Heatmap'
                      : result.suggested_action === 'view_forecast'
                      ? 'Explore Forecasts & SHAP'
                      : result.suggested_action === 'view_scenario'
                      ? 'Open Policy Scenario Planner'
                      : result.suggested_action === 'view_explainability'
                      ? 'View SHAP & Counterfactuals'
                      : 'View on Dashboard'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Intermediate Safe Structured Query Debug Panel */}
          {showDebugPipeline && result.structured_query && (
            <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                  <Cpu className="w-3.5 h-3.5" />
                  Validated Intermediate Query Pipeline (No SQL Injection Risk)
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">
                  {result.structured_query.is_valid ? 'STATUS: VALIDATED' : 'STATUS: CLARIFICATION'}
                </span>
              </div>
              <pre className="overflow-x-auto text-[11px] text-emerald-300 bg-slate-950 p-2.5 rounded-lg">
                {JSON.stringify(result.structured_query, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageQueryBar;
