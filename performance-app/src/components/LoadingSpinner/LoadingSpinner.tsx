import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  loaded: number;
  total: number;
}

const LoadingSpinner = ({ loaded, total }: LoadingSpinnerProps) => {
  const loadedInKb = (loaded / 1024).toFixed(0);
  const totalInKb = (total / 1024).toFixed(0);

  return (
    <div className={styles.spinnerOverlay}>
      <div className={styles.spinner}></div>
      <p>Loading data...</p>
      {total > 0 && (
        <p className={styles.progressText}>
          {loadedInKb} KB / {totalInKb} KB
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
