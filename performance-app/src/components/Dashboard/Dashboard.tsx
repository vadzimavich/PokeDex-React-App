import { useState, useEffect } from 'react';
import {
  type Co2Data,
  type SortKey,
  type ProcessedCountry,
} from '../../types/co2Data';
import { processCo2Data, getAllYears } from '../../utils/dataProcessor';
import { getRegionMap, type RegionMap } from '../../services/regionService';
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

  const [regionMap, setRegionMap] = useState<RegionMap>(new Map());
  const [selectedYear, setSelectedYear] = useState<number>(allYears[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('population_desc');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');

  useEffect(() => {
    getRegionMap().then(setRegionMap);
  }, []);

  let processedCountries = processCo2Data(co2Data, selectedYear, regionMap);

  const uniqueRegions = [
    ...new Set(processedCountries.map((c) => c.region).filter(Boolean)),
  ].sort();
  const allRegions = ['All', ...uniqueRegions] as string[];

  if (selectedRegion !== 'All') {
    processedCountries = processedCountries.filter(
      (country) => country.region === selectedRegion
    );
  }

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
  const handleRegionChange = (region: string) => setSelectedRegion(region);

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
        regions={allRegions}
        selectedRegion={selectedRegion}
        onRegionChange={handleRegionChange}
      />

      <p className={styles.summary}>
        Displaying data for {processedCountries.length} countries.
      </p>

      <CountryList countries={processedCountries} />
    </div>
  );
};

export default Dashboard;
