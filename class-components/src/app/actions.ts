'use server';

import type { PokemonDetails } from './types';

function convertToCSV(pokemons: PokemonDetails[]): string {
  if (pokemons.length === 0) return '';

  const headers = [
    'ID',
    'Name',
    'Height (m)',
    'Weight (kg)',
    'Types',
    'Description',
  ];
  const rows = pokemons.map((p) => {
    const cleanedDescription = `"${p.description.replace(/"/g, '""')}"`;
    const types = p.types.map(({ type }) => type.name).join(' | ');
    return [
      p.id,
      p.name,
      p.height / 10,
      p.weight / 10,
      types,
      cleanedDescription,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export async function downloadCsvAction(pokemons: PokemonDetails[]) {
  const csvData = convertToCSV(pokemons);

  return { csvData };
}
