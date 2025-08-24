import { create } from 'zustand';
import type { FormValues } from '../lib/schema';

export type StoredFormData = Omit<FormValues, 'confirmPassword' | 'picture'> & {
  picture: string;
};

type FormType = 'uncontrolled' | 'rhf' | null;

interface FormState {
  isModalOpen: boolean;
  modalContent: FormType;
  formData: StoredFormData[];
  openModal: (content: FormType) => void;
  closeModal: () => void;
  addFormData: (data: StoredFormData) => void;
}

export const useFormStore = create<FormState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  formData: [],
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
  addFormData: (data) =>
    set((state) => ({ formData: [...state.formData, data] })),
}));
