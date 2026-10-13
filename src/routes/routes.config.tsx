import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Layout } from '@/src/components/layout/Layout.tsx';

const Home = lazy(() => import('@/src/pages/Home/Home.tsx').then((m) => ({ default: m.Home })));
const Blog = lazy(() => import('@/src/pages/Blog/Blog.tsx').then((m) => ({ default: m.Blog })));

const withSuspense = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<div className="min-h-screen" />}>
    <Component />
  </Suspense>
);

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: withSuspense(Home) },
      { path: 'blog', element: withSuspense(Blog) },
    ],
  },
];
