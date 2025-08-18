import { fetch, Headers, Request, Response } from 'undici';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '@/app/__tests__/server';
import { useSelectedItemsStore } from '@/app/store/selectedItemsStore';
import { useSearchStore } from '@/app/store/searchStore';

Object.assign(globalThis, { fetch, Headers, Request, Response });

import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

window.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
window.URL.revokeObjectURL = vi.fn();

const initialSelectedItemsState = useSelectedItemsStore.getState();
const initialSearchState = useSearchStore.getState();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  server.resetHandlers();
  useSelectedItemsStore.setState(initialSelectedItemsState, true);
  useSearchStore.setState(initialSearchState, true);
  localStorage.clear();
});

afterAll(() => server.close());
