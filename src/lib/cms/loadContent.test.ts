import { AxiosError } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { loadCmsContent } from './loadContent.ts';
import { cmsTransporter } from '@/src/services/transporters/cms/cmsTransporter.ts';
import { PAGE_SLUGS, type PageResponse } from '@/src/types/cms/index.ts';

vi.mock('@/src/services/transporters/cms/cmsTransporter.ts', () => ({
  cmsTransporter: { getConfig: vi.fn(), getPage: vi.fn() },
}));

const config = { i18n: false, defaultLang: 'pt', locales: ['pt'] };
const page = (slug: string): PageResponse => ({ slug, seo: {}, ogImage: null, sections: [] });
const failure = (status?: number) =>
  new AxiosError('x', undefined, undefined, undefined, status ? ({ status } as never) : undefined);

describe('loadCmsContent', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.mocked(cmsTransporter.getConfig).mockResolvedValue(config);
    vi.mocked(cmsTransporter.getPage).mockImplementation((slug) => Promise.resolve(page(slug)));
  });

  it('loads config and every page', async () => {
    const content = await loadCmsContent();
    expect(content.config).toEqual(config);
    expect(Object.keys(content.pages)).toEqual([...PAGE_SLUGS]);
  });

  it('falls back to the last good copy on network failure', async () => {
    await loadCmsContent();
    vi.mocked(cmsTransporter.getConfig).mockRejectedValue(failure());
    const content = await loadCmsContent();
    expect(content.pages.home.slug).toBe('home');
  });

  it('falls back to the last good copy on a 5xx', async () => {
    await loadCmsContent();
    vi.mocked(cmsTransporter.getPage).mockRejectedValue(failure(503));
    await expect(loadCmsContent()).resolves.toBeTruthy();
  });

  it('does not hide configuration errors (4xx) behind the cache', async () => {
    await loadCmsContent();
    vi.mocked(cmsTransporter.getPage).mockRejectedValue(failure(404));
    await expect(loadCmsContent()).rejects.toBeTruthy();
  });

  it('does not hide malformed responses behind the cache', async () => {
    await loadCmsContent();
    vi.mocked(cmsTransporter.getConfig).mockRejectedValue(new Error('invalid shape'));
    await expect(loadCmsContent()).rejects.toThrow('invalid shape');
  });

  it('throws when the API is down and nothing was cached yet', async () => {
    vi.mocked(cmsTransporter.getConfig).mockRejectedValue(failure());
    await expect(loadCmsContent()).rejects.toBeTruthy();
  });
});
