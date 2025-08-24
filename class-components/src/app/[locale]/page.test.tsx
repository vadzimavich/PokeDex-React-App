import { render, screen, act } from '@/app/__tests__/test-utils';
import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import HomePage from './page';
import { useFormStore, type StoredFormData } from '../store/formStore';

const initialStoreState = useFormStore.getState();

describe('HomePage Component', () => {
  beforeEach(() => {
    act(() => {
      useFormStore.setState(initialStoreState);
    });
  });

  it('should render initial state with no data', () => {
    render(<HomePage />);
    expect(screen.getByText('Submitted Data:')).toBeInTheDocument();
    expect(screen.getByText('No data submitted yet.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open uncontrolled form/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open react hook form/i })
    ).toBeInTheDocument();
  });

  it('should open the uncontrolled form modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const uncontrolledButton = screen.getByRole('button', {
      name: /open uncontrolled form/i,
    });
    await user.click(uncontrolledButton);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Uncontrolled Form' })
    ).toBeInTheDocument();
  });

  it('should open the RHF form modal when button is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const rhfButton = screen.getByRole('button', {
      name: /open react hook form/i,
    });
    await user.click(rhfButton);

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'React Hook Form' })
    ).toBeInTheDocument();
  });

  it('should display submitted data from the store', () => {
    const mockFormData: StoredFormData[] = [
      {
        id: '1',
        name: 'John Doe',
        age: 30,
        email: 'john@test.com',
        country: 'USA',
        gender: 'male',
        picture: '',
        password: 'password123',
        terms: true,
      },
      {
        id: '2',
        name: 'Jane Doe',
        age: 25,
        email: 'jane@test.com',
        country: 'Canada',
        gender: 'female',
        picture: '',
        password: 'password456',
        terms: true,
      },
    ];

    act(() => {
      useFormStore.setState({ formData: mockFormData });
    });

    render(<HomePage />);

    expect(
      screen.queryByText('No data submitted yet.')
    ).not.toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 4 })).toHaveLength(2);
  });
});
