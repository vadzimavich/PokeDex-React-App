import type { PokemonDetails } from '../../types';
import Card from '../Card/Card';
import styles from './CardList.module.css';

interface CardListProps {
  pokemons: PokemonDetails[];
}

const CardList = ({ pokemons }: CardListProps) => {
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
};

export default CardList;
