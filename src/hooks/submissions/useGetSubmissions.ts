import { useInfiniteQuery } from '@tanstack/react-query';
import { submissionsTransporter } from '@/src/services/transporters/submissions/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';
import type { SubmissionFilters } from '@/src/types/submissions/index.ts';

export const useGetSubmissions = (filters: SubmissionFilters) =>
  useInfiniteQuery({
    queryKey: queryKeys.submissions.list(filters.kind, filters.status, filters.q),
    queryFn: ({ pageParam }) => submissionsTransporter.list(filters, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
