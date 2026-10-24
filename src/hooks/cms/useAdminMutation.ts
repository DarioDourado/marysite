import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
import { cmsErrorKey } from '@/src/lib/cms/errorKey.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';

/** Mutação de conteúdo: avisa sucesso/erro e recarrega o conteúdo de administração. */
export function useAdminMutation<TInput, TResult>(
  mutationFn: (input: TInput) => Promise<TResult>,
  successKey = 'admin.saved',
) {
  const queryClient = useQueryClient();
  const { notify } = useEditMode();
  return useMutation({
    mutationFn,
    onSuccess: () => notify('success', successKey),
    onError: (error) => notify('error', cmsErrorKey(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.cms.adminPages }),
  });
}
