import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { browserRouter } from './router.tsx';
import Flyout from './components/Flyout/Flyout.tsx';

const App = () => {
  return (
    <StrictMode>
      <ErrorBoundary>
        <div className="app-container">
          <RouterProvider router={browserRouter} />
          <Flyout />
        </div>
      </ErrorBoundary>
    </StrictMode>
  );
};

export default App;
