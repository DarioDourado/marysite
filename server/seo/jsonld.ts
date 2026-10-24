import { listAt, textAt, type SeoContent } from './content.ts';
import { absolute, areaList, type PageMeta } from './meta.ts';
import type { Classified } from './routes.ts';

type Node = Record<string, unknown>;

const clean = (node: Node): Node =>
  Object.fromEntries(Object.entries(node).filter(([, v]) => v !== '' && v !== undefined && v !== null && !(Array.isArray(v) && v.length === 0)));

const phone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '');
  return digits ? `+${digits}` : '';
};

const socialUrls = (content: SeoContent): string[] =>
  listAt(content.texts, 'footer.social')
    .map((s) => (s as { url?: unknown }).url)
    .filter((u): u is string => typeof u === 'string' && /^https?:\/\//.test(u));

/**
 * Grafo schema.org só com dados que existem no site:
 * nada de avaliações, preços, moradas ou redes sociais inventados.
 */
export const buildJsonLd = (classified: Classified, meta: PageMeta, siteUrl: string, content: SeoContent | null): Node | null => {
  if (!content || classified.kind !== 'public' || !classified.route || !meta.canonical) return null;
  const t = (path: string) => textAt(content.texts, path);
  const home = absolute(siteUrl, '/');
  const logo = content.images['brand.logo'];
  const photo = content.images['hero.photo'];
  const areas = areaList(content);

  const business = clean({
    '@type': 'ProfessionalService',
    '@id': `${home}#business`,
    name: t('brand.name'),
    description: t('footer.description'),
    url: home,
    image: photo ? absolute(siteUrl, photo.url) : undefined,
    logo: logo ? absolute(siteUrl, logo.url) : undefined,
    email: t('contacts.email'),
    telephone: phone(t('whatsapp.number')),
    areaServed: t('footer.location'),
    knowsAbout: areas.map((a) => a.title),
    founder: { '@id': `${home}#person` },
    sameAs: socialUrls(content),
    inLanguage: meta.htmlLang,
  });
  const person = clean({
    '@type': 'Person',
    '@id': `${home}#person`,
    name: t('brand.name'),
    jobTitle: 'Psicóloga Clínica',
    image: photo ? absolute(siteUrl, photo.url) : undefined,
    url: home,
    worksFor: { '@id': `${home}#business` },
  });
  const website = {
    '@type': 'WebSite',
    '@id': `${home}#website`,
    url: home,
    name: t('brand.name'),
    inLanguage: meta.htmlLang,
    publisher: { '@id': `${home}#business` },
  };
  const page = clean({
    '@type': 'WebPage',
    '@id': `${meta.canonical}#webpage`,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    inLanguage: meta.htmlLang,
    isPartOf: { '@id': `${home}#website` },
    about: { '@id': `${home}#business` },
    primaryImageOfPage: meta.image ? { '@type': 'ImageObject', url: meta.image.url } : undefined,
    breadcrumb: classified.route.path === '/' ? undefined : { '@id': `${meta.canonical}#breadcrumb` },
  });

  const graph: Node[] = [business, person, website, page];

  if (classified.route.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${meta.canonical}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: t('nav.home'), item: home },
        { '@type': 'ListItem', position: 2, name: t(classified.route.slug === 'areas' ? 'areasPage.title' : 'blog.title'), item: meta.canonical },
      ],
    });
  }

  if (classified.route.slug === 'areas') {
    for (const area of areas) {
      graph.push(clean({
        '@type': 'Service',
        '@id': `${meta.canonical}#${area.slug}`,
        name: area.title,
        serviceType: area.title,
        description: area.summary || area.whatIs,
        url: `${meta.canonical}#${area.slug}`,
        provider: { '@id': `${home}#business` },
      }));
    }
  }

  return { '@context': 'https://schema.org', '@graph': graph };
};
