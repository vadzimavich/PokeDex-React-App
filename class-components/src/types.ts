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
