import { create } from 'zustand';

type FormType = 'uncontrolled' | 'rhf' | null;

interface FormState {
  isModalOpen: boolean;
  modalContent: FormType;
  openModal: (content: FormType) => void;
  closeModal: () => void;
}

export const useFormStore = create<FormState>((set) => ({
  isModalOpen: false,
  modalContent: null,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),
}));
