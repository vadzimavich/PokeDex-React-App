import { type YearData } from '../../types/co2Data';
import styles from './YearlyDataTable.module.css';

interface YearlyDataTableProps {
  data: YearData[];
}

const YearlyDataTable = ({ data }: YearlyDataTableProps) => {
  const reversedData = [...data].reverse();

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Population</th>
            <th>CO₂ (total)</th>
            <th>CO₂ (per capita)</th>
          </tr>
        </thead>
        <tbody>
          {reversedData.map((yearData) => (
            <tr key={yearData.year}>
              <td>{yearData.year}</td>
              <td>{yearData.population?.toLocaleString() ?? 'N/A'}</td>
              <td>{yearData.co2?.toFixed(3) ?? 'N/A'}</td>
              <td>{yearData.co2_per_capita?.toFixed(3) ?? 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YearlyDataTable;
