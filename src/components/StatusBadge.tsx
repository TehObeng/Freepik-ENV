import React from 'react';
import { KeyStatus } from '../types';

export const StatusBadge: React.FC<{ status: KeyStatus }> = ({ status }) => {
  const styles: Record<KeyStatus, string> = {
    active: 'bg-[#dcfce7] text-[#10b981]',
    near_limit: 'bg-[#fef3c7] text-[#f59e0b]',
    exhausted: 'bg-[#fee2e2] text-[#ef4444]',
    disabled: 'bg-[#f1f5f9] text-[#94a3b8]',
  };

  const labels: Record<KeyStatus, string> = {
    active: 'Active',
    near_limit: 'Near Limit',
    exhausted: 'Exhausted',
    disabled: 'Disabled',
  };

  return (
    <span className={`px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};
