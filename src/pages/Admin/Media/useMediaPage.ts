import { useDeferredValue, useState } from 'react';
import axios from 'axios';
import { useEditMode } from '@/src/components/cms/EditModeContext.ts';
import { useDeleteMedia, useGetMedia, useUploadMedia } from '@/src/hooks/media/index.ts';
import { mediaReferencesSchema, type Media, type MediaReference } from '@/src/types/media/index.ts';

export const useMediaPage = () => {
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Media | null>(null);
  const [references, setReferences] = useState<MediaReference[] | null>(null);
  const search = useDeferredValue(query.trim());
  const media = useGetMedia(search);
  const upload = useUploadMedia();
  const remove = useDeleteMedia();
  const { notify } = useEditMode();

  const confirmDelete = () => {
    if (!pendingDelete) return;
    remove.mutate(pendingDelete.id, {
      onSettled: () => setPendingDelete(null),
      onError: (error) => {
        // 409: a API devolve onde a imagem está em uso
        const parsed = axios.isAxiosError(error) ? mediaReferencesSchema.safeParse(error.response?.data) : null;
        if (parsed?.success) setReferences(parsed.data.errors);
        else notify('error', 'admin.error.generic');
      },
    });
  };

  return {
    query, setQuery, media, items: media.data?.pages.flatMap((p) => p.items) ?? [], upload,
    pendingDelete, setPendingDelete, confirmDelete, isDeleting: remove.isPending,
    references, clearReferences: () => setReferences(null),
  };
};
