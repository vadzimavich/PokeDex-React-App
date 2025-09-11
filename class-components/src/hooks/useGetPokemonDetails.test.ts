import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../__tests__/server';
import { useGetPokemonDetails } from './useGetPokemonDetails';

describe('useGetPokemonDetails Hook', () => {
  it('should return loading state initially and then pokemon data', async () => {
    const { result } = renderHook(() => useGetPokemonDetails('1'));

    expect(result.current.isLoading).toBe(true);
    expect(result.current.pokemon).toBe(null);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemon).not.toBe(null);
      expect(result.current.pokemon?.name).toBe('bulbasaur');
    });
  });

  it('should return an error if the fetch fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/1', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const { result } = renderHook(() => useGetPokemonDetails('1'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.pokemon).toBe(null);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain(
        'Failed to fetch Pokemon: 500'
      );
    });
  });

  it('should not fetch if pokemonId is undefined', () => {
    const { result } = renderHook(() => useGetPokemonDetails(undefined));
    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemon).toBe(null);
    expect(result.current.error).toBe(null);
  });
});
