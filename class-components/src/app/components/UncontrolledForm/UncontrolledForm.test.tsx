import { render, screen, waitFor } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import UncontrolledForm from './UncontrolledForm';
import React from 'react';

vi.mock('../Autocomplete/Autocomplete', () => ({
  default: ({
    id,
    name,
    inputRef,
  }: {
    id: string;
    name: string;
    inputRef: React.Ref<HTMLInputElement>;
  }) => (
    <input
      ref={inputRef}
      data-testid="autocomplete-input"
      id={id}
      name={name}
    />
  ),
}));

describe('UncontrolledForm Component', () => {
  const mockOnSubmit = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show validation errors on submit with empty fields', async () => {
    render(<UncontrolledForm onSubmit={mockOnSubmit} />);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Age is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(
      screen.getByText('Please confirm your password.')
    ).toBeInTheDocument();
    expect(screen.getByText('Country is required.')).toBeInTheDocument();
    expect(
      screen.getByText('Profile picture is required.')
    ).toBeInTheDocument();

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with correct data when form is valid', async () => {
    render(<UncontrolledForm onSubmit={mockOnSubmit} />);

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

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });
});
