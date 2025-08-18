import { render, screen } from '@/app/__tests__/test-utils';
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
        totalPagesText="Page 1 of 10"
        prevText="← Prev"
        nextText="Next →"
      />
    );
    const nextButton = screen.getByRole('button', { name: /next →/i });
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
        totalPagesText="Page 2 of 10"
        prevText="← Prev"
        nextText="Next →"
      />
    );
    const prevButton = screen.getByRole('button', { name: /← prev/i });
    await userEvent.click(prevButton);
    expect(mockOnPrev).toHaveBeenCalledTimes(1);
  });
});
