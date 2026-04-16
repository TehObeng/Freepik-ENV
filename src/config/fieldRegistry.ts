import { FieldDefinition } from '../types';

export const FIELDS: Record<string, FieldDefinition> = {
  prompt: {
    key: 'prompt',
    label: 'Prompt',
    type: 'textarea',
    required: true,
    placeholder: 'Describe what you want to generate...',
    helpText: 'The main text description of what you want the AI to create. Be as descriptive as possible.',
    group: 'main'
  },
  text: {
    key: 'text',
    label: 'Script / Text',
    type: 'textarea',
    required: true,
    placeholder: 'Enter text to be spoken...',
    helpText: 'The text script that will be converted into speech.',
    group: 'main'
  },
  additional_prompt: {
    key: 'additional_prompt',
    label: 'Additional Prompt',
    type: 'textarea',
    placeholder: 'Any additional instructions...',
    helpText: 'Extra details or instructions to guide the generation process.',
    group: 'main',
    advanced: true
  },
  negative_prompt: {
    key: 'negative_prompt',
    label: 'Negative Prompt',
    type: 'textarea',
    placeholder: 'What to exclude...',
    helpText: 'Specify elements you do NOT want to appear in the generated output.',
    group: 'main',
    advanced: true
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
    helpText: 'The proportional relationship between the width and height of the output.',
    group: 'settings'
  },
  duration: {
    key: 'duration',
    label: 'Duration',
    type: 'select',
    options: ['5 Seconds', '10 Seconds'],
    defaultValue: '5 Seconds',
    helpText: 'The length of the generated video or audio.',
    group: 'settings'
  },
  frame_rate: {
    key: 'frame_rate',
    label: 'Frame Rate',
    type: 'select',
    options: ['24 FPS (Cinematic)', '30 FPS (Standard)', '60 FPS (Smooth)'],
    defaultValue: '24 FPS (Cinematic)',
    helpText: 'Frames per second. Higher values result in smoother motion.',
    group: 'settings',
    advanced: true
  },
  voice: {
    key: 'voice',
    label: 'Voice',
    type: 'select',
    options: ['Rachel (American, Calm)', 'Drew (American, News)', 'Clyde (American, War veteran)', 'Mimi (British, Childish)'],
    defaultValue: 'Rachel (American, Calm)',
    helpText: 'The synthetic voice model to use for text-to-speech generation.',
    group: 'settings'
  },
  output_format_audio: {
    key: 'output_format',
    label: 'Output Format',
    type: 'select',
    options: ['mp3_44100_128', 'mp3_44100_192', 'pcm_16000', 'pcm_24000'],
    defaultValue: 'mp3_44100_128',
    helpText: 'The audio encoding format and sample rate.',
    group: 'settings',
    advanced: true
  },
  output_format_image: {
    key: 'output_format',
    label: 'Output Format',
    type: 'select',
    options: ['PNG (Transparent)', 'JPEG (Optimized)', 'WebP'],
    defaultValue: 'PNG (Transparent)',
    helpText: 'The file format for the generated image.',
    group: 'settings',
    advanced: true
  },
  operation_mode: {
    key: 'operation_mode',
    label: 'Operation Mode',
    type: 'select',
    options: ['Auto-detect', 'Upscale 2x', 'Upscale 4x', 'Remove Background'],
    defaultValue: 'Auto-detect',
    helpText: 'The specific enhancement operation to perform on the input image.',
    group: 'settings'
  },
  upscale_factor: {
    key: 'upscale_factor',
    label: 'Upscale Factor',
    type: 'select',
    options: ['2x', '4x', '8x'],
    defaultValue: '2x',
    helpText: 'Multiplier for increasing the resolution of the image.',
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
    helpText: 'How many variations to generate in a single request.',
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
    helpText: 'How strictly the AI should follow your prompt. Higher values force stricter adherence but may reduce creativity.',
    group: 'settings',
    advanced: true
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
    helpText: 'How strongly to apply the selected style or reference image to the output.',
    group: 'settings',
    advanced: true
  },
  creativity: {
    key: 'creativity',
    label: 'Creativity',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    helpText: 'How much new detail the AI is allowed to hallucinate or invent.',
    defaultValue: 30,
    group: 'tuning',
    advanced: true
  },
  hdr: {
    key: 'hdr',
    label: 'HDR',
    type: 'slider',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    helpText: 'Enhance lighting, contrast, and dynamic range in the output.',
    defaultValue: 50,
    group: 'tuning',
    advanced: true
  },
  seamless_loop: {
    key: 'seamless_loop',
    label: 'Seamless Loop',
    type: 'toggle',
    defaultValue: false,
    helpText: 'Ensure the end of the video or audio seamlessly transitions back to the beginning.',
    group: 'settings',
    advanced: true
  },
  seed: {
    key: 'seed',
    label: 'Seed',
    type: 'number',
    placeholder: 'Random (-1)',
    defaultValue: '',
    helpText: 'A specific number to initialize the generation. Using the same seed and prompt will produce identical results.',
    group: 'settings',
    advanced: true
  },
  horizontal_pan: {
    key: 'horizontal_pan',
    label: 'Horizontal Pan',
    type: 'slider',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: 0,
    helpText: 'Simulate camera panning left (negative) or right (positive).',
    group: 'settings',
    advanced: true
  },
  vertical_tilt: {
    key: 'vertical_tilt',
    label: 'Vertical Tilt',
    type: 'slider',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: 0,
    helpText: 'Simulate camera tilting down (negative) or up (positive).',
    group: 'settings',
    advanced: true
  },
  zoom: {
    key: 'zoom',
    label: 'Zoom',
    type: 'slider',
    min: -10,
    max: 10,
    step: 1,
    defaultValue: 0,
    helpText: 'Simulate camera zooming out (negative) or in (positive).',
    group: 'settings',
    advanced: true
  }
};
