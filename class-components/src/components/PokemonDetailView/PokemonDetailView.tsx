import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styles from './PokemonDetailView.module.css';
import cardStyles from '../Card/Card.module.css';
import { useGetPokemonDetails } from '../../hooks/useGetPokemonDetails';

const PokemonDetailView = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>();
  const { pokemon, isLoading, error } = useGetPokemonDetails(pokemonId);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate(`/${location.search}`);
  };

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
