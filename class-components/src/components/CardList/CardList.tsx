import type { PokemonDetails } from '../../types';
import Card from '../Card/Card';
import styles from './CardList.module.css';

interface CardListProps {
  pokemons: PokemonDetails[];
  onCardClick: (id: number) => void;
  selectedIds: Set<number>;
  onToggleSelect: (pokemon: PokemonDetails) => void;
}

const CardList = ({
  pokemons,
  onCardClick,
  selectedIds,
  onToggleSelect,
}: CardListProps) => {
  if (pokemons.length === 0) {
    return <div>No Pokemon found.</div>;
  }

  return (
    <div className={styles.cardList}>
      {pokemons.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          onCardClick={onCardClick}
          isSelected={selectedIds.has(pokemon.id)}
          onToggleSelect={onToggleSelect}
        />
      ))}
    </div>
  );
};

export default CardList;
