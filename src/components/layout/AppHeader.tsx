import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  Moon,
  Sun,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Play,
  Sparkles,
  ChevronDown,
  Layers,
  Menu,
  GraduationCap,
  LogOut,
  KeyRound,
  UserPlus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface AppHeaderProps {
  onMobileMenuToggle?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    currentUser,
    userRole,
    switchRole,
    activeView,
    navigate,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSearchOpen,
    isAuthenticated,
    setIsAuthModalOpen,
    setIsAdminAuthModalOpen,
    logout,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md text-slate-800">
      {/* Top Government & Academic Strip */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span>National Student Statistical Intelligence</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="hidden sm:inline text-slate-400">MoSPI Benchmarking • iGOT Karmayogi Bharat & NSSTA Academic Curricula</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-400 text-[11px]">
            Academic Consortium • <span className="text-white font-medium">Student Skill Intelligence & Digital Twin</span>
          </span>
          <button
            onClick={() => navigate(activeView === 'landing' ? 'dashboard' : 'landing')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline ml-2"
          >
            {activeView === 'landing' ? 'Student Portal →' : 'Public Home'}
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Branding */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => navigate(isAuthenticated ? 'dashboard' : 'landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Academic Logo */}
            <div className="w-10 h-10 bg-blue-900 text-amber-400 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs border border-blue-800">
              <GraduationCap className="w-5 h-5 text-amber-400" />
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors font-display">
                  StatIntel AI
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800">
                  Student Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Student Statistical Skill Intelligence & Digital Twin
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger (Ctrl + K) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:border-blue-400 transition-all shadow-2xs"
          >
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>Search competencies, courses, student roadmaps...</span>
            </span>
            <kbd className="px-1.5 py-0.5 bg-white text-[11px] font-mono font-medium text-slate-500 rounded border border-slate-200 shadow-2xs">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Auth Buttons & User Profile */}
        <div className="flex items-center gap-3">
          {/* SIH Evaluation Indicator */}
          <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>SIH 2026 EVALUATION</span>
          </div>

          {!isAuthenticated ? (
            /* Unauthenticated Visitor Options */
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Login / Demo</span>
              </button>

              <button
                onClick={() => setIsAdminAuthModalOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Faculty Access</span>
              </button>
            </div>
          ) : (
            /* Authenticated User Actions */
            <div className="flex items-center gap-2.5">
              {/* Role Indicator & Safe Switcher */}
              {userRole === 'LEARNER' ? (
                <button
                  onClick={() => setIsAdminAuthModalOpen(true)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all"
                  title="Faculty Portal requires passcode"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-500" />
                  <span>Faculty Admin Portal</span>
                </button>
              ) : (
                <button
                  onClick={() => switchRole('LEARNER')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Exit Admin Mode</span>
                </button>
              )}

              {/* Notification Center */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">Student Notifications</span>
                        {unreadNotificationCount > 0 && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full">
                            {unreadNotificationCount} new
                          </span>
                        )}
                      </div>
                      {unreadNotificationCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.linkView) navigate(n.linkView);
                            setNotifOpen(false);
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                            !n.read ? 'bg-blue-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`font-semibold text-xs ${!n.read ? 'text-blue-900' : 'text-slate-800'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Pill */}
              <div
                onClick={() => navigate('profile')}
                className="flex items-center gap-2.5 pl-2 cursor-pointer border-l border-slate-200 hover:opacity-80 transition-opacity"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[11px] text-slate-500 leading-tight truncate max-w-[140px]">
                    {userRole === 'ADMIN' ? 'Faculty Admin' : currentUser.designation}
                  </p>
                </div>
              </div>

              {/* Logout / Switch User Button */}
              <button
                onClick={logout}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign out / Switch Student"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
