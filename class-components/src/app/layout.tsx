import type { ReactNode } from 'react';
import './globals.css';

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: 'Pokedex App',
  description: 'A Pokedex app built with Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
