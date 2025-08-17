import type { PokemonDetails } from '../types';

export const convertToCSV = (pokemons: PokemonDetails[]): string => {
  if (pokemons.length === 0) {
    return '';
  }

  const headers = [
    'ID',
    'Name',
    'Height (m)',
    'Weight (kg)',
    'Types',
    'Description',
    'Details URL',
  ];

  const rows = pokemons.map((p) => {
    const cleanedDescription = p.description
      .replace(/,/g, ';')
      .replace(/"/g, "'");
    const types = p.types.map(({ type }) => type.name).join(' | ');
    const detailsUrl = `${window.location.origin}/details/${p.id}`;

    return [
      p.id,
      p.name,
      p.height / 10,
      p.weight / 10,
      types,
      `"${cleanedDescription}"`,
      detailsUrl,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
};

export const downloadCSV = (csvString: string, fileName: string): void => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
