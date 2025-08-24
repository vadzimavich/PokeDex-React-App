import type { ReactNode } from 'react';
import { getMessages } from 'next-intl/server';
import Providers from '../providers';
import Header from '@/app/components/Header/Header';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Pokedex App',
  description: 'A Pokedex app built with Next.js',
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <Providers locale={locale} messages={messages}>
      <Header />
      <main>{children}</main>
      <div id="modal-root"></div>
    </Providers>
  );
}
