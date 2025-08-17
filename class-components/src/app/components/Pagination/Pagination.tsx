'use client';

import styles from './Pagination.module.css';

interface PaginationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentPage: number;
  totalPagesText: string;
}

const Pagination = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  totalPagesText,
}: PaginationProps) => {
  return (
    <div className={styles.pagination}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        disabled={!hasPrev}
      >
        ← Prev
      </button>
      <span>{totalPagesText}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!hasNext}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;
