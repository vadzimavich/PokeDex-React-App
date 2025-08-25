'use client';

import { useEffect } from 'react';
import { type StoredFormData } from '@/app/store/formStore';
import styles from './DataCard.module.css';

interface DataCardProps {
  data: StoredFormData;
  isNew: boolean;
  onClearNew: () => void;
}

export default function DataCard({ data, isNew, onClearNew }: DataCardProps) {
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        onClearNew();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isNew, onClearNew]);

  return (
    <div className={`${styles.card} ${isNew ? styles.new : ''}`}>
      <h4 className={styles.name}>{data.name}</h4>
      <p>Age: {data.age}</p>
      <p>Email: {data.email}</p>
      <p>Country: {data.country}</p>
      <p>Gender: {data.gender}</p>
      {data.picture && (
        <img src={data.picture} alt={data.name} className={styles.picture} />
      )}
    </div>
  );
}
