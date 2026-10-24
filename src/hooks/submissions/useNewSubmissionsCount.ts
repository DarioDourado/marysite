import { useQuery } from '@tanstack/react-query';
import { submissionsTransporter } from '@/src/services/transporters/submissions/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';

/** Quantos pedidos ainda não foram vistos; só para quem pode vê-los. */
export const useNewSubmissionsCount = (enabled: boolean) =>
  useQuery({
    queryKey: queryKeys.submissions.count,
    queryFn: submissionsTransporter.newCount,
    enabled,
    refetchInterval: 60_000,
  });
