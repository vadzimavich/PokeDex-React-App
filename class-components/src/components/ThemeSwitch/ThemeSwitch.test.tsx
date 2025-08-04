import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeContext, type ThemeContextType } from '../../contexts/theme';
import ThemeSwitch from './ThemeSwitch';

const renderWithTheme = (contextValue: ThemeContextType) => {
  return render(
    <ThemeContext.Provider value={contextValue}>
      <ThemeSwitch />
    </ThemeContext.Provider>
  );
};

describe('ThemeSwitch Component', () => {
  it('should display sun icon for dark theme', () => {
    renderWithTheme({ theme: 'dark', toggleTheme: () => {} });
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to light theme'
    );
  });

  it('should display moon icon for light theme', () => {
    renderWithTheme({ theme: 'light', toggleTheme: () => {} });
    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Switch to dark theme'
    );
  });

  it('should call toggleTheme on click', async () => {
    const toggleThemeMock = vi.fn();
    renderWithTheme({ theme: 'dark', toggleTheme: toggleThemeMock });

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(toggleThemeMock).toHaveBeenCalledTimes(1);
  });
});
