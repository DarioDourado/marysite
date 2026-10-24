import { publicApi } from '@/src/services/http/publicApi.ts';
import {
  cmsConfigSchema,
  pageResponseSchema,
  type CmsConfig,
  type PageResponse,
} from '@/src/types/cms/index.ts';

export const cmsTransporter = {
  async getConfig(): Promise<CmsConfig> {
    const { data } = await publicApi.get<unknown>('/public/config');
    return cmsConfigSchema.parse(data);
  },

  async getPage(slug: string): Promise<PageResponse> {
    const { data } = await publicApi.get<unknown>(`/public/pages/${slug}`);
    return pageResponseSchema.parse(data);
  },
};
