import { render, screen } from '../../__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const mockOnNext = vi.fn();
  const mockOnPrev = vi.fn();

  it('should call onNext when next button is clicked', async () => {
    render(
      <Pagination
        onNext={mockOnNext}
        onPrev={mockOnPrev}
        hasNext={true}
        hasPrev={false}
        currentPage={1}
        totalPages={10}
      />
    );
    const nextButton = screen.getByRole('button', { name: /next/i });
    await userEvent.click(nextButton);
    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should call onPrev when prev button is clicked', async () => {
    render(
      <Pagination
        onNext={mockOnNext}
        onPrev={mockOnPrev}
        hasNext={true}
        hasPrev={true}
        currentPage={2}
        totalPages={10}
      />
    );
    const prevButton = screen.getByRole('button', { name: /prev/i });
    await userEvent.click(prevButton);
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });
});
