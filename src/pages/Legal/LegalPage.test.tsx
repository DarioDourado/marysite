import { screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'motion/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { page, renderWithCms, section, text } from '@/src/test/harness.tsx';
import { LegalPage } from './LegalPage.tsx';

// O jsdom não tem IntersectionObserver, que o FadeIn usa para o efeito ao fazer scroll
beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() { return []; }
  });
});

const privacy = page('privacy', [
  section('privacy', [
    text('title', 'Política de Privacidade'),
    text('updated', 'Última atualização: 11 de novembro de 2026'),
    text('intro', 'Explico que <strong>dados</strong> recolho', 'inline'),
    text('body', '<h2>1. Responsável</h2><p>Mariline Bôto</p><script>window.hacked = 1</script>', 'richtext'),
  ]),
]);

const renderLegal = (slug: 'privacy' | 'terms', pages = [privacy]) =>
  renderWithCms(
    <LazyMotion features={domAnimation} strict>
      <LegalPage slug={slug} />
    </LazyMotion>,
    { pages },
  );

describe('LegalPage', () => {
  it('shows the title as the page heading, the update date and the intro', () => {
    renderLegal('privacy');
    expect(screen.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeInTheDocument();
    expect(screen.getByText('Última atualização: 11 de novembro de 2026')).toBeInTheDocument();
    expect(screen.getByText('dados').tagName).toBe('STRONG');
  });

  it('renders the CMS body as HTML and strips anything the sanitizer does not allow', () => {
    const { container } = renderLegal('privacy');
    expect(screen.getByRole('heading', { level: 2, name: '1. Responsável' })).toBeInTheDocument();
    expect(screen.getByText('Mariline Bôto')).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
  });

  it('reads the keys of the slug it receives', () => {
    const terms = page('terms', [section('terms', [
      text('title', 'Termos e Condições'), text('updated', 'x'), text('intro', 'y', 'inline'), text('body', '<h2>1. Âmbito</h2>', 'richtext'),
    ])]);
    renderLegal('terms', [terms]);
    expect(screen.getByRole('heading', { level: 1, name: 'Termos e Condições' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '1. Âmbito' })).toBeInTheDocument();
  });
});
