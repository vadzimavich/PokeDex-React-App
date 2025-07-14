import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { type Pokemon } from './types';
import './App.css';

interface AppState {
  searchTerm: string;
  pokemons: Pokemon[];
  isLoading: boolean;
  error: Error | null;
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
    };
  }

  componentDidMount() {
    this.fetchPokemons();
  }

  fetchPokemons = () => {
    const { searchTerm } = this.state;
    this.setState({ isLoading: true, error: null });
    const endpoint = searchTerm
      ? `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`
      : 'https://pokeapi.co/api/v2/pokemon?limit=30';

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error(`Sorry, Pokemon "${searchTerm}" not found`);
          }
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((data) => {
        if (searchTerm) {
          const foundPokemon: Pokemon = {
            name: data.name,
            url: `https://pokeapi.co/api/v2/pokemon/${data.id}/`,
          };
          this.setState({ pokemons: [foundPokemon] });
        } else {
          this.setState({ pokemons: data.results });
        }
      })
      .catch((error) => {
        this.setState({ error, pokemons: [] });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleSearch = (term: string) => {
    localStorage.setItem(SEARCH_TERM_KEY, term);
    this.setState({ searchTerm: term }, () => {
      this.fetchPokemons();
    });
  };

  render() {
    const { pokemons, isLoading, error, searchTerm } = this.state;
    return (
      <ErrorBoundary>
        <div className="app">
          <Header onSearch={this.handleSearch} searchTerm={searchTerm} />
          <Main pokemons={pokemons} isLoading={isLoading} error={error} />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
