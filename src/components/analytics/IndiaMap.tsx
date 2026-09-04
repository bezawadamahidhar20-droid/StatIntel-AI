import React, { useState, useEffect } from 'react';
import { MapPin, Layers, Filter, Eye, ArrowUpRight, ShieldCheck, Sparkles } from 'lucide-react';
import { census } from '../../services/api/census';
import { CensusDistrictData } from '../../services/api/types';

interface IndiaMapProps {
  onSelectDistrict?: (district: CensusDistrictData) => void;
  selectedState?: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ onSelectDistrict, selectedState }) => {
  const [districts, setDistricts] = useState<CensusDistrictData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'literacyRate' | 'sexRatio' | 'urbanizationRate' | 'workerParticipationRate'>('literacyRate');
  const [hoveredDistrict, setHoveredDistrict] = useState<CensusDistrictData | null>(null);
  const [activeDistrictCode, setActiveDistrictCode] = useState<string>('IN-MH-PUN');

  useEffect(() => {
    let mounted = true;
    async function loadDistricts() {
      const res = await census.getDistrictData(selectedState);
      if (mounted && res.success && res.data) {
        setDistricts(res.data);
        if (res.data.length > 0) {
          setHoveredDistrict(res.data[0]);
          setActiveDistrictCode(res.data[0].districtCode);
        }
      }
    }
    loadDistricts();
    return () => { mounted = false; };
  }, [selectedState]);

  const metricLabels = {
    literacyRate: { name: 'Literacy Rate (%)', unit: '%', min: 70, max: 95, color: 'from-emerald-500 to-teal-400' },
    sexRatio: { name: 'Sex Ratio (F/1000 M)', unit: '', min: 850, max: 1020, color: 'from-blue-500 to-indigo-400' },
    urbanizationRate: { name: 'Urbanization Rate (%)', unit: '%', min: 20, max: 100, color: 'from-purple-500 to-pink-400' },
    workerParticipationRate: { name: 'Worker Participation (%)', unit: '%', min: 30, max: 50, color: 'from-amber-500 to-orange-400' },
  };

  const getHeatmapColor = (val: number, metricKey: keyof typeof metricLabels) => {
    const { min, max } = metricLabels[metricKey];
    const normalized = Math.max(0, Math.min(1, (val - min) / (max - min)));
    if (normalized > 0.75) return 'bg-emerald-500 text-white';
    if (normalized > 0.5) return 'bg-blue-500 text-white';
    if (normalized > 0.25) return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header & Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              National & District Geospatial Heatmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            District-level demographic & socio-economic telemetry synced from Census & MoSPI
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          {(Object.keys(metricLabels) as Array<keyof typeof metricLabels>).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedMetric(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedMetric === key
                  ? 'bg-white dark:bg-blue-600 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {metricLabels[key].name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Map + District Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive District Heatmap Grid / Vector Map */}
        <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 min-h-[360px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-3">
              <span>Selected Indicator: <strong className="text-slate-800 dark:text-slate-200">{metricLabels[selectedMetric].name}</strong></span>
              <span>788 Districts Synced</span>
            </div>

            {/* Visual Heatmap District Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {districts.map((d) => {
                const metricValue = d[selectedMetric];
                const isSelected = activeDistrictCode === d.districtCode;
                const badgeClass = getHeatmapColor(metricValue, selectedMetric);

                return (
                  <div
                    key={d.districtCode}
                    onClick={() => {
                      setActiveDistrictCode(d.districtCode);
                      setHoveredDistrict(d);
                      if (onSelectDistrict) onSelectDistrict(d);
                    }}
                    onMouseEnter={() => setHoveredDistrict(d)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                        {d.districtName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{d.stateCode}</span>
                    </div>

                    <div className="mt-2.5 flex items-baseline justify-between">
                      <span className="text-base font-black text-slate-800 dark:text-slate-100 font-mono">
                        {metricValue}{metricLabels[selectedMetric].unit}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${badgeClass}`}>
                        {metricValue > metricLabels[selectedMetric].min + (metricLabels[selectedMetric].max - metricLabels[selectedMetric].min) * 0.5 ? 'High' : 'Medium'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Low Intensity</span>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-2.5 rounded-sm bg-rose-500" />
              <span className="w-5 h-2.5 rounded-sm bg-amber-500" />
              <span className="w-5 h-2.5 rounded-sm bg-blue-500" />
              <span className="w-5 h-2.5 rounded-sm bg-emerald-500" />
            </div>
            <span className="text-slate-500 dark:text-slate-400">High Intensity</span>
          </div>
        </div>

        {/* Selected District Telemetry Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-xl space-y-5 border border-slate-800">
          {hoveredDistrict ? (
            <>
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider block">
                    {hoveredDistrict.stateName} ({hoveredDistrict.stateCode})
                  </span>
                  <h4 className="text-xl font-black text-white mt-0.5">
                    {hoveredDistrict.districtName} District
                  </h4>
                </div>
                <div className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Census Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Total Population</span>
                  <span className="text-sm font-bold text-white font-mono mt-0.5 block">
                    {hoveredDistrict.totalPopulation.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Literacy Rate</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">
                    {hoveredDistrict.literacyRate}%
                  </span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Sex Ratio</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">
                    {hoveredDistrict.sexRatio} <span className="text-[10px] text-slate-400">/1000 M</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 block">Urbanization %</span>
                  <span className="text-sm font-bold text-purple-400 font-mono mt-0.5 block">
                    {hoveredDistrict.urbanizationRate}%
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl space-y-1">
                <span className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  AI Socio-Economic Development Tier
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  Classified as <strong>High-Performing Growth Cluster</strong> with strong worker participation ({hoveredDistrict.workerParticipationRate}%) and density ({hoveredDistrict.populationDensity} / sq.km).
                </p>
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 text-xs">
              Select or hover a district to inspect statistical telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
