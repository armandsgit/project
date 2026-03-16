const REPLICATE_API_BASE = 'https://api.replicate.com/v1';
const MODEL_VERSION = 'briaai/rmbg-1.4';

interface PredictionResponse {
  id: string;
  status: string;
  output?: string | string[];
  error?: string;
}

function getToken() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error('Missing REPLICATE_API_TOKEN');
  }
  return token;
}

async function createPrediction(imageDataUrl: string): Promise<PredictionResponse> {
  const response = await fetch(`${REPLICATE_API_BASE}/models/${MODEL_VERSION}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input: { image: imageDataUrl }
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to create prediction: ${text}`);
  }

  return (await response.json()) as PredictionResponse;
}

async function getPrediction(id: string): Promise<PredictionResponse> {
  const response = await fetch(`${REPLICATE_API_BASE}/predictions/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to fetch prediction: ${text}`);
  }

  return (await response.json()) as PredictionResponse;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function removeBackgroundWithReplicate(imageDataUrl: string): Promise<string> {
  const created = await createPrediction(imageDataUrl);
  let prediction = created;

  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await sleep(1500);
    prediction = await getPrediction(created.id);
  }

  if (prediction.status !== 'succeeded') {
    throw new Error(prediction.error || 'Background removal failed');
  }

  if (Array.isArray(prediction.output)) {
    return prediction.output[0];
  }

  if (!prediction.output) {
    throw new Error('No output image returned from Replicate');
  }

  return prediction.output;
}
