import { render, screen } from '../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

  const mockOnCardClick = vi.fn();
  const mockOnToggleSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when not selected', () => {
    render(
      <Card
        pokemon={mockPokemon}
        onCardClick={mockOnCardClick}
        isSelected={false}
        onToggleSelect={mockOnToggleSelect}
      />
    );
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    const checkbox = screen.getByLabelText(/select bulbasaur/i);
    expect(checkbox).not.toBeChecked();
  });

  it('should render correctly when selected', () => {
    render(
      <Card
        pokemon={mockPokemon}
        onCardClick={mockOnCardClick}
        isSelected={true}
        onToggleSelect={mockOnToggleSelect}
      />
    );
    const checkbox = screen.getByLabelText(/select bulbasaur/i);
    expect(checkbox).toBeChecked();
  });

  it('should call onCardClick when the card body is clicked', async () => {
    render(
      <Card
        pokemon={mockPokemon}
        onCardClick={mockOnCardClick}
        isSelected={false}
        onToggleSelect={mockOnToggleSelect}
      />
    );

    const clickableDiv = screen
      .getByText(/bulbasaur/i)
      .closest('div[style*="cursor: pointer"]');
    if (!clickableDiv) {
      throw new Error('Test failed: clickable card div not found');
    }
    await userEvent.click(clickableDiv);

    expect(mockOnCardClick).toHaveBeenCalledWith(mockPokemon.id);
    expect(mockOnToggleSelect).not.toHaveBeenCalled();
  });

  it('should call onToggleSelect when the checkbox is clicked', async () => {
    render(
      <Card
        pokemon={mockPokemon}
        onCardClick={mockOnCardClick}
        isSelected={false}
        onToggleSelect={mockOnToggleSelect}
      />
    );
    const checkbox = screen.getByLabelText(/select bulbasaur/i);
    await userEvent.click(checkbox);
    expect(mockOnToggleSelect).toHaveBeenCalledWith(mockPokemon);
    expect(mockOnCardClick).not.toHaveBeenCalled();
  });
});
