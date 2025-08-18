'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useSelectedItemsStore } from '@/app/store/selectedItemsStore';
import { downloadCsvAction } from '@/app/actions';
import styles from './Flyout.module.css';

function downloadCSV(csvString: string, fileName: string): void {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Flyout() {
  const t = useTranslations('Flyout');
  const { selectedPokemons, unselectAll } = useSelectedItemsStore();
  const [isPending, startTransition] = useTransition();

  const selectedCount = selectedPokemons.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleDownload = () => {
    startTransition(async () => {
      const { csvData } = await downloadCsvAction(selectedPokemons);
      if (csvData) {
        downloadCSV(csvData, 'pokemons.csv');
      }
    });
  };

  return (
    <div className={styles.flyout}>
      <span className={styles.infoText}>
        {t('itemsSelected', { count: selectedCount })}
      </span>
      <div className={styles.actions}>
        <button className={styles.unselectButton} onClick={unselectAll}>
          {t('unselectAll')}
        </button>
        <button
          className={styles.downloadButton}
          onClick={handleDownload}
          disabled={isPending}
        >
          {isPending ? 'Generating...' : t('download')}
        </button>
      </div>
    </div>
  );
}
