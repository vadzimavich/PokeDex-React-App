import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SearchState {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchTerm: '',
      setSearchTerm: (term) => set({ searchTerm: term }),
    }),
    {
      name: 'searchTerm-storage', // Имя ключа в localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);
