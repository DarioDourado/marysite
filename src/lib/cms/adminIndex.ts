import type { ItemNode, PageResponse, SectionNode } from '@/src/types/cms/index.ts';

export interface IndexedItem {
  node: ItemNode;
  pageSlug: string;
  sectionId: string;
}

export interface IndexedList {
  /** Itens da lista, incluindo inativos, pela ordem em que aparecem no site. */
  items: ItemNode[];
  pageSlug: string;
  sectionId: string;
  parentId: string | null;
}

export interface AdminIndex {
  items: Record<string, IndexedItem>;
  lists: Record<string, IndexedList>;
}

/** Mesmas regras de caminho do bundle: `about.intro.0`, `approach.points.1.title`. */
export function buildAdminIndex(pages: PageResponse[]): AdminIndex {
  const index: AdminIndex = { items: {}, lists: {} };

  const visit = (node: ItemNode, path: string, pageSlug: string, sectionId: string) => {
    index.items[path] = { node, pageSlug, sectionId };
    if (node.kind === 'list') {
      index.lists[path] = { items: node.children, pageSlug, sectionId, parentId: node.id };
      node.children.forEach((child, i) => visit(child, `${path}.${i}`, pageSlug, sectionId));
    } else if (node.kind === 'group') {
      node.children.forEach((child) => visit(child, `${path}.${child.key}`, pageSlug, sectionId));
    }
  };

  const visitSection = (section: SectionNode, pageSlug: string) => {
    if (section.type === 'list') {
      index.lists[section.key] = { items: section.items, pageSlug, sectionId: section.id, parentId: null };
      section.items.forEach((item, i) => visit(item, `${section.key}.${i}`, pageSlug, section.id));
    } else {
      section.items.forEach((item) => visit(item, `${section.key}.${item.key}`, pageSlug, section.id));
    }
  };

  for (const page of pages) page.sections.forEach((section) => visitSection(section, page.slug));
  return index;
}

/** `footer.privacy.label` e `.url` apontam para o item de ligação `footer.privacy`. */
export function resolveItem(index: AdminIndex, path: string): IndexedItem | undefined {
  const direct = index.items[path];
  if (direct) return direct;
  const parentPath = path.replace(/\.(label|url)$/, '');
  const parent = parentPath === path ? undefined : index.items[parentPath];
  return parent?.node.kind === 'link' ? parent : undefined;
}
