import React from 'react';
import { ApiKey } from '../types';
import { StatusBadge } from './StatusBadge';
import { UsageBar } from './UsageBar';
import { Edit2, Trash2, Power } from 'lucide-react';

interface ApiKeyCardProps {
  apiKey: ApiKey;
  onEdit: (key: ApiKey) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onSelect: (id: string) => void;
}

export const ApiKeyCard: React.FC<ApiKeyCardProps> = ({
  apiKey,
  onEdit,
  onDelete,
  onToggleStatus,
  onSelect,
}) => {
  const maskedKey = `${apiKey.apiKey.substring(0, 8)}...${apiKey.apiKey.substring(apiKey.apiKey.length - 4)}`;
  const isSelectable = apiKey.status !== 'disabled';

  return (
    <div 
      onClick={() => isSelectable && onSelect(apiKey.id)}
      className={`border rounded-lg p-3 mb-3 cursor-pointer transition-all relative ${
        apiKey.selected 
          ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' 
          : 'border-slate-200 bg-white hover:border-blue-600'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="font-semibold text-[0.9rem] text-slate-900 mb-1">
          {apiKey.name}
        </div>
        <StatusBadge status={apiKey.status} />
      </div>
      
      <div className="font-mono text-[0.75rem] text-slate-500 mb-1">
        {maskedKey}
      </div>

      <UsageBar used={apiKey.used} limit={apiKey.limit} />

      {/* Actions row */}
      <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-slate-100/50">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleStatus(apiKey.id); }}
          className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
          title={apiKey.status === 'disabled' ? 'Enable Key' : 'Disable Key'}
        >
          <Power size={14} className={apiKey.status === 'disabled' ? 'text-red-500' : ''} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(apiKey); }}
          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
          title="Edit Key"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(apiKey.id); }}
          className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
          title="Delete Key"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
