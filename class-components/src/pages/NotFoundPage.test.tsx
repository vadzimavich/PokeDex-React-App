import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithRouter } from '../__tests__/test-utils';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage Component', () => {
  it('should render the 404 page content correctly', () => {
    renderWithRouter(<NotFoundPage />);

    expect(
      screen.getByRole('heading', { name: /404 - page not found/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/oops! the page you are looking for does not exist/i)
    ).toBeInTheDocument();

    const homeLink = screen.getByRole('link', {
      name: /go back to the home page/i,
    });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
