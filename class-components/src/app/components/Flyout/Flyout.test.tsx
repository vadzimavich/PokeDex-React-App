import { render, screen, act } from '@/app/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flyout from './Flyout';
import { useSelectedItemsStore } from '@/app/store/selectedItemsStore';
import * as actions from '@/app/actions';
import type { PokemonDetails } from '@/app/types';

vi.mock('@/app/actions', async (importOriginal) => {
  const actual = await importOriginal<typeof actions>();
  return {
    ...actual,
    downloadCsvAction: vi.fn().mockResolvedValue({ csvData: 'mock,csv,data' }),
  };
});

const mockPokemon1: PokemonDetails = {
  id: 1,
  name: 'Pikachu',
  height: 4,
  weight: 60,
  sprites: { other: { 'official-artwork': { front_default: '' } } },
  types: [{ type: { name: 'electric' } }],
  description: 'Pikachu desc',
  species: { url: '' },
  stats: [],
  abilities: [],
};

const mockPokemon2: PokemonDetails = {
  id: 2,
  name: 'Charmander',
  height: 6,
  weight: 85,
  sprites: { other: { 'official-artwork': { front_default: '' } } },
  types: [{ type: { name: 'fire' } }],
  description: 'Charmander desc',
  species: { url: '' },
  stats: [],
  abilities: [],
};

describe('Flyout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    act(() => {
      useSelectedItemsStore.setState({ selectedPokemons: [] });
    });
  });

  it('should not render if no items are selected', () => {
    const { container } = render(<Flyout />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render correctly when items are selected', () => {
    act(() => {
      useSelectedItemsStore.setState({
        selectedPokemons: [mockPokemon1, mockPokemon2],
      });
    });

    render(<Flyout />);
    expect(screen.getByText(/2 items selected/i)).toBeInTheDocument();
  });

  it('should call unselectAll when the button is clicked', async () => {
    act(() => {
      useSelectedItemsStore.setState({
        selectedPokemons: [mockPokemon1],
      });
    });
    render(<Flyout />);

    const unselectButton = screen.getByRole('button', {
      name: /unselect all/i,
    });
    await userEvent.click(unselectButton);

    expect(useSelectedItemsStore.getState().selectedPokemons).toHaveLength(0);
  });

  it('should call downloadCsvAction when the button is clicked', async () => {
    const mockPokemons = [mockPokemon1];
    act(() => {
      useSelectedItemsStore.setState({ selectedPokemons: mockPokemons });
    });
    render(<Flyout />);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await userEvent.click(downloadButton);

    expect(actions.downloadCsvAction).toHaveBeenCalledWith(mockPokemons);
  });
});
