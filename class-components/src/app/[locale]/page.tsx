import {
  getPokemonList,
  getPokemonFullDetails,
} from '@/app/api/pokemonService';
import HomePageClient from '@/app/components/HomePageClient/HomePageClient';

const POKEMON_PER_PAGE = 20;

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentPage = parseInt(String(searchParams.page || '1'), 10);
  const searchTerm = String(searchParams.search || '');

  let initialData = null;
  let error: Error | null = null;

  try {
    if (searchTerm) {
      const pokemon = await getPokemonFullDetails(searchTerm.toLowerCase());
      initialData = {
        pokemons: [pokemon],
        next: null,
        previous: null,
        count: 1,
      };
    } else {
      const offset = (currentPage - 1) * POKEMON_PER_PAGE;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}&offset=${offset}`;
      initialData = await getPokemonList(url);
    }
  } catch (e) {
    error = e instanceof Error ? e : new Error('An unknown error occurred');
  }

  const serializableError = error ? { message: error.message } : null;

  return (
    <HomePageClient
      initialData={initialData}
      initialError={serializableError}
      currentPage={currentPage}
      searchTerm={searchTerm}
    />
  );
}
