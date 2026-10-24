import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useCreateUser, useUpdateUser } from '@/src/hooks/users/index.ts';
import { roleSchema } from '@/src/types/auth/index.ts';
import { PAGE_SLUGS } from '@/src/types/cms/index.ts';
import {
  ROLE_DEFAULTS, userFormSchema, type ManagedUser, type UserFormValues,
} from '@/src/types/users/index.ts';
import { PermissionMatrix } from './PermissionMatrix.tsx';

interface UserFormDialogProps {
  /** Sem utilizador cria um novo; com utilizador edita. */
  user?: ManagedUser;
  onClose: () => void;
}

const ALL_PAGES = [...PAGE_SLUGS];

export const UserFormDialog = ({ user, onClose }: UserFormDialogProps) => {
  const { t } = useTranslation();
  const create = useCreateUser();
  const update = useUpdateUser();
  const isEdit = user !== undefined;
  const { register, handleSubmit, watch, setValue, formState } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema(isEdit)),
    defaultValues: {
      email: user?.email ?? '',
      password: '',
      displayName: user?.displayName ?? '',
      role: user?.role ?? 'editor',
      isActive: user?.isActive ?? true,
      capabilities: user?.capabilities ?? [...ROLE_DEFAULTS.editor],
      pages: (user?.pages ?? ALL_PAGES) as UserFormValues['pages'],
    },
  });
  const role = watch('role');
  const isPending = create.isPending || update.isPending;

  const submit = handleSubmit((values) => {
    if (isPending) return;
    if (user) {
      const { displayName, role: nextRole, isActive, capabilities, pages } = values;
      update.mutate({ id: user.id, input: { displayName, role: nextRole, isActive, capabilities, pages } }, { onSuccess: onClose });
    } else {
      create.mutate(values, { onSuccess: onClose });
    }
  });

  const error = (field: 'email' | 'displayName' | 'password') => {
    const message = formState.errors[field]?.message;
    return message ? <p className="text-sm text-danger" role="alert">{t(message)}</p> : null;
  };

  return (
    <Modal title={isEdit ? user.email : t('admin.settings.newUser')} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        {!isEdit && (
          <div className="space-y-1">
            <label htmlFor="user-email" className="text-sm font-medium text-foreground">{t('admin.settings.email')}</label>
            <input id="user-email" type="email" autoComplete="off" className="w-full px-4 py-2 input bg-surface" {...register('email')} />
            {error('email')}
          </div>
        )}
        <div className="space-y-1">
          <label htmlFor="user-name" className="text-sm font-medium text-foreground">{t('admin.settings.displayName')}</label>
          <input id="user-name" className="w-full px-4 py-2 input bg-surface" {...register('displayName')} />
          {error('displayName')}
        </div>
        <div className="space-y-1">
          <label htmlFor="user-role" className="text-sm font-medium text-foreground">{t('admin.settings.role')}</label>
          <select
            id="user-role"
            className="w-full px-4 py-2 input bg-surface"
            {...register('role', {
              onChange: (event: { target: { value: string } }) => {
                const next = roleSchema.parse(event.target.value);
                if (!isEdit) setValue('capabilities', [...ROLE_DEFAULTS[next]]);
              },
            })}
          >
            {roleSchema.options.map((option) => (
              <option key={option} value={option}>{t(`admin.settings.roles.${option}`)}</option>
            ))}
          </select>
        </div>
        {!isEdit && (
          <div className="space-y-1">
            <label htmlFor="user-password" className="text-sm font-medium text-foreground">{t('admin.settings.password')}</label>
            <input id="user-password" type="password" autoComplete="new-password" className="w-full px-4 py-2 input bg-surface" {...register('password')} />
            {error('password')}
          </div>
        )}
        <PermissionMatrix
          capabilities={watch('capabilities')}
          pages={watch('pages')}
          disabled={role === 'superuser'}
          onChange={(next) => {
            setValue('capabilities', next.capabilities);
            setValue('pages', next.pages);
          }}
        />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 rounded-control border border-line text-foreground">{t('admin.common.cancel')}</button>
          <button type="submit" disabled={isPending} className="px-5 py-2 btn-primary rounded-control disabled:opacity-60">
            {isEdit ? t('admin.common.save') : t('admin.settings.create')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
