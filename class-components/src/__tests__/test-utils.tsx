import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { type ReactElement } from 'react';
import type { PokemonDetails } from '../types';

export const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    ),
  });
};

export const createPokemonDetailsMock = (
  id: number,
  name: string
): Partial<PokemonDetails> => ({
  id,
  name,
  species: { url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
  sprites: { other: { 'official-artwork': { front_default: 'image.png' } } },
  types: [],
  stats: [],
  abilities: [],
  height: 10,
  weight: 100,
});
