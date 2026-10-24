import { useTranslation } from 'react-i18next';
import type { ManagedUser } from '@/src/types/users/index.ts';

interface UsersTableProps {
  users: ManagedUser[];
  onEdit: (user: ManagedUser) => void;
  onResetPassword: (user: ManagedUser) => void;
  onToggleActive: (user: ManagedUser) => void;
}

const actionClass = 'px-3 py-1 rounded-control border border-line text-sm text-foreground';

export const UsersTable = ({ users, onEdit, onResetPassword, onToggleActive }: UsersTableProps) => {
  const { t } = useTranslation();
  const list = (values: string[], prefix: string) =>
    values.length > 0 ? values.map((value) => t(`${prefix}.${value}`)).join(', ') : '—';

  return (
    <div className="overflow-x-auto bg-surface rounded-card border border-line">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{t('admin.settings.users')}</caption>
        <thead className="bg-muted text-text-light">
          <tr>
            <th scope="col" className="px-4 py-3">{t('admin.settings.displayName')}</th>
            <th scope="col" className="px-4 py-3">{t('admin.settings.role')}</th>
            <th scope="col" className="px-4 py-3">{t('admin.settings.capabilities')}</th>
            <th scope="col" className="px-4 py-3">{t('admin.settings.pages')}</th>
            <th scope="col" className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-line align-top">
              <td className="px-4 py-3">
                <span className="block font-medium text-foreground">{user.displayName}</span>
                <span className="block text-text-light">{user.email}</span>
                <span className={user.isActive ? 'text-primary-dark' : 'text-danger'}>
                  {user.isActive ? t('admin.settings.active') : t('admin.settings.inactive')}
                </span>
              </td>
              <td className="px-4 py-3">{t(`admin.settings.roles.${user.role}`)}</td>
              <td className="px-4 py-3">{user.role === 'superuser' ? t('admin.settings.superuserNote') : list(user.capabilities, 'admin.settings.capability')}</td>
              <td className="px-4 py-3">{user.role === 'superuser' ? '—' : list(user.pages, 'admin.settings.page')}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => onEdit(user)} className={actionClass}>{t('admin.edit.pencil')}</button>
                  <button type="button" onClick={() => onResetPassword(user)} className={actionClass}>{t('admin.settings.resetPassword')}</button>
                  <button type="button" onClick={() => onToggleActive(user)} className={actionClass}>
                    {user.isActive ? t('admin.settings.deactivate') : t('admin.settings.activate')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
