import React from 'react';

interface UsageBarProps {
  used: number;
  limit: number;
}

export const UsageBar: React.FC<UsageBarProps> = ({ used, limit }) => {
  const percentage = Math.min(100, Math.max(0, (used / limit) * 100));
  
  let colorClass = 'bg-[#10b981]';
  if (percentage >= 100) {
    colorClass = 'bg-[#ef4444]';
  } else if (percentage >= 90) {
    colorClass = 'bg-[#f59e0b]';
  } else if (used === 0 && limit === 0) {
    colorClass = 'bg-[#94a3b8]'; // disabled
  }

  return (
    <div className="mt-2.5">
      <div className="h-[6px] bg-[#e2e8f0] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[0.7rem] text-slate-500 mt-1">
        <span>{used.toLocaleString()} / {limit.toLocaleString()} requests</span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};
