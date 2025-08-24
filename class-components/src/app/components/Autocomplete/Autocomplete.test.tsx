import { render, screen, fireEvent } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Autocomplete from './Autocomplete';

const suggestions = ['United States', 'United Kingdom', 'Canada', 'Australia'];

describe('Autocomplete Component', () => {
  it('should render an input field', () => {
    render(
      <Autocomplete suggestions={suggestions} id="country" name="country" />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should show filtered suggestions when user types', async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete suggestions={suggestions} id="country" name="country" />
    );
    const input = screen.getByRole('textbox');

    await user.type(input, 'United');

    expect(await screen.findByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.queryByText('Canada')).not.toBeInTheDocument();
  });

  it('should call onChange and update input value when a suggestion is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    render(
      <Autocomplete
        suggestions={suggestions}
        id="country"
        name="country"
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');

    await user.type(input, 'Can');
    const suggestionItem = await screen.findByText('Canada');
    await user.click(suggestionItem);

    expect(input).toHaveValue('Canada');
    expect(mockOnChange).toHaveBeenCalledWith('Canada');
    expect(screen.queryByText('Canada')).not.toBeInTheDocument(); // Suggestions should hide
  });

  it('should hide suggestions when clicking outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Autocomplete suggestions={suggestions} id="country" name="country" />
        <button>Outside Button</button>
      </div>
    );
    const input = screen.getByRole('textbox');

    await user.type(input, 'Aus');
    expect(await screen.findByText('Australia')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Australia')).not.toBeInTheDocument();
  });
});
