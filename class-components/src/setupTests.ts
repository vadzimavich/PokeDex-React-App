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
