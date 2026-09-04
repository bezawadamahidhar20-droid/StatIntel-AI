import React, { useState } from 'react';
import { ChevronRight, Home, MapPin, Building2, Layers } from 'lucide-react';

interface DrillDownProps {
  onLevelChange?: (level: 'national' | 'state' | 'district', selectedItem?: string) => void;
}

export const DrillDown: React.FC<DrillDownProps> = ({ onLevelChange }) => {
  const [level, setLevel] = useState<'national' | 'state' | 'district'>('national');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');

  const states = ['Maharashtra', 'Tamil Nadu', 'Gujarat', 'Karnataka', 'Uttar Pradesh'];
  const districtsMap: Record<string, string[]> = {
    Maharashtra: ['Pune', 'Mumbai Suburban', 'Nagpur', 'Thane', 'Nashik'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    Karnataka: ['Bengaluru Urban', 'Mysuru', 'Hubballi-Dharwad', 'Mangaluru', 'Belagavi'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur Nagar', 'Varanasi', 'Prayagraj', 'Agra'],
  };

  const handleSelectNational = () => {
    setLevel('national');
    setSelectedState('');
    setSelectedDistrict('');
    if (onLevelChange) onLevelChange('national');
  };

  const handleSelectState = (stateName: string) => {
    setLevel('state');
    setSelectedState(stateName);
    setSelectedDistrict('');
    if (onLevelChange) onLevelChange('state', stateName);
  };

  const handleSelectDistrict = (districtName: string) => {
    setLevel('district');
    setSelectedDistrict(districtName);
    if (onLevelChange) onLevelChange('district', districtName);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={handleSelectNational}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
            level === 'national'
              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>India (National)</span>
        </button>

        {selectedState && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <button
              onClick={() => handleSelectState(selectedState)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors ${
                level === 'state'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>{selectedState}</span>
            </button>
          </>
        )}

        {selectedDistrict && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold rounded-lg">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedDistrict} District</span>
            </span>
          </>
        )}
      </div>

      {/* Drill-Down Selector Grid */}
      <div>
        {level === 'national' && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Drill down by State / Union Territory:
            </span>
            <div className="flex flex-wrap gap-2">
              {states.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSelectState(s)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 'state' && selectedState && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Drill down into {selectedState} Districts:
            </span>
            <div className="flex flex-wrap gap-2">
              {districtsMap[selectedState]?.map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelectDistrict(d)}
                  className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all shadow-2xs"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {level === 'district' && (
          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 rounded-xl text-xs text-blue-900 dark:text-blue-300 flex items-center justify-between">
            <span>Viewing micro-level telemetry for <strong>{selectedDistrict}</strong> ({selectedState})</span>
            <button
              onClick={handleSelectNational}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Reset to National View
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrillDown;
