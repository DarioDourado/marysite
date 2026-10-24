import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReplaceMedia, useUpdateMediaAlt } from '@/src/hooks/media/index.ts';
import { mediaUrl } from '@/src/lib/cms/mediaUrl.ts';
import { ACCEPTED_IMAGE_TYPES, type Media } from '@/src/types/media/index.ts';

interface MediaCardProps {
  media: Media;
  onDelete: (media: Media) => void;
}

export const MediaCard = ({ media, onDelete }: MediaCardProps) => {
  const { t } = useTranslation();
  const [alt, setAlt] = useState(media.altText);
  const updateAlt = useUpdateMediaAlt();
  const replace = useReplaceMedia();
  const fileInput = useRef<HTMLInputElement>(null);
  const inputId = `alt-${media.id}`;

  return (
    <li className="bg-surface rounded-card border border-line overflow-hidden flex flex-col">
      <img src={mediaUrl(media.url)} alt={media.altText} loading="lazy" className="w-full aspect-square object-cover bg-muted" />
      <div className="p-3 space-y-2 flex-1">
        <p className="text-xs text-text-light truncate" title={media.originalFilename}>{media.originalFilename}</p>
        <label htmlFor={inputId} className="block text-xs text-text-light">{t('admin.media.altText')}</label>
        <div className="flex gap-2">
          <input id={inputId} value={alt} maxLength={255} onChange={(event) => setAlt(event.target.value)} className="flex-1 min-w-0 px-2 py-1 input bg-surface" />
          <button
            type="button"
            disabled={updateAlt.isPending || alt === media.altText}
            onClick={() => updateAlt.mutate({ id: media.id, altText: alt })}
            className="px-3 rounded-control bg-primary-dark text-on-primary text-sm disabled:opacity-50"
          >
            {t('admin.common.save')}
          </button>
        </div>
      </div>
      <div className="flex gap-2 p-3 pt-0">
        <input
          ref={fileInput}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="sr-only"
          aria-label={`${t('admin.media.replace')} ${media.originalFilename}`}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) replace.mutate({ id: media.id, file });
            event.target.value = '';
          }}
        />
        <button type="button" disabled={replace.isPending} onClick={() => fileInput.current?.click()} className="flex-1 px-3 py-1 rounded-control border border-line text-sm">
          {t('admin.media.replace')}
        </button>
        <button type="button" onClick={() => onDelete(media)} className="px-3 py-1 rounded-control bg-danger text-on-primary text-sm">
          {t('admin.common.delete')}
        </button>
      </div>
    </li>
  );
};
