import {
  useSearchParams,
  useNavigate,
  useLocation,
  Outlet,
  useOutlet,
} from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { usePokemons } from '../hooks/usePokemons';
import Main from '../components/Main/Main';
import Pagination from '../components/Pagination/Pagination';
import Header from '../components/Header/Header';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useLocalStorage('searchTerm', '');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const outlet = useOutlet();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const { pokemons, isLoading, error, nextPageUrl, prevPageUrl, totalPages } =
    usePokemons(currentPage, searchTerm);

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

  const showPagination = !searchTerm && !error && pokemons.length > 1;

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
