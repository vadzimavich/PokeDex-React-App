import { Suspense, useState, useRef } from 'react';
import { createCo2DataResource } from './services/co2Service';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import { DataSourceSelector } from './components/DataSourceSelector/DataSourceSelector';
import Dashboard from './components/Dashboard/Dashboard';

type Co2Resource = ReturnType<typeof createCo2DataResource>;

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
