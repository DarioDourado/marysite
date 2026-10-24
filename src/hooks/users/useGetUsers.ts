import { useQuery } from '@tanstack/react-query';
import { usersTransporter } from '@/src/services/transporters/users/index.ts';
import { queryKeys } from '@/src/services/transporters/_queryKeys.ts';

export const useGetUsers = () => useQuery({ queryKey: queryKeys.users.all, queryFn: () => usersTransporter.list() });
