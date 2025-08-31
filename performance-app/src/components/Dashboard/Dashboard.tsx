import { type Co2Data } from '../../types/co2Data';
import { processCo2Data } from '../../utils/dataProcessor';
import Controls from '../Controls/Controls';
import CountryList from '../CountryList/CountryList';
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
  const processedCountries = processCo2Data(co2Data);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>CO₂ Emissions by Country</h1>
        <button onClick={onReset} className={styles.resetButton}>
          Reset Data Source
        </button>
      </header>

      <Controls />

      <p className={styles.summary}>
        Displaying data for {processedCountries.length} countries.
      </p>

      <CountryList countries={processedCountries} />
    </div>
  );
};

export default Dashboard;
