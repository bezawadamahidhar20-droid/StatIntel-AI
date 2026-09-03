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
  const radius = size * 0.38;
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
            <stop offset="0%" stopColor="#D8FE41" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#D8FE41" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="requiredAreaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.02" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#D8FE41" floodOpacity="0.4" />
          </filter>
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
              stroke="#262626"
              strokeDasharray={lvl === 1.0 ? 'none' : '2 2'}
              strokeWidth={lvl === 1.0 ? 1.5 : 0.8}
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
              stroke="#222222"
              strokeWidth="1"
            />
          );
        })}

        {/* Target/Required Polygon */}
        <polygon
          points={requiredPoints}
          fill="url(#requiredAreaGrad)"
          stroke="#888888"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="transition-all duration-500 ease-out"
        />

        {/* Current Score Polygon */}
        <polygon
          points={currentPoints}
          fill="url(#currentAreaGrad)"
          stroke="#D8FE41"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
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
                fill="#ffffff"
                className="opacity-60"
              />
              {/* Current marker */}
              <circle
                cx={currentCoords.x}
                cy={currentCoords.y}
                r={isHovered ? 6 : 4}
                fill="#D8FE41"
                stroke="#000000"
                strokeWidth={2}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectCompetency && onSelectCompetency(item)}
              />
            </g>
          );
        })}

        {/* Vertex Labels */}
        {radarItems.map((item, i) => {
          const labelCoords = getCoordinates(1.18, i);
          const isHovered = hoveredIndex === i;
          // Shorten label if needed
          const shortName =
            item.name.length > 24 ? item.name.substring(0, 22) + '…' : item.name;

          return (
            <g
              key={`label-${item.id}`}
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => onSelectCompetency && onSelectCompetency(item)}
            >
              <text
                x={labelCoords.x}
                y={labelCoords.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className={`text-[10px] font-mono font-bold tracking-wider uppercase transition-colors duration-200 ${
                  isHovered
                    ? 'fill-[#D8FE41]'
                    : 'fill-[#cccccc]'
                }`}
              >
                {shortName}
              </text>
              <text
                x={labelCoords.x}
                y={labelCoords.y + 13}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[9px] font-mono fill-[#777777]"
              >
                {item.currentScore}% / REQ {item.requiredScore}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-2 text-[11px] font-mono text-[#888888]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-[#D8FE41] inline-block shadow-[0_0_6px_rgba(216,254,65,0.6)]" />
          <span className="font-bold text-white uppercase">Current Competency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 border border-dashed border-white/60 bg-white/10 inline-block" />
          <span className="font-bold text-[#aaaaaa] uppercase">Role Benchmark</span>
        </div>
      </div>
    </div>
  );
};
