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
    isDarkMode,
    toggleDarkMode,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setSearchOpen,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#222222] bg-[#080808]/95 backdrop-blur-md text-white font-mono">
      {/* Top Government Strip */}
      <div className="bg-[#040404] text-[#888888] text-[10px] px-4 py-1 flex items-center justify-between border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-white">
            <span className="w-2 h-2 rounded-full bg-[#D8FE41] animate-pulse inline-block" />
            <span>भारत सरकार | Government of India</span>
          </div>
          <span className="hidden sm:inline text-[#333333]">|</span>
          <span className="hidden sm:inline text-[#aaaaaa]">Ministry of Statistics and Programme Implementation (MoSPI)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-[#888888]">
            Integrated with <span className="text-white font-bold">iGOT Karmayogi Bharat</span> & <span className="text-[#D8FE41] font-bold">NSSTA</span>
          </span>
          <button
            onClick={() => navigate(activeView === 'landing' ? 'dashboard' : 'landing')}
            className="text-[10px] uppercase font-bold text-[#D8FE41] hover:underline ml-2"
          >
            {activeView === 'landing' ? 'Launch App' : 'Public Portal'}
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded text-[#aaaaaa] hover:bg-[#181818] hover:text-white"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Government Emblem / Logo Avatar */}
            <div className="w-9 h-9 bg-[#141414] border border-[#D8FE41]/40 flex items-center justify-center text-[#D8FE41] font-black shadow-[0_0_10px_rgba(216,254,65,0.15)]">
              <span className="text-xs font-black tracking-wider">सां</span>
            </div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#D8FE41] transition-colors font-display">
                  Karmayogi Statistical Intelligence
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 border border-[#D8FE41]/50 bg-[#D8FE41]/10 text-[#D8FE41]">
                  SIH 2026
                </span>
              </div>
              <p className="text-[10px] text-[#777777] uppercase tracking-wider">
                Official Competency Twin & Adaptive Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger (Ctrl + K) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 bg-[#121212] border border-[#262626] text-xs text-[#777777] hover:text-white hover:border-[#D8FE41]/40 transition-all font-mono"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#888888]" />
              <span>Search competencies, courses, assessments...</span>
            </span>
            <kbd className="px-1.5 py-0.5 bg-[#1e1e1e] text-[10px] font-mono font-bold text-[#aaaaaa] border border-[#333333]">
              Ctrl K
            </kbd>
          </button>
        </div>

        {/* Right: Actions, Role Switcher & User Profile */}
        <div className="flex items-center gap-2.5">
          {/* SIH Demo Tour Quick Shortcut */}
          <div className="hidden xl:flex items-center">
            <button
              onClick={() => {
                navigate('quiz-generator');
              }}
              className="px-2.5 py-1.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#D8FE41]/40 text-[#D8FE41] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-[0_0_8px_rgba(216,254,65,0.15)]"
              title="Test the complete closed-loop assessment and score update flow"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D8FE41]" />
              <span>AI Quiz Generator</span>
            </button>
          </div>

          {/* Role Switcher Pill */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-[#333333] bg-[#141414] text-xs font-mono font-bold text-white hover:border-[#D8FE41]/50 uppercase tracking-wider transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-[#D8FE41]" />
              <span className="capitalize">{userRole.toLowerCase()}</span>
              <ChevronDown className="w-3 h-3 text-[#777777]" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-[#121212] border border-[#2a2a2a] shadow-2xl py-1.5 z-50 text-xs font-mono">
                <div className="px-3 py-1.5 border-b border-[#222222]">
                  <p className="text-[9px] uppercase font-bold text-[#777777] tracking-wider">Switch Platform Persona</p>
                </div>
                <button
                  onClick={() => {
                    switchRole('LEARNER');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#1c1c1c] ${
                    userRole === 'LEARNER' ? 'font-bold text-[#D8FE41] bg-[#181818]' : 'text-[#cccccc]'
                  }`}
                >
                  <div>
                    <p className="font-bold">Learner Official</p>
                    <p className="text-[10px] text-[#777777] font-normal">Rajesh Sharma (SSO, SDRD)</p>
                  </div>
                  {userRole === 'LEARNER' && <CheckCircle2 className="w-4 h-4 text-[#D8FE41]" />}
                </button>

                <button
                  onClick={() => {
                    switchRole('ADMIN');
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#1c1c1c] ${
                    userRole === 'ADMIN' ? 'font-bold text-[#D8FE41] bg-[#181818]' : 'text-[#cccccc]'
                  }`}
                >
                  <div>
                    <p className="font-bold">Director / MoSPI Admin</p>
                    <p className="text-[10px] text-[#777777] font-normal">Dr. Vandana Sengupta (Head, NSSTA)</p>
                  </div>
                  {userRole === 'ADMIN' && <CheckCircle2 className="w-4 h-4 text-[#D8FE41]" />}
                </button>
              </div>
            )}
          </div>

          {/* Notification Center */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 text-[#aaaaaa] hover:text-white hover:bg-[#141414] border border-transparent hover:border-[#222222] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D8FE41] ring-2 ring-[#080808]" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#121212] border border-[#282828] shadow-2xl py-2 z-50 text-xs font-mono">
                <div className="px-4 py-2 border-b border-[#222222] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-wider text-white">Notifications</span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.5 bg-[#D8FE41] text-black text-[9px] font-black uppercase">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] uppercase font-bold text-[#D8FE41] hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-[#202020]">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkView) navigate(n.linkView);
                        setNotifOpen(false);
                      }}
                      className={`p-3.5 hover:bg-[#181818] cursor-pointer transition-colors ${
                        !n.read ? 'bg-[#141414]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`font-bold ${!n.read ? 'text-[#D8FE41]' : 'text-white'}`}>
                          {n.title}
                        </p>
                        <span className="text-[9px] text-[#777777] shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[#999999] text-[11px] leading-relaxed">
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
            className="flex items-center gap-2.5 pl-2 cursor-pointer border-l border-[#222222] hover:opacity-80 transition-opacity"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 object-cover border border-[#D8FE41]/50"
            />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold font-mono text-white leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-[#777777] font-mono leading-tight truncate max-w-[140px]">
                {currentUser.designation}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
