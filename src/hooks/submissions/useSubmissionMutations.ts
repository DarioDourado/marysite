import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
import { cmsErrorKey } from '@/src/lib/cms/errorKey.ts';
import { submissionsTransporter } from '@/src/services/transporters/submissions/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';
import type { SubmissionStatus } from '@/src/types/submissions/index.ts';

function useSubmissionMutation<TInput>(fn: (input: TInput) => Promise<unknown>, successKey: string | null) {
  const queryClient = useQueryClient();
  const { notify } = useEditMode();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => successKey && notify('success', successKey),
    onError: (error) => notify('error', cmsErrorKey(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.submissions.all }),
  });
}

export const useSetSubmissionStatus = () =>
  useSubmissionMutation(({ id, status }: { id: string; status: SubmissionStatus }) => submissionsTransporter.setStatus(id, status), null);

export const useDeleteSubmission = () =>
  useSubmissionMutation((id: string) => submissionsTransporter.remove(id), 'admin.submissions.deleted');
