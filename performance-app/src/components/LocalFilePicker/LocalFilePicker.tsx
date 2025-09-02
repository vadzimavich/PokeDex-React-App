import { useState, type ChangeEvent, useRef, useEffect } from 'react';
import { type Co2Data } from '../../types/co2Data';
import styles from './LocalFilePicker.module.css';

interface LocalFilePickerProps {
  onDataLoaded: (data: Co2Data) => void;
  onCancel: () => void;
}

const LocalFilePicker = ({ onDataLoaded, onCancel }: LocalFilePickerProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      onCancel();
      return;
    }

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as Co2Data;
        onDataLoaded(data);
      } catch (err) {
        setError('Failed to parse JSON file. Please ensure it is valid.');
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className={styles.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className={styles.input}
      />
      {isLoading && <p className={styles.status}>Parsing file...</p>}
      {error && (
        <>
          <p className={styles.error}>{error}</p>
          <button onClick={onCancel} className={styles.backButton}>
            &larr; Try Again
          </button>
        </>
      )}
    </div>
  );
};

export default LocalFilePicker;
