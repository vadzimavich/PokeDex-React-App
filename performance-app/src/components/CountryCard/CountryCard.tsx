import { type ProcessedCountry } from '../../types/co2Data';
import styles from './CountryCard.module.css';

interface CountryCardProps {
  country: ProcessedCountry;
}

const CountryCard = ({ country }: CountryCardProps) => {
  return (
    <div className={styles.card}>
      <h3 className={styles.name}>{country.name}</h3>
      <p className={styles.isoCode}>{country.isoCode}</p>
      <div className={styles.population}>
        <span className={styles.label}>Population:</span>
        {country.latestPopulation ? (
          <span>
            {country.latestPopulation.value.toLocaleString()}
            <small> (in {country.latestPopulation.year})</small>
          </span>
        ) : (
          <span>N/A</span>
        )}
      </div>
    </div>
  );
};

export default CountryCard;
