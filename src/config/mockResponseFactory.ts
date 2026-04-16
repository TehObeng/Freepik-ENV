import { Endpoint, OutputType } from '../types';

export interface MockResponse {
  request_id: string;
  endpoint_name: string;
  endpoint_path: string;
  input_mode?: string;
  output_type?: OutputType;
  selected_key_name: string;
  status: string;
  submitted_at: string;
  payload_snapshot: any;
  mock_output_url?: string;
  mock_result?: any;
  credits_used: number;
}

export const buildMockResponse = (
  endpoint: Endpoint,
  keyName: string,
  payload: any,
  taskId: string
): MockResponse => {
  const type = endpoint.outputType || 'json';
  let mockUrl = '';
  let mockResult: any = undefined;
  
  const randomSeed = Math.floor(Math.random() * 10000);
  
  if (type === 'image') {
    mockUrl = `https://picsum.photos/seed/${randomSeed}/800/450`;
  } else if (type === 'video') {
    mockUrl = 'https://www.w3schools.com/html/mov_bbb.mp4';
  } else if (type === 'audio') {
    mockUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  } else if (type === 'json') {
    mockResult = {
      success: true,
      data: {
        message: "This is a mock JSON response.",
        confidence: 0.95,
        labels: ["mock", "data", "test"]
      }
    };
  } else if (type === 'asset_bundle') {
    mockResult = {
      success: true,
      bundle_id: `bundle_${randomSeed}`,
      download_url: `https://example.com/download/bundle_${randomSeed}.zip`
    };
  }

  return {
    request_id: taskId,
    endpoint_name: endpoint.name,
    endpoint_path: endpoint.path,
    input_mode: endpoint.inputMode,
    output_type: endpoint.outputType,
    selected_key_name: keyName,
    status: 'COMPLETED',
    submitted_at: new Date().toISOString(),
    payload_snapshot: payload,
    mock_output_url: mockUrl || undefined,
    mock_result: mockResult,
    credits_used: 1
  };
};
