'use client';

import { Loader2 } from 'lucide-react';

interface ProcessingLoaderProps {
  stage: 'uploading' | 'processing';
}

export default function ProcessingLoader({ stage }: ProcessingLoaderProps) {
  return (
    <div className="glass-card flex items-center justify-center gap-3 rounded-xl p-6 text-slate-200">
      <Loader2 className="h-5 w-5 animate-spin text-accent" />
      <p>{stage === 'uploading' ? 'Uploading image...' : 'Removing background with AI...'}</p>
    </div>
  );
}
