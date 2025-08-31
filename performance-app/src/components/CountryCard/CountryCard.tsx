import React from 'react';
import { type ProcessedCountry } from '../../types/co2Data';
import styles from './CountryCard.module.css';

interface CountryCardProps {
  country: ProcessedCountry;
  isSelected: boolean;
  onSelect: (isoCode: string) => void;
}

const CountryCardComponent = ({
  country,
  isSelected,
  onSelect,
}: CountryCardProps) => {
  console.log(`Rendering CountryCard: ${country.name}`);

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

const CountryCard = React.memo(CountryCardComponent);

export default CountryCard;
