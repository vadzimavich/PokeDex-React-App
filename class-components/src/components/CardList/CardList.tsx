import type { PokemonDetails } from '../../types';
import Card from '../Card/Card';
import styles from './CardList.module.css';

interface CardListProps {
  pokemons: PokemonDetails[];
  onCardClick: (id: number) => void;
}

const CardList = ({ pokemons, onCardClick }: CardListProps) => {
  if (!pokemons.length) {
    return <div>No Pokemon found.</div>;
  }

  return (
    <div className={styles.cardList}>
      {pokemons.map((pokemon) => (
        <Card key={pokemon.id} pokemon={pokemon} onCardClick={onCardClick} />
      ))}
    </div>
  );
};

export default CardList;
