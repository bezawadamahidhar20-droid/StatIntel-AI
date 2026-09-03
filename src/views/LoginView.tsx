import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginView: React.FC = () => {
  const { navigate, switchRole } = useApp();
  const [email, setEmail] = useState('rajesh.sharma@mospi.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [ssoLoading, setSsoLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('vandana') || email.includes('admin')) {
      switchRole('ADMIN');
      navigate('admin-dashboard');
    } else {
      switchRole('LEARNER');
      navigate('dashboard');
    }
  };

  const handleSsoClick = () => {
    setSsoLoading(true);
    setTimeout(() => {
      setSsoLoading(false);
      switchRole('LEARNER');
      navigate('dashboard');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-900 text-amber-400 font-bold text-lg mb-3 shadow-md border border-blue-800">
          <span>सांख्यिकी</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Karmayogi Statistical Intelligence
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Official Single Sign-On • Ministry of Statistics & Programme Implementation
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-slate-900 py-8 px-4 shadow-xl border border-slate-200 dark:border-slate-800 sm:rounded-2xl sm:px-10">
          {/* Government SSO CTA */}
          <button
            onClick={handleSsoClick}
            disabled={ssoLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-white shadow-2xs transition-all mb-6"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>{ssoLoading ? 'Authenticating via Jan Parichay...' : 'Sign In with Government SSO (Parichay)'}</span>
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-medium">
                Or authenticate with Government Email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Employee ID or Official Gov Email
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh.sharma@mospi.gov.in"
                  className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Password / e-Pramaan Token
                </label>
                <a href="#" onClick={(e) => e.preventDefault()} className="text-blue-600 dark:text-blue-400 hover:underline text-[11px]">
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xs"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 dark:text-slate-400">
                Remember this secure workstation
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Selector for Judges */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 text-center">
              SIH Presentation Quick Demo Personas
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  switchRole('LEARNER');
                  navigate('dashboard');
                }}
                className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-left hover:border-blue-400 transition-colors"
              >
                <p className="font-bold text-blue-900 dark:text-blue-300 text-[11px]">Rajesh Sharma</p>
                <p className="text-[10px] text-blue-700 dark:text-blue-400">Statistical Officer (Learner)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  switchRole('ADMIN');
                  navigate('admin-dashboard');
                }}
                className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-left hover:border-purple-400 transition-colors"
              >
                <p className="font-bold text-purple-900 dark:text-purple-300 text-[11px]">Dr. V. Sengupta</p>
                <p className="text-[10px] text-purple-700 dark:text-purple-400">Head NSSTA (Admin)</p>
              </button>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4 text-[10.5px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NIC Cloud Verified
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-500" /> 256-Bit SSL Secured
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
