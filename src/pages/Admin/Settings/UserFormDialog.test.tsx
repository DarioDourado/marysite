import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import i18n from '@/src/lib/i18n.ts';
import type { AuthUser } from '@/src/types/auth/index.ts';
import { UserFormDialog } from './UserFormDialog.tsx';

const auth = vi.hoisted(() => ({ value: { user: null as AuthUser | null } }));
vi.mock('@/src/hooks/auth/index.ts', () => ({ useAuth: () => auth.value }));
vi.mock('@/src/services/transporters/users/index.ts', () => ({ usersTransporter: {} }));

const actor = (over: Partial<AuthUser>): AuthUser => ({
  id: 'a', email: 'a@x.pt', displayName: 'A', role: 'admin', capabilities: ['text', 'images', 'structure'], pages: ['site', 'home', 'areas', 'blog', 'privacy', 'terms'], ...over,
});

const open = (user: AuthUser) => {
  auth.value = { user };
  void i18n.changeLanguage('pt');
  render(
    <QueryClientProvider client={new QueryClient()}>
      <I18nextProvider i18n={i18n}>
        <UserFormDialog onClose={() => undefined} />
      </I18nextProvider>
    </QueryClientProvider>,
  );
};

const roleOptions = () => within(screen.getByLabelText('Função')).getAllByRole('option').map((option) => option.textContent);

describe('UserFormDialog as an admin', () => {
  it('only offers the roles an admin may create', () => {
    open(actor({ role: 'admin' }));
    expect(roleOptions()).toEqual(['Admin', 'Editor']);
  });

  it('offers every role to a superuser', () => {
    open(actor({ role: 'superuser' }));
    expect(roleOptions()).toEqual(['Admin', 'Superuser', 'Editor']);
  });

  it('limits the defaults and the choices to what the admin has', () => {
    open(actor({ role: 'admin', capabilities: ['text'], pages: ['home'] }));
    expect(screen.getByRole('checkbox', { name: 'Texto' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Imagens' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Início' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Blog' })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Blog' })).not.toBeChecked();
  });

  it('does not limit anything for a superuser', () => {
    open(actor({ role: 'superuser', capabilities: [], pages: [] }));
    expect(screen.getByRole('checkbox', { name: 'Imagens' })).toBeEnabled();
    expect(screen.getByRole('checkbox', { name: 'Blog' })).toBeEnabled();
  });
});
