import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
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
    stats: [],
    abilities: [],
  };

  it('should render all pokemon details correctly', () => {
    render(<Card pokemon={mockPokemon} onCardClick={() => {}} />);

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

  it('should call onCardClick with pokemon id when clicked', async () => {
    const onCardClickMock = vi.fn();
    render(<Card pokemon={mockPokemon} onCardClick={onCardClickMock} />);

    const cardElement = screen
      .getByText(/bulbasaur/i)
      .closest('div[style*="cursor: pointer"]');
    if (!cardElement) throw new Error('Card element not found');

    await userEvent.click(cardElement);

    expect(onCardClickMock).toHaveBeenCalledTimes(1);
    // --- ИЗМЕНЕНИЕ: Проверяем вызов только с id ---
    expect(onCardClickMock).toHaveBeenCalledWith(mockPokemon.id);
  });
});
