import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { describe, expect, it, vi } from 'vitest';
import i18n from '@/src/lib/i18n.ts';
import type { ManagedUser } from '@/src/types/users/index.ts';
import { UsersTable } from './UsersTable.tsx';

const managed = (over: Partial<ManagedUser>): ManagedUser => ({
  id: 'u', email: 'u@x.pt', displayName: 'U', role: 'editor', isActive: true, capabilities: ['text'], pages: ['home'], ...over,
});

const me = managed({ id: 'me', email: 'me@x.pt', displayName: 'Eu', role: 'admin' });
const other = managed({ id: 'other', email: 'other@x.pt', displayName: 'Outro' });

const setup = (props: Partial<Parameters<typeof UsersTable>[0]> = {}) => {
  const handlers = { onEdit: vi.fn(), onResetPassword: vi.fn(), onToggleActive: vi.fn(), onEditProfile: vi.fn() };
  void i18n.changeLanguage('pt');
  render(
    <I18nextProvider i18n={i18n}>
      <UsersTable users={[me, other]} currentUserId="me" restrictSelf={true} {...handlers} {...props} />
    </I18nextProvider>,
  );
  return handlers;
};

const row = (name: string) => screen.getByText(name).closest('tr') as HTMLElement;

describe('UsersTable', () => {
  it('gives an admin only a profile button on their own row', () => {
    setup();
    const own = within(row('Eu'));
    expect(own.getByRole('button', { name: 'O meu perfil' })).toBeInTheDocument();
    expect(own.queryByRole('button', { name: 'Repor palavra-passe' })).not.toBeInTheDocument();
    expect(own.queryByRole('button', { name: 'Desativar' })).not.toBeInTheDocument();
  });

  it('keeps the full actions on other rows', () => {
    setup();
    const others = within(row('Outro'));
    expect(others.getByRole('button', { name: 'Repor palavra-passe' })).toBeInTheDocument();
    expect(others.getByRole('button', { name: 'Desativar' })).toBeInTheDocument();
  });

  it('opens the profile from the own row', async () => {
    const handlers = setup();
    await userEvent.click(within(row('Eu')).getByRole('button', { name: 'O meu perfil' }));
    expect(handlers.onEditProfile).toHaveBeenCalledOnce();
  });

  it('keeps the full actions on every row when self is not restricted (superuser)', () => {
    setup({ restrictSelf: false });
    expect(within(row('Eu')).getByRole('button', { name: 'Repor palavra-passe' })).toBeInTheDocument();
    expect(within(row('Eu')).queryByRole('button', { name: 'O meu perfil' })).not.toBeInTheDocument();
  });
});
