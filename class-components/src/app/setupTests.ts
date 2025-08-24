import { fetch, Headers, Request, Response } from 'undici';
import { vi, afterEach } from 'vitest';

Object.assign(globalThis, { fetch, Headers, Request, Response });
import '@testing-library/jest-dom';

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
});
window.URL.createObjectURL = vi.fn(() => 'mock-blob-url');
window.URL.revokeObjectURL = vi.fn();

afterEach(() => {
  localStorage.clear();
});
