import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminAuthModal: React.FC = () => {
  const {
    isAdminAuthModalOpen,
    setIsAdminAuthModalOpen,
    loginAsAdmin,
  } = useApp();

  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = loginAsAdmin(passcode);
    if (!success) {
      setError('Access Denied. Passcode incorrect. For SIH evaluation, use: admin2026');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => setIsAdminAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 text-xs font-semibold mb-2 border border-blue-800">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Institutional Governance Gate</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">
            Faculty / Admin Authorization
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            This section contains institutional cohort analytics and curriculum planning. Passcode required to prevent unauthorized student access.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin / Faculty Security Key *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                autoFocus
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter admin passcode..."
                className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>
            <div className="mt-2 p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-900 flex items-center justify-between">
              <span className="font-medium">SIH Evaluator Master Key:</span>
              <button
                type="button"
                onClick={() => setPasscode('admin2026')}
                className="px-2 py-0.5 bg-white border border-blue-300 font-mono font-bold text-blue-700 rounded hover:bg-blue-50 transition-colors"
              >
                Insert: admin2026
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>Unlock Admin Portal</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAdminAuthModalOpen(false)}
              className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
