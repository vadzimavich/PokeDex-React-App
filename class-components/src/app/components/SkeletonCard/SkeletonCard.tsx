import styles from './SkeletonCard.module.css';

const SkeletonCard = () => {
  return (
    <div className={styles.card} data-testid="skeleton-card">
      <div className={styles.image}></div>
      <div className={styles.info}>
        <div className={styles.line}></div>
        <div className={`${styles.line} ${styles.short}`}></div>
        <div className={styles.types}>
          <div className={styles.type}></div>
          <div className={styles.type}></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
