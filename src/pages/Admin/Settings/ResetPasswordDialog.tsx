import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useResetPassword } from '@/src/hooks/users/index.ts';
import { passwordResetSchema, type ManagedUser, type PasswordResetForm } from '@/src/types/users/index.ts';

export const ResetPasswordDialog = ({ user, onClose }: { user: ManagedUser; onClose: () => void }) => {
  const { t } = useTranslation();
  const reset = useResetPassword();
  const { register, handleSubmit, formState } = useForm<PasswordResetForm>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { password: '' },
  });
  const message = formState.errors.password?.message;
  return (
    <Modal title={`${t('admin.settings.resetPassword')}: ${user.email}`} onClose={onClose} className="max-w-md">
      <form
        noValidate
        onSubmit={handleSubmit(({ password }) => {
          if (!reset.isPending) reset.mutate({ id: user.id, password }, { onSuccess: onClose });
        })}
        className="space-y-4"
      >
        <label htmlFor="reset-password" className="text-sm font-medium text-foreground">{t('admin.settings.newPassword')}</label>
        <input id="reset-password" type="password" autoComplete="new-password" className="w-full px-4 py-2 input bg-surface" {...register('password')} />
        {message && <p role="alert" className="text-sm text-danger">{t(message)}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-control border border-line text-foreground">{t('admin.common.cancel')}</button>
          <button type="submit" disabled={reset.isPending} className="px-5 py-2 btn-primary rounded-control disabled:opacity-60">{t('admin.common.save')}</button>
        </div>
      </form>
    </Modal>
  );
};
