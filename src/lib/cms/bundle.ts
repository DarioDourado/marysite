import type { ImageRef, ItemKind, ItemNode, SectionNode } from '@/src/types/cms/index.ts';

export interface CmsBundle {
  /** Mesmo formato dos recursos do i18next: `t('hero.title')`. */
  texts: Record<string, unknown>;
  /** Imagens por caminho (`hero.background`). */
  images: Record<string, ImageRef>;
  /** Tipo de cada caminho, para decidir como renderizar. */
  kinds: Record<string, ItemKind>;
}

const TEXT_KINDS: ItemKind[] = ['text', 'inline', 'richtext'];

interface BuildOptions {
  locale: string;
  /** Idioma usado quando falta a tradução, para os arrays nunca ficarem com buracos. */
  fallbackLocale: string;
}

export function buildBundle(sections: SectionNode[], { locale, fallbackLocale }: BuildOptions): CmsBundle {
  const images: Record<string, ImageRef> = {};
  const kinds: Record<string, ItemKind> = {};

  const textFor = (node: ItemNode): string =>
    node.value?.[locale] ?? node.value?.[fallbackLocale] ?? '';

  const convert = (node: ItemNode, path: string): unknown => {
    kinds[path] = node.kind;
    if (TEXT_KINDS.includes(node.kind)) return textFor(node);
    if (node.kind === 'link') return { label: textFor(node), url: node.linkUrl ?? '' };
    if (node.kind === 'image') {
      if (node.image) images[path] = node.image;
      return undefined;
    }
    if (node.kind === 'list') {
      return node.children.map((child, index) => convert(child, `${path}.${index}`));
    }
    return convertGroup(node.children, path);
  };

  const convertGroup = (children: ItemNode[], path: string): Record<string, unknown> => {
    const result: Record<string, unknown> = {};
    for (const child of children) {
      const value = convert(child, `${path}.${child.key}`);
      if (value !== undefined) result[child.key] = value;
    }
    return result;
  };

  const texts: Record<string, unknown> = {};
  for (const section of sections) {
    texts[section.key] =
      section.type === 'list'
        ? section.items.map((item, index) => convert(item, `${section.key}.${index}`))
        : convertGroup(section.items, section.key);
  }
  return { texts, images, kinds };
}
