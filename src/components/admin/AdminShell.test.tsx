import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import i18n from '@/src/lib/i18n.ts';
import type { AuthUser } from '@/src/types/auth/index.ts';
import { AdminShell } from './AdminShell.tsx';

const auth = vi.hoisted(() => ({ value: { user: null as AuthUser | null } }));
vi.mock('@/src/hooks/auth/index.ts', () => ({ useAuth: () => auth.value }));

const shellFor = (role: AuthUser['role']) => {
  auth.value = {
    user: { id: 'u', email: 'u@x.pt', displayName: 'U', role, capabilities: ['text', 'images'], pages: ['home'] },
  };
  void i18n.changeLanguage('pt');
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <AdminShell title="Teste">conteúdo</AdminShell>
      </MemoryRouter>
    </I18nextProvider>,
  );
};

describe('AdminShell menu', () => {
  it('shows Configurações to admin and superuser', () => {
    for (const role of ['admin', 'superuser'] as const) {
      shellFor(role);
      expect(screen.getByRole('link', { name: 'Configurações' })).toHaveAttribute('href', '/admin/settings');
      document.body.innerHTML = '';
    }
  });

  it('hides Configurações from editors', () => {
    shellFor('editor');
    expect(screen.queryByRole('link', { name: 'Configurações' })).not.toBeInTheDocument();
  });
});
