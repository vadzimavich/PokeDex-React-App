import { act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useFormStore, type StoredFormData, type Country } from './formStore';

const initialState = useFormStore.getState();

describe('useFormStore', () => {
  beforeEach(() => {
    act(() => {
      useFormStore.setState(initialState);
    });
  });

  it('should have the correct initial state', () => {
    const state = useFormStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.modalContent).toBe(null);
    expect(state.formData).toEqual([]);
    expect(state.countries).toEqual([]);
    expect(state.isLoadingCountries).toBe(false);
    expect(state.newlyAddedId).toBe(null);
  });

  it('should open the modal with specified content', () => {
    act(() => {
      useFormStore.getState().openModal('rhf');
    });
    const state = useFormStore.getState();
    expect(state.isModalOpen).toBe(true);
    expect(state.modalContent).toBe('rhf');
  });

  it('should close the modal', () => {
    act(() => {
      useFormStore.getState().openModal('uncontrolled');
    });
    act(() => {
      useFormStore.getState().closeModal();
    });
    const state = useFormStore.getState();
    expect(state.isModalOpen).toBe(false);
    expect(state.modalContent).toBe(null);
  });

  it('should add form data and set newlyAddedId', () => {
    const newFormData: Omit<StoredFormData, 'id'> = {
      name: 'John Doe',
      age: 30,
      email: 'john@john.com',
      password: 'Password123!',
      gender: 'male',
      terms: true,
      picture: 'base64string',
      country: 'USA',
    };

    act(() => {
      useFormStore.getState().addFormData(newFormData);
    });

    const state = useFormStore.getState();
    expect(state.formData).toHaveLength(1);
    expect(state.formData[0].name).toBe('John Doe');
    expect(state.formData[0].id).toBeDefined();
    expect(state.newlyAddedId).toBe(state.formData[0].id);
  });

  it('should clear the newlyAddedId', () => {
    act(() => {
      useFormStore.getState().addFormData({} as Omit<StoredFormData, 'id'>);
    });
    act(() => {
      useFormStore.getState().clearNewlyAddedId();
    });
    expect(useFormStore.getState().newlyAddedId).toBe(null);
  });

  describe('fetchCountries', () => {
    const mockCountries: Country[] = [
      { name: { common: 'Zimbabwe' } },
      { name: { common: 'Argentina' } },
    ];

    const fetchMock = vi.fn();
    global.fetch = fetchMock;

    beforeEach(() => {
      fetchMock.mockClear();
    });

    it('should fetch and sort countries successfully', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCountries,
      });

      const promise = act(async () => {
        await useFormStore.getState().fetchCountries();
      });

      expect(useFormStore.getState().isLoadingCountries).toBe(true);

      await promise;

      const state = useFormStore.getState();
      expect(state.isLoadingCountries).toBe(false);
      expect(state.countries).toHaveLength(2);
      expect(state.countries[0].name.common).toBe('Argentina');
      expect(state.countries[1].name.common).toBe('Zimbabwe');
    });

    it('should handle fetch failure gracefully', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false });

      await act(async () => {
        await useFormStore.getState().fetchCountries();
      });

      const state = useFormStore.getState();
      expect(state.isLoadingCountries).toBe(false);
      expect(state.countries).toEqual([]);
    });

    it('should not fetch countries if they are already loaded', async () => {
      act(() => {
        useFormStore.setState({ countries: mockCountries });
      });

      await act(async () => {
        await useFormStore.getState().fetchCountries();
      });

      expect(fetchMock).not.toHaveBeenCalled();
    });
  });
});
