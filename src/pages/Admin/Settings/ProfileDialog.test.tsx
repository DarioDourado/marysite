import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import i18n from '@/src/lib/i18n.ts';
import { usersTransporter } from '@/src/services/transporters/users/index.ts';
import type { AuthUser } from '@/src/types/auth/index.ts';
import { ProfileDialog } from './ProfileDialog.tsx';

const me: AuthUser = { id: 'me', email: 'me@x.pt', displayName: 'Maria', role: 'admin', capabilities: ['text'], pages: ['home'] };
const updateUser = vi.hoisted(() => vi.fn());
vi.mock('@/src/hooks/auth/index.ts', () => ({ useAuth: () => ({ user: me, client: { updateUser } }) }));
vi.mock('@/src/services/transporters/users/index.ts', () => ({
  usersTransporter: { updateProfile: vi.fn(), changePassword: vi.fn() },
}));

const open = (onClose = vi.fn()) => {
  void i18n.changeLanguage('pt');
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}>
      <I18nextProvider i18n={i18n}>
        <ProfileDialog onClose={onClose} />
      </I18nextProvider>
    </QueryClientProvider>,
  );
  return onClose;
};

describe('ProfileDialog', () => {
  beforeEach(() => {
    updateUser.mockReset();
    vi.mocked(usersTransporter.updateProfile).mockReset().mockResolvedValue({ ...me, displayName: 'Maria Silva' });
    vi.mocked(usersTransporter.changePassword).mockReset().mockResolvedValue(undefined);
  });

  it('starts with the current name', () => {
    open();
    expect(screen.getByLabelText('Nome')).toHaveValue('Maria');
  });

  it('saves the new name and refreshes the signed-in user', async () => {
    open();
    const name = screen.getByLabelText('Nome');
    await userEvent.clear(name);
    await userEvent.type(name, 'Maria Silva');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar nome' }));
    await waitFor(() => expect(usersTransporter.updateProfile).toHaveBeenCalledWith('Maria Silva'));
    await waitFor(() => expect(updateUser).toHaveBeenCalledWith({ ...me, displayName: 'Maria Silva' }));
  });

  it('does not save an empty name', async () => {
    open();
    await userEvent.clear(screen.getByLabelText('Nome'));
    await userEvent.click(screen.getByRole('button', { name: 'Guardar nome' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(usersTransporter.updateProfile).not.toHaveBeenCalled();
  });

  it('changes the password with the current and the new one', async () => {
    open();
    await userEvent.type(screen.getByLabelText('Palavra-passe atual'), 'current-password');
    await userEvent.type(screen.getByLabelText('Nova palavra-passe'), 'brand-new-password');
    await userEvent.click(screen.getByRole('button', { name: 'Alterar palavra-passe' }));
    await waitFor(() =>
      expect(usersTransporter.changePassword).toHaveBeenCalledWith('current-password', 'brand-new-password'),
    );
  });

  it('rejects a short new password before calling the server', async () => {
    open();
    await userEvent.type(screen.getByLabelText('Palavra-passe atual'), 'current-password');
    await userEvent.type(screen.getByLabelText('Nova palavra-passe'), 'short');
    await userEvent.click(screen.getByRole('button', { name: 'Alterar palavra-passe' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(usersTransporter.changePassword).not.toHaveBeenCalled();
  });
});
