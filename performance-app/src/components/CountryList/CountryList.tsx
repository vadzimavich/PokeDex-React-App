import React, { useState } from 'react';
import { type ProcessedCountry } from '../../types/co2Data';
import CountryCard from '../CountryCard/CountryCard';
import YearlyDataTable from '../YearlyDataTable/YearlyDataTable';
import styles from './CountryList.module.css';

interface CountryListProps {
  countries: ProcessedCountry[];
  columns: string[];
}

const CountryListComponent = ({ countries, columns }: CountryListProps) => {
  const [selectedCountryIso, setSelectedCountryIso] = useState<string | null>(
    null
  );

  const handleSelectCountry = (isoCode: string) => {
    setSelectedCountryIso((prev) => (prev === isoCode ? null : isoCode));
  };

  const selectedCountryData = selectedCountryIso
    ? countries.find((c) => c.isoCode === selectedCountryIso)
    : null;

  return (
    <div className={styles.grid}>
      {countries.map((country) => (
        <React.Fragment key={country.isoCode}>
          <CountryCard
            country={country}
            isSelected={country.isoCode === selectedCountryIso}
            onSelect={handleSelectCountry}
          />
          {country.isoCode === selectedCountryIso && selectedCountryData && (
            <YearlyDataTable
              data={selectedCountryData.data}
              columns={columns}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const CountryList = React.memo(CountryListComponent);

export default CountryList;
