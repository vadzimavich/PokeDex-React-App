import { type RouteObject } from 'react-router-dom';
import Layout from './components/Layout/Layout.tsx';
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import PokemonDetailView from './components/PokemonDetailView/PokemonDetailView.tsx';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          {
            path: 'details/:pokemonId',
            element: <PokemonDetailView />,
          },
        ],
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
    ],
  },
];
