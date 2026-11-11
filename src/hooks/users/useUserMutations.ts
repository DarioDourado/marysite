import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
import { useAuth } from '@/src/hooks/auth/index.ts';
import { cmsErrorKey } from '@/src/lib/cms/errorKey.ts';
import { usersTransporter } from '@/src/services/transporters/users/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';
import type { CreateUserForm, UpdateUserForm } from '@/src/types/users/index.ts';

function useUserMutation<TInput, TResult>(fn: (input: TInput) => Promise<TResult>, successKey: string) {
  const queryClient = useQueryClient();
  const { notify } = useEditMode();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => notify('success', successKey),
    onError: (error) => notify('error', cmsErrorKey(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
}

export const useCreateUser = () =>
  useUserMutation((input: CreateUserForm) => usersTransporter.create(input), 'admin.settings.created');

export const useUpdateUser = () =>
  useUserMutation(({ id, input }: { id: string; input: UpdateUserForm }) => usersTransporter.update(id, input), 'admin.saved');

export const useResetPassword = () =>
  useUserMutation(
    ({ id, password }: { id: string; password: string }) => usersTransporter.resetPassword(id, password),
    'admin.settings.passwordReset',
  );

/** O utilizador muda o seu nome; a sessão passa a mostrar o novo nome sem recarregar. */
export const useUpdateProfile = () => {
  const { client } = useAuth();
  const queryClient = useQueryClient();
  const { notify } = useEditMode();
  return useMutation({
    mutationFn: (displayName: string) => usersTransporter.updateProfile(displayName),
    onSuccess: (user) => {
      client.updateUser(user);
      notify('success', 'admin.settings.profileSaved');
    },
    onError: (error) => notify('error', cmsErrorKey(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};

export const useChangePassword = () =>
  useUserMutation(
    ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      usersTransporter.changePassword(currentPassword, newPassword),
    'admin.settings.passwordChanged',
  );
