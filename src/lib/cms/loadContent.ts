import axios from 'axios';
import { z } from 'zod';
import { cmsTransporter } from '@/src/services/transporters/cms/cmsTransporter.ts';
import {
  cmsConfigSchema,
  PAGE_SLUGS,
  pageResponseSchema,
  type CmsConfig,
  type PageResponse,
  type PageSlug,
} from '@/src/types/cms/index.ts';

export interface CmsContent {
  config: CmsConfig;
  pages: Record<PageSlug, PageResponse>;
}

const CACHE_KEY = 'cms:content:v1';

const cacheSchema = z.object({
  config: cmsConfigSchema,
  pages: z.object({
    site: pageResponseSchema,
    home: pageResponseSchema,
    areas: pageResponseSchema,
    blog: pageResponseSchema,
  }),
});

// Só falhas transitórias (rede, timeout, 5xx) usam a cópia guardada; um 4xx ou uma resposta
// inválida é erro de configuração e não deve ser escondido.
export const isTransientError = (error: unknown): boolean =>
  axios.isAxiosError(error) && (!error.response || error.response.status >= 500);

const readCache = (): CmsContent | null => {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    return raw ? cacheSchema.parse(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
};

const writeCache = (content: CmsContent): void => {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(content));
  } catch {
    // Sem armazenamento disponível: o site funciona na mesma, só sem cópia de segurança
  }
};

export async function loadCmsContent(): Promise<CmsContent> {
  try {
    const [config, ...pages] = await Promise.all([
      cmsTransporter.getConfig(),
      ...PAGE_SLUGS.map((slug) => cmsTransporter.getPage(slug)),
    ]);
    const content: CmsContent = {
      config,
      pages: Object.fromEntries(PAGE_SLUGS.map((slug, i) => [slug, pages[i]])) as CmsContent['pages'],
    };
    writeCache(content);
    return content;
  } catch (error) {
    const cached = isTransientError(error) ? readCache() : null;
    if (cached) return cached;
    throw error;
  }
}
