import type { Request } from 'express';
import { createContentLoader, type ContentLoader } from './content.ts';
import { headTags, injectIntoTemplate, noscriptBlock } from './html.ts';
import { buildJsonLd } from './jsonld.ts';
import { buildMeta } from './meta.ts';
import { canonicalPath, classify, publicRoutes } from './routes.ts';
import { robotsTxt, sitemapXml } from './sitemap.ts';

export { canonicalPath, canonicalRedirect } from './routes.ts';

export interface SeoOptions {
  siteUrl?: string | undefined;
  apiBase?: string | undefined;
  indexBlog?: boolean | undefined;
  loader?: ContentLoader | undefined;
}

export interface RenderResult {
  html: string;
  status: 200 | 404;
  robots: string;
}

const HOST = /^[a-z0-9.-]+(:\d{1,5})?$/i;

export const createSeo = (options: SeoOptions) => {
  const routes = publicRoutes({ indexBlog: options.indexBlog ?? false });
  const loadContent = options.loader ?? createContentLoader(options.apiBase);
  const configuredUrl = options.siteUrl?.replace(/\/+$/, '');

  // Sem SITE_URL deduz-se do pedido, só com hosts bem formados (nunca refletir um Host arbitrário).
  const siteUrlFor = (req: Pick<Request, 'protocol' | 'get'>): string => {
    if (configuredUrl) return configuredUrl;
    const host = req.get('host') ?? '';
    return HOST.test(host) ? `${req.protocol}://${host}` : 'http://localhost';
  };

  return {
    configuredUrl,
    routes,
    robots: (req: Pick<Request, 'protocol' | 'get'>) => robotsTxt(siteUrlFor(req)),
    sitemap: (req: Pick<Request, 'protocol' | 'get'>) => sitemapXml(siteUrlFor(req), routes),
    async render(template: string, req: Pick<Request, 'protocol' | 'get'>, pathname: string): Promise<RenderResult> {
      const siteUrl = siteUrlFor(req);
      const classified = classify(pathname, routes);
      const content = await loadContent();
      const meta = buildMeta(classified, pathname, siteUrl, content);
      const head = headTags(meta, buildJsonLd(classified, meta, siteUrl, content), routes.filter((r) => r.indexable).map((r) => r.path));
      const html = injectIntoTemplate(template, meta, head, noscriptBlock(classified, content, siteUrl));
      return { html, status: classified.kind === 'unknown' ? 404 : 200, robots: meta.robots };
    },
  };
};
