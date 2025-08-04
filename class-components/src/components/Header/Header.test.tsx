import { render, screen } from '../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';

const mockSetSearchParams = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: () => [new URLSearchParams(), mockSetSearchParams],
  };
});

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: () => ['bulbasaur', vi.fn()],
}));

describe('Header Component', () => {
  it('should call setSearchParams on search', async () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, 'pikachu');
    await userEvent.click(searchButton);

    expect(mockSetSearchParams).toHaveBeenCalledTimes(1);
  });
});
