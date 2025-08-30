import { Suspense, useState, useMemo, useRef } from 'react';
import { createCo2DataResource } from './services/co2Service';
import { type Co2Data } from './types/co2Data';
import { processCo2Data } from './utils/dataProcessor';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import CountryList from './components/CountryList/CountryList';

const Dashboard = ({
  resource,
}: {
  resource: ReturnType<typeof createCo2DataResource>;
}) => {
  const co2Data: Co2Data = resource.read();

  const processedCountries = processCo2Data(co2Data);

  return (
    <div>
      <h1>CO2 Emissions by Country</h1>
      <p>Displaying data for {processedCountries.length} countries.</p>
      <CountryList countries={processedCountries} />
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
