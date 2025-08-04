import { fetch, Headers, Request, Response } from 'undici';
import { server } from './__tests__/server';
import { useSelectedItemsStore } from './store/selectedItemsStore';

Object.assign(globalThis, { fetch, Headers, Request, Response });

/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

const initialState = useSelectedItemsStore.getState();

beforeAll(() => server.listen());

afterEach(() => {
  server.resetHandlers();
  useSelectedItemsStore.setState(initialState);
});

afterAll(() => server.close());
