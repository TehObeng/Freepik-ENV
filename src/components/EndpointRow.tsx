import React from 'react';
import { Endpoint } from '../types';

interface EndpointRowProps {
  endpoint: Endpoint;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const EndpointRow: React.FC<EndpointRowProps> = ({ endpoint, isSelected, onSelect }) => {
  const getCategoryColor = () => {
    switch (endpoint.category) {
      case 'image': return 'bg-[#e0f2fe] text-[#0369a1]';
      case 'video': return 'bg-[#f3e8ff] text-[#7e22ce]';
      case 'audio': return 'bg-[#dcfce7] text-[#15803d]';
      case 'utility': return 'bg-[#ffedd5] text-[#c2410c]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div
      onClick={() => onSelect(endpoint.id)}
      className={`px-3 py-2.5 border-b border-slate-200 cursor-pointer transition-colors ${
        isSelected 
          ? 'bg-slate-100 border-l-[3px] border-l-blue-600' 
          : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
      }`}
    >
      <div className="font-semibold text-[0.875rem] text-slate-900">
        {endpoint.name}
      </div>
      <div className="text-[0.7rem] text-slate-500 font-mono mt-0.5">
        {endpoint.path}
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className="text-[0.6rem] font-extrabold text-[#22c55e]">
          {endpoint.method}
        </span>
        <span className={`px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide ${getCategoryColor()}`}>
          {endpoint.category}
        </span>
      </div>
    </div>
  );
};
