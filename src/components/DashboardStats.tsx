import React from 'react';

interface DashboardStatsProps {
  totalKeys: number;
  activeKeys: number;
  exhaustedKeys: number;
  totalEndpoints: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalKeys,
  activeKeys,
  exhaustedKeys,
  totalEndpoints,
}) => {
  return (
    <div className="flex gap-8">
      <div className="flex flex-col text-right">
        <span className="font-semibold text-[0.9rem] text-slate-900">{totalKeys}</span>
        <span className="text-[0.7rem] uppercase tracking-wider text-slate-500">Keys</span>
      </div>
      <div className="flex flex-col text-right">
        <span className="font-semibold text-[0.9rem] text-slate-900">{exhaustedKeys}</span>
        <span className="text-[0.7rem] uppercase tracking-wider text-slate-500">Exhausted</span>
      </div>
      <div className="flex flex-col text-right">
        <span className="font-semibold text-[0.9rem] text-slate-900">{totalEndpoints}</span>
        <span className="text-[0.7rem] uppercase tracking-wider text-slate-500">Endpoints</span>
      </div>
    </div>
  );
};
