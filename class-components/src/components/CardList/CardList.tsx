import { Component } from 'react';
import type { PokemonDetails } from '../../types';
import Card from '../Card/Card';
import styles from './CardList.module.css';

interface CardListProps {
  pokemons: PokemonDetails[];
}

class CardList extends Component<CardListProps> {
  render() {
    const { pokemons } = this.props;

    if (pokemons.length === 0) {
      return <div>No Pokemon found.</div>;
    }

    return (
      <div className={styles.cardList}>
        {pokemons.map((pokemon) => (
          <Card key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    );
  }
}

export default CardList;
