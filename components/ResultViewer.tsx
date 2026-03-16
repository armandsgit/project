'use client';

import CompareSlider from './CompareSlider';
import DownloadButton from './DownloadButton';
import ImagePreview from './ImagePreview';

interface ResultViewerProps {
  originalImage: string;
  resultImage: string;
}

export default function ResultViewer({ originalImage, resultImage }: ResultViewerProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <ImagePreview src={originalImage} title="Original" />
        <ImagePreview src={resultImage} title="Background Removed" />
      </div>
      <CompareSlider beforeSrc={originalImage} afterSrc={resultImage} />
      <div className="flex justify-end">
        <DownloadButton image={resultImage} />
      </div>
    </div>
  );
}
