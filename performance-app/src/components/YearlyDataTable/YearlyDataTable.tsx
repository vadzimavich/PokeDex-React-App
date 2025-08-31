import { COLUMN_LABELS } from '../../constants/data';
import { type YearData } from '../../types/co2Data';
import styles from './YearlyDataTable.module.css';

interface YearlyDataTableProps {
  data: YearData[];
  columns: string[];
}

const YearlyDataTable = ({ data, columns }: YearlyDataTableProps) => {
  const reversedData = [...data].reverse();

  const formatValue = (value: number | undefined) => {
    if (value === undefined || value === null) return 'N/A';
    return value > 1000 ? value.toLocaleString() : value.toFixed(3);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Year</th>
            {columns.map((col) => (
              <th key={col}>{COLUMN_LABELS[col] || col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reversedData.map((yearData) => (
            <tr key={yearData.year}>
              <td>{yearData.year}</td>
              {columns.map((col) => (
                <td key={col}>{formatValue(yearData[col])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default YearlyDataTable;
