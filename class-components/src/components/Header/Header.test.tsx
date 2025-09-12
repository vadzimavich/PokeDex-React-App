import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderWithRouter } from '../../__tests__/test-utils';
import Header from './Header';

const mockSetSearchTerm = vi.fn();
vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: () => ['pikachu', mockSetSearchTerm], // Возвращаем начальное значение и мок-функцию
}));

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
  });

  it('should render navigation links, search input, and theme switcher', () => {
    renderWithRouter(<Header />);

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search.../i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('pikachu');

    expect(
      screen.getByRole('button', { name: /switch to light theme/i })
    ).toBeInTheDocument();
  });

  it('should call setSearchTerm and setSearchParams when a search is performed', async () => {
    const user = userEvent.setup();
    renderWithRouter(<Header />);

    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await user.clear(searchInput);
    await user.type(searchInput, 'charizard');
    await user.click(searchButton);

    expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
    expect(mockSetSearchTerm).toHaveBeenCalledWith('charizard');

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function));
  });
});
