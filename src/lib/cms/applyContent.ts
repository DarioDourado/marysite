import i18n from '@/src/lib/i18n.ts';
import { PAGE_SLUGS } from '@/src/types/cms/index.ts';
import { buildBundle } from './bundle.ts';
import type { CmsContextValue } from './CmsContext.ts';
import type { CmsContent } from './loadContent.ts';

/** Injeta o conteúdo no i18next: os componentes continuam a usar t('secção.chave'). */
export function applyContent({ config, pages }: CmsContent): CmsContextValue {
  const sections = PAGE_SLUGS.flatMap((slug) => pages[slug].sections);
  const fallbackLocale = config.defaultLang;
  for (const locale of config.locales) {
    const bundle = buildBundle(sections, { locale, fallbackLocale });
    // deep=false: cada secção é substituída por inteiro (um merge profundo deixaria itens apagados nos arrays)
    i18n.addResourceBundle(locale, 'translation', bundle.texts, false, true);
  }
  i18n.options.fallbackLng = [fallbackLocale];
  const { images, kinds } = buildBundle(sections, { locale: fallbackLocale, fallbackLocale });
  return { config, pages, images, kinds };
}
