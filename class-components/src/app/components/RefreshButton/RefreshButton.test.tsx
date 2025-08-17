import { render, screen } from '../../app/__tests__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RefreshButton from './RefreshButton';

describe('RefreshButton Component', () => {
  it('should call invalidateQueries on click', async () => {
    const queryClient = new QueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

    render(
      <QueryClientProvider client={queryClient}>
        <RefreshButton />
      </QueryClientProvider>
    );

    const button = screen.getByRole('button', { name: /refresh data/i });
    await userEvent.click(button);

    expect(invalidateQueriesSpy).toHaveBeenCalledTimes(1);
  });
});
