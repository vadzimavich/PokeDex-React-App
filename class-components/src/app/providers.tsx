'use client';

import { type ReactNode } from 'react';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

type ProvidersProps = {
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
};

export default function Providers({
  children,
  locale,
  messages,
}: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider>{children}</ThemeProvider>
    </NextIntlClientProvider>
  );
}
