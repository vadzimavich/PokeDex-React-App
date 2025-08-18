'use client';

import styles from './Pagination.module.css';

interface PaginationProps {
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentPage: number;
  totalPagesText: string;
  prevText: string;
  nextText: string;
}

const Pagination = ({
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  totalPagesText,
  prevText,
  nextText,
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
        {prevText}
      </button>
      <span>{totalPagesText}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!hasNext}
      >
        {nextText}
      </button>
    </div>
  );
};

export default Pagination;
