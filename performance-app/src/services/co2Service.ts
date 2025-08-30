import { type Co2Data } from '../types/co2Data';

const DATA_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

export type ProgressCallback = (loaded: number, total: number) => void;

const fetchCo2DataWithProgress = async (
  onProgress: ProgressCallback
): Promise<Co2Data> => {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch CO2 data');
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  if (!response.body) {
    throw new Error('Response body is null');
  }

  const reader = response.body.getReader();
  let loaded = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    if (value) {
      chunks.push(value);
      loaded += value.length;
      onProgress(loaded, total);
    }
  }

  const blob = new Blob(chunks as BlobPart[]);
  const text = await blob.text();
  return JSON.parse(text);
};

const createSuspenseResource = <T>(promise: Promise<T>) => {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: unknown;

  const suspender = promise.then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      error = e;
    }
  );

  return {
    read(): T {
      if (status === 'pending') {
        throw suspender;
      } else if (status === 'error') {
        throw error;
      } else if (status === 'success') {
        return result;
      }
      throw new Error('Resource in an invalid state');
    },
  };
};

export const createCo2DataResource = (onProgress: ProgressCallback) => {
  return createSuspenseResource(fetchCo2DataWithProgress(onProgress));
};
