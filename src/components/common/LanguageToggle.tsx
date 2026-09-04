import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../services/i18n';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className={`inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 ${className}`}>
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
          language === 'en'
            ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Globe className="w-3.5 h-3.5" />
        <span>English</span>
      </button>

      <button
        onClick={() => setLanguage('hi')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
          language === 'hi'
            ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
};

export default LanguageToggle;
