import { render, screen, act } from '../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Flyout from './Flyout';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import type { PokemonDetails } from '../../types';

const mockPokemon = { id: 1, name: 'Bulbasaur' } as PokemonDetails;

describe('Flyout Component', () => {
  it('should not render if no items are selected', () => {
    const { container } = render(<Flyout />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render correctly when items are selected', () => {
    act(() => {
      useSelectedItemsStore.getState().toggleSelectedItem(mockPokemon);
    });
    render(<Flyout />);
    expect(screen.getByText('1 item selected')).toBeInTheDocument();
  });

  it('should call unselectAll from the store when the button is clicked', async () => {
    const unselectAllSpy = vi.spyOn(
      useSelectedItemsStore.getState(),
      'unselectAll'
    );

    act(() => {
      useSelectedItemsStore.getState().toggleSelectedItem(mockPokemon);
    });

    render(<Flyout />);
    const unselectButton = screen.getByRole('button', {
      name: /unselect all/i,
    });
    await userEvent.click(unselectButton);
    expect(unselectAllSpy).toHaveBeenCalledTimes(1);
  });
});
