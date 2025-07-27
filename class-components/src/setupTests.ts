import { fetch, Headers, Request, Response } from 'undici';

Object.assign(globalThis, { fetch, Headers, Request, Response });

/// <reference types="vitest/globals" />

import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { server } from './__tests__/server';

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
