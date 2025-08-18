import { render, screen } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { server } from '@/app/__tests__/server';
import { http, HttpResponse } from 'msw';
import HomePage from './page';
import type { HomePageClientProps } from '@/app/components/HomePageClient/HomePageClient';

vi.mock('@/app/components/HomePageClient/HomePageClient', () => ({
  default: (props: HomePageClientProps) => (
    <div data-testid="homepage-client" data-props={JSON.stringify(props)} />
  ),
}));

describe('HomePage (Server Component)', () => {
  it('should fetch initial list data when no search term is provided', async () => {
    const PagePromise = HomePage({ searchParams: {} });
    render(await PagePromise);

    const clientComponent = screen.getByTestId('homepage-client');
    const props = JSON.parse(
      clientComponent.getAttribute('data-props') || '{}'
    );

    expect(props.initialData.pokemons[0].name).toBe('bulbasaur');
    expect(props.searchTerm).toBe('');
    expect(props.currentPage).toBe(1);
  });

  it('should fetch specific pokemon data when a search term is provided', async () => {
    const PagePromise = HomePage({ searchParams: { search: 'ivysaur' } });
    render(await PagePromise);

    const clientComponent = screen.getByTestId('homepage-client');
    const props = JSON.parse(
      clientComponent.getAttribute('data-props') || '{}'
    );

    expect(props.initialData.pokemons[0].name).toBe('ivysaur');
    expect(props.searchTerm).toBe('ivysaur');
    expect(props.initialData.count).toBe(1);
  });

  it('should handle API errors gracefully', async () => {
    server.use(
      http.get('https://pokeapi.co/api/v2/pokemon', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const PagePromise = HomePage({ searchParams: {} });
    render(await PagePromise);

    const clientComponent = screen.getByTestId('homepage-client');
    const props = JSON.parse(
      clientComponent.getAttribute('data-props') || '{}'
    );

    expect(props.initialData).toBeNull();
    expect(props.initialError).not.toBeNull();
    expect(props.initialError.message).toContain(
      'Network response was not ok: 500'
    );
  });
});
