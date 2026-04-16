import { EndpointFamily } from '../types';

export const getFamilyOverrides = (family?: string): string[] => {
  if (family === 'flux') {
    return ['negative_prompt']; // Flux models typically don't support negative prompts
  }
  if (family === 'seedream') {
    return ['num_images']; // Seedream might only generate 1 image at a time
  }
  if (family === 'kling') {
    return ['seamless_loop']; // Kling might not support seamless loop
  }
  return [];
};
