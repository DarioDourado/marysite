import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { Layout } from '@/src/components/layout/Layout.tsx';
import { RequireAuth } from '@/src/components/admin/RequireAuth.tsx';

const Home = lazy(() => import('@/src/pages/Home/Home.tsx').then((m) => ({ default: m.Home })));
const Blog = lazy(() => import('@/src/pages/Blog/Blog.tsx').then((m) => ({ default: m.Blog })));

const AdminLogin = lazy(() => import('@/src/pages/Admin/Login/index.ts').then((m) => ({ default: m.Login })));

const AdminMedia = lazy(() => import('@/src/pages/Admin/Media/index.ts').then((m) => ({ default: m.Media })));
const AdminSubmissions = lazy(() => import('@/src/pages/Admin/Submissions/index.ts').then((m) => ({ default: m.Submissions })));
const AdminSettings = lazy(() => import('@/src/pages/Admin/Settings/index.ts').then((m) => ({ default: m.Settings })));

const NotFound = lazy(() => import('@/src/pages/NotFound/NotFound.tsx').then((m) => ({ default: m.NotFound })));
const Areas = lazy(() => import('@/src/pages/Areas/Areas.tsx').then((m) => ({ default: m.Areas })));

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
      { path: 'areas', element: withSuspense(Areas) },
      { path: 'blog', element: withSuspense(Blog) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
  { path: '/admin/login', element: withSuspense(AdminLogin) },
  {
    path: '/admin/media',
    element: <RequireAuth capability="images">{withSuspense(AdminMedia)}</RequireAuth>,
  },
  {
    path: '/admin/submissions',
    element: <RequireAuth staffOnly>{withSuspense(AdminSubmissions)}</RequireAuth>,
  },
  {
    path: '/admin/settings',
    element: <RequireAuth superuserOnly>{withSuspense(AdminSettings)}</RequireAuth>,
  },
];
