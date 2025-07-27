import { useState, useEffect, useCallback } from 'react';
import type { PokemonDetails } from '../../types';
import styles from './PokemonDetailView.module.css';
import cardStyles from '../Card/Card.module.css';

interface PokemonDetailViewProps {
  pokemonId: string;
  onClose: () => void;
}

const PokemonDetailView = ({ pokemonId, onClose }: PokemonDetailViewProps) => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFullDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const detailsRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      if (!detailsRes.ok) throw new Error('Pokemon not found');
      const details = await detailsRes.json();

      const speciesRes = await fetch(details.species.url);
      if (!speciesRes.ok) throw new Error('Failed to fetch species data');
      const speciesData = await speciesRes.json();

      const descriptionEntry = speciesData.flavor_text_entries.find(
        (entry: { language: { name: string } }) => entry.language.name === 'en'
      );
      const description = descriptionEntry
        ? descriptionEntry.flavor_text.replace(/[\n\f\r]/g, ' ')
        : 'No description available.';

      setPokemon({ ...details, description });
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pokemonId) {
      fetchFullDetails(pokemonId);
    }
  }, [pokemonId, fetchFullDetails]);

  return (
    <aside className={styles.detailsView}>
      <button onClick={onClose} className={styles.closeButton}>
        ×
      </button>
      {isLoading && <p>Loading details...</p>}
      {error && <p>Error: {error.message}</p>}
      {pokemon && (
        <div className={styles.content}>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default}
            alt={pokemon.name}
            className={styles.image}
          />
          <h2 className={styles.name}>
            {pokemon.name}
            <span className={styles.id}>
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
          </h2>

          <div className={styles.types}>
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`${cardStyles.type} ${cardStyles[type.name]}`}
              >
                {type.name}
              </span>
            ))}
          </div>

          <p className={styles.description}>{pokemon.description}</p>

          <div className={styles.statsContainer}>
            <h3>Base Stats</h3>
            <ul>
              {pokemon.stats.map(({ stat, base_stat }) => (
                <li key={stat.name} className={styles.statItem}>
                  <span className={styles.statName}>{stat.name}</span>
                  <span className={styles.statValue}>{base_stat}</span>
                  <div className={styles.statBar}>
                    <div
                      className={styles.statBarFill}
                      style={{ width: `${(base_stat / 255) * 100}%` }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
};

export default PokemonDetailView;
