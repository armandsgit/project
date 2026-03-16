'use client';

import { useMemo, useState } from 'react';
import ProcessingLoader from '@/components/ProcessingLoader';
import ResultViewer from '@/components/ResultViewer';
import UploadDropzone from '@/components/UploadDropzone';
import type { UploadState } from '@/types';

export default function HomePage() {
  const [state, setState] = useState<UploadState>('idle');
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const busy = state === 'uploading' || state === 'processing';

  async function handleFileSelect(file: File) {
    setError(null);
    setState('uploading');

    const preview = URL.createObjectURL(file);
    setOriginalImage(preview);

    const formData = new FormData();
    formData.append('image', file);

    try {
      setState('processing');
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || 'Failed to process image');
      }

      const blob = await response.blob();
      const output = URL.createObjectURL(blob);
      setResultImage(output);
      setState('result');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unexpected error';
      setError(message);
      setState('error');
    }
  }

  const showResult = useMemo(() => state === 'result' && originalImage && resultImage, [state, originalImage, resultImage]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="glass-card w-full max-w-5xl rounded-3xl p-6 md:p-10 shadow-glow">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-semibold md:text-4xl">AI Background Remover</h1>
          <p className="mt-3 text-slate-300">Drag &amp; drop an image to remove its background instantly.</p>
        </header>

        <div className="space-y-6">
          <UploadDropzone onFileSelect={handleFileSelect} disabled={busy} />

          {(state === 'uploading' || state === 'processing') && <ProcessingLoader stage={state} />}

          {error && <p className="rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}

          {showResult && <ResultViewer originalImage={originalImage} resultImage={resultImage} />}
        </div>
      </div>
    </main>
  );
}
