import { Component } from 'react';
import CardList from '../CardList/CardList';
import type { Pokemon } from '../../types';

interface MainProps {
  pokemons: Pokemon[];
  isLoading: boolean;
  error: Error | null;
}

class Main extends Component<MainProps> {
  render() {
    const { pokemons, isLoading, error } = this.props;

    if (error) {
      return <main>Error: {error.message}</main>;
    }

    if (isLoading) {
      return <main>Loading...</main>;
    }

    return (
      <main>
        <CardList pokemons={pokemons} />
      </main>
    );
  }
}

export default Main;
