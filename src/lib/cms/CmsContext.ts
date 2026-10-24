import { createContext } from 'react';
import type { ImageRef, ItemKind, PageResponse, PageSlug, CmsConfig } from '@/src/types/cms/index.ts';

export interface CmsContextValue {
  config: CmsConfig;
  pages: Record<PageSlug, PageResponse>;
  images: Record<string, ImageRef>;
  kinds: Record<string, ItemKind>;
}

export const CmsContext = createContext<CmsContextValue | null>(null);
