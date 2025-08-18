/* eslint-disable react-refresh/only-export-components */

import { render, type RenderOptions } from '@testing-library/react';
import { type ReactElement, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import messages from '../../../messages/en.json';

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider>{children}</ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
