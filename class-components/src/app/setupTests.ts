import { fetch, Headers, Request, Response } from 'undici';
import { server } from './app/__tests__/server';
import { useSelectedItemsStore } from './app/store/selectedItemsStore';
import { useSearchStore } from './app/store/searchStore';

Object.assign(globalThis, { fetch, Headers, Request, Response });

/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

const initialSelectedItemsState = useSelectedItemsStore.getState();
const initialSearchState = useSearchStore.getState();

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  useSelectedItemsStore.setState(initialSelectedItemsState);
  useSearchStore.setState(initialSearchState);
  localStorage.clear();
});

afterAll(() => server.close());
