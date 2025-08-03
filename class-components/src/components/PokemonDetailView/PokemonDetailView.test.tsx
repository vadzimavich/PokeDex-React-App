import { http, HttpResponse } from 'msw';
import { render, screen } from '../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { server } from '../../__tests__/server';
import PokemonDetailView from './PokemonDetailView';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('PokemonDetailView Component', () => {
  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks();
  });

  const renderComponent = (initialRoute: string) => {
    return render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/details/:pokemonId" element={<PokemonDetailView />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('should display loading state initially', () => {
    renderComponent('/details/1');
    expect(screen.getByText(/loading details.../i)).toBeInTheDocument();
  });

  it('should fetch and display pokemon details', async () => {
    renderComponent('/details/1');
    expect(
      await screen.findByRole('heading', { name: /bulbasaur #001/i })
    ).toBeInTheDocument();
  });

  it('should display a generic error message if fetching data fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/1', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    renderComponent('/details/1');
    expect(
      await screen.findByText(/error: failed to fetch pokemon: 500/i)
    ).toBeInTheDocument();
  });

  it('should call navigate when close button is clicked', async () => {
    renderComponent('/details/1?page=2');
    const closeButton = await screen.findByRole('button', { name: /×/i });
    await userEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
  });
});
