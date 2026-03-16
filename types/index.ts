export type UploadState = 'idle' | 'uploading' | 'processing' | 'result' | 'error';

export interface RemoveBgResponse {
  image: string;
  mimeType: string;
}
