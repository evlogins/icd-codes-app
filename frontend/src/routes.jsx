import Layout from './Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import CodePage from './pages/CodePage';
import NotFoundPage from './pages/NotFoundPage';
import { allCodes } from './data/codes';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      {
        path: 'code/:code',
        element: <CodePage />,
        getStaticPaths: () => allCodes().map((c) => `/code/${c.code}`),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
