import React from 'react';
import { ApiKey } from '../types';
import { StatusBadge } from './StatusBadge';
import { Edit2, Trash2, Power } from 'lucide-react';

export const CompactKeyCard: React.FC<{
  apiKey: ApiKey;
  onSelect: (id: string) => void;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}> = ({ apiKey, onSelect, onEdit, onDelete, onToggleStatus }) => {
  const isSelectable = apiKey.status !== 'disabled';
  
  return (
    <div
      onClick={() => isSelectable && onSelect(apiKey.id)}
      className={`group flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-all shrink-0 ${
        apiKey.selected
          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600'
          : 'border-slate-200 bg-white hover:border-blue-400'
      } ${!isSelectable ? 'opacity-60' : ''}`}
    >
      <div>
        <div className="font-semibold text-[0.8rem] text-slate-900 leading-tight">{apiKey.name}</div>
        <div className="text-[0.65rem] text-slate-500 mt-0.5">
          {apiKey.used} / {apiKey.limit} reqs
        </div>
      </div>
      <StatusBadge status={apiKey.status} />

      <div className="hidden group-hover:flex items-center gap-1 pl-2 border-l border-slate-200 ml-1">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStatus(apiKey.id); }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded"
          title={apiKey.status === 'disabled' ? 'Enable Key' : 'Disable Key'}
        >
          <Power size={12} className={apiKey.status === 'disabled' ? 'text-red-500' : ''} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(apiKey); }}
          className="p-1 text-slate-400 hover:text-blue-600 rounded"
          title="Edit Key"
        >
          <Edit2 size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(apiKey.id); }}
          className="p-1 text-slate-400 hover:text-red-600 rounded"
          title="Delete Key"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
};
