import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import type { ReactElement } from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { EditModeContext, type EditModeValue } from '@/src/components/cms/EditModeContext.ts';
import { buildAdminIndex } from '@/src/lib/cms/adminIndex.ts';
import { buildBundle } from '@/src/lib/cms/bundle.ts';
import { CmsContext } from '@/src/lib/cms/CmsContext.ts';
import i18n from '@/src/lib/i18n.ts';
import type { ItemKind, ItemNode, PageResponse, SectionNode } from '@/src/types/cms/index.ts';

export const node = (key: string, kind: ItemKind, extra: Partial<ItemNode> = {}): ItemNode => ({
  id: `id-${key}-${extra.position ?? 0}`, key, kind, position: 0, isActive: true, version: 3,
  value: null, image: null, linkUrl: null, children: [], ...extra,
});
export const text = (key: string, pt: string, kind: ItemKind = 'text', extra: Partial<ItemNode> = {}) =>
  node(key, kind, { value: { pt }, ...extra });

export const section = (key: string, items: ItemNode[]): SectionNode => ({ id: `s-${key}`, key, type: 'object', items });
export const page = (slug: string, sections: SectionNode[]): PageResponse => ({ slug, seo: {}, ogImage: null, sections });

interface Options {
  pages: PageResponse[];
  /** Com `edit` ligado o índice de administração é o das mesmas páginas. */
  edit?: Partial<Pick<EditModeValue, 'enabled' | 'can' | 'notify'>>;
}

export function renderWithCms(ui: ReactElement, { pages, edit = {} }: Options) {
  const sections = pages.flatMap((p) => p.sections);
  const bundle = buildBundle(sections, { locale: 'pt', fallbackLocale: 'pt' });
  i18n.addResourceBundle('pt', 'translation', bundle.texts, false, true);
  void i18n.changeLanguage('pt');
  const cms = {
    config: { i18n: false, defaultLang: 'pt', locales: ['pt'] },
    pages: Object.fromEntries(pages.map((p) => [p.slug, p])) as never,
    images: bundle.images,
    kinds: bundle.kinds,
  };
  const enabled = edit.enabled ?? false;
  const value: EditModeValue = {
    enabled,
    setWanted: () => undefined,
    index: enabled ? buildAdminIndex(pages) : null,
    isLoading: false,
    locale: 'pt',
    can: edit.can ?? (() => true),
    notify: edit.notify ?? (() => undefined),
    toasts: [],
    registerAttr: () => undefined,
    getAttrPaths: () => [],
    attrOpen: false,
    setAttrOpen: () => undefined,
  };
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <CmsContext.Provider value={cms}>
            <EditModeContext.Provider value={value}>{ui}</EditModeContext.Provider>
          </CmsContext.Provider>
        </MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>,
  );
}
