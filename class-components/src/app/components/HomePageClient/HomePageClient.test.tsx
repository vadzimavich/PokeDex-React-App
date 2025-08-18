import { render, screen, fireEvent } from '@/app/__tests__/test-utils';
import { describe, it, expect, vi } from 'vitest';
import HomePageClient from './HomePageClient';
import type { PokemonDetails } from '@/app/types';
import * as ReactQuery from '@tanstack/react-query';

const mockUseQuery = vi.fn();
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactQuery>();
  return {
    ...actual,
    useQuery: (options: unknown) => mockUseQuery(options),
  };
});

const mockPush = vi.fn();
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
}));

const mockBulbasaur: PokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    other: {
      'official-artwork': {
        front_default: 'https://example.com/bulbasaur.png',
      },
    },
  },
  types: [{ type: { name: 'grass' } }],
  description: 'A strange seed was planted on its back.',
  species: { url: '' },
  stats: [],
  abilities: [],
};

const mockInitialData = {
  pokemons: [mockBulbasaur],
  next: 'next_url',
  previous: null,
  count: 100,
};

describe('HomePageClient', () => {
  it('should render loading state', () => {
    mockUseQuery.mockReturnValue({
      isLoading: true,
      data: undefined,
      isError: false,
    });
    render(
      <HomePageClient
        initialData={undefined}
        initialError={null}
        currentPage={1}
        searchTerm=""
      />
    );
    expect(screen.getAllByTestId('skeleton-card').length).toBeGreaterThan(0);
  });

  it('should render error state', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: undefined,
      isError: true,
      error: new Error('Failed to fetch'),
    });
    render(
      <HomePageClient
        initialData={undefined}
        initialError={null}
        currentPage={1}
        searchTerm=""
      />
    );
    expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
  });

  it('should render data correctly', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: mockInitialData,
      isError: false,
    });
    render(
      <HomePageClient
        initialData={mockInitialData}
        initialError={null}
        currentPage={1}
        searchTerm=""
      />
    );
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('should handle page change on next button click', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: mockInitialData,
      isError: false,
    });
    render(
      <HomePageClient
        initialData={mockInitialData}
        initialError={null}
        currentPage={1}
        searchTerm=""
      />
    );
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(mockPush).toHaveBeenCalledWith('/?page=2');
  });

  it('should navigate to details page on card click', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: mockInitialData,
      isError: false,
    });
    render(
      <HomePageClient
        initialData={mockInitialData}
        initialError={null}
        currentPage={1}
        searchTerm=""
      />
    );

    const cardElement = screen.getByText('bulbasaur');
    fireEvent.click(cardElement);

    expect(mockPush).toHaveBeenCalledWith('/details/1');
  });

  it('should use the correct queryKey when a search term is provided', () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: mockInitialData,
      isError: false,
    });
    render(
      <HomePageClient
        initialData={mockInitialData}
        initialError={null}
        currentPage={1}
        searchTerm="pikachu"
      />
    );

    expect(mockUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['pokemonSearch', 'pikachu'],
      })
    );
  });
});
