import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSearchStore } from './searchStore';

describe('useSearchStore', () => {
  it('should set a new search term', () => {
    const { result } = renderHook(() => useSearchStore());

    expect(result.current.searchTerm).toBe('');

    act(() => {
      result.current.setSearchTerm('pikachu');
    });

    expect(result.current.searchTerm).toBe('pikachu');
  });
});
