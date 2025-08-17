import {
  useSearchParams,
  useNavigate,
  useLocation,
  Outlet,
  useOutlet,
} from 'react-router-dom';
import { useSearchStore } from '../store/searchStore';
import { useSelectedItemsStore } from '../store/selectedItemsStore';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getPokemonList, getPokemonFullDetails } from '../api/pokemonService';

import Main from '../../components/Main/Main';
import Pagination from '../../components/Pagination/Pagination';

const POKEMON_PER_PAGE = 20;

const HomePage = () => {
  const { searchTerm } = useSearchStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const { selectedPokemons, toggleSelectedItem } = useSelectedItemsStore();
  const selectedIds = new Set(selectedPokemons.map((p) => p.id));

  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const queryKey = searchTerm
    ? ['pokemonSearch', searchTerm]
    : ['pokemons', currentPage];

  const queryFn = async () => {
    if (searchTerm) {
      const pokemon = await getPokemonFullDetails(searchTerm.toLowerCase());
      return {
        pokemons: [pokemon],
        next: null,
        previous: null,
        count: 1,
      };
    }
    const offset = (currentPage - 1) * POKEMON_PER_PAGE;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`;
    return getPokemonList(url);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
  });

  const pokemons = data?.pokemons || [];
  const nextPageUrl = data?.next;
  const prevPageUrl = data?.previous;
  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / POKEMON_PER_PAGE);

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

  const showPagination = !searchTerm && !isError;

  return (
    <>
      <div style={{ display: 'flex' }}>
        <div
          style={{ flex: 1, minWidth: 0 }}
          onClick={outlet ? closeDetails : undefined}
          data-testid="main-panel"
        >
          <Main
            pokemons={pokemons}
            isLoading={isLoading}
            error={isError ? (error as Error) : null}
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
