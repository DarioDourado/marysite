import { useTranslation } from 'react-i18next';
import { cn } from '@/src/lib/utils.ts';
import type { Submission, SubmissionStatus } from '@/src/types/submissions/index.ts';

interface SubmissionCardProps {
  submission: Submission;
  disabled: boolean;
  onStatus: (id: string, status: SubmissionStatus) => void;
  onDelete: (submission: Submission) => void;
}

const buttonClass = 'px-3 py-1 rounded-control border border-line text-sm disabled:opacity-50';

export const SubmissionCard = ({ submission, disabled, onStatus, onDelete }: SubmissionCardProps) => {
  const { t } = useTranslation();
  const isBooking = submission.kind === 'booking';
  const received = new Date(submission.createdAt + 'Z').toLocaleString('pt-PT', { dateStyle: 'medium', timeStyle: 'short' });

  return (
    <li className={cn('bg-surface rounded-card border p-5 space-y-4', submission.status === 'new' ? 'border-primary-dark' : 'border-line')}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-2 py-0.5 rounded-control bg-primary/40 text-primary-dark text-xs font-medium">
          {t(`admin.submissions.kinds.${submission.kind}`)}
        </span>
        <span className={cn('px-2 py-0.5 rounded-control text-xs font-medium', submission.status === 'new' ? 'bg-primary-dark text-on-primary' : 'bg-muted text-text-light')}>
          {t(`admin.submissions.statuses.${submission.status}`)}
        </span>
        <h2 className="text-lg font-serif font-normal text-foreground">{submission.name}</h2>
        <span className="ml-auto text-sm text-text-light">{t('admin.submissions.receivedAt')} {received}</span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
        <div>
          <dt className="text-text-light">{t('admin.login.email')}</dt>
          <dd><a href={`mailto:${submission.email}`} className="text-primary-dark hover:underline break-all">{submission.email}</a></dd>
        </div>
        {submission.phone && (
          <div>
            <dt className="text-text-light">{t('admin.submissions.phone')}</dt>
            <dd><a href={`tel:${submission.phone.replace(/\s/g, '')}`} className="text-primary-dark hover:underline">{submission.phone}</a></dd>
          </div>
        )}
        {submission.subject && (
          <div>
            <dt className="text-text-light">{t('admin.submissions.subject')}</dt>
            <dd className="text-foreground">{submission.subject}</dd>
          </div>
        )}
        {submission.schedule.length > 0 && (
          <div>
            <dt className="text-text-light">{t('admin.submissions.scheduleLabel')}</dt>
            <dd className="text-foreground">{submission.schedule.map((option) => t(`admin.submissions.schedule.${option}`)).join(' · ')}</dd>
          </div>
        )}
      </dl>

      <div>
        <p className="text-sm text-text-light">{isBooking ? t('admin.submissions.reason') : t('admin.submissions.message')}</p>
        <p className="text-foreground whitespace-pre-wrap break-words">{submission.message}</p>
      </div>
      {submission.scheduleDetails && (
        <div>
          <p className="text-sm text-text-light">{t('admin.submissions.details')}</p>
          <p className="text-foreground whitespace-pre-wrap break-words">{submission.scheduleDetails}</p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {submission.status === 'new' && (
          <button type="button" disabled={disabled} onClick={() => onStatus(submission.id, 'read')} className="px-3 py-1 rounded-control bg-primary-dark text-on-primary text-sm disabled:opacity-50">
            {t('admin.submissions.markRead')}
          </button>
        )}
        {submission.status === 'read' && (
          <>
            <button type="button" disabled={disabled} onClick={() => onStatus(submission.id, 'archived')} className={buttonClass}>{t('admin.submissions.archive')}</button>
            <button type="button" disabled={disabled} onClick={() => onStatus(submission.id, 'new')} className={buttonClass}>{t('admin.submissions.markNew')}</button>
          </>
        )}
        {submission.status === 'archived' && (
          <button type="button" disabled={disabled} onClick={() => onStatus(submission.id, 'read')} className={buttonClass}>{t('admin.submissions.reopen')}</button>
        )}
        <button type="button" onClick={() => onDelete(submission)} className="px-3 py-1 rounded-control bg-danger text-on-primary text-sm">
          {t('admin.common.delete')}
        </button>
        {submission.handledByName && submission.statusChangedAt && (
          <span className="ml-auto text-xs text-text-light">{t('admin.submissions.handledBy')} {submission.handledByName}</span>
        )}
      </div>
    </li>
  );
};
