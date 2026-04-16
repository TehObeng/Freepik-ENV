import { EndpointFamily } from '../types';

export const getFamilyOverrides = (family?: string): string[] => {
  if (family === 'flux') {
    return ['negative_prompt']; // Fields to remove
  }
  return [];
};
