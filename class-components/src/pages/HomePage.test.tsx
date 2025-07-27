import { http, HttpResponse } from 'msw';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { server } from '../__tests__/server';
import { routes } from '../router';

const renderApp = (initialEntries: string[]) => {
  const router = createMemoryRouter(routes, {
    initialEntries,
  });
  render(<RouterProvider router={router} />);
};

describe('HomePage Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorage.clear();
    server.resetHandlers();
  });

  it('should open details view on card click and update URL', async () => {
    renderApp(['/']);
    const card = await screen.findByText('bulbasaur');

    const clickableCard = card.closest('div[style*="cursor: pointer"]');
    if (!clickableCard) throw new Error('Clickable card not found');
    await user.click(clickableCard);

    expect(
      await screen.findByRole('heading', { name: /bulbasaur #001/i })
    ).toBeInTheDocument();
  });

  it('should close details view when close button is clicked', async () => {
    renderApp(['/details/1']);

    const detailView = await screen.findByRole('heading', {
      name: /bulbasaur #001/i,
    });
    expect(detailView).toBeInTheDocument();

    const closeButton = screen.getByRole('button', { name: /×/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /bulbasaur #001/i })
      ).not.toBeInTheDocument();
    });
  });

  it('should close details view when clicking on the main panel', async () => {
    renderApp(['/details/1']);

    expect(
      await screen.findByRole('heading', { name: /bulbasaur #001/i })
    ).toBeInTheDocument();

    const mainPanel = screen.getByTestId('main-panel');
    await user.click(mainPanel);

    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: /bulbasaur #001/i })
      ).not.toBeInTheDocument();
    });
  });

  it('should navigate pages using pagination while details view is open', async () => {
    renderApp(['/details/1?page=1']);

    const mainPanel = screen.getByTestId('main-panel');
    const detailPanel = await screen.findByRole('complementary');
    expect(await within(mainPanel).findByText('bulbasaur')).toBeInTheDocument();

    const nextButton = within(mainPanel).getByRole('button', {
      name: /next →/i,
    });
    await userEvent.click(nextButton);

    const newPokemonInList = await within(mainPanel).findByText('charmander');
    expect(newPokemonInList).toBeInTheDocument();

    expect(within(mainPanel).queryByText('bulbasaur')).not.toBeInTheDocument();
    expect(
      within(detailPanel).getByRole('heading', { name: /bulbasaur #001/i })
    ).toBeInTheDocument();
  });

  it('should not close details view when pagination button is clicked', async () => {
    renderApp(['/details/1?page=1']);

    const detailView = await screen.findByRole('heading', {
      name: /bulbasaur #001/i,
    });

    const nextButton = (
      await screen.findAllByRole('button', { name: /next →/i })
    )[0];
    await user.click(nextButton);

    expect(detailView).toBeInTheDocument();
  });

  it('should fetch and display the correct page on initial load from URL', async () => {
    renderApp(['/?page=2']);

    expect(await screen.findByText('charmander')).toBeInTheDocument();
    expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
    expect(screen.getByText(/page 2 of/i)).toBeInTheDocument();
  });

  it('should navigate to the previous page on pagination click', async () => {
    renderApp(['/?page=2']);

    expect(await screen.findByText('charmander')).toBeInTheDocument();

    const prevButton = screen.getByRole('button', { name: /← prev/i });
    await userEvent.click(prevButton);

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('charmander')).not.toBeInTheDocument();
  });

  it('should display a single pokemon when searching', async () => {
    renderApp(['/']);
    expect(await screen.findByText('ivysaur')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'bulbasaur');
    await userEvent.click(searchButton);

    const card = await screen.findByText('bulbasaur');
    expect(card).toBeInTheDocument();

    expect(screen.queryByText('ivysaur')).not.toBeInTheDocument();
  });

  it('should display an error when searching for a non-existent pokemon', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/nonexistent', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    renderApp(['/']);
    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'nonexistent');
    await userEvent.click(searchButton);

    expect(
      await screen.findByText(/pokemon "nonexistent" not found/i)
    ).toBeInTheDocument();
  });

  it('should display an error if fetching the pokemon list fails', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    renderApp(['/']);

    expect(
      await screen.findByText(/error: network response was not ok: 500/i)
    ).toBeInTheDocument();
  });
});
