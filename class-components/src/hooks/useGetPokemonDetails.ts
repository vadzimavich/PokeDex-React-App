import { useState, useEffect } from 'react';
import { getPokemonFullDetails } from '../api/pokemonService';
import type { PokemonDetails } from '../types';

export const useGetPokemonDetails = (pokemonId: string | undefined) => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (pokemonId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        setPokemon(null);
        try {
          const data = await getPokemonFullDetails(pokemonId);
          setPokemon(data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [pokemonId]);

  return { pokemon, isLoading, error };
};
