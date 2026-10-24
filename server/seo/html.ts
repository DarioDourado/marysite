import { escapeHtml, htmlToText, safeJson } from './escape.ts';
import { listAt, textAt, type SeoContent } from './content.ts';
import { absolute, areaList, type PageMeta } from './meta.ts';
import type { Classified } from './routes.ts';

const tag = (name: string, attrs: Record<string, string>): string =>
  `<${name} ${Object.entries(attrs).map(([k, v]) => `${k}="${escapeHtml(v)}"`).join(' ')}>`;

export const headTags = (meta: PageMeta, jsonLd: unknown | null, indexablePaths: string[]): string => {
  const lines = [
    `<title>${escapeHtml(meta.title)}</title>`,
    tag('meta', { name: 'description', content: meta.description }),
    tag('meta', { name: 'robots', content: meta.robots }),
    tag('meta', { name: 'seo-indexable', content: indexablePaths.join(',') }),
  ];
  // Páginas fora do índice (gestão, 404) não declaram canonical nem dados de partilha
  if (meta.canonical) {
    lines.push(
      tag('link', { rel: 'canonical', href: meta.canonical }),
      tag('meta', { property: 'og:type', content: 'website' }),
      tag('meta', { property: 'og:site_name', content: meta.siteName }),
      tag('meta', { property: 'og:locale', content: meta.ogLocale }),
      tag('meta', { property: 'og:title', content: meta.title }),
      tag('meta', { property: 'og:description', content: meta.description }),
      tag('meta', { property: 'og:url', content: meta.canonical }),
      tag('meta', { name: 'twitter:card', content: meta.image ? 'summary_large_image' : 'summary' }),
      tag('meta', { name: 'twitter:title', content: meta.title }),
      tag('meta', { name: 'twitter:description', content: meta.description }),
    );
    if (meta.image) {
      lines.push(
        tag('meta', { property: 'og:image', content: meta.image.url }),
        tag('meta', { property: 'og:image:alt', content: meta.image.alt }),
        tag('meta', { name: 'twitter:image', content: meta.image.url }),
      );
    }
  }
  if (jsonLd) lines.push(`<script type="application/ld+json">${safeJson(jsonLd)}</script>`);
  return lines.join('\n    ');
};

const p = (text: string): string => (text ? `<p>${escapeHtml(text)}</p>` : '');
const h = (level: 1 | 2 | 3, text: string): string => (text ? `<h${level}>${escapeHtml(text)}</h${level}>` : '');
const ul = (items: string[]): string =>
  items.length ? `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>` : '';
const strings = (content: SeoContent, path: string): string[] =>
  listAt(content.texts, path).filter((v): v is string => typeof v === 'string' && v !== '');

const navigation = (content: SeoContent, siteUrl: string): string => {
  const t = (path: string) => textAt(content.texts, path);
  const links: Array<[string, string]> = [
    ['/', t('nav.home')],
    ['/areas', t('nav.areas')],
    ['/blog', t('nav.blog')],
  ];
  return `<nav>${links.map(([href, label]) => `<a href="${escapeHtml(absolute(siteUrl, href))}">${escapeHtml(label)}</a>`).join(' ')}</nav>`;
};

const homeBody = (content: SeoContent): string => {
  const t = (path: string) => textAt(content.texts, path);
  const faq = listAt(content.texts, 'faq.items').map((raw) => {
    const item = raw as { question?: string; answer?: string };
    return `${h(3, item.question ?? '')}${p(htmlToText(item.answer ?? ''))}`;
  });
  return [
    h(1, t('hero.title')), p(t('hero.subtitle')),
    h(2, t('hero.welcomeTitle')), p(t('hero.welcomeText')), p(t('hero.ctaInvitation')),
    h(2, t('about.title')), ...strings(content, 'about.intro').map(p),
    h(2, t('about.educationTitle')), ...strings(content, 'about.education').map(p),
    h(2, t('areas.title')), p(t('areas.intro')),
    ul(areaList(content).map((a) => `${a.title}: ${a.summary}`)),
    h(2, t('faq.title')), ...faq,
    h(2, t('approach.title')), ...strings(content, 'approach.intro').map(p), ...strings(content, 'approach.closing').map(p),
    h(2, t('booking.title')), p(t('booking.text')),
    h(2, t('contacts.title')), p(t('contacts.questions')),
    p(`${t('contacts.emailLabel')}: ${t('contacts.email')}`), p(`${t('contacts.whatsappLabel')}: ${t('contacts.whatsapp')}`),
  ].join('\n');
};

const areasBody = (content: SeoContent): string => {
  const t = (path: string) => textAt(content.texts, path);
  const sections = areaList(content).map((a) =>
    `<section id="${escapeHtml(a.slug)}">${h(2, a.title)}${h(3, t('areasPage.whatIs'))}${p(a.whatIs)}${h(3, t('areasPage.signs'))}${ul(a.signs)}${h(3, t('areasPage.help'))}${p(a.help)}</section>`);
  return [h(1, t('areasPage.title')), p(t('areasPage.intro')), p(t('areasPage.navIntro')), ...sections].join('\n');
};

const blogBody = (content: SeoContent): string => {
  const t = (path: string) => textAt(content.texts, path);
  return [h(1, t('blog.title')), p(t('blog.intro'))].join('\n');
};

/**
 * Conteúdo equivalente em HTML simples para quem não executa JavaScript
 * (robôs de pré-visualização, leitores simples). O `<noscript>` nunca aparece com JavaScript ativo,
 * por isso não altera o aspeto do site.
 */
export const noscriptBlock = (classified: Classified, content: SeoContent | null, siteUrl: string): string => {
  if (!content || classified.kind !== 'public' || !classified.route) return '';
  const body = classified.route.slug === 'home' ? homeBody(content) : classified.route.slug === 'areas' ? areasBody(content) : blogBody(content);
  return `<noscript><main>\n${navigation(content, siteUrl)}\n${body}\n</main></noscript>`;
};

export const injectIntoTemplate = (template: string, meta: PageMeta, head: string, noscript: string): string =>
  template
    .replace(/<html lang="[^"]*"/, `<html lang="${escapeHtml(meta.htmlLang)}"`)
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace('</head>', () => `  ${head}\n  </head>`)
    .replace('<div id="root"></div>', () => `<div id="root"></div>${noscript ? `\n    ${noscript}` : ''}`);
