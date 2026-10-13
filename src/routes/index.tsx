import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes.config.tsx';

const router = createBrowserRouter(routes);

export const AppRouter = () => <RouterProvider router={router} />;
