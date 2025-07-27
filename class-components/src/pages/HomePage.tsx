import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

import Main from '../components/Main/Main';
import Pagination from '../components/Pagination/Pagination';
import Header from '../components/Header/Header';
import PokemonDetailView from '../components/PokemonDetailView/PokemonDetailView';
import type { PokemonDetails } from '../types';

const POKEMON_PER_PAGE = 20;

const HomePage = () => {
  const [pokemons, setPokemons] = useState<PokemonDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);

  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const detailsId = searchParams.get('details');

  const getPokemonDetails = useCallback(
    async (url: string): Promise<PokemonDetails> => {
      const detailsRes = await fetch(url);
      if (!detailsRes.ok) throw new Error('Failed to fetch pokemon details');
      const details = await detailsRes.json();
      const speciesRes = await fetch(details.species.url);
      if (!speciesRes.ok) throw new Error('Failed to fetch pokemon species');
      const speciesData = await speciesRes.json();
      const entry = speciesData.flavor_text_entries.find(
        (e: { language: { name: string } }) => e.language.name === 'en'
      );
      const description = entry
        ? entry.flavor_text.replace(/[\n\f\r]/g, ' ')
        : 'No description.';
      return { ...details, description };
    },
    []
  );

  const fetchPokemonsByUrl = useCallback(
    async (url: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const { results, next, previous, count } = data;
        const promises = results.map((p: { url: string }) =>
          getPokemonDetails(p.url)
        );
        const detailedPokemons = await Promise.all(promises);
        setPokemons(detailedPokemons);
        setNextPageUrl(next);
        setPrevPageUrl(previous);
        setTotalPages(Math.ceil(count / POKEMON_PER_PAGE));
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    [getPokemonDetails]
  );

  const fetchSinglePokemon = useCallback(
    async (name: string) => {
      setIsLoading(true);
      setError(null);
      setNextPageUrl(null);
      setPrevPageUrl(null);
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
        const pokemon = await getPokemonDetails(url);
        setPokemons([pokemon]);
      } catch (_) {
        setError(new Error(`Pokemon "${name}" not found.`));
        setPokemons([]);
      } finally {
        setIsLoading(false);
      }
    },
    [getPokemonDetails]
  );

  useEffect(() => {
    if (searchTerm) {
      fetchSinglePokemon(searchTerm);
    } else {
      const offset = (currentPage - 1) * POKEMON_PER_PAGE;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`;
      fetchPokemonsByUrl(url);
    }
  }, [currentPage, searchTerm, fetchPokemonsByUrl, fetchSinglePokemon]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams({ page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
    }
  };

  const handleCardClick = (id: number) => {
    setSearchParams({ page: currentPage.toString(), details: id.toString() });
  };

  const closeDetails = () => {
    setSearchParams({ page: currentPage.toString() });
  };

  const showPagination = !searchTerm && !error;

  return (
    <>
      <Header onSearch={handleSearch} initialValue={searchTerm} />
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {showPagination && (
            <Pagination
              onNext={() => handlePageChange(currentPage + 1)}
              onPrev={() => handlePageChange(currentPage - 1)}
              hasNext={!!nextPageUrl}
              hasPrev={!!prevPageUrl}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
          <Main
            pokemons={pokemons}
            isLoading={isLoading}
            error={error}
            onCardClick={handleCardClick}
          />
          {showPagination && (
            <Pagination
              onNext={() => handlePageChange(currentPage + 1)}
              onPrev={() => handlePageChange(currentPage - 1)}
              hasNext={!!nextPageUrl}
              hasPrev={!!prevPageUrl}
              currentPage={currentPage}
              totalPages={totalPages}
            />
          )}
        </div>
        {detailsId && (
          <PokemonDetailView pokemonId={detailsId} onClose={closeDetails} />
        )}
      </div>
    </>
  );
};

export default HomePage;
