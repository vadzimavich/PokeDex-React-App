import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage Hook', () => {
  const KEY = 'test-key';

  beforeEach(() => {
    window.localStorage.clear();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  it('should return initialValue if localStorage.getItem throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => {
      throw new Error('Security error');
    });
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));
    expect(result.current[0]).toBe('initial');
    expect(console.error).toHaveBeenCalled();
  });

  it('should catch error if localStorage.setItem throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('Quota exceeded');
    });
    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));
    act(() => {
      result.current[1]('new value');
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('should return initialValue if the stored value is invalid JSON', () => {
    window.localStorage.setItem(KEY, '---invalid-json---');

    const { result } = renderHook(() => useLocalStorage(KEY, 'initial'));

    expect(result.current[0]).toBe('initial');
    expect(console.error).toHaveBeenCalled();
  });
});
