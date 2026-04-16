import React from 'react';
import { Endpoint } from '../types';
import { Image as ImageIcon, Video, Music, FileText, Settings2, SlidersHorizontal, Mic, UploadCloud, Loader2, Download } from 'lucide-react';

interface ModelPlaygroundProps {
  selectedEndpoint: Endpoint | null;
  isGenerating: boolean;
  onGenerate: () => void;
  generatedResult: { type: string, url: string } | null;
}

export const ModelPlayground: React.FC<ModelPlaygroundProps> = ({ selectedEndpoint, isGenerating, onGenerate, generatedResult }) => {
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

  const renderImagePlayground = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Prompt</label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 bg-slate-50" 
              placeholder="Describe the image you want to generate in detail..."
            ></textarea>
          </div>
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Negative Prompt</label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-16 bg-slate-50" 
              placeholder="What to exclude from the generation (e.g., blurry, low quality)..."
            ></textarea>
          </div>
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Reference Image & LoRAs</label>
            <div className="grid grid-cols-2 gap-3">
              <UploadBox icon={<ImageIcon size={20}/>} label="Upload Image" />
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors gap-2 h-24">
                <Settings2 size={20}/>
                <span className="text-xs font-medium">+ Add LoRA Model</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-1">
            <Settings2 size={14} /> Generation Settings
          </label>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Aspect Ratio</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>16:9 (Landscape)</option>
                <option>1:1 (Square)</option>
                <option>9:16 (Portrait)</option>
                <option>21:9 (Cinematic)</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Sampler</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>Euler a</option>
                <option>DPM++ 2M Karras</option>
                <option>DDIM</option>
              </select>
            </div>
            <SliderControl label="Steps" value={30} min={1} max={100} unit="" />
            <SliderControl label="Guidance Scale (CFG)" value={7.5} min={1} max={20} step={0.1} unit="" />
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Seed</div>
              <input type="number" placeholder="Random (-1)" className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-mono text-slate-700 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderVideoPlayground = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Prompt</label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 bg-slate-50" 
              placeholder="Describe the video scene, motion, and camera movement..."
            ></textarea>
          </div>
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Inputs & References</label>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <UploadBox icon={<ImageIcon size={20}/>} label="Starting Frame" />
              <UploadBox icon={<Video size={20}/>} label="Reference Video" />
              <UploadBox icon={<Music size={20}/>} label="Audio Track" />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-3">
              <SlidersHorizontal size={14} /> Camera Motion
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 rounded-lg p-4 bg-slate-50">
              <SliderControl label="Horizontal Pan" value={0} min={-10} max={10} unit="" />
              <SliderControl label="Vertical Tilt" value={0} min={-10} max={10} unit="" />
              <SliderControl label="Zoom" value={0} min={-10} max={10} unit="" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-1">
            <Settings2 size={14} /> Video Settings
          </label>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Aspect Ratio</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>16:9 (Landscape)</option>
                <option>9:16 (Portrait)</option>
                <option>1:1 (Square)</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Duration</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>5 Seconds</option>
                <option>10 Seconds</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Frame Rate</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>24 FPS (Cinematic)</option>
                <option>30 FPS (Standard)</option>
                <option>60 FPS (Smooth)</option>
              </select>
            </div>
            <SliderControl label="Motion Intensity" value={5} min={1} max={10} unit="" />
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600" />
              <span className="text-xs font-semibold text-slate-700">Seamless Loop</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );

  const renderAudioPlayground = () => (
    <>
      <div>
        <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Text / Script</label>
        <textarea 
          className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-32 bg-slate-50" 
          placeholder="Enter the text to be spoken..."
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Voice & Model Selection */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-3">
              <Mic size={14} /> Voice & Model
            </label>
            <div className="space-y-3">
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-xs text-slate-500 mb-1">Voice</div>
                <select className="w-full bg-transparent text-sm outline-none font-medium text-slate-700">
                  <option>Rachel (American, Calm)</option>
                  <option>Drew (American, News)</option>
                  <option>Clyde (American, War veteran)</option>
                  <option>Mimi (British, Childish)</option>
                  <option>+ Add Cloned Voice</option>
                </select>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-xs text-slate-500 mb-1">Model</div>
                <select className="w-full bg-transparent text-sm outline-none font-medium text-slate-700">
                  <option>Eleven Multilingual v2</option>
                  <option>Eleven Turbo v2.5</option>
                  <option>Eleven English v1</option>
                </select>
              </div>
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="text-xs text-slate-500 mb-1">Output Format</div>
                <select className="w-full bg-transparent text-sm outline-none font-medium text-slate-700">
                  <option>mp3_44100_128</option>
                  <option>mp3_44100_192</option>
                  <option>pcm_16000</option>
                  <option>pcm_24000</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Voice Settings */}
        <div>
          <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-3">
            <Settings2 size={14} /> Voice Settings
          </label>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
            <SliderControl 
              label="Stability" 
              value={50} 
              helpText="Higher values make the voice more consistent, lower values make it more emotional."
            />
            <SliderControl 
              label="Similarity Boost" 
              value={75} 
              helpText="High values ensure the generated voice matches the original voice closely."
            />
            <SliderControl 
              label="Style Exaggeration" 
              value={0} 
              helpText="Higher values exaggerate the style of the voice."
            />
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 accent-blue-600" />
              <span className="text-xs font-semibold text-slate-700">Speaker Boost</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );

  const renderUtilityPlayground = () => (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Source Media</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <UploadBox icon={<UploadCloud size={20}/>} label="Upload Image or Video" />
            </div>
          </div>
          <div>
            <label className="block text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-2">Additional Prompt (Optional)</label>
            <textarea 
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 bg-slate-50" 
              placeholder="Any additional instructions for the utility model (e.g., 'Make it look like a painting')..."
            ></textarea>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide mb-1">
            <Settings2 size={14} /> Utility Settings
          </label>
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Operation Mode</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>Auto-detect</option>
                <option>Upscale 2x</option>
                <option>Upscale 4x</option>
                <option>Remove Background</option>
              </select>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-1">Output Format</div>
              <select className="w-full bg-white border border-slate-200 rounded-md p-2 text-sm outline-none font-medium text-slate-700 focus:ring-2 focus:ring-blue-500">
                <option>PNG (Transparent)</option>
                <option>JPEG (Optimized)</option>
                <option>WebP</option>
              </select>
            </div>
            <div className="pt-2 border-t border-slate-200">
              <div className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-wide mb-3 mt-2">Upscaler Tuning</div>
              <SliderControl label="Creativity" value={30} min={0} max={100} unit="%" helpText="How much new detail to hallucinate." />
              <SliderControl label="HDR" value={50} min={0} max={100} unit="%" helpText="Enhance lighting and contrast." />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          Model Playground
        </h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {selectedEndpoint.name} Ready
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        <div className="p-5 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          
          {selectedEndpoint.category === 'image' && renderImagePlayground()}
          {selectedEndpoint.category === 'video' && renderVideoPlayground()}
          {selectedEndpoint.category === 'audio' && renderAudioPlayground()}
          {selectedEndpoint.category === 'utility' && renderUtilityPlayground()}

          {/* Generated Result Section */}
          {generatedResult && (
            <div className="mt-8 pt-6 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[0.75rem] font-bold text-slate-700 uppercase tracking-wide">Generated Output</h3>
                <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-md transition-colors">
                  <Download size={14} /> Download
                </button>
              </div>
              <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center min-h-[300px] relative group p-4">
                {generatedResult.type === 'image' || generatedResult.type === 'utility' ? (
                  <img src={generatedResult.url} alt="Generated" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" referrerPolicy="no-referrer" />
                ) : generatedResult.type === 'video' ? (
                  <video src={generatedResult.url} controls autoPlay loop className="max-w-full max-h-[500px] bg-black rounded-lg shadow-sm" />
                ) : generatedResult.type === 'audio' ? (
                  <div className="w-full max-w-md p-8 flex flex-col items-center gap-6 bg-white rounded-xl shadow-sm border border-slate-200">
                    <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shadow-inner">
                      <Music size={32} />
                    </div>
                    <audio src={generatedResult.url} controls className="w-full" />
                  </div>
                ) : null}
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
            {isGenerating ? 'Generating...' : 'Generate Output'}
          </button>
        </div>
      </div>
    </div>
  );
}

const UploadBox = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 cursor-pointer transition-colors gap-2 h-24">
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </div>
);

const SliderControl = ({ label, value, min = 0, max = 100, step = 1, unit = '%', helpText }: { label: string, value: number, min?: number, max?: number, step?: number, unit?: string, helpText?: string }) => {
  const [currentValue, setCurrentValue] = React.useState(value);
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-slate-700">{label}</label>
        <span className="text-xs text-slate-500 font-mono">{currentValue}{unit}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={currentValue}
        onChange={(e) => setCurrentValue(Number(e.target.value))}
        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      {helpText && <div className="text-[0.65rem] text-slate-400 mt-1 leading-tight">{helpText}</div>}
    </div>
  );
};
