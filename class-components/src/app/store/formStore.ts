import { create } from 'zustand';
import type { FormValues } from '../lib/schema';

export type StoredFormData = Omit<
  FormValues,
  'confirmPassword' | 'picture' | 'age'
> & {
  id: string;
  picture: string;
  age: number;
};

export interface Country {
  name: {
    common: string;
  };
}

type FormType = 'uncontrolled' | 'rhf' | null;

interface FormState {
  isModalOpen: boolean;
  modalContent: FormType;
  formData: StoredFormData[];
  countries: Country[];
  isLoadingCountries: boolean;
  newlyAddedId: string | null;
  openModal: (content: FormType) => void;
  closeModal: () => void;
  addFormData: (data: Omit<StoredFormData, 'id'>) => void;
  fetchCountries: () => Promise<void>;
  clearNewlyAddedId: () => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  isModalOpen: false,
  modalContent: null,
  formData: [],
  countries: [],
  isLoadingCountries: false,
  newlyAddedId: null,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  addFormData: (data) => {
    const newId = Date.now().toString();
    const newEntry: StoredFormData = { ...data, id: newId };
    set((state) => ({
      formData: [...state.formData, newEntry],
      newlyAddedId: newId,
    }));
  },
  fetchCountries: async () => {
    if (get().countries.length > 0 || get().isLoadingCountries) {
      return;
    }
    set({ isLoadingCountries: true });
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name'
      );
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data: Country[] = await response.json();
      const sortedData = data.sort((a, b) =>
        a.name.common.localeCompare(b.name.common)
      );
      set({ countries: sortedData, isLoadingCountries: false });
    } catch (error) {
      console.error(error);
      set({ isLoadingCountries: false });
    }
  },
  clearNewlyAddedId: () => set({ newlyAddedId: null }),
}));
