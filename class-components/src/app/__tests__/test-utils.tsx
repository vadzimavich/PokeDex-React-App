/* eslint-disable react-refresh/only-export-components */
import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement } from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  testQueryClient.clear();
  return (
    <QueryClientProvider client={testQueryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AppProviders, ...options });

export const renderWithRouter = (ui: ReactElement, { route = '/' } = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <AppProviders>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </AppProviders>
    ),
  });
};

export * from '@testing-library/react';
export { customRender as render };
