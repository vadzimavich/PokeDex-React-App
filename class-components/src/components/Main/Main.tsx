import CardList from '../CardList/CardList';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import type { PokemonDetails } from '../../types';
import cardListStyles from '../CardList/CardList.module.css';

interface MainProps {
  pokemons: PokemonDetails[];
  isLoading: boolean;
  error: Error | null;
  onCardClick: (id: number) => void;
}

const SKELETON_COUNT = 20;

const Main = ({ pokemons, isLoading, error, onCardClick }: MainProps) => {
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
      <CardList pokemons={pokemons} onCardClick={onCardClick} />
    </main>
  );
};

export default Main;
