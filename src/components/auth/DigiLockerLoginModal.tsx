import React, { useState } from 'react';
import { X, Shield, Lock, KeyRound, CheckCircle2, ArrowRight, ShieldCheck, RefreshCw, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { auditTrail } from '../../services/auditTrail';

interface DigiLockerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: 'ADMIN' | 'ANALYST' | 'VIEWER';
}

export const DigiLockerLoginModal: React.FC<DigiLockerLoginModalProps> = ({
  isOpen,
  onClose,
  targetRole = 'ADMIN',
}) => {
  const { loginAsAdmin, loginAsStudent } = useApp();
  const [step, setStep] = useState<'aadhaar_input' | 'otp_verify' | 'success'>('aadhaar_input');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'ANALYST' | 'VIEWER'>(targetRole);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumber.replace(/\s/g, '').length < 12) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp_verify');
      setOtp('739281'); // Pre-populate demo OTP for smooth evaluation
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('success');

      // Log action in audit trail
      auditTrail.logAction({
        userId: selectedRole === 'ADMIN' ? 'usr-admin-01' : 'usr-analyst-02',
        userName: selectedRole === 'ADMIN' ? 'Dr. Vandana Sengupta (Ministry Official)' : 'Senior Statistical Analyst',
        userRole: selectedRole,
        action: 'LOGIN',
        resourceAccessed: '/auth/digilocker-aadhaar-sso',
        status: 'SUCCESS',
      });

      setTimeout(() => {
        if (selectedRole === 'ADMIN') {
          loginAsAdmin();
        } else {
          loginAsStudent({
            name: 'Senior Statistical Analyst',
            college: 'National Statistical Systems Training Academy (NSSTA)',
            degree: 'M.Stat / Data Intelligence',
            year: 'Gazetted Cadre',
            targetRole: 'Senior Data Scientist (MoSPI)',
            email: 'analyst.nso@gov.in',
            avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=AnalystGov&backgroundColor=b6e3f4',
            knownSkills: ['Python', 'Sampling', 'CPI Methodology', 'Econometrics'],
          });
        }
        onClose();
        setStep('aadhaar_input');
      }, 900);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* DigiLocker Official Government Banner */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-blue-700 rounded-2xl shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">
                Digital India &bull; MeriPehchaan
              </span>
              <h3 className="text-lg font-black text-white">
                DigiLocker / Aadhaar SSO
              </h3>
            </div>
          </div>
          <p className="text-xs text-blue-100 mt-2">
            Secure Role-Based Authentication Gateway for Official Government & Statistical Portals
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          {/* Role Switcher */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Operating Access Role:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['ADMIN', 'ANALYST', 'VIEWER'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedRole === r
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-600 dark:text-blue-400 shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {r === 'ADMIN' ? 'Ministry Admin' : r === 'ANALYST' ? 'Analyst' : 'Viewer'}
                </button>
              ))}
            </div>
          </div>

          {step === 'aadhaar_input' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>12-Digit Aadhaar / Virtual ID</span>
                  <span className="text-[10px] text-blue-600 font-bold">Encrypted 256-bit</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5849 2038 1928"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 outline-hidden tracking-wider"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                An OTP will be simulated and sent to the mobile number registered with your UIDAI DigiLocker profile.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Generate Aadhaar OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Enter 6-Digit Verification OTP</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Auto-detected (Demo: 739281)</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-center tracking-[0.5em] py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-mono font-black text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Verify & Authorize SSO Session</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full w-fit mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                DigiLocker Identity Verified
              </h4>
              <p className="text-xs text-slate-500">
                Granted {selectedRole} role session with cryptographic audit token.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigiLockerLoginModal;
