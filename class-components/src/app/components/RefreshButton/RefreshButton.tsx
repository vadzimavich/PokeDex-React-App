import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import styles from './RefreshButton.module.css';

const RefreshButton = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <button
      className={`${styles.refreshButton} ${isFetching ? styles.loading : ''}`}
      onClick={handleRefresh}
      disabled={!!isFetching}
      aria-label="Refresh data"
    >
      ⭮
    </button>
  );
};

export default RefreshButton;
