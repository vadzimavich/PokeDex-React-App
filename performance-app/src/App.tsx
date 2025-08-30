import { Suspense, useState, useMemo, useRef } from 'react';
import { createCo2DataResource } from './services/co2Service';
import { type Co2Data } from './types/co2Data';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';

const Dashboard = ({
  resource,
}: {
  resource: ReturnType<typeof createCo2DataResource>;
}) => {
  const co2Data: Co2Data = resource.read();
  const countryCount = Object.keys(co2Data).length;

  return (
    <div>
      <h1>CO2 Emissions Data</h1>
      <p>Data loaded successfully for {countryCount} countries/regions.</p>
    </div>
  );
};

function App() {
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  const progressRef = useRef({ loaded: 0, total: 0 });
  const animationFrameId = useRef<number | null>(null);
  const resource = useMemo(() => {
    const onProgress = (loaded: number, total: number) => {
      progressRef.current = { loaded, total };
      if (animationFrameId.current === null) {
        animationFrameId.current = requestAnimationFrame(() => {
          setProgress(progressRef.current);
          animationFrameId.current = null;
        });
      }
    };
    return createCo2DataResource(onProgress);
  }, []);

  return (
    <main className="main-container">
      <Suspense
        fallback={
          <LoadingSpinner loaded={progress.loaded} total={progress.total} />
        }
      >
        <Dashboard resource={resource} />
      </Suspense>
    </main>
  );
}

export default App;
