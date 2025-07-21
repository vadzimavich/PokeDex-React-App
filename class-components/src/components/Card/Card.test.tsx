import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import Card from './Card';
import type { PokemonDetails } from '../../types';

describe('Card Component', () => {
  const mockPokemon: PokemonDetails = {
    id: 1,
    name: 'bulbasaur',
    height: 7,
    weight: 69,
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://bulbasaur-image.png',
        },
      },
    },
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    description: 'A strange seed was planted on its back at birth.',
    species: { url: '' },
  };

  it('should render all pokemon details correctly', () => {
    render(<Card pokemon={mockPokemon} />);

    // check pokemon name
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();

    // check ID
    expect(screen.getByText('#001')).toBeInTheDocument();

    // check description
    expect(screen.getByText(/A strange seed was planted/i)).toBeInTheDocument();

    // check pic
    const image = screen.getByAltText(/bulbasaur/i);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://bulbasaur-image.png');

    // check features
    expect(screen.getByText(/Height: 0.7/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight: 6.9/i)).toBeInTheDocument();

    // check types
    expect(screen.getByText('grass')).toBeInTheDocument();
    expect(screen.getByText('poison')).toBeInTheDocument();
  });
});
