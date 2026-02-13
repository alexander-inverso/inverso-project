import React from 'react';
import { ImageFilters, DEFAULT_FILTERS } from '../types';
import { RotateCcw, Sun, Contrast, Droplets, EyeOff, Aperture } from 'lucide-react';

interface FilterPanelProps {
  filters: ImageFilters;
  setFilters: React.Dispatch<React.SetStateAction<ImageFilters>>;
  onResetFilters: () => void;
  isOpen: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  setFilters,
  onResetFilters,
  isOpen,
}) => {
  if (!isOpen) return null;

  const handleChange = (key: keyof ImageFilters, value: number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="absolute top-24 right-8 w-72 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl z-40 animate-in fade-in slide-in-from-right-10 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Adjustments</h3>
        <button 
          onClick={onResetFilters}
          className="p-1.5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors"
          title="Reset Filters"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      <div className="space-y-6">
        {/* Brightness */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span className="flex items-center gap-1.5"><Sun size={12}/> Brightness</span>
            <span>{filters.brightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.brightness}
            onChange={(e) => handleChange('brightness', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
          />
        </div>

        {/* Contrast */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span className="flex items-center gap-1.5"><Contrast size={12}/> Contrast</span>
            <span>{filters.contrast}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.contrast}
            onChange={(e) => handleChange('contrast', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
          />
        </div>

        {/* Saturation */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span className="flex items-center gap-1.5"><Droplets size={12}/> Saturation</span>
            <span>{filters.saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={filters.saturation}
            onChange={(e) => handleChange('saturation', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
          />
        </div>

        {/* Grayscale */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span className="flex items-center gap-1.5"><EyeOff size={12}/> Grayscale</span>
            <span>{filters.grayscale}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={filters.grayscale}
            onChange={(e) => handleChange('grayscale', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
          />
        </div>

         {/* Blur */}
         <div className="space-y-2">
          <div className="flex justify-between text-xs text-white/60">
            <span className="flex items-center gap-1.5"><Aperture size={12}/> Blur</span>
            <span>{filters.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={filters.blur}
            onChange={(e) => handleChange('blur', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
          />
        </div>
      </div>
    </div>
  );
};