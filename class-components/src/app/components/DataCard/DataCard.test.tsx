import { render, screen } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import DataCard from './DataCard';
import { type StoredFormData } from '@/app/store/formStore';
import styles from './DataCard.module.css';

const mockData: StoredFormData = {
  id: '1',
  name: 'Test User',
  age: 99,
  email: 'test@user.com',
  country: 'Testland',
  gender: 'other',
  picture: 'http://placekitten.com/200/300',
  password: 'a-secure-password',
  terms: true,
};

describe('DataCard Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render data correctly', () => {
    render(<DataCard data={mockData} isNew={false} onClearNew={() => {}} />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('Age: 99')).toBeInTheDocument();
    expect(screen.getByText('Email: test@user.com')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Test User' })).toBeInTheDocument();
  });

  it('should have "new" class when isNew is true', () => {
    render(<DataCard data={mockData} isNew={true} onClearNew={() => {}} />);
    const cardElement = screen.getByText('Test User').parentElement;

    expect(cardElement).toHaveClass(styles.new);
    expect(cardElement).toHaveClass(styles.card);
  });

  it('should call onClearNew after 3 seconds when isNew is true', () => {
    const mockOnClearNew = vi.fn();
    render(
      <DataCard data={mockData} isNew={true} onClearNew={mockOnClearNew} />
    );

    expect(mockOnClearNew).not.toHaveBeenCalled();
    vi.advanceTimersByTime(3000);
    expect(mockOnClearNew).toHaveBeenCalledTimes(1);
  });

  it('should not call onClearNew when isNew is false', () => {
    const mockOnClearNew = vi.fn();
    render(
      <DataCard data={mockData} isNew={false} onClearNew={mockOnClearNew} />
    );

    vi.advanceTimersByTime(3000);
    expect(mockOnClearNew).not.toHaveBeenCalled();
  });
});
