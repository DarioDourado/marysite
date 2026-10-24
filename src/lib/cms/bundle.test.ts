import { describe, expect, it } from 'vitest';
import { buildBundle } from './bundle.ts';
import type { ItemKind, ItemNode, SectionNode } from '@/src/types/cms/index.ts';

const node = (key: string, kind: ItemKind, extra: Partial<ItemNode> = {}): ItemNode => ({
  id: `id-${key}`, key, kind, position: 0, isActive: true, version: 1,
  value: null, image: null, linkUrl: null, children: [], ...extra,
});
const text = (key: string, pt: string, en?: string, kind: ItemKind = 'text') =>
  node(key, kind, { value: en === undefined ? { pt } : { pt, en } });
const section = (key: string, items: ItemNode[], type: 'object' | 'list' = 'object'): SectionNode => ({
  id: `s-${key}`, key, type, items,
});

const opts = { locale: 'pt', fallbackLocale: 'pt' };

describe('buildBundle', () => {
  it('maps object sections to nested objects by key', () => {
    const { texts } = buildBundle([section('hero', [text('title', 'Olá')])], opts);
    expect(texts).toEqual({ hero: { title: 'Olá' } });
  });

  it('maps list items to arrays and keeps their order', () => {
    const list = node('intro', 'list', { children: [text('item', 'A'), text('item', 'B')] });
    expect(buildBundle([section('about', [list])], opts).texts).toEqual({ about: { intro: ['A', 'B'] } });
  });

  it('maps groups inside lists to arrays of objects', () => {
    const point = (t: string) => node('item', 'group', { children: [text('title', t), text('text', `${t}!`)] });
    const list = node('points', 'list', { children: [point('x'), point('y')] });
    expect(buildBundle([section('approach', [list])], opts).texts).toEqual({
      approach: { points: [{ title: 'x', text: 'x!' }, { title: 'y', text: 'y!' }] },
    });
  });

  it('maps list-type sections to a top-level array', () => {
    const area = node('item', 'group', { children: [text('slug', 'trauma')] });
    expect(buildBundle([section('areaPages', [area], 'list')], opts).texts).toEqual({
      areaPages: [{ slug: 'trauma' }],
    });
  });

  it('maps links to label and url', () => {
    const link = node('privacy', 'link', { value: { pt: 'Privacidade' }, linkUrl: '/privacidade' });
    expect(buildBundle([section('footer', [link])], opts).texts).toEqual({
      footer: { privacy: { label: 'Privacidade', url: '/privacidade' } },
    });
  });

  it('exposes images by path without putting them in texts', () => {
    const image = { id: 'm1', url: '/media/a.webp', alt: 'A' };
    const bundle = buildBundle([section('hero', [node('photo', 'image', { image })])], opts);
    expect(bundle.images).toEqual({ 'hero.photo': image });
    expect(bundle.texts).toEqual({ hero: {} });
  });

  it('uses the requested locale and falls back to the default one per value', () => {
    const items = [text('a', 'pt-a', 'en-a'), text('b', 'pt-b')];
    const bundle = buildBundle([section('s', items)], { locale: 'en', fallbackLocale: 'pt' });
    expect(bundle.texts).toEqual({ s: { a: 'en-a', b: 'pt-b' } });
  });

  it('records the kind of every path, including list indexes', () => {
    const list = node('intro', 'list', { children: [text('item', 'A', undefined, 'inline')] });
    const bundle = buildBundle([section('about', [list, text('title', 'T')])], opts);
    expect(bundle.kinds).toMatchObject({
      'about.intro': 'list', 'about.intro.0': 'inline', 'about.title': 'text',
    });
  });
});
