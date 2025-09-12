import styles from './Flyout.module.css';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import { convertToCSV, downloadCSV } from '../../utils/csvConverter';

const Flyout = () => {
  const { selectedPokemons, unselectAll } = useSelectedItemsStore();
  const selectedCount = selectedPokemons.length;

  const handleDownload = () => {
    if (selectedCount === 0) return;

    const csvData = convertToCSV(selectedPokemons);
    const fileName = `${selectedCount}_pokemons.csv`;
    downloadCSV(csvData, fileName);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={styles.flyout}>
      <span className={styles.infoText}>
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </span>
      <div className={styles.actions}>
        <button className={styles.unselectButton} onClick={unselectAll}>
          Unselect all
        </button>
        <button className={styles.downloadButton} onClick={handleDownload}>
          Download
        </button>
      </div>
    </div>
  );
};

export default Flyout;
