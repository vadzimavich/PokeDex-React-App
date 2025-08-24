import { render, screen, waitFor } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import RHFForm from './RHFForm';
import React from 'react';

interface MockAutocompleteProps {
  value?: string;
  onChange?: (value: string) => void;
  id: string;
  name: string;
}

vi.mock('../Autocomplete/Autocomplete', () => ({
  default: ({ value, onChange, id, name }: MockAutocompleteProps) => (
    <input
      value={value || ''}
      onChange={(e) => onChange?.(e.target.value)}
      data-testid="autocomplete-input"
      id={id}
      name={name}
    />
  ),
}));

describe('RHFForm Component', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  it('should render all fields and have submit button disabled initially', () => {
    render(<RHFForm onSubmit={mockOnSubmit} />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('should show validation error as user types invalid data', async () => {
    render(<RHFForm onSubmit={mockOnSubmit} />);
    const nameInput = screen.getByLabelText(/name/i);
    await user.type(nameInput, 'john');
    const errorMessage = await screen.findByText(
      'Name must start with a capital letter.'
    );
    expect(errorMessage).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
  });

  it('should remove validation error as user corrects the data', async () => {
    render(<RHFForm onSubmit={mockOnSubmit} />);
    const nameInput = screen.getByLabelText(/name/i);

    await user.type(nameInput, 'john');
    const errorMessage = await screen.findByText(
      'Name must start with a capital letter.'
    );
    expect(errorMessage).toBeInTheDocument();

    await user.clear(nameInput);
    await user.type(nameInput, 'John');

    await waitFor(() => {
      expect(
        screen.queryByText('Name must start with a capital letter.')
      ).not.toBeInTheDocument();
    });
  });

  it('should enable submit button only when form is valid', async () => {
    render(<RHFForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    await user.type(screen.getByLabelText(/name/i), 'John');
    await user.type(screen.getByLabelText(/age/i), '30');
    await user.type(screen.getByLabelText(/email/i), 'john.doe@example.com');
    await user.type(screen.getByLabelText(/^password/i), 'Password123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await user.selectOptions(screen.getByLabelText(/gender/i), 'male');
    await user.type(screen.getByTestId('autocomplete-input'), 'USA');
    await user.upload(screen.getByLabelText(/profile picture/i), file);
    await user.click(screen.getByLabelText(/i accept the terms/i));

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'John',
        age: 30,
        email: 'john.doe@example.com',
        password: 'Password123!',
        gender: 'male',
        country: 'USA',
        terms: true,
        picture: expect.any(String),
      });
    });
  });
});
