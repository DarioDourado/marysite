import { buildBundle } from '../../src/lib/cms/bundle.ts';
import {
  cmsConfigSchema,
  PAGE_SLUGS,
  pageResponseSchema,
  type CmsConfig,
  type ImageRef,
  type PageResponse,
  type PageSlug,
} from '../../src/types/cms/index.ts';

export interface SeoContent {
  config: CmsConfig;
  pages: Record<PageSlug, PageResponse>;
  texts: Record<string, unknown>;
  images: Record<string, ImageRef>;
}

export type ContentLoader = () => Promise<SeoContent | null>;

const FRESH_MS = 60_000;
const STALE_MS = 10 * 60_000;
const TIMEOUT_MS = 3_000;

export const buildContent = (config: CmsConfig, pages: Record<PageSlug, PageResponse>): SeoContent => {
  const sections = PAGE_SLUGS.flatMap((slug) => pages[slug].sections);
  const { texts, images } = buildBundle(sections, { locale: config.defaultLang, fallbackLocale: config.defaultLang });
  return { config, pages, texts, images };
};

const getJson = async (url: string): Promise<unknown> => {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
};

/**
 * Lê o conteúdo público da API.
 * - Cache curta para não pesar na API a cada pedido; se a API falhar, usa a última cópia boa.
 * - Sem API configurada ou sem cópia devolve null: o servidor serve o HTML base, nunca falha.
 */
export const createContentLoader = (apiBase: string | undefined, now: () => number = Date.now): ContentLoader => {
  let cached: { at: number; content: SeoContent } | null = null;
  let inflight: Promise<SeoContent | null> | null = null;

  const refresh = async (): Promise<SeoContent | null> => {
    try {
      const base = `${apiBase}/api/v1/public`;
      const [config, ...pages] = await Promise.all([
        getJson(`${base}/config`),
        ...PAGE_SLUGS.map((slug) => getJson(`${base}/pages/${slug}`)),
      ]);
      const parsed = Object.fromEntries(
        PAGE_SLUGS.map((slug, i) => [slug, pageResponseSchema.parse(pages[i])]),
      ) as Record<PageSlug, PageResponse>;
      const content = buildContent(cmsConfigSchema.parse(config), parsed);
      cached = { at: now(), content };
      return content;
    } catch (error) {
      console.warn('[seo] conteúdo da API indisponível:', error instanceof Error ? error.message : error);
      return cached && now() - cached.at < STALE_MS ? cached.content : null;
    } finally {
      inflight = null;
    }
  };

  return async () => {
    if (!apiBase) return null;
    if (cached && now() - cached.at < FRESH_MS) return cached.content;
    inflight ??= refresh();
    return inflight;
  };
};

/** Lê `a.b.0.c` de um objeto aninhado (mesmo formato que `t('a.b.0.c')`). */
export const textAt = (texts: Record<string, unknown>, path: string): string => {
  let node: unknown = texts;
  for (const part of path.split('.')) {
    if (node === null || typeof node !== 'object') return '';
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === 'string' ? node : '';
};

export const listAt = (texts: Record<string, unknown>, path: string): unknown[] => {
  let node: unknown = texts;
  for (const part of path.split('.')) {
    if (node === null || typeof node !== 'object') return [];
    node = (node as Record<string, unknown>)[part];
  }
  return Array.isArray(node) ? node : [];
};
