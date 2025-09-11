import { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getPokemonFullDetails } from '../api/pokemonService';
import type { PokemonDetails } from '../types';

const POKEMON_PER_PAGE = 20;

export const usePokemons = (currentPage: number, searchTerm: string) => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPokemonsByUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { pokemons, next, previous, count } = await getPokemonList(url);
      setPokemons(pokemons);
      setNextPageUrl(next);
      setPrevPageUrl(previous);
      setTotalPages(Math.ceil(count / POKEMON_PER_PAGE));
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchSinglePokemon = useCallback(async (name: string) => {
    setIsLoading(true);
    setError(null);
    setNextPageUrl(null);
    setPrevPageUrl(null);
    try {
      const pokemon = await getPokemonFullDetails(name.toLowerCase());
      setPokemons([pokemon]);
      setTotalPages(1);
    } catch (err) {
      setError(new Error(`Pokemon "${name}" not found.`));
      setPokemons([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchSinglePokemon(searchTerm);
    } else {
      const offset = (currentPage - 1) * POKEMON_PER_PAGE;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`;
      fetchPokemonsByUrl(url);
    }
  }, [currentPage, searchTerm, fetchPokemonsByUrl, fetchSinglePokemon]);

  return { pokemons, isLoading, error, nextPageUrl, prevPageUrl, totalPages };
};
