import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  trend?: {
    value: string;
    label?: string;
    isPositive?: boolean;
    isWarning?: boolean;
  };
  progress?: {
    current: number;
    total: number;
    color?: string;
  };
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-700',
  iconBg = 'bg-blue-50 border border-blue-100',
  trend,
  progress,
  onClick,
  className = '',
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 border border-slate-200 bg-white rounded-xl shadow-xs transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-blue-300 hover:shadow-md' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full border ${
                  trend.isWarning
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : trend.isPositive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 line-clamp-1 pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-2.5 rounded-xl shrink-0 ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progress && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
            <span>Index Status</span>
            <span className="font-semibold text-blue-700">
              {progress.current}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progress.color || 'bg-blue-600'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress.current))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

