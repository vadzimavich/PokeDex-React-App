import type { ReactNode } from 'react';
import '../globals.css';
import Providers from '../providers';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Pokedex App',
  description: 'A Pokedex app built with Next.js',
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
