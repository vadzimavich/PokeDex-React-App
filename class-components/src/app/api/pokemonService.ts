import type { PokemonDetails, Pokemon } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonFullDetails = async (
  identifier: string | number
): Promise<PokemonDetails> => {
  const detailsRes = await fetch(`${BASE_URL}/pokemon/${identifier}`);
  if (!detailsRes.ok) {
    throw new Error(`Failed to fetch Pokemon: ${detailsRes.status}`);
  }
  const details = await detailsRes.json();

  const speciesRes = await fetch(details.species.url);
  if (!speciesRes.ok) {
    throw new Error(`Failed to fetch species data: ${speciesRes.status}`);
  }
  const speciesData = await speciesRes.json();

  const entry = speciesData.flavor_text_entries.find(
    (e: { language: { name: string } }) => e.language.name === 'en'
  );
  const description = entry
    ? entry.flavor_text.replace(/[\n\f\r]/g, ' ')
    : 'No description.';
  return { ...details, description };
};

export const getPokemonList = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Network response was not ok: ${res.status}`);
  }
  const data = await res.json();
  const promises = data.results.map((p: Pokemon) =>
    getPokemonFullDetails(p.name)
  );
  const detailedPokemons = await Promise.all(promises);

  return {
    pokemons: detailedPokemons,
    next: data.next,
    previous: data.previous,
    count: data.count,
  };
};
