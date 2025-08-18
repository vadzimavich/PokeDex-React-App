import { render, screen } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import Main from './Main';
import type { PokemonDetails } from '../../../app/types';

describe('Main Component', () => {
  const mockOnToggleSelect = vi.fn();
  const mockSelectedIds = new Set<number>();

  it('should render skeletons when loading', () => {
    render(
      <Main
        pokemons={[]}
        isLoading={true}
        error={null}
        onCardClick={() => {}}
        selectedIds={mockSelectedIds}
        onToggleSelect={mockOnToggleSelect}
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
        selectedIds={mockSelectedIds}
        onToggleSelect={mockOnToggleSelect}
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
          other: {
            'official-artwork': {
              front_default:
                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
            },
          },
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
        selectedIds={mockSelectedIds}
        onToggleSelect={mockOnToggleSelect}
      />
    );
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });
});
