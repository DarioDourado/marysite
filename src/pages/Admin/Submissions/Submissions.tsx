import { useTranslation } from 'react-i18next';
import { AdminShell } from '@/src/components/admin/AdminShell.tsx';
import { ConfirmDialog } from '@/src/components/ui/ConfirmDialog.tsx';
import { SUBMISSION_KINDS, SUBMISSION_STATUSES, type SubmissionKind, type SubmissionStatus } from '@/src/types/submissions/index.ts';
import { SubmissionCard } from './SubmissionCard.tsx';
import { useSubmissionsPage } from './useSubmissionsPage.ts';

const selectClass = 'px-4 py-2 input bg-surface';

export const Submissions = () => {
  const { t } = useTranslation();
  const page = useSubmissionsPage();

  return (
    <AdminShell title={t('admin.submissions.title')}>
      <p className="text-text-light mb-6 max-w-3xl">{t('admin.submissions.intro')}</p>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          value={page.query}
          aria-label={t('admin.submissions.search')}
          placeholder={t('admin.submissions.search')}
          onChange={(event) => page.setQuery(event.target.value)}
          className="flex-1 min-w-[12rem] px-4 py-2 input bg-surface"
        />
        <select aria-label={t('admin.submissions.kind')} value={page.kind} onChange={(event) => page.setKind(event.target.value as SubmissionKind | '')} className={selectClass}>
          <option value="">{t('admin.submissions.kind')}: {t('admin.submissions.all')}</option>
          {SUBMISSION_KINDS.map((kind) => <option key={kind} value={kind}>{t(`admin.submissions.kinds.${kind}`)}</option>)}
        </select>
        <select aria-label={t('admin.submissions.status')} value={page.status} onChange={(event) => page.setStatus(event.target.value as SubmissionStatus | '')} className={selectClass}>
          <option value="">{t('admin.submissions.status')}: {t('admin.submissions.all')}</option>
          {SUBMISSION_STATUSES.map((status) => <option key={status} value={status}>{t(`admin.submissions.statuses.${status}`)}</option>)}
        </select>
      </div>
      {page.newCount > 0 && <p role="status" className="mb-4 text-sm text-primary-dark font-medium">{page.newCount} {t('admin.submissions.newCount')}</p>}

      {page.submissions.isPending && <p className="text-text-light" role="status">{t('admin.common.loading')}</p>}
      {page.submissions.isError && <p role="alert" className="text-danger">{t('admin.error.generic')}</p>}
      {page.submissions.isSuccess && page.items.length === 0 && (
        <p className="text-text-light">{page.hasFilters ? t('admin.submissions.emptyFiltered') : t('admin.submissions.empty')}</p>
      )}

      <ul className="space-y-4">
        {page.items.map((item) => (
          <SubmissionCard key={item.id} submission={item} disabled={page.isChanging} onStatus={page.changeStatus} onDelete={page.setPendingDelete} />
        ))}
      </ul>

      {page.submissions.hasNextPage && (
        <button type="button" disabled={page.submissions.isFetchingNextPage} onClick={() => void page.submissions.fetchNextPage()} className="mt-6 px-5 py-2 rounded-control border border-line">
          {t('admin.submissions.more')}
        </button>
      )}

      {page.pendingDelete && (
        <ConfirmDialog
          title={t('admin.submissions.deleteTitle')}
          message={t('admin.submissions.deleteMessage')}
          confirmLabel={t('admin.common.delete')}
          isPending={page.isDeleting}
          onCancel={() => page.setPendingDelete(null)}
          onConfirm={page.confirmDelete}
        />
      )}
    </AdminShell>
  );
};
