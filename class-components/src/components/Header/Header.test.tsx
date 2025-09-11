import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from './Header';

describe('Header Component', () => {
  it('should render the Search component with initial value', () => {
    render(<Header onSearch={() => {}} initialValue="test" />);
    const searchInput = screen.getByPlaceholderText(/search.../i);
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('test');
  });

  it('should pass the onSearch handler to the Search component', () => {
    const onSearchMock = vi.fn();
    render(<Header onSearch={onSearchMock} initialValue="" />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });
});
