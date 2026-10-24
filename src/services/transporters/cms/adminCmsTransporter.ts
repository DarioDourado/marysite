import { authClient } from '@/src/lib/auth/session.ts';
import {
  itemNodeSchema,
  pageResponseSchema,
  type ItemNode,
  type ItemPatchInput,
  type PageResponse,
  type SeoInput,
} from '@/src/types/cms/index.ts';

// Validação no browser é só UX; a API volta a validar tudo e decide as permissões
export const adminCmsTransporter = {
  async getPage(slug: string): Promise<PageResponse> {
    const { data } = await authClient.api.get<unknown>(`/admin/pages/${slug}`);
    return pageResponseSchema.parse(data);
  },

  async patchItem(id: string, input: ItemPatchInput): Promise<ItemNode> {
    const { data } = await authClient.api.patch<unknown>(`/admin/content-items/${id}`, input);
    return itemNodeSchema.parse(data);
  },

  async createItem(sectionId: string, parentId: string | null): Promise<ItemNode> {
    const { data } = await authClient.api.post<unknown>('/admin/content-items', { sectionId, parentId });
    return itemNodeSchema.parse(data);
  },

  async deleteItem(id: string): Promise<void> {
    await authClient.api.delete(`/admin/content-items/${id}`);
  },

  async reorder(orderedIds: string[]): Promise<void> {
    await authClient.api.post('/admin/content-items/reorder', { orderedIds });
  },

  async updateSeo(slug: string, input: SeoInput): Promise<PageResponse> {
    const { data } = await authClient.api.put<unknown>(`/admin/pages/${slug}/seo`, input);
    return pageResponseSchema.parse(data);
  },
};
