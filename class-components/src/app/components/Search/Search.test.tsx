import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Search from './Search';

describe('Search Component', () => {
  const onSearchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the search input and button', () => {
    render(<Search onSearch={onSearchMock} initialValue="" />);

    // find input by placeholder
    expect(screen.getByPlaceholderText(/search.../i)).toBeInTheDocument();
    // find button by role and text
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should update the input value when the user types', async () => {
    const user = userEvent.setup();
    render(<Search onSearch={onSearchMock} initialValue="" />);
    const input = screen.getByPlaceholderText(/search.../i);

    // simulate user input (async)
    await user.type(input, 'pikachu');

    // check input field for value change
    expect(input).toHaveValue('pikachu');
  });

  it('should call onSearch with the trimmed value when the button is clicked', async () => {
    const user = userEvent.setup();
    render(<Search onSearch={onSearchMock} initialValue="" />);
    const input = screen.getByPlaceholderText(/search.../i);
    const button = screen.getByRole('button', { name: /search/i });

    // simulate input w/ spaces
    await user.type(input, '  ditto  ');
    // simulate button click
    await user.click(button);

    // check - mock function called once
    expect(onSearchMock).toHaveBeenCalledTimes(1);
    // check - spaces cleaned
    expect(onSearchMock).toHaveBeenCalledWith('ditto');
  });

  it('should display the initial value passed via props', () => {
    render(<Search onSearch={onSearchMock} initialValue="charmander" />);

    // check search input field
    expect(screen.getByPlaceholderText(/search.../i)).toHaveValue('charmander');
  });
});
