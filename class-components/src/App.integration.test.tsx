import { screen, render } from './__tests__/test-utils';
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
});
