export type KeyStatus = 'active' | 'near_limit' | 'exhausted' | 'disabled';
export type EndpointCategory = 'image' | 'video' | 'audio' | 'utility' | 'all';
export type ImplementationStatus = 'mock_only' | 'ui_ready' | 'planned';

export type InputMode = 
  | 'text_to_image'
  | 'image_edit'
  | 'image_enhancement'
  | 'text_to_video'
  | 'image_to_video'
  | 'reference_to_video'
  | 'music_generation'
  | 'sound_effects'
  | 'audio_isolation'
  | 'voiceover'
  | 'prompt_tool'
  | 'icon_generation'
  | 'classification'
  | 'lora_training';

export type OutputType = 'image' | 'video' | 'audio' | 'json' | 'asset_bundle';
export type EndpointFamily = 'flux' | 'seedream' | 'kling' | 'veo' | 'runway' | 'elevenlabs' | 'utility' | 'unknown';

export interface EndpointCapabilities {
  supportsPrompt?: boolean;
  supportsNegativePrompt?: boolean;
  supportsAspectRatio?: boolean;
  supportsSeed?: boolean;
  supportsGuidanceScale?: boolean;
  supportsStyleStrength?: boolean;
  supportsImageInput?: boolean;
  supportsReferenceImage?: boolean;
  supportsReferenceVideo?: boolean;
  supportsVideoInput?: boolean;
  supportsDuration?: boolean;
  supportsFrameRate?: boolean;
  supportsCameraMotion?: boolean;
  supportsLoop?: boolean;
  supportsVoiceSelection?: boolean;
  supportsScriptInput?: boolean;
  supportsAudioInput?: boolean;
  supportsOutputFormat?: boolean;
  supportsClassification?: boolean;
  supportsUpscaleFactor?: boolean;
  supportsLoRaConfig?: boolean;
  supportsNumImages?: boolean;
  supportsOperationMode?: boolean;
  supportsCreativity?: boolean;
  supportsHdr?: boolean;
}

export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'slider' | 'select' | 'toggle' | 'file_placeholder';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  defaultValue?: any;
  options?: string[] | { label: string, value: any }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  group?: 'main' | 'media' | 'settings' | 'tuning';
  icon?: string;
}

export interface EndpointConfig {
  fields: FieldDefinition[];
}

export interface ApiKey {
  id: string;
  name: string;
  apiKey: string;
  status: KeyStatus;
  used: number;
  limit: number;
  lastUsed: string;
  notes: string;
  selected: boolean;
}

export interface Endpoint {
  id: string;
  name: string;
  path: string;
  method: 'POST';
  category: EndpointCategory;
  note: string;
  implementationStatus?: ImplementationStatus;
  inputMode?: InputMode;
  outputType?: OutputType;
  family?: EndpointFamily;
  capabilityProfileId?: string;
  tags?: string[];
  shortCapabilities?: string[];
  capabilities?: EndpointCapabilities;
  config?: EndpointConfig;
}

export interface RequestHistoryItem {
  id: string;
  timestamp: string;
  endpointId: string;
  endpointName: string;
  path?: string;
  category: EndpointCategory;
  inputMode?: InputMode;
  outputType?: OutputType;
  family?: EndpointFamily;
  keyName: string;
  payload: any;
  formState: any;
  status: 'COMPLETED' | 'FAILED';
  mockOutputUrl?: string;
  mockResult?: any;
}
