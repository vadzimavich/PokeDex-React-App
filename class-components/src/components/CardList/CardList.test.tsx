import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardList from './CardList';
import { createPokemonDetailsMock } from '../../__tests__/test-utils';

vi.mock('../Card/Card', () => ({
  default: ({ pokemon }: { pokemon: { name: string } }) => (
    <div>Mock Card: {pokemon.name}</div>
  ),
}));

describe('CardList Component', () => {
  it('should render "No Pokemon found." when the pokemons array is empty', () => {
    render(<CardList pokemons={[]} onCardClick={() => {}} />);
    expect(screen.getByText('No Pokemon found.')).toBeInTheDocument();
  });

  it('should render a list of cards when pokemons array is not empty', () => {
    const mockPokemons = [
      createPokemonDetailsMock(1, 'bulbasaur'),
      createPokemonDetailsMock(2, 'ivysaur'),
    ];

    render(<CardList pokemons={mockPokemons} onCardClick={() => {}} />);
    expect(screen.getByText('Mock Card: bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Mock Card: ivysaur')).toBeInTheDocument();
    expect(screen.queryByText('No Pokemon found.')).not.toBeInTheDocument();
  });
});
