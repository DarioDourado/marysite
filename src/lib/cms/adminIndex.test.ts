import { describe, expect, it } from 'vitest';
import { buildAdminIndex, resolveItem } from './adminIndex.ts';
import type { ItemKind, ItemNode, PageResponse } from '@/src/types/cms/index.ts';

const node = (key: string, kind: ItemKind, extra: Partial<ItemNode> = {}): ItemNode => ({
  id: `id-${key}`, key, kind, position: 0, isActive: true, version: 1,
  value: null, image: null, linkUrl: null, children: [], ...extra,
});
const page = (slug: string, sections: PageResponse['sections']): PageResponse => ({
  slug, seo: {}, ogImage: null, sections,
});

const home = page('home', [
  { id: 's1', key: 'hero', type: 'object', items: [node('title', 'text', { value: { pt: 'T' } })] },
  {
    id: 's2', key: 'about', type: 'object',
    items: [node('intro', 'list', { children: [node('item', 'inline'), node('item', 'inline', { isActive: false })] })],
  },
]);
const areas = page('areas', [
  {
    id: 's3', key: 'areaPages', type: 'list',
    items: [node('item', 'group', { children: [node('title', 'text'), node('signs', 'list', { children: [node('item', 'text')] })] })],
  },
]);
const site = page('site', [{ id: 's4', key: 'footer', type: 'object', items: [node('privacy', 'link', { linkUrl: '/p' })] }]);

describe('buildAdminIndex', () => {
  const index = buildAdminIndex([home, areas, site]);

  it('indexes items by the same paths the bundle uses', () => {
    expect(index.items['hero.title']?.node.id).toBe('id-title');
    expect(index.items['about.intro.1']?.node.isActive).toBe(false);
    expect(index.items['areaPages.0.title']?.pageSlug).toBe('areas');
    expect(index.items['areaPages.0.signs.0']?.node.kind).toBe('text');
  });

  it('keeps the section id so new items can be created', () => {
    expect(index.items['about.intro.0']?.sectionId).toBe('s2');
  });

  it('indexes list items including inactive ones, with their parent', () => {
    expect(index.lists['about.intro']).toMatchObject({ parentId: 'id-intro', sectionId: 's2', pageSlug: 'home' });
    expect(index.lists['about.intro']?.items).toHaveLength(2);
  });

  it('indexes list-type sections as lists without a parent item', () => {
    expect(index.lists['areaPages']).toMatchObject({ parentId: null, sectionId: 's3' });
    expect(index.lists['areaPages.0.signs']?.parentId).toBe('id-signs');
  });

  it('resolves link label and url paths to the link item', () => {
    expect(resolveItem(index, 'footer.privacy.label')?.node.id).toBe('id-privacy');
    expect(resolveItem(index, 'footer.privacy.url')?.node.kind).toBe('link');
    expect(resolveItem(index, 'hero.title.label')).toBeUndefined();
    expect(resolveItem(index, 'nope')).toBeUndefined();
  });
});
