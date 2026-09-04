import React, { useState } from 'react';
import { Competency } from '../../types';

interface CompetencyRadarProps {
  competencies: Competency[];
  size?: number;
  className?: string;
  onSelectCompetency?: (comp: Competency) => void;
}

export const CompetencyRadar: React.FC<CompetencyRadarProps> = ({
  competencies,
  size = 400,
  className = '',
  onSelectCompetency,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group or take top key competencies for the radar
  // Take 6 representative competencies to form a clear polygon
  const radarItems = competencies.slice(0, 6);
  const totalAxes = radarItems.length;
  if (totalAxes < 3) return null;

  const center = size / 2;
  const radius = size * 0.36;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Calculate coordinates
  const getCoordinates = (valueNormalized: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = radius * Math.min(1, Math.max(0.1, valueNormalized));
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Generate background concentric polygons (20%, 40%, 60%, 80%, 100%)
  const concentricLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Current Scores Polygon
  const currentPoints = radarItems
    .map((item, i) => {
      const coords = getCoordinates(item.currentScore / 100, i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Required Scores Polygon
  const requiredPoints = radarItems
    .map((item, i) => {
      const coords = getCoordinates(item.requiredScore / 100, i);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible select-none"
      >
        <defs>
          <linearGradient id="currentAreaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="requiredAreaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#64748b" stopOpacity="0.03" />
          </linearGradient>
        </defs>

        {/* Concentric Grid Polygons */}
        {concentricLevels.map((lvl) => {
          const polyPoints = Array.from({ length: totalAxes })
            .map((_, i) => {
              const coords = getCoordinates(lvl, i);
              return `${coords.x},${coords.y}`;
            })
            .join(' ');
          return (
            <polygon
              key={`grid-${lvl}`}
              points={polyPoints}
              fill="none"
              stroke="#e2e8f0"
              strokeDasharray={lvl === 1.0 ? 'none' : '3 3'}
              strokeWidth={lvl === 1.0 ? 1.5 : 1}
            />
          );
        })}

        {/* Radial Axis Lines */}
        {radarItems.map((_, i) => {
          const outerCoords = getCoordinates(1.0, i);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={outerCoords.x}
              y2={outerCoords.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Target/Required Polygon */}
        <polygon
          points={requiredPoints}
          fill="url(#requiredAreaGrad)"
          stroke="#64748b"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="transition-all duration-500 ease-out"
        />

        {/* Current Score Polygon */}
        <polygon
          points={currentPoints}
          fill="url(#currentAreaGrad)"
          stroke="#2563eb"
          strokeWidth="2.5"
          className="transition-all duration-500 ease-out"
        />

        {/* Data Points */}
        {radarItems.map((item, i) => {
          const currentCoords = getCoordinates(item.currentScore / 100, i);
          const requiredCoords = getCoordinates(item.requiredScore / 100, i);
          const isHovered = hoveredIndex === i;

          return (
            <g key={`points-${item.id}`}>
              {/* Required marker */}
              <circle
                cx={requiredCoords.x}
                cy={requiredCoords.y}
                r={3}
                fill="#64748b"
                className="opacity-70"
              />
              {/* Current marker */}
              <circle
                cx={currentCoords.x}
                cy={currentCoords.y}
                r={isHovered ? 6 : 4.5}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
                className="cursor-pointer transition-all duration-200 shadow-xs"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectCompetency && onSelectCompetency(item)}
              />
            </g>
          );
        })}

        {/* Vertex Labels */}
        {radarItems.map((item, i) => {
          const labelCoords = getCoordinates(1.22, i);
          const isHovered = hoveredIndex === i;
          const shortName =
            item.name.length > 24 ? item.name.substring(0, 22) + '…' : item.name;

          return (
            <g
              key={`label-${item.id}`}
              className="cursor-pointer font-sans"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectCompetency && onSelectCompetency(item)}
            >
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-xs font-semibold transition-colors duration-200 ${
                  isHovered
                    ? 'fill-blue-700'
                    : 'fill-slate-800'
                }`}
              >
                {shortName}
              </text>
              <text
                x={labelCoords.x}
                y={labelCoords.y + 14}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-medium fill-slate-500"
              >
                {item.currentScore}% (Req: {item.requiredScore}%)
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-3 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block shadow-xs" />
          <span className="font-semibold text-slate-800">Current Officer Competency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm border border-dashed border-slate-400 bg-slate-200/50 inline-block" />
          <span className="text-slate-600">MoSPI Benchmark Target</span>
        </div>
      </div>
    </div>
  );
};

