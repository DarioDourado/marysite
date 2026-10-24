import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { PageSlug } from '@/src/types/cms/index.ts';
import { mediaUrl } from '@/src/lib/cms/mediaUrl.ts';
import { useCms } from './useCms.ts';

const setMeta = (attribute: 'name' | 'property', key: string, content: string): void => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const setDescription = (content: string): void => setMeta('name', 'description', content);

/** Aplica o SEO da página (título e descrição) no idioma ativo. */
export const useSeo = (slug: PageSlug): void => {
  const { pages, config } = useCms();
  const { i18n } = useTranslation();
  const seo = pages[slug].seo;
  const language = (i18n.resolvedLanguage ?? config.defaultLang).split('-')[0] ?? config.defaultLang;
  const entry = seo[language] ?? seo[config.defaultLang];

  const ogImage = pages[slug].ogImage;

  useEffect(() => {
    if (entry?.title) {
      document.title = entry.title;
      setMeta('property', 'og:title', entry.title);
    }
    if (entry?.description) {
      setDescription(entry.description);
      setMeta('property', 'og:description', entry.description);
    }
    if (ogImage) setMeta('property', 'og:image', `${window.location.origin}${mediaUrl(ogImage.url)}`);
  }, [entry, ogImage]);
};
