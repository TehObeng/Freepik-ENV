import { FieldDefinition } from '../types';

export const FIELDS: Record<string, FieldDefinition> = {
  prompt: {
    key: 'prompt',
    label: 'Prompt',
    type: 'textarea',
    required: true,
    placeholder: 'Describe what you want to generate...',
    group: 'main'
  },
  text: {
    key: 'text',
    label: 'Script / Text',
    type: 'textarea',
    required: true,
    placeholder: 'Enter text to be spoken...',
    group: 'main'
  },
  additional_prompt: {
    key: 'additional_prompt',
    label: 'Additional Prompt',
    type: 'textarea',
    placeholder: 'Any additional instructions...',
    group: 'main'
  },
  negative_prompt: {
    key: 'negative_prompt',
    label: 'Negative Prompt',
    type: 'textarea',
    placeholder: 'What to exclude...',
    group: 'main'
  },
  image: {
    key: 'image',
    label: 'Source Image',
    type: 'file_placeholder',
    icon: 'image',
    helpText: 'UI placeholder',
    group: 'media'
  },
  reference_image: {
    key: 'reference_image',
    label: 'Reference Image',
    type: 'file_placeholder',
    icon: 'image',
    helpText: 'UI placeholder',
    group: 'media'
  },
  reference_video: {
    key: 'reference_video',
    label: 'Reference Video',
    type: 'file_placeholder',
    icon: 'video',
    helpText: 'UI placeholder',
    group: 'media'
  },
  video: {
    key: 'video',
    label: 'Source Video',
    type: 'file_placeholder',
    icon: 'video',
    helpText: 'UI placeholder',
    group: 'media'
  },
  audio: {
    key: 'audio',
    label: 'Source Audio',
    type: 'file_placeholder',
    icon: 'mic',
    helpText: 'UI placeholder',
    group: 'media'
  },
  aspect_ratio: {
    key: 'aspect_ratio',
    label: 'Aspect Ratio',
    type: 'select',
    options: ['16:9 (Landscape)', '1:1 (Square)', '9:16 (Portrait)', '21:9 (Cinematic)'],
    defaultValue: '16:9 (Landscape)',
    group: 'settings'
  },
  duration: {
    key: 'duration',
    label: 'Duration',
    type: 'select',
    options: ['5 Seconds', '10 Seconds'],
    defaultValue: '5 Seconds',
    group: 'settings'
  },
  frame_rate: {
    key: 'frame_rate',
    label: 'Frame Rate',
    type: 'select',
    options: ['24 FPS (Cinematic)', '30 FPS (Standard)', '60 FPS (Smooth)'],
    defaultValue: '24 FPS (Cinematic)',
    group: 'settings'
  },
  voice: {
    key: 'voice',
    label: 'Voice',
    type: 'select',
    options: ['Rachel (American, Calm)', 'Drew (American, News)', 'Clyde (American, War veteran)', 'Mimi (British, Childish)'],
    defaultValue: 'Rachel (American, Calm)',
    group: 'settings'
  },
  output_format_audio: {
    key: 'output_format',
    label: 'Output Format',
    type: 'select',
    options: ['mp3_44100_128', 'mp3_44100_192', 'pcm_16000', 'pcm_24000'],
    defaultValue: 'mp3_44100_128',
    group: 'settings'
  },
  output_format_image: {
    key: 'output_format',
    label: 'Output Format',
    type: 'select',
    options: ['PNG (Transparent)', 'JPEG (Optimized)', 'WebP'],
    defaultValue: 'PNG (Transparent)',
    group: 'settings'
  },
  operation_mode: {
    key: 'operation_mode',
    label: 'Operation Mode',
    type: 'select',
    options: ['Auto-detect', 'Upscale 2x', 'Upscale 4x', 'Remove Background'],
    defaultValue: 'Auto-detect',
    group: 'settings'
  },
  upscale_factor: {
    key: 'upscale_factor',
    label: 'Upscale Factor',
    type: 'select',
    options: ['2x', '4x', '8x'],
    defaultValue: '2x',
    group: 'settings'
  },
  num_images: {
    key: 'num_images',
    label: 'Number of Images',
    type: 'slider',
    min: 1,
    max: 4,
    step: 1,
    defaultValue: 1,
    group: 'settings'
  },
  guidance_scale: {
    key: 'guidance_scale',
    label: 'Guidance Scale (CFG)',
    type: 'slider',
    min: 1,
    max: 20,
    step: 0.1,
    defaultValue: 7.5,
    group: 'settings'
  },
  style_strength: {
    key: 'style_strength',
    label: 'Style Strength',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    defaultValue: 50,
    group: 'settings'
  },
  creativity: {
    key: 'creativity',
    label: 'Creativity',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    helpText: 'How much new detail to hallucinate.',
    defaultValue: 30,
    group: 'tuning'
  },
  hdr: {
    key: 'hdr',
    label: 'HDR',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    helpText: 'Enhance lighting and contrast.',
    defaultValue: 50,
    group: 'tuning'
  },
  seamless_loop: {
    key: 'seamless_loop',
    label: 'Seamless Loop',
    type: 'toggle',
    defaultValue: false,
    group: 'settings'
  },
  seed: {
    key: 'seed',
    label: 'Seed',
    type: 'number',
    placeholder: 'Random (-1)',
    defaultValue: '',
    group: 'settings'
  },
  horizontal_pan: {
    key: 'horizontal_pan',
    label: 'Horizontal Pan',
    type: 'slider',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: 0,
    group: 'settings'
  },
  vertical_tilt: {
    key: 'vertical_tilt',
    label: 'Vertical Tilt',
    type: 'slider',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: 0,
    group: 'settings'
  },
  zoom: {
    key: 'zoom',
    label: 'Zoom',
    type: 'slider',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: 0,
    group: 'settings'
  }
};
