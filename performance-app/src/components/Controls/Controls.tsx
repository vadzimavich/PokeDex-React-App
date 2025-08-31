import { type SortKey } from '../../types/co2Data';
import styles from './Controls.module.css';

interface ControlsProps {
  years: number[];
  selectedYear: number;
  onYearChange: (year: number) => void;

  searchTerm: string;
  onSearchChange: (term: string) => void;

  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

const Controls = ({
  years,
  selectedYear,
  onYearChange,
  searchTerm,
  onSearchChange,
  sortKey,
  onSortChange,
}: ControlsProps) => {
  return (
    <div className={styles.controlsContainer}>
      <input
        type="search"
        placeholder="Search by country name..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className={styles.selectors}>
        <select
          className={styles.select}
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
        >
          <option value="population_desc">Sort by Population (desc)</option>
          <option value="population_asc">Sort by Population (asc)</option>
          <option value="name_asc">Sort by Name (A-Z)</option>
          <option value="name_desc">Sort by Name (Z-A)</option>
        </select>
        <select className={styles.select}>
          <option value="">Filter by Region</option>
        </select>
        <select
          className={styles.select}
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              Year: {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Controls;
