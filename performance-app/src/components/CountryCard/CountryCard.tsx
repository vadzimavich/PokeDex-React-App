import { type ProcessedCountry } from '../../types/co2Data';
import styles from './CountryCard.module.css';

interface CountryCardProps {
  country: ProcessedCountry;
  isSelected: boolean;
  onSelect: (isoCode: string) => void;
}

const CountryCard = ({ country, isSelected, onSelect }: CountryCardProps) => {
  const cardClasses = `${styles.card} ${isSelected ? styles.selected : ''}`;

  return (
    <div className={cardClasses} onClick={() => onSelect(country.isoCode)}>
      <h3 className={styles.name}>{country.name}</h3>
      <p className={styles.isoCode}>{country.isoCode}</p>
      <div className={styles.population}>
        <span className={styles.label}>Population:</span>
        {country.populationForYear ? (
          <span>
            {country.populationForYear.value.toLocaleString()}
            <small> (in {country.populationForYear.year})</small>
          </span>
        ) : (
          <span>N/A</span>
        )}
      </div>
    </div>
  );
};

export default CountryCard;
