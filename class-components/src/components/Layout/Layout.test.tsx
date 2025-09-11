import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithRouter } from '../../__tests__/test-utils';
import Layout from './Layout';

describe('Layout Component', () => {
  it('should render navigation links and an outlet', () => {
    renderWithRouter(<Layout />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');

    const aboutLink = screen.getByRole('link', { name: /about/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });
});
