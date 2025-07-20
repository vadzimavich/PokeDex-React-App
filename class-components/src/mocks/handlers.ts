import { http, HttpResponse } from 'msw';

const mockPokemonList = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=2&limit=2',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const mockPokemonDetails = (id: number, name: string) => ({
  id,
  name,
  height: 7,
  weight: 69,
  sprites: {
    other: { 'official-artwork': { front_default: `image_${name}.png` } },
  },
  types: [{ type: { name: 'grass' } }],
  species: { url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
});

const mockSpeciesDetails = (name: string) => ({
  flavor_text_entries: [
    {
      flavor_text: `This is a test description for ${name}.`,
      language: { name: 'en' },
    },
  ],
});

export const handlers = [
  http.get('https://pokeapi.co/api/v2/pokemon', () => {
    return HttpResponse.json(mockPokemonList);
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', () => {
    return HttpResponse.json(mockPokemonDetails(1, 'bulbasaur'));
  }),

  http.get('https://pokeapi.co/api/v2/pokemon/:id/', ({ params }) => {
    const id = parseInt(params.id as string, 10);
    const name = id === 1 ? 'bulbasaur' : 'ivysaur';
    return HttpResponse.json(mockPokemonDetails(id, name));
  }),

  http.get('https://pokeapi.co/api/v2/pokemon-species/:id/', ({ params }) => {
    const id = parseInt(params.id as string, 10);
    const name = id === 1 ? 'bulbasaur' : 'ivysaur';
    return HttpResponse.json(mockSpeciesDetails(name));
  }),
];
