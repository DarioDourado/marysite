import { useDeferredValue, useState } from 'react';
import { useDeleteSubmission, useGetSubmissions, useSetSubmissionStatus } from '@/src/hooks/submissions/index.ts';
import type { Submission, SubmissionKind, SubmissionStatus } from '@/src/types/submissions/index.ts';

export const useSubmissionsPage = () => {
  const [kind, setKind] = useState<SubmissionKind | ''>('');
  const [status, setStatus] = useState<SubmissionStatus | ''>('');
  const [query, setQuery] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Submission | null>(null);
  const q = useDeferredValue(query.trim());
  const submissions = useGetSubmissions({ kind, status, q });
  const setSubmissionStatus = useSetSubmissionStatus();
  const remove = useDeleteSubmission();

  const confirmDelete = () => {
    if (!pendingDelete) return;
    remove.mutate(pendingDelete.id, { onSettled: () => setPendingDelete(null) });
  };

  return {
    kind, setKind, status, setStatus, query, setQuery,
    submissions,
    items: submissions.data?.pages.flatMap((page) => page.items) ?? [],
    newCount: submissions.data?.pages[0]?.newCount ?? 0,
    hasFilters: Boolean(kind || status || q),
    changeStatus: (id: string, next: SubmissionStatus) => setSubmissionStatus.mutate({ id, status: next }),
    isChanging: setSubmissionStatus.isPending,
    pendingDelete, setPendingDelete, confirmDelete, isDeleting: remove.isPending,
  };
};
