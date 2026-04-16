import { EndpointConfig, InputMode } from '../types';
import { FIELDS } from './fieldRegistry';
import { getFamilyOverrides } from './endpointFamilies';

export const CONFIG_PRESETS: Record<InputMode, EndpointConfig> = {
  text_to_image: {
    fields: [
      FIELDS.prompt,
      FIELDS.negative_prompt,
      FIELDS.aspect_ratio,
      FIELDS.num_images,
      FIELDS.guidance_scale,
      FIELDS.seed
    ]
  },
  image_edit: {
    fields: [
      FIELDS.image,
      FIELDS.prompt,
      FIELDS.negative_prompt,
      FIELDS.guidance_scale,
      FIELDS.seed
    ]
  },
  image_enhancement: {
    fields: [
      FIELDS.image,
      FIELDS.additional_prompt,
      FIELDS.operation_mode,
      FIELDS.output_format_image,
      FIELDS.creativity,
      FIELDS.hdr
    ]
  },
  text_to_video: {
    fields: [
      FIELDS.prompt,
      FIELDS.aspect_ratio,
      FIELDS.duration,
      FIELDS.frame_rate,
      FIELDS.seamless_loop,
      FIELDS.horizontal_pan,
      FIELDS.vertical_tilt,
      FIELDS.zoom
    ]
  },
  image_to_video: {
    fields: [
      FIELDS.image,
      FIELDS.prompt,
      FIELDS.aspect_ratio,
      FIELDS.duration,
      FIELDS.frame_rate,
      FIELDS.seamless_loop,
      FIELDS.horizontal_pan,
      FIELDS.vertical_tilt,
      FIELDS.zoom
    ]
  },
  reference_to_video: {
    fields: [
      FIELDS.image,
      FIELDS.reference_video,
      FIELDS.prompt,
      FIELDS.aspect_ratio,
      FIELDS.duration,
      FIELDS.frame_rate
    ]
  },
  music_generation: {
    fields: [
      FIELDS.prompt,
      FIELDS.duration
    ]
  },
  sound_effects: {
    fields: [
      FIELDS.prompt
    ]
  },
  audio_isolation: {
    fields: [
      FIELDS.audio
    ]
  },
  voiceover: {
    fields: [
      FIELDS.text,
      FIELDS.voice,
      FIELDS.output_format_audio
    ]
  },
  prompt_tool: {
    fields: [
      FIELDS.prompt
    ]
  },
  icon_generation: {
    fields: [
      FIELDS.prompt,
      FIELDS.aspect_ratio,
      FIELDS.num_images,
      FIELDS.seed
    ]
  },
  classification: {
    fields: [
      FIELDS.image
    ]
  },
  lora_training: {
    fields: [
      FIELDS.image // simplified
    ]
  }
};

export const getEndpointConfig = (endpoint: any, inputMode?: InputMode, family?: string): EndpointConfig => {
  if (!inputMode) return { fields: [] };
  const baseConfig = CONFIG_PRESETS[inputMode] || { fields: [] };
  let fields = [...baseConfig.fields];

  // Family-level overrides
  const fieldsToRemove = getFamilyOverrides(family);
  fields = fields.filter(f => !fieldsToRemove.includes(f.key));

  // Endpoint-level overrides
  if (endpoint.path.includes('mystic')) {
    // Mystic might not support negative prompts
    fields = fields.filter(f => f.key !== 'negative_prompt');
  } else if (endpoint.path.includes('seedream-v5-lite')) {
    // Seedream v5 lite might ignore guidance_scale
    fields = fields.filter(f => f.key !== 'guidance_scale');
  }

  return { fields };
};
