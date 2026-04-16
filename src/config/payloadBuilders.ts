import { Endpoint } from '../types';

export type PlaygroundFormState = Record<string, any>;

export const getDefaultFormState = (endpoint: Endpoint): PlaygroundFormState => {
  const state: PlaygroundFormState = {};
  const fields = endpoint.config?.fields || [];
  
  fields.forEach(field => {
    if (field.defaultValue !== undefined) {
      state[field.key] = field.defaultValue;
    }
  });
  
  return state;
};

export const buildPayloadFromForm = (endpoint: Endpoint, state: PlaygroundFormState) => {
  const payload: any = {};
  const fields = endpoint.config?.fields || [];

  fields.forEach(field => {
    const value = state[field.key];
    if (value === undefined || value === '') return;

    if (field.type === 'file_placeholder') {
      payload[field.key] = `<base64_${field.key}_data>`;
      return;
    }

    // Special mappings
    if (field.key === 'aspect_ratio') {
      payload[field.key] = typeof value === 'string' ? value.split(' ')[0] : value;
    } else if (field.key === 'voice' || field.key === 'output_format') {
      payload[field.key] = typeof value === 'string' ? value.split(' ')[0].toLowerCase() : value;
    } else if (field.key === 'duration') {
      payload[field.key] = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value;
    } else if (field.key === 'frame_rate') {
      payload[field.key] = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value;
    } else if (field.key === 'upscale_factor') {
      payload[field.key] = typeof value === 'string' ? parseInt(value.replace(/[^0-9]/g, ''), 10) : value;
    } else if (field.key === 'style_strength' || field.key === 'creativity' || field.key === 'hdr') {
      payload[field.key] = value / 100;
    } else if (field.key === 'operation_mode') {
      payload[field.key] = typeof value === 'string' ? value.toLowerCase().replace(/ /g, '_') : value;
    } else if (['horizontal_pan', 'vertical_tilt', 'zoom'].includes(field.key)) {
      if (!payload.camera_motion) payload.camera_motion = {};
      payload.camera_motion[field.key] = value;
    } else {
      payload[field.key] = value;
    }
  });

  return payload;
};
