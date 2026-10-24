import { useMutation } from '@tanstack/react-query';
import { useAuth } from './useAuth.ts';
import type { LoginInput } from '@/src/types/auth/index.ts';

export const useLogin = () => {
  const { client } = useAuth();
  return useMutation({ mutationFn: (input: LoginInput) => client.login(input) });
};
