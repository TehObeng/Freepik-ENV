import React, { useState, useEffect, useRef } from 'react';
import { ApiKey, Endpoint } from '../types';
import { LogEntry } from '../App';

interface RequestPreviewProps {
  selectedKey: ApiKey | null;
  selectedEndpoint: Endpoint | null;
  logs: LogEntry[];
}

export const RequestPreview: React.FC<RequestPreviewProps> = ({ selectedKey, selectedEndpoint, logs }) => {
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
  
  const samplePayload = selectedEndpoint.category === 'image' 
    ? `{\n  "prompt": "A professional 3D workspace with soft lighting, minimalist design, high resolution, 8k",\n  "negative_prompt": "blurry, low quality",\n  "guidance_scale": 7.5,\n  "aspect_ratio": "16:9",\n  "num_images": 1\n}`
    : selectedEndpoint.category === 'video'
    ? `{\n  "prompt": "A dog running in a green field",\n  "duration": 5\n}`
    : `{\n  "text": "Hello world"\n}`;

  const curlCommand = `curl -X POST "${fullUrl}" \\\n  -H "x-freepik-api-key: ${selectedKey.apiKey}" \\\n  -H "Content-Type: application/json" \\\n  -d '${samplePayload.replace(/\n/g, '')}'`;

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
        This panel previews how a request may look, but does not send real Freepik API requests yet.
      </div>

      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Target Endpoint</div>
        <div className="text-[0.875rem] font-semibold text-slate-900 mb-3">{selectedEndpoint.name}</div>
        
        <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Authorized Key</div>
        <div className="text-[0.875rem] font-semibold text-slate-900 mb-3 flex items-center gap-2">
          {selectedKey.name}
          {selectedKey.status === 'active' && <span className="text-[0.65rem] text-[#10b981]">● Active</span>}
          {selectedKey.status === 'near_limit' && <span className="text-[0.65rem] text-[#f59e0b]">● Near Limit</span>}
          {selectedKey.status === 'exhausted' && <span className="text-[0.65rem] text-[#ef4444]">● Exhausted</span>}
          {selectedKey.status === 'disabled' && <span className="text-[0.65rem] text-[#94a3b8]">● Disabled</span>}
        </div>
        
        <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Category</div>
        <div className="text-[0.875rem] font-semibold text-slate-900">
          <span className={`px-1.5 py-0.5 rounded text-[0.65rem] font-bold uppercase tracking-wide ${getCategoryColor()}`}>
            {selectedEndpoint.category}
          </span>
        </div>
      </div>

      {!isKeyUsable && (
        <div className="bg-[#fff7ed] border border-[#fdba74] text-[#9a3412] p-3 rounded-md text-[0.75rem] mb-4">
          <strong>Warning:</strong> Selected key is {selectedKey.status}. You cannot make requests with this key.
        </div>
      )}

      <div className="text-[0.7rem] uppercase text-slate-500 mb-0.5 tracking-wide">Payload JSON</div>
      <pre className="bg-[#1e293b] text-[#e2e8f0] p-4 rounded-lg font-mono text-[0.75rem] mb-4 overflow-y-auto whitespace-pre-wrap custom-scrollbar max-h-48">
        {samplePayload}
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
