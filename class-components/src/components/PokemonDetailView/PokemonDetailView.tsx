import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getPokemonFullDetails } from '../../api/pokemonService';
import type { PokemonDetails } from '../../types';
import styles from './PokemonDetailView.module.css';
import cardStyles from '../Card/Card.module.css';

const PokemonDetailView = () => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { pokemonId } = useParams<{ pokemonId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate(`/${location.search}`);
  };

  useEffect(() => {
    if (pokemonId) {
      const fetchDetails = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getPokemonFullDetails(pokemonId);
          setPokemon(data);
        } catch (err) {
          setError(err as Error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDetails();
    }
  }, [pokemonId]);

  return (
    <aside className={styles.detailsView}>
      <button onClick={handleClose} className={styles.closeButton}>
        ×
      </button>
      {isLoading && <p>Loading details...</p>}
      {error && <p>Error: {error.message}</p>}
      {pokemon && (
        <div className={styles.content}>
          {pokemon.sprites.other['official-artwork'].front_default && (
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt={pokemon.name}
              className={styles.image}
            />
          )}
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
