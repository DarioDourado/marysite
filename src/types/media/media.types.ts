import { z } from 'zod';

export const mediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  altText: z.string(),
  createdAt: z.string(),
});
export type Media = z.infer<typeof mediaSchema>;

export const mediaPageSchema = z.object({
  items: z.array(mediaSchema),
  nextCursor: z.string().nullable(),
});
export type MediaPage = z.infer<typeof mediaPageSchema>;

export const mediaReferencesSchema = z.object({
  errors: z.array(z.object({ page: z.string(), section: z.string(), item: z.string() })),
});
export type MediaReference = z.infer<typeof mediaReferencesSchema>['errors'][number];

export const ACCEPTED_IMAGE_TYPES = '.jpg,.jpeg,.png,.webp,.avif';
