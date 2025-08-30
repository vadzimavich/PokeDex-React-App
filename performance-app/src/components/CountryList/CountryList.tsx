import { type ProcessedCountry } from '../../types/co2Data';
import CountryCard from '../CountryCard/CountryCard';
import styles from './CountryList.module.css';

interface CountryListProps {
  countries: ProcessedCountry[];
}

const CountryList = ({ countries }: CountryListProps) => {
  return (
    <div className={styles.grid}>
      {countries.map((country) => (
        <CountryCard key={country.isoCode} country={country} />
      ))}
    </div>
  );
};

export default CountryList;
