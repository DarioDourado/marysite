import { listAt, textAt, type SeoContent } from './content.ts';
import type { Classified } from './routes.ts';

export interface PageMeta {
  title: string;
  description: string;
  canonical: string | null;
  robots: string;
  siteName: string;
  htmlLang: string;
  ogLocale: string;
  image: { url: string; alt: string } | null;
}

export const FALLBACK = {
  title: 'Mariline Bôto · Psicóloga Clínica',
  description:
    'Psicoterapia online com a psicóloga clínica Mariline Bôto. Marque a sua consulta num espaço seguro e acolhedor.',
  siteName: 'Mariline Bôto',
} as const;

const NOT_FOUND = { title: 'Página não encontrada · Mariline Bôto', description: 'A página que procura não existe.' };
const ADMIN = { title: 'Área de gestão · Mariline Bôto', description: 'Área reservada.' };

const LOCALES: Record<string, { html: string; og: string }> = {
  pt: { html: 'pt-PT', og: 'pt_PT' },
  en: { html: 'en', og: 'en_GB' },
};

export const absolute = (siteUrl: string, path: string): string =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path === '/' ? '/' : path}`;

const imageFor = (content: SeoContent | null, siteUrl: string, slug: 'home' | 'areas' | 'blog') => {
  if (!content) return null;
  const own = content.pages[slug].ogImage ?? content.pages.site.ogImage;
  const fallback = content.images['hero.photo'];
  const image = own ?? fallback;
  return image ? { url: absolute(siteUrl, image.url), alt: image.alt || textAt(content.texts, 'hero.imageAlt') } : null;
};

export const buildMeta = (classified: Classified, pathname: string, siteUrl: string, content: SeoContent | null): PageMeta => {
  const lang = content?.config.defaultLang ?? 'pt';
  const locale = LOCALES[lang] ?? { html: lang, og: lang };
  const siteName = (content && textAt(content.texts, 'brand.name')) || FALLBACK.siteName;
  const base = { siteName, htmlLang: locale.html, ogLocale: locale.og };

  if (classified.kind === 'admin') {
    return { ...ADMIN, canonical: null, robots: 'noindex, nofollow', image: null, ...base };
  }
  if (classified.kind === 'unknown' || !classified.route) {
    return { ...NOT_FOUND, canonical: null, robots: 'noindex, follow', image: null, ...base };
  }

  const { route } = classified;
  const seo = content?.pages[route.slug].seo;
  const entry = seo?.[lang] ?? (seo ? Object.values(seo)[0] : undefined);
  const site = content?.pages.site.seo[lang];
  return {
    title: entry?.title || site?.title || FALLBACK.title,
    description: entry?.description || site?.description || FALLBACK.description,
    canonical: absolute(siteUrl, pathname),
    robots: route.indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    image: imageFor(content, siteUrl, route.slug),
    ...base,
  };
};

export const areaList = (content: SeoContent) =>
  listAt(content.texts, 'areaPages').flatMap((raw) => {
    const area = raw as Record<string, unknown>;
    const slug = typeof area.slug === 'string' ? area.slug : '';
    const title = typeof area.title === 'string' ? area.title : '';
    if (!slug || !title) return [];
    return [{
      slug,
      title,
      summary: typeof area.summary === 'string' ? area.summary : '',
      whatIs: typeof area.whatIs === 'string' ? area.whatIs : '',
      help: typeof area.help === 'string' ? area.help : '',
      signs: Array.isArray(area.signs) ? area.signs.filter((s): s is string => typeof s === 'string') : [],
    }];
  });
