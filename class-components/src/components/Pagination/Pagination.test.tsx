import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Pagination from './Pagination';

describe('Pagination Component', () => {
  const onPrevMock = vi.fn();
  const onNextMock = vi.fn();

  it('should render current and total pages', () => {
    render(
      <Pagination
        onPrev={onPrevMock}
        onNext={onNextMock}
        hasPrev={true}
        hasNext={true}
        currentPage={5}
        totalPages={10}
      />
    );
    expect(screen.getByText('Page 5 of 10')).toBeInTheDocument();
  });

  it('should disable the "Prev" button when hasPrev is false', () => {
    render(
      <Pagination
        onPrev={onPrevMock}
        onNext={onNextMock}
        hasPrev={false}
        hasNext={true}
        currentPage={1}
        totalPages={10}
      />
    );
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('should disable the "Next" button when hasNext is false', () => {
    render(
      <Pagination
        onPrev={onPrevMock}
        onNext={onNextMock}
        hasPrev={true}
        hasNext={false}
        currentPage={10}
        totalPages={10}
      />
    );
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
  });

  it('should call onPrev when the "Prev" button is clicked', async () => {
    render(
      <Pagination
        onPrev={onPrevMock}
        onNext={onNextMock}
        hasPrev={true}
        hasNext={true}
        currentPage={5}
        totalPages={10}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(onPrevMock).toHaveBeenCalledTimes(1);
  });

  it('should call onNext when the "Next" button is clicked', async () => {
    render(
      <Pagination
        onPrev={onPrevMock}
        onNext={onNextMock}
        hasPrev={true}
        hasNext={true}
        currentPage={5}
        totalPages={10}
      />
    );
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onNextMock).toHaveBeenCalledTimes(1);
  });
});
