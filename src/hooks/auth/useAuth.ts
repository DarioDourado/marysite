import { useContext, useSyncExternalStore } from 'react';
import { AuthContext } from '@/src/lib/auth/AuthProvider.tsx';
import type { Capability } from '@/src/types/auth/index.ts';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider required');
  const user = useSyncExternalStore(context.client.subscribe, context.client.getUser);
  // Só decide o que mostrar; o servidor valida sempre cada escrita
  const can = (capability: Capability, page: string): boolean =>
    user !== null && user.capabilities.includes(capability) && user.pages.includes(page);
  return { client: context.client, isLoading: context.isLoading, user, isAuthenticated: user !== null, can };
};
