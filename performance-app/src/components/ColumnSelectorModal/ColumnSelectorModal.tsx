import { AVAILABLE_COLUMNS, COLUMN_LABELS } from '../../constants/data';
import styles from './ColumnSelectorModal.module.css';

interface ColumnSelectorModalProps {
  selectedColumns: string[];
  onClose: () => void;
  onSave: (newColumns: string[]) => void;
}

const ColumnSelectorModal = ({
  selectedColumns,
  onClose,
  onSave,
}: ColumnSelectorModalProps) => {
  const handleCheckboxChange = (column: string, checked: boolean) => {
    const newSelection = checked
      ? [...selectedColumns, column]
      : selectedColumns.filter((c) => c !== column);
    onSave(newSelection);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Select Columns</h2>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </header>
        <div className={styles.grid}>
          {AVAILABLE_COLUMNS.map((column) => (
            <label key={column} className={styles.label}>
              <input
                type="checkbox"
                checked={selectedColumns.includes(column)}
                onChange={(e) => handleCheckboxChange(column, e.target.checked)}
              />
              {COLUMN_LABELS[column]}
            </label>
          ))}
        </div>
        <footer className={styles.footer}>
          <button onClick={onClose} className={styles.saveButton}>
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ColumnSelectorModal;
