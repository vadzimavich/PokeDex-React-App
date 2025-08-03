import { useState, useEffect, useCallback } from 'react';
import {
  useSearchParams,
  useNavigate,
  useLocation,
  Outlet,
  useOutlet,
} from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { getPokemonList, getPokemonFullDetails } from '../api/pokemonService';
import { useSelectedItemsStore } from '../store/selectedItemsStore';

import Main from '../components/Main/Main';
import Pagination from '../components/Pagination/Pagination';
import Header from '../components/Header/Header';
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

  const { selectedPokemons, toggleSelectedItem } = useSelectedItemsStore();
  const selectedIds = new Set(selectedPokemons.map((p) => p.id));

  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

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

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSearchParams((prev) => {
      prev.set('page', '1');
      return prev;
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setSearchParams((prev) => {
        prev.set('page', newPage.toString());
        return prev;
      });
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`details/${id}${location.search}`);
  };

  const closeDetails = () => {
    navigate(`/${location.search}`);
  };

  const showPagination = !searchTerm && !error;

  return (
    <>
      <Header onSearch={handleSearch} initialValue={searchTerm} />
      <div style={{ display: 'flex' }}>
        <div
          style={{ flex: 1, minWidth: 0 }}
          onClick={outlet ? closeDetails : undefined}
          data-testid="main-panel"
        >
          <Main
            pokemons={pokemons}
            isLoading={isLoading}
            error={error}
            onCardClick={handleCardClick}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelectedItem}
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
        <Outlet />
      </div>
    </>
  );
};

export default HomePage;
