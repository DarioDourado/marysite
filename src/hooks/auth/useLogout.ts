import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth.ts';

export const useLogout = () => {
  const { client } = useAuth();
  return useMutation({ mutationFn: () => client.logout() });
};
