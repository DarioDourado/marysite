import { useInfiniteQuery } from '@tanstack/react-query';
import { mediaTransporter } from '@/src/services/transporters/media/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';

export const useGetMedia = (q: string) =>
  useInfiniteQuery({
    queryKey: queryKeys.media.list(q),
    queryFn: ({ pageParam }) => mediaTransporter.list(q, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
