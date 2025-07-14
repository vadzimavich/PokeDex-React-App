import { Component } from 'react';
import styles from './Pagination.module.css';

interface PaginationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentPage: number;
  totalPages: number;
}

class Pagination extends Component<PaginationProps> {
  render() {
    const { onPrev, onNext, hasPrev, hasNext, currentPage, totalPages } =
      this.props;

    return (
      <div className={styles.pagination}>
        <button onClick={onPrev} disabled={!hasPrev}>
          ← Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={onNext} disabled={!hasNext}>
          Next →
        </button>
      </div>
    );
  }
}

export default Pagination;
