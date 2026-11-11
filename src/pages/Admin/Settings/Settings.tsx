import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/src/components/admin/AdminShell.tsx';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog.tsx';
import { useAuth } from '@/src/hooks/auth/index.ts';
import { useGetUsers, useUpdateUser } from '@/src/hooks/users/index.ts';
import type { ManagedUser, UpdateUserForm } from '@/src/types/users/index.ts';
import { ProfileDialog } from './ProfileDialog.tsx';
import { ResetPasswordDialog } from './ResetPasswordDialog.tsx';
import { UserFormDialog } from './UserFormDialog.tsx';
import { UsersTable } from './UsersTable.tsx';

type Dialog =
  | { kind: 'create' }
  | { kind: 'profile' }
  | { kind: 'edit'; user: ManagedUser }
  | { kind: 'password'; user: ManagedUser }
  | { kind: 'toggle'; user: ManagedUser };

export const Settings = () => {
  const { t } = useTranslation();
  const users = useGetUsers();
  const update = useUpdateUser();
  const { user: actor } = useAuth();
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const close = () => setDialog(null);

  const toggleActive = (user: ManagedUser) =>
    update.mutate(
      { id: user.id, input: { displayName: user.displayName, role: user.role, isActive: !user.isActive, capabilities: user.capabilities, pages: user.pages as UpdateUserForm['pages'] } },
      { onSettled: close },
    );

  return (
    <AdminShell title={t('admin.settings.title')}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-serif text-foreground">{t('admin.settings.users')}</h2>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => setDialog({ kind: 'profile' })} className="px-5 py-2 rounded-control border border-line text-foreground">
            {t('admin.settings.myProfile')}
          </button>
          <button type="button" onClick={() => setDialog({ kind: 'create' })} className="px-5 py-2 btn-primary rounded-control">
            {t('admin.settings.newUser')}
          </button>
        </div>
      </div>

      {users.isPending && <p role="status" className="text-text-light">{t('admin.common.loading')}</p>}
      {users.isError && <p role="alert" className="text-danger">{t('admin.error.generic')}</p>}
      {users.data && (
        <UsersTable
          users={users.data}
          onEdit={(user) => setDialog({ kind: 'edit', user })}
          onResetPassword={(user) => setDialog({ kind: 'password', user })}
          onToggleActive={(user) => setDialog({ kind: 'toggle', user })}
          currentUserId={actor?.id}
          restrictSelf={actor?.role === 'admin'}
          onEditProfile={() => setDialog({ kind: 'profile' })}
        />
      )}

      {dialog?.kind === 'create' && <UserFormDialog onClose={close} />}
      {dialog?.kind === 'profile' && <ProfileDialog onClose={close} />}
      {dialog?.kind === 'edit' && <UserFormDialog user={dialog.user} onClose={close} />}
      {dialog?.kind === 'password' && <ResetPasswordDialog user={dialog.user} onClose={close} />}
      {dialog?.kind === 'toggle' && (
        <ConfirmDialog
          title={dialog.user.isActive ? t('admin.settings.deactivate') : t('admin.settings.activate')}
          message={dialog.user.email}
          isPending={update.isPending}
          onCancel={close}
          onConfirm={() => toggleActive(dialog.user)}
        />
      )}
    </AdminShell>
  );
};
