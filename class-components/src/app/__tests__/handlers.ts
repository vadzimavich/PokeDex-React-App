import { http, HttpResponse, delay } from 'msw';

const mockPokemonListPage1 = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
};

const mockPokemonListPage2 = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=40&limit=20',
  previous: 'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20',
  results: [
    { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    { name: 'charmeleon', url: 'https://pokeapi.co/api/v2/pokemon/5/' },
  ],
};

const mockPokemonDetails = (id: number, name: string) => ({
  id,
  name,
  height: 7,
  weight: 69,
  sprites: {
    other: {
      'official-artwork': { front_default: `https://example.com/${name}.png` },
    },
  },
  types: [{ type: { name: 'grass' } }],
  stats: [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
  ],
  abilities: [],
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
  http.get('https://pokeapi.co/api/v2/pokemon', async ({ request }) => {
    const url = new URL(request.url);
    const offset = url.searchParams.get('offset');
    await delay(150);
    return HttpResponse.json(
      offset === '20' ? mockPokemonListPage2 : mockPokemonListPage1
    );
  }),

  // bulbasaur (id 1)
  http.get('https://pokeapi.co/api/v2/pokemon/1', async () => {
    await delay(150);
    return HttpResponse.json(mockPokemonDetails(1, 'bulbasaur'));
  }),
  http.get('https://pokeapi.co/api/v2/pokemon/bulbasaur', async () => {
    await delay(150);
    return HttpResponse.json(mockPokemonDetails(1, 'bulbasaur'));
  }),
  http.get('https://pokeapi.co/api/v2/pokemon-species/1/', async () => {
    await delay(150);
    return HttpResponse.json(mockSpeciesDetails('bulbasaur'));
  }),

  // ivysaur (id 2)
  http.get('https://pokeapi.co/api/v2/pokemon/ivysaur', async () => {
    await delay(150);
    return HttpResponse.json(mockPokemonDetails(2, 'ivysaur'));
  }),
  http.get('https://pokeapi.co/api/v2/pokemon-species/2', async () => {
    await delay(150);
    return HttpResponse.json(mockSpeciesDetails('ivysaur'));
  }),

  // charmander (id 4)
  http.get('https://pokeapi.co/api/v2/pokemon/charmander', async () => {
    await delay(150);
    return HttpResponse.json(mockPokemonDetails(4, 'charmander'));
  }),
  http.get('https://pokeapi.co/api/v2/pokemon-species/4', async () => {
    await delay(150);
    return HttpResponse.json(mockSpeciesDetails('charmander'));
  }),

  // charmeleon (id 5)
  http.get('https://pokeapi.co/api/v2/pokemon/charmeleon', async () => {
    await delay(150);
    return HttpResponse.json(mockPokemonDetails(5, 'charmeleon'));
  }),
  http.get('https://pokeapi.co/api/v2/pokemon-species/5', async () => {
    await delay(150);
    return HttpResponse.json(mockSpeciesDetails('charmeleon'));
  }),
];
