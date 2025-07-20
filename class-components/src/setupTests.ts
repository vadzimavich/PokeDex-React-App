import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { server } from './mocks/server';

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
