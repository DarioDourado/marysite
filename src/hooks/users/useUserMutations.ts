import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
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
