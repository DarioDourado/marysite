import { API_BASE_URL } from '@/src/services/http/publicApi.ts';
import { queryClient } from '@/src/lib/queryClient.ts';
import { createAuthClient } from './authClient.ts';

const SESSION_HINT = 'cms:session';

// Só dados privados: o conteúdo público fica em cache para o site não piscar ao sair
const clearPrivateData = () => {
  void queryClient.cancelQueries({ predicate: (q) => q.queryKey[1] !== 'public' });
  queryClient.removeQueries({ predicate: (q) => q.queryKey[0] !== 'cms' || q.queryKey[1] !== 'public' });
};

export const authClient = createAuthClient({ baseURL: API_BASE_URL, clearPrivateData });

// Sinal não secreto: visitantes anónimos nunca chamam /auth/session
authClient.subscribe(() => {
  try {
    if (authClient.getUser()) window.localStorage.setItem(SESSION_HINT, '1');
    else window.localStorage.removeItem(SESSION_HINT);
  } catch {
    // sem armazenamento: a sessão só não é restaurada após recarregar
  }
});

export const hasSessionHint = (): boolean => {
  try {
    return window.localStorage.getItem(SESSION_HINT) === '1';
  } catch {
    return false;
  }
};
