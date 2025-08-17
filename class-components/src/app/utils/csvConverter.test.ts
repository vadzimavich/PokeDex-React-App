import { describe, it, expect, vi } from 'vitest';
import { convertToCSV, downloadCSV } from './csvConverter';
import type { PokemonDetails } from '../types';

describe('CSV Converter Utilities', () => {
  it('convertToCSV should return an empty string for no pokemons', () => {
    expect(convertToCSV([])).toBe('');
  });

  it('convertToCSV should correctly format pokemon data', () => {
    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      height: 7,
      weight: 69,
      types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
      description: 'A strange seed, with a comma.',
    } as PokemonDetails;

    const csv = convertToCSV([mockPokemon]);
    const rows = csv.split('\n');

    expect(rows[0]).toBe(
      'ID,Name,Height (m),Weight (kg),Types,Description,Details URL'
    );
    expect(rows[1]).toContain('1,bulbasaur,0.7,6.9,grass | poison');
    expect(rows[1]).toContain('"A strange seed; with a comma."');
  });

  it('downloadCSV should create and click a link', () => {
    const link = {
      click: vi.fn(),
      setAttribute: vi.fn(),
      style: { visibility: '' },
    };
    vi.spyOn(document, 'createElement').mockReturnValue(
      link as unknown as HTMLAnchorElement
    );
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    URL.createObjectURL = vi.fn(() => 'blob:url');

    downloadCSV('test,data', 'test.csv');

    expect(document.createElement).toHaveBeenCalledWith('a');
    expect(link.setAttribute).toHaveBeenCalledWith('href', 'blob:url');
    expect(link.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
    expect(link.click).toHaveBeenCalledTimes(1);
    expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    expect(document.body.removeChild).toHaveBeenCalledTimes(1);
  });
});
