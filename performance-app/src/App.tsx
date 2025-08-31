import { Suspense, useState, useMemo, useRef } from 'react';
import { createCo2DataResource } from './services/co2Service';
import { type Co2Data } from './types/co2Data';
import { processCo2Data } from './utils/dataProcessor';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import CountryList from './components/CountryList/CountryList';
import { DataSourceSelector } from './components/DataSourceSelector/DataSourceSelector';

type Co2Resource = ReturnType<typeof createCo2DataResource>;

const Dashboard = ({
  resource,
  onReset,
}: {
  resource: Co2Resource;
  onReset: () => void;
}) => {
  const co2Data: Co2Data = resource.read();
  const processedCountries = useMemo(() => processCo2Data(co2Data), [co2Data]);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-lg)',
        }}
      >
        <h1>CO2 Emissions by Country</h1>
        <button
          onClick={onReset}
          style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text)',
            padding: 'var(--space-sm) var(--space-md)',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
          }}
        >
          Reset Data Source
        </button>
      </div>
      <p>Displaying data for {processedCountries.length} countries.</p>
      <CountryList countries={processedCountries} />
    </div>
  );
};

function App() {
  const [resource, setResource] = useState<Co2Resource | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  const progressRef = useRef({ loaded: 0, total: 0 });
  const animationFrameId = useRef<number | null>(null);

  const handleResourceCreated = (newResource: Co2Resource) => {
    if (newResource.read.toString().includes('suspender')) {
      const onProgress = (loaded: number, total: number) => {
        progressRef.current = { loaded, total };
        if (animationFrameId.current === null) {
          animationFrameId.current = requestAnimationFrame(() => {
            setProgress(progressRef.current);
            animationFrameId.current = null;
          });
        }
      };
      setResource(createCo2DataResource(onProgress));
    } else {
      setResource(newResource);
    }
  };

  const handleReset = () => {
    setResource(null);
    setProgress({ loaded: 0, total: 0 });
  };

  return (
    <main className="main-container">
      {!resource ? (
        <DataSourceSelector onResourceCreated={handleResourceCreated} />
      ) : (
        <Suspense
          fallback={
            <LoadingSpinner loaded={progress.loaded} total={progress.total} />
          }
        >
          <Dashboard resource={resource} onReset={handleReset} />
        </Suspense>
      )}
    </main>
  );
}

export default App;
