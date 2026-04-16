export type KeyStatus = 'active' | 'near_limit' | 'exhausted' | 'disabled';
export type EndpointCategory = 'image' | 'video' | 'audio' | 'utility' | 'all';

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
  implementationStatus?: 'ui_ready' | 'mock_only' | 'planned';
}
