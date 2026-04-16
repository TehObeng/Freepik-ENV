import React, { useState, useEffect, useMemo } from 'react';
import { ApiKey, Endpoint, EndpointCategory, RequestHistoryItem } from './types';
import { SEED_API_KEYS, SEED_ENDPOINTS } from './data/seed';
import { KeyFormModal } from './components/KeyFormModal';
import { EndpointRow } from './components/EndpointRow';
import { DashboardStats } from './components/DashboardStats';
import { RequestPreview } from './components/RequestPreview';
import { CompactKeyCard } from './components/CompactKeyCard';
import { ModelPlayground } from './components/ModelPlayground';
import { Plus, Info, AlertTriangle, ShieldCheck, Database, Server, Compass, CheckCircle2, History } from 'lucide-react';
import { getEndpointInputMode, getEndpointCapabilities, getEndpointOutputType, getEndpointFamily } from './config/endpointCapabilities';
import { getEndpointConfig } from './config/endpointConfigs';
import { 
  PlaygroundFormState, 
  getDefaultFormState,
  buildPayloadFromForm
} from './config/payloadBuilders';
import { buildMockResponse, MockResponse } from './config/mockResponseFactory';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export default function App() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [endpoints] = useState<Endpoint[]>(() => {
    return SEED_ENDPOINTS.map(ep => {
      const inputMode = ep.inputMode || getEndpointInputMode(ep);
      const family = ep.family || getEndpointFamily(ep);
      return {
        ...ep,
        inputMode,
        outputType: ep.outputType || getEndpointOutputType(ep),
        family,
        capabilities: ep.capabilities || getEndpointCapabilities(ep),
        config: ep.config || getEndpointConfig(ep, inputMode, family)
      };
    });
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EndpointCategory>('all');
  const [historyFilter, setHistoryFilter] = useState('');
  
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<MockResponse | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'System initialized.' }
  ]);
  const [requestHistory, setRequestHistory] = useState<RequestHistoryItem[]>([]);
  
  const [formState, setFormState] = useState<PlaygroundFormState>({});
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');

  // Load from localStorage or seed
  useEffect(() => {
    const storedKeys = localStorage.getItem('freepik_api_keys');
    if (storedKeys) {
      setKeys(JSON.parse(storedKeys));
    } else {
      setKeys(SEED_API_KEYS);
      localStorage.setItem('freepik_api_keys', JSON.stringify(SEED_API_KEYS));
    }
    
    const storedHistory = localStorage.getItem('freepik_request_history');
    if (storedHistory) {
      setRequestHistory(JSON.parse(storedHistory));
    }

    // Auto-select first endpoint
    if (SEED_ENDPOINTS.length > 0) {
      handleSelectEndpoint(SEED_ENDPOINTS[0].id);
    }
  }, []);

  // Save to localStorage when keys change
  useEffect(() => {
    if (keys.length > 0) {
      localStorage.setItem('freepik_api_keys', JSON.stringify(keys));
    }
  }, [keys]);

  useEffect(() => {
    localStorage.setItem('freepik_request_history', JSON.stringify(requestHistory));
  }, [requestHistory]);

  const selectedKey = useMemo(() => keys.find(k => k.selected) || null, [keys]);
  const selectedEndpoint = useMemo(() => {
    return endpoints.find(e => e.id === selectedEndpointId) || null;
  }, [endpoints, selectedEndpointId]);
  
  const currentPayload = useMemo(() => {
    if (!selectedEndpoint) return {};
    return buildPayloadFromForm(selectedEndpoint, formState);
  }, [selectedEndpoint, formState]);

  const handleSaveKey = (keyData: Partial<ApiKey>) => {
    if (editingKey) {
      setKeys(keys.map(k => k.id === editingKey.id ? { ...k, ...keyData } as ApiKey : k));
    } else {
      const newKey: ApiKey = {
        id: `key-${Date.now()}`,
        name: keyData.name || 'New Key',
        apiKey: keyData.apiKey || '',
        status: 'active',
        used: 0,
        limit: keyData.limit || 1000,
        lastUsed: new Date().toISOString(),
        notes: keyData.notes || '',
        selected: keys.length === 0, // auto-select if it's the first key
      };
      setKeys([...keys, newKey]);
    }
  };

  const handleDeleteKey = (id: string) => {
    setKeys(keys.filter(k => k.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setKeys(keys.map(k => {
      if (k.id === id) {
        const newStatus = k.status === 'disabled' 
          ? (k.used >= k.limit ? 'exhausted' : k.used >= k.limit * 0.9 ? 'near_limit' : 'active')
          : 'disabled';
        return { ...k, status: newStatus, selected: newStatus === 'disabled' ? false : k.selected };
      }
      return k;
    }));
  };

  const addLog = (level: LogEntry['level'], message: string) => {
    setLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
  };

  const handleSelectKey = (id: string) => {
    const key = keys.find(k => k.id === id);
    if (!key || key.status === 'disabled') return;
    
    setKeys(keys.map(k => ({
      ...k,
      selected: k.id === id
    })));
    addLog('info', `Switched active API key to ${key.name}`);
    if (key.status === 'exhausted') {
      addLog('warning', `Selected key ${key.name} is exhausted. Requests will fail.`);
    }
  };

  const handleSelectEndpoint = (id: string) => {
    setSelectedEndpointId(id);
    setGeneratedResult(null); // Clear previous result when switching models
    const endpoint = endpoints.find(e => e.id === id);
    if (endpoint) {
      addLog('info', `Selected model endpoint: ${endpoint.name}`);
      // Reset form state based on capabilities
      setFormState(getDefaultFormState(endpoint));
    }
  };

  const handleGenerate = async () => {
    if (!selectedKey) {
      addLog('error', 'Generation failed: No active API key selected.');
      return;
    }
    if (selectedKey.status !== 'active' && selectedKey.status !== 'near_limit') {
      addLog('error', `Generation failed: Selected API key is ${selectedKey.status}.`);
      return;
    }
    if (!selectedEndpoint) {
      addLog('error', 'Generation failed: No model endpoint selected.');
      return;
    }

    // Validate required fields
    const requiredFields = selectedEndpoint.config?.fields.filter(f => f.required) || [];
    const missingFields = requiredFields.filter(f => {
      if (f.type === 'file_placeholder') return false; // Skip file placeholders for mock validation
      const val = formState[f.key];
      return val === undefined || val === '' || val === null;
    });
    
    if (missingFields.length > 0) {
      addLog('error', `Generation failed: Missing required fields (${missingFields.map(f => f.label).join(', ')})`);
      return;
    }

    setIsGenerating(true);
    addLog('info', `Starting generation using ${selectedEndpoint.name}...`);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      addLog('success', `Generation completed successfully! (-1 credit from ${selectedKey.name})`);
      
      // Generate mock result based on category
      const type = selectedEndpoint.outputType || 'json';
      let url = '';
      const randomSeed = Math.floor(Math.random() * 10000);
      const taskId = `mock_task_${Math.random().toString(36).substring(7)}`;
      
      const mockResponse = buildMockResponse(selectedEndpoint, selectedKey.name, currentPayload, taskId);
      setGeneratedResult(mockResponse);
      
      // Add to history
      const newHistoryItem: RequestHistoryItem = {
        id: taskId,
        timestamp: new Date().toLocaleTimeString(),
        endpointId: selectedEndpoint.id,
        endpointName: selectedEndpoint.name,
        path: selectedEndpoint.path,
        category: selectedEndpoint.category,
        inputMode: selectedEndpoint.inputMode,
        outputType: selectedEndpoint.outputType,
        family: selectedEndpoint.family,
        keyName: selectedKey.name,
        payload: currentPayload,
        formState: formState,
        status: 'COMPLETED',
        mockOutputUrl: mockResponse.mock_output_url,
        mockResult: mockResponse.mock_result
      };
      setRequestHistory(prev => [newHistoryItem, ...prev].slice(0, 50)); // keep last 50
      
      // Mock decrementing the key usage
      setKeys(keys.map(k => {
        if (k.id === selectedKey.id) {
          const newUsed = k.used + 1;
          const newStatus = newUsed >= k.limit ? 'exhausted' : newUsed >= k.limit * 0.9 ? 'near_limit' : k.status;
          return { ...k, used: newUsed, status: newStatus };
        }
        return k;
      }));
    }, 2500);
  };

  const filteredEndpoints = useMemo(() => {
    return endpoints.filter(e => {
      const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            e.path.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [endpoints, searchQuery, categoryFilter]);

  const stats = {
    totalKeys: keys.length,
    activeKeys: keys.filter(k => k.status === 'active' || k.status === 'near_limit').length,
    exhaustedKeys: keys.filter(k => k.status === 'exhausted').length,
    totalEndpoints: endpoints.length,
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8fafc] text-[#0f172a] font-sans">
      <header className="h-14 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-4">
          <div className="font-bold text-[1.1rem] text-blue-600 flex items-center gap-2">
            <span>⚡</span>
            Freepik API Playground
          </div>
          <div className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[0.65rem] font-bold uppercase tracking-wide rounded-md border border-purple-200">
            Mock Mode
          </div>
          <div className="text-xs text-slate-500 hidden md:block">
            Curated Freepik endpoint catalog with local API key management and simulated requests.
          </div>
        </div>
        <DashboardStats {...stats} />
      </header>

      {/* Environment Banner */}
      <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 flex items-center gap-3 shrink-0">
        <Info size={16} className="text-blue-500 shrink-0" />
        <div className="text-xs text-blue-800">
          <strong>Environment Status:</strong> Requests are simulated. API usage numbers are local demo values. Endpoint coverage is curated, not full automatic API discovery. Real Freepik execution is not connected yet.
        </div>
      </div>

      {/* API Key Top Bar */}
      <div className="h-16 bg-white border-b border-[#e2e8f0] flex items-center px-4 shrink-0 overflow-x-auto custom-scrollbar gap-3">
        <div className="flex flex-col mr-2 shrink-0">
          <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-700">API Keys</div>
          <div className="text-[0.6rem] text-slate-400">Local demo values</div>
        </div>
        {keys.map(key => (
          <CompactKeyCard
            key={key.id}
            apiKey={key}
            onSelect={handleSelectKey}
            onEdit={(k) => { setEditingKey(k); setIsModalOpen(true); }}
            onDelete={handleDeleteKey}
            onToggleStatus={handleToggleStatus}
          />
        ))}
        <button
          onClick={() => { setEditingKey(null); setIsModalOpen(true); }}
          className="shrink-0 flex items-center gap-1 text-[0.75rem] font-medium px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <Plus size={14} /> Add Key
        </button>
      </div>

      <main className="flex-1 overflow-hidden flex">
        {/* Left: Endpoints */}
        <section className="w-[300px] flex flex-col border-r border-[#e2e8f0] bg-white shrink-0">
          <div className="p-4 border-b border-[#e2e8f0] flex justify-between items-center shrink-0">
            <span className="text-[0.875rem] font-semibold uppercase tracking-[0.025em] text-[#64748b]">Model Selection</span>
          </div>
          <div className="p-3 border-b border-[#e2e8f0]">
            <input
              type="text"
              placeholder="Search endpoints..."
              className="w-full px-3 py-2 border border-[#e2e8f0] rounded-md text-[0.875rem] outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 px-3 py-2 border-b border-[#e2e8f0] overflow-x-auto shrink-0 custom-scrollbar">
            {(['all', 'image', 'video', 'audio', 'utility'] as EndpointCategory[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 text-[0.75rem] font-medium rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                  categoryFilter === cat
                    ? 'bg-[#0f172a] text-white'
                    : 'bg-[#f1f5f9] text-[#64748b] hover:bg-slate-200'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredEndpoints.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No endpoints match your search.</div>
            ) : (
              filteredEndpoints.map(endpoint => (
                <EndpointRow
                  key={endpoint.id}
                  endpoint={endpoint}
                  isSelected={selectedEndpointId === endpoint.id}
                  onSelect={handleSelectEndpoint}
                />
              ))
            )}
          </div>
        </section>

        {/* Middle: Playground */}
        <section className="flex-1 flex flex-col bg-[#f8fafc] overflow-y-auto custom-scrollbar p-6">
          <ModelPlayground 
            selectedEndpoint={selectedEndpoint} 
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            generatedResult={generatedResult}
            formState={formState}
            setFormState={setFormState}
            isAdvancedMode={isAdvancedMode}
            setIsAdvancedMode={setIsAdvancedMode}
            selectedPresetId={selectedPresetId}
            setSelectedPresetId={setSelectedPresetId}
            onReset={() => {
              if (selectedEndpoint) {
                setFormState(getDefaultFormState(selectedEndpoint));
              }
              setGeneratedResult(null);
              setSelectedPresetId('');
            }}
          />
        </section>

        {/* Right: Log & Info */}
        <section className="w-[360px] flex flex-col border-l border-[#e2e8f0] bg-white shrink-0">
          <div className="p-4 border-b border-[#e2e8f0] flex justify-between items-center shrink-0">
            <span className="text-[0.875rem] font-semibold uppercase tracking-[0.025em] text-[#64748b]">System Log & Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-4">
            <RequestPreview
              selectedKey={selectedKey}
              selectedEndpoint={selectedEndpoint}
              logs={logs}
              payload={currentPayload}
            />
            
            {/* Request History */}
            {requestHistory.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <History size={14} /> Request History
                  </h3>
                  <button 
                    onClick={() => setRequestHistory([])}
                    className="text-[0.65rem] text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </button>
                </div>
                <input 
                  type="text" 
                  placeholder="Filter history..." 
                  value={historyFilter}
                  onChange={(e) => setHistoryFilter(e.target.value)}
                  className="w-full text-xs p-1.5 mb-2 border border-slate-200 rounded outline-none focus:border-blue-400"
                />
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {requestHistory
                    .filter(item => 
                      item.endpointName.toLowerCase().includes(historyFilter.toLowerCase()) || 
                      (item.payload.prompt && item.payload.prompt.toLowerCase().includes(historyFilter.toLowerCase())) ||
                      (item.payload.text && item.payload.text.toLowerCase().includes(historyFilter.toLowerCase()))
                    )
                    .map(item => {
                      const payloadSummary = item.payload.prompt || item.payload.text || item.payload.additional_prompt || JSON.stringify(item.payload);
                      const shortSummary = payloadSummary.length > 40 ? payloadSummary.substring(0, 40) + '...' : payloadSummary;
                      
                      return (
                        <div 
                          key={item.id} 
                          className="bg-white border border-slate-200 rounded p-2 cursor-pointer hover:border-blue-300 transition-colors"
                          onClick={() => {
                            setSelectedEndpointId(item.endpointId);
                            setFormState(item.formState);
                            setIsAdvancedMode(item.isAdvancedMode || false);
                            setSelectedPresetId(item.presetId || '');
                            setGeneratedResult({
                              request_id: item.id,
                              endpoint_name: item.endpointName,
                              endpoint_path: item.path || '',
                              input_mode: item.inputMode,
                              output_type: item.outputType,
                              selected_key_name: item.keyName,
                              status: item.status,
                              submitted_at: item.timestamp,
                              payload_snapshot: item.payload,
                              mock_output_url: item.mockOutputUrl,
                              mock_result: item.mockResult,
                              credits_used: 1
                            });
                            addLog('info', `Restored request settings for ${item.endpointName}`);
                          }}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-slate-800 truncate pr-2">{item.endpointName}</span>
                            <span className="text-[0.6rem] text-slate-400 shrink-0">{item.timestamp}</span>
                          </div>
                          <div className="text-[0.65rem] text-slate-500 truncate mb-1" title={payloadSummary}>
                            {shortSummary}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[0.6rem] font-medium text-slate-400">{item.keyName}</span>
                            <span className="text-[0.6rem] font-bold text-green-600">COMPLETED</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
            
            {/* Coverage Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <h3 className="text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Database size={14} /> Endpoint Coverage
              </h3>
              <p className="text-[0.7rem] text-slate-600 mb-3 leading-relaxed">
                This app currently includes a manually maintained list of publicly documented Freepik endpoints. It does not yet auto-sync from Freepik docs or API schema. Some endpoints may be missing.
              </p>
              <div className="grid grid-cols-2 gap-2 text-[0.65rem] font-medium text-slate-500">
                <div className="bg-white px-2 py-1.5 rounded border border-slate-200 flex justify-between">
                  <span>Total</span><span className="text-slate-900">{endpoints.length}</span>
                </div>
                <div className="bg-white px-2 py-1.5 rounded border border-slate-200 flex justify-between">
                  <span>Image</span><span className="text-slate-900">{endpoints.filter(e => e.category === 'image').length}</span>
                </div>
                <div className="bg-white px-2 py-1.5 rounded border border-slate-200 flex justify-between">
                  <span>Video</span><span className="text-slate-900">{endpoints.filter(e => e.category === 'video').length}</span>
                </div>
                <div className="bg-white px-2 py-1.5 rounded border border-slate-200 flex justify-between">
                  <span>Audio</span><span className="text-slate-900">{endpoints.filter(e => e.category === 'audio').length}</span>
                </div>
              </div>
            </div>

            {/* Scope & Phases */}
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-green-600" /> Current Scope
                </h3>
                <ul className="text-[0.7rem] text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Local API key storage</li>
                  <li>Curated endpoint browsing</li>
                  <li>Endpoint search/filter</li>
                  <li>Request preview</li>
                  <li>Simulated request flow</li>
                </ul>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Compass size={14} className="text-blue-600" /> Next Phases
                </h3>
                <ul className="text-[0.7rem] text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Backend proxy for real requests</li>
                  <li>Real Freepik API execution</li>
                  <li>Real quota / key health sync</li>
                  <li>Endpoint catalog sync from docs/schema</li>
                  <li>Per-endpoint payload forms</li>
                </ul>
              </div>
            </div>

          </div>
        </section>
      </main>

      <KeyFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveKey}
        initialData={editingKey}
      />
    </div>
  );
}
