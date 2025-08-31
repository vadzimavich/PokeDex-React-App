import { useState } from 'react';
import {
  type Co2Data,
  type SortKey,
  type ProcessedCountry,
} from '../../types/co2Data';
import { processCo2Data, getAllYears } from '../../utils/dataProcessor';
import CountryList from '../CountryList/CountryList';
import Controls from '../Controls/Controls';
import styles from './Dashboard.module.css';

type Co2Resource = {
  read: () => Co2Data;
};

interface DashboardProps {
  resource: Co2Resource;
  onReset: () => void;
}

const Dashboard = ({ resource, onReset }: DashboardProps) => {
  const co2Data = resource.read();
  const allYears = getAllYears(co2Data);

  const [selectedYear, setSelectedYear] = useState<number>(allYears[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('population_desc');

  let processedCountries = processCo2Data(co2Data, selectedYear);

  if (searchTerm) {
    processedCountries = processedCountries.filter((country) =>
      country.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  processedCountries.sort((a: ProcessedCountry, b: ProcessedCountry) => {
    switch (sortKey) {
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'population_asc':
        return (
          (a.populationForYear?.value ?? 0) - (b.populationForYear?.value ?? 0)
        );
      case 'population_desc':
      default:
        return (
          (b.populationForYear?.value ?? 0) - (a.populationForYear?.value ?? 0)
        );
    }
  });

  const handleYearChange = (year: number) => setSelectedYear(year);
  const handleSearchChange = (term: string) => setSearchTerm(term);
  const handleSortChange = (key: SortKey) => setSortKey(key);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>CO₂ Emissions by Country</h1>
        <button onClick={onReset} className={styles.resetButton}>
          Reset Data Source
        </button>
      </header>

      <Controls
        years={allYears}
        selectedYear={selectedYear}
        onYearChange={handleYearChange}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        sortKey={sortKey}
        onSortChange={handleSortChange}
      />

      <p className={styles.summary}>
        Displaying data for {processedCountries.length} countries.
      </p>

      <CountryList countries={processedCountries} />
    </div>
  );
};

export default Dashboard;
