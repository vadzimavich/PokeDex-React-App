import styles from './Flyout.module.css';

interface FlyoutProps {
  selectedCount: number;
  onUnselectAll: () => void;
  onDownload: () => void;
}

const Flyout = ({ selectedCount, onUnselectAll, onDownload }: FlyoutProps) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={styles.flyout}>
      <span className={styles.infoText}>
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </span>
      <div className={styles.actions}>
        <button className={styles.unselectButton} onClick={onUnselectAll}>
          Unselect all
        </button>
        <button className={styles.downloadButton} onClick={onDownload}>
          Download
        </button>
      </div>
    </div>
  );
};

export default Flyout;
