import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';

import App from './App';
import { server } from './__tests__/server';

describe('App Component Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
  });

  it('should show skeleton, then render initial list of pokemons', async () => {
    render(<App />);

    // check - skeletons are visible due loading
    expect(await screen.findAllByTestId('skeleton-card')).toHaveLength(20);

    // wait till real cards appear
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    // check - skeletons disappear
    expect(screen.queryAllByTestId('skeleton-card')).toHaveLength(0);
  });

  it('should handle pagination correctly', async () => {
    render(<App />);

    // wait for initial loading
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();

    // find all 'next' buttons and simulate user click on first
    const nextButtons = screen.getAllByRole('button', { name: /next/i });
    await user.click(nextButtons[0]);

    // check - skeletons are visible
    expect(await screen.findAllByTestId('skeleton-card')).toHaveLength(20);

    // wait for mock loading (same list)
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
  });

  it('should perform a search and display the result', async () => {
    render(<App />);

    // wait for initial loading
    expect(await screen.findByText('ivysaur')).toBeInTheDocument();

    // find input and button
    const input = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // simulate user search
    await user.type(input, 'bulbasaur');
    await user.click(searchButton);

    // check - pagination disappear
    await waitFor(() => {
      expect(
        screen.queryByRole('button', { name: /next/i })
      ).not.toBeInTheDocument();
      expect(screen.queryByText('ivysaur')).not.toBeInTheDocument();
    });

    // check - card of searched pokemon is visible
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
  });

  it('should display an error message for a failed search', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/nonexistent', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    render(<App />);
    const input = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    // simulate non existent pokemon search
    await user.type(input, 'nonexistent');
    await user.click(searchButton);

    // check - error message appear
    expect(
      await screen.findByText(/pokemon "nonexistent" not found/i)
    ).toBeInTheDocument();
  });

  it('should load with a search term from localStorage', async () => {
    localStorage.setItem('searchTerm', 'bulbasaur');

    render(<App />);

    // check - loading searched pokemon
    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('ivysaur')).not.toBeInTheDocument();

    // check - searched name in input field
    expect(screen.getByPlaceholderText(/search.../i)).toHaveValue('bulbasaur');
  });
});
