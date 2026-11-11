import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { node, page, renderWithCms, section } from '@/src/test/harness.tsx';
import { Footer } from './Footer.tsx';

vi.mock('@/src/hooks/auth/index.ts', () => ({ useAuth: () => ({ isAuthenticated: false, user: null }) }));

const Where = () => <p data-testid="where">{useLocation().pathname}</p>;
const link = (key: string, label: string, url: string) => node(key, 'link', { value: { pt: label }, linkUrl: url });
const siteWith = (terms: string) =>
  page('site', [
    section('footer', [
      node('social', 'list'),
      node('links', 'list'),
      link('privacy', 'Política de Privacidade', '/privacidade'),
      link('terms', 'Termos e Condições', terms),
    ]),
  ]);

const renderFooter = (terms = '/termos') =>
  renderWithCms(
    <>
      <Footer />
      <Where />
    </>,
    { pages: [siteWith(terms)] },
  );

describe('Footer legal links', () => {
  it('navigate inside the app, without reloading the page (the session and edit mode survive)', async () => {
    renderFooter();
    expect(screen.getByTestId('where')).toHaveTextContent('/');
    await userEvent.click(screen.getByRole('link', { name: 'Política de Privacidade' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/privacidade');
    await userEvent.click(screen.getByRole('link', { name: 'Termos e Condições' }));
    expect(screen.getByTestId('where')).toHaveTextContent('/termos');
  });

  it('keep an external address as a plain link', () => {
    renderFooter('https://exemplo.pt/termos');
    expect(screen.getByRole('link', { name: 'Termos e Condições' })).toHaveAttribute('href', 'https://exemplo.pt/termos');
  });
});
