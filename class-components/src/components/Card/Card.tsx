import type { PokemonDetails } from '../../types';
import styles from './Card.module.css';

interface CardProps {
  pokemon: PokemonDetails;
  onCardClick: (id: number) => void;
}

const Card = ({ pokemon, onCardClick }: CardProps) => {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // Оставляем stopPropagation здесь!
        onCardClick(pokemon.id);
      }}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <div className={styles.idLabel}>
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          {imageUrl && (
            <img src={imageUrl} alt={pokemon.name} className={styles.image} />
          )}
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{pokemon.name}</h3>
          <p className={styles.description}>{pokemon.description}</p>
          <div className={styles.details}>
            <p>
              Height: {pokemon.height / 10}
              <span className={styles.unit}> m</span>
            </p>
            <p>
              Weight: {pokemon.weight / 10}
              <span className={styles.unit}> kg</span>
            </p>
          </div>
          <div className={styles.types}>
            {pokemon.types.map(({ type }) => (
              <span
                key={type.name}
                className={`${styles.type} ${styles[type.name]}`}
              >
                {type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
