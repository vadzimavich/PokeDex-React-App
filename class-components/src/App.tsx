import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.tsx';
import { routes } from './router.tsx';

const browserRouter = createBrowserRouter(routes);

const App = () => (
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={browserRouter} />
    </ErrorBoundary>
  </StrictMode>
);

export default App;
