import { createContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { AuthClient } from './authClient.ts';
import { hasSessionHint } from './session.ts';

export interface AuthContextValue {
  client: AuthClient;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ client, children }: { client: AuthClient; children: ReactNode }) {
  const [isLoading, setLoading] = useState(hasSessionHint());
  useEffect(() => {
    if (!hasSessionHint()) return;
    let active = true;
    // Falha de rede ao restaurar não bloqueia o site público: fica sem sessão
    client.restore().catch(() => undefined).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [client]);
  // Mantém o contexto reativo à sessão sem expor o cliente a re-renders desnecessários
  useSyncExternalStore(client.subscribe, client.getUser);
  return <AuthContext.Provider value={{ client, isLoading }}>{children}</AuthContext.Provider>;
}
