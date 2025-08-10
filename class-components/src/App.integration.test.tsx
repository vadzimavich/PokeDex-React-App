import { screen, render, waitFor } from './__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as csvUtils from './utils/csvConverter';

vi.mock('./utils/csvConverter', async () => {
  const actual = await vi.importActual('./utils/csvConverter');
  return {
    ...actual,
    downloadCSV: vi.fn(),
  };
});

describe('App Integration Tests', () => {
  const user = userEvent.setup();

  const renderApp = () => {
    return render(<App />);
  };

  it('should select items, show flyout, and unselect all', async () => {
    renderApp();

    const bulbasaurCheckbox = await screen.findByLabelText(/select bulbasaur/i);
    await user.click(bulbasaurCheckbox);

    const flyout = await screen.findByText(/1 item selected/i);
    expect(flyout).toBeInTheDocument();

    const ivysaurCheckbox = await screen.findByLabelText(/select ivysaur/i);
    await user.click(ivysaurCheckbox);
    expect(await screen.findByText(/2 items selected/i)).toBeInTheDocument();

    const unselectAllButton = screen.getByRole('button', {
      name: /unselect all/i,
    });
    await user.click(unselectAllButton);

    expect(screen.queryByText(/items selected/i)).not.toBeInTheDocument();
    expect(bulbasaurCheckbox).not.toBeChecked();
    expect(ivysaurCheckbox).not.toBeChecked();
  });

  it('should call download function when download button is clicked', async () => {
    const downloadMock = vi.spyOn(csvUtils, 'downloadCSV');
    renderApp();

    const bulbasaurCheckbox = await screen.findByLabelText(/select bulbasaur/i);
    await user.click(bulbasaurCheckbox);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    await user.click(downloadButton);

    expect(downloadMock).toHaveBeenCalledTimes(1);
    expect(downloadMock).toHaveBeenCalledWith(
      expect.any(String),
      '1_pokemons.csv'
    );
  });

  it('should switch theme and save it to localStorage', async () => {
    renderApp();
    const themeSwitcher = await screen.findByRole('button', {
      name: /switch to light theme/i,
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    await user.click(themeSwitcher);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(localStorage.getItem('app-theme')).toBe('light');

    await user.click(themeSwitcher);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('should filter pokemons when searching and clear filter when search is cleared', async () => {
    renderApp();

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(await screen.findByText('ivysaur')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/search.../i);
    const searchButton = screen.getByRole('button', { name: /search/i });

    await userEvent.type(searchInput, 'ivysaur');
    await userEvent.click(searchButton);

    expect(await screen.findByText('ivysaur')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
    });

    expect(screen.queryByText(/page 1 of/i)).not.toBeInTheDocument();

    await userEvent.clear(searchInput);
    await userEvent.click(searchButton);

    expect(await screen.findByText('bulbasaur')).toBeInTheDocument();
    expect(await screen.findByText('ivysaur')).toBeInTheDocument();
    expect(await screen.findByText(/page 1 of/i)).toBeInTheDocument();
  });
});
