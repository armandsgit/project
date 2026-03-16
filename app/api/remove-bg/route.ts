import { NextResponse } from 'next/server';
import { optimizeOutputImage } from '@/lib/imageProcessing';
import { removeBackgroundWithReplicate } from '@/lib/replicate';
import { limiter } from '@/lib/concurrency';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE = 10 * 1024 * 1024;

function fileToDataUrl(buffer: Buffer, type: string) {
  return `data:${type};base64,${buffer.toString('base64')}`;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('image');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File exceeds 10MB limit.' }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const inputDataUrl = fileToDataUrl(inputBuffer, file.type);

    const resultUrl = await limiter.run(() => removeBackgroundWithReplicate(inputDataUrl));
    const outputResponse = await fetch(resultUrl);

    if (!outputResponse.ok) {
      throw new Error('Failed to download processed image.');
    }

    const outputBuffer = Buffer.from(await outputResponse.arrayBuffer());
    const optimized = await optimizeOutputImage(outputBuffer);

    return new NextResponse(optimized, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store'
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
