import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/src/components/admin/AdminShell.tsx';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog.tsx';
import { Modal } from '@/src/components/ui/Modal.tsx';
import { ACCEPTED_IMAGE_TYPES } from '@/src/types/media/index.ts';
import { MediaCard } from './MediaCard.tsx';
import { useMediaPage } from './useMediaPage.ts';

export const Media = () => {
  const { t } = useTranslation();
  const page = useMediaPage();
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <AdminShell title={t('admin.media.title')}>
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          value={page.query}
          aria-label={t('admin.media.search')}
          placeholder={t('admin.media.search')}
          onChange={(event) => page.setQuery(event.target.value)}
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
            if (file) page.upload.mutate(file);
            event.target.value = '';
          }}
        />
        <button type="button" disabled={page.upload.isPending} onClick={() => fileInput.current?.click()} className="px-5 py-2 btn-primary rounded-control disabled:opacity-60">
          {page.upload.isPending ? t('admin.common.loading') : t('admin.media.upload')}
        </button>
      </div>

      {page.media.isPending && <p className="text-text-light" role="status">{t('admin.common.loading')}</p>}
      {page.media.isError && <p role="alert" className="text-danger">{t('admin.error.generic')}</p>}
      {page.media.isSuccess && page.items.length === 0 && <p className="text-text-light">{t('admin.media.empty')}</p>}

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {page.items.map((item) => (
          <MediaCard key={`${item.id}-${item.url}`} media={item} onDelete={page.setPendingDelete} />
        ))}
      </ul>

      {page.media.hasNextPage && (
        <button type="button" disabled={page.media.isFetchingNextPage} onClick={() => void page.media.fetchNextPage()} className="mt-6 px-5 py-2 rounded-control border border-line">
          {t('admin.media.more')}
        </button>
      )}

      {page.pendingDelete && (
        <ConfirmDialog
          title={t('admin.media.deleteTitle')}
          message={t('admin.media.deleteMessage')}
          confirmLabel={t('admin.common.delete')}
          isPending={page.isDeleting}
          onCancel={() => page.setPendingDelete(null)}
          onConfirm={page.confirmDelete}
        />
      )}
      {page.references && (
        <Modal title={t('admin.error.mediaInUse')} onClose={page.clearReferences} className="max-w-md">
          <p className="text-text-light mb-2">{t('admin.media.usedIn')}</p>
          <ul className="list-disc pl-5 mb-6 text-foreground">
            {page.references.map((ref) => (
              <li key={`${ref.page}-${ref.section}-${ref.item}`}>{`${ref.page} / ${ref.section} / ${ref.item}`}</li>
            ))}
          </ul>
          <button type="button" onClick={page.clearReferences} className="px-5 py-2 btn-primary rounded-control">{t('admin.common.close')}</button>
        </Modal>
      )}
    </AdminShell>
  );
};
