import React, { useState, useEffect, useMemo } from 'react';
import { ApiKey, Endpoint, EndpointCategory } from './types';
import { SEED_API_KEYS, SEED_ENDPOINTS } from './data/seed';
import { KeyFormModal } from './components/KeyFormModal';
import { EndpointRow } from './components/EndpointRow';
import { DashboardStats } from './components/DashboardStats';
import { RequestPreview } from './components/RequestPreview';
import { CompactKeyCard } from './components/CompactKeyCard';
import { ModelPlayground } from './components/ModelPlayground';
import { Plus } from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
}

export default function App() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [endpoints] = useState<Endpoint[]>(SEED_ENDPOINTS);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EndpointCategory>('all');
  
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{ type: string, url: string } | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: new Date().toLocaleTimeString(), level: 'info', message: 'System initialized.' }
  ]);

  // Load from localStorage or seed
  useEffect(() => {
    const storedKeys = localStorage.getItem('freepik_api_keys');
    if (storedKeys) {
      setKeys(JSON.parse(storedKeys));
    } else {
      setKeys(SEED_API_KEYS);
      localStorage.setItem('freepik_api_keys', JSON.stringify(SEED_API_KEYS));
    }
    
    // Auto-select first endpoint
    if (SEED_ENDPOINTS.length > 0) {
      setSelectedEndpointId(SEED_ENDPOINTS[0].id);
    }
  }, []);

  // Save to localStorage when keys change
  useEffect(() => {
    if (keys.length > 0) {
      localStorage.setItem('freepik_api_keys', JSON.stringify(keys));
    }
  }, [keys]);

  const selectedKey = useMemo(() => keys.find(k => k.selected) || null, [keys]);
  const selectedEndpoint = useMemo(() => endpoints.find(e => e.id === selectedEndpointId) || null, [endpoints, selectedEndpointId]);

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
    setKeys(keys.map(k => ({
      ...k,
      selected: k.id === id
    })));
    const keyName = keys.find(k => k.id === id)?.name;
    addLog('info', `Switched active API key to ${keyName}`);
  };

  const handleSelectEndpoint = (id: string) => {
    setSelectedEndpointId(id);
    setGeneratedResult(null); // Clear previous result when switching models
    const endpointName = endpoints.find(e => e.id === id)?.name;
    addLog('info', `Selected model endpoint: ${endpointName}`);
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

    setIsGenerating(true);
    addLog('info', `Starting generation using ${selectedEndpoint.name}...`);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsGenerating(false);
      addLog('success', `Generation completed successfully! (-1 credit from ${selectedKey.name})`);
      
      // Generate mock result based on category
      const type = selectedEndpoint.category;
      let url = '';
      const randomSeed = Math.floor(Math.random() * 10000);
      
      if (type === 'image' || type === 'utility') {
        url = `https://picsum.photos/seed/${randomSeed}/800/450`;
      } else if (type === 'video') {
        url = 'https://www.w3schools.com/html/mov_bbb.mp4';
      } else if (type === 'audio') {
        url = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      }
      
      setGeneratedResult({ type, url });
      
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
        <div className="font-bold text-[1.1rem] text-blue-600 flex items-center gap-2">
          <span>⚡</span>
          Freepik API Control
        </div>
        <DashboardStats {...stats} />
      </header>

      {/* API Key Top Bar */}
      <div className="h-16 bg-white border-b border-[#e2e8f0] flex items-center px-4 shrink-0 overflow-x-auto custom-scrollbar gap-3">
        <div className="text-[0.7rem] font-semibold uppercase tracking-wide text-slate-400 mr-2 shrink-0">API Keys</div>
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
          />
        </section>

        {/* Right: Log */}
        <section className="w-[360px] flex flex-col border-l border-[#e2e8f0] bg-white shrink-0">
          <div className="p-4 border-b border-[#e2e8f0] flex justify-between items-center shrink-0">
            <span className="text-[0.875rem] font-semibold uppercase tracking-[0.025em] text-[#64748b]">System Log & Preview</span>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <RequestPreview
              selectedKey={selectedKey}
              selectedEndpoint={selectedEndpoint}
              logs={logs}
            />
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
