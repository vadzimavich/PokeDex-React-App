import { useState } from 'react';
import { type Co2Data } from '../../types/co2Data';
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

  const processedCountries = processCo2Data(co2Data, selectedYear);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

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
      />

      <p className={styles.summary}>
        Displaying data for {processedCountries.length} countries.
      </p>

      <CountryList countries={processedCountries} />
    </div>
  );
};

export default Dashboard;
