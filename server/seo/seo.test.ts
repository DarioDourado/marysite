import { describe, expect, it, vi } from 'vitest';
import type { ItemNode, PageResponse, PageSlug, SectionNode } from '../../src/types/cms/index.ts';
import { buildContent, createContentLoader } from './content.ts';
import { createSeo } from './index.ts';
import { canonicalPath, canonicalRedirect, classify, publicRoutes } from './routes.ts';

const item = (key: string, value: string, kind: ItemNode['kind'] = 'text', children: ItemNode[] = []): ItemNode => ({
  id: key, key, kind, position: 0, isActive: true, version: 1, value: { pt: value }, image: null, linkUrl: null, children,
});
const image = (key: string, url: string): ItemNode => ({ ...item(key, ''), kind: 'image', value: null, image: { id: key, url, alt: '' } });
const section = (key: string, items: ItemNode[], type: SectionNode['type'] = 'object'): SectionNode => ({ id: key, key, type, items });
const page = (slug: PageSlug, title: string, description: string, sections: SectionNode[] = []): PageResponse => ({
  slug, seo: { pt: { title, description } }, ogImage: null, sections,
});

const pages: Record<PageSlug, PageResponse> = {
  site: page('site', 'Site', 'Descrição do site', [
    section('brand', [item('name', 'Mariline Bôto'), image('logo', '/media/logo.webp')]),
    section('nav', [item('home', 'Início'), item('areas', 'Áreas'), item('blog', 'Blog')]),
    section('contacts', [item('email', 'a@b.pt')]),
    section('whatsapp', [item('number', '351912345678')]),
    section('footer', [
      item('description', 'Apoio psicológico'),
      item('location', 'Online'),
      item('social', '', 'list', [
        { ...item('0', 'Instagram', 'link'), linkUrl: '#' },
        { ...item('1', 'LinkedIn', 'link'), linkUrl: 'https://linkedin.com/in/x' },
      ]),
    ]),
  ]),
  home: page('home', 'Título </script><b>"', 'Descrição & "aspas"', [
    section('hero', [item('title', 'Olá'), item('subtitle', 'Sub'), image('photo', '/media/foto.webp')]),
  ]),
  areas: page('areas', 'Áreas', 'Descrição das áreas', [
    section('areasPage', [item('title', 'Áreas de Intervenção')]),
    section('areaPages', [
      item('0', '', 'group', [item('slug', 'trauma'), item('title', 'Trauma'), item('summary', 'Resumo'), item('whatIs', 'O que é')]),
    ], 'list'),
  ]),
  blog: page('blog', 'Blog', 'Descrição do blog', [section('blog', [item('title', 'Blog')])]),
};

const content = buildContent({ i18n: false, defaultLang: 'pt', locales: ['pt'] }, pages);
const req = { protocol: 'https', get: (name: string) => (name === 'host' ? 'exemplo.pt' : undefined) } as never;
const template = '<!doctype html><html lang="pt"><head><title>x</title></head><body><div id="root"></div></body></html>';
const seo = createSeo({ siteUrl: 'https://exemplo.pt/', loader: async () => content });

describe('rotas', () => {
  it('classifica públicas, admin e desconhecidas', () => {
    const routes = publicRoutes({ indexBlog: false });
    expect(classify('/', routes).kind).toBe('public');
    expect(classify('/admin/login', routes).kind).toBe('admin');
    expect(classify('/nada', routes).kind).toBe('unknown');
  });

  it('só devolve redirecionamento quando há barra final', () => {
    expect(canonicalPath('/areas/')).toBe('/areas');
    expect(canonicalPath('/areas')).toBeNull();
    expect(canonicalPath('/')).toBeNull();
  });
});

describe('canonicalRedirect', () => {
  const site = 'https://exemplo.pt';
  it('junta barra final, www e http num único 301', () => {
    expect(canonicalRedirect('/areas/', '/areas/?utm=1', 'www.exemplo.pt', 'http', site, true)).toBe('https://exemplo.pt/areas?utm=1');
  });
  it('não redireciona pedidos já canónicos nem em localhost/desenvolvimento', () => {
    expect(canonicalRedirect('/areas', '/areas', 'exemplo.pt', 'https', site, true)).toBeNull();
    expect(canonicalRedirect('/areas', '/areas', 'localhost', 'http', site, true)).toBeNull();
    expect(canonicalRedirect('/areas', '/areas', 'www.exemplo.pt', 'http', site, false)).toBeNull();
    expect(canonicalRedirect('/areas', '/areas', 'www.exemplo.pt', 'http', undefined, true)).toBeNull();
  });
});

describe('robots.txt e sitemap.xml', () => {
  it('bloqueia a gestão e aponta para o sitemap', () => {
    const robots = seo.robots(req);
    expect(robots).toContain('Disallow: /admin/');
    expect(robots).toContain('Sitemap: https://exemplo.pt/sitemap.xml');
  });

  it('exclui o blog enquanto não for indexável', () => {
    expect(seo.sitemap(req)).not.toContain('/blog');
    expect(createSeo({ siteUrl: 'https://exemplo.pt', indexBlog: true, loader: async () => content }).sitemap(req)).toContain('https://exemplo.pt/blog');
  });
});

describe('render', () => {
  it('home: metadados, canonical, Open Graph e JSON-LD válido', async () => {
    const { html, status } = await seo.render(template, req, '/');
    expect(status).toBe(200);
    expect(html).toContain('<html lang="pt-PT"');
    expect(html).toContain('<link rel="canonical" href="https://exemplo.pt/">');
    expect(html).toContain('property="og:image" content="https://exemplo.pt/media/foto.webp"');
    expect(html).toContain('content="index, follow, max-image-preview:large"');
    expect(html).toContain('name="seo-indexable" content="/,/areas"');
    const json = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? '';
    const graph = (JSON.parse(json) as { '@graph': Array<{ '@type': string }> })['@graph'];
    expect(graph.map((n) => n['@type'])).toEqual(['ProfessionalService', 'Person', 'WebSite', 'WebPage']);
  });

  it('escapa HTML do CMS no título, na descrição e no JSON-LD', async () => {
    const { html } = await seo.render(template, req, '/');
    expect(html).toContain('<title>Título &lt;/script&gt;&lt;b&gt;&quot;</title>');
    expect(html).toContain('content="Descrição &amp; &quot;aspas&quot;"');
    expect(html.match(/<\/script>/g)).toHaveLength(1);
  });

  it('só usa dados reais: ignora ligações sociais "#" e normaliza o telefone', async () => {
    const { html } = await seo.render(template, req, '/');
    expect(html).toContain('"sameAs":["https://linkedin.com/in/x"]');
    expect(html).toContain('"telephone":"+351912345678"');
    expect(html).not.toContain('"url":"#"');
  });

  it('áreas: breadcrumb e um Service por área', async () => {
    const { html } = await seo.render(template, req, '/areas');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toContain('"@type":"Service"');
    expect(html).toContain('<link rel="canonical" href="https://exemplo.pt/areas">');
  });

  it('blog sem artigos fica noindex', async () => {
    const { html, status } = await seo.render(template, req, '/blog');
    expect(status).toBe(200);
    expect(html).toContain('content="noindex, follow"');
  });

  it('caminho desconhecido devolve 404 noindex e sem dados estruturados', async () => {
    const { html, status, robots } = await seo.render(template, req, '/nao-existe');
    expect(status).toBe(404);
    expect(robots).toBe('noindex, follow');
    expect(html).not.toContain('application/ld+json');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain('og:url');
  });

  it('rotas de gestão ficam noindex, nofollow', async () => {
    const { html, robots } = await seo.render(template, req, '/admin/media');
    expect(robots).toBe('noindex, nofollow');
    expect(html).toContain('content="noindex, nofollow"');
  });

  it('noscript com o conteúdo principal só em páginas públicas', async () => {
    const home = await seo.render(template, req, '/');
    expect(home.html).toMatch(/<noscript><main>[\s\S]*<h1>Olá<\/h1>/);
    expect((await seo.render(template, req, '/admin')).html).not.toContain('<noscript>');
  });

  it('sem conteúdo da API serve metadados por omissão em vez de falhar', async () => {
    const offline = createSeo({ siteUrl: 'https://exemplo.pt', loader: async () => null });
    const { html, status } = await offline.render(template, req, '/areas');
    expect(status).toBe(200);
    expect(html).toContain('<title>Mariline Bôto · Psicóloga Clínica</title>');
    expect(html).not.toContain('application/ld+json');
  });
});

describe('createContentLoader', () => {
  const body = (payload: unknown) => ({ ok: true, json: async () => payload }) as Response;
  const respond = (url: string) =>
    url.endsWith('/config') ? { i18n: false, defaultLang: 'pt', locales: ['pt'] } : pages[url.split('/').pop() as PageSlug];

  it('mantém a última cópia boa quando a API falha', async () => {
    let clock = 0;
    let down = false;
    vi.stubGlobal('fetch', vi.fn(async (url: string) => (down ? Promise.reject(new Error('offline')) : body(respond(url)))));
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const load = createContentLoader('http://api', () => clock);
    expect(await load()).not.toBeNull();
    down = true;
    clock = 120_000;
    expect(await load()).not.toBeNull();
    clock = 20 * 60_000;
    expect(await load()).toBeNull();
    vi.unstubAllGlobals();
  });

  it('sem API configurada devolve null', async () => {
    expect(await createContentLoader(undefined)()).toBeNull();
  });
});
