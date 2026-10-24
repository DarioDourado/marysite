import { authClient } from '@/src/lib/auth/session.ts';
import { mediaPageSchema, mediaSchema, type Media, type MediaPage } from '@/src/types/media/index.ts';

const PAGE_SIZE = 24;

export const mediaTransporter = {
  async list(q: string, cursor?: string): Promise<MediaPage> {
    const { data } = await authClient.api.get<unknown>('/admin/media', {
      params: { q: q || undefined, limit: PAGE_SIZE, cursor },
    });
    return mediaPageSchema.parse(data);
  },

  async upload(file: File): Promise<Media> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await authClient.api.post<unknown>('/admin/media', form);
    return mediaSchema.parse(data);
  },

  async replace(id: string, file: File): Promise<Media> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await authClient.api.put<unknown>(`/admin/media/${id}/file`, form);
    return mediaSchema.parse(data);
  },

  async updateAlt(id: string, altText: string): Promise<Media> {
    const { data } = await authClient.api.patch<unknown>(`/admin/media/${id}`, { altText });
    return mediaSchema.parse(data);
  },

  async remove(id: string): Promise<void> {
    await authClient.api.delete(`/admin/media/${id}`);
  },
};
