import { create } from 'zustand';
import type { PokemonDetails } from '../types';

interface SelectedItemsState {
  selectedPokemons: PokemonDetails[];
  toggleSelectedItem: (pokemon: PokemonDetails) => void;
  unselectAll: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
  // state
  selectedPokemons: [],

  // actions
  toggleSelectedItem: (pokemon) => {
    const currentSelected = get().selectedPokemons;
    const isSelected = currentSelected.some((p) => p.id === pokemon.id);

    if (isSelected) {
      set({
        selectedPokemons: currentSelected.filter((p) => p.id !== pokemon.id),
      });
    } else {
      set({ selectedPokemons: [...currentSelected, pokemon] });
    }
  },

  unselectAll: () => {
    set({ selectedPokemons: [] });
  },
}));
