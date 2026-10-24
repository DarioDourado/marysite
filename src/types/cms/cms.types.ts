import { z } from 'zod';

export const imageRefSchema = z.object({
  id: z.string(),
  url: z.string(),
  alt: z.string(),
  // Dimensões e versões por largura; podem faltar em imagens anteriores às variantes
  width: z.number().nullish(),
  height: z.number().nullish(),
  srcset: z.string().nullish(),
});
export type ImageRef = z.infer<typeof imageRefSchema>;

export const itemKindSchema = z.enum(['text', 'inline', 'richtext', 'image', 'link', 'list', 'group']);
export type ItemKind = z.infer<typeof itemKindSchema>;

export const itemNodeSchema = z.object({
  id: z.string(),
  key: z.string(),
  kind: itemKindSchema,
  position: z.number(),
  isActive: z.boolean(),
  version: z.number(),
  value: z.record(z.string(), z.string()).nullable(),
  image: imageRefSchema.nullable(),
  linkUrl: z.string().nullable(),
  get children() {
    return z.array(itemNodeSchema);
  },
});
export type ItemNode = z.infer<typeof itemNodeSchema>;

export const sectionNodeSchema = z.object({
  id: z.string(),
  key: z.string(),
  type: z.enum(['object', 'list']),
  items: z.array(itemNodeSchema),
});
export type SectionNode = z.infer<typeof sectionNodeSchema>;

export const pageResponseSchema = z.object({
  slug: z.string(),
  seo: z.record(z.string(), z.object({ title: z.string(), description: z.string() })),
  ogImage: imageRefSchema.nullable(),
  sections: z.array(sectionNodeSchema),
});
export type PageResponse = z.infer<typeof pageResponseSchema>;

export const cmsConfigSchema = z.object({
  i18n: z.boolean(),
  defaultLang: z.string(),
  locales: z.array(z.string()).min(1),
});
export type CmsConfig = z.infer<typeof cmsConfigSchema>;

export const PAGE_SLUGS = ['site', 'home', 'areas', 'blog'] as const;
export type PageSlug = (typeof PAGE_SLUGS)[number];

export interface ItemPatchInput {
  version: number;
  locale?: string;
  value?: string;
  imageId?: string | null;
  linkUrl?: string | null;
  isActive?: boolean;
}

export interface SeoInput {
  translations: Record<string, { title: string; description: string }>;
  ogImageId?: string | null;
}
