/** Rotas públicas conhecidas e classificação de pedidos para SEO. */

export interface PublicRoute {
  path: string;
  /** Página do CMS de onde vêm o título e a descrição. */
  slug: 'home' | 'areas' | 'blog';
  /** Se entra no sitemap e no índice. O blog fica fora enquanto não tiver artigos. */
  indexable: boolean;
}

export interface RouteOptions {
  indexBlog: boolean;
}

export const publicRoutes = ({ indexBlog }: RouteOptions): PublicRoute[] => [
  { path: '/', slug: 'home', indexable: true },
  { path: '/areas', slug: 'areas', indexable: true },
  { path: '/blog', slug: 'blog', indexable: indexBlog },
];

export type RouteKind = 'public' | 'admin' | 'unknown';

export interface Classified {
  kind: RouteKind;
  route?: PublicRoute;
}

export const classify = (pathname: string, routes: PublicRoute[]): Classified => {
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return { kind: 'admin' };
  const route = routes.find((r) => r.path === pathname);
  return route ? { kind: 'public', route } : { kind: 'unknown' };
};

/** `/areas/` -> `/areas`; devolve null quando o caminho já está na forma canónica. */
export const canonicalPath = (pathname: string): string | null => {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.replace(/\/+$/, '') || '/';
  return null;
};

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

/** Devolve o destino do redirecionamento 301, ou null se o pedido já está na forma canónica. */
export function canonicalRedirect(
  pathname: string,
  originalUrl: string,
  hostname: string,
  protocol: string,
  siteUrl: string | undefined,
  isProduction: boolean,
): string | null {
  const query = originalUrl.includes('?') ? originalUrl.slice(originalUrl.indexOf('?')) : '';
  const slashless = canonicalPath(pathname);
  let origin = '';
  if (isProduction && siteUrl && !LOCAL_HOSTS.has(hostname)) {
    const canonical = new URL(siteUrl);
    if (hostname !== canonical.hostname || protocol !== canonical.protocol.replace(':', '')) origin = canonical.origin;
  }
  if (!slashless && !origin) return null;
  return `${origin}${slashless ?? pathname}${query}`;
}
