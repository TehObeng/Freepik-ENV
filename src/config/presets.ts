import { InputMode, Preset } from '../types';

export const PRESETS: Record<InputMode, Preset[]> = {
  text_to_image: [
    {
      id: 'tti-photo',
      name: 'Photo Realistic',
      description: 'Optimized for highly realistic photography.',
      values: {
        prompt: 'A highly detailed, photorealistic portrait of a person, 8k resolution, cinematic lighting, shot on 35mm lens, sharp focus.',
        negative_prompt: 'cartoon, illustration, low quality, blurry, distorted, poorly drawn',
        aspect_ratio: '16:9 (Landscape)',
        guidance_scale: 8.5,
      }
    },
    {
      id: 'tti-anime',
      name: 'Anime Style',
      description: 'Vibrant colors and anime-style illustration.',
      values: {
        prompt: 'Masterpiece anime illustration, vibrant colors, highly detailed, studio ghibli style, beautiful scenery.',
        negative_prompt: 'photorealistic, 3d render, low quality, bad anatomy',
        aspect_ratio: '16:9 (Landscape)',
        guidance_scale: 7.0,
      }
    }
  ],
  image_to_video: [
    {
      id: 'itv-dramatic',
      name: 'Dramatic Trailer',
      description: 'Slow, dramatic camera movement.',
      values: {
        prompt: 'Cinematic slow motion, dramatic lighting, epic scale.',
        duration: '10 Seconds',
        frame_rate: '24 FPS (Cinematic)',
        zoom: 2,
        vertical_tilt: -1
      }
    },
    {
      id: 'itv-loop',
      name: 'Smooth Loop',
      description: 'A seamless looping animation.',
      values: {
        prompt: 'Smooth continuous motion, relaxing atmosphere.',
        duration: '5 Seconds',
        seamless_loop: true,
        horizontal_pan: 3
      }
    }
  ],
  voiceover: [
    {
      id: 'vo-calm',
      name: 'Calm Narration',
      description: 'Relaxing and clear voice for documentaries or audiobooks.',
      values: {
        voice: 'Rachel (American, Calm)',
        output_format: 'mp3_44100_192'
      }
    },
    {
      id: 'vo-energetic',
      name: 'Energetic Promo',
      description: 'Upbeat and fast-paced for commercials.',
      values: {
        voice: 'Drew (American, News)',
        output_format: 'mp3_44100_192'
      }
    }
  ],
  // Fallbacks for other modes
  image_edit: [],
  image_enhancement: [],
  text_to_video: [],
  reference_to_video: [],
  music_generation: [],
  sound_effects: [],
  audio_isolation: [],
  prompt_tool: [],
  icon_generation: [],
  classification: [],
  lora_training: []
};
