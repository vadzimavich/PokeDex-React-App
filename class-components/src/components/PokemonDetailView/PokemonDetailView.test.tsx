import { http, HttpResponse } from 'msw';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { server } from '../../__tests__/server';
import PokemonDetailView from './PokemonDetailView';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderDetailView = (initialRoute: string) => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/details/:pokemonId" element={<PokemonDetailView />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('PokemonDetailView Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as vi.Mock).mockReturnValue(mockNavigate);
    server.resetHandlers();
  });

  it('should display loading state initially', () => {
    renderDetailView('/details/1');
    expect(screen.getByText(/loading details.../i)).toBeInTheDocument();
  });

  it('should fetch and display pokemon details', async () => {
    renderDetailView('/details/1');
    expect(
      await screen.findByRole('heading', { name: /bulbasaur #001/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/this is a test description for bulbasaur/i)
    ).toBeInTheDocument();
  });

  it('should call navigate to root when no query params exist', async () => {
    renderDetailView('/details/1');
    const closeButton = await screen.findByRole('button', { name: /×/i });
    await userEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should call navigate and preserve query params', async () => {
    renderDetailView('/details/1?page=2');
    const closeButton = await screen.findByRole('button', { name: /×/i });
    await userEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/?page=2');
  });

  it('should display a generic error message if fetching data fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/1', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderDetailView('/details/1');

    const errorMessage = await screen.findByText(
      /error: failed to fetch pokemon: 500/i
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
