import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithRouter } from '../__tests__/test-utils';
import AboutPage from './AboutPage';

describe('AboutPage Component', () => {
  it('should render the about page content correctly', () => {
    renderWithRouter(<AboutPage />);

    expect(
      screen.getByRole('heading', { name: /about pokedex/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/this application was created by @vadzimavich/i)
    ).toBeInTheDocument();

    const courseLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });
    expect(courseLink).toBeInTheDocument();
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs'
    );

    expect(
      screen.getByRole('link', { name: /back to home/i })
    ).toBeInTheDocument();
  });
});
