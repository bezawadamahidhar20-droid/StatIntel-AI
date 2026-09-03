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
  iconColor = 'text-[#D8FE41]',
  iconBg = 'bg-[#181818] border border-[#2a2a2a]',
  trend,
  progress,
  onClick,
  className = '',
}) => {
  return (
    <div
      id={id}
      onClick={onClick}
      className={`relative p-5 border border-[#222222] bg-[#121212] font-mono transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-[#D8FE41]/60 hover:shadow-[0_0_15px_rgba(216,254,65,0.12)]' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-[#777777] tracking-wider uppercase">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black tracking-tight text-white font-display">
              {value}
            </h3>
            {trend && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                  trend.isWarning
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800'
                    : trend.isPositive
                    ? 'bg-[#D8FE41]/10 text-[#D8FE41] border border-[#D8FE41]/30'
                    : 'bg-[#181818] text-[#888888] border border-[#262626]'
                }`}
              >
                {trend.value}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-[#888888] line-clamp-1 pt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-2.5 shrink-0 ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {progress && (
        <div className="mt-4 pt-2.5 border-t border-[#1e1e1e]">
          <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#777777] mb-1">
            <span>INDEX STATUS</span>
            <span className="text-[#D8FE41]">
              {progress.current}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#202020] overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progress.color || 'bg-[#D8FE41]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, progress.current))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
