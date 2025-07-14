import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import type { Pokemon } from './types';
import './App.css';

interface AppState {
  searchTerm: string;
  pokemons: Pokemon[];
  isLoading: boolean;
  error: Error | null;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: '',
      pokemons: [],
      isLoading: false,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchPokemons();
  }

  fetchPokemons = () => {
    this.setState({ isLoading: true, error: null });

    fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ pokemons: data.results });
      })
      .catch((error) => {
        this.setState({ error });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
  };

  render() {
    const { pokemons, isLoading, error } = this.state;

    return (
      <ErrorBoundary>
        <div className="app">
          <Header onSearch={this.handleSearch} />
          <Main pokemons={pokemons} isLoading={isLoading} error={error} />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
