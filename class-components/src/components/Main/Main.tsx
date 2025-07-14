import { Component } from 'react';
import CardList from '../CardList/CardList';
import SkeletonCard from '../SkeletonCard/SkeletonCard';
import type { PokemonDetails } from '../../types';

interface MainProps {
  pokemons: PokemonDetails[];
  isLoading: boolean;
  error: Error | null;
}

const SKELETON_COUNT = 20;

class Main extends Component<MainProps> {
  render() {
    const { pokemons, isLoading, error } = this.props;

    if (error) {
      return <main>Error: {error.message}</main>;
    }

    if (isLoading) {
      return (
        <main>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              padding: '2rem',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        </main>
      );
    }

    return (
      <main>
        <CardList pokemons={pokemons} />
      </main>
    );
  }
}

export default Main;
