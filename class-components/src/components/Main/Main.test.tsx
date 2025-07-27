import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Main from './Main';
import type { PokemonDetails } from '../../types';

describe('Main Component', () => {
  it('should render skeletons when loading', () => {
    render(
      <Main
        pokemons={[]}
        isLoading={true}
        error={null}
        onCardClick={() => {}}
      />
    );
    expect(screen.getAllByTestId('skeleton-card').length).toBeGreaterThan(0);
  });

  it('should render an error message if an error is provided', () => {
    const error = new Error('Failed to fetch');
    render(
      <Main
        pokemons={[]}
        isLoading={false}
        error={error}
        onCardClick={() => {}}
      />
    );
    expect(screen.getByText(/error: failed to fetch/i)).toBeInTheDocument();
  });

  it('should render a card list when data is available', () => {
    const mockPokemons: PokemonDetails[] = [
      {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        sprites: {
          other: { 'official-artwork': { front_default: 'image.png' } },
        },
        types: [{ type: { name: 'grass' } }],
        description: 'A grass pokemon',
        species: { url: 'https://pokeapi.co/api/v2/pokemon-species/1/' },
        stats: [],
        abilities: [],
      },
    ];

    render(
      <Main
        pokemons={mockPokemons}
        isLoading={false}
        error={null}
        onCardClick={() => {}}
      />
    );
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });
});
