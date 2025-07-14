import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Pagination from './components/Pagination/Pagination';
import ErrorButton from './components/ErrorButton/ErrorButton';
import type { PokemonDetails } from './types';
import './App.css';

interface AppState {
  searchTerm: string;
  pokemons: PokemonDetails[];
  isLoading: boolean;
  error: Error | null;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
  currentPage: number;
  totalPages: number;
}

const SEARCH_TERM_KEY = 'searchTerm';
const POKEMON_PER_PAGE = 20;

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem(SEARCH_TERM_KEY) || '',
      pokemons: [],
      isLoading: false,
      error: null,
      nextPageUrl: null,
      prevPageUrl: null,
      currentPage: 1,
      totalPages: 0,
    };
  }

  componentDidMount() {
    this.fetchPokemons();
  }

  getPokemonDetails = async (url: string): Promise<PokemonDetails> => {
    const detailsRes = await fetch(url);
    if (!detailsRes.ok) throw new Error('Failed to fetch pokemon details...');
    const details = await detailsRes.json();

    const speciesRes = await fetch(details.species.url);
    if (!speciesRes.ok) throw new Error('Failed to fetch pokemon species...');
    const speciesData = await speciesRes.json();

    const descriptionEntry = speciesData.flavor_text_entries.find(
      (entry: { language: { name: string } }) => entry.language.name === 'en'
    );

    const description = descriptionEntry
      ? descriptionEntry.flavor_text.replace(/[\n\f\r]/g, ' ')
      : 'No description available...';

    return { ...details, description };
  };

  fetchPokemons = () => {
    const { searchTerm } = this.state;
    this.setState({ isLoading: true, error: null });

    if (searchTerm) {
      this.setState({
        nextPageUrl: null,
        prevPageUrl: null,
        currentPage: 1,
        totalPages: 0,
      });
      const url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`;
      this.getPokemonDetails(url)
        .then((pokemon) => this.setState({ pokemons: [pokemon] }))
        .catch((_) =>
          this.setState({
            error: new Error(`Pokemon "${searchTerm}" not found.`),
            pokemons: [],
          })
        )
        .finally(() => this.setState({ isLoading: false }));
    } else {
      const initialUrl = `https://pokeapi.co/api/v2/pokemon?limit=${POKEMON_PER_PAGE}`;
      this.fetchAllPokemons(initialUrl);
    }
  };

  fetchAllPokemons = (url: string) => {
    this.setState({ isLoading: true, error: null });
    fetch(url)
      .then((res) => res.json())
      .then(async (data) => {
        const { results, next, previous, count } = data;
        const offsetMatch = url.match(/offset=(\d+)/);
        const currentOffset = offsetMatch ? parseInt(offsetMatch[1], 10) : 0;

        const pokemonPromises = results.map((p: { url: string }) =>
          this.getPokemonDetails(p.url)
        );
        const detailedPokemons = await Promise.all(pokemonPromises);

        this.setState({
          pokemons: detailedPokemons,
          nextPageUrl: next,
          prevPageUrl: previous,
          totalPages: Math.ceil(count / POKEMON_PER_PAGE),
          currentPage: currentOffset / POKEMON_PER_PAGE + 1,
        });
      })
      .catch((error) => this.setState({ error, pokemons: [] }))
      .finally(() => this.setState({ isLoading: false }));
  };

  handleNextPage = () => {
    if (this.state.nextPageUrl) {
      this.fetchAllPokemons(this.state.nextPageUrl);
    }
  };

  handlePrevPage = () => {
    if (this.state.prevPageUrl) {
      this.fetchAllPokemons(this.state.prevPageUrl);
    }
  };

  handleSearch = (term: string) => {
    localStorage.setItem(SEARCH_TERM_KEY, term);
    this.setState({ searchTerm: term }, this.fetchPokemons);
  };

  render() {
    const {
      pokemons,
      isLoading,
      error,
      searchTerm,
      nextPageUrl,
      prevPageUrl,
      currentPage,
      totalPages,
    } = this.state;

    const showPagination = !searchTerm && !isLoading && pokemons.length > 0;

    return (
      <div className="app">
        <Header onSearch={this.handleSearch} searchTerm={searchTerm} />
        {showPagination && (
          <Pagination
            onNext={this.handleNextPage}
            onPrev={this.handlePrevPage}
            hasNext={!!nextPageUrl}
            hasPrev={!!prevPageUrl}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
        <Main pokemons={pokemons} isLoading={isLoading} error={error} />
        {showPagination && (
          <Pagination
            onNext={this.handleNextPage}
            onPrev={this.handlePrevPage}
            hasNext={!!nextPageUrl}
            hasPrev={!!prevPageUrl}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
        <ErrorButton />
      </div>
    );
  }
}

export default App;
