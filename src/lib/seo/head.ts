// Metadados do <head> mantidos em sincronia durante a navegação (o servidor trata do primeiro pedido).

export const setMeta = (attribute: 'name' | 'property', key: string, content: string): void => {
  let meta = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

export const setCanonical = (pathname: string): string => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  // - o domínio vem do canonical do servidor (SITE_URL), não do host em que o site foi aberto
  const origin = link.href ? new URL(link.href).origin : window.location.origin;
  link.href = `${origin}${pathname === '/' ? '/' : pathname.replace(/\/+$/, '')}`;
  return link.href;
};

export const ROBOTS_NOINDEX = 'noindex, nofollow';
const ROBOTS_INDEX = 'index, follow, max-image-preview:large';

/** Caminhos indexáveis anunciados pelo servidor (`<meta name="seo-indexable">`). */
const indexablePaths = (): string[] | null => {
  const content = document.querySelector<HTMLMetaElement>('meta[name="seo-indexable"]')?.content;
  return content ? content.split(',') : null;
};

export const setRobotsFor = (pathname: string): void => {
  const paths = indexablePaths();
  if (!paths) return;
  setMeta('name', 'robots', paths.includes(pathname) ? ROBOTS_INDEX : 'noindex, follow');
};

export const setNoindex = (title: string): void => {
  document.title = title;
  setMeta('name', 'robots', ROBOTS_NOINDEX);
};

export const htmlLangFor = (language: string): string => (language === 'pt' ? 'pt-PT' : language);
