import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Target,
  Route,
  BookOpen,
  HelpCircle,
  FileSpreadsheet,
  Bot,
  History,
  Award,
  User,
  BarChart3,
  Flame,
  Building2,
  TrendingUp,
  BrainCircuit,
  CalendarDays,
  Sparkles,
  Layers,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp, AppView } from '../../context/AppContext';

interface AppSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  mobileOpen = false,
  onMobileClose,
}) => {
  const { activeView, navigate, userRole, currentUser, skillGaps, unreadNotificationCount } = useApp();

  const criticalGapsCount = skillGaps.filter((g) => g.severity === 'Critical').length;

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }

  const learnerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Learner Overview', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Competency Digital Twin', icon: Cpu },
    {
      id: 'skill-gaps',
      label: 'Skill Gap Analysis',
      icon: Target,
      badge: criticalGapsCount > 0 ? `${criticalGapsCount} Gaps` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
    },
    { id: 'learning-path', label: 'Personalized Path', icon: Route },
    { id: 'courses', label: 'iGOT / NSSTA Courses', icon: BookOpen },
    {
      id: 'quiz-generator',
      label: 'AI Quiz Generator',
      icon: Sparkles,
      badge: 'Grounded',
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
    },
    { id: 'assessment', label: 'Adaptive Assessments', icon: HelpCircle },
    { id: 'assistant', label: 'Karmayogi AI Assistant', icon: Bot },
    { id: 'history', label: 'Learning History', icon: History },
    { id: 'certificates', label: 'Verified Certificates', icon: Award },
    { id: 'profile', label: 'Official Profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Workforce Overview', icon: LayoutDashboard },
    {
      id: 'admin-heatmap',
      label: 'Competency Heatmap',
      icon: Flame,
      badge: '5 Divs',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
    },
    { id: 'admin-training-effectiveness', label: 'Training Effectiveness', icon: TrendingUp },
    {
      id: 'admin-predictive',
      label: 'Predictive Skill Demand',
      icon: BrainCircuit,
      badge: 'AI Forecast',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
    },
    { id: 'admin-training-planner', label: 'AI Training Planner', icon: CalendarDays },
  ];

  const currentItems = userRole === 'ADMIN' ? adminNavItems : learnerNavItems;

  const handleNav = (view: AppView) => {
    navigate(view);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0c0c0c] border-r border-[#222222] text-white font-mono">
      {/* Cadre Indicator Banner */}
      <div className="p-4 border-b border-[#222222] bg-[#121212]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#181818] border border-[#D8FE41]/40 text-[#D8FE41] flex items-center justify-center font-black text-xs shrink-0">
            {userRole === 'ADMIN' ? 'ADM' : 'ISS'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-black uppercase tracking-wider text-white truncate font-display">
              {currentUser.department}
            </p>
            <p className="text-[10px] text-[#777777] uppercase truncate">
              {currentUser.cadre}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-black uppercase tracking-widest text-[#666666]">
          {userRole === 'ADMIN' ? '// Executive Governance' : '// Competency Journey'}
        </p>

        {currentItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-xs transition-all group ${
                isActive
                  ? 'bg-[#D8FE41] text-black font-black uppercase tracking-wider shadow-[0_0_12px_rgba(216,254,65,0.3)]'
                  : 'text-[#888888] hover:bg-[#181818] hover:text-white font-bold uppercase tracking-wider'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-black' : 'text-[#777777] group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[9px] font-black uppercase shrink-0 ml-2 border ${
                    isActive
                      ? 'bg-black text-[#D8FE41] border-black'
                      : 'bg-[#181818] text-[#D8FE41] border-[#333333]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Closed Loop Intelligence Mini-Widget */}
      {userRole === 'LEARNER' && (
        <div className="p-3 mx-2 mb-3 bg-[#121212] border border-[#262626] text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-white flex items-center gap-1.5 text-[10px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#D8FE41]" />
              Role Readiness
            </span>
            <span className="font-black text-[#D8FE41] text-xs">
              {currentUser.roleReadiness}%
            </span>
          </div>
          <div className="w-full bg-[#202020] h-1.5 overflow-hidden mb-2">
            <div
              className="bg-[#D8FE41] h-full transition-all duration-500 shadow-[0_0_8px_rgba(216,254,65,0.5)]"
              style={{ width: `${currentUser.roleReadiness}%` }}
            />
          </div>
          <p className="text-[10px] text-[#777777] leading-tight">
            Target: 85% for Senior Division postings. Take assessments to boost score.
          </p>
        </div>
      )}

      {/* Bottom Switcher Footer */}
      <div className="p-3 border-t border-[#222222] bg-[#0e0e0e] text-[10px] text-[#666666] flex items-center justify-between font-mono">
        <span className="truncate uppercase font-bold">iGOT Karmayogi v4.2</span>
        <span className="font-mono text-[9px] bg-[#D8FE41] text-black px-1.5 py-0.5 font-black uppercase">
          LIVE
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
