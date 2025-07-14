import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import type { PokemonDetails } from './types';
import './App.css';

interface AppState {
  searchTerm: string;
  pokemons: PokemonDetails[];
  isLoading: boolean;
  error: Error | null;
  shouldThrowError: boolean;
}

const SEARCH_TERM_KEY = 'searchTerm';

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem(SEARCH_TERM_KEY) || '',
      pokemons: [],
      isLoading: false,
      error: null,
      shouldThrowError: false,
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
      const url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`;
      this.getPokemonDetails(url)
        .then((pokemon) => {
          this.setState({ pokemons: [pokemon] });
        })
        .catch((_) => {
          this.setState({
            error: new Error(`Pokemon "${searchTerm}" not found.`),
            pokemons: [],
          });
        })
        .finally(() => {
          this.setState({ isLoading: false });
        });
    } else {
      fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
        .then((res) => res.json())
        .then(async (data) => {
          const pokemonPromises = data.results.map((p: { url: string }) =>
            this.getPokemonDetails(p.url)
          );
          const detailedPokemons = await Promise.all(pokemonPromises);
          this.setState({ pokemons: detailedPokemons });
        })
        .catch((error) => this.setState({ error, pokemons: [] }))
        .finally(() => {
          this.setState({ isLoading: false });
        });
    }
  };

  handleSearch = (term: string) => {
    localStorage.setItem(SEARCH_TERM_KEY, term);
    this.setState({ searchTerm: term }, this.fetchPokemons);
  };

  triggerError = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('This is a test error!');
    }

    const { pokemons, isLoading, error, searchTerm } = this.state;

    return (
      <div className="app">
        <Header onSearch={this.handleSearch} searchTerm={searchTerm} />
        <Main pokemons={pokemons} isLoading={isLoading} error={error} />
        <button onClick={this.triggerError} className="error-button">
          Throw Error
        </button>
      </div>
    );
  }
}

export default App;
