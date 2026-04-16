import React, { useState, useEffect, useRef } from 'react';
import { ApiKey, Endpoint } from '../types';
import { LogEntry } from '../App';

interface RequestPreviewProps {
  selectedKey: ApiKey | null;
  selectedEndpoint: Endpoint | null;
  logs: LogEntry[];
  payload: any;
}

export const RequestPreview: React.FC<RequestPreviewProps> = ({ selectedKey, selectedEndpoint, logs, payload }) => {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!selectedKey || !selectedEndpoint) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white">
        <p className="text-sm">Select an API Key and an Endpoint to preview the request.</p>
      </div>
    );
  }

  const isKeyUsable = selectedKey.status === 'active' || selectedKey.status === 'near_limit';
  const fullUrl = `https://api.freepik.com${selectedEndpoint.path}`;
  
  const payloadString = JSON.stringify(payload, null, 2);

  const curlCommand = `curl -X POST "${fullUrl}" \\\n  -H "x-freepik-api-key: <YOUR_API_KEY>" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(payload)}'`;

  const handleCopy = (text: string, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const getCategoryColor = () => {
    switch (selectedEndpoint.category) {
      case 'image': return 'bg-[#e0f2fe] text-[#0369a1]';
      case 'video': return 'bg-[#f3e8ff] text-[#7e22ce]';
      case 'audio': return 'bg-[#dcfce7] text-[#15803d]';
      case 'utility': return 'bg-[#ffedd5] text-[#c2410c]';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#f8fafc] border border-blue-200 text-blue-800 p-3 rounded-md text-[0.75rem] mb-4">
        <strong className="block mb-1 text-blue-900">Simulated Request Preview</strong>
        This panel previews how a request may look, but does not send real Freepik API requests yet. Payload preview is generated from the current visible fields.
      </div>

      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Target Endpoint</div>
        <div className="text-[0.875rem] font-semibold text-slate-900 mb-1">{selectedEndpoint.name}</div>
        <div className="text-[0.7rem] font-mono text-slate-500 mb-1">{selectedEndpoint.path}</div>
        <div className="text-[0.7rem] text-slate-500 mb-3">{selectedEndpoint.note}</div>
        
        <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Authorized Key</div>
        <div className="text-[0.875rem] font-semibold text-slate-900 mb-3 flex items-center gap-2">
          {selectedKey.name}
          {selectedKey.status === 'active' && <span className="text-[0.65rem] text-[#10b981]">● Active</span>}
          {selectedKey.status === 'near_limit' && <span className="text-[0.65rem] text-[#f59e0b]">● Near Limit</span>}
          {selectedKey.status === 'exhausted' && <span className="text-[0.65rem] text-[#ef4444]">● Exhausted</span>}
          {selectedKey.status === 'disabled' && <span className="text-[0.65rem] text-[#94a3b8]">● Disabled</span>}
        </div>
        
        <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Category & Status</div>
        <div className="text-[0.875rem] font-semibold text-slate-900 flex items-center gap-2 mb-3 flex-wrap">
          <span className={`px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide ${getCategoryColor()}`}>
            {selectedEndpoint.category}
          </span>
          {selectedEndpoint.inputMode && (
            <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide bg-slate-200 text-slate-700 border border-slate-300">
              {selectedEndpoint.inputMode.replace('_', ' ')}
            </span>
          )}
          {selectedEndpoint.family && selectedEndpoint.family !== 'unknown' && (
            <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide bg-orange-100 text-orange-700 border border-orange-200">
              {selectedEndpoint.family}
            </span>
          )}
          {selectedEndpoint.outputType && (
            <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide bg-teal-100 text-teal-700 border border-teal-200">
              Out: {selectedEndpoint.outputType}
            </span>
          )}
          {selectedEndpoint.implementationStatus === 'ui_ready' && (
            <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200">
              UI Ready
            </span>
          )}
          {selectedEndpoint.implementationStatus === 'mock_only' && (
            <span className="px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide bg-purple-100 text-purple-700 border border-purple-200">
              Mock Only
            </span>
          )}
        </div>

        {selectedEndpoint.capabilities && (
          <>
            <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Capabilities</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(selectedEndpoint.capabilities).map(([key, value]) => {
                if (!value) return null;
                const label = key.replace('supports', '').replace(/([A-Z])/g, ' $1').trim();
                return (
                  <span key={key} className="px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded text-[0.6rem] font-medium">
                    {label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>

      {!isKeyUsable && (
        <div className="bg-[#fff7ed] border border-[#fdba74] text-[#9a3412] p-3 rounded-md text-[0.75rem] mb-4">
          <strong>Warning:</strong> Selected key is {selectedKey.status}. You cannot make requests with this key.
        </div>
      )}

      <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Payload JSON</div>
      <pre className="bg-[#1e293b] text-[#e2e8f0] p-4 rounded-lg font-mono text-[0.75rem] mb-4 overflow-y-auto whitespace-pre-wrap custom-scrollbar max-h-48">
        {payloadString}
      </pre>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleCopy(curlCommand, setCopiedCurl)}
          className="w-full p-2 rounded-md font-semibold text-xs bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition-colors"
        >
          {copiedCurl ? 'Copied!' : 'Copy Curl Template'}
        </button>
        <button
          onClick={() => handleCopy(fullUrl, setCopiedEndpoint)}
          className="w-full p-2 rounded-md font-semibold text-xs bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 transition-colors"
        >
          {copiedEndpoint ? 'Copied!' : 'Copy Endpoint'}
        </button>
      </div>

      <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">System Logs</div>
      <div className="bg-[#0f172a] p-3 rounded-lg font-mono text-[0.7rem] flex-1 overflow-y-auto custom-scrollbar space-y-1.5">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 leading-tight">
            <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
            <span className={`
              ${log.level === 'info' ? 'text-blue-400' : ''}
              ${log.level === 'success' ? 'text-green-400' : ''}
              ${log.level === 'error' ? 'text-red-400' : ''}
              ${log.level === 'warning' ? 'text-yellow-400' : ''}
            `}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

    </div>
  );
};
