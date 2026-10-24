import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/src/hooks/auth/index.ts';
import type { Capability } from '@/src/types/auth/index.ts';

interface RequireAuthProps {
  children: ReactNode;
  /** Exige o tipo de edição indicado, ou o role superuser. */
  capability?: Capability;
  superuserOnly?: boolean;
}

// Só UX: a API recusa sempre o que o utilizador não pode fazer
export const RequireAuth = ({ children, capability, superuserOnly = false }: RequireAuthProps) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen" />;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (superuserOnly && user.role !== 'superuser') return <Navigate to="/" replace />;
  if (capability && !user.capabilities.includes(capability)) return <Navigate to="/" replace />;
  return <>{children}</>;
};
