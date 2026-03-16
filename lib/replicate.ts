import Replicate from 'replicate';

const MODEL_VERSION = 'cjwbw/rembg:34bd50c3c0d6d5b3f2c41e98b5eb2d646f092d137cee66216c0daac82466e0f1';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN
});

export async function removeBackground(imageUrl: string): Promise<string> {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error('Missing REPLICATE_API_TOKEN');
  }

  try {
    const output = await replicate.run(MODEL_VERSION, {
      input: {
        image: imageUrl
      }
    });

    if (Array.isArray(output)) {
      if (!output[0] || typeof output[0] !== 'string') {
        throw new Error('Replicate returned an empty output array');
      }
      return output[0];
    }

    if (typeof output === 'string') {
      return output;
    }

    throw new Error('Replicate returned an unexpected output format');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Replicate error';
    throw new Error(`Replicate background removal failed: ${message}`);
  }
}
