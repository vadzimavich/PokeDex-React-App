import { render, screen } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import PokemonDetailPage from './page';
import { server } from '@/app/__tests__/server';
import { http, HttpResponse } from 'msw';
import { generateMetadata } from './page';
import { type ReactNode } from 'react';

vi.mock('../../../../navigation', () => ({
  Link: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
}));

describe('PokemonDetailPage', () => {
  it('should render pokemon details correctly', async () => {
    const PagePromise = PokemonDetailPage({ params: { pokemonId: '1' } });
    render(await PagePromise);

    const heading = await screen.findByRole('heading', {
      name: /bulbasaur #001/i,
    });
    expect(heading).toBeInTheDocument();

    const description = await screen.findByText(
      /this is a test description for bulbasaur/i
    );
    expect(description).toBeInTheDocument();
  });

  it('should render a not found message on API error', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/999', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    const PagePromise = PokemonDetailPage({ params: { pokemonId: '999' } });
    render(await PagePromise);

    const heading = await screen.findByRole('heading', {
      name: /pokemon not found/i,
    });
    expect(heading).toBeInTheDocument();
  });
});

describe('generateMetadata', () => {
  it('should generate correct metadata on success', async () => {
    const metadata = await generateMetadata({ params: { pokemonId: '1' } });

    expect(metadata.title).toBe('Pokedex: bulbasaur');
    expect(metadata.description).toContain('This is a test description');
  });

  it('should generate fallback metadata on error', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon/999', () => {
        return new HttpResponse(null, { status: 404 });
      })
    );

    const metadata = await generateMetadata({ params: { pokemonId: '999' } });

    expect(metadata.title).toBe('Pokemon Not Found');
  });
});
