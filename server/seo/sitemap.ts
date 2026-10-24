import { escapeHtml } from './escape.ts';
import { absolute } from './meta.ts';
import type { PublicRoute } from './routes.ts';

export const robotsTxt = (siteUrl: string): string =>
  ['User-agent: *', 'Allow: /', 'Disallow: /admin/', 'Disallow: /api/', '', `Sitemap: ${absolute(siteUrl, '/sitemap.xml')}`, ''].join('\n');

export const sitemapXml = (siteUrl: string, routes: PublicRoute[]): string => {
  const urls = routes
    .filter((r) => r.indexable)
    .map((r) => `  <url><loc>${escapeHtml(absolute(siteUrl, r.path))}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};
