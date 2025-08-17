import { act, renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useSelectedItemsStore } from './selectedItemsStore';
import type { PokemonDetails } from '../types';

const mockPokemon1 = { id: 1, name: 'Bulbasaur' } as PokemonDetails;
const mockPokemon2 = { id: 2, name: 'Ivysaur' } as PokemonDetails;

describe('useSelectedItemsStore', () => {
  it('should add an item to selection', () => {
    const { result } = renderHook(() => useSelectedItemsStore());
    act(() => result.current.toggleSelectedItem(mockPokemon1));
    expect(result.current.selectedPokemons).toEqual([mockPokemon1]);
  });

  it('should remove an item if it is already selected', () => {
    const { result } = renderHook(() => useSelectedItemsStore());
    act(() => result.current.toggleSelectedItem(mockPokemon1));
    act(() => result.current.toggleSelectedItem(mockPokemon1)); // toggle again
    expect(result.current.selectedPokemons).toEqual([]);
  });

  it('should unselect all items', () => {
    const { result } = renderHook(() => useSelectedItemsStore());
    act(() => result.current.toggleSelectedItem(mockPokemon1));
    act(() => result.current.toggleSelectedItem(mockPokemon2));
    act(() => result.current.unselectAll());
    expect(result.current.selectedPokemons).toEqual([]);
  });
});
