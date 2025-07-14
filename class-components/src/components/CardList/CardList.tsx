import { Component } from 'react';
import type { Pokemon } from '../../types';

interface CardListProps {
  pokemons: Pokemon[];
}

class CardList extends Component<CardListProps> {
  render() {
    const { pokemons } = this.props;

    if (pokemons.length === 0) {
      return <div>No Pokemon found.</div>;
    }

    return (
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li>
        ))}
      </ul>
    );
  }
}

export default CardList;
