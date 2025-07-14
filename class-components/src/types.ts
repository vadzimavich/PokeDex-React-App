export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonApiResponse {
  results: Pokemon[];
  count: number;
  next: string | null;
  previous: string | null;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  description: string;
  species: {
    url: string;
  };
}
