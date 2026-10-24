import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
import { cmsErrorKey } from '@/src/lib/cms/errorKey.ts';
import { mediaTransporter } from '@/src/services/transporters/media/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';

function useMediaMutation<TInput, TResult>(fn: (input: TInput) => Promise<TResult>, successKey: string) {
  const queryClient = useQueryClient();
  const { notify } = useEditMode();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => notify('success', successKey),
    onError: (error) => notify('error', cmsErrorKey(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.media.all }),
  });
}

export const useUploadMedia = () => useMediaMutation((file: File) => mediaTransporter.upload(file), 'admin.media.uploaded');

export const useReplaceMedia = () =>
  useMediaMutation(({ id, file }: { id: string; file: File }) => mediaTransporter.replace(id, file), 'admin.media.replaced');

export const useUpdateMediaAlt = () =>
  useMediaMutation(({ id, altText }: { id: string; altText: string }) => mediaTransporter.updateAlt(id, altText), 'admin.saved');

export const useDeleteMedia = () => useMediaMutation((id: string) => mediaTransporter.remove(id), 'admin.media.deleted');
