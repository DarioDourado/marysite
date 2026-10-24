import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { PageSlug } from '@/src/types/cms/index.ts';
import { mediaUrl } from '@/src/lib/cms/mediaUrl.ts';
import { htmlLangFor, setCanonical, setMeta, setRobotsFor } from '@/src/lib/seo/head.ts';
import { useCms } from './useCms.ts';

/** Aplica o SEO da página (título, descrição, canonical e partilha) no idioma ativo. */
export const useSeo = (slug: PageSlug): void => {
  const { pages, config } = useCms();
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const seo = pages[slug].seo;
  const language = (i18n.resolvedLanguage ?? config.defaultLang).split('-')[0] ?? config.defaultLang;
  const entry = seo[language] ?? seo[config.defaultLang];

  const ogImage = pages[slug].ogImage;

  useEffect(() => {
    document.documentElement.lang = htmlLangFor(language);
    const canonical = setCanonical(pathname);
    setMeta('property', 'og:url', canonical);
    setRobotsFor(pathname);
    if (entry?.title) {
      document.title = entry.title;
      setMeta('property', 'og:title', entry.title);
      setMeta('name', 'twitter:title', entry.title);
    }
    if (entry?.description) {
      setMeta('name', 'description', entry.description);
      setMeta('property', 'og:description', entry.description);
      setMeta('name', 'twitter:description', entry.description);
    }
    if (ogImage) {
      const absolute = `${window.location.origin}${mediaUrl(ogImage.url)}`;
      setMeta('property', 'og:image', absolute);
      setMeta('name', 'twitter:image', absolute);
    }
  }, [entry, ogImage, language, pathname]);
};
