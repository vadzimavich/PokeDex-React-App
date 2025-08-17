import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary.tsx';
import { browserRouter } from './router.tsx';
import { useSelectedItemsStore } from './store/selectedItemsStore.ts';
import Flyout from '../components/Flyout/Flyout.tsx';
import { convertToCSV, downloadCSV } from './utils/csvConverter.ts';

const App = () => {
  const { selectedPokemons, unselectAll } = useSelectedItemsStore();
  const selectedCount = selectedPokemons.length;

  const handleDownload = () => {
    if (selectedCount === 0) return;

    const csvData = convertToCSV(selectedPokemons);
    const fileName = `${selectedCount}_pokemons.csv`;
    downloadCSV(csvData, fileName);
  };

  return (
    <StrictMode>
      <ErrorBoundary>
        <div className="app-container">
          <RouterProvider router={browserRouter} />

          {selectedCount > 0 && (
            <Flyout
              selectedCount={selectedCount}
              onUnselectAll={unselectAll}
              onDownload={handleDownload}
            />
          )}
        </div>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;
