import React from 'react';
import { Endpoint } from '../types';
import { Image as ImageIcon, Video, Music, FileText, Settings2, SlidersHorizontal, Mic, UploadCloud, Loader2, Download, RotateCcw, CheckCircle2, Info } from 'lucide-react';
import { PlaygroundFormState } from '../config/payloadBuilders';
import { MockResponse } from '../config/mockResponseFactory';

interface ModelPlaygroundProps {
  selectedEndpoint: Endpoint | null;
  isGenerating: boolean;
  onGenerate: () => void;
  generatedResult: MockResponse | null;
  formState: PlaygroundFormState;
  setFormState: React.Dispatch<React.SetStateAction<PlaygroundFormState>>;
  onReset: () => void;
}

export const ModelPlayground: React.FC<ModelPlaygroundProps> = ({ 
  selectedEndpoint, 
  isGenerating, 
  onGenerate, 
  generatedResult,
  formState,
  setFormState,
  onReset
}) => {
  if (!selectedEndpoint) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
          <Settings2 size={32} />
        </div>
        <p className="text-sm font-medium">Select a model from the left to start playing.</p>
      </div>
    );
  }

  const config = selectedEndpoint.config;
  const fields = config?.fields || [];

  const mainFields = fields.filter(f => f.group === 'main');
  const mediaFields = fields.filter(f => f.group === 'media');
  const settingsFields = fields.filter(f => f.group === 'settings');
  const tuningFields = fields.filter(f => f.group === 'tuning');

  const renderField = (field: any) => {
    const value = formState[field.key] !== undefined ? formState[field.key] : field.defaultValue;
    const onChange = (val: any) => setFormState({ ...formState, [field.key]: val });

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.key}>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 bg-slate-50" 
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            {field.helpText && <div className="text-[0.65rem] text-slate-400 mt-1">{field.helpText}</div>}
          </div>
        );
      case 'text':
        return (
          <div key={field.key}>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input 
              type="text"
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50" 
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            />
            {field.helpText && <div className="text-[0.65rem] text-slate-400 mt-1">{field.helpText}</div>}
          </div>
        );
      case 'number':
        return (
          <div key={field.key}>
            <div className="text-xs font-semibold text-slate-700 mb-1">{field.label}</div>
            <input 
              type="number" 
              placeholder={field.placeholder} 
              className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-mono text-slate-700 focus:ring-2 focus:ring-blue-500" 
              value={value ?? ''}
              onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            />
            {field.helpText && <div className="text-[0.65rem] text-slate-400 mt-1">{field.helpText}</div>}
          </div>
        );
      case 'select':
        return (
          <div key={field.key}>
            <div className="text-xs font-semibold text-slate-700 mb-1">{field.label}</div>
            <select 
              className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
            >
              {field.options?.map((opt: any) => (
                <option key={opt.value || opt} value={opt.value || opt}>{opt.label || opt}</option>
              ))}
            </select>
            {field.helpText && <div className="text-[0.65rem] text-slate-400 mt-1">{field.helpText}</div>}
          </div>
        );
      case 'slider':
        return (
          <div key={field.key}>
            <SliderControl 
              label={field.label} 
              value={value || 0} 
              min={field.min} 
              max={field.max} 
              step={field.step} 
              unit={field.unit || ''} 
              helpText={field.helpText} 
              onChange={onChange} 
            />
          </div>
        );
      case 'toggle':
        return (
          <label key={field.key} className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600" 
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
            />
            <span className="text-xs font-semibold text-slate-700">{field.label}</span>
          </label>
        );
      case 'file_placeholder':
        const IconComponent = field.icon === 'video' ? Video : field.icon === 'mic' ? Mic : ImageIcon;
        return (
          <div key={field.key}>
            <UploadBox icon={<IconComponent size={20}/>} label={field.label} helpText={field.helpText} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderDynamicFields = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {mainFields.length > 0 && (
            <div className="space-y-4">
              {mainFields.map(renderField)}
            </div>
          )}

          {mediaFields.length > 0 && (
            <div>
              <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Inputs & References</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {mediaFields.map(renderField)}
              </div>
            </div>
          )}
        </div>

        {/* Settings Sidebar */}
        <div className="space-y-6">
          {settingsFields.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-1">
                <Settings2 size={14} /> Settings
              </label>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
                {settingsFields.map(renderField)}
              </div>
            </div>
          )}

          {tuningFields.length > 0 && (
            <div>
              <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-1">
                <SlidersHorizontal size={14} /> Tuning
              </label>
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
                {tuningFields.map(renderField)}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Model Playground
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={onReset}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
            >
              <RotateCcw size={14} /> Reset Form
            </button>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {selectedEndpoint.name} Ready
            </div>
          </div>
        </div>
        
        {/* Capability Summary Chips */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wide mr-1">Capabilities:</span>
          {Object.entries(selectedEndpoint.capabilities || {}).map(([key, value]) => {
            if (!value) return null;
            const label = key.replace('supports', '').replace(/([A-Z])/g, ' $1').trim();
            return (
              <span key={key} className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-[0.65rem] font-medium">
                {label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-2">
            <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800 leading-relaxed">
              This playground adapts to each model's supported inputs. Different models expose different controls.
            </p>
          </div>

          {renderDynamicFields()}

          {/* Generated Result Section */}
          {generatedResult && (
            <div className="mt-8 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide">Mock Response</h3>
                <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                  <Download size={14} /> Download
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-wide mb-1">Task ID</div>
                  <div className="text-xs font-mono text-slate-700">{generatedResult.request_id}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-wide mb-1">Status</div>
                  <div className="text-xs font-semibold text-green-600">COMPLETED</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-wide mb-1">Endpoint</div>
                  <div className="text-xs font-medium text-slate-700 truncate" title={selectedEndpoint.name}>{selectedEndpoint.name}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[0.65rem] text-slate-500 uppercase font-bold tracking-wide mb-1">Generated</div>
                  <div className="text-xs font-medium text-slate-700">{new Date(generatedResult.submitted_at).toLocaleTimeString()}</div>
                </div>
              </div>

              <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex flex-col min-h-[300px] relative group">
                <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded text-[0.65rem] font-bold uppercase tracking-wide">
                  Demo Output Preview
                </div>
                <div className="flex-1 flex items-center justify-center p-4">
                  {generatedResult.output_type === 'image' && generatedResult.mock_output_url ? (
                    <img src={generatedResult.mock_output_url} alt="Generated" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                  ) : generatedResult.output_type === 'video' && generatedResult.mock_output_url ? (
                    <video src={generatedResult.mock_output_url} controls autoPlay loop className="max-w-full max-h-[500px] bg-black rounded-lg shadow-sm" />
                  ) : generatedResult.output_type === 'audio' && generatedResult.mock_output_url ? (
                    <div className="w-full max-w-md p-8 flex flex-col items-center gap-6 bg-white rounded-xl shadow-sm border border-slate-200">
                      <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
                        <Music size={32} />
                      </div>
                      <audio src={generatedResult.mock_output_url} controls className="w-full" />
                    </div>
                  ) : generatedResult.mock_result ? (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-left w-full max-w-2xl overflow-auto">
                      <pre className="text-xs font-mono text-slate-800 whitespace-pre-wrap">
                        {JSON.stringify(generatedResult.mock_result, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="text-slate-500">No preview available</div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
        
        {/* Action Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onGenerate}
            disabled={isGenerating}
            className={`px-6 py-2.5 font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-2 ${
              isGenerating 
                ? 'bg-blue-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isGenerating && <Loader2 size={18} className="animate-spin" />}
            {isGenerating ? 'Simulating...' : 'Simulate Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

const UploadBox = ({ icon, label, helpText }: { icon: React.ReactNode, label: string, helpText?: string }) => (
  <div 
    className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors gap-2 h-24 text-center"
    onClick={() => alert("Uploads are UI placeholders only in this version.")}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
    {helpText && <span className="text-[0.6rem] text-slate-400">{helpText}</span>}
  </div>
);

const SliderControl = ({ label, value, min = 0, max = 100, step = 1, unit = '%', helpText, onChange }: { label: string, value: number, min?: number, max?: number, step?: number, unit?: string, helpText?: string, onChange?: (val: number) => void }) => {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <span className="text-xs text-slate-500 font-mono">{value}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      {helpText && <div className="text-[0.65rem] text-slate-400 mt-1 leading-tight">{helpText}</div>}
    </div>
  );
};
