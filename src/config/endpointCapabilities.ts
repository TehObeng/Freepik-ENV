import { Endpoint, EndpointCapabilities, InputMode, OutputType, EndpointFamily } from '../types';

export const PRESETS: Record<InputMode, EndpointCapabilities> = {
  text_to_image: {
    supportsPrompt: true,
    supportsNegativePrompt: true,
    supportsAspectRatio: true,
    supportsSeed: true,
    supportsGuidanceScale: true,
    supportsNumImages: true,
  },
  image_edit: {
    supportsPrompt: true,
    supportsImageInput: true,
    supportsStyleStrength: true,
    supportsSeed: true,
  },
  image_enhancement: {
    supportsImageInput: true,
    supportsUpscaleFactor: true,
    supportsCreativity: true,
    supportsHdr: true,
    supportsOperationMode: true,
    supportsOutputFormat: true,
  },
  text_to_video: {
    supportsPrompt: true,
    supportsAspectRatio: true,
    supportsDuration: true,
    supportsFrameRate: true,
    supportsSeed: true,
  },
  image_to_video: {
    supportsPrompt: true,
    supportsImageInput: true,
    supportsDuration: true,
    supportsCameraMotion: true,
    supportsSeed: true,
  },
  reference_to_video: {
    supportsPrompt: true,
    supportsReferenceImage: true,
    supportsReferenceVideo: true,
    supportsDuration: true,
  },
  music_generation: {
    supportsPrompt: true,
    supportsDuration: true,
  },
  sound_effects: {
    supportsPrompt: true,
    supportsDuration: true,
  },
  audio_isolation: {
    supportsAudioInput: true,
  },
  voiceover: {
    supportsScriptInput: true,
    supportsVoiceSelection: true,
    supportsOutputFormat: true,
  },
  prompt_tool: {
    supportsPrompt: true,
  },
  icon_generation: {
    supportsPrompt: true,
    supportsNumImages: true,
  },
  classification: {
    supportsImageInput: true,
  },
  lora_training: {
    supportsImageInput: true,
    supportsPrompt: true,
  }
};

export const getEndpointInputMode = (endpoint: Endpoint): InputMode => {
  if (endpoint.path.includes('text-to-image')) return 'text_to_image';
  if (endpoint.path.includes('image-edit') || endpoint.path.includes('image-expand') || endpoint.path.includes('image-change-camera') || endpoint.path.includes('image-relight') || endpoint.path.includes('image-style-transfer')) return 'image_edit';
  if (endpoint.path.includes('image-upscaler') || endpoint.path.includes('skin-enhancer')) return 'image_enhancement';
  if (endpoint.path.includes('text-to-video')) return 'text_to_video';
  if (endpoint.path.includes('image-to-video')) return 'image_to_video';
  if (endpoint.path.includes('video-upscaler') || endpoint.path.includes('vfx') || endpoint.path.includes('omni-human')) return 'image_to_video';
  if (endpoint.path.includes('music-generation')) return 'music_generation';
  if (endpoint.path.includes('sound-effects')) return 'sound_effects';
  if (endpoint.path.includes('audio-isolation')) return 'audio_isolation';
  if (endpoint.path.includes('voiceover')) return 'voiceover';
  if (endpoint.path.includes('text-to-icon')) return 'icon_generation';
  if (endpoint.path.includes('classifier')) return 'classification';
  if (endpoint.path.includes('image-to-prompt') || endpoint.path.includes('improve-prompt')) return 'prompt_tool';
  if (endpoint.path.includes('loras')) return 'lora_training';
  if (endpoint.path.includes('mystic')) return 'text_to_image';
  if (endpoint.path.includes('video/kling')) return 'text_to_video'; 
  
  // Default fallbacks based on category
  switch (endpoint.category) {
    case 'image': return 'text_to_image';
    case 'video': return 'text_to_video';
    case 'audio': return 'music_generation';
    case 'utility': return 'prompt_tool';
    default: return 'text_to_image';
  }
};

export const getEndpointOutputType = (endpoint: Endpoint): OutputType => {
  if (endpoint.category === 'image') return 'image';
  if (endpoint.category === 'video') return 'video';
  if (endpoint.category === 'audio') return 'audio';
  if (endpoint.path.includes('loras')) return 'asset_bundle';
  return 'json';
};

export const getEndpointFamily = (endpoint: Endpoint): EndpointFamily => {
  const path = endpoint.path.toLowerCase();
  if (path.includes('flux')) return 'flux';
  if (path.includes('seedream')) return 'seedream';
  if (path.includes('kling')) return 'kling';
  if (path.includes('veo')) return 'veo';
  if (path.includes('runway')) return 'runway';
  if (path.includes('elevenlabs') || path.includes('voiceover')) return 'elevenlabs';
  if (endpoint.category === 'utility') return 'utility';
  return 'unknown';
};

export const getEndpointCapabilities = (endpoint: Endpoint): EndpointCapabilities => {
  const mode = getEndpointInputMode(endpoint);
  let caps = { ...PRESETS[mode] };
  
  // Specific overrides based on endpoint name or path
  if (endpoint.name.toLowerCase().includes('flux')) {
    caps.supportsNegativePrompt = false;
  }
  
  return caps;
};
