import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ProblemChild = () => {
  throw new Error('Test Error');
};

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.mocked(console.error).mockRestore();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child Component</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should render fallback UI when an error is thrown', () => {
    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/oops! something is wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/an unexpected error occurred/i)
    ).toBeInTheDocument();

    expect(console.error).toHaveBeenCalled();
  });
});
