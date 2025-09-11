import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../__tests__/server';
import { usePokemons } from './usePokemons';

describe('usePokemons Hook', () => {
  it('should fetch a list of pokemons for a given page', async () => {
    const { result } = renderHook(() => usePokemons(1, ''));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemons.length).toBe(2);
      expect(result.current.pokemons[0].name).toBe('bulbasaur');
      expect(result.current.totalPages).toBeGreaterThan(0);
    });
  });

  it('should fetch a single pokemon when searchTerm is provided', async () => {
    const { result } = renderHook(() => usePokemons(1, 'ivysaur'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemons.length).toBe(1);
      expect(result.current.pokemons[0].name).toBe('ivysaur');
      expect(result.current.totalPages).toBe(1);
    });
  });

  it('should return an error if fetching list fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => usePokemons(1, ''));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain(
        'Network response was not ok: 500'
      );
    });
  });

  it('should return an error if fetching single pokemon fails', async () => {
    const { result } = renderHook(() => usePokemons(1, 'nonexistent'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe(
        'Pokemon "nonexistent" not found.'
      );
    });
  });
});
