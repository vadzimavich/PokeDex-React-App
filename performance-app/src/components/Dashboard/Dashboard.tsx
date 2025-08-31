import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  type Co2Data,
  type SortKey,
  type ProcessedCountry,
} from '../../types/co2Data';
import { processCo2Data, getAllYears } from '../../utils/dataProcessor';
import { getRegionMap, type RegionMap } from '../../services/regionService';
import CountryList from '../CountryList/CountryList';
import Controls from '../Controls/Controls';
import ColumnSelectorModal from '../ColumnSelectorModal/ColumnSelectorModal';
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

  const allYears = useMemo(() => getAllYears(co2Data), [co2Data]);
  const [regionMap, setRegionMap] = useState<RegionMap>(new Map());
  const [selectedYear, setSelectedYear] = useState<number>(allYears[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('population_desc');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'population',
    'co2',
    'co2_per_capita',
  ]);
  const [highlightKey, setHighlightKey] = useState(0);

  useEffect(() => {
    getRegionMap().then(setRegionMap);
  }, []);

  useEffect(() => {
    setHighlightKey((key) => key + 1);
  }, [selectedYear]);

  const baseCountries = useMemo(() => {
    return processCo2Data(co2Data, selectedYear, regionMap);
  }, [co2Data, selectedYear, regionMap]);

  const displayedCountries = useMemo(() => {
    let countries = baseCountries;

    if (selectedRegion !== 'All') {
      countries = countries.filter(
        (country) => country.region === selectedRegion
      );
    }
    if (searchTerm) {
      countries = countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [...countries].sort((a: ProcessedCountry, b: ProcessedCountry) => {
      switch (sortKey) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'population_asc':
          return (
            (a.populationForYear?.value ?? 0) -
            (b.populationForYear?.value ?? 0)
          );
        case 'population_desc':
        default:
          return (
            (b.populationForYear?.value ?? 0) -
            (a.populationForYear?.value ?? 0)
          );
      }
    });
  }, [baseCountries, selectedRegion, searchTerm, sortKey]);

  const allRegions = useMemo(() => {
    const uniqueRegions = [
      ...new Set(baseCountries.map((c) => c.region).filter(Boolean)),
    ].sort();
    return ['All', ...uniqueRegions] as string[];
  }, [baseCountries]);

  const handleYearChange = useCallback(
    (year: number) => setSelectedYear(year),
    []
  );
  const handleSearchChange = useCallback(
    (term: string) => setSearchTerm(term),
    []
  );
  const handleSortChange = useCallback((key: SortKey) => setSortKey(key), []);
  const handleRegionChange = useCallback(
    (region: string) => setSelectedRegion(region),
    []
  );
  const handleSaveColumns = useCallback(
    (columns: string[]) => setSelectedColumns(columns),
    []
  );
  const handleOpenModal = useCallback(() => setIsColumnModalOpen(true), []);
  const handleCloseModal = useCallback(() => setIsColumnModalOpen(false), []);

  return (
    <div className={styles.dashboardContainer}>
      {isColumnModalOpen && (
        <ColumnSelectorModal
          selectedColumns={selectedColumns}
          onClose={handleCloseModal}
          onSave={handleSaveColumns}
        />
      )}
      <header className={styles.header}>
        <h1 className={styles.title}>CO₂ Emissions by Country</h1>
        <div className={styles.headerActions}>
          <button onClick={handleOpenModal} className={styles.actionButton}>
            Edit Columns
          </button>
          <button onClick={onReset} className={styles.resetButton}>
            Reset Data Source
          </button>
        </div>
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
        Displaying data for {displayedCountries.length} countries.
      </p>
      <CountryList
        countries={displayedCountries}
        columns={selectedColumns}
        highlightKey={highlightKey}
      />
    </div>
  );
};

export default Dashboard;
