import { describe, it, expect } from 'vitest';
import { getPokemonFullDetails, getPokemonList } from './pokemonService';
import { server } from '@/app/__tests__/server';
import { http, HttpResponse } from 'msw';

describe('pokemonService', () => {
  it('should throw an error if pokemon fetch fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/error-case', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    await expect(getPokemonFullDetails('error-case')).rejects.toThrow(
      'Failed to fetch Pokemon: 404'
    );
  });

  it('should throw an error if species fetch fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/species-error', () => {
        return HttpResponse.json({
          species: { url: 'https://pokeapi.co/api/v2/pokemon-species/fail' },
        });
      }),
      http.get('https://pokeapi.co/api/v2/pokemon-species/fail', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(getPokemonFullDetails('species-error')).rejects.toThrow(
      'Failed to fetch species data: 500'
    );
  });
});

describe('getPokemonList', () => {
  it('should fetch a list and then details for each pokemon', async () => {
    const result = await getPokemonList(
      'https://pokeapi.co/api/v2/pokemon?offset=0&limit=2'
    );

    expect(result).toHaveProperty('pokemons');
    expect(result).toHaveProperty('count');
    expect(result.pokemons).toHaveLength(2);

    expect(result.pokemons[0].name).toBe('bulbasaur');
    expect(result.pokemons[0]).toHaveProperty('height');
    expect(result.pokemons[1].name).toBe('ivysaur');
    expect(result.pokemons[1]).toHaveProperty('weight');
  });

  it('should throw an error if the list fetch fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/bad-list', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    await expect(
      getPokemonList('https://pokeapi.co/api/v2/pokemon/bad-list')
    ).rejects.toThrow('Network response was not ok: 500');
  });
});
