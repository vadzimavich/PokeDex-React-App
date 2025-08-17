import CardList from '../CardList/CardList';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import type { PokemonDetails } from '../../app/types';
import cardListStyles from '../CardList/CardList.module.css';

interface MainProps {
  pokemons: PokemonDetails[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (id: number) => void;
  selectedIds: Set<number>;
  onToggleSelect: (pokemon: PokemonDetails) => void;
}

const SKELETON_COUNT = 20;

const Main = ({
  pokemons,
  isLoading,
  error,
  onCardClick,
  selectedIds,
  onToggleSelect,
}: MainProps) => {
  if (error) {
    return <main>Error: {error.message}</main>;
  }

  if (isLoading) {
    return (
      <main>
        <div className={cardListStyles.cardList}>
          {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main>
      <CardList
        pokemons={pokemons}
        onCardClick={onCardClick}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
      />
    </main>
  );
};

export default Main;
