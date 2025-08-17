import { renderWithRouter, screen } from '../../app/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from './Header';
import { useSearchStore } from '../../app/store/searchStore';

const mockSetSearchParams = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useSearchStore.setState({
      searchTerm: '',
      setSearchTerm: useSearchStore.getState().setSearchTerm,
    });
  });

  it('should call setSearchTerm and setSearchParams on search', async () => {
    const setSearchTermSpy = vi.spyOn(
      useSearchStore.getState(),
      'setSearchTerm'
    );

    renderWithRouter(<Header />);

    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'pikachu');
    await userEvent.click(searchButton);

    expect(setSearchTermSpy).toHaveBeenCalledWith('pikachu');
    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
  });
});
