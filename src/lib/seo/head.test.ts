import { beforeEach, describe, expect, it } from 'vitest';
import { setCanonical, setNoindex, setRobotsFor } from './head.ts';

const robots = () => document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content;

describe('head', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('canonical mantém o domínio definido pelo servidor e tira a barra final', () => {
    document.head.innerHTML = '<link rel="canonical" href="https://exemplo.pt/">';
    expect(setCanonical('/areas/')).toBe('https://exemplo.pt/areas');
    expect(setCanonical('/')).toBe('https://exemplo.pt/');
  });

  it('robots segue a lista de caminhos indexáveis anunciada pelo servidor', () => {
    document.head.innerHTML = '<meta name="seo-indexable" content="/,/areas">';
    setRobotsFor('/areas');
    expect(robots()).toBe('index, follow, max-image-preview:large');
    setRobotsFor('/blog');
    expect(robots()).toBe('noindex, follow');
  });

  it('sem lista do servidor não toca nos robots', () => {
    setRobotsFor('/areas');
    expect(robots()).toBeUndefined();
  });

  it('páginas sem valor para pesquisa ficam noindex, nofollow e com título próprio', () => {
    setNoindex('Entrar');
    expect(document.title).toBe('Entrar');
    expect(robots()).toBe('noindex, nofollow');
  });
});
