import { describe, it, expect } from 'vitest';
import { downloadCsvAction } from './actions';
import type { PokemonDetails } from './types';

describe('Server Actions', () => {
  it('downloadCsvAction should convert pokemon data to CSV string', async () => {
    const mockPokemons = [
      {
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
        description: 'A strange seed was planted on its back.',
      },
    ] as unknown as PokemonDetails[];

    const result = await downloadCsvAction(mockPokemons);

    const expectedCsv =
      'ID,Name,Height (m),Weight (kg),Types,Description\n' +
      '1,bulbasaur,0.7,6.9,grass | poison,"A strange seed was planted on its back."';

    expect(result.csvData).toBe(expectedCsv);
  });

  it('downloadCsvAction should handle empty array', async () => {
    const result = await downloadCsvAction([]);
    expect(result.csvData).toBe('');
  });
});
