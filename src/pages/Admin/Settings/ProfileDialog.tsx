import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useAuth } from '@/src/hooks/auth/index.ts';
import { useChangePassword, useUpdateProfile } from '@/src/hooks/users/index.ts';
import {
  passwordChangeSchema, profileFormSchema, type PasswordChangeForm, type ProfileForm,
} from '@/src/types/users/index.ts';

/** O perfil de quem está com sessão: nome e password (a atual é pedida para a mudar). */
export const ProfileDialog = ({ onClose }: { onClose: () => void }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const profile = useForm<ProfileForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { displayName: user?.displayName ?? '' },
  });
  const password = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: { currentPassword: '', newPassword: '' },
  });

  const error = (message: string | undefined) =>
    message ? <p role="alert" className="text-sm text-danger">{t(message)}</p> : null;

  return (
    <Modal title={t('admin.settings.myProfile')} onClose={onClose} className="max-w-md">
      <div className="space-y-8">
        <form
          noValidate
          className="space-y-3"
          onSubmit={profile.handleSubmit(({ displayName }) => {
            if (!updateProfile.isPending) updateProfile.mutate(displayName);
          })}
        >
          {user && <p className="text-sm text-text-light">{user.email}</p>}
          <div className="space-y-1">
            <label htmlFor="profile-name" className="text-sm font-medium text-foreground">{t('admin.settings.displayName')}</label>
            <input id="profile-name" className="w-full px-4 py-2 input bg-surface" {...profile.register('displayName')} />
            {error(profile.formState.errors.displayName?.message)}
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={updateProfile.isPending} className="px-5 py-2 btn-primary rounded-control disabled:opacity-60">
              {t('admin.settings.saveName')}
            </button>
          </div>
        </form>

        <form
          noValidate
          className="space-y-3 border-t border-line pt-6"
          onSubmit={password.handleSubmit(({ currentPassword, newPassword }) => {
            if (changePassword.isPending) return;
            changePassword.mutate({ currentPassword, newPassword }, { onSuccess: () => password.reset() });
          })}
        >
          <h3 className="text-lg font-serif text-foreground">{t('admin.settings.passwordSection')}</h3>
          <div className="space-y-1">
            <label htmlFor="profile-current" className="text-sm font-medium text-foreground">{t('admin.settings.currentPassword')}</label>
            <input id="profile-current" type="password" autoComplete="current-password" className="w-full px-4 py-2 input bg-surface" {...password.register('currentPassword')} />
            {error(password.formState.errors.currentPassword?.message)}
          </div>
          <div className="space-y-1">
            <label htmlFor="profile-new" className="text-sm font-medium text-foreground">{t('admin.settings.newPassword')}</label>
            <input id="profile-new" type="password" autoComplete="new-password" className="w-full px-4 py-2 input bg-surface" {...password.register('newPassword')} />
            {error(password.formState.errors.newPassword?.message)}
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-control border border-line text-foreground">{t('admin.common.close')}</button>
            <button type="submit" disabled={changePassword.isPending} className="px-5 py-2 btn-primary rounded-control disabled:opacity-60">
              {t('admin.settings.changePassword')}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
