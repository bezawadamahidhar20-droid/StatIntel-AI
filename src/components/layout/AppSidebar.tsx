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
  const { activeView, navigate, userRole, currentUser, skillGaps } = useApp();

  const criticalGapsCount = skillGaps.filter((g) => g.severity === 'Critical').length;

  interface NavItem {
    id: AppView;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }

  const learnerNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Competency Overview', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Competency Digital Twin', icon: Cpu },
    {
      id: 'skill-gaps',
      label: 'Skill Gap Analysis',
      icon: Target,
      badge: criticalGapsCount > 0 ? `${criticalGapsCount} Gaps` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    { id: 'learning-path', label: 'Adaptive Path', icon: Route },
    { id: 'courses', label: 'MoSPI / NSSTA Catalog', icon: BookOpen },
    {
      id: 'quiz-generator',
      label: 'AI Quiz Studio',
      icon: Sparkles,
      badge: 'RAG',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    { id: 'assessment', label: 'Adaptive Assessments', icon: HelpCircle },
    { id: 'assistant', label: 'Karmayogi AI Assistant', icon: Bot },
    { id: 'history', label: 'Learning History', icon: History },
    { id: 'certificates', label: 'Verified Certificates', icon: Award },
    { id: 'profile', label: 'Officer Profile', icon: User },
  ];

  const adminNavItems: NavItem[] = [
    { id: 'admin-dashboard', label: 'Cadre Workforce Overview', icon: LayoutDashboard },
    {
      id: 'admin-heatmap',
      label: 'Competency Heatmap',
      icon: Flame,
      badge: '5 Divisions',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    },
    { id: 'admin-training-effectiveness', label: 'Training Effectiveness', icon: TrendingUp },
    {
      id: 'admin-predictive',
      label: 'Predictive Skill Demand',
      icon: BrainCircuit,
      badge: 'Forecast',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    { id: 'admin-training-planner', label: 'AI Training Planner', icon: CalendarDays },
  ];

  const currentItems = userRole === 'ADMIN' ? adminNavItems : learnerNavItems;

  const handleNav = (view: AppView) => {
    navigate(view);
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800 font-sans">
      {/* Cadre Indicator Banner */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center font-bold text-xs rounded-lg shrink-0">
            {userRole === 'ADMIN' ? 'ADM' : 'ISS'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">
              {currentUser.department}
            </p>
            <p className="text-[11px] text-slate-500 truncate font-medium">
              {currentUser.cadre}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {userRole === 'ADMIN' ? 'Cadre Intelligence' : 'Officer Competency Journey'}
        </p>

        {currentItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors group ${
                isActive
                  ? 'bg-blue-50 text-blue-800 font-semibold border-l-3 border-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-normal'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-700'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-full shrink-0 ml-2 border ${
                    item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
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
        <div className="p-3.5 mx-3 mb-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Role Readiness
            </span>
            <span className="font-bold text-blue-700 text-xs">
              {currentUser.roleReadiness}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentUser.roleReadiness}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Target: 85% for Senior Division postings. Complete gap recommendations to accelerate promotion readiness.
          </p>
        </div>
      )}

      {/* Bottom Switcher Footer */}
      <div className="p-3 border-t border-slate-200 bg-white text-xs text-slate-500 flex items-center justify-between font-sans">
        <span className="truncate font-medium text-slate-600">iGOT Karmayogi v4.2</span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Connected
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 h-full z-30 overflow-y-auto">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

