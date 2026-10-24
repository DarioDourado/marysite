import { useDeferredValue, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { useGetMedia, useUploadMedia } from '@/src/hooks/media/index.ts';
import { mediaUrl } from '@/src/lib/cms/mediaUrl.ts';
import { ACCEPTED_IMAGE_TYPES, type Media } from '@/src/types/media/index.ts';

interface MediaPickerProps {
  onSelect: (media: Media) => void;
  onClose: () => void;
}

/** Biblioteca de imagens: pesquisar, reutilizar uma existente ou enviar uma nova. */
export const MediaPicker = ({ onSelect, onClose }: MediaPickerProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query.trim());
  const media = useGetMedia(deferred);
  const upload = useUploadMedia();
  const fileInput = useRef<HTMLInputElement>(null);
  const items = media.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Modal title={t('admin.media.pick')} onClose={onClose} className="max-w-4xl">
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="search"
          value={query}
          aria-label={t('admin.media.search')}
          placeholder={t('admin.media.search')}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 min-w-[12rem] px-4 py-2 input bg-surface"
        />
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="sr-only"
          aria-label={t('admin.media.upload')}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) upload.mutate(file, { onSuccess: onSelect });
            event.target.value = '';
          }}
        />
        <button
          type="button"
          disabled={upload.isPending}
          onClick={() => fileInput.current?.click()}
          className="px-5 py-2 btn-primary rounded-control disabled:opacity-60"
        >
          {upload.isPending ? t('admin.common.loading') : t('admin.media.upload')}
        </button>
      </div>

      {media.isPending && <p className="text-text-light">{t('admin.common.loading')}</p>}
      {media.isError && <p role="alert" className="text-danger">{t('admin.error.generic')}</p>}
      {media.isSuccess && items.length === 0 && <p className="text-text-light">{t('admin.media.empty')}</p>}

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="block w-full text-left rounded-control border border-line overflow-hidden hover:border-primary-dark focus-visible:outline-2 focus-visible:outline-primary-dark"
            >
              <img src={mediaUrl(item.url)} alt={item.altText} loading="lazy" className="w-full aspect-square object-cover bg-muted" />
              <span className="block px-2 py-1 text-xs text-text-light truncate">{item.originalFilename}</span>
            </button>
          </li>
        ))}
      </ul>

      {media.hasNextPage && (
        <button
          type="button"
          disabled={media.isFetchingNextPage}
          onClick={() => void media.fetchNextPage()}
          className="mt-4 px-5 py-2 rounded-control border border-line text-foreground"
        >
          {t('admin.media.more')}
        </button>
      )}
    </Modal>
  );
};
