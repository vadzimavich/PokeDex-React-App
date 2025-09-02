import { useState } from 'react';
import { createCo2DataResource } from '../../services/co2Service';
import LocalFilePicker from '../LocalFilePicker/LocalFilePicker';
import { type Co2Data } from '../../types/co2Data';
import styles from './DataSourceSelector.module.css';

type Co2Resource = ReturnType<typeof createCo2DataResource>;

interface DataSourceSelectorProps {
  onResourceCreated: (resource: Co2Resource) => void;
}

const createResolvedResource = (data: Co2Data): Co2Resource => ({
  read: () => data,
});

export const DataSourceSelector = ({
  onResourceCreated,
}: DataSourceSelectorProps) => {
  const [isPickingLocalFile, setIsPickingLocalFile] = useState(false);

  const handleDownload = () => {
    const resource = createCo2DataResource(() => {});
    onResourceCreated(resource);
  };

  const handleLocalFileLoad = (data: Co2Data) => {
    const resource = createResolvedResource(data);
    onResourceCreated(resource);
  };

  if (isPickingLocalFile) {
    return (
      <LocalFilePicker
        onDataLoaded={handleLocalFileLoad}
        onCancel={() => setIsPickingLocalFile(false)}
      />
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Data Source</h1>
      <div className={styles.buttonGroup}>
        <button onClick={handleDownload} className={styles.button}>
          Download & Cache Data
          <small>Recommended, ~100MB</small>
        </button>
        <button
          onClick={() => setIsPickingLocalFile(true)}
          className={styles.button}
        >
          Load From Local File
          <small>If you have `owid-co2-data.json`</small>
        </button>
      </div>
    </div>
  );
};
