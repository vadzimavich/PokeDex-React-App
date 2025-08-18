import Image from 'next/image';
import type { PokemonDetails } from '../../../app/types';
import styles from './Card.module.css';

interface CardProps {
  pokemon: PokemonDetails;
  onCardClick: (id: number) => void;
  isSelected: boolean;
  onToggleSelect: (pokemon: PokemonDetails) => void;
}

const Card = ({
  pokemon,
  onCardClick,
  isSelected,
  onToggleSelect,
}: CardProps) => {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default;

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onToggleSelect(pokemon);
  };

  const handleCardClick = () => {
    onCardClick(pokemon.id);
  };

  return (
    <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div
        className={`${styles.card} ${isSelected ? styles.selected : ''}`.trim()}
      >
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Select ${pokemon.name}`}
          />
        </div>

        <div className={styles.imageContainer}>
          <div className={styles.idLabel}>
            #{pokemon.id.toString().padStart(3, '0')}
          </div>
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={pokemon.name}
              className={styles.image}
              width={200}
              height={200}
              priority={pokemon.id < 21}
            />
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
