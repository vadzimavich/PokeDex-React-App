import styles from './Controls.module.css';

const Controls = () => {
  return (
    <div className={styles.controlsContainer}>
      <input
        type="search"
        placeholder="Search by country name..."
        className={styles.searchInput}
      />
      <div className={styles.selectors}>
        <select className={styles.select}>
          <option value="">Sort by Population (desc)</option>
          <option value="">Sort by Population (asc)</option>
          <option value="">Sort by Name (A-Z)</option>
          <option value="">Sort by Name (Z-A)</option>
        </select>
        <select className={styles.select}>
          <option value="">Filter by Region</option>
        </select>
        <select className={styles.select}>
          <option value="">Select Year</option>
        </select>
      </div>
    </div>
  );
};

export default Controls;
