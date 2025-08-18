'use client';

import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '@/app/store/selectedItemsStore';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getPokemonList,
  getPokemonFullDetails,
} from '@/app/api/pokemonService';

import Main from '@/app/components/Main/Main';
import Pagination from '@/app/components/Pagination/Pagination';
import Flyout from '@/app/components/Flyout/Flyout';
import type { PokemonDetails } from '@/app/types';

const POKEMON_PER_PAGE = 20;

type InitialData =
  | {
      pokemons: PokemonDetails[];
      next: string | null;
      previous: string | null;
      count: number;
    }
  | null
  | undefined;

type SerializableError = {
  message: string;
};

interface HomePageClientProps {
  initialData: InitialData;
  initialError: SerializableError | null;
  currentPage: number;
  searchTerm: string;
}

export default function HomePageClient({
  initialData,
  initialError,
  currentPage,
  searchTerm,
}: HomePageClientProps) {
  const { selectedPokemons, toggleSelectedItem } = useSelectedItemsStore();
  const selectedIds = new Set(
    selectedPokemons.map((p: PokemonDetails) => p.id)
  );

  const t = useTranslations('Pagination');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const queryKey = searchTerm
    ? ['pokemonSearch', searchTerm]
    : ['pokemons', currentPage];

  const queryFn = async () => {
    if (searchTerm) {
      const pokemon = await getPokemonFullDetails(searchTerm.toLowerCase());
      return {
        pokemons: [pokemon],
        next: null,
        previous: null,
        count: 1,
      };
    }
    const offset = (currentPage - 1) * POKEMON_PER_PAGE;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`;
    return getPokemonList(url);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    initialData: initialError ? undefined : initialData,
  });

  const totalPages = Math.ceil((data?.count || 0) / POKEMON_PER_PAGE);
  const pokemons = data?.pokemons || [];

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCardClick = (id: number) => {
    router.push(`/details/${id}`);
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, minWidth: 0 }} data-testid="main-panel">
        <Main
          pokemons={pokemons}
          isLoading={isLoading}
          error={isError ? (error as Error) : initialError}
          onCardClick={handleCardClick}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelectedItem}
        />
        <Pagination
          onNext={() => handlePageChange(currentPage + 1)}
          onPrev={() => handlePageChange(currentPage - 1)}
          hasNext={!!data?.next}
          hasPrev={!!data?.previous}
          currentPage={currentPage}
          totalPagesText={t('page', { currentPage, totalPages })}
          prevText={t('prev')}
          nextText={t('next')}
        />
        <Flyout />
      </div>
    </div>
  );
}
